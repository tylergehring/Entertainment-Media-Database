# retrieve co-star network
from flask import Blueprint, jsonify, request
from flasgger import swag_from
from db import get_db_connection
from swagger_specs import COSTAR

costar_bp = Blueprint("costar", __name__, url_prefix="/api/costar")


@costar_bp.get("/")
@swag_from(COSTAR["get_costar_network"])
def get_costar_network():
    actor_id = request.args.get("actor_id")
    if not actor_id:
        return jsonify({"error": "Missing actor_id parameter"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Actor WHERE ActorID = %s", actor_id)
            center = cursor.fetchone()
            if not center:
                return jsonify({"error": "Actor not found"}), 404

            center_node_id = center["NodeID"]

            # Find all co-stars and count shared movies.
            #
            # Join Logic:
            #   Actor a1  (center)
            #     JOIN Edges e1  (a1 ACTED_IN movie M)
            #     JOIN Edges e2  (another actor ACTED_IN same movie M)
            #     JOIN Actor a2  (the co-star)
            #
            # GROUP BY co-star and COUNT distinct shared movies
            cursor.execute(
                """
                SELECT
                    a2.NodeID,
                    a2.ActorID,
                    a2.Name,
                    a2.DateOfBirth,
                    a2.Nationality,
                    a2.PhotoURL,
                    COUNT(DISTINCT e1.TargetNodeID) AS sharedMovies
                FROM Edges e1
                JOIN Edges e2
                    ON  e2.TargetNodeID = e1.TargetNodeID
                    AND e2.EdgeType     = 'ACTED_IN'
                    AND e2.SourceNodeID != %s
                JOIN Actor a2
                    ON  a2.NodeID = e2.SourceNodeID
                WHERE e1.SourceNodeID = %s
                  AND e1.EdgeType     = 'ACTED_IN'
                GROUP BY a2.NodeID, a2.ActorID, a2.Name, a2.DateOfBirth, a2.Nationality, a2.PhotoURL
                ORDER BY sharedMovies DESC
                """,
                (center_node_id, center_node_id),
            )
            co_stars = cursor.fetchall()

        edges = [
            {
                "source": center_node_id,
                "target": cs["NodeID"],
                "weight": cs["sharedMovies"],
            }
            for cs in co_stars
        ]

        return jsonify({"center": center, "coStars": co_stars, "edges": edges})
    finally:
        conn.close()
