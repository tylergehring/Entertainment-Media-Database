from flask import Blueprint, jsonify
from flasgger import swag_from
from swagger_specs import GRAPHS

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
    return jsonify({"message": "Not implemented"}), 501


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
