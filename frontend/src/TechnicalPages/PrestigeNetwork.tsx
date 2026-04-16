import { useState, useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "../my_style.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PrestigeActor    { NodeID: number; ActorID: string; Name: string; DateOfBirth: string; Nationality: string; PhotoURL?: string | null; }
interface PrestigeMovie    { NodeID: number; Title: string; Rating: string; Genre: string; }
interface PrestigeDirector { NodeID: number; DirectorID: string; Name: string; Awards: string; PhotoURL?: string | null; }
interface PrestigeResponse {
  prestigiousMovies:    PrestigeMovie[];
  prestigiousActors:    PrestigeActor[];
  prestigiousDirectors: PrestigeDirector[];
  coStarEdges:          { source: number; target: number; weight: number }[];
  actedInEdges:         { EdgeID: number; actorNodeId: number; movieNodeId: number }[];
  directedEdges:        { EdgeID: number; directorNodeId: number; movieNodeId: number }[];
}

interface StarPowerResponse {
  qualifies: boolean;
  actors:    { NodeID: number; ActorID: string; Name: string; StarPowerIndex: number }[];
  movies:    { NodeID: number; Title: string; Rating: string; actorNodeIds: number[] }[];
  directors: { NodeID: number; Name: string; PhotoURL?: string | null; movieNodeIds: number[] }[];
  edges:     { edgeId: number; source: number; target: number; type: "ACTED_IN" | "DIRECTED" }[];
}

interface CoStarActor { NodeID: number; ActorID: string; Name: string; DateOfBirth: string; Nationality: string; PhotoURL?: string | null; sharedMovies: number; }
interface CoStarResponse {
  center:  CoStarActor;
  coStars: CoStarActor[];
  edges:   { source: number; target: number; weight: number }[];
}

interface CastActor {
  NodeID: number; ActorID: string; Name: string; Nationality: string; PhotoURL?: string | null;
}

type SelectedNode =
  | { type: "actor"; nodeId: number; label: string; isPrestigious: boolean }
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
  flex: "1 1 260px",
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

export default function PrestigeNetwork() {
  // Prestige filter controls
  const [minRating, setMinRating]       = useState(8.5);
  const [awardDirs, setAwardDirs]       = useState(true);
  const [minShared, setMinShared]       = useState(1);
  const [genre, setGenre]               = useState("");
  const [genres, setGenres]             = useState<string[]>([]);

  // SPI threshold (for Get Star Power action)
  const [spiThreshold, setSpiThreshold] = useState(5);

  // UI state
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [hasGraph, setHasGraph] = useState(false);
  const [summary, setSummary]   = useState("");
  const [selected, setSelected] = useState<SelectedNode | null>(null);

  // Track which nodes have had each action applied
  const [expandedSet, setExpandedSet]         = useState(new Set<number>());
  const [spDoneSet, setSpDoneSet]             = useState(new Set<number>());
  const [prestigeDoneSet, setPrestigeDoneSet] = useState(new Set<number>());
  const [castDoneSet, setCastDoneSet]         = useState(new Set<number>());

  // Graph refs
  const containerRef   = useRef<HTMLDivElement>(null);
  const networkRef     = useRef<Network | null>(null);
  const nodesRef       = useRef(new DataSet<any>());
  const edgesRef       = useRef(new DataSet<any>());
  const actorMapRef    = useRef(new Map<number, string>()); // NodeID -> ActorID
  const prestigeSet    = useRef(new Set<number>());         // NodeIDs of original prestigious actors

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
          font: { size: 10, color: "#fff", strokeWidth: 2, strokeColor: "#000" },
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
          setSelected({
            type: "actor",
            nodeId,
            label: node?.label?.split("\n")[0] ?? "Actor",
            isPrestigious: prestigeSet.current.has(nodeId),
          });
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
  // Fetch prestige network
  // ---------------------------------------------------------------------------

  const fetchPrestige = () => {
    setLoading(true);
    setError("");

    const qs = new URLSearchParams({
      min_rating:      String(minRating),
      award_directors: String(awardDirs),
      min_shared:      String(minShared),
      ...(genre ? { genre } : {}),
    });

    fetch(`/api/prestige-network/?${qs}`)
      .then((r) => { if (!r.ok) throw new Error("Request failed"); return r.json() as Promise<PrestigeResponse>; })
      .then((data) => {
        nodesRef.current.clear();
        edgesRef.current.clear();
        actorMapRef.current.clear();
        prestigeSet.current.clear();
        setExpandedSet(new Set());
        setSpDoneSet(new Set());
        setPrestigeDoneSet(new Set(data.prestigiousActors.map((a) => a.NodeID)));
        setCastDoneSet(new Set());
        setSelected(null);

        if (data.prestigiousActors.length === 0) {
          setError("No prestigious films matched those filters.");
          setHasGraph(false);
          return;
        }

        setSummary(
          `${data.prestigiousMovies.length} film${data.prestigiousMovies.length !== 1 ? "s" : ""} · ` +
          `${data.prestigiousActors.length} actor${data.prestigiousActors.length !== 1 ? "s" : ""} · ` +
          `${data.prestigiousDirectors.length} director${data.prestigiousDirectors.length !== 1 ? "s" : ""}`
        );

        data.prestigiousActors.forEach((a) => {
          nodesRef.current.add(personNode(a.NodeID, a.Name, "#e8a838", 24, a.PhotoURL, "Click to see options"));
          actorMapRef.current.set(a.NodeID, a.ActorID);
          prestigeSet.current.add(a.NodeID);
        });

        data.prestigiousMovies.forEach((m) => {
          nodesRef.current.add({ id: `m-${m.NodeID}`, label: `${m.Title}\n⭐ ${m.Rating}`, title: `${m.Title}\nRating: ${m.Rating}${m.Genre ? `\nGenre: ${m.Genre}` : ""}`, color: "#9b59b6", font: { color: "#fff" }, size: 16 });
        });

        data.prestigiousDirectors.forEach((d) => {
          nodesRef.current.add(personNode(`d-${d.NodeID}`, d.Name, "#e67e22", 18, d.PhotoURL, `${d.Name}${d.Awards ? `\n🏆 ${d.Awards}` : ""}`));
        });

        data.coStarEdges.forEach((e) => {
          const id = `cs-${Math.min(e.source, e.target)}-${Math.max(e.source, e.target)}`;
          edgesRef.current.add({ id, from: e.source, to: e.target, value: e.weight, length: Math.max(80, 300 / e.weight), label: String(e.weight), title: `${e.weight} shared prestigious movie${e.weight > 1 ? "s" : ""}`, color: { color: "#aaa" } });
        });

        data.actedInEdges.forEach((e) => {
          edgesRef.current.add({ id: `ai-${e.EdgeID}`, from: e.actorNodeId, to: `m-${e.movieNodeId}`, color: { color: "#9b59b6" }, width: 1, arrows: "" });
        });

        data.directedEdges.forEach((e) => {
          edgesRef.current.add({ id: `di-${e.EdgeID}`, from: `d-${e.directorNodeId}`, to: `m-${e.movieNodeId}`, dashes: true, color: { color: "#e67e22" }, width: 1, arrows: "" });
        });

        setHasGraph(true);
        initNetwork();
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
    if (!actorId) return;

    setLoading(true);
    setError("");
    fetch(`/api/costar/?actor_id=${encodeURIComponent(actorId)}`)
      .then((r) => { if (!r.ok) throw new Error("Co-star request failed"); return r.json() as Promise<CoStarResponse>; })
      .then(({ coStars, edges }) => {
        coStars.forEach((cs) => {
          if (!nodesRef.current.get(cs.NodeID)) {
            nodesRef.current.add(personNode(
              cs.NodeID, cs.Name, "#4a90d9", 20, cs.PhotoURL,
              `${cs.sharedMovies} shared movie${cs.sharedMovies > 1 ? "s" : ""} · Click to select`
            ));
            actorMapRef.current.set(cs.NodeID, cs.ActorID);
          }
        });
        edges.forEach((e) => {
          const id = `cs-${Math.min(e.source, e.target)}-${Math.max(e.source, e.target)}`;
          if (!edgesRef.current.get(id))
            edgesRef.current.add({ id, from: e.source, to: e.target, value: e.weight, length: Math.max(80, 300 / e.weight), label: String(e.weight), color: { color: "#4a90d9" } });
        });
        setExpandedSet((prev) => new Set([...prev, nodeId]));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleGetStarPower = (nodeId: number) => {
    if (spDoneSet.has(nodeId)) return;
    const actorId = actorMapRef.current.get(nodeId);
    if (!actorId) return;

    setLoading(true);
    setError("");
    fetch(`/api/star-power/?actor_id=${encodeURIComponent(actorId)}&threshold=${spiThreshold}`)
      .then((r) => { if (!r.ok) throw new Error("Star power request failed"); return r.json() as Promise<StarPowerResponse>; })
      .then((data) => {
        const spi = data.actors[0]?.StarPowerIndex ?? 0;
        const existing = nodesRef.current.get(nodeId) as any;
        if (existing) nodesRef.current.update({ id: nodeId, label: `${existing.label.split(" (SPI")[0]} (SPI: ${spi})` });

        data.movies.forEach((m) => {
          if (!nodesRef.current.get(`m-${m.NodeID}`))
            nodesRef.current.add({ id: `m-${m.NodeID}`, label: `${m.Title}\n⭐ ${m.Rating}`, title: m.Title, color: "#9b59b6", font: { color: "#fff" }, size: 16 });
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
    const qs = new URLSearchParams({
      min_rating:      String(minRating),
      award_directors: String(awardDirs),
      ...(genre ? { genre } : {}),
    });
    fetch(`/api/prestige-network/?${qs}`)
      .then((r) => { if (!r.ok) throw new Error("Prestige request failed"); return r.json() as Promise<PrestigeResponse>; })
      .then((data) => {
        const myMovieIds = new Set(
          data.actedInEdges.filter((e) => e.actorNodeId === nodeId).map((e) => e.movieNodeId)
        );
        if (myMovieIds.size === 0) {
          setError("This actor has no prestigious films under the current prestige filters.");
          return;
        }
        const myMovies   = data.prestigiousMovies.filter((m) => myMovieIds.has(m.NodeID));
        const myDirEdges = data.directedEdges.filter((e) => myMovieIds.has(e.movieNodeId));
        const myDirIds   = new Set(myDirEdges.map((e) => e.directorNodeId));
        const myDirs     = data.prestigiousDirectors.filter((d) => myDirIds.has(d.NodeID));

        myMovies.forEach((m) => {
          if (!nodesRef.current.get(`m-${m.NodeID}`))
            nodesRef.current.add({ id: `m-${m.NodeID}`, label: `${m.Title}\n⭐ ${m.Rating}`, title: `${m.Title}\nRating: ${m.Rating}${m.Genre ? `\nGenre: ${m.Genre}` : ""}`, color: "#9b59b6", font: { color: "#fff" }, size: 16, shape: "dot" });
        });
        myDirs.forEach((d) => {
          if (!nodesRef.current.get(`d-${d.NodeID}`))
            nodesRef.current.add(personNode(`d-${d.NodeID}`, d.Name, "#e67e22", 14, d.PhotoURL, `${d.Name}${d.Awards ? `\n🏆 ${d.Awards}` : ""}`));
        });
        data.actedInEdges
          .filter((e) => e.actorNodeId === nodeId && myMovieIds.has(e.movieNodeId))
          .forEach((e) => {
            const eid = `ai-${e.EdgeID}`;
            if (!edgesRef.current.get(eid))
              edgesRef.current.add({ id: eid, from: nodeId, to: `m-${e.movieNodeId}`, color: { color: "#9b59b6" }, width: 1, arrows: "" });
          });
        myDirEdges.forEach((e) => {
          const eid = `di-${e.EdgeID}`;
          if (!edgesRef.current.get(eid))
            edgesRef.current.add({ id: eid, from: `d-${e.directorNodeId}`, to: `m-${e.movieNodeId}`, dashes: true, color: { color: "#e67e22" }, width: 1, arrows: "" });
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

  const sel             = selected;
  const isExpanded      = sel?.type === "actor" && expandedSet.has(sel.nodeId);
  const isSpDone        = sel?.type === "actor" && spDoneSet.has(sel.nodeId);
  const isPrestigeDone  = sel?.type === "actor" && prestigeDoneSet.has(sel.nodeId);
  const isCastDone      = sel?.type === "movie" && castDoneSet.has(sel.movieNodeId);

  return (
    <div>
      <h1>Prestige Network</h1>
      <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Actors connected through prestigious films. Adjust the filters below and click Generate.
      </p>

      {/* Filter controls */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center", flexWrap: "wrap" }}>

        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "#ccc" }}>
          Min rating
          <input type="number" min={0} max={10} step={0.5} value={minRating}
            onChange={(e) => setMinRating(Math.max(0, Math.min(10, Number(e.target.value))))}
            style={{ width: "58px", padding: "0.4rem 0.3rem", borderRadius: "4px", border: "1px solid #ccc", textAlign: "center" }} />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "#ccc", cursor: "pointer" }}>
          <input type="checkbox" checked={awardDirs} onChange={(e) => setAwardDirs(e.target.checked)} />
          Include award-winning directors
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "#ccc" }}>
          Min shared films (co-star edges)
          <input type="number" min={1} max={20} value={minShared}
            onChange={(e) => setMinShared(Math.max(1, Number(e.target.value)))}
            style={{ width: "52px", padding: "0.4rem 0.3rem", borderRadius: "4px", border: "1px solid #ccc", textAlign: "center" }} />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "#ccc" }}>
          Genre
          <select value={genre} onChange={(e) => setGenre(e.target.value)}
            style={{ padding: "0.4rem 0.5rem", borderRadius: "4px", border: "1px solid #ccc", background: "#1a1a1e", color: "#e8e6e0" }}>
            <option value="">All genres</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>

        <button onClick={fetchPrestige} disabled={loading} style={{ padding: "0.5rem 1.2rem" }}>
          {loading ? "Loading…" : "Generate"}
        </button>

        {hasGraph && summary && <span style={{ fontSize: "0.8rem", color: "#666" }}>{summary}</span>}
      </div>

      {error && <p style={{ color: "red", margin: "0 0 0.5rem" }}>{error}</p>}

      {/* Graph canvas */}
      <div
        ref={containerRef}
        style={{
          width: "100%", height: "560px",
          border: "1px solid #ddd", borderRadius: "8px", background: "#000",
          display: hasGraph ? "block" : "flex", alignItems: "center", justifyContent: "center",
          color: "#555", fontSize: "0.9rem",
        }}
      >
        {!hasGraph && !loading && "Set filters and click Generate"}
      </div>

      {/* Action panel */}
      {sel ? (
        <div style={{ marginTop: "1rem", padding: "1rem 1.2rem", background: "#13131a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px" }}>
          <p style={{ margin: "0 0 0.9rem", fontSize: "1rem", fontWeight: 600, color: "#e8e6e0" }}>
            Selected:{" "}
            <span style={{ color: sel.type === "movie" ? "#9b59b6" : sel.isPrestigious ? "#e8a838" : "#4a90d9" }}>
              {sel.label}
            </span>
            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#888", fontWeight: 400 }}>
              {sel.type === "movie" ? "movie" : sel.isPrestigious ? "prestigious actor" : "actor"}
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
                  Add all actors who appeared in the same films as <strong style={{ color: "#bbb" }}>{sel.label}</strong> as blue nodes. Edge labels show shared film count.
                </p>
              </div>

              {/* Get Star Power */}
              <div style={actionCard(isSpDone)}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                  <button style={actionBtn(isSpDone, isSpDone || loading)} onClick={() => handleGetStarPower(sel.nodeId)} disabled={isSpDone || loading}>
                    {isSpDone ? "✓ Star Power Shown" : "Get Star Power"}
                  </button>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "#888" }}>
                    h ≥
                    <input type="number" min={1} max={10} value={spiThreshold}
                      onChange={(e) => setSpiThreshold(Math.max(1, Math.min(10, Number(e.target.value))))}
                      style={{ width: "42px", padding: "0.2rem", borderRadius: "3px", border: "1px solid #555", background: "#222", color: "#ccc", textAlign: "center" }} />
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#888", lineHeight: 1.4 }}>
                  Overlay the films that contribute to <strong style={{ color: "#bbb" }}>{sel.label}</strong>'s Star Power Index. New films in purple, directors in orange.
                </p>
              </div>

              {/* Get Prestige Films */}
              <div style={actionCard(isPrestigeDone)}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                  <button style={actionBtn(isPrestigeDone, isPrestigeDone || loading)} onClick={() => handleGetPrestige(sel.nodeId)} disabled={isPrestigeDone || loading}>
                    {isPrestigeDone ? "✓ Prestige Films Shown" : "Get Prestige Films"}
                  </button>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "#888" }}>
                    Min rating
                    <input type="number" min={0} max={10} step={0.5} value={minRating}
                      onChange={(e) => setMinRating(Math.max(0, Math.min(10, Number(e.target.value))))}
                      style={{ width: "48px", padding: "0.2rem", borderRadius: "3px", border: "1px solid #555", background: "#222", color: "#ccc", textAlign: "center" }} />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "#888", cursor: "pointer" }}>
                    <input type="checkbox" checked={awardDirs} onChange={(e) => setAwardDirs(e.target.checked)} />
                    Award dirs
                  </label>
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#888", lineHeight: 1.4 }}>
                  Add <strong style={{ color: "#bbb" }}>{sel.label}</strong>'s prestigious films — already shown for original prestige actors.
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
        <span><span style={{ color: "#e8a838" }}>●</span> Prestigious actor</span>
        <span><span style={{ color: "#9b59b6" }}>●</span> Movie — click to expand cast</span>
        <span><span style={{ color: "#e67e22" }}>●</span> Director</span>
        <span><span style={{ color: "#4a90d9" }}>●</span> Co-star / cast (expanded)</span>
      </div>
    </div>
  );
}