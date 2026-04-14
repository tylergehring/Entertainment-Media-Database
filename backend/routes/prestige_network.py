from flask import Blueprint, jsonify
from flasgger import swag_from
from db import get_db_connection
from swagger_specs import PRESTIGE_NETWORK

prestige_bp = Blueprint("prestige", __name__, url_prefix="/api/prestige-network")


@prestige_bp.get("/")
@swag_from(PRESTIGE_NETWORK["get_prestige_network"])
def get_prestige_network():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Find prestigious movies (IMDB rating >= 8.5
            # OR was directed by a director who has received an award)
            cursor.execute(
                """
                SELECT DISTINCT m.NodeID, m.MovieID, m.Title, m.Rating,
                                m.ReleaseDate, m.Genre, m.Runtime
                FROM Movie m
                WHERE m.Rating IS NOT NULL
                  AND CAST(m.Rating AS DECIMAL(4,1)) >= 8.5
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
                """
            )
            prestigious_movies = cursor.fetchall()

            if not prestigious_movies:
                return jsonify(
                    {"prestigiousMovies": [], "prestigiousActors": [], "edges": []}
                )

            movie_node_ids = [m["NodeID"] for m in prestigious_movies]
            movie_placeholders = ",".join(["%s"] * len(movie_node_ids))

            # Find all actors who appeared in any prestigious movie
            cursor.execute(
                f"""
                SELECT DISTINCT a.NodeID, a.ActorID, a.Name,
                                a.DateOfBirth, a.Nationality
                FROM Actor a
                JOIN Edges e
                    ON  e.SourceNodeID = a.NodeID
                    AND e.EdgeType     = 'ACTED_IN'
                WHERE e.TargetNodeID IN ({movie_placeholders})
                ORDER BY a.Name
                """,
                movie_node_ids,
            )
            prestigious_actors = cursor.fetchall()

            if not prestigious_actors:
                return jsonify(
                    {
                        "prestigiousMovies": prestigious_movies,
                        "prestigiousActors": [],
                        "edges": [],
                    }
                )

            actor_node_ids = [a["NodeID"] for a in prestigious_actors]
            actor_placeholders = ",".join(["%s"] * len(actor_node_ids))

            # Build co-star edges between prestigious actors.
            # An edge exists when two prestigious actors share at least one
            # prestigious movie. The weight is the count of such shared movies.
            # e1: prestigious actor A -> prestigious movie M
            # e2: prestigious actor B -> same movie M  (B > A to avoid duplicates)
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
                  AND e1.TargetNodeID IN ({movie_placeholders})
                  AND e1.SourceNodeID IN ({actor_placeholders})
                  AND e2.SourceNodeID IN ({actor_placeholders})
                GROUP BY e1.SourceNodeID, e2.SourceNodeID
                ORDER BY weight DESC
                """,
                movie_node_ids + actor_node_ids + actor_node_ids,
            )
            edges = cursor.fetchall()

        return jsonify(
            {
                "prestigiousMovies": prestigious_movies,
                "prestigiousActors": prestigious_actors,
                "edges": edges,
            }
        )
    finally:
        conn.close()
