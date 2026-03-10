from flask import Blueprint

directors_bp = Blueprint('directors', __name__, url_prefix='/api/directors')

# GET    /api/directors              - list all directors
# GET    /api/directors/<node_id>    - get director by NodeID
# GET    /api/directors/search?name= - search directors by name
# POST   /api/directors              - create a director (creates Node + Director)
# PUT    /api/directors/<node_id>    - update a director
# DELETE /api/directors/<node_id>    - delete a director (cascades to Node)
