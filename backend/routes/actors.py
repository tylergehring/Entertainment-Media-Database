from flask import Blueprint, jsonify
from db import get_db_connection

actors_bp = Blueprint('actors', __name__, url_prefix='/api/actors')

@actors_bp.get('/')
def get_actors():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Actor")
            actors = cursor.fetchall()
        return jsonify(actors)
    finally:
        conn.close()


# GET    /api/actors/<node_id>    - get actor by NodeID
# GET    /api/actors/search?name= - search actors by name
# POST   /api/actors              - create an actor (creates Node + Actor)
# PUT    /api/actors/<node_id>    - update an actor
# DELETE /api/actors/<node_id>    - delete an actor (cascades to Node)
