// home page
import { useState } from "react";
import "../my_style.css";

// temperary, for exmample
const featured = [
  { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 8.8 },
  { id: 2, title: "The Godfather", year: 1972, genre: "Crime", rating: 9.2 },
  { id: 3, title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: 8.6 },
  { id: 4, title: "Parasite", year: 2019, genre: "Thriller", rating: 8.5 },
  { id: 5, title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0 },
  { id: 6, title: "Pulp Fiction", year: 1994, genre: "Crime", rating: 8.9 },
];

type Movie = {
  NodeID: number;
  Title: string;
  Genre: string | null;
  Rating: string | null;
  ReleaseDate: string | null;
};
type Person = { NodeID: number; Name: string; Nationality: string | null };

// temperary, will updated
//const navLinks = ["Movies", "Actors", "Directors"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [actors, setActors] = useState<Person[]>([]);
  const [directors, setDirectors] = useState<Person[]>([]);
  // const [activeNav, setActiveNav] = useState("Movies");

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
      {/* Nav
      <header className="emdb-header">
        <div className="emdb-logo">EMDB</div>
        <nav className="emdb-nav">
          {navLinks.map((link) => (
            <button
              key={link}
              className={`nav-link ${activeNav === link ? "active" : ""}`}
              onClick={() => setActiveNav(link)}
            >
              {link}
            </button>
          ))}
        </nav>
      </header> */}

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
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
        </div>
      </section>

      {/* Search Results */}
      {searched && (
        <section className="emdb-featured">
          {loading ? (
            <p className="search-status">Searching…</p>
          ) : movies.length === 0 &&
            actors.length === 0 &&
            directors.length === 0 ? (
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
                      <div
                        className="movie-card"
                        key={movie.NodeID}
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="card-poster">
                          <span className="card-genre">
                            {movie.Genre ?? "—"}
                          </span>
                          {movie.Rating && (
                            <div className="card-rating">★ {movie.Rating}</div>
                          )}
                        </div>
                        <div className="card-info">
                          <h3 className="card-title">{movie.Title}</h3>
                          {movie.ReleaseDate && (
                            <p className="card-year">
                              {movie.ReleaseDate.slice(0, 4)}
                            </p>
                          )}
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
                      <div
                        className="person-card"
                        key={actor.NodeID}
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="person-avatar" />
                        <div className="card-info">
                          <h3 className="card-title">{actor.Name}</h3>
                          {actor.Nationality && (
                            <p className="card-year">{actor.Nationality}</p>
                          )}
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
                      <div
                        className="person-card"
                        key={director.NodeID}
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="person-avatar" />
                        <div className="card-info">
                          <h3 className="card-title">{director.Name}</h3>
                          {director.Nationality && (
                            <p className="card-year">{director.Nationality}</p>
                          )}
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

      {/* Featured */}
      {!searched && (
        <section className="emdb-featured">
          <div className="section-header">
            <h2 className="section-title">Featured Titles</h2>
            <span className="section-line" />
          </div>
          <div className="cards-grid">
            {featured.map((movie, i) => (
              <div
                className="movie-card"
                key={movie.id}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="card-poster">
                  <span className="card-genre">{movie.genre}</span>
                  <div className="card-rating">★ {movie.rating}</div>
                </div>
                <div className="card-info">
                  <h3 className="card-title">{movie.title}</h3>
                  <p className="card-year">{movie.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
