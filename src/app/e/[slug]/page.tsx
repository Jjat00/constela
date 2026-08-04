import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { eventDateLong } from "@/lib/format";
import { CosmicSky, Galaxia } from "@/components/cosmos";

/**
 * La ficha de la galaxia (ADR 0005): solo para quienes ya están dentro —
 * para extraños esta página no existe (la RPC no les devuelve fila → 404).
 * Ya no es una puerta: a un evento se entra escaneando el QR clavado de
 * alguien que pertenece a él, nunca abriendo un link. Se llega aquí tocando
 * la galaxia en tu lista de eventos.
 */
export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/e/${slug}`)}`);

  // Gated en la base: si no eres asistente ni creador, cero filas
  const { data } = await supabase.rpc("get_event_by_slug", { p_slug: slug });
  const event = data?.[0];
  if (!event) notFound();

  const dateLabel = eventDateLong(event.starts_at);
  const stars = Number(event.attendee_count ?? 0);
  const links = Number(event.connection_count ?? 0);

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-12 pb-32 sm:px-8 sm:py-16 sm:pb-40 lg:pb-48">
      {/* La ficha comparte el vacío premium de la landing, con el horizonte
          del planeta — mirar tu galaxia es asomarse a un mundo tuyo */}
      <CosmicSky />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-5 text-center">
        <Galaxia seed={event.name.length} size={80} active />
        <p className="font-mono text-[10px] tracking-widest text-faint uppercase">
          [ galaxia ]
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {event.name}
        </h1>
        {(event.city || dateLabel) && (
          <p className="font-mono text-xs leading-5 text-muted-foreground sm:text-sm">
            {[event.city, dateLabel].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Quién la encendió: el creador es la única estrella que pudo
            nacer sola — todos los demás entraron persona a persona */}
        {event.creator_name && (
          <div className="flex items-center gap-2.5">
            {event.creator_avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.creator_avatar}
                alt=""
                className="size-7 rounded-full border object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex size-7 items-center justify-center rounded-full border bg-card text-xs font-semibold text-estrella-a">
                {event.creator_name.charAt(0).toUpperCase()}
              </span>
            )}
            <p className="text-sm text-muted-foreground">
              creada por{" "}
              <span className="font-medium text-foreground">
                {event.created_by === user.id ? "ti" : event.creator_name}
              </span>
            </p>
          </div>
        )}

        <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
          {stars} {stars === 1 ? "ESTRELLA" : "ESTRELLAS"} · {links}{" "}
          {links === 1 ? "CONEXIÓN" : "CONEXIONES"}
        </p>

        {/* La galaxia crece persona a persona: tu QR clavado ES su puerta */}
        <Link
          href={`/qr?e=${encodeURIComponent(event.slug)}`}
          className="btn-cosmic mt-2 flex h-13 w-full items-center justify-center gap-2.5 px-7 text-[15px] font-medium sm:w-auto"
        >
          <QrCode className="size-4.5" aria-hidden />
          Mi QR de esta galaxia
        </Link>
        <Link
          href={`/e/${slug}/live`}
          className="font-mono text-xs text-celeste underline-offset-4 hover:underline"
        >
          proyección en vivo ↗
        </Link>
        <Link
          href="/eventos"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          volver a tus eventos
        </Link>
      </div>
    </main>
  );
}
