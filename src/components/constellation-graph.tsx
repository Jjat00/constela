"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type ForceGraph2DComponent from "react-force-graph-2d";

export type GraphNode = {
  id: string;
  name: string;
  headline: string | null;
  role: string | null;
  tags: string[];
  intents: string[];
  avatarUrl: string | null;
  qrSlug: string;
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
const LILA_DIM = "rgba(178, 156, 224, 0.08)";

/** Tu estrella nunca se apaga: es el ancla de tu propio mapa. */
function isLit(id: string, myId: string, matched: Set<string>) {
  return id === myId || matched.has(id);
}

export function ConstellationGraph({
  nodes,
  edges,
  myId,
  matchedIds = null,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  myId: string;
  /**
   * Filtro activo: las estrellas fuera del conjunto no desaparecen — se
   * apagan hasta ser polvo. El mapa sigue siendo el mismo (los nodos no
   * saltan de sitio) y las que te interesan son lo único que brilla.
   */
  matchedIds?: Set<string> | null;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Import manual (no next/dynamic): necesitamos pasar ref para zoomToFit
  const [ForceGraph2D, setForceGraph2D] = useState<
    typeof ForceGraph2DComponent | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const didFit = useRef(false);
  // Las fotos se dibujan en canvas: hay que cargar y cachear los Image a mano
  const imgCache = useRef(new Map<string, HTMLImageElement>());

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
          cooldownTicks={80}
          nodeLabel={() => ""}
          onNodeClick={(node) => {
            if (node.id === myId) {
              router.push("/perfil");
              return;
            }
            const slug = (node as GraphNode).qrSlug;
            if (slug) router.push(`/u/${slug}`);
          }}
          onEngineStop={() => {
            if (didFit.current || nodes.length < 2) return;
            didFit.current = true;
            fgRef.current?.zoomToFit(0, 48);
            // Con pocos nodos zoomToFit acerca demasiado: tope de zoom
            if ((fgRef.current?.zoom() ?? 1) > 3) fgRef.current?.zoom(3, 0);
          }}
          linkColor={(link) => {
            if (!matchedIds) return LILA;
            // Una línea solo brilla si sus dos extremos siguen encendidos
            const end = (e: unknown) =>
              typeof e === "object" && e !== null
                ? String((e as { id?: string }).id ?? "")
                : String(e);
            const lit =
              isLit(end(link.source), myId, matchedIds) &&
              isLit(end(link.target), myId, matchedIds);
            return lit ? LILA : LILA_DIM;
          }}
          linkWidth={1}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const isMe = node.id === myId;
            const x = node.x ?? 0;
            const y = node.y ?? 0;

            // Fuera del filtro: punto tenue, sin foto ni nombre
            if (matchedIds && !isLit(String(node.id), myId, matchedIds)) {
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, 2 * Math.PI);
              ctx.fillStyle = "rgba(245, 243, 238, 0.16)";
              ctx.fill();
              return;
            }

            // Foto de perfil (si existe y ya cargó); si no, estrella-punto
            const url = (node as GraphNode).avatarUrl;
            let img: HTMLImageElement | undefined;
            if (url) {
              img = imgCache.current.get(url);
              if (!img) {
                img = new Image();
                img.crossOrigin = "anonymous";
                img.src = url;
                img.onload = () => {
                  // Nudge sin efecto visual: fuerza un repintado del canvas
                  const z = fgRef.current?.zoom();
                  if (z) fgRef.current?.zoom(z, 0);
                };
                imgCache.current.set(url, img);
              }
            }
            const hasPhoto = Boolean(
              img && img.complete && img.naturalWidth > 0,
            );

            let labelY: number;
            if (hasPhoto && img) {
              const ir = isMe ? 7 : 5.5;
              ctx.save();
              ctx.beginPath();
              ctx.arc(x, y, ir, 0, 2 * Math.PI);
              ctx.clip();
              ctx.drawImage(img, x - ir, y - ir, ir * 2, ir * 2);
              ctx.restore();
              ctx.beginPath();
              ctx.arc(x, y, ir, 0, 2 * Math.PI);
              ctx.strokeStyle = isMe ? LUMEN : "rgba(245, 243, 238, 0.35)";
              ctx.lineWidth = isMe ? 0.8 : 0.4;
              ctx.stroke();
              labelY = y + ir + 2;
            } else {
              const r = isMe ? 5 : 3.5;
              ctx.beginPath();
              ctx.arc(x, y, r * 2.4, 0, 2 * Math.PI);
              ctx.fillStyle = isMe
                ? "rgba(240, 169, 75, 0.15)"
                : "rgba(245, 243, 238, 0.08)";
              ctx.fill();
              ctx.beginPath();
              ctx.arc(x, y, r, 0, 2 * Math.PI);
              ctx.fillStyle = isMe ? LUMEN : STAR;
              ctx.fill();
              labelY = y + r * 2.4 + 2;
            }

            // nombre (primer nombre) debajo
            const label = isMe
              ? "tú"
              : String(node.name ?? "").split(" ")[0].toLowerCase();
            const fontSize = Math.max(10 / globalScale, 3.5);
            ctx.font = `${fontSize}px ui-monospace, monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = isMe ? LUMEN : "rgba(245, 243, 238, 0.55)";
            ctx.fillText(label, x, labelY);
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            // Área de agarre generosa: cubre foto/halo y algo del label
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, 14, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
        />
      )}
    </div>
  );
}
