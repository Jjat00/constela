"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type ForceGraph2DComponent from "react-force-graph-2d";
import { spectrumOf } from "@/components/cosmos";
import { MiniPerfil } from "@/components/mini-perfil";

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

// StarMap v5 (diseño 1b): estrellas puras — núcleo blanco, halo espectral,
// picos de difracción. Las fotos no viven en el mapa: viven en el MiniPerfil.
// El tú es un sol dorado; las líneas son filamentos blanco azulado y los
// triángulos, gas H-alfa con borde.
const SOL = "#FFD97A";
const SOL_CORE = "#FFF6E3";
const HALFA = "240, 105, 159"; // rgb de --halfa, para armar alphas
const FILAMENTO = "205, 216, 255"; // rgb de estrella A
const CELESTE = "#9DC8FF"; // anillo de selección

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

export function ConstellationGraph({
  nodes,
  edges,
  myId,
  matchedIds = null,
  tagLabels,
  showTriads = true,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  myId: string;
  /**
   * Filtro activo: las estrellas fuera del conjunto no desaparecen — se
   * apagan al 14 %. El mapa sigue siendo el mismo (los nodos no saltan de
   * sitio) y las que te interesan son lo único que brilla.
   */
  matchedIds?: Set<string> | null;
  /** slug → label del catálogo, para que el MiniPerfil hable en humano. */
  tagLabels?: Map<string, string>;
  /** Apagar el gas H-alfa de los cierres triádicos (toggle del panel). */
  showTriads?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  // Tocar una estrella la abre en el MiniPerfil; nunca navega ni conecta: la
  // conexión solo nace de escanear un QR en persona (ADR 0001).
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [zoomLabel, setZoomLabel] = useState("×1.0");

  // Import manual (no next/dynamic): necesitamos pasar ref para zoomToFit
  const [ForceGraph2D, setForceGraph2D] = useState<
    typeof ForceGraph2DComponent | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const didFit = useRef(false);
  // Dónde empezó el gesto, para distinguir un toque de un paneo
  const pressRef = useRef<{ x: number; y: number } | null>(null);
  // La estrella que se está arrastrando ahora mismo, si hay alguna
  const dragRef = useRef<SimNode | null>(null);
  // La estrella bajo el cursor: el canvas la lee en cada frame sin re-render
  const hoverRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  useEffect(() => {
    selectedRef.current = selected?.id ?? null;
  }, [selected]);

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

  // Magnitud: más conexiones = más brillo y radio (DESIGN.md)
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

  // Escape cierra el MiniPerfil (el ✕ existe, pero el teclado también)
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const { width, height } = size;
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

  function zoomBy(factor: number) {
    const fg = fgRef.current;
    if (!fg) return;
    const next = Math.max(0.4, Math.min(6, (fg.zoom() || 1) * factor));
    fg.zoom(next, 200);
    setZoomLabel(`×${next.toFixed(1)}`);
  }

  // La altura la decide el contenedor (columna completa en desktop)
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
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
        const over = nodeAt(e.clientX, e.clientY);
        hoverRef.current = over?.id ?? null;
        el.style.cursor = over ? "pointer" : "";
      }}
      onPointerLeave={() => {
        hoverRef.current = null;
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
          // oculto sigue el zoom, el arrastre y el hover.
          autoPauseRedraw={false}
          nodeLabel={() => ""}
          // El arrastre nativo usa el mismo canvas oculto que falla al detectar
          // estrellas, así que se reemplaza por el de los handlers de arriba.
          enableNodeDrag={false}
          // Y para que el mapa no se desplace a la vez que la estrella, el
          // paneo se desactiva cuando el gesto empieza sobre una.
          enablePanInteraction={(ev) => !nodeUnderEvent(ev)}
          onZoomEnd={({ k }) => setZoomLabel(`×${k.toFixed(1)}`)}
          onEngineStop={() => {
            if (didFit.current || nodes.length < 2) return;
            didFit.current = true;
            fgRef.current?.zoomToFit(0, 48);
            // Con pocos nodos zoomToFit acerca demasiado: tope de zoom
            if ((fgRef.current?.zoom() ?? 1) > 3) fgRef.current?.zoom(3, 0);
            setZoomLabel(`×${(fgRef.current?.zoom() ?? 1).toFixed(1)}`);
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
            if (!lit) return `rgba(${FILAMENTO}, ${0.05 * fade})`;
            // Tocar un extremo enciende el filamento
            const hot =
              hoverRef.current === a ||
              hoverRef.current === b ||
              selectedRef.current === a ||
              selectedRef.current === b;
            return `rgba(${FILAMENTO}, ${(hot ? 0.85 : 0.34) * fade})`;
          }}
          linkWidth={(link) => {
            const end = (e: unknown) =>
              typeof e === "object" && e !== null
                ? String((e as { id?: string }).id ?? "")
                : String(e);
            const a = end(link.source);
            const b = end(link.target);
            const hot =
              hoverRef.current === a ||
              hoverRef.current === b ||
              selectedRef.current === a ||
              selectedRef.current === b;
            return hot ? 1.1 : 0.65;
          }}
          // El gas ionizado de los cierres triádicos, debajo de líneas y estrellas
          onRenderFramePre={(ctx) => {
            if (!showTriads) return;
            const fade = drawInFade();
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
              ctx.fillStyle = `rgba(${HALFA}, ${0.085 * fade})`;
              ctx.fill();
              ctx.strokeStyle = `rgba(${HALFA}, ${0.34 * fade})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const id = String(node.id);
            const isMe = id === myId;
            const x = node.x ?? 0;
            const y = node.y ?? 0;
            const dimmed = matchedIds ? !isLit(id, myId, matchedIds) : false;
            const hot = hoverRef.current === id;
            const isSel = selectedRef.current === id;

            const spec = isMe
              ? { halo: SOL, core: SOL_CORE }
              : spectrumOf(id);
            // Magnitud: el brillo y el radio crecen con las conexiones.
            // El tope ajeno es menor que el del sol: tú brillas más siempre.
            const degree = degreeOf.get(id) ?? 0;
            const mag = Math.min(
              isMe ? 1.6 : 1.35,
              1 + Math.log2(1 + degree) * 0.22,
            );
            const coreR = (isMe ? 4.6 : 2.4) * mag;

            // Fuera del filtro: la estrella no desaparece — baja al 14 %
            if (dimmed) ctx.globalAlpha = 0.14;

            // El sol lleva corona respirando y fotosfera cálida
            if (isMe) {
              const breath = reducedMotion
                ? 1
                : 1 + 0.05 * Math.sin(performance.now() / 1100);
              const coronaR = coreR * 7 * breath;
              const corona = ctx.createRadialGradient(x, y, 0, x, y, coronaR);
              corona.addColorStop(0, hexA(SOL, 0.16));
              corona.addColorStop(1, hexA(SOL, 0));
              ctx.beginPath();
              ctx.arc(x, y, coronaR, 0, 2 * Math.PI);
              ctx.fillStyle = corona;
              ctx.fill();

              const photo = ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                coreR * 2.6,
              );
              photo.addColorStop(0, hexA("#FFE9A8", 0.5));
              photo.addColorStop(1, hexA("#FFE9A8", 0));
              ctx.beginPath();
              ctx.arc(x, y, coreR * 2.6, 0, 2 * Math.PI);
              ctx.fillStyle = photo;
              ctx.fill();
            }

            // Corona espectral: luz que se desvanece, nunca un disco plano
            const glowR = coreR * (hot || isSel ? 5.2 : 4.2);
            const glow = ctx.createRadialGradient(x, y, coreR * 0.4, x, y, glowR);
            glow.addColorStop(0, hexA(spec.halo, isMe ? 0.3 : 0.22));
            glow.addColorStop(1, hexA(spec.halo, 0));
            ctx.beginPath();
            ctx.arc(x, y, glowR, 0, 2 * Math.PI);
            ctx.fillStyle = glow;
            ctx.fill();

            // Halo cercano: aquí vive el color
            ctx.beginPath();
            ctx.arc(x, y, coreR * 1.9, 0, 2 * Math.PI);
            ctx.fillStyle = hexA(spec.halo, isMe ? 0.95 : 0.62);
            ctx.fill();

            // Núcleo blanco-caliente
            ctx.beginPath();
            ctx.arc(x, y, coreR * 0.72, 0, 2 * Math.PI);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();

            // Picos de difracción: el sol siempre; el resto, al ganar magnitud
            if (isMe || degree >= 2) {
              const spike = coreR * 4.6;
              ctx.strokeStyle = hexA(isMe ? SOL_CORE : "#FFFFFF", 0.45);
              ctx.lineWidth = 0.5;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(x - spike, y);
              ctx.lineTo(x + spike, y);
              ctx.moveTo(x, y - spike);
              ctx.lineTo(x, y + spike);
              ctx.stroke();
            }

            // Anillo de selección
            if (isSel) {
              ctx.beginPath();
              ctx.arc(x, y, coreR * 3.4, 0, 2 * Math.PI);
              ctx.strokeStyle = hexA(CELESTE, 0.9);
              ctx.lineWidth = 1.1 / globalScale;
              ctx.stroke();
            }

            // Etiqueta: tú siempre; el resto al pasar, seleccionar o filtrar
            const showLabel =
              !dimmed &&
              (isMe || hot || isSel || (matchedIds?.has(id) ?? false));
            if (showLabel) {
              const label = isMe
                ? "tú"
                : String(node.name ?? "").split(" ")[0].toLowerCase();
              const fontSize = Math.max(11 / globalScale, 3.5);
              ctx.font = `500 ${fontSize}px ui-monospace, monospace`;
              ctx.textAlign = "left";
              ctx.textBaseline = "middle";
              const labelX = x + coreR * 3.6 + 3;
              ctx.lineWidth = fontSize / 4;
              ctx.strokeStyle = "rgba(2, 3, 10, 0.75)";
              ctx.strokeText(label, labelX, y);
              ctx.fillStyle = isMe ? SOL : "#F8FAFF";
              ctx.fillText(label, labelX, y);
            }

            if (dimmed) ctx.globalAlpha = 1;
          }}
        />
      )}

      {/* Control de zoom (diseño StarMap): esquina inferior izquierda */}
      <div className="glass absolute bottom-4 left-4 z-10 hidden items-center gap-0.5 rounded-full p-1 lg:flex">
        <button
          type="button"
          onClick={() => zoomBy(0.8)}
          aria-label="Alejar"
          className="grid size-7.5 place-items-center rounded-full text-[15px] text-muted-foreground transition-colors hover:bg-celeste/15 hover:text-foreground"
        >
          −
        </button>
        <span className="min-w-8.5 text-center font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
          {zoomLabel}
        </span>
        <button
          type="button"
          onClick={() => zoomBy(1.25)}
          aria-label="Acercar"
          className="grid size-7.5 place-items-center rounded-full text-[15px] text-muted-foreground transition-colors hover:bg-celeste/15 hover:text-foreground"
        >
          +
        </button>
      </div>

      {/* La ficha de la estrella tocada: card flotante en desktop, sheet en móvil */}
      {selected && (
        <div className="absolute inset-x-0 bottom-0 z-20 lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[344px]">
          <MiniPerfil
            node={selected}
            isMe={selected.id === myId}
            degree={degreeOf.get(selected.id) ?? 0}
            connected={Boolean(sharedEdge)}
            note={sharedEdge?.note ?? null}
            tagLabels={tagLabels}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </div>
  );
}
