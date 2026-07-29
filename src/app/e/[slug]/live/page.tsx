import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/format";
import { CosmicSky, spectrumOf } from "@/components/cosmos";
import type { GraphEdge, GraphNode } from "@/components/constellation-graph";
import { LiveRefresh } from "./refresh";

/**
 * Proyección en vivo (diseño 2f): sin controles — solo el cielo del evento
 * creciendo y quién acaba de conectar. Pensada para la pantalla grande de
 * la entrada; los datos son los reales del evento.
 */

function countTriangles(edges: GraphEdge[]) {
  const neighbors = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (!neighbors.has(edge.source)) neighbors.set(edge.source, new Set());
    if (!neighbors.has(edge.target)) neighbors.set(edge.target, new Set());
    neighbors.get(edge.source)!.add(edge.target);
    neighbors.get(edge.target)!.add(edge.source);
  }
  let count = 0;
  for (const edge of edges) {
    const a = edge.source < edge.target ? edge.source : edge.target;
    const b = edge.source < edge.target ? edge.target : edge.source;
    for (const c of neighbors.get(a) ?? []) {
      if (c > b && neighbors.get(b)?.has(c)) count++;
    }
  }
  return count;
}

/**
 * El cielo del evento, en SVG de servidor: las estrellas y aristas son
 * reales; las posiciones, una espiral áurea determinista (misma gramática
 * del mapa). Sin interacción — es una proyección.
 */
function CieloDelEvento({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  const n = Math.max(nodes.length, 1);
  const posById = new Map<string, { x: number; y: number }>();
  const sorted = [...nodes].sort((a, b) => a.id.localeCompare(b.id));
  sorted.forEach((node, i) => {
    const a = i * 2.39996;
    const r = i === 0 ? 0 : 0.18 + 0.82 * Math.sqrt(i / n);
    posById.set(node.id, {
      x: 500 + Math.cos(a) * r * 420,
      y: 500 + Math.sin(a) * r * 400,
    });
  });

  const degree = new Map<string, number>();
  for (const e of edges) {
    degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
    degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
  }

  // Triángulos como polígonos H-alfa, debajo de líneas y estrellas
  const neighbors = new Map<string, Set<string>>();
  for (const e of edges) {
    if (!neighbors.has(e.source)) neighbors.set(e.source, new Set());
    if (!neighbors.has(e.target)) neighbors.set(e.target, new Set());
    neighbors.get(e.source)!.add(e.target);
    neighbors.get(e.target)!.add(e.source);
  }
  const triads: string[] = [];
  for (const e of edges) {
    const a = e.source < e.target ? e.source : e.target;
    const b = e.source < e.target ? e.target : e.source;
    for (const c of neighbors.get(a) ?? []) {
      if (c > b && neighbors.get(b)?.has(c)) {
        const pts = [a, b, c]
          .map((id) => posById.get(id))
          .filter(Boolean)
          .map((p) => `${p!.x.toFixed(1)},${p!.y.toFixed(1)}`)
          .join(" ");
        triads.push(pts);
      }
    }
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
    >
      {triads.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="#F0699F"
          fillOpacity={0.085}
          stroke="#F0699F"
          strokeOpacity={0.34}
          strokeWidth={0.6}
        />
      ))}
      {edges.map((e, i) => {
        const a = posById.get(e.source);
        const b = posById.get(e.target);
        if (!a || !b) return null;
        return (
          <line
            key={e.id}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#CDD8FF"
            strokeWidth={0.7}
            opacity={0.34}
            pathLength={1}
            className="animate-draw"
            style={{
              animationDelay: `${0.2 + i * 0.04}s`,
              filter: "drop-shadow(0 0 3px rgba(205,216,255,0.35))",
            }}
          />
        );
      })}
      {sorted.map((node) => {
        const p = posById.get(node.id)!;
        const spec = spectrumOf(node.id);
        const m = 1.4 + Math.min(degree.get(node.id) ?? 0, 7) * 0.5;
        return (
          <g key={node.id} transform={`translate(${p.x} ${p.y})`}>
            <circle
              r={m * 4.2}
              fill={spec.halo}
              opacity={0.22}
              style={{ filter: `blur(${(m * 1.5).toFixed(1)}px)` }}
            />
            <circle r={m * 1.9} fill={spec.halo} opacity={0.62} />
            <circle r={m * 0.75} fill="#FFFFFF" />
            {m > 2.3 && (
              <>
                <line
                  x1={-m * 4.6}
                  y1="0"
                  x2={m * 4.6}
                  y2="0"
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  opacity={0.45}
                  style={{ filter: "blur(0.6px)" }}
                />
                <line
                  x1="0"
                  y1={-m * 4.6}
                  x2="0"
                  y2={m * 4.6}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  opacity={0.45}
                  style={{ filter: "blur(0.6px)" }}
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default async function LivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_event_by_slug", { p_slug: slug });
  const event = data?.[0];
  if (!event) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/e/${slug}/live`)}`);

  const { data: graph } = await supabase.rpc("get_event_graph", {
    p_event_id: event.id,
  });
  const nodes: GraphNode[] = graph?.nodes ?? [];
  const edges: GraphEdge[] = graph?.edges ?? [];

  // El grafo llega vacío si no eres asistente (RLS): la proyección es
  // de puertas para adentro.
  if (nodes.length === 0) {
    return (
      <main className="grain relative flex min-h-svh flex-col items-center justify-center gap-5 px-6 text-center">
        <CosmicSky />
        <p className="relative z-10 max-w-sm text-sm leading-6 text-muted-foreground">
          La proyección es para quienes están dentro del evento.
        </p>
        <Link
          href={`/e/${slug}`}
          className="btn-cosmic relative z-10 flex h-12 items-center px-6 text-sm font-medium"
        >
          Entrar a {event.name}
        </Link>
      </main>
    );
  }

  const triangleCount = countTriangles(edges);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const ticker = [...edges]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 3)
    .map((e) => ({
      id: e.id,
      a: nodeById.get(e.source)?.name?.split(" ")[0] ?? "alguien",
      b: nodeById.get(e.target)?.name?.split(" ")[0] ?? "alguien",
      when: timeAgo(e.createdAt),
    }));

  return (
    <main className="grain relative min-h-svh overflow-hidden">
      <LiveRefresh />
      <CosmicSky />
      <div className="absolute inset-0">
        <CieloDelEvento nodes={nodes} edges={edges} />
      </div>

      {/* Cabecera: el evento y su tamaño */}
      <header className="absolute top-0 right-0 left-0 z-10 flex items-start justify-between p-8 lg:p-12">
        <div>
          <p className="font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
            {event.name}
          </p>
          <p className="mt-3 text-5xl font-bold tracking-[-0.04em] lg:text-6xl">
            {nodes.length}{" "}
            <span className="text-2xl font-normal tracking-normal text-muted-foreground">
              {nodes.length === 1 ? "estrella" : "estrellas"}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
            constela✦ · en vivo
          </p>
          <p className="mt-3 text-3xl font-semibold text-halfa">
            {triangleCount}{" "}
            <span className="text-[15px] font-normal text-muted-foreground">
              {triangleCount === 1 ? "triángulo cerrado" : "triángulos cerrados"}
            </span>
          </p>
        </div>
      </header>

      {/* Ticker: quién acaba de conectar */}
      <footer className="absolute bottom-0 left-0 z-10 flex flex-col gap-2.5 p-8 lg:p-12">
        <h1 className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
          [ se acaban de conectar ]
        </h1>
        {ticker.length > 0 ? (
          ticker.map((t, i) => (
            <p
              key={t.id}
              className={
                i === 0
                  ? "text-2xl font-semibold tracking-[-0.02em] lg:text-3xl"
                  : "text-lg text-foreground/55 lg:text-[22px]"
              }
            >
              {t.a} <span className="text-faint">↔</span> {t.b}{" "}
              <span className="font-mono text-xs text-faint">· {t.when}</span>
            </p>
          ))
        ) : (
          <p className="text-lg text-foreground/55">
            las primeras líneas están por dibujarse
          </p>
        )}
      </footer>
    </main>
  );
}
