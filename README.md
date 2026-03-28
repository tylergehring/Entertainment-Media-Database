# Entertainment Media Database (EMDB)

EMDB is a graph-based media database that visualizes relationships between actors, directors, and movies. Inspired by IMDB, EMDB focuses on representing entertainment data as a connected network, allowing users to explore how people and films are related through an interactive graph interface.

The system stores media information in a structured database and exposes it through a REST API. A web frontend renders the data as a dynamic graph, enabling users to easily discover connections such as shared actors, director collaborations, and film relationships.

### Run

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MySQL: localhost:3306
- Api Docs http://localhost:5000/apidocs/

### Reset the database

To wipe the database and re-run schema + seed data:

```bash


```

## Development

All development should be done inside the dev container:

1. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension in VS Code
2. Open the command palette (`Ctrl+Shift+P`) and select **Reopen in Container**

> **Adding dependencies:** Python packages go in `requirements.txt`. Frontend packages should be installed with `npm install` inside the container.

**Application Will Start Automatically** when the devcontainer starts up

### REST API DOCUMENTATION

Rest API is Documented with the swagger client. Docs can be found at http://localhost:5000/apidocs/
