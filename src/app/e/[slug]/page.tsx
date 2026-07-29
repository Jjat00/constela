import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { eventDateLong } from "@/lib/format";
import { qrSvg } from "@/lib/qr";
import { CosmicSky, Galaxia } from "@/components/cosmos";

/**
 * La puerta del evento: cualquiera escanea este QR y entra. Para asistentes,
 * también es el acceso a la proyección en vivo (diseño 2f).
 */
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
    <main className="grain relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-12 sm:px-8 sm:py-16">
      {/* La puerta del evento comparte el vacío premium de la landing,
          con el horizonte del planeta — entrar es aterrizar en un mundo */}
      <CosmicSky planet />

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
          {/* El evento es una galaxia */}
          <Galaxia seed={event.name.length} size={80} active={isAttending} />
          <p className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
            [ evento ]
          </p>
          <h1 className="text-3xl font-bold tracking-[-0.035em] text-balance sm:text-4xl lg:text-5xl">
            {event.name}
          </h1>
          {(event.city || dateLabel) && (
            <p className="font-mono text-xs leading-5 text-muted-foreground sm:text-sm">
              {[event.city, dateLabel].filter(Boolean).join(" · ")}
            </p>
          )}

          {isAttending ? (
            <>
              <p className="font-mono text-sm tracking-[0.14em] text-aurora">
                [ estás dentro ]
              </p>
              <Link
                href={`/home?e=${slug}`}
                className="btn-cosmic flex h-13 w-full items-center justify-center px-7 text-[15px] font-medium sm:w-auto"
              >
                Ir a esta constelación
              </Link>
              <Link
                href={`/e/${slug}/live`}
                className="font-mono text-xs text-celeste underline-offset-4 hover:underline"
              >
                proyección en vivo ↗
              </Link>
            </>
          ) : (
            <a
              href={`/login?next=/e/${slug}`}
              className="btn-cosmic flex h-13 w-full items-center justify-center px-7 text-[15px] font-medium sm:w-auto"
            >
              Entrar al evento
            </a>
          )}
        </div>

        {/* La puerta se comparte: cualquiera escanea esto y entra */}
        {isAttending && (
          <section className="glass mx-auto flex w-full max-w-xs flex-col items-center gap-4 rounded-4xl p-6 lg:max-w-sm lg:p-8">
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
