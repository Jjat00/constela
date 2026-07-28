"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type ForceGraph2DComponent from "react-force-graph-2d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export type GraphNode = {
  id: string;
  name: string;
  headline: string | null;
  tags: string[];
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

/** Un nodo ya en manos de la simulación: force-graph le añade posición, y
 *  fx/fy lo clavan en un punto (es como se ancla o se arrastra una estrella). */
type SimNode = GraphNode & {
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
};

const LUMEN = "#F0A94B";
const STAR = "#F5F3EE";
const LILA = "rgba(178, 156, 224, 0.45)";

/**
 * El canvas no puede dibujar imágenes de otro origen sin CORS, y proveedores
 * como pravatar no lo mandan. El optimizador de Next las re-sirve desde
 * nuestro propio origen, así que dejan de ser cross-origin.
 */
function sameOriginAvatar(url: string) {
  return `/_next/image?url=${encodeURIComponent(url)}&w=64&q=75`;
}

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
  // Tocar una estrella la abre en un panel; nunca navega ni conecta: la
  // conexión solo nace de escanear un QR en persona (ADR 0001).
  const [selected, setSelected] = useState<GraphNode | null>(null);

  // Import manual (no next/dynamic): necesitamos pasar ref para zoomToFit
  const [ForceGraph2D, setForceGraph2D] = useState<
    typeof ForceGraph2DComponent | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const didFit = useRef(false);
  // Las fotos se dibujan en canvas: hay que cargar y cachear los Image a mano
  const imgCache = useRef(new Map<string, HTMLImageElement>());
  // Dónde empezó el gesto, para distinguir un toque de un paneo
  const pressRef = useRef<{ x: number; y: number } | null>(null);
  // La estrella que se está arrastrando ahora mismo, si hay alguna
  const dragRef = useRef<SimNode | null>(null);

  // Mis aristas, para contar en el panel de quién ya conozco y con qué nota.
  // Se lee de `edges` (el prop) y no de los links del grafo, que force-graph
  // muta convirtiendo source/target en objetos.
  const myEdgeByPeer = useMemo(() => {
    const map = new Map<string, GraphEdge>();
    for (const edge of edges) {
      if (edge.source === myId) map.set(edge.target, edge);
      else if (edge.target === myId) map.set(edge.source, edge);
    }
    return map;
  }, [edges, myId]);

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
  const isMeSelected = selected?.id === myId;
  const sharedEdge = selected ? myEdgeByPeer.get(selected.id) : undefined;

  // Estos arrays se pasan tal cual a force-graph, que los MUTA añadiendo x/y a
  // cada nodo. Por eso se memorizan: si se recrearan en cada render, la
  // simulación se reiniciaría — y además son la única fuente de posiciones
  // actuales para saber qué estrella hay bajo el dedo.
  const graphNodes = useMemo<SimNode[]>(
    () => nodes.map((n) => (n.id === myId ? { ...n, fx: 0, fy: 0 } : { ...n })),
    [nodes, myId],
  );
  const graphLinks = useMemo(() => edges.map((e) => ({ ...e })), [edges]);
  const graphData = useMemo(
    () => ({ nodes: graphNodes, links: graphLinks }),
    [graphNodes, graphLinks],
  );

  /**
   * Detección de toque propia. force-graph la resuelve con un canvas oculto
   * que solo repinta de vez en cuando (throttle de 800 ms) y que se
   * desincroniza del zoom: las estrellas lejos del centro quedaban muertas.
   * Midiendo la distancia contra las posiciones reales no hay nada que
   * sincronizar.
   */
  function nodeAt(clientX: number, clientY: number) {
    const fg = fgRef.current;
    const el = containerRef.current;
    if (!fg || !el) return null;

    const rect = el.getBoundingClientRect();
    const point = fg.screen2GraphCoords(clientX - rect.left, clientY - rect.top);
    // El radio de agarre son píxeles de pantalla: en coordenadas del grafo
    // depende del zoom, para que acercarse no haga las estrellas más difíciles.
    const grabRadius = 16 / (fg.zoom() || 1);

    let closest: SimNode | null = null;
    let closestDistance = Infinity;
    for (const node of graphNodes) {
      const distance = Math.hypot(
        (node.x ?? 0) - point.x,
        (node.y ?? 0) - point.y,
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = node;
      }
    }
    return closest && closestDistance <= grabRadius ? closest : null;
  }

  /** El mismo test, para el filtro de d3: dice si el gesto empieza sobre una
   *  estrella (entonces es arrastre) o sobre el vacío (entonces es paneo). */
  function nodeUnderEvent(ev: MouseEvent) {
    const touch = (ev as MouseEvent & { touches?: TouchList }).touches?.[0];
    return nodeAt(touch?.clientX ?? ev.clientX, touch?.clientY ?? ev.clientY);
  }

  // La altura la decide el contenedor (h-80 en móvil, columna completa en desktop)
  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      onPointerDown={(e) => {
        pressRef.current = { x: e.clientX, y: e.clientY };
        const node = nodeAt(e.clientX, e.clientY);
        if (node) {
          dragRef.current = node;
          e.currentTarget.setPointerCapture(e.pointerId);
        }
      }}
      onPointerUp={(e) => {
        const start = pressRef.current;
        const dragged = dragRef.current;
        pressRef.current = null;
        dragRef.current = null;
        if (dragged) e.currentTarget.releasePointerCapture(e.pointerId);

        // Si el dedo se desplazó fue arrastre o paneo, no un toque. La estrella
        // se queda donde la soltaste: fx/fy siguen puestos a propósito.
        if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) {
          return;
        }
        const node = nodeAt(e.clientX, e.clientY);
        if (node) setSelected(node);
      }}
      onPointerMove={(e) => {
        const el = containerRef.current;
        const fg = fgRef.current;
        if (!el) return;

        const dragged = dragRef.current;
        if (dragged && fg) {
          const rect = el.getBoundingClientRect();
          const point = fg.screen2GraphCoords(
            e.clientX - rect.left,
            e.clientY - rect.top,
          );
          dragged.fx = point.x;
          dragged.fy = point.y;
          // Reaviva la simulación para que las estrellas vecinas acompañen
          fg.d3ReheatSimulation();
          return;
        }

        if (e.pointerType !== "mouse") return;
        el.style.cursor = nodeAt(e.clientX, e.clientY) ? "pointer" : "";
      }}
    >
      {width > 0 && height > 0 && ForceGraph2D && (
        <ForceGraph2D
          ref={fgRef}
          width={width}
          height={height}
          // Tu estrella va anclada al centro: cada quien es el nodo principal
          // de su propia vista, tenga o no conexiones todavía.
          graphData={graphData}
          backgroundColor="rgba(0,0,0,0)"
          cooldownTicks={80}
          // force-graph detecta el toque con un canvas oculto que solo repinta
          // mientras hay redibujado (throttle de 800 ms). Al pararse el motor
          // se congelaba, y el zoomToFit de onEngineStop movía las estrellas
          // después: las zonas táctiles quedaban en las posiciones viejas y
          // solo respondían las de cerca del centro. Sin autopausa, el canvas
          // oculto sigue el zoom, el arrastre y las fotos que cargan tarde.
          autoPauseRedraw={false}
          nodeLabel={() => ""}
          // El arrastre nativo usa el mismo canvas oculto que falla al detectar
          // estrellas, así que se reemplaza por el de los handlers de arriba.
          enableNodeDrag={false}
          // Y para que el mapa no se desplace a la vez que la estrella, el
          // paneo se desactiva cuando el gesto empieza sobre una.
          enablePanInteraction={(ev) => !nodeUnderEvent(ev)}
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

            // Foto de perfil (si existe y ya cargó); si no, estrella-punto
            const url = (node as GraphNode).avatarUrl;
            let img: HTMLImageElement | undefined;
            if (url) {
              img = imgCache.current.get(url);
              if (!img) {
                img = new Image();
                img.src = sameOriginAvatar(url);
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
        />
      )}

      <Sheet
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="flex-row items-center gap-4 text-left">
                {selected.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.avatarUrl}
                    alt=""
                    className="size-14 shrink-0 rounded-full border border-border"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground">
                    {selected.name?.charAt(0)?.toUpperCase() ?? "✦"}
                  </div>
                )}
                <div className="min-w-0">
                  <SheetTitle className="font-display text-xl">
                    {isMeSelected ? "Tu estrella" : selected.name}
                  </SheetTitle>
                  <SheetDescription>
                    {selected.headline ?? "sin titular todavía"}
                  </SheetDescription>
                </div>
              </SheetHeader>

              <div className="flex flex-col gap-4 px-4 pb-6">
                {selected.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {isMeSelected ? (
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/perfil">Editar mi estrella</Link>
                  </Button>
                ) : sharedEdge ? (
                  <div className="flex flex-col gap-1">
                    <p className="font-mono text-xs text-primary">
                      [ conectados ✦ ]
                    </p>
                    {sharedEdge.note && (
                      <p className="text-sm text-muted-foreground">
                        “{sharedEdge.note}”
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-mono text-xs leading-5 text-muted-foreground">
                    aún no se han cruzado ✦ escanea su QR cuando se encuentren
                  </p>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
