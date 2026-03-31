// This is the page that displays the movies in the database

//import { useState } from "react";
import "../my_style.css";

// CREATE TABLE IF NOT EXISTS Movie (
//     NodeID      INT NOT NULL,
//     MovieID     VARCHAR(50) NOT NULL UNIQUE,
//     Title       VARCHAR(255) NOT NULL,
//     Rating      VARCHAR(10),
//     ReleaseDate DATE,
//     Genre       VARCHAR(100),
//     Runtime     INT,
//     PRIMARY KEY (NodeID),
//     FOREIGN KEY (NodeID) REFERENCES Nodes(NodeID) ON DELETE CASCADE
// );

// interface Movie {
//   NodeID: number;
//   MovieID: string;
//   Title: string;
//   Rating: string;
//   ReleaseDate: string;
//   Genre: string;
//   Runtime: number;
// }

export default function Movies() {
  // const [movies, setMovies] = useState<Movie[]>([]);

  // const fetchMovies = () => {
  //   fetch("/api/movies/")
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data));
  // };

  return (
    <>
      <h1>Movies not yet implemented</h1>
      {/* <button onClick={fetchMovies}>Load Movies</button>
      <ul>
        {movies.map((movie) => (
          <li key={movie.NodeID}>
            {movie.Title} — {movie.Genre}
          </li>
        ))}
      </ul> */}
    </>
  );
}
