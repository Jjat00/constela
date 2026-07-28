import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Plus, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { eventDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Galaxia } from "@/components/cosmos";

type Event = {
  id: string;
  name: string;
  slug: string;
  starts_at: string | null;
};

export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/eventos");

  const { data: attendance } = await supabase
    .from("event_attendees")
    .select("joined_at, events(id, name, slug, starts_at)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  const myEvents = (attendance ?? [])
    .map((a) => (Array.isArray(a.events) ? a.events[0] : a.events))
    .filter(Boolean) as Event[];

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

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          [ tus eventos ]
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Donde{" "}
          <em className="font-serif font-normal text-primary italic">
            constelas
          </em>
        </h1>
        {myEvents.length > 0 && (
          <p className="text-sm leading-6 text-muted-foreground">
            {myEvents.length === 1
              ? "Estás en una constelación."
              : `Estás en ${myEvents.length} constelaciones.`}{" "}
            Cada evento tiene su propia red — tus conexiones no se mezclan entre
            uno y otro.
          </p>
        )}
      </header>

      {myEvents.length === 0 ? (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-border/70 px-6 py-14 text-center">
          {/* Una galaxia lejana: el evento que aún no existe */}
          <Galaxia size={88} className="opacity-80" />
          <div className="flex max-w-xs flex-col gap-2">
            <p className="font-display text-xl font-semibold">
              Aún no estás en ningún evento
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Escanea el QR de un evento (o el de alguien que ya esté dentro) y
              aparecerás aquí. O enciende el tuyo.
            </p>
          </div>
          <Button asChild size="lg" className="node-glow h-12 rounded-full px-7">
            <Link href="/eventos/nuevo">Crear un evento</Link>
          </Button>
        </section>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myEvents.map((event, index) => {
              // El más reciente es el que abre `/home` sin `?e=`
              const isActive = index === 0;
              const stars = attendeeCounts.get(event.id) ?? 0;
              const links = connectionCounts.get(event.id) ?? 0;
              const date = eventDate(event.starts_at);

              return (
                <li
                  key={event.id}
                  className={`relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-5 ${
                    isActive ? "border-primary/30" : "border-border"
                  }`}
                >
                  {/* Cada evento es una galaxia (DESIGN.md v3) */}
                  <Galaxia
                    seed={index + 2}
                    size={96}
                    className={`absolute -top-6 -right-6 ${
                      isActive ? "opacity-90" : "opacity-50"
                    }`}
                  />
                  <div className="relative flex flex-col gap-1.5">
                    {isActive && (
                      <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">
                        [ estás aquí ]
                      </p>
                    )}
                    <h2 className="font-display text-xl leading-tight font-bold tracking-tight text-balance">
                      {event.name}
                    </h2>
                    <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" aria-hidden />
                      {date ?? "fecha por definir"}
                    </p>
                  </div>

                  <p className="font-mono text-sm">
                    <span className="text-primary">{stars}</span>{" "}
                    <span className="text-muted-foreground">
                      {stars === 1 ? "estrella" : "estrellas"} · {links}{" "}
                      {links === 1 ? "conexión tuya" : "conexiones tuyas"}
                    </span>
                  </p>

                  <div className="mt-auto flex items-center gap-2">
                    <Button
                      asChild
                      variant={isActive ? "default" : "secondary"}
                      className="h-11 flex-1 rounded-full"
                    >
                      <Link href={`/home?e=${event.slug}`}>
                        Ver constelación
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="size-11 rounded-full border border-border"
                    >
                      <a
                        href={`/e/${event.slug}`}
                        aria-label={`QR de ${event.name}`}
                      >
                        <QrCode className="size-4" aria-hidden />
                      </a>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>

          <Link
            href="/eventos/nuevo"
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 px-4 py-4 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary sm:mt-2"
          >
            <Plus className="size-4" aria-hidden />
            empezar otra constelación
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
