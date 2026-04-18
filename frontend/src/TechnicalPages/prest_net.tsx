import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "../my_style.css";

interface PrestigiousMovie {
  NodeID: number;
  MovieID: string;
  Title: string;
  Rating: string | null;
  ReleaseDate: string | null;
  Genre: string | null;
  Runtime: number | null;
}

interface PrestigiousActor {
  NodeID: number;
  ActorID: string;
  Name: string;
  DateOfBirth: string | null;
  Nationality: string | null;
}

interface PrestigeEdge {
  source: number;
  target: number;
  weight: number;
}

interface PrestigeResponse {
  prestigiousMovies: PrestigiousMovie[];
  prestigiousActors: PrestigiousActor[];
  edges: PrestigeEdge[];
}

export default function Prestige_Network() {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesRef = useRef(new DataSet<any>());
  const edgesRef = useRef(new DataSet<any>());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ movies: 0, actors: 0, edges: 0 });
  const [focusedLabel, setFocusedLabel] = useState<string | null>(null);

  const buildGraph = (data: PrestigeResponse) => {
    nodesRef.current.clear();
    edgesRef.current.clear();

    // Movie nodes — amber/gold
    data.prestigiousMovies.forEach((m) => {
      const year = m.ReleaseDate ? m.ReleaseDate.slice(0, 4) : "";
      const tooltip = [
        m.Rating ? `⭐ ${m.Rating}` : null,
        m.Genre,
        m.Runtime ? `${m.Runtime} min` : null,
        year,
      ]
        .filter(Boolean)
        .join(" · ");

      nodesRef.current.add({
        id: `m-${m.NodeID}`,
        label: m.Title.length > 20 ? m.Title.slice(0, 18) + "…" : m.Title,
        title: `${m.Title}\n${tooltip}`,
        color: {
          background: "#e8a838",
          border: "#c4852a",
          highlight: { background: "#f5be60", border: "#c4852a" },
        },
        font: { color: "#fff", size: 12 },
        shape: "dot",
        size: 18,
        group: "movie",
        chosen: {
          node: (values: any) => {
            values.color = "#f5be60";
            values.borderColor = "#c4852a";
          },
        },
      });
    });

    // Actor nodes — purple
    data.prestigiousActors.forEach((a) => {
      const year = a.DateOfBirth ? a.DateOfBirth.slice(0, 4) : "";
      const tooltip = [a.Nationality, year ? `b. ${year}` : null]
        .filter(Boolean)
        .join(" · ");

      nodesRef.current.add({
        id: `a-${a.NodeID}`,
        label: a.Name,
        title: tooltip ? `${a.Name}\n${tooltip}` : a.Name,
        color: {
          background: "#7F77DD",
          border: "#534AB7",
          highlight: { background: "#AFA9EC", border: "#534AB7" },
        },
        font: { color: "#fff", size: 12 },
        shape: "dot",
        size: 14,
        group: "actor",
        chosen: {
          node: (values: any) => {
            values.color = "#AFA9EC";
            values.borderColor = "#534AB7";
          },
        },
      });
    });

    // Co-star edges between prestigious actors
    data.edges.forEach((e) => {
      const id = `${Math.min(e.source, e.target)}-${Math.max(e.source, e.target)}`;
      edgesRef.current.add({
        id,
        from: `a-${e.source}`,
        to: `a-${e.target}`,
        value: e.weight,
        label: String(e.weight),
        title: `${e.weight} shared prestigious movie${e.weight > 1 ? "s" : ""}`,
        color: { color: "#888", highlight: "#bbb" },
        font: { size: 10, color: "#fff", strokeWidth: 2, strokeColor: "#000" },
      });
    });

    setStats({
      movies: data.prestigiousMovies.length,
      actors: data.prestigiousActors.length,
      edges: data.edges.length,
    });
  };

  const initNetwork = () => {
    if (!containerRef.current) return;
    if (networkRef.current) networkRef.current.destroy();

    networkRef.current = new Network(
      containerRef.current,
      { nodes: nodesRef.current, edges: edgesRef.current },
      {
        physics: {
          solver: "forceAtlas2Based",
          forceAtlas2Based: { gravitationalConstant: -60, springLength: 120 },
          stabilization: { iterations: 300 },
        },
        edges: {
          scaling: { min: 1, max: 6 },
          smooth: { type: "continuous", enabled: true, roundness: 0.3 },
          font: {
            size: 10,
            color: "#fff",
            strokeWidth: 2,
            strokeColor: "#000",
          },
        },
        nodes: {
          shape: "dot",
          borderWidth: 1,
          color: {
            highlight: {
              border: "inherit",
              background: "inherit",
            },
          },
        },
        interaction: { hover: true, tooltipDelay: 100, hideEdgesOnDrag: true },
      },
    );

    // Click a node → highlight its neighborhood
    networkRef.current.on("click", (params) => {
      if (params.nodes.length === 0) {
        // Deselect: restore all
        nodesRef.current.forEach((n) =>
          nodesRef.current.update({ id: n.id, opacity: 1, color: n.color }),
        );
        edgesRef.current.forEach((e) =>
          edgesRef.current.update({ id: e.id, hidden: false }),
        );
        setFocusedLabel(null);
        return;
      }

      const clickedId = params.nodes[0] as string;
      const connectedEdges = networkRef.current!.getConnectedEdges(clickedId);
      const connectedNodes = new Set<string>([clickedId]);
      connectedEdges.forEach((eid) => {
        const e = edgesRef.current.get(eid);
        if (e) {
          connectedNodes.add(e.from as string);
          connectedNodes.add(e.to as string);
        }
      });

      nodesRef.current.forEach((n) =>
        nodesRef.current.update({
          id: n.id,
          opacity: connectedNodes.has(n.id as string) ? 1 : 0.15,
        }),
      );
      edgesRef.current.forEach((e) =>
        edgesRef.current.update({
          id: e.id,
          hidden: !connectedEdges.includes(e.id as string),
        }),
      );

      const clicked = nodesRef.current.get(clickedId);
      setFocusedLabel((clicked as any)?.label ?? null);
    });
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("/api/prestige-network/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load prestige network");
        return res.json();
      })
      .then((data: PrestigeResponse) => {
        buildGraph(data);
        initNetwork();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    return () => {
      networkRef.current?.destroy();
    };
  }, []);

  return (
    <div>
      <h1>Prestige Network</h1>
      <p
        style={{ color: "#888", marginBottom: "0.75rem", fontSize: "0.875rem" }}
      >
        Actors who appeared in films rated ≥ 8.5 or directed by an award-winning
        director. Click a node to highlight its connections.
      </p>

      {/* Stats bar */}
      {!loading && !error && (
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "1rem",
            fontSize: "0.875rem",
          }}
        >
          <span>
            <span style={{ color: "#e8a838", marginRight: "0.35rem" }}>●</span>
            <strong>{stats.movies}</strong> prestigious movies
          </span>
          <span>
            <span style={{ color: "#7F77DD", marginRight: "0.35rem" }}>●</span>
            <strong>{stats.actors}</strong> actors
          </span>
          <span style={{ color: "#888" }}>
            <strong>{stats.edges}</strong> co-star connections
          </span>
          {focusedLabel && (
            <span style={{ color: "#aaa" }}>
              Focused: <em>{focusedLabel}</em> — click elsewhere to reset
            </span>
          )}
        </div>
      )}

      {loading && <p style={{ color: "#888" }}>Loading prestige network…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "620px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#000",
          display: loading ? "none" : "block",
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Legend */}
      {!loading && !error && (
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
            <span style={{ color: "#e8a838" }}>●</span> Prestigious movie (≥ 8.5
            or award director)
          </span>
          <span>
            <span style={{ color: "#7F77DD" }}>●</span> Actor — edge thickness =
            # of shared prestigious films
          </span>
        </div>
      )}
    </div>
  );
}
