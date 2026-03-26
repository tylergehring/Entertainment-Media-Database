from flask import Blueprint, jsonify
from flasgger import swag_from
from db import get_db_connection
from swagger_specs import ACTORS

actors_bp = Blueprint("actors", __name__, url_prefix="/api/actors")


@actors_bp.get("/")
@swag_from(ACTORS["get_actors"])
def get_actors():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Actor")
            actors = cursor.fetchall()
        return jsonify(actors)
    finally:
        conn.close()


@actors_bp.get("/search")
@swag_from(ACTORS["search_actors"])
def search_actors():
    return jsonify({"message": "Not implemented"}), 501


@actors_bp.get("/<int:node_id>")
@swag_from(ACTORS["get_actor"])
def get_actor(node_id):
    return jsonify({"message": "Not implemented"}), 501


@actors_bp.post("/")
@swag_from(ACTORS["create_actor"])
def create_actor():
    return jsonify({"message": "Not implemented"}), 501


@actors_bp.put("/<int:node_id>")
@swag_from(ACTORS["update_actor"])
def update_actor(node_id):
    return jsonify({"message": "Not implemented"}), 501


@actors_bp.delete("/<int:node_id>")
@swag_from(ACTORS["delete_actor"])
def delete_actor(node_id):
    return jsonify({"message": "Not implemented"}), 501
