from flask import Blueprint, jsonify
from flasgger import swag_from
from swagger_specs import MOVIES

movies_bp = Blueprint("movies", __name__, url_prefix="/api/movies")


@movies_bp.get("/")
@swag_from(MOVIES["get_movies"])
def get_movies():
    return jsonify({"message": "Not implemented"}), 501


@movies_bp.get("/search")
@swag_from(MOVIES["search_movies"])
def search_movies():
    return jsonify({"message": "Not implemented"}), 501


@movies_bp.get("/<int:node_id>")
@swag_from(MOVIES["get_movie"])
def get_movie(node_id):
    return jsonify({"message": "Not implemented"}), 501


@movies_bp.post("/")
@swag_from(MOVIES["create_movie"])
def create_movie():
    return jsonify({"message": "Not implemented"}), 501


@movies_bp.put("/<int:node_id>")
@swag_from(MOVIES["update_movie"])
def update_movie(node_id):
    return jsonify({"message": "Not implemented"}), 501


@movies_bp.delete("/<int:node_id>")
@swag_from(MOVIES["delete_movie"])
def delete_movie(node_id):
    return jsonify({"message": "Not implemented"}), 501
