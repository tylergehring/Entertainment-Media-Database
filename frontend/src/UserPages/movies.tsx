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
  PosterURL: string | null;
}

function SkeletonGrid() {
  return (
    <div className="cards-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="skeleton-card" key={i} style={{ animationDelay: `${i * 80}ms` }}>
          <div className="skeleton-poster" />
          <div className="skeleton-info">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Movies() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [results, setResults]     = useState<Movie[] | null>(null);
  const [search, setSearch]       = useState("");
  const [genre, setGenre]         = useState("All");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

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
        return res.json().then((data: Movie | Movie[]) => (Array.isArray(data) ? data : [data]));
      })
      .then((data) => setResults(data))
      .catch(() => setError("Search failed"))
      .finally(() => setLoading(false));
  };

  const handleGenreChange = (selected: string) => {
    setGenre(selected);
    setSearch("");
    setError("");
    if (selected === "All") { setResults(null); return; }
    setLoading(true);
    fetch(`/api/movies/genre/${encodeURIComponent(selected)}`)
      .then((res) => { if (!res.ok) throw new Error("Request failed"); return res.json(); })
      .then((data) => setResults(data))
      .catch(() => setError("Failed to filter by genre"))
      .finally(() => setLoading(false));
  };

  const clear = () => { setSearch(""); setGenre("All"); setResults(null); setError(""); };

  const displayed = results ?? allMovies;

  return (
    <div>
      {/* Page header */}
      <div className="page-hero">
        <p className="page-eyebrow">Browse the database</p>
        <h1 className="page-title">Movies</h1>
        <p className="page-subtitle">Explore our complete film catalogue</p>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-bar" style={{ maxWidth: 400 }}>
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch} disabled={loading || !search.trim()}>
            Search
          </button>
        </div>

        <select className="filter-select" value={genre} onChange={(e) => handleGenreChange(e.target.value)}>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>

        {(search || genre !== "All") && (
          <button className="clear-btn" onClick={clear}>Clear</button>
        )}

        <span className="filter-count">
          {!loading && `${displayed.length} result${displayed.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {error && <p className="page-error">{error}</p>}

      {loading ? (
        <SkeletonGrid />
      ) : displayed.length === 0 ? (
        <p className="search-status">No movies found.</p>
      ) : (
        <div className="cards-grid">
          {displayed.map((movie, i) => (
            <div
              className="movie-card"
              key={movie.NodeID}
              style={{ animationDelay: `${Math.min(i, 12) * 50}ms` }}
            >
              <div className={`card-poster${movie.PosterURL ? " has-image" : ""}`}>
                {movie.PosterURL && (
                  <img className="card-poster-img" src={movie.PosterURL} alt={movie.Title} loading="lazy" />
                )}
                <span className="card-genre">{movie.Genre || "—"}</span>
                {movie.Rating && <div className="card-rating">★ {movie.Rating}</div>}
              </div>
              <div className="card-info">
                <h3 className="card-title">{movie.Title}</h3>
                <p className="card-year">
                  {movie.ReleaseDate ? new Date(movie.ReleaseDate).getFullYear() : ""}
                  {movie.ReleaseDate && movie.Runtime ? " · " : ""}
                  {movie.Runtime ? `${movie.Runtime} min` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
