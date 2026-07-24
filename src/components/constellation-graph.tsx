"use client";

import { useEffect, useRef, useState } from "react";
import type ForceGraph2DComponent from "react-force-graph-2d";

export type GraphNode = {
  id: string;
  name: string;
  headline: string | null;
  tags: string[];
  avatarUrl: string | null;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  note: string | null;
  createdAt: string;
};

const LUMEN = "#F0A94B";
const STAR = "#F5F3EE";
const LILA = "rgba(178, 156, 224, 0.45)";

export function ConstellationGraph({
  nodes,
  edges,
  myId,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  myId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Import manual (no next/dynamic): necesitamos pasar ref para zoomToFit
  const [ForceGraph2D, setForceGraph2D] = useState<
    typeof ForceGraph2DComponent | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const didFit = useRef(false);

  useEffect(() => {
    let mounted = true;
    import("react-force-graph-2d").then((m) => {
      if (mounted) setForceGraph2D(() => m.default);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;

  // La altura la decide el contenedor (h-80 en móvil, columna completa en desktop)
  return (
    <div ref={containerRef} className="h-full w-full">
      {width > 0 && height > 0 && ForceGraph2D && (
        <ForceGraph2D
          ref={fgRef}
          width={width}
          height={height}
          graphData={{
            // Tu estrella anclada al centro: cada quien es el nodo principal
            // de su propia vista, tenga o no conexiones todavía.
            nodes: nodes.map((n) =>
              n.id === myId ? { ...n, fx: 0, fy: 0 } : { ...n },
            ),
            links: edges.map((e) => ({ ...e })),
          }}
          backgroundColor="rgba(0,0,0,0)"
          enableZoomInteraction={false}
          enablePanInteraction={false}
          cooldownTicks={80}
          onEngineStop={() => {
            if (didFit.current || nodes.length < 2) return;
            didFit.current = true;
            fgRef.current?.zoomToFit(0, 48);
            // Con pocos nodos zoomToFit acerca demasiado: tope de zoom
            if ((fgRef.current?.zoom() ?? 1) > 3) fgRef.current?.zoom(3, 0);
          }}
          linkColor={() => LILA}
          linkWidth={1}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const isMe = node.id === myId;
            const x = node.x ?? 0;
            const y = node.y ?? 0;
            const r = isMe ? 5 : 3.5;
            const color = isMe ? LUMEN : STAR;

            // halo
            ctx.beginPath();
            ctx.arc(x, y, r * 2.4, 0, 2 * Math.PI);
            ctx.fillStyle = isMe
              ? "rgba(240, 169, 75, 0.15)"
              : "rgba(245, 243, 238, 0.08)";
            ctx.fill();

            // estrella
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();

            // nombre (primer nombre) debajo
            const label = isMe
              ? "tú"
              : String(node.name ?? "").split(" ")[0].toLowerCase();
            const fontSize = Math.max(10 / globalScale, 3.5);
            ctx.font = `${fontSize}px ui-monospace, monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = isMe ? LUMEN : "rgba(245, 243, 238, 0.55)";
            ctx.fillText(label, x, y + r * 2.4 + 2);
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, 10, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
        />
      )}
    </div>
  );
}
