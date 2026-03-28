// This is the page that displays the movies in the database

import { useState } from "react";
import "../my_style.css";

interface Movie {
  Genre: string;
  MovieID: string;
  NodeID: number;
  Rating: string;
  ReleaseDate: string;
  Runtime: number;
  Title: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchMovies = () => {
    fetch("/api/movies/")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  };

  return (
    <>
      <h1>EMDB</h1>
      <button onClick={fetchMovies}>Load Movies</button>
      <ul>
        {movies.map((movie) => (
          <li key={movie.NodeID}>
            {movie.Title} — {movie.Genre}
          </li>
        ))}
      </ul>
    </>
  );
}
