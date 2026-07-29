import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { eventDate, timeAgo } from "@/lib/format";
import { qrSvg } from "@/lib/qr";
import { Galaxia } from "@/components/cosmos";
import type { GraphEdge, GraphNode } from "@/components/constellation-graph";
import { ConstellationPanel } from "@/components/constellation-panel";
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

function RailLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
      {children}
    </p>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e: requestedSlug } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/home");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, qr_slug, onboarded_at")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  // Primera vez: describe tu estrella antes de ver la constelación (ADR 0004)
  if (!profile.onboarded_at) {
    const back = requestedSlug ? `/home?e=${requestedSlug}` : "/home";
    redirect(`/bienvenida?next=${encodeURIComponent(back)}`);
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

  // ?e=slug elige qué constelación ver; sin él, la del último join
  const activeEvent =
    myEvents.find((ev) => ev.slug === requestedSlug) ?? myEvents[0];

  let graph: { nodes: GraphNode[]; edges: GraphEdge[] } = {
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
    // Sin evento todavía: descubrir o crear, nunca pantalla muerta
    const [{ data: events }, qr] = await Promise.all([
      supabase
        .from("events")
        .select("id, name, slug, starts_at")
        .order("starts_at", { ascending: true, nullsFirst: false })
        .limit(12),
      qrSvg(`/u/${profile.qr_slug}`, "sol"),
    ]);
    const availableEvents = events ?? [];

    return (
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-5 py-8 sm:px-0">
        <div className="flex flex-col gap-3.5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
            [ tu universo ]
          </p>
          <h1 className="text-4xl leading-[1.05] font-bold tracking-[-0.035em] text-balance sm:text-5xl">
            Tu universo empieza{" "}
            <span className="text-celeste">en un evento.</span>
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Escanea el QR de alguien que ya esté dentro, entra a un evento
            activo o enciende el tuyo.
          </p>
        </div>

        <section className="flex flex-col gap-2">
          <RailLabel>[ eventos activos ]</RailLabel>
          {availableEvents.length > 0 ? (
            availableEvents.map((event) => (
              <a
                key={event.id}
                href={`/e/${event.slug}`}
                className="glass group flex min-h-16 items-center gap-3 rounded-3xl px-4 py-3 transition-colors hover:border-celeste/35"
              >
                <Galaxia seed={event.slug.charCodeAt(0)} size={40} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-base font-semibold">
                    {event.name}
                  </span>
                  {eventDate(event.starts_at) && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {eventDate(event.starts_at)}
                    </span>
                  )}
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-celeste"
                  aria-hidden
                />
              </a>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              Aún no hay eventos. Crea el primero y comparte su QR.
            </p>
          )}
        </section>

        <Link
          href="/eventos/nuevo"
          className="btn-cosmic flex h-13 items-center justify-center text-base font-medium"
        >
          Crear un evento
        </Link>

        {/* El QR personal existe desde ya, pero conecta dentro de un evento */}
        <section className="glass flex flex-col items-center gap-4 rounded-4xl p-6">
          <div
            className="w-full max-w-40 opacity-80 [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <p className="text-center font-mono text-xs text-muted-foreground">
            tu QR personal — cobra vida dentro de un evento
          </p>
        </section>
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
    ...(me?.role ? [me.role] : []),
    ...(me?.tags ?? []),
    ...(me?.intents ?? []),
  ]);
  const nearby = graph.nodes
    .filter((n) => n.id !== user.id && !connectedIds.has(n.id))
    .map((n) => {
      const signals = [
        ...(n.role ? [n.role] : []),
        ...n.tags,
        ...n.intents,
      ];
      const shared = signals.filter((s) => mySignals.has(s));
      return { node: n, shared: shared.length };
    })
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
    .map(({ node }) => ({
      id: node.id,
      name: node.name,
      role: node.role ? labelFor(catalog, "rol", node.role) : null,
      why: node.intents[0]
        ? labelFor(catalog, "intencion", node.intents[0])
        : null,
    }));

  return (
    <main className="relative z-10 flex flex-1 flex-col xl:h-svh xl:flex-row xl:overflow-hidden">
      <h1 className="sr-only">Tu constelación — {activeEvent.name}</h1>

      {/* El universo: el grafo es la sala. En desktop, dentro de su marco. */}
      <div className="relative h-[62vh] min-h-80 shrink-0 sm:h-[64vh] lg:h-[70vh] xl:my-5 xl:h-auto xl:min-h-0 xl:flex-1 xl:shrink xl:overflow-hidden xl:rounded-4xl xl:border xl:border-white/5">
        <ConstellationPanel
          nodes={graph.nodes}
          edges={graph.edges}
          myId={user.id}
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

      {/* Rail de observación (1b): datos reales de ESTE universo */}
      <aside className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 flex flex-col gap-4 px-4 pt-4 pb-6 sm:px-6 lg:px-8 xl:w-[19.5rem] xl:shrink-0 xl:overflow-y-auto xl:px-0 xl:py-5 xl:pr-5 xl:pl-4">
        <section className="glass flex flex-col gap-4.5 rounded-4xl p-5">
          <div className="hidden flex-col gap-2 xl:flex">
            <RailLabel>[ constelación activa ]</RailLabel>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {activeEvent.name}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {graph.nodes.length}{" "}
                  {graph.nodes.length === 1 ? "estrella" : "estrellas"}
                  {eventDate(activeEvent.starts_at)
                    ? ` · ${eventDate(activeEvent.starts_at)}`
                    : ""}
                </p>
              </div>
              <Link
                href="/eventos"
                className="shrink-0 font-mono text-xs text-celeste underline-offset-4 hover:underline"
              >
                {myEvents.length > 1 ? "cambiar" : "ver todas"}
              </Link>
            </div>
          </div>

          <div>
            <RailLabel>[ tu red ]</RailLabel>
            <div className="mt-3 flex gap-2.5">
              <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.03] px-2.5 py-3">
                <p className="text-[22px] leading-none font-semibold">
                  {connectionCount}
                </p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {connectionCount === 1 ? "conexión" : "conexiones"}
                </p>
              </div>
              <div className="flex-1 rounded-2xl border border-halfa/20 bg-halfa/5 px-2.5 py-3">
                <p className="text-[22px] leading-none font-semibold text-halfa">
                  {triangleCount}
                </p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {triangleCount === 1 ? "triángulo" : "triángulos"}
                </p>
              </div>
              <div className="flex-1 rounded-2xl border border-sol/20 bg-sol/5 px-2.5 py-3">
                <p className="text-[22px] leading-none font-semibold text-sol">
                  {magnitude}
                </p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  magnitud
                </p>
              </div>
            </div>
            {connectionCount === 0 && (
              <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
                tus líneas nacen al escanear — muestra tu QR o abre el de
                alguien
              </p>
            )}
          </div>
        </section>

        <section className="glass rounded-4xl p-5">
          <RailLabel>[ se acaban de conectar ]</RailLabel>
          {activity.length > 0 ? (
            <ul className="mt-2.5 flex flex-col">
              {activity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.04] -mx-2"
                >
                  <span
                    aria-hidden
                    className="size-[5px] shrink-0 rounded-full bg-estrella-a"
                  />
                  <p className="min-w-0 flex-1 truncate text-[13px]">
                    {item.a} <span className="text-faint">↔</span> {item.b}
                  </p>
                  <span className="shrink-0 font-mono text-[10px] text-faint">
                    {item.when}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
              aún no se dibujan líneas en esta galaxia — sé la primera
            </p>
          )}
        </section>

        <section className="glass rounded-4xl p-5">
          <RailLabel>[ cerca de tu órbita ]</RailLabel>
          {nearby.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {nearby.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center gap-2.5 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                >
                  <span
                    aria-hidden
                    className="size-[7px] shrink-0 rounded-full bg-estrella-b"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">
                      {person.name}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {[person.role, person.why].filter(Boolean).join(" · ") ||
                        "todavía sin señales"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
              cuando lleguen estrellas afines a tu órbita, aparecen aquí
            </p>
          )}
        </section>

        <Link
          href="/qr"
          className="glass flex items-center gap-3.5 rounded-4xl p-4.5 transition-colors hover:border-sol/30"
        >
          <QrCode className="size-6.5 shrink-0 text-sol" aria-hidden />
          <span className="min-w-0">
            <span className="block text-[13px] font-medium">Tu QR</span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">
              a un tap, siempre
            </span>
          </span>
        </Link>
      </aside>
    </main>
  );
}
