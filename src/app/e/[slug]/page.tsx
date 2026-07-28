import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { eventDateLong } from "@/lib/format";
import { qrSvg } from "@/lib/qr";
import { Button } from "@/components/ui/button";

export default async function EventPage({
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

  // Auto-join: abrir el QR/link del evento te hace asistente (ADR 0001).
  // 23505 = ya estabas dentro; cualquier otro error se ignora y la página
  // simplemente no confirma la entrada.
  let isAttending = false;
  if (user) {
    const { error } = await supabase
      .from("event_attendees")
      .insert({ event_id: event.id, user_id: user.id });
    isAttending = !error || error.code === "23505";

    // Primera vez en Constela: la bienvenida antes de la constelación (ADR
    // 0004). Va después del join para que nadie pierda la entrada al evento
    // si abandona el onboarding a medias.
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded_at")
      .eq("id", user.id)
      .single();
    if (profile && !profile.onboarded_at) {
      redirect(`/bienvenida?next=${encodeURIComponent(`/e/${slug}`)}`);
    }
  }

  const eventQr = await qrSvg(`/e/${slug}`);
  const dateLabel = eventDateLong(event.starts_at);

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[24rem] w-[38rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.62 0.13 295 / 60%), transparent 70%)",
        }}
      />

      {/* Móvil: una columna centrada. Desktop: ficha a la izquierda, QR grande
          a la derecha — es la pantalla que se proyecta en la entrada. */}
      <div
        className={`relative z-10 grid w-full items-center gap-8 ${
          isAttending
            ? "max-w-md lg:max-w-4xl lg:grid-cols-2 lg:gap-14"
            : "max-w-md"
        }`}
      >
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ evento ]
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {event.name}
          </h1>
          {dateLabel && (
            <p className="font-mono text-xs text-muted-foreground sm:text-sm">
              {dateLabel}
            </p>
          )}

          {isAttending ? (
            <>
              <p className="font-mono text-sm text-primary">
                [ estás dentro ✦ ]
              </p>
              <Button
                asChild
                size="lg"
                className="node-glow h-12 w-full rounded-full px-7 sm:w-auto"
              >
                <Link href={`/home?e=${slug}`}>Ir a esta constelación</Link>
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="lg"
              className="node-glow h-12 w-full rounded-full px-7 sm:w-auto"
            >
              <a href={`/login?next=/e/${slug}`}>Entrar al evento</a>
            </Button>
          )}
        </div>

        {/* La puerta se comparte: cualquiera escanea esto y entra */}
        {isAttending && (
          <section className="mx-auto flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 lg:max-w-sm lg:p-8">
            <div
              className="w-full max-w-44 [&_svg]:h-auto [&_svg]:w-full lg:max-w-full"
              dangerouslySetInnerHTML={{ __html: eventQr }}
            />
            <p className="text-center font-mono text-xs text-muted-foreground">
              el QR del evento — compártelo y crece la constelación
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
