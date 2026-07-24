import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { connectWithProfile } from "./actions";

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;

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

  // Membresía contagiosa (ADR 0001): escanear una estrella que ya está en un
  // evento te une a ese evento automáticamente.
  let joinedEvent:
    | { event_id: string; event_name: string; event_slug: string }
    | undefined;
  let alreadyConnected = false;
  if (user && !isMe) {
    const { data: joined } = await supabase.rpc("join_event_via_profile", {
      p_slug: slug,
    });
    joinedEvent = joined?.[0];

    if (joinedEvent) {
      const [a, b] =
        user.id < profile.id ? [user.id, profile.id] : [profile.id, user.id];
      const { data: existing } = await supabase
        .from("connections")
        .select("id")
        .eq("event_id", joinedEvent.event_id)
        .eq("user_a", a)
        .eq("user_b", b)
        .maybeSingle();
      alreadyConnected = Boolean(existing);
    }
  }

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[24rem] w-[38rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.8 0.14 70 / 55%), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 text-center">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt=""
            className="node-glow size-20 rounded-full border border-border"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="node-glow flex size-20 items-center justify-center rounded-full bg-primary font-display text-3xl font-bold text-primary-foreground">
            {profile.name?.charAt(0)?.toUpperCase() ?? "✦"}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ una estrella de la constelación ]
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
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

        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error === "sin-evento"
              ? "Esta estrella aún no está en ningún evento: no hay dónde conectar."
              : "No pudimos crear la conexión. Intenta de nuevo."}
          </p>
        )}

        {isMe ? (
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/home">Este eres tú ✦ volver a mi QR</Link>
          </Button>
        ) : user ? (
          alreadyConnected ? (
            <div className="flex flex-col items-center gap-3">
              <p className="font-mono text-sm text-primary">
                [ conectados ✦ ]
              </p>
              <Button
                asChild
                size="lg"
                className="node-glow h-12 rounded-full px-7"
              >
                <Link href={`/home?e=${joinedEvent?.event_slug}`}>
                  Ver la constelación
                </Link>
              </Button>
            </div>
          ) : joinedEvent ? (
            <form
              action={connectWithProfile}
              className="flex w-full flex-col gap-3"
            >
              <input type="hidden" name="slug" value={slug} />
              <p className="font-mono text-xs text-primary">
                [ ya estás en {joinedEvent.event_name} ✦ ]
              </p>
              <Input
                name="note"
                maxLength={280}
                placeholder="¿de qué hablaron? (opcional)"
                className="h-12 rounded-lg text-center text-base"
              />
              <Button
                type="submit"
                size="lg"
                className="node-glow h-12 rounded-full text-base"
              >
                Conectar ✦
              </Button>
            </form>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              Esta estrella aún no está en ningún evento. Cuando entre a uno,
              podrás conectar con ella.
            </p>
          )
        ) : (
          <Button asChild size="lg" className="node-glow h-12 rounded-full px-7">
            <a href={`/login?next=/u/${slug}`}>Entrar para conectar</a>
          </Button>
        )}
      </div>
    </main>
  );
}
