import Link from "next/link";
import { redirect } from "next/navigation";
import { QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { eventDate } from "@/lib/format";
import { qrSvg } from "@/lib/qr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ConstellationGraph,
  type GraphEdge,
  type GraphNode,
} from "@/components/constellation-graph";

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
    .select("name, headline, tags, qr_slug, avatar_url")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login?error=sin-perfil");

  const qr = await qrSvg(`/u/${profile.qr_slug}`);

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

  let connectionCount = 0;
  let graph: { nodes: GraphNode[]; edges: GraphEdge[] } = {
    nodes: [],
    edges: [],
  };
  let availableEvents: Array<{
    id: string;
    name: string;
    slug: string;
    starts_at: string | null;
  }> = [];

  if (activeEvent) {
    const { data: graphData } = await supabase.rpc("get_event_graph", {
      p_event_id: activeEvent.id,
    });
    if (graphData) graph = graphData;
    connectionCount = graph.edges.filter(
      (e) => e.source === user.id || e.target === user.id,
    ).length;
  } else {
    const { data: events } = await supabase
      .from("events")
      .select("id, name, slug, starts_at")
      .order("starts_at", { ascending: true, nullsFirst: false })
      .limit(12);
    availableEvents = events ?? [];
  }

  const identity = (
    <section className="flex items-center gap-3 sm:gap-4">
      {profile.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar_url}
          alt=""
          className="node-glow size-12 shrink-0 rounded-full border border-border sm:size-14"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="node-glow flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-card font-display text-xl text-primary sm:size-14">
          {profile.name.charAt(0).toUpperCase() || "✦"}
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <h1 className="font-display truncate text-xl font-bold tracking-tight sm:text-2xl">
          {profile.name}
        </h1>
        {profile.headline ? (
          <p className="truncate text-sm text-muted-foreground">
            {profile.headline}
          </p>
        ) : (
          <Link
            href="/perfil"
            className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            completa tu perfil →
          </Link>
        )}
        {profile.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {profile.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
      {activeEvent ? (
        <div className="flex flex-1 flex-col gap-5 lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-8">
          {/* Móvil: identidad y evento arriba, constelación debajo, QR a un tap.
              Desktop: esta columna es la ficha; la constelación toma el resto. */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {identity}

            <section className="flex flex-col gap-1 rounded-2xl border border-primary/25 bg-card p-5">
              <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase sm:text-xs">
                [ estás en ]
              </p>
              <h2 className="font-display text-xl leading-tight font-bold tracking-tight text-balance sm:text-2xl">
                {activeEvent.name}
              </h2>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="font-mono text-xs text-muted-foreground">
                  {eventDate(activeEvent.starts_at) ?? "fecha por definir"}
                </p>
                <Link
                  href="/eventos"
                  className="font-mono text-xs text-primary underline-offset-4 hover:underline"
                >
                  {myEvents.length > 1 ? "cambiar de evento →" : "tus eventos →"}
                </Link>
              </div>
              <p className="mt-3 font-mono text-sm">
                <span className="text-primary">{graph.nodes.length}</span>{" "}
                <span className="text-muted-foreground">
                  {graph.nodes.length === 1 ? "estrella" : "estrellas"}
                </span>{" "}
                <span className="text-muted-foreground">
                  · {connectionCount}{" "}
                  {connectionCount === 1 ? "conexión tuya" : "conexiones tuyas"}
                </span>
              </p>
              {connectionCount === 0 && (
                <p className="mt-1 font-mono text-xs leading-5 text-muted-foreground">
                  tus líneas nacen al escanear ✦ muestra tu QR o abre el de
                  alguien
                </p>
              )}

              {/* En móvil el QR vive a pantalla completa en /qr */}
              <Button
                asChild
                size="lg"
                className="node-glow mt-4 h-12 rounded-full text-base lg:hidden"
              >
                <Link href="/qr">
                  <QrCode className="size-4" aria-hidden />
                  Mostrar mi QR
                </Link>
              </Button>
            </section>

            {/* Desktop: hay sitio de sobra, el QR se queda a la vista */}
            <section className="hidden flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 lg:flex">
              <div
                className="w-full max-w-44 [&_svg]:h-auto [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: qr }}
              />
              <p className="text-center font-mono text-xs text-muted-foreground">
                que te escaneen aquí ✦{" "}
                <Link
                  href="/qr"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  a pantalla completa
                </Link>
              </p>
            </section>
          </div>

          {/* La constelación: media pantalla en móvil, columna entera en desktop */}
          <section className="flex min-h-0 flex-col gap-2 rounded-2xl border border-border bg-card p-2 lg:flex-1">
            <div className="h-[52vh] min-h-64 lg:h-auto lg:min-h-0 lg:flex-1">
              <ConstellationGraph
                nodes={graph.nodes}
                edges={graph.edges}
                myId={user.id}
              />
            </div>
            <p className="px-2 pb-2 text-center font-mono text-[10px] leading-4 text-muted-foreground sm:text-xs">
              la constelación de {activeEvent.name} ✦ toca una estrella para
              verla
            </p>
          </section>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-sm flex-col gap-7 sm:max-w-md">
          {identity}

          {/* Sin evento: descubrir o crear, nunca pantalla muerta */}
          <section className="flex flex-col gap-3">
            <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
              [ eventos activos ]
            </p>
            {availableEvents.length > 0 ? (
              availableEvents.map((event) => (
                <a
                  key={event.id}
                  href={`/e/${event.slug}`}
                  className="group flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary/40"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="font-display truncate text-base font-semibold">
                      {event.name}
                    </span>
                    {eventDate(event.starts_at) && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {eventDate(event.starts_at)}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-primary sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                    entrar →
                  </span>
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
          <section className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-6">
            <div
              className="w-full max-w-40 opacity-70 [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <p className="text-center font-mono text-xs text-muted-foreground">
              tu QR personal — cobra vida dentro de un evento
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
