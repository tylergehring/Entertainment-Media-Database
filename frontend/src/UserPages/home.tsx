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

// temperary, will updated
//const navLinks = ["Movies", "Actors", "Directors"];

export default function Home() {
  const [query, setQuery] = useState("");
  // const [activeNav, setActiveNav] = useState("Movies");

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
              className="search-input"
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </section>

      {/* Featured */}
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
    </div>
  );
}
