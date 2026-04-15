from flask import Blueprint, jsonify, request
from flasgger import swag_from
from db import get_db_connection
from swagger_specs import GRAPHS
from routes.star_power import _CTE, _DIRECTOR_SQL, _build_response

graphs_bp = Blueprint("graphs", __name__, url_prefix="/api/graphs")


@graphs_bp.get("/")
@swag_from(GRAPHS["get_graphs"])
def get_graphs():
    return jsonify({"message": "Not implemented"}), 501


@graphs_bp.post("/costar-network")
@swag_from(GRAPHS["costar_network"])
def costar_network():
    return jsonify({"message": "Not implemented"}), 501


@graphs_bp.post("/star-power")
@swag_from(GRAPHS["star_power"])
def star_power():
    body = request.get_json(silent=True) or {}
    try:
        threshold = int(body.get("threshold", 5))
    except (TypeError, ValueError):
        return jsonify({"error": "threshold must be an integer"}), 400

    if threshold < 1 or threshold > 10:
        return jsonify({"error": "threshold must be between 1 and 10"}), 400

    name = body.get("name") or f"Star Power (threshold={threshold})"

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 1. Compute qualifying actors + contributing movies
            sql = _CTE.format(actor_filter="")
            cursor.execute(sql, {"threshold": threshold})
            rows = cursor.fetchall()

            if not rows:
                return jsonify({
                    "graphId": None,
                    "threshold": threshold,
                    "actors": [],
                    "movies": [],
                    "directors": [],
                    "edges": [],
                })

            movie_ids = list({r["MovieNodeID"] for r in rows})
            cursor.execute(_DIRECTOR_SQL, {"movie_ids": tuple(movie_ids)})
            director_rows = cursor.fetchall()

            data = _build_response(rows, director_rows, threshold)

            # 2. Persist the graph
            conn.begin()
            cursor.execute(
                "INSERT INTO Graphs (Name, GraphType) VALUES (%s, 'StarPower')",
                (name,),
            )
            graph_id = cursor.lastrowid

            # Collect all unique NodeIDs
            all_node_ids = (
                {a["NodeID"] for a in data["actors"]}
                | {m["NodeID"] for m in data["movies"]}
                | {d["NodeID"] for d in data["directors"]}
            )
            if all_node_ids:
                cursor.executemany(
                    "INSERT IGNORE INTO GraphNodes (GraphID, NodeID) VALUES (%s, %s)",
                    [(graph_id, nid) for nid in all_node_ids],
                )

            # Collect all unique EdgeIDs
            all_edge_ids = {e["edgeId"] for e in data["edges"]}
            if all_edge_ids:
                cursor.executemany(
                    "INSERT IGNORE INTO GraphEdges (GraphID, EdgeID) VALUES (%s, %s)",
                    [(graph_id, eid) for eid in all_edge_ids],
                )

            conn.commit()

        data["graphId"] = graph_id
        return jsonify(data), 201
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


@graphs_bp.post("/prestige-network")
@swag_from(GRAPHS["prestige_network"])
def prestige_network():
    return jsonify({"message": "Not implemented"}), 501


@graphs_bp.get("/<int:graph_id>")
@swag_from(GRAPHS["get_graph"])
def get_graph(graph_id):
    return jsonify({"message": "Not implemented"}), 501


@graphs_bp.post("/")
@swag_from(GRAPHS["create_graph"])
def create_graph():
    return jsonify({"message": "Not implemented"}), 501


@graphs_bp.delete("/<int:graph_id>")
@swag_from(GRAPHS["delete_graph"])
def delete_graph(graph_id):
    return jsonify({"message": "Not implemented"}), 501


@graphs_bp.post("/<int:graph_id>/nodes")
@swag_from(GRAPHS["add_node_to_graph"])
def add_node_to_graph(graph_id):
    return jsonify({"message": "Not implemented"}), 501


@graphs_bp.delete("/<int:graph_id>/nodes/<int:node_id>")
@swag_from(GRAPHS["remove_node_from_graph"])
def remove_node_from_graph(graph_id, node_id):
    return jsonify({"message": "Not implemented"}), 501


@graphs_bp.post("/<int:graph_id>/edges")
@swag_from(GRAPHS["add_edge_to_graph"])
def add_edge_to_graph(graph_id):
    return jsonify({"message": "Not implemented"}), 501


@graphs_bp.delete("/<int:graph_id>/edges/<int:edge_id>")
@swag_from(GRAPHS["remove_edge_from_graph"])
def remove_edge_from_graph(graph_id, edge_id):
    return jsonify({"message": "Not implemented"}), 501
