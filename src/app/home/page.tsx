import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
  const qrSvg = await QRCode.toString(`${siteUrl}/u/${profile.qr_slug}`, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#F5F3EE", light: "#0000" },
  });

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

  const dateLabel = (starts_at: string | null) =>
    starts_at
      ? new Intl.DateTimeFormat("es-CO", {
          day: "numeric",
          month: "long",
          timeZone: "America/Bogota",
        }).format(new Date(starts_at))
      : null;

  const identity = (
    <section className="flex items-center gap-4">
      {profile.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar_url}
          alt=""
          className="node-glow size-14 rounded-full border border-border"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="node-glow flex size-14 items-center justify-center rounded-full border border-border bg-card font-display text-xl text-primary">
          {profile.name.charAt(0).toUpperCase() || "✦"}
        </div>
      )}
      <div className="flex flex-col">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {profile.name}
        </h1>
        {profile.headline ? (
          <p className="text-sm text-muted-foreground">{profile.headline}</p>
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
    <main className="grain relative flex flex-1 flex-col px-6 py-8 sm:px-10">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold tracking-tight">
            constela<span className="text-primary">✦</span>
          </span>
          <div className="flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="font-mono text-xs text-muted-foreground"
            >
              <Link href="/perfil">perfil</Link>
            </Button>
            <form action="/auth/signout" method="post">
              <Button
                variant="ghost"
                size="sm"
                type="submit"
                className="font-mono text-xs text-muted-foreground"
              >
                salir
              </Button>
            </form>
          </div>
        </header>

        {activeEvent ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr]">
            {/* Columna izquierda: identidad, evento, QR, acciones */}
            <div className="flex flex-col gap-8">
              {identity}

              <section className="flex flex-col gap-1 rounded-xl border border-primary/25 bg-card p-5">
                <p className="font-mono text-xs tracking-[0.3em] text-primary uppercase">
                  [ estás en ]
                </p>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {activeEvent.name}
                </h2>
                <div className="mt-1 flex items-center justify-between">
                  <p className="font-mono text-xs text-muted-foreground">
                    {dateLabel(activeEvent.starts_at) ?? "fecha por definir"}
                  </p>
                  <a
                    href={`/e/${activeEvent.slug}`}
                    className="font-mono text-xs text-primary underline-offset-4 hover:underline"
                  >
                    QR del evento ↗
                  </a>
                </div>
                <p className="mt-3 font-mono text-sm">
                  <span className="text-primary">{graph.nodes.length}</span>{" "}
                  <span className="text-muted-foreground">
                    {graph.nodes.length === 1 ? "estrella" : "estrellas"}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    · {connectionCount}{" "}
                    {connectionCount === 1
                      ? "conexión tuya"
                      : "conexiones tuyas"}
                  </span>
                </p>
              </section>

              {/* Mi QR: el gesto principal en el evento */}
              <section className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6">
                <div
                  className="w-full max-w-48 [&_svg]:h-auto [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <p className="text-center font-mono text-xs text-muted-foreground">
                  que te escaneen aquí ✦
                </p>
              </section>

              {myEvents.length > 1 && (
                <section className="flex flex-col gap-2">
                  <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
                    [ tus otras constelaciones ]
                  </p>
                  {myEvents
                    .filter((event) => event.id !== activeEvent.id)
                    .map((event) => (
                      <Link
                        key={event.id}
                        href={`/home?e=${event.slug}`}
                        className="rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40"
                      >
                        {event.name} →
                      </Link>
                    ))}
                </section>
              )}

              <Link
                href="/eventos/nuevo"
                className="rounded-xl border border-dashed border-border/70 px-4 py-4 text-center font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                + empezar otra constelación
              </Link>
            </div>

            {/* Columna derecha: la constelación, a la altura de la columna izquierda */}
            <section className="flex flex-col gap-2 rounded-xl border border-border bg-card p-2">
              <div className="h-80 lg:h-auto lg:min-h-0 lg:flex-1">
                <ConstellationGraph
                  nodes={graph.nodes}
                  edges={graph.edges}
                  myId={user.id}
                />
              </div>
              <p className="pb-2 text-center font-mono text-xs text-muted-foreground">
                la constelación de {activeEvent.name} ✦
              </p>
            </section>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-sm flex-col gap-8 sm:max-w-md">
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
                    className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary/40"
                  >
                    <span className="flex flex-col">
                      <span className="font-display text-base font-semibold">
                        {event.name}
                      </span>
                      {dateLabel(event.starts_at) && (
                        <span className="font-mono text-xs text-muted-foreground">
                          {dateLabel(event.starts_at)}
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
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
            <section className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-card/50 p-6">
              <div
                className="w-full max-w-40 opacity-70 [&_svg]:h-auto [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <p className="text-center font-mono text-xs text-muted-foreground">
                tu QR personal — cobra vida dentro de un evento
              </p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
