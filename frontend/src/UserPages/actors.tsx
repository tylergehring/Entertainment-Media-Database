// this is the page for displaying the actors in the database
import { useState, useEffect, useMemo } from "react";
import "../my_style.css";

interface Actor {
  NodeID: number;
  ActorID: string;
  Name: string;
  DateOfBirth: string;
  Nationality: string;
  PhotoURL: string | null;
}

function SkeletonGrid() {
  return (
    <div className="cards-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="skeleton-card" key={i} style={{ animationDelay: `${i * 80}ms` }}>
          <div className="skeleton-avatar" />
          <div className="skeleton-info">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Actors() {
  const [allActors, setAllActors]   = useState<Actor[]>([]);
  const [results, setResults]       = useState<Actor[] | null>(null);
  const [search, setSearch]         = useState("");
  const [nationality, setNationality] = useState("All");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/actors/")
      .then((res) => res.json())
      .then((data) => setAllActors(data))
      .catch(() => setError("Failed to load actors"))
      .finally(() => setLoading(false));
  }, []);

  const nationalities = useMemo(() => {
    const unique = Array.from(new Set(allActors.map((a) => a.Nationality).filter(Boolean))).sort();
    return ["All", ...unique];
  }, [allActors]);

  const handleSearch = () => {
    if (!search.trim()) return;
    setLoading(true);
    setError("");
    setNationality("All");
    fetch(`/api/actors/name/${encodeURIComponent(search.trim())}`)
      .then((res) => { if (!res.ok) throw new Error("Request failed"); return res.json(); })
      .then((data) => setResults(Array.isArray(data) ? data : [data]))
      .catch(() => setError("Search failed"))
      .finally(() => setLoading(false));
  };

  const handleNationalityChange = (selected: string) => {
    setNationality(selected);
    setSearch("");
    setError("");
    if (selected === "All") { setResults(null); return; }
    setLoading(true);
    fetch(`/api/actors/nationality/${encodeURIComponent(selected)}`)
      .then((res) => { if (!res.ok) throw new Error("Request failed"); return res.json(); })
      .then((data) => setResults(data))
      .catch(() => setError("Failed to filter by nationality"))
      .finally(() => setLoading(false));
  };

  const clear = () => { setSearch(""); setNationality("All"); setResults(null); setError(""); };

  const displayed = results ?? allActors;

  return (
    <div>
      {/* Page header */}
      <div className="page-hero">
        <p className="page-eyebrow">Browse the database</p>
        <h1 className="page-title">Actors</h1>
        <p className="page-subtitle">Discover the talent behind the screen</p>
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
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch} disabled={loading || !search.trim()}>
            Search
          </button>
        </div>

        <select className="filter-select" value={nationality} onChange={(e) => handleNationalityChange(e.target.value)}>
          {nationalities.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>

        {(search || nationality !== "All") && (
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
        <p className="search-status">No actors found.</p>
      ) : (
        <div className="cards-grid">
          {displayed.map((actor, i) => (
            <div
              className="person-card"
              key={actor.NodeID}
              style={{ animationDelay: `${Math.min(i, 12) * 50}ms` }}
            >
              <div className="person-avatar">
                {actor.PhotoURL && (
                  <img className="person-photo" src={actor.PhotoURL} alt={actor.Name} loading="lazy" />
                )}
              </div>
              <div className="card-info">
                <h3 className="card-title">{actor.Name}</h3>
                <p className="card-nationality">
                  {actor.Nationality || ""}
                  {actor.Nationality && actor.DateOfBirth ? " · " : ""}
                  {actor.DateOfBirth ? new Date(actor.DateOfBirth).getFullYear() : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
