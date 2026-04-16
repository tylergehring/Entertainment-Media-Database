from flask import Blueprint, jsonify, request
from flasgger import swag_from
from db import get_db_connection
from swagger_specs import PRESTIGE_NETWORK

prestige_bp = Blueprint("prestige", __name__, url_prefix="/api/prestige-network")


@prestige_bp.get("/")
@swag_from(PRESTIGE_NETWORK["get_prestige_network"])
def get_prestige_network():
    # -----------------------------------------------------------------------
    # Parse query parameters
    # -----------------------------------------------------------------------
    try:
        min_rating = float(request.args.get("min_rating", 8.5))
    except ValueError:
        return jsonify({"error": "min_rating must be a number"}), 400

    award_directors = request.args.get("award_directors", "true").lower() != "false"

    try:
        min_shared = int(request.args.get("min_shared", 1))
    except ValueError:
        return jsonify({"error": "min_shared must be an integer"}), 400

    genre = request.args.get("genre", "").strip()

    # -----------------------------------------------------------------------
    # Build prestigious-movie query
    # -----------------------------------------------------------------------
    genre_clause = "AND m.Genre = %(genre)s" if genre else ""
    params = {"min_rating": min_rating, "min_shared": min_shared}
    if genre:
        params["genre"] = genre

    rating_branch = f"""
        SELECT DISTINCT m.NodeID, m.MovieID, m.Title, m.Rating,
                        m.ReleaseDate, m.Genre, m.Runtime
        FROM Movie m
        WHERE m.Rating IS NOT NULL
          AND CAST(m.Rating AS DECIMAL(4,1)) >= %(min_rating)s
          {genre_clause}
    """

    if award_directors:
        movie_sql = rating_branch + f"""
        UNION
        SELECT DISTINCT m.NodeID, m.MovieID, m.Title, m.Rating,
                        m.ReleaseDate, m.Genre, m.Runtime
        FROM Movie m
        JOIN Edges e
            ON  e.TargetNodeID = m.NodeID
            AND e.EdgeType     = 'DIRECTED'
        JOIN Director d
            ON  d.NodeID = e.SourceNodeID
        WHERE d.Awards IS NOT NULL AND d.Awards != ''
          {genre_clause}
        """
    else:
        movie_sql = rating_branch

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(movie_sql, params)
            prestigious_movies = cursor.fetchall()

            if not prestigious_movies:
                return jsonify({
                    "prestigiousMovies": [],
                    "prestigiousActors": [],
                    "prestigiousDirectors": [],
                    "coStarEdges": [],
                    "actedInEdges": [],
                    "directedEdges": [],
                })

            movie_ids = [m["NodeID"] for m in prestigious_movies]
            ph = ",".join(["%s"] * len(movie_ids))

            # ---------------------------------------------------------------
            # Actors who appeared in any prestigious movie
            # ---------------------------------------------------------------
            cursor.execute(
                f"""
                SELECT DISTINCT a.NodeID, a.ActorID, a.Name,
                                a.DateOfBirth, a.Nationality, a.PhotoURL
                FROM Actor a
                JOIN Edges e
                    ON  e.SourceNodeID = a.NodeID
                    AND e.EdgeType     = 'ACTED_IN'
                WHERE e.TargetNodeID IN ({ph})
                ORDER BY a.Name
                """,
                movie_ids,
            )
            prestigious_actors = cursor.fetchall()

            # ---------------------------------------------------------------
            # Directors who directed any prestigious movie
            # ---------------------------------------------------------------
            cursor.execute(
                f"""
                SELECT DISTINCT d.NodeID, d.DirectorID, d.Name,
                                d.DateOfBirth, d.Nationality, d.Awards, d.PhotoURL
                FROM Director d
                JOIN Edges e
                    ON  e.SourceNodeID = d.NodeID
                    AND e.EdgeType     = 'DIRECTED'
                WHERE e.TargetNodeID IN ({ph})
                ORDER BY d.Name
                """,
                movie_ids,
            )
            prestigious_directors = cursor.fetchall()

            # ---------------------------------------------------------------
            # Co-star edges (actor ↔ actor, filtered by min_shared)
            # ---------------------------------------------------------------
            costar_edges = []
            if prestigious_actors:
                actor_ids = [a["NodeID"] for a in prestigious_actors]
                aph = ",".join(["%s"] * len(actor_ids))
                cursor.execute(
                    f"""
                    SELECT
                        e1.SourceNodeID AS source,
                        e2.SourceNodeID AS target,
                        COUNT(DISTINCT e1.TargetNodeID) AS weight
                    FROM Edges e1
                    JOIN Edges e2
                        ON  e2.TargetNodeID = e1.TargetNodeID
                        AND e2.EdgeType     = 'ACTED_IN'
                        AND e2.SourceNodeID > e1.SourceNodeID
                    WHERE e1.EdgeType     = 'ACTED_IN'
                      AND e1.TargetNodeID IN ({ph})
                      AND e1.SourceNodeID IN ({aph})
                      AND e2.SourceNodeID IN ({aph})
                    GROUP BY e1.SourceNodeID, e2.SourceNodeID
                    HAVING COUNT(DISTINCT e1.TargetNodeID) >= %s
                    ORDER BY weight DESC
                    """,
                    movie_ids + actor_ids + actor_ids + [min_shared],
                )
                costar_edges = cursor.fetchall()

            # ---------------------------------------------------------------
            # ACTED_IN edges (actor → movie) for the graph
            # ---------------------------------------------------------------
            acted_in_edges = []
            if prestigious_actors:
                cursor.execute(
                    f"""
                    SELECT e.EdgeID, e.SourceNodeID AS actorNodeId,
                           e.TargetNodeID AS movieNodeId
                    FROM Edges e
                    WHERE e.EdgeType     = 'ACTED_IN'
                      AND e.TargetNodeID IN ({ph})
                      AND e.SourceNodeID IN ({aph})
                    """,
                    movie_ids + actor_ids,
                )
                acted_in_edges = cursor.fetchall()

            # ---------------------------------------------------------------
            # DIRECTED edges (director → movie) for the graph
            # ---------------------------------------------------------------
            directed_edges = []
            if prestigious_directors:
                dir_ids = [d["NodeID"] for d in prestigious_directors]
                dph = ",".join(["%s"] * len(dir_ids))
                cursor.execute(
                    f"""
                    SELECT e.EdgeID, e.SourceNodeID AS directorNodeId,
                           e.TargetNodeID AS movieNodeId
                    FROM Edges e
                    WHERE e.EdgeType     = 'DIRECTED'
                      AND e.TargetNodeID IN ({ph})
                      AND e.SourceNodeID IN ({dph})
                    """,
                    movie_ids + dir_ids,
                )
                directed_edges = cursor.fetchall()

        return jsonify({
            "prestigiousMovies":    prestigious_movies,
            "prestigiousActors":    prestigious_actors,
            "prestigiousDirectors": prestigious_directors,
            "coStarEdges":          costar_edges,
            "actedInEdges":         acted_in_edges,
            "directedEdges":        directed_edges,
        })
    finally:
        conn.close()


@prestige_bp.get("/genres")
def get_prestige_genres():
    """Return distinct genres present in the Movie table."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT DISTINCT Genre FROM Movie WHERE Genre IS NOT NULL AND Genre != '' ORDER BY Genre"
            )
            rows = cursor.fetchall()
        return jsonify([r["Genre"] for r in rows])
    finally:
        conn.close()
