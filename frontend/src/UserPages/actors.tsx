// this is the page for displaying the actors in the database
import { useState } from "react";
import "../my_style.css";

interface Actor {
  ActorID: string;
  DateOfBirth: string;
  Name: string;
  Nationality: string;
  NodeID: number;
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
