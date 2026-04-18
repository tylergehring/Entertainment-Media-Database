import { useState, useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "../my_style.css";

interface Actor {
  NodeID: number;
  ActorID: string;
  Name: string;
  DateOfBirth: string;
  Nationality: string;
}

interface CoStarActor extends Actor {
  sharedMovies: number;
}

interface CoStarResponse {
  center: Actor;
  coStars: CoStarActor[];
  edges: { source: number; target: number; weight: number }[];
}

interface ContextMenu {
  visible: boolean;
  x: number;
  y: number;
  nodeId: number | null;
}

export default function Co_Star() {
  const [actorName, setActorName] = useState("");
  const [suggestions, setSuggestions] = useState<Actor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contextMenu, setContextMenu] = useState<ContextMenu>({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesRef = useRef(new DataSet<any>());
  const edgesRef = useRef(new DataSet<any>());
  const actorMapRef = useRef(new Map<number, string>()); // NodeID -> ActorID
  const expandedRef = useRef(new Set<number>()); // NodeIDs already expanded

  const mergeData = (data: CoStarResponse, isInitial: boolean) => {
    const { center, coStars, edges } = data;

    // Center node: gold on first query, green when expanded via right-click
    if (nodesRef.current.get(center.NodeID)) {
      nodesRef.current.update({
        id: center.NodeID,
        color: "#27ae60",
        size: 24,
      });
    } else {
      nodesRef.current.add({
        id: center.NodeID,
        label: center.Name,
        color: isInitial ? "#e8a838" : "#27ae60",
        font: { color: "#fff" },
        size: isInitial ? 30 : 24,
      });
    }
    actorMapRef.current.set(center.NodeID, center.ActorID);
    expandedRef.current.add(center.NodeID);

    // Co-star nodes — skip if already present
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
      const id = `${Math.min(e.source, e.target)}-${Math.max(e.source, e.target)}`;
      if (!edgesRef.current.get(id)) {
        edgesRef.current.add({
          id,
          from: e.source,
          to: e.target,
          value: e.weight,
          length: Math.max(80, 300 / e.weight), // more shared movies → shorter distance
          label: String(e.weight),
          title: `${e.weight} shared movie${e.weight > 1 ? "s" : ""}`,
        });
      }
    });
  };

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
          font: {
            size: 11,
            color: "#fff",
            strokeWidth: 2,
            strokeColor: "#000",
          },
        },
        nodes: { shape: "dot", borderWidth: 0 },
        interaction: { hover: true, tooltipDelay: 100 },
      },
    );

    networkRef.current.on("oncontext", (params: any) => {
      params.event.preventDefault();
      const nodeId = networkRef.current?.getNodeAt(params.pointer.DOM) as
        | number
        | undefined;
      if (nodeId != null) {
        setContextMenu({
          visible: true,
          x: params.event.clientX,
          y: params.event.clientY,
          nodeId,
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
        if (!res.ok)
          throw new Error(
            res.status === 404 ? "Actor not found" : "Request failed",
          );
        return res.json();
      })
      .then((data: CoStarResponse) => {
        if (isInitial) {
          nodesRef.current.clear();
          edgesRef.current.clear();
          actorMapRef.current.clear();
          expandedRef.current.clear();
          mergeData(data, true);
          initNetwork();
        } else {
          mergeData(data, false);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Debounce: fetch suggestions as the user types
  useEffect(() => {
    const trimmed = actorName.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/actors/name/${encodeURIComponent(trimmed)}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((actors: Actor[]) => {
          setSuggestions(actors);
          setShowSuggestions(actors.length > 0);
        })
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [actorName]);

  const handleSelectSuggestion = (actor: Actor) => {
    setActorName(actor.Name);
    setSuggestions([]);
    setShowSuggestions(false);
    setError("");
    fetchCoStar(actor.ActorID, true);
  };

  const handleSearch = () => {
    if (!actorName.trim()) return;
    if (suggestions.length === 1) {
      handleSelectSuggestion(suggestions[0]);
    } else if (suggestions.length > 1) {
      setShowSuggestions(true);
    } else {
      // suggestions haven't loaded yet — fetch directly
      setLoading(true);
      setError("");
      fetch(`/api/actors/name/${encodeURIComponent(actorName.trim())}`)
        .then((res) =>
          res.ok ? res.json() : Promise.reject(new Error("Search failed")),
        )
        .then((actors: Actor[]) => {
          if (actors.length === 0) setError("No actors found with that name.");
          else if (actors.length === 1) fetchCoStar(actors[0].ActorID, true);
          else {
            setSuggestions(actors);
            setShowSuggestions(true);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  };

  const handleExpand = () => {
    const { nodeId } = contextMenu;
    setContextMenu({ visible: false, x: 0, y: 0, nodeId: null });
    if (nodeId == null || expandedRef.current.has(nodeId)) return;
    const id = actorMapRef.current.get(nodeId);
    if (id) fetchCoStar(id, false);
  };

  // Dismiss context menu on any outside click
  useEffect(() => {
    const dismiss = () =>
      setContextMenu({ visible: false, x: 0, y: 0, nodeId: null });
    window.addEventListener("click", dismiss);
    return () => window.removeEventListener("click", dismiss);
  }, []);

  useEffect(() => {
    return () => {
      networkRef.current?.destroy();
    };
  }, []);

  const contextMenuLabel =
    contextMenu.nodeId != null
      ? (nodesRef.current.get(contextMenu.nodeId) as any)?.label
      : null;
  const alreadyExpanded =
    contextMenu.nodeId != null && expandedRef.current.has(contextMenu.nodeId);

  return (
    <div>
      <h1>Co-Star Network</h1>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          alignItems: "flex-start",
        }}
      >
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Actor name (e.g. Tom Hanks)"
            value={actorName}
            onChange={(e) => {
              setActorName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            style={{
              padding: "0.5rem",
              width: "300px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                background: "#1a1a1e",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "4px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
                listStyle: "none",
                padding: 0,
                margin: "3px 0 0",
                zIndex: 200,
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((a) => (
                <li
                  key={a.NodeID}
                  onMouseDown={() => handleSelectSuggestion(a)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    cursor: "pointer",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center",
                    fontSize: "0.9rem",
                    color: "#e8e6e0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.07)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span>{a.Name}</span>
                  {a.Nationality && (
                    <span style={{ fontSize: "0.8rem", color: "#666" }}>
                      {a.Nationality}
                    </span>
                  )}
                  {a.DateOfBirth && (
                    <span style={{ fontSize: "0.8rem", color: "#666" }}>
                      {a.DateOfBirth.slice(0, 4)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !actorName.trim()}
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
          }}
          onContextMenu={(e) => e.preventDefault()}
        />

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
            <div
              style={{
                padding: "8px 12px",
                background: "#f5f5f5",
                fontSize: "0.8rem",
                color: "#555",
                borderBottom: "1px solid #eee",
              }}
            >
              {contextMenuLabel ?? "Actor"}
            </div>
            <button
              onClick={handleExpand}
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
              {alreadyExpanded ? "Already expanded" : "Expand co-stars"}
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "0.75rem",
          fontSize: "0.85rem",
          color: "#888",
          display: "flex",
          gap: "1.5rem",
        }}
      >
        <span>
          <span style={{ color: "#e8a838" }}>●</span> Starting actor
        </span>
        <span>
          <span style={{ color: "#27ae60" }}>●</span> Expanded
        </span>
        <span>
          <span style={{ color: "#4a90d9" }}>●</span> Co-star (right-click to
          expand)
        </span>
      </div>
    </div>
  );
}
