from flask import Flask
from flask_cors import CORS
from flasgger import Swagger

from db import get_db_connection
from routes.movies import movies_bp
from routes.actors import actors_bp
from routes.directors import directors_bp
from routes.edges import edges_bp
from routes.graphs import graphs_bp
from swagger_specs import DEFINITIONS

app = Flask(__name__)
CORS(app)

Swagger(
    app,
    template={
        "info": {
            "title": "EMDB API",
            "description": "Entertainment Media Database REST API",
            "version": "1.0.0",
        },
        "definitions": DEFINITIONS,
    },
)

app.register_blueprint(movies_bp)
app.register_blueprint(actors_bp)
app.register_blueprint(directors_bp)
app.register_blueprint(edges_bp)
app.register_blueprint(graphs_bp)


@app.route("/api/health")
def health():
    return {"status": "ok"}


@app.route("/api/db-check")
def db_check():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
        return {"db": "connected", "result": result}
    finally:
        conn.close()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
