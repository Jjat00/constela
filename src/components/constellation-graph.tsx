"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type ForceGraph2DComponent from "react-force-graph-2d";
import { spectrumOf } from "@/components/cosmos";
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

/** Un nodo ya en manos de la simulación: force-graph le añade posición, y
 *  fx/fy lo clavan en un punto (es como se ancla o se arrastra una estrella). */
type SimNode = GraphNode & {
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
};

// Cinematic Universe (DESIGN.md v4): el tú es un sol dorado; el resto,
// estrellas con clase espectral estable y magnitud según conexiones. Las
// líneas son filamentos de atlas (blanco azulado) y los triángulos, H-alfa.
const SOL = "#FFD97A";
const SOL_CORE = "#FFF6E3";
const HALFA = "240, 105, 159"; // rgb de --halfa, para armar alphas

function hexA(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Tu estrella nunca se apaga: es el ancla de tu propio mapa. */
function isLit(id: string, myId: string, matched: Set<string>) {
  return id === myId || matched.has(id);
}

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

  // Magnitud: más conexiones = más brillo y radio (DESIGN.md v3)
  const degreeOf = useMemo(() => {
    const map = new Map<string, number>();
    for (const edge of edges) {
      map.set(edge.source, (map.get(edge.source) ?? 0) + 1);
      map.set(edge.target, (map.get(edge.target) ?? 0) + 1);
    }
    return map;
  }, [edges]);

  // Cierres triádicos: cada triángulo del grafo se ioniza en H-alfa.
  // O(aristas × grado): de sobra para la escala de un evento.
  const triangles = useMemo(() => {
    const neighbors = new Map<string, Set<string>>();
    for (const edge of edges) {
      if (!neighbors.has(edge.source)) neighbors.set(edge.source, new Set());
      if (!neighbors.has(edge.target)) neighbors.set(edge.target, new Set());
      neighbors.get(edge.source)!.add(edge.target);
      neighbors.get(edge.target)!.add(edge.source);
    }
    const found: Array<[string, string, string]> = [];
    for (const edge of edges) {
      const a = edge.source < edge.target ? edge.source : edge.target;
      const b = edge.source < edge.target ? edge.target : edge.source;
      for (const c of neighbors.get(a) ?? []) {
        // c > b evita contar el mismo triángulo tres veces
        if (c > b && neighbors.get(b)?.has(c)) found.push([a, b, c]);
      }
    }
    return found;
  }, [edges]);

  // El canvas no respeta prefers-reduced-motion solo: se le pregunta una vez
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // La constelación se dibuja al entrar (~1.8s): los filamentos aparecen en
  // fundido. Con calma pedida, estado final directo.
  const mountAt = useRef(0);
  useEffect(() => {
    mountAt.current = performance.now();
  }, []);
  const drawInFade = () =>
    reducedMotion || mountAt.current === 0
      ? 1
      : Math.min(1, (performance.now() - mountAt.current) / 1800);

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

  // El motor repinta sin pausa (autoPauseRedraw={false}, ver abajo). Cuando
  // la pestaña se oculta, se detiene el rAF: el teléfono pasa la noche del
  // evento en la mano y la batería importa.
  useEffect(() => {
    const onVisibility = () => {
      const fg = fgRef.current;
      if (!fg) return;
      if (document.hidden) fg.pauseAnimation();
      else fg.resumeAnimation();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
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
  const nodeById = useMemo(() => {
    const map = new Map<string, SimNode>();
    for (const node of graphNodes) map.set(node.id, node);
    return map;
  }, [graphNodes]);

  // Las aristas que forman parte de un triángulo se dibujan en H-alfa
  const triangleEdges = useMemo(() => {
    const set = new Set<string>();
    for (const [a, b, c] of triangles) {
      set.add(`${a}|${b}`);
      set.add(`${a}|${c}`);
      set.add(`${b}|${c}`);
    }
    return set;
  }, [triangles]);

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
          linkColor={(link) => {
            const end = (e: unknown) =>
              typeof e === "object" && e !== null
                ? String((e as { id?: string }).id ?? "")
                : String(e);
            const a = end(link.source);
            const b = end(link.target);
            const fade = drawInFade();
            // Una línea solo brilla si sus dos extremos siguen encendidos
            const lit =
              !matchedIds ||
              (isLit(a, myId, matchedIds) && isLit(b, myId, matchedIds));
            if (!lit) return `rgba(205, 216, 255, ${0.07 * fade})`;
            // La arista que cierra un triángulo se ioniza en H-alfa
            const key = a < b ? `${a}|${b}` : `${b}|${a}`;
            return triangleEdges.has(key)
              ? `rgba(${HALFA}, ${0.55 * fade})`
              : `rgba(205, 216, 255, ${0.4 * fade})`;
          }}
          linkWidth={0.8}
          // El gas ionizado de los cierres triádicos, debajo de líneas y estrellas
          onRenderFramePre={(ctx) => {
            for (const [a, b, c] of triangles) {
              if (
                matchedIds &&
                !(
                  isLit(a, myId, matchedIds) &&
                  isLit(b, myId, matchedIds) &&
                  isLit(c, myId, matchedIds)
                )
              ) {
                continue;
              }
              const na = nodeById.get(a);
              const nb = nodeById.get(b);
              const nc = nodeById.get(c);
              if (!na || !nb || !nc) continue;
              ctx.beginPath();
              ctx.moveTo(na.x ?? 0, na.y ?? 0);
              ctx.lineTo(nb.x ?? 0, nb.y ?? 0);
              ctx.lineTo(nc.x ?? 0, nc.y ?? 0);
              ctx.closePath();
              ctx.fillStyle = `rgba(${HALFA}, ${0.07 * drawInFade()})`;
              ctx.fill();
            }
          }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const isMe = node.id === myId;
            const x = node.x ?? 0;
            const y = node.y ?? 0;

            // Fuera del filtro: polvo tenue, sin foto ni nombre
            if (matchedIds && !isLit(String(node.id), myId, matchedIds)) {
              ctx.beginPath();
              ctx.arc(x, y, 1.8, 0, 2 * Math.PI);
              ctx.fillStyle = "rgba(244, 242, 238, 0.16)";
              ctx.fill();
              return;
            }

            const spec = isMe
              ? { halo: SOL, core: SOL_CORE }
              : spectrumOf(String(node.id));
            // Magnitud: el brillo y el radio crecen con las conexiones.
            // El tope ajeno es menor que el del sol: tú brillas más siempre.
            const degree = degreeOf.get(String(node.id)) ?? 0;
            const mag = Math.min(isMe ? 1.6 : 1.35, 1 + Math.log2(1 + degree) * 0.22);

            // Foto de perfil (si existe y ya cargó); si no, estrella pura
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

            const coreR = (isMe ? 6 : 3) * mag;
            const photoR = (isMe ? 8.5 : 5.5) * mag;
            const baseR = hasPhoto ? photoR : coreR;

            // Corona: luz que se desvanece (gradiente), nunca un disco plano.
            // La del sol respira — quieta si el sistema pide calma.
            const breath =
              isMe && !reducedMotion
                ? 1 + 0.05 * Math.sin(performance.now() / 1100)
                : 1;
            const haloR = baseR * (isMe ? 3.6 : 2.6) * breath;
            const glow = ctx.createRadialGradient(x, y, baseR * 0.4, x, y, haloR);
            glow.addColorStop(0, hexA(spec.halo, isMe ? 0.5 : 0.35));
            glow.addColorStop(0.55, hexA(spec.halo, isMe ? 0.16 : 0.09));
            glow.addColorStop(1, hexA(spec.halo, 0));
            ctx.beginPath();
            ctx.arc(x, y, haloR, 0, 2 * Math.PI);
            ctx.fillStyle = glow;
            ctx.fill();

            // Picos de difracción: el sol siempre; el resto, al ganar magnitud
            if (isMe || degree >= 1) {
              const spike = baseR * (isMe ? 2.6 : 2.1);
              ctx.strokeStyle = hexA(spec.halo, 0.5);
              ctx.lineWidth = 0.5;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(x - spike, y);
              ctx.lineTo(x + spike, y);
              ctx.moveTo(x, y - spike);
              ctx.lineTo(x, y + spike);
              ctx.stroke();
            }

            let labelY: number;
            if (hasPhoto && img) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(x, y, photoR, 0, 2 * Math.PI);
              ctx.clip();
              ctx.drawImage(img, x - photoR, y - photoR, photoR * 2, photoR * 2);
              ctx.restore();
              // Anillo espectral: la foto vive dentro de su estrella
              ctx.beginPath();
              ctx.arc(x, y, photoR, 0, 2 * Math.PI);
              ctx.strokeStyle = hexA(spec.halo, isMe ? 1 : 0.6);
              ctx.lineWidth = isMe ? 0.9 : 0.5;
              ctx.stroke();
              labelY = y + photoR + 2;
            } else {
              // Núcleo blanco-caliente: el color vive en el halo
              ctx.beginPath();
              ctx.arc(x, y, coreR, 0, 2 * Math.PI);
              ctx.fillStyle = spec.core;
              ctx.fill();
              labelY = y + coreR * 2.2 + 2;
            }

            // nombre (primer nombre) debajo
            const label = isMe
              ? "tú"
              : String(node.name ?? "").split(" ")[0].toLowerCase();
            const fontSize = Math.max(10 / globalScale, 3.5);
            ctx.font = `${fontSize}px ui-monospace, monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = isMe ? SOL : "rgba(244, 242, 238, 0.55)";
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
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-full border bg-card text-xl font-bold"
                    style={{
                      color: isMeSelected ? SOL : spectrumOf(selected.id).halo,
                      borderColor: `${isMeSelected ? SOL : spectrumOf(selected.id).halo}66`,
                    }}
                  >
                    {selected.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <SheetTitle className="text-xl">
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
                      [ conectados ]
                    </p>
                    {sharedEdge.note && (
                      <p className="text-sm text-muted-foreground">
                        “{sharedEdge.note}”
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-mono text-xs leading-5 text-muted-foreground">
                    aún no se han cruzado — escanea su QR cuando se encuentren
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
