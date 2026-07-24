import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
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
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
  const eventQr = await QRCode.toString(`${siteUrl}/e/${slug}`, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#F5F3EE", light: "#0000" },
  });

  const dateLabel = event.starts_at
    ? new Intl.DateTimeFormat("es-CO", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "America/Bogota",
      }).format(new Date(event.starts_at))
    : null;

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[24rem] w-[38rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.62 0.13 295 / 60%), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          [ evento ]
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance">
          {event.name}
        </h1>
        {dateLabel && (
          <p className="font-mono text-xs text-muted-foreground">{dateLabel}</p>
        )}

        {isAttending ? (
          <>
            <p className="font-mono text-sm text-primary">[ estás dentro ✦ ]</p>
            <Button
              asChild
              size="lg"
              className="node-glow h-12 rounded-full px-7"
            >
              <Link href={`/home?e=${slug}`}>Ir a esta constelación</Link>
            </Button>

            {/* La puerta se comparte: cualquiera escanea esto y entra */}
            <section className="mt-4 flex w-full max-w-xs flex-col items-center gap-4 rounded-xl border border-border bg-card p-6">
              <div
                className="w-full max-w-44 [&_svg]:h-auto [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: eventQr }}
              />
              <p className="font-mono text-xs text-muted-foreground">
                el QR del evento — compártelo y crece la constelación
              </p>
            </section>
          </>
        ) : (
          <Button asChild size="lg" className="node-glow h-12 rounded-full px-7">
            <a href={`/login?next=/e/${slug}`}>Entrar al evento</a>
          </Button>
        )}
      </div>
    </main>
  );
}
