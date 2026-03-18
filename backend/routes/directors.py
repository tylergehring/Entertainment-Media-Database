from flask import Blueprint, jsonify
from flasgger import swag_from
from swagger_specs import DIRECTORS

directors_bp = Blueprint("directors", __name__, url_prefix="/api/directors")


@directors_bp.get("/")
@swag_from(DIRECTORS["get_directors"])
def get_directors():
    return jsonify({"message": "Not implemented"}), 501


@directors_bp.get("/search")
@swag_from(DIRECTORS["search_directors"])
def search_directors():
    return jsonify({"message": "Not implemented"}), 501


@directors_bp.get("/<int:node_id>")
@swag_from(DIRECTORS["get_director"])
def get_director(node_id):
    return jsonify({"message": "Not implemented"}), 501


@directors_bp.post("/")
@swag_from(DIRECTORS["create_director"])
def create_director():
    return jsonify({"message": "Not implemented"}), 501


@directors_bp.put("/<int:node_id>")
@swag_from(DIRECTORS["update_director"])
def update_director(node_id):
    return jsonify({"message": "Not implemented"}), 501


@directors_bp.delete("/<int:node_id>")
@swag_from(DIRECTORS["delete_director"])
def delete_director(node_id):
    return jsonify({"message": "Not implemented"}), 501
