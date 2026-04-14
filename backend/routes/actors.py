from flask import Blueprint, jsonify, request
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
    name = request.args.get("name")
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Actor WHERE Actor.Name LIKE %s", (f"%{name}%",))
            actors = cursor.fetchall()
        return jsonify(actors)
    finally:
        conn.close()


@actors_bp.get("/<int:node_id>")
@swag_from(ACTORS["get_actor"])
def get_actor(node_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Actor WHERE Actor.id = %s", (node_id,))
            actor = cursor.fetchone()
        if actor:
            return jsonify(actor)
        else:
            return jsonify({"message": "Actor not found"}), 404
    finally:
        conn.close()


@actors_bp.post("/")
@swag_from(ACTORS["create_actor"])
def create_actor():
    data = request.get_json()
    if not data or not data.get("ActorID") or not data.get("Name"):
        return jsonify({"message": "ActorID and Name are required"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO Nodes (NodeType) VALUES ('Actor')")
            node_id = cursor.lastrowid
            cursor.execute(
                "INSERT INTO Actor (NodeID, ActorID, Name, DateOfBirth, Nationality) VALUES (%s, %s, %s, %s, %s)",
                (node_id, data["ActorID"], data["Name"], data.get("DateOfBirth"), data.get("Nationality")),
            )
        conn.commit()
        return jsonify({"NodeID": node_id, **data}), 201
    except Exception as e:
        conn.rollback()
        if "Duplicate entry" in str(e):
            return jsonify({"message": "ActorID already exists"}), 409
        raise
    finally:
        conn.close()


@actors_bp.put("/<int:node_id>")
@swag_from(ACTORS["update_actor"])
def update_actor(node_id):
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400

    fields = []
    values = []
    for col in ("ActorID", "Name", "DateOfBirth", "Nationality"):
        if col in data:
            fields.append(f"{col} = %s")
            values.append(data[col])

    if not fields:
        return jsonify({"message": "No valid fields to update"}), 400

    values.append(node_id)
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(f"UPDATE Actor SET {', '.join(fields)} WHERE NodeID = %s", values)
            if cursor.rowcount == 0:
                return jsonify({"message": "Actor not found"}), 404
        conn.commit()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Actor WHERE NodeID = %s", (node_id,))
            actor = cursor.fetchone()
        return jsonify(actor)
    except Exception as e:
        conn.rollback()
        if "Duplicate entry" in str(e):
            return jsonify({"message": "ActorID already exists"}), 409
        raise
    finally:
        conn.close()


@actors_bp.delete("/<int:node_id>")
@swag_from(ACTORS["delete_actor"])
def delete_actor(node_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM Nodes WHERE NodeID = %s AND NodeType = 'Actor'", (node_id,))
            if cursor.rowcount == 0:
                return jsonify({"message": "Actor not found"}), 404
        conn.commit()
        return jsonify({"message": "Actor deleted"}), 200
    finally:
        conn.close()


@actors_bp.get("/name/<string:name>")
@swag_from(ACTORS["get_actors_by_name"])
def get_actors_by_name(name):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Actor WHERE Actor.Name LIKE %s", (f"%{name}%",))
            actors = cursor.fetchall()
        return jsonify(actors)
    finally:
        conn.close()


@actors_bp.get("/nationality/<string:nationality>")
@swag_from(ACTORS["get_actors_by_nationality"])
def get_actors_by_nationality(nationality):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Actor WHERE Actor.Nationality LIKE %s", (f"%{nationality}%",))
            actors = cursor.fetchall()
        return jsonify(actors)
    finally:
        conn.close()
