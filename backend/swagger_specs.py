"""
Centralised Swagger/OpenAPI definitions and operation specs.
- DEFINITIONS: model schemas, loaded into the global Swagger template in app.py
- ACTORS/MOVIES/DIRECTORS/EDGES/GRAPHS: per-route specs used via @swag_from
"""

# ---------------------------------------------------------------------------
# Model definitions
# ---------------------------------------------------------------------------

DEFINITIONS = {
    "Actor": {
        "type": "object",
        "properties": {
            "NodeID": {"type": "integer"},
            "ActorID": {"type": "string"},
            "Name": {"type": "string"},
            "DateOfBirth": {"type": "string", "format": "date"},
            "Nationality": {"type": "string"},
        },
    },
    "Movie": {
        "type": "object",
        "properties": {
            "NodeID": {"type": "integer"},
            "MovieID": {"type": "string"},
            "Title": {"type": "string"},
            "Rating": {"type": "string"},
            "ReleaseDate": {"type": "string", "format": "date"},
            "Genre": {"type": "string"},
            "Runtime": {"type": "integer", "description": "Runtime in minutes"},
        },
    },
    "Director": {
        "type": "object",
        "properties": {
            "NodeID": {"type": "integer"},
            "DirectorID": {"type": "string"},
            "Name": {"type": "string"},
            "DateOfBirth": {"type": "string", "format": "date"},
            "Nationality": {"type": "string"},
            "Awards": {"type": "string"},
        },
    },
    "Edge": {
        "type": "object",
        "properties": {
            "EdgeID": {"type": "integer"},
            "SourceNodeID": {"type": "integer"},
            "TargetNodeID": {"type": "integer"},
            "EdgeType": {"type": "string", "enum": ["ACTED_IN", "DIRECTED"]},
            "Metadata": {"type": "object", "description": "Arbitrary JSON metadata"},
            "CreatedAt": {"type": "string", "format": "date-time"},
        },
    },
    "Graph": {
        "type": "object",
        "properties": {
            "GraphID": {"type": "integer"},
            "Name": {"type": "string"},
            "Description": {"type": "string"},
            "CreatedAt": {"type": "string", "format": "date-time"},
        },
    },
    "GraphDetail": {
        "type": "object",
        "properties": {
            "GraphID": {"type": "integer"},
            "Name": {"type": "string"},
            "Description": {"type": "string"},
            "CreatedAt": {"type": "string", "format": "date-time"},
            "nodes": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "NodeID": {"type": "integer"},
                        "NodeType": {
                            "type": "string",
                            "enum": ["Movie", "Actor", "Director"],
                        },
                        "CreatedAt": {"type": "string", "format": "date-time"},
                    },
                },
            },
            "edges": {
                "type": "array",
                "items": {"$ref": "#/definitions/Edge"},
            },
        },
    },
}

# ---------------------------------------------------------------------------
# Actors
# ---------------------------------------------------------------------------

ACTORS = {
    "get_actors": {
        "tags": ["Actors"],
        "summary": "List all actors",
        "responses": {
            200: {
                "description": "A list of all actors",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Actor"}},
            }
        },
    },
    "search_actors": {
        "tags": ["Actors"],
        "summary": "Search actors by name",
        "parameters": [
            {
                "name": "name",
                "in": "query",
                "type": "string",
                "required": True,
                "description": "Partial or full name to search for",
            }
        ],
        "responses": {
            200: {
                "description": "List of matching actors",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Actor"}},
            },
            400: {"description": "Missing name parameter"},
        },
    },
    "get_actor": {
        "tags": ["Actors"],
        "summary": "Get actor by NodeID",
        "parameters": [
            {
                "name": "node_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The NodeID of the actor",
            }
        ],
        "responses": {
            200: {
                "description": "Actor object",
                "schema": {"$ref": "#/definitions/Actor"},
            },
            404: {"description": "Actor not found"},
        },
    },
    "create_actor": {
        "tags": ["Actors"],
        "summary": "Create a new actor",
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "required": ["ActorID", "Name"],
                    "properties": {
                        "ActorID": {"type": "string"},
                        "Name": {"type": "string"},
                        "DateOfBirth": {"type": "string", "format": "date"},
                        "Nationality": {"type": "string"},
                    },
                },
            }
        ],
        "responses": {
            201: {
                "description": "Actor created",
                "schema": {"$ref": "#/definitions/Actor"},
            },
            400: {"description": "Missing required fields"},
        },
    },
    "update_actor": {
        "tags": ["Actors"],
        "summary": "Update an actor",
        "parameters": [
            {
                "name": "node_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The NodeID of the actor to update",
            },
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "Name": {"type": "string"},
                        "DateOfBirth": {"type": "string", "format": "date"},
                        "Nationality": {"type": "string"},
                    },
                },
            },
        ],
        "responses": {
            200: {
                "description": "Actor updated",
                "schema": {"$ref": "#/definitions/Actor"},
            },
            404: {"description": "Actor not found"},
        },
    },
    "delete_actor": {
        "tags": ["Actors"],
        "summary": "Delete an actor",
        "parameters": [
            {
                "name": "node_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The NodeID of the actor to delete",
            }
        ],
        "responses": {
            200: {"description": "Actor deleted"},
            404: {"description": "Actor not found"},
        },
    },
    "get_actors_by_name": {
        "tags": ["Actors"],
        "summary": "Search actors by name (partial match)",
        "parameters": [
            {
                "name": "name",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "Partial or full name to search for",
            }
        ],
        "responses": {
            200: {
                "description": "List of matching actors",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Actor"}},
            }
        },
    },
    "get_actors_by_nationality": {
        "tags": ["Actors"],
        "summary": "Get actors by nationality (partial match)",
        "parameters": [
            {
                "name": "nationality",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "Nationality to filter by",
            }
        ],
        "responses": {
            200: {
                "description": "List of matching actors",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Actor"}},
            }
        },
    },
}

# ---------------------------------------------------------------------------
# Movies
# ---------------------------------------------------------------------------

MOVIES = {
    "get_movies": {
        "tags": ["Movies"],
        "summary": "List all movies",
        "responses": {
            200: {
                "description": "A list of all movies",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Movie"}},
            }
        },
    },
    "search_movies": {
        "tags": ["Movies"],
        "summary": "Search movies by title",
        "parameters": [
            {
                "name": "title",
                "in": "query",
                "type": "string",
                "required": True,
                "description": "Partial or full title to search for",
            }
        ],
        "responses": {
            200: {
                "description": "List of matching movies",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Movie"}},
            },
            400: {"description": "Missing title parameter"},
        },
    },
    "get_movie": {
        "tags": ["Movies"],
        "summary": "Get movie by NodeID",
        "parameters": [
            {
                "name": "node_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The NodeID of the movie",
            }
        ],
        "responses": {
            200: {
                "description": "Movie object",
                "schema": {"$ref": "#/definitions/Movie"},
            },
            404: {"description": "Movie not found"},
        },
    },
    "create_movie": {
        "tags": ["Movies"],
        "summary": "Create a new movie",
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "required": ["MovieID", "Title"],
                    "properties": {
                        "MovieID": {"type": "string"},
                        "Title": {"type": "string"},
                        "Rating": {"type": "string"},
                        "ReleaseDate": {"type": "string", "format": "date"},
                        "Genre": {"type": "string"},
                        "Runtime": {
                            "type": "integer",
                            "description": "Runtime in minutes",
                        },
                    },
                },
            }
        ],
        "responses": {
            201: {
                "description": "Movie created",
                "schema": {"$ref": "#/definitions/Movie"},
            },
            400: {"description": "Missing required fields"},
        },
    },
    "update_movie": {
        "tags": ["Movies"],
        "summary": "Update a movie",
        "parameters": [
            {
                "name": "node_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The NodeID of the movie to update",
            },
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "Title": {"type": "string"},
                        "Rating": {"type": "string"},
                        "ReleaseDate": {"type": "string", "format": "date"},
                        "Genre": {"type": "string"},
                        "Runtime": {"type": "integer"},
                    },
                },
            },
        ],
        "responses": {
            200: {
                "description": "Movie updated",
                "schema": {"$ref": "#/definitions/Movie"},
            },
            404: {"description": "Movie not found"},
        },
    },
    "delete_movie": {
        "tags": ["Movies"],
        "summary": "Delete a movie",
        "parameters": [
            {
                "name": "node_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The NodeID of the movie to delete",
            }
        ],
        "responses": {
            200: {"description": "Movie deleted"},
            404: {"description": "Movie not found"},
        },
    },
    "get_movie_by_title": {
        "tags": ["Movies"],
        "summary": "Search movies by title (partial match)",
        "parameters": [
            {
                "name": "title",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "Partial or full title to search for",
            }
        ],
        "responses": {
            200: {
                "description": "Matching movie",
                "schema": {"$ref": "#/definitions/Movie"},
            },
            404: {"description": "Movie not found"},
        },
    },
    "get_movies_by_genre": {
        "tags": ["Movies"],
        "summary": "Get movies by genre (partial match)",
        "parameters": [
            {
                "name": "genre",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "Genre to filter by",
            }
        ],
        "responses": {
            200: {
                "description": "List of matching movies",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Movie"}},
            }
        },
    },
}

# ---------------------------------------------------------------------------
# Directors
# ---------------------------------------------------------------------------

DIRECTORS = {
    "get_directors": {
        "tags": ["Directors"],
        "summary": "List all directors",
        "responses": {
            200: {
                "description": "A list of all directors",
                "schema": {
                    "type": "array",
                    "items": {"$ref": "#/definitions/Director"},
                },
            }
        },
    },
    "search_directors": {
        "tags": ["Directors"],
        "summary": "Search directors by name",
        "parameters": [
            {
                "name": "name",
                "in": "query",
                "type": "string",
                "required": True,
                "description": "Partial or full name to search for",
            }
        ],
        "responses": {
            200: {
                "description": "List of matching directors",
                "schema": {
                    "type": "array",
                    "items": {"$ref": "#/definitions/Director"},
                },
            },
            400: {"description": "Missing name parameter"},
        },
    },
    "get_director": {
        "tags": ["Directors"],
        "summary": "Get director by NodeID",
        "parameters": [
            {
                "name": "node_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The NodeID of the director",
            }
        ],
        "responses": {
            200: {
                "description": "Director object",
                "schema": {"$ref": "#/definitions/Director"},
            },
            404: {"description": "Director not found"},
        },
    },
    "create_director": {
        "tags": ["Directors"],
        "summary": "Create a new director",
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "required": ["DirectorID", "Name"],
                    "properties": {
                        "DirectorID": {"type": "string"},
                        "Name": {"type": "string"},
                        "DateOfBirth": {"type": "string", "format": "date"},
                        "Nationality": {"type": "string"},
                        "Awards": {"type": "string"},
                    },
                },
            }
        ],
        "responses": {
            201: {
                "description": "Director created",
                "schema": {"$ref": "#/definitions/Director"},
            },
            400: {"description": "Missing required fields"},
        },
    },
    "update_director": {
        "tags": ["Directors"],
        "summary": "Update a director",
        "parameters": [
            {
                "name": "node_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The NodeID of the director to update",
            },
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "Name": {"type": "string"},
                        "DateOfBirth": {"type": "string", "format": "date"},
                        "Nationality": {"type": "string"},
                        "Awards": {"type": "string"},
                    },
                },
            },
        ],
        "responses": {
            200: {
                "description": "Director updated",
                "schema": {"$ref": "#/definitions/Director"},
            },
            404: {"description": "Director not found"},
        },
    },
    "delete_director": {
        "tags": ["Directors"],
        "summary": "Delete a director",
        "parameters": [
            {
                "name": "node_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The NodeID of the director to delete",
            }
        ],
        "responses": {
            200: {"description": "Director deleted"},
            404: {"description": "Director not found"},
        },
    },
    "get_directors_by_name": {
        "tags": ["Directors"],
        "summary": "Search directors by name (partial match)",
        "parameters": [
            {
                "name": "name",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "Partial or full name to search for",
            }
        ],
        "responses": {
            200: {
                "description": "List of matching directors",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Director"}},
            }
        },
    },
    "get_directors_by_nationality": {
        "tags": ["Directors"],
        "summary": "Get directors by nationality (partial match)",
        "parameters": [
            {
                "name": "nationality",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "Nationality to filter by",
            }
        ],
        "responses": {
            200: {
                "description": "List of matching directors",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Director"}},
            }
        },
    },
}

# ---------------------------------------------------------------------------
# Edges
# ---------------------------------------------------------------------------

EDGES = {
    "get_edges": {
        "tags": ["Edges"],
        "summary": "List edges with optional filters",
        "parameters": [
            {
                "name": "source",
                "in": "query",
                "type": "integer",
                "required": False,
                "description": "Filter by source NodeID",
            },
            {
                "name": "target",
                "in": "query",
                "type": "integer",
                "required": False,
                "description": "Filter by target NodeID",
            },
            {
                "name": "type",
                "in": "query",
                "type": "string",
                "required": False,
                "enum": ["ACTED_IN", "DIRECTED"],
                "description": "Filter by edge type",
            },
        ],
        "responses": {
            200: {
                "description": "A list of edges",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Edge"}},
            }
        },
    },
    "get_edge": {
        "tags": ["Edges"],
        "summary": "Get edge by ID",
        "parameters": [
            {
                "name": "edge_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The EdgeID",
            }
        ],
        "responses": {
            200: {
                "description": "Edge object",
                "schema": {"$ref": "#/definitions/Edge"},
            },
            404: {"description": "Edge not found"},
        },
    },
    "create_edge": {
        "tags": ["Edges"],
        "summary": "Create a new edge",
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "required": ["SourceNodeID", "TargetNodeID", "EdgeType"],
                    "properties": {
                        "SourceNodeID": {"type": "integer"},
                        "TargetNodeID": {"type": "integer"},
                        "EdgeType": {
                            "type": "string",
                            "enum": ["ACTED_IN", "DIRECTED"],
                        },
                        "Metadata": {
                            "type": "object",
                            "description": "Arbitrary JSON metadata",
                        },
                    },
                },
            }
        ],
        "responses": {
            201: {
                "description": "Edge created",
                "schema": {"$ref": "#/definitions/Edge"},
            },
            400: {"description": "Missing required fields"},
            404: {"description": "Source or target node not found"},
        },
    },
    "update_edge": {
        "tags": ["Edges"],
        "summary": "Update edge metadata",
        "parameters": [
            {
                "name": "edge_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The EdgeID to update",
            },
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "Metadata": {
                            "type": "object",
                            "description": "Arbitrary JSON metadata to replace existing metadata",
                        }
                    },
                },
            },
        ],
        "responses": {
            200: {
                "description": "Edge updated",
                "schema": {"$ref": "#/definitions/Edge"},
            },
            404: {"description": "Edge not found"},
        },
    },
    "delete_edge": {
        "tags": ["Edges"],
        "summary": "Delete an edge",
        "parameters": [
            {
                "name": "edge_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The EdgeID to delete",
            }
        ],
        "responses": {
            200: {"description": "Edge deleted"},
            404: {"description": "Edge not found"},
        },
    },
}

# ---------------------------------------------------------------------------
# Co-Star Network
# ---------------------------------------------------------------------------

COSTAR = {
    "get_costar_network": {
        "tags": ["Co-Star"],
        "summary": "Get co-star network for an actor",
        "description": (
            "Given an ActorID, finds all movies they acted in, then finds all other "
            "actors in those same movies. Each shared movie creates a co-star edge. "
            "Returns the center actor, all co-stars, and edges weighted by the number "
            "of shared movies."
        ),
        "parameters": [
            {
                "name": "actor_id",
                "in": "query",
                "type": "string",
                "required": True,
                "description": "The ActorID to build the co-star network around",
            }
        ],
        "responses": {
            200: {
                "description": "Co-star network",
                "schema": {
                    "type": "object",
                    "properties": {
                        "center": {"$ref": "#/definitions/Actor"},
                        "coStars": {
                            "type": "array",
                            "items": {
                                "allOf": [
                                    {"$ref": "#/definitions/Actor"},
                                    {
                                        "type": "object",
                                        "properties": {
                                            "sharedMovies": {
                                                "type": "integer",
                                                "description": "Number of movies shared with the center actor",
                                            }
                                        },
                                    },
                                ]
                            },
                        },
                        "edges": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "source": {"type": "integer", "description": "NodeID of the center actor"},
                                    "target": {"type": "integer", "description": "NodeID of the co-star"},
                                    "weight": {"type": "integer", "description": "Number of shared movies"},
                                },
                            },
                        },
                    },
                },
            },
            400: {"description": "Missing actor_id parameter"},
            404: {"description": "Actor not found"},
        },
    }
}

# ---------------------------------------------------------------------------
# Graphs
# ---------------------------------------------------------------------------

GRAPHS = {
    "get_graphs": {
        "tags": ["Graphs"],
        "summary": "List all graphs",
        "responses": {
            200: {
                "description": "A list of all graphs",
                "schema": {"type": "array", "items": {"$ref": "#/definitions/Graph"}},
            }
        },
    },
    "get_graph": {
        "tags": ["Graphs"],
        "summary": "Get a graph with its nodes and edges",
        "parameters": [
            {
                "name": "graph_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The GraphID",
            }
        ],
        "responses": {
            200: {
                "description": "Graph with nodes and edges",
                "schema": {"$ref": "#/definitions/GraphDetail"},
            },
            404: {"description": "Graph not found"},
        },
    },
    "create_graph": {
        "tags": ["Graphs"],
        "summary": "Create a new graph",
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "required": ["Name"],
                    "properties": {
                        "Name": {"type": "string"},
                        "Description": {"type": "string"},
                    },
                },
            }
        ],
        "responses": {
            201: {
                "description": "Graph created",
                "schema": {"$ref": "#/definitions/Graph"},
            },
            400: {"description": "Missing required fields"},
        },
    },
    "delete_graph": {
        "tags": ["Graphs"],
        "summary": "Delete a graph",
        "parameters": [
            {
                "name": "graph_id",
                "in": "path",
                "type": "integer",
                "required": True,
                "description": "The GraphID to delete",
            }
        ],
        "responses": {
            200: {"description": "Graph deleted"},
            404: {"description": "Graph not found"},
        },
    },
    "add_node_to_graph": {
        "tags": ["Graphs"],
        "summary": "Add a node to a graph",
        "parameters": [
            {"name": "graph_id", "in": "path", "type": "integer", "required": True},
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "required": ["NodeID"],
                    "properties": {"NodeID": {"type": "integer"}},
                },
            },
        ],
        "responses": {
            200: {"description": "Node added to graph"},
            404: {"description": "Graph or node not found"},
        },
    },
    "remove_node_from_graph": {
        "tags": ["Graphs"],
        "summary": "Remove a node from a graph",
        "parameters": [
            {"name": "graph_id", "in": "path", "type": "integer", "required": True},
            {"name": "node_id", "in": "path", "type": "integer", "required": True},
        ],
        "responses": {
            200: {"description": "Node removed from graph"},
            404: {"description": "Graph or node not found"},
        },
    },
    "add_edge_to_graph": {
        "tags": ["Graphs"],
        "summary": "Add an edge to a graph",
        "parameters": [
            {"name": "graph_id", "in": "path", "type": "integer", "required": True},
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "required": ["EdgeID"],
                    "properties": {"EdgeID": {"type": "integer"}},
                },
            },
        ],
        "responses": {
            200: {"description": "Edge added to graph"},
            404: {"description": "Graph or edge not found"},
        },
    },
    "remove_edge_from_graph": {
        "tags": ["Graphs"],
        "summary": "Remove an edge from a graph",
        "parameters": [
            {"name": "graph_id", "in": "path", "type": "integer", "required": True},
            {"name": "edge_id", "in": "path", "type": "integer", "required": True},
        ],
        "responses": {
            200: {"description": "Edge removed from graph"},
            404: {"description": "Graph or edge not found"},
        },
    },
    "costar_network": {
        "tags": ["Graphs"],
        "summary": "Build a co-star network graph for an actor",
        "parameters": [
            {
                "name": "actorId",
                "in": "query",
                "type": "string",
                "required": True,
                "description": "The ActorID to build the co-star network around",
            }
        ],
        "responses": {
            201: {
                "description": "Co-star network graph created",
                "schema": {"$ref": "#/definitions/GraphDetail"},
            },
            400: {"description": "Missing actorId parameter"},
            404: {"description": "Actor not found"},
        },
    },
    "star_power": {
        "tags": ["Graphs"],
        "summary": "Build a star power index graph",
        "parameters": [
            {
                "name": "threshold",
                "in": "query",
                "type": "integer",
                "required": False,
                "description": "Minimum number of movies an actor must appear in to be included",
            }
        ],
        "responses": {
            201: {
                "description": "Star power index graph created",
                "schema": {"$ref": "#/definitions/GraphDetail"},
            },
        },
    },
    "prestige_network": {
        "tags": ["Graphs"],
        "summary": "Build a prestige network graph",
        "responses": {
            201: {
                "description": "Prestige network graph created",
                "schema": {"$ref": "#/definitions/GraphDetail"},
            },
        },
    },
}
