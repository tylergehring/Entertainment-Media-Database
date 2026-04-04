from flask import Blueprint, jsonify, request
from flasgger import swag_from
from db import get_db_connection
from swagger_specs import MOVIES

movies_bp = Blueprint("movies", __name__, url_prefix="/api/movies")


@movies_bp.get("/")
@swag_from(MOVIES["get_movies"])
def get_movies():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Movie")
            movies = cursor.fetchall()
        return jsonify(movies)
    finally:
        conn.close()


@movies_bp.get("/search")
@swag_from(MOVIES["search_movies"])
def search_movies():
    title = request.args.get("title")
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Movie WHERE Movie.Title = %s", (title,))
            movies = cursor.fetchall()
        return jsonify(movies)
    finally:
        conn.close()


@movies_bp.get("/<int:node_id>")
@swag_from(MOVIES["get_movie"])
def get_movie(node_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Movie WHERE Movie.NodeID = %s", (node_id,))
            movie = cursor.fetchone()
        if movie:
            return jsonify(movie)
        else:
            return jsonify({"message": "Movie not found"}), 404
    finally:
        conn.close()


@movies_bp.post("/")
@swag_from(MOVIES["create_movie"])
def create_movie():
    data = request.get_json()
    if not data or not data.get("MovieID") or not data.get("Title"):
        return jsonify({"message": "MovieID and Title are required"}), 400

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO Nodes (NodeType) VALUES ('Movie')")
            node_id = cursor.lastrowid
            cursor.execute(
                "INSERT INTO Movie (NodeID, MovieID, Title, Rating, ReleaseDate, Genre, Runtime) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (node_id, data["MovieID"], data["Title"], data.get("Rating"), data.get("ReleaseDate"), data.get("Genre"), data.get("Runtime")),
            )
        conn.commit()
        return jsonify({"NodeID": node_id, **data}), 201
    except Exception as e:
        conn.rollback()
        if "Duplicate entry" in str(e):
            return jsonify({"message": "MovieID already exists"}), 409
        raise
    finally:
        conn.close()


@movies_bp.put("/<int:node_id>")
@swag_from(MOVIES["update_movie"])
def update_movie(node_id):
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is required"}), 400

    fields = []
    values = []
    for col in ("MovieID", "Title", "Rating", "ReleaseDate", "Genre", "Runtime"):
        if col in data:
            fields.append(f"{col} = %s")
            values.append(data[col])

    if not fields:
        return jsonify({"message": "No valid fields to update"}), 400

    values.append(node_id)
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(f"UPDATE Movie SET {', '.join(fields)} WHERE NodeID = %s", values)
            if cursor.rowcount == 0:
                return jsonify({"message": "Movie not found"}), 404
        conn.commit()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Movie WHERE NodeID = %s", (node_id,))
            movie = cursor.fetchone()
        return jsonify(movie)
    except Exception as e:
        conn.rollback()
        if "Duplicate entry" in str(e):
            return jsonify({"message": "MovieID already exists"}), 409
        raise
    finally:
        conn.close()


@movies_bp.delete("/<int:node_id>")
@swag_from(MOVIES["delete_movie"])
def delete_movie(node_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM Nodes WHERE NodeID = %s AND NodeType = 'Movie'", (node_id,))
            if cursor.rowcount == 0:
                return jsonify({"message": "Movie not found"}), 404
        conn.commit()
        return jsonify({"message": "Movie deleted"}), 200
    finally:
        conn.close()

@movies_bp.get("/name/<string:title>")
@swag_from(MOVIES["get_movie_by_title"])
def get_movie_by_title(title):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Movie WHERE Movie.Title LIKE %s", (f"%{title}%",))
            movie = cursor.fetchone()
        if movie:
            return jsonify(movie)
        else:
            return jsonify({"message": "Movie not found"}), 404
    finally:
        conn.close()

@movies_bp.get("/genre/<string:genre>")
@swag_from(MOVIES["get_movies_by_genre"])
def get_movies_by_genre(genre):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Movie WHERE Movie.Genre LIKE %s", (f"%{genre}%",))
            movies = cursor.fetchall()
        return jsonify(movies)
    finally:
        conn.close()