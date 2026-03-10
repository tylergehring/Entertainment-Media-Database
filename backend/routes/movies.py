from flask import Blueprint

movies_bp = Blueprint('movies', __name__, url_prefix='/api/movies')

# GET    /api/movies               - list all movies


# GET    /api/movies/<node_id>     - get movie by NodeID
# GET    /api/movies/search?title= - search movies by title
# POST   /api/movies               - create a movie (creates Node + Movie)
# PUT    /api/movies/<node_id>     - update a movie
# DELETE /api/movies/<node_id>     - delete a movie (cascades to Node)
