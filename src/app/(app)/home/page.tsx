import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { eventDate, timeAgo } from "@/lib/format";
import type { GraphEdge, GraphNode } from "@/components/constellation-graph";
import { ConstellationPanel } from "@/components/constellation-panel";
import { DesktopRail, RailContent } from "@/components/home-rail";
import {
  buildFacets,
  fetchTagCatalog,
  labelFor,
  type TagCategory,
  type TagFacet,
} from "@/lib/tags";

/** Los triángulos del evento: el mismo conteo que ioniza el grafo. */
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

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/home");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, onboarded_at, active_event_id")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  // Primera vez: describe tu estrella antes de ver la constelación (ADR 0004)
  if (!profile.onboarded_at) {
    redirect("/bienvenida?next=/home");
  }

  const { data: attendance } = await supabase
    .from("event_attendees")
    .select("joined_at, events(id, name, slug, starts_at)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  const myEvents = (attendance ?? [])
    .map((a) => (Array.isArray(a.events) ? a.events[0] : a.events))
    .filter(Boolean) as Array<{
    id: string;
    name: string;
    slug: string;
    starts_at: string | null;
  }>;

  // Tu galaxia activa (elegida en /eventos o al entrar por un QR);
  // fallback: el último join, para quien aún no ha elegido ninguna
  const activeEvent =
    myEvents.find((ev) => ev.id === profile.active_event_id) ?? myEvents[0];

  let graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    createdBy?: string | null;
  } = {
    nodes: [],
    edges: [],
  };
  let facets: Record<TagCategory, TagFacet[]> = {
    rol: [],
    interes: [],
    intencion: [],
  };
  const catalog = await fetchTagCatalog(supabase);

  if (!activeEvent) {
    // Sin evento todavía: a una galaxia se entra por una persona (ADR 0005)
    // — que te escaneen, o enciende la tuya. Sin QR personal aquí: igual que
    // en /qr, no existe hasta tu primera galaxia.
    return (
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-5 py-8 sm:px-0">
        <div className="flex flex-col gap-3.5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
            [ tu universo ]
          </p>
          <h1 className="text-4xl leading-[1.05] font-bold tracking-[-0.035em] text-balance sm:text-5xl">
            Tu universo empieza{" "}
            <span className="text-celeste">con una persona.</span>
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Escanea el QR de alguien que ya esté dentro de un evento — o
            enciende tu propia galaxia.
          </p>
        </div>

        <Link
          href="/eventos/nuevo"
          className="btn-cosmic flex h-13 items-center justify-center text-base font-medium"
        >
          Crear un evento
        </Link>
      </main>
    );
  }

  const { data: graphData } = await supabase.rpc("get_event_graph", {
    p_event_id: activeEvent.id,
  });
  if (graphData) graph = graphData;
  facets = buildFacets(graph.nodes, catalog);

  const connectionCount = graph.edges.filter(
    (e) => e.source === user.id || e.target === user.id,
  ).length;
  const triangleCount = countTriangles(graph.edges);
  const magnitude = (1.1 + connectionCount * 0.14).toFixed(1);

  // Actividad reciente: las últimas líneas dibujadas en ESTA galaxia
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));
  const firstName = (id: string) =>
    id === user.id
      ? "Tú"
      : (nodeById.get(id)?.name ?? "alguien").split(" ")[0];
  const activity = [...graph.edges]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 4)
    .map((edge) => ({
      id: edge.id,
      a: firstName(edge.source),
      b: firstName(edge.target),
      when: timeAgo(edge.createdAt),
    }));

  // Cerca de tu órbita: estrellas aún sin línea contigo que comparten señales
  const connectedIds = new Set(
    graph.edges.flatMap((e) =>
      e.source === user.id ? [e.target] : e.target === user.id ? [e.source] : [],
    ),
  );
  const me = nodeById.get(user.id);
  const mySignals = new Set([
    ...(me?.role ?? []),
    ...(me?.tags ?? []),
    ...(me?.intents ?? []),
  ]);
  const nearby = graph.nodes
    .filter((n) => n.id !== user.id && !connectedIds.has(n.id))
    .map((n) => {
      const signals = [...n.role, ...n.tags, ...n.intents];
      const shared = signals.filter((s) => mySignals.has(s));
      return { node: n, shared: shared.length };
    })
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
    .map(({ node }) => ({
      id: node.id,
      name: node.name,
      role: node.role.length
        ? node.role.map((r) => labelFor(catalog, "rol", r)).join(" · ")
        : null,
      why: node.intents[0]
        ? labelFor(catalog, "intencion", node.intents[0])
        : null,
    }));

  return (
    <main className="relative z-10 flex flex-1 flex-col lg:h-svh lg:flex-row lg:overflow-hidden">
      <h1 className="sr-only">Tu constelación — {activeEvent.name}</h1>

      {/* La constelación: el grafo es la sala. En móvil llena EXACTO el hueco
          entre el header fijo (pt 4.25rem) y la barra de tabs (pb 5.5rem) del
          layout: con 100vh la página scrolleaba y las pills del panel quedaban
          debajo del chrome fijo. En desktop, con marco. */}
      <div className="relative h-[calc(100svh_-_9.75rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] shrink-0 lg:h-auto lg:my-5 lg:flex-1 lg:overflow-hidden lg:rounded-4xl lg:border lg:border-white/5">
        <ConstellationPanel
          nodes={graph.nodes}
          edges={graph.edges}
          myId={user.id}
          creatorId={graph.createdBy ?? null}
          facets={facets}
          event={{
            name: activeEvent.name,
            dateLabel: eventDate(activeEvent.starts_at),
            galaxySeed: activeEvent.slug.charCodeAt(0),
            switchHref: "/eventos",
            switchLabel: myEvents.length > 1 ? "cambiar" : "tus eventos",
          }}
        />
      </div>

      {/* Rail: solo en desktop, mobile solo muestra grafo */}
      <DesktopRail>
        <RailContent
          activeEvent={activeEvent}
          myEvents={myEvents}
          nodeCount={graph.nodes.length}
          connectionCount={connectionCount}
          triangleCount={triangleCount}
          magnitude={magnitude}
          dateLabel={eventDate(activeEvent.starts_at)}
          activity={activity}
          nearby={nearby}
          galaxySeed={activeEvent.slug.charCodeAt(0)}
        />
      </DesktopRail>
    </main>
  );
}
