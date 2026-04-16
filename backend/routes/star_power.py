# Star Power Index query endpoints (no persistence)
from flask import Blueprint, jsonify, request
from flasgger import swag_from
from db import get_db_connection
from swagger_specs import STAR_POWER

star_power_bp = Blueprint("star_power", __name__, url_prefix="/api/star-power")

# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

_CTE = """
WITH ActorMovies AS (
    SELECT
        a.NodeID                            AS ActorNodeID,
        a.ActorID,
        a.Name                              AS ActorName,
        a.PhotoURL                          AS ActorPhotoURL,
        m.NodeID                            AS MovieNodeID,
        m.Title,
        CAST(m.Rating AS DECIMAL(4, 1))     AS NumericRating,
        e.EdgeID                            AS ActedInEdgeID
    FROM Actor a
    JOIN Edges e
        ON  e.SourceNodeID = a.NodeID
        AND e.EdgeType     = 'ACTED_IN'
    JOIN Movie m
        ON  m.NodeID = e.TargetNodeID
    WHERE m.Rating IS NOT NULL AND m.Rating != ''
      {actor_filter}
),
RankedMovies AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY ActorNodeID
            ORDER BY NumericRating DESC
        ) AS MovieRank
    FROM ActorMovies
),
ContributingMovies AS (
    -- A film at rank r contributes to SPI if rating >= r (h-index definition)
    SELECT * FROM RankedMovies WHERE NumericRating >= MovieRank
),
QualifyingActors AS (
    SELECT
        ActorNodeID, ActorID, ActorName,
        COUNT(*) AS StarPowerIndex
    FROM ContributingMovies
    GROUP BY ActorNodeID, ActorID, ActorName
    HAVING COUNT(*) >= %(threshold)s
)
SELECT
    qa.ActorNodeID, qa.ActorID, qa.ActorName, qa.StarPowerIndex,
    cm.MovieNodeID, cm.Title, cm.NumericRating, cm.ActedInEdgeID
FROM QualifyingActors qa
JOIN ContributingMovies cm ON cm.ActorNodeID = qa.ActorNodeID
ORDER BY qa.StarPowerIndex DESC, cm.NumericRating DESC
"""

_DIRECTOR_SQL = """
SELECT
    d.NodeID       AS DirectorNodeID,
    d.Name         AS DirectorName,
    d.PhotoURL     AS DirectorPhotoURL,
    e.TargetNodeID AS MovieNodeID,
    e.EdgeID       AS DirectedEdgeID
FROM Edges e
JOIN Director d ON d.NodeID = e.SourceNodeID
WHERE e.EdgeType = 'DIRECTED'
  AND e.TargetNodeID IN %(movie_ids)s
"""


def _build_response(rows, director_rows, threshold):
    """Convert raw DB rows into the unified star-power response shape."""
    actors_map = {}   # ActorNodeID -> actor dict
    movies_map = {}   # MovieNodeID -> movie dict (with actorNodeIds list)
    edges = []

    for r in rows:
        anid = r["ActorNodeID"]
        mnid = r["MovieNodeID"]

        if anid not in actors_map:
            actors_map[anid] = {
                "NodeID": anid,
                "ActorID": r["ActorID"],
                "Name": r["ActorName"],
                "StarPowerIndex": r["StarPowerIndex"],
                "PhotoURL": r.get("ActorPhotoURL"),
            }

        if mnid not in movies_map:
            movies_map[mnid] = {
                "NodeID": mnid,
                "Title": r["Title"],
                "Rating": str(r["NumericRating"]),
                "actorNodeIds": [],
            }
        if anid not in movies_map[mnid]["actorNodeIds"]:
            movies_map[mnid]["actorNodeIds"].append(anid)

        edges.append({
            "edgeId": r["ActedInEdgeID"],
            "source": anid,
            "target": mnid,
            "type": "ACTED_IN",
        })

    directors_map = {}  # DirectorNodeID -> director dict (with movieNodeIds list)
    for dr in director_rows:
        dnid = dr["DirectorNodeID"]
        mnid = dr["MovieNodeID"]

        if dnid not in directors_map:
            directors_map[dnid] = {
                "NodeID": dnid,
                "Name": dr["DirectorName"],
                "PhotoURL": dr.get("DirectorPhotoURL"),
                "movieNodeIds": [],
            }
        if mnid not in directors_map[dnid]["movieNodeIds"]:
            directors_map[dnid]["movieNodeIds"].append(mnid)

        edges.append({
            "edgeId": dr["DirectedEdgeID"],
            "source": dnid,
            "target": mnid,
            "type": "DIRECTED",
        })

    return {
        "threshold": threshold,
        "actors": list(actors_map.values()),
        "movies": list(movies_map.values()),
        "directors": list(directors_map.values()),
        "edges": edges,
    }


def _run_query(cursor, actor_filter_sql, params, movie_ids):
    sql = _CTE.format(actor_filter=actor_filter_sql)
    cursor.execute(sql, params)
    rows = cursor.fetchall()

    director_rows = []
    if movie_ids:
        cursor.execute(_DIRECTOR_SQL, {"movie_ids": tuple(movie_ids)})
        director_rows = cursor.fetchall()

    return rows, director_rows


# ---------------------------------------------------------------------------
# GET /api/star-power/all?threshold=<h>
# ---------------------------------------------------------------------------

@star_power_bp.get("/all")
@swag_from(STAR_POWER["get_all"])
def get_all_star_power():
    """Return all actors whose Star Power Index meets the threshold."""
    try:
        threshold = int(request.args.get("threshold", 1))
    except ValueError:
        return jsonify({"error": "threshold must be an integer"}), 400

    if threshold < 1 or threshold > 10:
        return jsonify({"error": "threshold must be between 1 and 10"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            rows, _ = _run_query(cursor, "", {"threshold": threshold}, [])
            movie_ids = list({r["MovieNodeID"] for r in rows})
            if movie_ids:
                cursor.execute(_DIRECTOR_SQL, {"movie_ids": tuple(movie_ids)})
                director_rows = cursor.fetchall()
            else:
                director_rows = []

        return jsonify(_build_response(rows, director_rows, threshold))
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# GET /api/star-power/?actor_id=<ActorID>&threshold=<h>
# ---------------------------------------------------------------------------

@star_power_bp.get("/")
@swag_from(STAR_POWER["get_actor"])
def get_actor_star_power():
    """Return the Star Power Index data for a single actor."""
    actor_id = request.args.get("actor_id")
    if not actor_id:
        return jsonify({"error": "Missing actor_id parameter"}), 400

    try:
        threshold = int(request.args.get("threshold", 1))
    except ValueError:
        return jsonify({"error": "threshold must be an integer"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Actor WHERE ActorID = %s", (actor_id,))
            actor = cursor.fetchone()
            if not actor:
                return jsonify({"error": "Actor not found"}), 404

            rows, _ = _run_query(
                cursor,
                "AND a.ActorID = %(actor_id)s",
                {"threshold": threshold, "actor_id": actor_id},
                [],
            )
            movie_ids = list({r["MovieNodeID"] for r in rows})
            if movie_ids:
                cursor.execute(_DIRECTOR_SQL, {"movie_ids": tuple(movie_ids)})
                director_rows = cursor.fetchall()
            else:
                director_rows = []

        data = _build_response(rows, director_rows, threshold)
        data["qualifies"] = len(data["actors"]) > 0
        # If the actor doesn't qualify, still include their basic info
        if not data["qualifies"]:
            data["actors"] = [{
                "NodeID": actor["NodeID"],
                "ActorID": actor["ActorID"],
                "Name": actor["Name"],
                "StarPowerIndex": 0,
            }]
        return jsonify(data)
    finally:
        conn.close()
