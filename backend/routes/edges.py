from flask import Blueprint, jsonify
from flasgger import swag_from
from swagger_specs import EDGES

edges_bp = Blueprint("edges", __name__, url_prefix="/api/edges")


@edges_bp.get("/")
@swag_from(EDGES["get_edges"])
def get_edges():
    return jsonify({"message": "Not implemented"}), 501


@edges_bp.get("/<int:edge_id>")
@swag_from(EDGES["get_edge"])
def get_edge(edge_id):
    return jsonify({"message": "Not implemented"}), 501


@edges_bp.post("/")
@swag_from(EDGES["create_edge"])
def create_edge():
    return jsonify({"message": "Not implemented"}), 501


@edges_bp.put("/<int:edge_id>")
@swag_from(EDGES["update_edge"])
def update_edge(edge_id):
    return jsonify({"message": "Not implemented"}), 501


@edges_bp.delete("/<int:edge_id>")
@swag_from(EDGES["delete_edge"])
def delete_edge(edge_id):
    return jsonify({"message": "Not implemented"}), 501
