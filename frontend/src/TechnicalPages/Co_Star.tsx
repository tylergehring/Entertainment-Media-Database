import { useState, useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "../my_style.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Actor {
  NodeID: number; ActorID: string; Name: string;
  DateOfBirth: string; Nationality: string; PhotoURL?: string | null;
}
interface CoStarActor extends Actor { sharedMovies: number; }
interface CoStarResponse {
  center: Actor;
  coStars: CoStarActor[];
  edges: { source: number; target: number; weight: number }[];
}
interface StarPowerResponse {
  qualifies: boolean;
  actors: { NodeID: number; ActorID: string; Name: string; StarPowerIndex: number }[];
  movies:  { NodeID: number; Title: string; Rating: string; actorNodeIds: number[] }[];
  directors: { NodeID: number; Name: string; PhotoURL?: string | null; movieNodeIds: number[] }[];
  edges: { edgeId: number; source: number; target: number; type: "ACTED_IN" | "DIRECTED" }[];
}
interface PrestigeResponse {
  prestigiousMovies:    { NodeID: number; Title: string; Rating: string; Genre: string }[];
  prestigiousActors:    { NodeID: number; ActorID: string; Name: string }[];
  prestigiousDirectors: { NodeID: number; Name: string; Awards: string; PhotoURL?: string | null }[];
  actedInEdges:  { EdgeID: number; actorNodeId: number; movieNodeId: number }[];
  directedEdges: { EdgeID: number; directorNodeId: number; movieNodeId: number }[];
}
interface CastActor {
  NodeID: number; ActorID: string; Name: string; Nationality: string; PhotoURL?: string | null;
}

// A selected node is either an actor (numeric ID) or a movie (string "m-N")
type SelectedNode =
  | { type: "actor"; nodeId: number; label: string }
  | { type: "movie"; movieNodeId: number; label: string };

// ---------------------------------------------------------------------------
// Shared panel styles
// ---------------------------------------------------------------------------

const personNode = (
  id: number | string, label: string, color: string, size: number,
  photoUrl?: string | null, title?: string
): Record<string, unknown> =>
  photoUrl
    ? { id, label, title: title ?? "Click to select", shape: "circularImage", image: photoUrl, size: size + 8, borderWidth: 3, color: { border: color }, font: { color: "#fff", strokeWidth: 2, strokeColor: "#000" } }
    : { id, label, title: title ?? "Click to select", shape: "dot", color, font: { color: "#fff" }, size };

const actionCard = (done: boolean): React.CSSProperties => ({
  flex: "1 1 240px",
  padding: "0.9rem 1rem",
  background: done ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
  border: `1px solid ${done ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)"}`,
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
});

const actionBtn = (done: boolean, disabled: boolean): React.CSSProperties => ({
  padding: "0.4rem 0.8rem",
  border: "none",
  borderRadius: "4px",
  cursor: disabled ? "default" : "pointer",
  background: done ? "#2d4a2d" : disabled ? "#333" : "#3a3a5c",
  color: done ? "#7ec87e" : disabled ? "#666" : "#c5c5f5",
  fontSize: "0.85rem",
  fontWeight: 600,
  alignSelf: "flex-start",
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Co_Star() {
  // Search
  const [actorName, setActorName]         = useState("");
  const [suggestions, setSuggestions]     = useState<Actor[]>([]);
  const [showSuggestions, setShowSugg]    = useState(false);

  // Controls
  const [threshold, setThreshold]   = useState(5);
  const [minRating, setMinRating]   = useState(8.5);
  const [awardDirs, setAwardDirs]   = useState(true);
  const [genre, setGenre]           = useState("");
  const [genres, setGenres]         = useState<string[]>([]);

  // UI state
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [selected, setSelected]     = useState<SelectedNode | null>(null);

  // Track which nodes have had each action applied
  const [expandedSet, setExpandedSet]         = useState(new Set<number>());
  const [spDoneSet, setSpDoneSet]             = useState(new Set<number>());
  const [prestigeDoneSet, setPrestigeDoneSet] = useState(new Set<number>());
  const [castDoneSet, setCastDoneSet]         = useState(new Set<number>());

  // Graph refs
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef   = useRef<Network | null>(null);
  const nodesRef     = useRef(new DataSet<any>());
  const edgesRef     = useRef(new DataSet<any>());
  const actorMapRef  = useRef(new Map<number, string>()); // NodeID -> ActorID

  useEffect(() => {
    fetch("/api/prestige-network/genres")
      .then((r) => r.ok ? r.json() : [])
      .then((g: string[]) => setGenres(g))
      .catch(() => {});
  }, []);

  // ---------------------------------------------------------------------------
  // Network init
  // ---------------------------------------------------------------------------

  const initNetwork = () => {
    if (!containerRef.current) return;
    if (networkRef.current) networkRef.current.destroy();

    networkRef.current = new Network(
      containerRef.current,
      { nodes: nodesRef.current, edges: edgesRef.current },
      {
        physics: { solver: "forceAtlas2Based" },
        edges: {
          scaling: { min: 1, max: 6 },
          color: { color: "#aaa" },
          font: { size: 11, color: "#fff", strokeWidth: 2, strokeColor: "#000" },
        },
        nodes: { shape: "dot", borderWidth: 0 },
        interaction: { hover: true, tooltipDelay: 100 },
      }
    );

    networkRef.current.on("click", (params: any) => {
      if (params.nodes?.length > 0) {
        const nodeId = params.nodes[0];
        if (typeof nodeId === "number") {
          const node = nodesRef.current.get(nodeId) as any;
          setSelected({ type: "actor", nodeId, label: node?.label?.split("\n")[0] ?? "Actor" });
        } else if (typeof nodeId === "string" && nodeId.startsWith("m-")) {
          const movieNodeId = parseInt(nodeId.slice(2));
          const node = nodesRef.current.get(nodeId) as any;
          setSelected({ type: "movie", movieNodeId, label: node?.label?.split("\n")[0] ?? "Movie" });
        }
      } else {
        setSelected(null);
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Co-star fetch / merge
  // ---------------------------------------------------------------------------

  const mergeCoStars = (data: CoStarResponse, isInitial: boolean) => {
    const { center, coStars, edges } = data;

    if (nodesRef.current.get(center.NodeID)) {
      nodesRef.current.update({ id: center.NodeID, color: center.PhotoURL ? { border: "#27ae60" } : "#27ae60", size: center.PhotoURL ? 32 : 24 });
    } else {
      nodesRef.current.add(personNode(
        center.NodeID, center.Name,
        isInitial ? "#e8a838" : "#27ae60",
        isInitial ? 30 : 24,
        center.PhotoURL, "Click to see options"
      ));
    }
    actorMapRef.current.set(center.NodeID, center.ActorID);
    setExpandedSet((prev) => new Set([...prev, center.NodeID]));

    coStars.forEach((cs) => {
      if (!nodesRef.current.get(cs.NodeID)) {
        nodesRef.current.add(personNode(
          cs.NodeID, cs.Name, "#4a90d9", 20, cs.PhotoURL,
          `Click to select · ${cs.sharedMovies} shared movie${cs.sharedMovies > 1 ? "s" : ""}`
        ));
        actorMapRef.current.set(cs.NodeID, cs.ActorID);
      }
    });

    edges.forEach((e) => {
      const id = `${Math.min(e.source, e.target)}-${Math.max(e.source, e.target)}`;
      if (!edgesRef.current.get(id)) {
        edgesRef.current.add({
          id, from: e.source, to: e.target,
          value: e.weight,
          length: Math.max(80, 300 / e.weight),
          label: String(e.weight),
          title: `${e.weight} shared movie${e.weight > 1 ? "s" : ""}`,
        });
      }
    });
  };

  const fetchCoStar = (id: string, isInitial: boolean) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    fetch(`/api/costar/?actor_id=${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "Actor not found" : "Request failed");
        return res.json() as Promise<CoStarResponse>;
      })
      .then((data) => {
        if (isInitial) {
          nodesRef.current.clear();
          edgesRef.current.clear();
          actorMapRef.current.clear();
          setExpandedSet(new Set());
          setSpDoneSet(new Set());
          setPrestigeDoneSet(new Set());
          setCastDoneSet(new Set());
          setSelected(null);
          mergeCoStars(data, true);
          initNetwork();
        } else {
          mergeCoStars(data, false);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // ---------------------------------------------------------------------------
  // Search / suggestions
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const trimmed = actorName.trim();
    if (trimmed.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    const timer = setTimeout(() => {
      fetch(`/api/actors/name/${encodeURIComponent(trimmed)}`)
        .then((r) => r.ok ? r.json() : [])
        .then((actors: Actor[]) => { setSuggestions(actors); setShowSugg(actors.length > 0); })
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [actorName]);

  const handleSelectSuggestion = (actor: Actor) => {
    setActorName(actor.Name);
    setSuggestions([]);
    setShowSugg(false);
    setError("");
    fetchCoStar(actor.ActorID, true);
  };

  const handleSearch = () => {
    if (!actorName.trim()) return;
    if (suggestions.length === 1) { handleSelectSuggestion(suggestions[0]); return; }
    if (suggestions.length > 1) { setShowSugg(true); return; }
    setLoading(true);
    setError("");
    fetch(`/api/actors/name/${encodeURIComponent(actorName.trim())}`)
      .then((r) => r.ok ? r.json() : Promise.reject(new Error("Search failed")))
      .then((actors: Actor[]) => {
        if (actors.length === 0) setError("No actors found with that name.");
        else if (actors.length === 1) fetchCoStar(actors[0].ActorID, true);
        else { setSuggestions(actors); setShowSugg(true); }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // ---------------------------------------------------------------------------
  // Panel actions — actor nodes
  // ---------------------------------------------------------------------------

  const handleExpandCoStars = (nodeId: number) => {
    if (expandedSet.has(nodeId)) return;
    const actorId = actorMapRef.current.get(nodeId);
    if (actorId) fetchCoStar(actorId, false);
  };

  const handleGetStarPower = (nodeId: number) => {
    if (spDoneSet.has(nodeId)) return;
    const actorId = actorMapRef.current.get(nodeId);
    if (!actorId) return;
    setLoading(true);
    setError("");
    fetch(`/api/star-power/?actor_id=${encodeURIComponent(actorId)}&threshold=${threshold}`)
      .then((r) => { if (!r.ok) throw new Error("Star power request failed"); return r.json() as Promise<StarPowerResponse>; })
      .then((data) => {
        const spi = data.actors[0]?.StarPowerIndex ?? 0;
        const existing = nodesRef.current.get(nodeId) as any;
        if (existing) nodesRef.current.update({ id: nodeId, label: `${existing.label.split(" (SPI")[0]} (SPI: ${spi})` });
        data.movies.forEach((m) => {
          if (!nodesRef.current.get(`m-${m.NodeID}`))
            nodesRef.current.add({ id: `m-${m.NodeID}`, label: `${m.Title}\n⭐ ${m.Rating}`, title: m.Title, color: "#9b59b6", font: { color: "#fff" }, size: 16, shape: "dot" });
        });
        data.directors.forEach((d) => {
          if (!nodesRef.current.get(`d-${d.NodeID}`))
            nodesRef.current.add(personNode(`d-${d.NodeID}`, d.Name, "#e67e22", 14, d.PhotoURL));
        });
        data.edges.forEach((e) => {
          const from = e.type === "ACTED_IN" ? nodeId : `d-${e.source}`;
          const eid  = `sp-${e.edgeId}`;
          if (!edgesRef.current.get(eid))
            edgesRef.current.add({ id: eid, from, to: `m-${e.target}`, dashes: e.type === "DIRECTED", color: { color: e.type === "ACTED_IN" ? "#9b59b6" : "#e67e22" } });
        });
        setSpDoneSet((prev) => new Set([...prev, nodeId]));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleGetPrestige = (nodeId: number) => {
    if (prestigeDoneSet.has(nodeId)) return;
    setLoading(true);
    setError("");
    const qs = new URLSearchParams({ min_rating: String(minRating), award_directors: String(awardDirs), ...(genre ? { genre } : {}) });
    fetch(`/api/prestige-network/?${qs}`)
      .then((r) => { if (!r.ok) throw new Error("Prestige request failed"); return r.json() as Promise<PrestigeResponse>; })
      .then((data) => {
        const myMovieIds = new Set(data.actedInEdges.filter((e) => e.actorNodeId === nodeId).map((e) => e.movieNodeId));
        if (myMovieIds.size === 0) { setError("This actor has no prestigious films under the current prestige filters."); return; }
        const myMovies      = data.prestigiousMovies.filter((m) => myMovieIds.has(m.NodeID));
        const myDirEdges    = data.directedEdges.filter((e) => myMovieIds.has(e.movieNodeId));
        const myDirIds      = new Set(myDirEdges.map((e) => e.directorNodeId));
        const myDirectors   = data.prestigiousDirectors.filter((d) => myDirIds.has(d.NodeID));

        myMovies.forEach((m) => {
          if (!nodesRef.current.get(`m-${m.NodeID}`))
            nodesRef.current.add({ id: `m-${m.NodeID}`, label: `${m.Title}\n⭐ ${m.Rating}`, title: `${m.Title}\nRating: ${m.Rating}${m.Genre ? `\nGenre: ${m.Genre}` : ""}`, color: "#9b59b6", font: { color: "#fff" }, size: 16, shape: "dot" });
        });
        myDirectors.forEach((d) => {
          if (!nodesRef.current.get(`d-${d.NodeID}`))
            nodesRef.current.add(personNode(`d-${d.NodeID}`, d.Name, "#e67e22", 14, d.PhotoURL, `${d.Name}${d.Awards ? `\n🏆 ${d.Awards}` : ""}`));
        });
        data.actedInEdges.filter((e) => e.actorNodeId === nodeId && myMovieIds.has(e.movieNodeId)).forEach((e) => {
          const eid = `ai-${e.EdgeID}`;
          if (!edgesRef.current.get(eid)) edgesRef.current.add({ id: eid, from: nodeId, to: `m-${e.movieNodeId}`, color: { color: "#9b59b6" }, width: 1, arrows: "" });
        });
        myDirEdges.forEach((e) => {
          const eid = `di-${e.EdgeID}`;
          if (!edgesRef.current.get(eid)) edgesRef.current.add({ id: eid, from: `d-${e.directorNodeId}`, to: `m-${e.movieNodeId}`, dashes: true, color: { color: "#e67e22" }, width: 1, arrows: "" });
        });
        setPrestigeDoneSet((prev) => new Set([...prev, nodeId]));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // ---------------------------------------------------------------------------
  // Panel actions — movie nodes
  // ---------------------------------------------------------------------------

  const handleExpandCast = (movieNodeId: number) => {
    if (castDoneSet.has(movieNodeId)) return;
    setLoading(true);
    setError("");
    fetch(`/api/movies/${movieNodeId}/cast`)
      .then((r) => { if (!r.ok) throw new Error("Cast request failed"); return r.json() as Promise<CastActor[]>; })
      .then((actors) => {
        actors.forEach((a) => {
          if (!nodesRef.current.get(a.NodeID)) {
            nodesRef.current.add(personNode(a.NodeID, a.Name, "#4a90d9", 20, a.PhotoURL, "Click to select"));
            actorMapRef.current.set(a.NodeID, a.ActorID);
          }
          const eid = `cast-${a.NodeID}-${movieNodeId}`;
          if (!edgesRef.current.get(eid))
            edgesRef.current.add({ id: eid, from: a.NodeID, to: `m-${movieNodeId}`, color: { color: "#9b59b6" }, width: 1, arrows: "" });
        });
        setCastDoneSet((prev) => new Set([...prev, movieNodeId]));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => () => { networkRef.current?.destroy(); }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const sel = selected;
  const isExpanded     = sel?.type === "actor" && expandedSet.has(sel.nodeId);
  const isSpDone       = sel?.type === "actor" && spDoneSet.has(sel.nodeId);
  const isPrestigeDone = sel?.type === "actor" && prestigeDoneSet.has(sel.nodeId);
  const isCastDone     = sel?.type === "movie" && castDoneSet.has(sel.movieNodeId);

  return (
    <div>
      <h1>Co-Star Network</h1>

      {/* Search row */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Actor name (e.g. Leonardo DiCaprio)"
            value={actorName}
            onChange={(e) => { setActorName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            onFocus={() => suggestions.length > 0 && setShowSugg(true)}
            style={{ padding: "0.5rem", width: "300px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul style={{ position: "absolute", top: "100%", left: 0, width: "100%", background: "#1a1a1e", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", boxShadow: "0 6px 16px rgba(0,0,0,0.5)", listStyle: "none", padding: 0, margin: "3px 0 0", zIndex: 200, maxHeight: "220px", overflowY: "auto" }}>
              {suggestions.map((a) => (
                <li key={a.NodeID} onMouseDown={() => handleSelectSuggestion(a)}
                  style={{ padding: "0.5rem 0.75rem", cursor: "pointer", display: "flex", gap: "0.75rem", alignItems: "center", fontSize: "0.9rem", color: "#e8e6e0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span>{a.Name}</span>
                  {a.Nationality && <span style={{ fontSize: "0.8rem", color: "#666" }}>{a.Nationality}</span>}
                  {a.DateOfBirth && <span style={{ fontSize: "0.8rem", color: "#666" }}>{a.DateOfBirth.slice(0, 4)}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={handleSearch} disabled={loading || !actorName.trim()} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Loading…" : "Generate"}
        </button>
      </div>

      {error && <p style={{ color: "red", margin: "0 0 0.5rem" }}>{error}</p>}

      {/* Graph canvas */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "560px", border: "1px solid #ddd", borderRadius: "8px", background: "#000" }}
      />

      {/* Action panel */}
      {sel ? (
        <div style={{ marginTop: "1rem", padding: "1rem 1.2rem", background: "#13131a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}>
          <p style={{ margin: "0 0 0.9rem", fontSize: "1rem", fontWeight: 600, color: "#e8e6e0" }}>
            Selected:{" "}
            <span style={{ color: sel.type === "actor" ? "#e8a838" : "#9b59b6" }}>
              {sel.type === "actor" ? sel.label : sel.label}
            </span>
            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#888", fontWeight: 400 }}>
              {sel.type === "actor" ? "actor" : "movie"}
            </span>
          </p>

          {sel.type === "actor" ? (
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>

              {/* Expand Co-Stars */}
              <div style={actionCard(isExpanded)}>
                <button style={actionBtn(isExpanded, isExpanded || loading)} onClick={() => handleExpandCoStars(sel.nodeId)} disabled={isExpanded || loading}>
                  {isExpanded ? "✓ Co-Stars Expanded" : "Expand Co-Stars"}
                </button>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#888", lineHeight: 1.4 }}>
                  Add all actors who appeared in the same films as <strong style={{ color: "#bbb" }}>{sel.label}</strong> as blue nodes, connected by shared film count.
                </p>
              </div>

              {/* Star Power */}
              <div style={actionCard(isSpDone)}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                  <button style={actionBtn(isSpDone, isSpDone || loading)} onClick={() => handleGetStarPower(sel.nodeId)} disabled={isSpDone || loading}>
                    {isSpDone ? "✓ Star Power Shown" : "Get Star Power"}
                  </button>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "#888" }}>
                    h ≥
                    <input type="number" min={1} max={10} value={threshold} onChange={(e) => setThreshold(Math.max(1, Math.min(10, Number(e.target.value))))}
                      style={{ width: "42px", padding: "0.2rem", borderRadius: "3px", border: "1px solid #555", background: "#222", color: "#ccc", textAlign: "center" }} />
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#888", lineHeight: 1.4 }}>
                  Overlay the films that contribute to <strong style={{ color: "#bbb" }}>{sel.label}</strong>'s Star Power Index. Films in purple, directors in orange.
                </p>
              </div>

              {/* Prestige */}
              <div style={actionCard(isPrestigeDone)}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                  <button style={actionBtn(isPrestigeDone, isPrestigeDone || loading)} onClick={() => handleGetPrestige(sel.nodeId)} disabled={isPrestigeDone || loading}>
                    {isPrestigeDone ? "✓ Prestige Shown" : "Get Prestige Films"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#888" }}>
                    Min rating
                    <input type="number" min={0} max={10} step={0.5} value={minRating} onChange={(e) => setMinRating(Math.max(0, Math.min(10, Number(e.target.value))))}
                      style={{ width: "46px", padding: "0.2rem", borderRadius: "3px", border: "1px solid #555", background: "#222", color: "#ccc", textAlign: "center" }} />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#888", cursor: "pointer" }}>
                    <input type="checkbox" checked={awardDirs} onChange={(e) => setAwardDirs(e.target.checked)} />
                    Award directors
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#888" }}>
                    Genre
                    <select value={genre} onChange={(e) => setGenre(e.target.value)}
                      style={{ padding: "0.2rem", borderRadius: "3px", border: "1px solid #555", background: "#222", color: "#ccc" }}>
                      <option value="">All</option>
                      {genres.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#888", lineHeight: 1.4 }}>
                  Show prestigious films <strong style={{ color: "#bbb" }}>{sel.label}</strong> appeared in — films qualify by rating threshold or award-winning director.
                </p>
              </div>

            </div>
          ) : (
            /* Movie node actions */
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={actionCard(isCastDone)}>
                <button style={actionBtn(isCastDone, isCastDone || loading)} onClick={() => handleExpandCast(sel.movieNodeId)} disabled={isCastDone || loading}>
                  {isCastDone ? "✓ Cast Expanded" : "Expand Cast"}
                </button>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#888", lineHeight: 1.4 }}>
                  Add all actors who appeared in <strong style={{ color: "#bbb" }}>{sel.label}</strong> to the graph as blue nodes. Each new actor can then be further explored.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#555", fontStyle: "italic" }}>
          Click any actor or movie node to see available actions.
        </p>
      )}

      {/* Legend */}
      <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#666", display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
        <span><span style={{ color: "#e8a838" }}>●</span> Starting actor</span>
        <span><span style={{ color: "#27ae60" }}>●</span> Expanded actor</span>
        <span><span style={{ color: "#4a90d9" }}>●</span> Co-star</span>
        <span><span style={{ color: "#9b59b6" }}>●</span> Movie — click to expand cast</span>
        <span><span style={{ color: "#e67e22" }}>●</span> Director</span>
      </div>
    </div>
  );
}
