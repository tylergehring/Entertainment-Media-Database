import { useState, useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "../my_style.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SPActor {
  NodeID: number;
  ActorID: string;
  Name: string;
  StarPowerIndex: number;
}
interface SPMovie {
  NodeID: number;
  Title: string;
  Rating: string;
  actorNodeIds: number[];
}
interface SPDirector {
  NodeID: number;
  Name: string;
  movieNodeIds: number[];
}
interface SPEdge {
  edgeId: number;
  source: number;
  target: number;
  type: "ACTED_IN" | "DIRECTED";
}
interface StarPowerResponse {
  threshold: number;
  actors: SPActor[];
  movies: SPMovie[];
  directors: SPDirector[];
  edges: SPEdge[];
}

interface CoStarActor {
  NodeID: number;
  ActorID: string;
  Name: string;
  DateOfBirth: string;
  Nationality: string;
  sharedMovies: number;
}
interface CoStarResponse {
  center: CoStarActor;
  coStars: CoStarActor[];
  edges: { source: number; target: number; weight: number }[];
}

interface ContextMenu {
  visible: boolean;
  x: number;
  y: number;
  nodeId: number | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StarPower() {
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGraph, setHasGraph] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    visible: false, x: 0, y: 0, nodeId: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesRef = useRef(new DataSet<any>());
  const edgesRef = useRef(new DataSet<any>());
  // NodeID -> ActorID (for actors only, used for co-star expansion)
  const actorMapRef = useRef(new Map<number, string>());
  // NodeIDs of actors whose co-star networks have been expanded
  const expandedRef = useRef(new Set<number>());

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
          scaling: { min: 1, max: 4 },
          color: { color: "#aaa" },
          font: { size: 10, color: "#fff", strokeWidth: 2, strokeColor: "#000" },
        },
        nodes: { shape: "dot", borderWidth: 0 },
        interaction: { hover: true, tooltipDelay: 100 },
      }
    );

    networkRef.current.on("oncontext", (params: any) => {
      params.event.preventDefault();
      const rawId = networkRef.current?.getNodeAt(params.pointer.DOM);
      // Only actor nodes have numeric IDs (movies/directors use prefixed string IDs)
      if (rawId != null && typeof rawId === "number") {
        setContextMenu({
          visible: true,
          x: params.event.clientX,
          y: params.event.clientY,
          nodeId: rawId as number,
        });
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Fetch star power (full graph)
  // ---------------------------------------------------------------------------

  const fetchStarPower = () => {
    setLoading(true);
    setError("");

    fetch(`/api/star-power/all?threshold=${threshold}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json() as Promise<StarPowerResponse>;
      })
      .then((data) => {
        nodesRef.current.clear();
        edgesRef.current.clear();
        actorMapRef.current.clear();
        expandedRef.current.clear();

        if (data.actors.length === 0) {
          setError(`No actors qualify with a Star Power Index ≥ ${threshold}.`);
          setHasGraph(false);
          return;
        }

        // Actor nodes — gold, size scales with SPI
        data.actors.forEach((a) => {
          nodesRef.current.add({
            id: a.NodeID,
            label: `${a.Name}\nSPI: ${a.StarPowerIndex}`,
            title: `Star Power Index: ${a.StarPowerIndex}\nRight-click to expand co-stars`,
            color: "#e8a838",
            font: { color: "#fff" },
            size: 15 + a.StarPowerIndex * 2,
          });
          actorMapRef.current.set(a.NodeID, a.ActorID);
        });

        // Movie nodes — purple
        data.movies.forEach((m) => {
          nodesRef.current.add({
            id: `m-${m.NodeID}`,
            label: `${m.Title}\n⭐ ${m.Rating}`,
            title: `Rating: ${m.Rating}`,
            color: "#9b59b6",
            font: { color: "#fff" },
            size: 16,
          });
        });

        // Director nodes — orange
        data.directors.forEach((d) => {
          nodesRef.current.add({
            id: `d-${d.NodeID}`,
            label: d.Name,
            color: "#e67e22",
            font: { color: "#fff" },
            size: 14,
          });
        });

        // Edges
        data.edges.forEach((e) => {
          const from = e.type === "ACTED_IN" ? e.source : `d-${e.source}`;
          const to = `m-${e.target}`;
          edgesRef.current.add({
            id: `sp-${e.edgeId}`,
            from,
            to,
            dashes: e.type === "DIRECTED",
            color: { color: e.type === "ACTED_IN" ? "#9b59b6" : "#e67e22" },
          });
        });

        setHasGraph(true);
        initNetwork();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // ---------------------------------------------------------------------------
  // Co-star expansion (merges into existing canvas)
  // ---------------------------------------------------------------------------

  const mergeCoStars = (data: CoStarResponse) => {
    const { center, coStars, edges } = data;

    // Mark center as expanded (keep gold color if already present as SPI actor)
    if (!nodesRef.current.get(center.NodeID)) {
      nodesRef.current.add({
        id: center.NodeID,
        label: center.Name,
        color: "#e8a838",
        font: { color: "#fff" },
        size: 24,
      });
      actorMapRef.current.set(center.NodeID, center.ActorID);
    }
    expandedRef.current.add(center.NodeID);

    // Co-star nodes — blue
    coStars.forEach((cs) => {
      if (!nodesRef.current.get(cs.NodeID)) {
        nodesRef.current.add({
          id: cs.NodeID,
          label: cs.Name,
          title: `${cs.sharedMovies} shared movie${cs.sharedMovies > 1 ? "s" : ""}\nRight-click to expand`,
          color: "#4a90d9",
          font: { color: "#fff" },
          size: 20,
        });
        actorMapRef.current.set(cs.NodeID, cs.ActorID);
      }
    });

    // Edges — deduplicate by sorted node pair
    edges.forEach((e) => {
      const id = `cs-${Math.min(e.source, e.target)}-${Math.max(e.source, e.target)}`;
      if (!edgesRef.current.get(id)) {
        edgesRef.current.add({
          id,
          from: e.source,
          to: e.target,
          value: e.weight,
          length: Math.max(80, 300 / e.weight),
          label: String(e.weight),
          title: `${e.weight} shared movie${e.weight > 1 ? "s" : ""}`,
          color: { color: "#4a90d9" },
        });
      }
    });
  };

  const handleExpandCoStars = () => {
    const { nodeId } = contextMenu;
    setContextMenu({ visible: false, x: 0, y: 0, nodeId: null });
    if (nodeId == null || expandedRef.current.has(nodeId)) return;

    const actorId = actorMapRef.current.get(nodeId);
    if (!actorId) return;

    setLoading(true);
    setError("");
    fetch(`/api/costar/?actor_id=${encodeURIComponent(actorId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Co-star request failed");
        return res.json() as Promise<CoStarResponse>;
      })
      .then((data) => mergeCoStars(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // ---------------------------------------------------------------------------
  // Dismiss context menu on outside click
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const dismiss = () => setContextMenu({ visible: false, x: 0, y: 0, nodeId: null });
    window.addEventListener("click", dismiss);
    return () => window.removeEventListener("click", dismiss);
  }, []);

  useEffect(() => {
    return () => { networkRef.current?.destroy(); };
  }, []);

  const contextNodeLabel = contextMenu.nodeId != null
    ? (nodesRef.current.get(contextMenu.nodeId) as any)?.label?.split("\n")[0]
    : null;
  const alreadyExpanded = contextMenu.nodeId != null && expandedRef.current.has(contextMenu.nodeId);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div>
      <h1>Star Power Index</h1>
      <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "1rem" }}>
        An actor has a Star Power Index of <em>h</em> if they appeared in at least <em>h</em> films
        each rated ≥ <em>h</em> on a 0–10 scale.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "#ccc" }}>
          Threshold (h ≥):
          <input
            type="number"
            min={1}
            max={10}
            value={threshold}
            onChange={(e) => setThreshold(Math.max(1, Math.min(10, Number(e.target.value))))}
            style={{ width: "52px", padding: "0.5rem 0.3rem", borderRadius: "4px", border: "1px solid #ccc", textAlign: "center" }}
          />
        </label>
        <button
          onClick={fetchStarPower}
          disabled={loading}
          style={{ padding: "0.5rem 1rem" }}
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ position: "relative" }}>
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "600px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#000000",
            display: hasGraph ? "block" : "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
            fontSize: "0.9rem",
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {!hasGraph && !loading && "Set a threshold and click Generate"}
        </div>

        {contextMenu.visible && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 1000,
              minWidth: "180px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "8px 12px", background: "#f5f5f5", fontSize: "0.8rem", color: "#555", borderBottom: "1px solid #eee" }}>
              {contextNodeLabel ?? "Actor"}
            </div>
            <button
              onClick={handleExpandCoStars}
              disabled={alreadyExpanded || loading}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 12px",
                border: "none",
                background: "none",
                textAlign: "left",
                cursor: alreadyExpanded ? "default" : "pointer",
                color: alreadyExpanded ? "#aaa" : "#333",
                fontSize: "0.9rem",
              }}
            >
              {alreadyExpanded ? "Co-stars already expanded" : "Expand Co-Stars"}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#888", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <span><span style={{ color: "#e8a838" }}>●</span> Qualifying actor (size = SPI)</span>
        <span><span style={{ color: "#9b59b6" }}>●</span> Contributing movie</span>
        <span><span style={{ color: "#e67e22" }}>●</span> Director</span>
        <span><span style={{ color: "#4a90d9" }}>●</span> Co-star (from expansion)</span>
        <span style={{ fontStyle: "italic" }}>Right-click actor to expand co-stars</span>
      </div>
    </div>
  );
}
