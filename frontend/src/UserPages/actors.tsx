// this is the page for displaying the actors in the database
import { useState } from "react";
import "../my_style.css";

// CREATE TABLE IF NOT EXISTS Actor (
//     NodeID      INT NOT NULL,
//     ActorID     VARCHAR(50) NOT NULL UNIQUE,
//     Name        VARCHAR(255) NOT NULL,
//     DateOfBirth DATE,
//     Nationality VARCHAR(100),
//     PRIMARY KEY (NodeID),
//     FOREIGN KEY (NodeID) REFERENCES Nodes(NodeID) ON DELETE CASCADE
// );

interface Actor {
  NodeID: number;
  ActorID: string;
  DateOfBirth: string;
  Name: string;
  Nationality: string;
}

export default function Actors() {
  const [actors, setActors] = useState<Actor[]>([]);

  const fetchActors = () => {
    fetch("/api/actors/")
      .then((res) => res.json())
      .then((data) => setActors(data));
  };

  return (
    <>
      <h1>EMDB</h1>
      <button onClick={fetchActors}>Load Actors</button>
      <ul>
        {actors.map((actor) => (
          <li key={actor.NodeID}>
            {actor.Name} — {actor.Nationality}
          </li>
        ))}
      </ul>
    </>
  );
}
