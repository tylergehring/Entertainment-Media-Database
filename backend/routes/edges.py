from flask import Blueprint

edges_bp = Blueprint('edges', __name__, url_prefix='/api/edges')

# GET    /api/edges                          - list edges (filter by ?source=&target=&type=)
# GET    /api/edges/<edge_id>                - get edge by ID
# POST   /api/edges                          - create an edge (ACTED_IN or DIRECTED)
# PUT    /api/edges/<edge_id>                - update edge metadata
# DELETE /api/edges/<edge_id>                - delete an edge
