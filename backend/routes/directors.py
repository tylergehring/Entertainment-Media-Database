from flask import Blueprint, jsonify, request
from flasgger import swag_from
from db import get_db_connection
from swagger_specs import DIRECTORS

directors_bp = Blueprint("directors", __name__, url_prefix="/api/directors")


@directors_bp.get("/")
@swag_from(DIRECTORS["get_directors"])
def get_directors():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Director")
            directors = cursor.fetchall()
        return jsonify(directors)
    finally:
        conn.close()


@directors_bp.get("/search")
@swag_from(DIRECTORS["search_directors"])
def search_directors():
    name = request.args.get("name")
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Director WHERE Director.Name LIKE %s", (f"%{name}%",))
            directors = cursor.fetchall()
        return jsonify(directors)
    finally:
        conn.close()


@directors_bp.get("/<int:node_id>")
@swag_from(DIRECTORS["get_director"])
def get_director(node_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Director WHERE Director.NodeID = %s", (node_id,))
            director = cursor.fetchone()
        if director:
            return jsonify(director)
        else:
            return jsonify({"message": "Director not found"}), 404
    finally:
        conn.close()


@directors_bp.post("/")
@swag_from(DIRECTORS["create_director"])
def create_director():
    data = request.get_json()
    if not data or not data.get("DirectorID") or not data.get("Name"):
        return jsonify({"message": "DirectorID and Name are required"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO Nodes (NodeType) VALUES ('Director')")
            node_id = cursor.lastrowid
            cursor.execute(
                "INSERT INTO Director (NodeID, DirectorID, Name, DateOfBirth, Nationality, Awards) VALUES (%s, %s, %s, %s, %s, %s)",
                (node_id, data["DirectorID"], data["Name"], data.get("DateOfBirth"), data.get("Nationality"), data.get("Awards")),
            )
        conn.commit()
        return jsonify({"NodeID": node_id, **data}), 201
    except Exception as e:
        conn.rollback()
        if "Duplicate entry" in str(e):
            return jsonify({"message": "DirectorID already exists"}), 409
        raise
    finally:
        conn.close()


@directors_bp.put("/<int:node_id>")
@swag_from(DIRECTORS["update_director"])
def update_director(node_id):
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400

    fields = []
    values = []
    for col in ("DirectorID", "Name", "DateOfBirth", "Nationality", "Awards"):
        if col in data:
            fields.append(f"{col} = %s")
            values.append(data[col])

    if not fields:
        return jsonify({"message": "No valid fields to update"}), 400

    values.append(node_id)
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(f"UPDATE Director SET {', '.join(fields)} WHERE NodeID = %s", values)
            if cursor.rowcount == 0:
                return jsonify({"message": "Director not found"}), 404
        conn.commit()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Director WHERE NodeID = %s", (node_id,))
            director = cursor.fetchone()
        return jsonify(director)
    except Exception as e:
        conn.rollback()
        if "Duplicate entry" in str(e):
            return jsonify({"message": "DirectorID already exists"}), 409
        raise
    finally:
        conn.close()


@directors_bp.delete("/<int:node_id>")
@swag_from(DIRECTORS["delete_director"])
def delete_director(node_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM Nodes WHERE NodeID = %s AND NodeType = 'Director'", (node_id,))
            if cursor.rowcount == 0:
                return jsonify({"message": "Director not found"}), 404
        conn.commit()
        return jsonify({"message": "Director deleted"}), 200
    finally:
        conn.close()


@directors_bp.get("/name/<string:name>")
@swag_from(DIRECTORS["get_directors_by_name"])
def get_directors_by_name(name):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Director WHERE Director.Name LIKE %s", (f"%{name}%",))
            directors = cursor.fetchall()
        return jsonify(directors)
    finally:
        conn.close()


@directors_bp.get("/nationality/<string:nationality>")
@swag_from(DIRECTORS["get_directors_by_nationality"])
def get_directors_by_nationality(nationality):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Director WHERE Director.Nationality LIKE %s", (f"%{nationality}%",))
            directors = cursor.fetchall()
        return jsonify(directors)
    finally:
        conn.close()
