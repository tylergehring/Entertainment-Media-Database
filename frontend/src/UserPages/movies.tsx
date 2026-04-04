// This is the page that displays the movies in the database
import { useState, useEffect, useMemo } from "react";
import "../my_style.css";

interface Movie {
  NodeID: number;
  MovieID: string;
  Title: string;
  Rating: string;
  ReleaseDate: string;
  Genre: string;
  Runtime: number;
}

export default function Movies() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [results, setResults] = useState<Movie[] | null>(null);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load all movies on mount to populate genre dropdown
  useEffect(() => {
    setLoading(true);
    fetch("/api/movies/")
      .then((res) => res.json())
      .then((data) => setAllMovies(data))
      .catch(() => setError("Failed to load movies"))
      .finally(() => setLoading(false));
  }, []);

  const genres = useMemo(() => {
    const unique = Array.from(new Set(allMovies.map((m) => m.Genre).filter(Boolean))).sort();
    return ["All", ...unique];
  }, [allMovies]);

  const handleSearch = () => {
    if (!search.trim()) return;
    setLoading(true);
    setError("");
    setGenre("All");
    fetch(`/api/movies/name/${encodeURIComponent(search.trim())}`)
      .then((res) => {
        if (res.status === 404) return [];
        if (!res.ok) throw new Error("Request failed");
        return res.json().then((data: Movie | Movie[]) => Array.isArray(data) ? data : [data]);
      })
      .then((data) => setResults(data))
      .catch(() => setError("Search failed"))
      .finally(() => setLoading(false));
  };

  const handleGenreChange = (selected: string) => {
    setGenre(selected);
    setSearch("");
    setError("");
    if (selected === "All") {
      setResults(null);
      return;
    }
    setLoading(true);
    fetch(`/api/movies/genre/${encodeURIComponent(selected)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => setResults(data))
      .catch(() => setError("Failed to filter by genre"))
      .finally(() => setLoading(false));
  };

  const clear = () => {
    setSearch("");
    setGenre("All");
    setResults(null);
    setError("");
  };

  const displayed = results ?? allMovies;

  return (
    <div>
      <h1>Movies</h1>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ padding: "0.5rem", width: "280px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button onClick={handleSearch} disabled={loading || !search.trim()} style={{ padding: "0.5rem 1rem" }}>
          Search
        </button>
        <select
          value={genre}
          onChange={(e) => handleGenreChange(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        {(search || genre !== "All") && (
          <button onClick={clear} style={{ padding: "0.5rem 1rem", background: "none", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}>
            Clear
          </button>
        )}
        <span style={{ fontSize: "0.85rem", color: "#888" }}>
          {displayed.length} result{displayed.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && displayed.length === 0 && <p style={{ color: "#888" }}>No movies found.</p>}

      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {displayed.map((movie) => (
          <li
            key={movie.NodeID}
            style={{ padding: "0.75rem 1rem", border: "1px solid #ddd", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <strong>{movie.Title}</strong>
              <span style={{ marginLeft: "0.75rem", fontSize: "0.85rem", color: "#888" }}>{movie.Genre}</span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#666", display: "flex", gap: "1rem" }}>
              {movie.Rating && <span>⭐ {movie.Rating}</span>}
              {movie.Runtime && <span>{movie.Runtime} min</span>}
              {movie.ReleaseDate && <span>{movie.ReleaseDate.slice(0, 4)}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
