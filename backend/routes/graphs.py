from flask import Blueprint

graphs_bp = Blueprint('graphs', __name__, url_prefix='/api/graphs')

# GET    /api/graphs                         - list all graphs
# GET    /api/graphs/<graph_id>              - get graph with its nodes and edges
# POST   /api/graphs                         - create a new graph
# DELETE /api/graphs/<graph_id>              - delete a graph

# POST   /api/graphs/<graph_id>/nodes           - add a node to a graph
# DELETE /api/graphs/<graph_id>/nodes/<node_id> - remove a node from a graph
# POST   /api/graphs/<graph_id>/edges           - add an edge to a graph
# DELETE /api/graphs/<graph_id>/edges/<edge_id> - remove an edge from a graph

# --- Query-generated graphs ---
# POST   /api/graphs/costar-network?actorId=    - build co-star network graph
# POST   /api/graphs/star-power?threshold=      - build star power index graph
# POST   /api/graphs/prestige-network           - build prestige network graph
