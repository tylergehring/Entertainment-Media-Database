// this is the page for displaying the directors in the database
// import { useState } from "react";
import "../my_style.css";

// CREATE TABLE IF NOT EXISTS Director (
//     NodeID      INT NOT NULL,
//     DirectorID  VARCHAR(50) NOT NULL UNIQUE,
//     Name        VARCHAR(255) NOT NULL,
//     DateOfBirth DATE,
//     Nationality VARCHAR(100),
//     Awards      VARCHAR(255),
//     PRIMARY KEY (NodeID),
//     FOREIGN KEY (NodeID) REFERENCES Nodes(NodeID) ON DELETE CASCADE
// );

// interface Director {
//   NodeID: number;
//   DirectorID: string;
//   Name: string;
//   DateOfBirth: string;
//   Nationality: string;
//   Awards: string;
// }

export default function Directors() {
  // const [directors, setDirectors] = useState<Director[]>([]);

  // const fetchDirectors = () => {
  //   fetch("/api/directors/")
  //     .then((res) => res.json())
  //     .then((data) => setDirectors(data));
  // };

  return (
    <>
      <h1>Directors not yet implemented</h1>
      {/* <button onClick={fetchDirectors}>Load Directors</button>
      <ul>
        {directors.map((director) => (
          <li key={director.NodeID}>
            {director.Name} — {director.Nationality}
          </li>
        ))}
      </ul> */}
    </>
  );
}
