// this is the page for displaying the actors in the database
import { useState, useEffect, useMemo } from "react";
import "../my_style.css";

interface Actor {
  NodeID: number;
  ActorID: string;
  Name: string;
  DateOfBirth: string;
  Nationality: string;
}

export default function Actors() {
  const [allActors, setAllActors] = useState<Actor[]>([]);
  const [results, setResults] = useState<Actor[] | null>(null);
  const [search, setSearch] = useState("");
  const [nationality, setNationality] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => setResults(Array.isArray(data) ? data : [data]))
      .catch(() => setError("Search failed"))
      .finally(() => setLoading(false));
  };

  const handleNationalityChange = (selected: string) => {
    setNationality(selected);
    setSearch("");
    setError("");
    if (selected === "All") {
      setResults(null);
      return;
    }
    setLoading(true);
    fetch(`/api/actors/nationality/${encodeURIComponent(selected)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => setResults(data))
      .catch(() => setError("Failed to filter by nationality"))
      .finally(() => setLoading(false));
  };

  const clear = () => {
    setSearch("");
    setNationality("All");
    setResults(null);
    setError("");
  };

  const displayed = results ?? allActors;

  return (
    <div>
      <h1>Actors</h1>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ padding: "0.5rem", width: "280px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button onClick={handleSearch} disabled={loading || !search.trim()} style={{ padding: "0.5rem 1rem" }}>
          Search
        </button>
        <select
          value={nationality}
          onChange={(e) => handleNationalityChange(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          {nationalities.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        {(search || nationality !== "All") && (
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
      {!loading && displayed.length === 0 && <p style={{ color: "#888" }}>No actors found.</p>}

      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {displayed.map((actor) => (
          <li
            key={actor.NodeID}
            style={{ padding: "0.75rem 1rem", border: "1px solid #ddd", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <strong>{actor.Name}</strong>
            <div style={{ fontSize: "0.85rem", color: "#666", display: "flex", gap: "1rem" }}>
              {actor.Nationality && <span>{actor.Nationality}</span>}
              {actor.DateOfBirth && <span>{actor.DateOfBirth.slice(0, 4)}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
