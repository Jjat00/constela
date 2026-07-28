import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_profile_by_slug", {
    p_slug: slug,
  });

  const profile = data?.[0];
  if (!profile) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isMe = user?.id === profile.id;

  // Abrir el QR de alguien lo hace TODO solo (ADR 0001): te une a su evento
  // (membresía contagiosa) y crea la conexión — sin botones ni formularios.
  let joinedEvent:
    | { event_id: string; event_name: string; event_slug: string }
    | undefined;
  let connected = false;
  if (user && !isMe) {
    const { data: joined } = await supabase.rpc("join_event_via_profile", {
      p_slug: slug,
    });
    joinedEvent = joined?.[0];

    if (joinedEvent) {
      // Par canónico: el orden hex textual de los uuid coincide con el de PG
      const [a, b] =
        user.id < profile.id ? [user.id, profile.id] : [profile.id, user.id];
      const { error } = await supabase.from("connections").insert({
        event_id: joinedEvent.event_id,
        user_a: a,
        user_b: b,
        created_by: user.id,
      });
      // 23505 = ya estaban conectados: mismo estado feliz
      connected = !error || error.code === "23505";
    }
  }

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[24rem] w-[38rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.8 0.14 70 / 55%), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 text-center sm:max-w-md sm:gap-7">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt=""
            className="node-glow size-20 rounded-full border border-border sm:size-24"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="node-glow flex size-20 items-center justify-center rounded-full bg-primary font-display text-3xl font-bold text-primary-foreground sm:size-24 sm:text-4xl">
            {profile.name?.charAt(0)?.toUpperCase() ?? "✦"}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ una estrella de la constelación ]
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {profile.name}
          </h1>
          {profile.headline && (
            <p className="text-sm text-muted-foreground">{profile.headline}</p>
          )}
        </div>

        {profile.tags?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {profile.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {isMe ? (
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-full sm:w-auto sm:px-7"
          >
            <Link href="/qr">Este eres tú ✦ volver a mi QR</Link>
          </Button>
        ) : user ? (
          connected && joinedEvent ? (
            <div className="flex w-full flex-col items-center gap-3">
              <p className="font-mono text-sm text-primary">
                [ conectados en {joinedEvent.event_name} ✦ ]
              </p>
              <Button
                asChild
                size="lg"
                className="node-glow h-12 w-full rounded-full px-7 sm:w-auto"
              >
                <Link href={`/home?e=${joinedEvent.event_slug}`}>
                  Ver la constelación
                </Link>
              </Button>
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              Esta estrella aún no está en ningún evento. Cuando entre a uno,
              abrir su QR los conectará.
            </p>
          )
        ) : (
          <Button
            asChild
            size="lg"
            className="node-glow h-12 w-full rounded-full px-7 sm:w-auto"
          >
            <a href={`/login?next=/u/${slug}`}>Entrar para conectar</a>
          </Button>
        )}
      </div>
    </main>
  );
}
