// this is the page for displaying the directors in the database
import { useState } from "react";
import "../my_style.css";

interface Director {
  Awards: string;
  DateOfBirth: string;
  Name: string;
  Nationality: string;
  NodeID: number;
}

export default function Directors() {
  const [directors, setDirectors] = useState<Director[]>([]);

  const fetchDirectors = () => {
    fetch("/api/directors/")
      .then((res) => res.json())
      .then((data) => setDirectors(data));
  };

  return (
    <>
      <h1>EMDB</h1>
      <button onClick={fetchDirectors}>Load Directors</button>
      <ul>
        {directors.map((director) => (
          <li key={director.NodeID}>
            {director.Name} — {director.Nationality}
          </li>
        ))}
      </ul>
    </>
  );
}
