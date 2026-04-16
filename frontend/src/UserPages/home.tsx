// home page
import { useState, useEffect } from "react";
import "../my_style.css";

type Movie  = { NodeID: number; Title: string; Genre: string | null; Rating: string | null; ReleaseDate: string | null; PosterURL: string | null; };
type Person = { NodeID: number; Name: string; Nationality: string | null };

export default function Home() {
  const [query, setQuery]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [movies, setMovies]     = useState<Movie[]>([]);
  const [actors, setActors]     = useState<Person[]>([]);
  const [directors, setDirectors] = useState<Person[]>([]);

  // Live stats + featured titles
  const [allMovies, setAllMovies]       = useState<Movie[]>([]);
  const [actorCount, setActorCount]     = useState<number | null>(null);
  const [directorCount, setDirectorCount] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/movies/").then((r) => r.json()),
      fetch("/api/actors/").then((r) => r.json()),
      fetch("/api/directors/").then((r) => r.json()),
    ])
      .then(([m, a, d]) => {
        setAllMovies(Array.isArray(m) ? m : []);
        setActorCount(Array.isArray(a) ? a.length : 0);
        setDirectorCount(Array.isArray(d) ? d.length : 0);
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  // Top-rated movies for the featured section
  const featured = allMovies
    .filter((m) => m.Rating)
    .sort((a, b) => parseFloat(b.Rating!) - parseFloat(a.Rating!))
    .slice(0, 6);

  async function handleSearch() {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    try {
      const [moviesRes, actorsRes, directorsRes] = await Promise.all([
        fetch(`/api/movies/search?title=${encodeURIComponent(q)}`),
        fetch(`/api/actors/search?name=${encodeURIComponent(q)}`),
        fetch(`/api/directors/search?name=${encodeURIComponent(q)}`),
      ]);
      const [moviesData, actorsData, directorsData] = await Promise.all([
        moviesRes.json(),
        actorsRes.json(),
        directorsRes.json(),
      ]);
      setMovies(Array.isArray(moviesData) ? moviesData : []);
      setActors(Array.isArray(actorsData) ? actorsData : []);
      setDirectors(Array.isArray(directorsData) ? directorsData : []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="emdb-home">
      {/* Hero */}
      <section className="emdb-hero">
        <div className="hero-noise" />
        <div className="hero-content">
          <p className="hero-eyebrow">The Entertainment Media Database</p>
          <h1 className="hero-title">
            Every film.
            <br />
            Every story.
            <br />
            Every star.
          </h1>
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search movies, actors, directors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="search-input"
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>

          {/* Stats bar */}
          {!statsLoading && (
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-value">{allMovies.length}</span>
                <span className="stat-label">Films</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{actorCount ?? "—"}</span>
                <span className="stat-label">Actors</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{directorCount ?? "—"}</span>
                <span className="stat-label">Directors</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      {searched && (
        <section className="emdb-featured">
          {loading ? (
            <p className="search-status">Searching…</p>
          ) : movies.length === 0 && actors.length === 0 && directors.length === 0 ? (
            <p className="search-status">No results for "{query}"</p>
          ) : (
            <>
              {movies.length > 0 && (
                <>
                  <div className="section-header">
                    <h2 className="section-title">Movies</h2>
                    <span className="section-line" />
                  </div>
                  <div className="cards-grid" style={{ marginBottom: "3rem" }}>
                    {movies.map((movie, i) => (
                      <div className="movie-card" key={movie.NodeID} style={{ animationDelay: `${i * 60}ms` }}>
                        <div className={`card-poster${movie.PosterURL ? " has-image" : ""}`}>
                          
                          {movie.PosterURL && (
                            <img className="card-poster-img" src={movie.PosterURL} alt={movie.Title} loading="lazy" />
                          )}
                          <span className="card-genre">{movie.Genre ?? "—"}</span>
                          {movie.Rating && <div className="card-rating">★ {movie.Rating}</div>}
                        </div>
                        <div className="card-info">
                          <h3 className="card-title">{movie.Title}</h3>
                          {movie.ReleaseDate && <p className="card-year">{movie.ReleaseDate.slice(0, 4)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {actors.length > 0 && (
                <>
                  <div className="section-header">
                    <h2 className="section-title">Actors</h2>
                    <span className="section-line" />
                  </div>
                  <div className="cards-grid" style={{ marginBottom: "3rem" }}>
                    {actors.map((actor, i) => (
                      <div className="person-card" key={actor.NodeID} style={{ animationDelay: `${i * 60}ms` }}>
                        <div className="person-avatar" />
                        <div className="card-info">
                          <h3 className="card-title">{actor.Name}</h3>
                          {actor.Nationality && <p className="card-nationality">{actor.Nationality}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {directors.length > 0 && (
                <>
                  <div className="section-header">
                    <h2 className="section-title">Directors</h2>
                    <span className="section-line" />
                  </div>
                  <div className="cards-grid">
                    {directors.map((director, i) => (
                      <div className="person-card" key={director.NodeID} style={{ animationDelay: `${i * 60}ms` }}>
                        <div className="person-avatar" />
                        <div className="card-info">
                          <h3 className="card-title">{director.Name}</h3>
                          {director.Nationality && <p className="card-nationality">{director.Nationality}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </section>
      )}

      {/* Featured — top-rated from live data */}
      {!searched && (
        <section className="emdb-featured">
          <div className="section-header">
            <h2 className="section-title">Top Rated</h2>
            <span className="section-line" />
          </div>
          {statsLoading ? (
            <div className="cards-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="skeleton-card" key={i} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="skeleton-poster" />
                  <div className="skeleton-info">
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cards-grid">
              {featured.map((movie, i) => (
                <div className="movie-card" key={movie.NodeID} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={`card-poster${movie.PosterURL ? " has-image" : ""}`}>
                    {movie.PosterURL && (
                      <img className="card-poster-img" src={movie.PosterURL} alt={movie.Title} loading="lazy" />
                    )}
                    <span className="card-genre">{movie.Genre ?? "—"}</span>
                    {movie.Rating && <div className="card-rating">★ {movie.Rating}</div>}
                  </div>
                  <div className="card-info">
                    <h3 className="card-title">{movie.Title}</h3>
                    <p className="card-year">{movie.ReleaseDate ? new Date(movie.ReleaseDate).getFullYear() : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
