import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { eventDate } from "@/lib/format";
import { Galaxia } from "@/components/cosmos";
import { activateEvent } from "./actions";

type Event = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  starts_at: string | null;
  created_by: string | null;
};

/**
 * Constelaciones (diseño 2d): los eventos a los que perteneces, cada uno
 * una galaxia espiral con su lugar, sus estrellas y su fecha. «Ver
 * constelación» te sitúa: ese evento pasa a ser tu galaxia activa y todo
 * (universo, QR) le pertenece hasta que cambies.
 */
export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/eventos");

  const [{ data: attendance }, { data: me }] = await Promise.all([
    supabase
      .from("event_attendees")
      .select("joined_at, events(id, name, slug, city, starts_at, created_by)")
      .eq("user_id", user.id)
      .order("joined_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("active_event_id")
      .eq("id", user.id)
      .single(),
  ]);

  const joined = (attendance ?? [])
    .map((a) => (Array.isArray(a.events) ? a.events[0] : a.events))
    .filter(Boolean) as Event[];

  const activeEventId = joined.some((ev) => ev.id === me?.active_event_id)
    ? me!.active_event_id
    : (joined[0]?.id ?? null);

  // Tu galaxia activa primero; el resto, del join más reciente hacia atrás
  const myEvents = [
    ...joined.filter((ev) => ev.id === activeEventId),
    ...joined.filter((ev) => ev.id !== activeEventId),
  ];

  // Dos consultas para todos los eventos, no dos por evento.
  // RLS: de `event_attendees` solo llegan los eventos donde estoy; de
  // `connections`, solo mis propias aristas — justo lo que se quiere contar.
  const ids = myEvents.map((event) => event.id);
  const [attendeeCounts, connectionCounts] = ids.length
    ? await Promise.all([
        supabase
          .from("event_attendees")
          .select("event_id")
          .in("event_id", ids)
          .then(({ data }) => countBy(data)),
        supabase
          .from("connections")
          .select("event_id")
          .in("event_id", ids)
          .then(({ data }) => countBy(data)),
      ])
    : [new Map<string, number>(), new Map<string, number>()];

  // Quién encendió cada galaxia (decisión: el creador es visible en la card)
  const creatorIds = [
    ...new Set(myEvents.map((ev) => ev.created_by).filter(Boolean)),
  ] as string[];
  const creatorNames = new Map<string, string>();
  if (creatorIds.length) {
    const { data: creators } = await supabase
      .from("profiles")
      .select("id, name")
      .in("id", creatorIds);
    for (const c of creators ?? []) creatorNames.set(c.id, c.name);
  }

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Tus eventos
          </h1>
          {myEvents.length > 0 && (
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Cada evento es una galaxia con su propia constelación — tus
              conexiones no se mezclan entre una y otra.
            </p>
          )}
        </div>
        {myEvents.length > 0 && (
          <Link
            href="/eventos/nuevo"
            className="btn-cosmic hidden h-12 items-center gap-2.5 px-5.5 text-sm font-medium lg:flex"
          >
            <Plus className="size-4 text-estrella-a" aria-hidden />
            Nuevo evento
          </Link>
        )}
      </header>

      {myEvents.length === 0 ? (
        <section className="glass flex flex-1 flex-col items-center justify-center gap-6 rounded-4xl px-6 py-14 text-center">
          {/* Una galaxia lejana: el evento que aún no existe */}
          <Galaxia size={88} className="opacity-80" />
          <div className="flex max-w-xs flex-col gap-2">
            <p className="text-xl font-semibold">
              Aún no estás en ningún evento
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Escanea el QR de alguien que ya esté dentro de un evento y
              aparecerás aquí. O enciende el tuyo.
            </p>
          </div>
          <Link
            href="/eventos/nuevo"
            className="btn-cosmic flex h-12 items-center px-7 text-[15px] font-medium"
          >
            Crear un evento
          </Link>
        </section>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {myEvents.map((event, index) => {
              const isActive = event.id === activeEventId;
              const stars = attendeeCounts.get(event.id) ?? 0;
              const links = connectionCounts.get(event.id) ?? 0;
              const date = eventDate(event.starts_at);

              return (
                <li
                  key={event.id}
                  className="glass group flex flex-col rounded-4xl p-5.5 transition-colors hover:border-celeste/35"
                >
                  {/* Galaxia y nombre llevan a la ficha de la galaxia */}
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/e/${event.slug}`}
                      aria-label={`Ficha de ${event.name}`}
                    >
                      <Galaxia
                        seed={event.slug.charCodeAt(0)}
                        size={88}
                        active={isActive}
                        tilt={-18 - index * 7}
                      />
                    </Link>
                    {isActive && (
                      <span className="rounded-full border border-sol/30 bg-sol/[0.08] px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-sol">
                        ESTÁS AQUÍ
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-xl leading-tight font-semibold tracking-snug text-balance">
                    <Link
                      href={`/e/${event.slug}`}
                      className="transition-colors hover:text-celeste"
                    >
                      {event.name}
                    </Link>
                  </h2>
                  <p className="mt-2 text-[13px] leading-snug text-muted-foreground">
                    {event.city ?? date ?? "lugar por definir"}
                    {event.created_by && (
                      <>
                        {" · "}creada por{" "}
                        {event.created_by === user.id
                          ? "ti"
                          : (creatorNames.get(event.created_by) ?? "alguien")}
                      </>
                    )}
                  </p>

                  {/* Pie anclado abajo: en la grilla las cards comparten
                      altura, así stats y botones quedan alineados entre cards */}
                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-4">
                      <span className="truncate font-mono text-[10px] tracking-wide text-muted-foreground">
                        {stars} {stars === 1 ? "ESTRELLA" : "ESTRELLAS"}
                        {links > 0
                          ? ` · ${links} ${links === 1 ? "TUYA" : "TUYAS"}`
                          : ""}
                      </span>
                      {date && (
                        <span className="shrink-0 font-mono text-[10px] tracking-wide whitespace-nowrap text-faint uppercase">
                          {date}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      {isActive ? (
                        <Link
                          href="/home"
                          className="btn-cosmic flex h-11 flex-1 items-center justify-center text-sm font-medium"
                        >
                          Ver constelación
                        </Link>
                      ) : (
                        <form action={activateEvent} className="flex-1">
                          <input
                            type="hidden"
                            name="slug"
                            value={event.slug}
                          />
                          <button
                            type="submit"
                            className="chip-star flex h-11 w-full cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-colors hover:text-foreground"
                          >
                            Ver constelación
                          </button>
                        </form>
                      )}
                      <Link
                        href={`/qr?e=${encodeURIComponent(event.slug)}`}
                        aria-label={`Mi QR de ${event.name}`}
                        className="chip-star flex h-11 items-center gap-1.5 px-3.5 text-xs font-medium"
                      >
                        <QrCode className="size-4" aria-hidden />
                        Mi QR
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <Link
            href="/eventos/nuevo"
            className="flex min-h-14 items-center justify-center gap-2 rounded-full border border-dashed border-white/15 px-4 py-4 font-mono text-xs text-muted-foreground transition-colors hover:border-celeste/40 hover:text-celeste lg:hidden"
          >
            <Plus className="size-4" aria-hidden />
            nuevo evento
          </Link>
        </>
      )}
    </main>
  );
}

function countBy(rows: Array<{ event_id: string }> | null) {
  const counts = new Map<string, number>();
  for (const row of rows ?? []) {
    counts.set(row.event_id, (counts.get(row.event_id) ?? 0) + 1);
  }
  return counts;
}
