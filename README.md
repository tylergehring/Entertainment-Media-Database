# Entertainment Media Database (EMDB)

EMDB is a graph-based media database that visualizes relationships between actors, directors, and movies. Inspired by IMDB, EMDB focuses on representing entertainment data as a connected network, allowing users to explore how people and films are related through an interactive graph interface.

The system stores media information in a structured database and exposes it through a REST API. A web frontend renders the data as a dynamic graph, enabling users to easily discover connections such as shared actors, director collaborations, and film relationships.



### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Run the project

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MySQL: localhost:3306

### Reset the database

To wipe the database and re-run schema + seed data:

```bash
docker compose down -v && docker compose up --build
```