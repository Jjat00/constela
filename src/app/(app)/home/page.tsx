import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, Link2, Orbit, Star, Triangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { eventDate, timeAgo } from "@/lib/format";
import { qrSvg } from "@/lib/qr";
import { Button } from "@/components/ui/button";
import { Galaxia } from "@/components/cosmos";
import type { GraphEdge, GraphNode } from "@/components/constellation-graph";
import { ConstellationPanel } from "@/components/constellation-panel";
import {
  buildFacets,
  fetchTagCatalog,
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
      qrSvg(`/u/${profile.qr_slug}`),
    ]);
    const availableEvents = events ?? [];

    return (
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-5 py-8 sm:px-0">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ tu universo ]
          </p>
          <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl">
            Tu universo empieza{" "}
            <span className="text-lavanda">en un evento.</span>
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Escanea el QR de alguien que ya esté dentro, entra a un evento
            activo o enciende el tuyo.
          </p>
        </div>

        <section className="flex flex-col gap-2">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ eventos activos ]
          </p>
          {availableEvents.length > 0 ? (
            availableEvents.map((event) => (
              <a
                key={event.id}
                href={`/e/${event.slug}`}
                className="glass group flex min-h-16 items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:border-primary/40"
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
                  className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-lavanda"
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

        <Button
          asChild
          size="lg"
          className="node-glow h-12 rounded-full text-base"
        >
          <Link href="/eventos/nuevo">Crear un evento</Link>
        </Button>

        {/* El QR personal existe desde ya, pero conecta dentro de un evento */}
        <section className="glass flex flex-col items-center gap-4 rounded-3xl p-6">
          <div
            className="w-full max-w-40 opacity-70 [&_svg]:h-auto [&_svg]:w-full"
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

  // Actividad reciente: las últimas líneas dibujadas en ESTA galaxia
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));
  const activity = [...graph.edges]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 4)
    .map((edge) => {
      const mine = edge.source === user.id || edge.target === user.id;
      const peerId = mine
        ? edge.source === user.id
          ? edge.target
          : edge.source
        : edge.source;
      const peer = nodeById.get(peerId);
      const other = mine ? null : nodeById.get(edge.target);
      return {
        id: edge.id,
        avatarUrl: peer?.avatarUrl ?? null,
        name: peer?.name ?? "alguien",
        text: mine
          ? "se conectó contigo"
          : `y ${other?.name?.split(" ")[0] ?? "alguien"} se conectaron`,
        when: timeAgo(edge.createdAt),
      };
    });

  // Galaxias por explorar: eventos donde aún no estás
  const myIds = myEvents.map((ev) => ev.id);
  let galaxiesQuery = supabase
    .from("events")
    .select("id, name, slug, starts_at")
    .order("starts_at", { ascending: true, nullsFirst: false })
    .limit(3);
  if (myIds.length > 0) {
    galaxiesQuery = galaxiesQuery.not("id", "in", `(${myIds.join(",")})`);
  }
  const { data: otherGalaxies } = await galaxiesQuery;

  const stats = [
    {
      label: connectionCount === 1 ? "Conexión tuya" : "Conexiones tuyas",
      value: connectionCount,
      icon: Link2,
      chip: "bg-primary/20 text-lavanda",
    },
    {
      label: graph.nodes.length === 1 ? "Estrella" : "Estrellas",
      value: graph.nodes.length,
      icon: Star,
      chip: "bg-cosmic/15 text-cosmic",
    },
    {
      label: triangleCount === 1 ? "Triángulo" : "Triángulos",
      value: triangleCount,
      icon: Triangle,
      chip: "bg-halfa/15 text-halfa",
    },
    {
      label: myEvents.length === 1 ? "Galaxia" : "Galaxias",
      value: myEvents.length,
      icon: Orbit,
      chip: "bg-estrella-k/15 text-estrella-k",
    },
  ];

  return (
    <main className="relative z-10 flex flex-1 flex-col xl:h-svh xl:flex-row xl:overflow-hidden">
      <h1 className="sr-only">Tu universo — {activeEvent.name}</h1>

      {/* El universo: el grafo es la sala, no una card */}
      <div className="relative h-[56vh] min-h-80 shrink-0 sm:h-[60vh] lg:h-[68vh] xl:h-auto xl:min-h-0 xl:flex-1 xl:shrink">
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
          showHero
        />
      </div>

      {/* Rail de observación: datos reales de ESTE universo */}
      <aside className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 flex flex-col gap-4 px-4 pb-6 sm:px-6 lg:px-8 xl:w-[21rem] xl:shrink-0 xl:overflow-y-auto xl:py-4 xl:pr-4 xl:pb-4 xl:pl-0">
        <section className="glass rounded-3xl p-5">
          <h2 className="text-sm font-semibold">Tu universo</h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {stats.map(({ label, value, icon: Icon, chip }) => (
              <div
                key={label}
                className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/[0.03] p-3"
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-lg ${chip}`}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <p className="text-xl leading-none font-bold">{value}</p>
                <p className="text-[11px] leading-tight text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
          {connectionCount === 0 && (
            <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
              tus líneas nacen al escanear — muestra tu QR o abre el de alguien
            </p>
          )}
        </section>

        <section className="glass rounded-3xl p-5">
          <h2 className="text-sm font-semibold">Actividad reciente</h2>
          {activity.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-3">
              {activity.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  {item.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.avatarUrl}
                      alt=""
                      className="size-8 shrink-0 rounded-full border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-estrella-a">
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <p className="min-w-0 flex-1 text-sm leading-snug">
                    <span className="font-medium">
                      {item.name.split(" ")[0]}
                    </span>{" "}
                    <span className="text-muted-foreground">{item.text}</span>
                  </p>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
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

        <section className="glass rounded-3xl p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold">Explora galaxias</h2>
            <Link
              href="/eventos"
              className="font-mono text-xs text-lavanda underline-offset-4 hover:underline"
            >
              ver todas
            </Link>
          </div>
          {otherGalaxies && otherGalaxies.length > 0 ? (
            <ul className="mt-2 flex flex-col">
              {otherGalaxies.map((event) => (
                <li key={event.id}>
                  <a
                    href={`/e/${event.slug}`}
                    className="group -mx-2 flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-white/5"
                  >
                    <Galaxia seed={event.slug.charCodeAt(0)} size={44} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">
                        {event.name}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {eventDate(event.starts_at) ?? "fecha por definir"}
                      </span>
                    </span>
                    <ChevronRight
                      className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-lavanda"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
              todo el universo conocido ya es tuyo —{" "}
              <Link
                href="/eventos/nuevo"
                className="text-lavanda underline-offset-4 hover:underline"
              >
                enciende otra galaxia
              </Link>
            </p>
          )}
        </section>
      </aside>
    </main>
  );
}
