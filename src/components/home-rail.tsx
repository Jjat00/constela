"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChartNoAxesColumn, QrCode, X } from "lucide-react";
import { Galaxia } from "@/components/cosmos";

interface RailContentProps {
  activeEvent: {
    name: string;
  };
  myEvents: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  nodeCount: number;
  connectionCount: number;
  triangleCount: number;
  magnitude: string;
  dateLabel: string | null;
  activity: Array<{
    id: string;
    a: string;
    b: string;
    when: string;
  }>;
  nearby: Array<{
    id: string;
    name: string;
    role: string | null;
    why: string | null;
  }>;
  galaxySeed: number;
}

function RailLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] tracking-wider text-faint uppercase">
      {children}
    </p>
  );
}

export function RailContent({
  activeEvent,
  myEvents,
  nodeCount,
  connectionCount,
  triangleCount,
  magnitude,
  dateLabel,
  activity,
  nearby,
  galaxySeed,
}: RailContentProps) {
  return (
    <>
      {/* Constelación actual: prominente al tope */}
      <section className="glass flex flex-col gap-3.5 rounded-4xl p-5 xl:bg-sol/[0.08] xl:border xl:border-sol/20">
        <div className="flex items-center gap-3">
          <Galaxia seed={galaxySeed} size={48} active />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              Constelación
            </p>
            <p className="mt-1 text-lg font-bold leading-tight">
              {activeEvent.name}
            </p>
            <p className="mt-1.5 font-mono text-xs text-muted-foreground">
              {nodeCount} {nodeCount === 1 ? "estrella" : "estrellas"}
              {dateLabel ? ` · ${dateLabel}` : ""}
            </p>
          </div>
        </div>
        {myEvents.length > 1 && (
          <Link
            href="/eventos"
            className="text-xs text-celeste font-medium underline-offset-2 hover:underline"
          >
            cambiar constelación →
          </Link>
        )}
      </section>

      <section className="glass flex flex-col gap-4.5 rounded-4xl p-5">
        <div className="hidden flex-col gap-2 xl:hidden">
          <RailLabel>[ constelación activa ]</RailLabel>
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {activeEvent.name}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {nodeCount} {nodeCount === 1 ? "estrella" : "estrellas"}
                {dateLabel ? ` · ${dateLabel}` : ""}
              </p>
            </div>
            <Link
              href="/eventos"
              className="shrink-0 font-mono text-xs text-celeste underline-offset-4 hover:underline"
            >
              {myEvents.length > 1 ? "cambiar" : "ver todas"}
            </Link>
          </div>
        </div>

        <div>
          <RailLabel>[ tu red ]</RailLabel>
          <div className="mt-3 flex gap-2.5">
            <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.03] px-2.5 py-3">
              <p className="text-[22px] leading-none font-semibold">
                {connectionCount}
              </p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {connectionCount === 1 ? "conexión" : "conexiones"}
              </p>
            </div>
            <div className="flex-1 rounded-2xl border border-halfa/20 bg-halfa/5 px-2.5 py-3">
              <p className="text-[22px] leading-none font-semibold text-halfa">
                {triangleCount}
              </p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {triangleCount === 1 ? "triángulo" : "triángulos"}
              </p>
            </div>
            <div className="flex-1 rounded-2xl border border-sol/20 bg-sol/5 px-2.5 py-3">
              <p className="text-[22px] leading-none font-semibold text-sol">
                {magnitude}
              </p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                magnitud
              </p>
              <p className="font-mono text-[9px] text-faint">
                tu brillo: conexiones × 0.14 + 1.1
              </p>
            </div>
          </div>
          {connectionCount === 0 && (
            <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
              tus líneas nacen al escanear — muestra tu QR o abre el de
              alguien
            </p>
          )}
        </div>
      </section>

      <section className="glass rounded-4xl p-5">
        <RailLabel>[ se acaban de conectar ]</RailLabel>
        {activity.length > 0 ? (
          <ul className="mt-2.5 flex flex-col">
            {activity.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.04] -mx-2"
              >
                <span
                  aria-hidden
                  className="size-[5px] shrink-0 rounded-full bg-estrella-a"
                />
                <p className="min-w-0 flex-1 truncate text-[13px]">
                  {item.a} <span className="text-faint">↔</span> {item.b}
                </p>
                <span className="shrink-0 font-mono text-[10px] text-faint">
                  {item.when}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
            aún no se dibujan líneas en esta galaxia — sé la primera
          </p>
        )}
      </section>

      <section className="glass rounded-4xl p-5">
        <RailLabel>[ cerca de tu órbita ]</RailLabel>
        {nearby.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {nearby.map((person) => (
              <li
                key={person.id}
                className="flex items-center gap-2.5 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
              >
                <span
                  aria-hidden
                  className="size-[7px] shrink-0 rounded-full bg-estrella-b"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">
                    {person.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {[person.role, person.why].filter(Boolean).join(" · ") ||
                      "todavía sin señales"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
            cuando lleguen estrellas afines a tu órbita, aparecen aquí
          </p>
        )}
      </section>

      <Link
        href="/qr"
        className="glass flex items-center gap-3.5 rounded-4xl p-4.5 transition-colors hover:border-sol/30"
      >
        <QrCode className="size-6.5 shrink-0 text-sol" aria-hidden />
        <span className="min-w-0">
          <span className="block text-[13px] font-medium">Tu QR</span>
          <span className="mt-0.5 block text-[11px] text-muted-foreground">
            a un tap, siempre
          </span>
        </span>
      </Link>
    </>
  );
}

export function DesktopRail({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <aside className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 hidden lg:flex flex-col gap-4 px-4 pt-4 pb-6 sm:px-6 lg:px-8 lg:w-[19.5rem] lg:shrink-0 lg:overflow-y-auto lg:px-0 lg:py-5 lg:pr-5 lg:pl-4">
      {children}
    </aside>
  );
}

/**
 * Los mismos datos del rail, en móvil: un botón de cristal arriba a la derecha
 * (a la altura del pill de la galaxia, la otra esquina libre del mapa) que
 * abre una hoja desde abajo — al alcance del pulgar, como todo el chrome móvil.
 */
export function MobileRailDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Escape cierra la hoja: el ✕ existe, pero un teclado bluetooth también
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Trigger: alineado con el pill de la galaxia, bajo el header fijo */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Ver los datos de tu constelación"
        className="glass fixed top-[calc(4.75rem+env(safe-area-inset-top))] right-3 z-30 grid size-11 place-items-center rounded-full transition-colors hover:border-celeste/35 active:scale-95 lg:hidden"
      >
        <ChartNoAxesColumn className="size-4.5" aria-hidden />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div
            role="dialog"
            aria-label="Datos de tu constelación"
            className="animate-rise fixed inset-x-0 bottom-0 z-50 max-h-[85svh] overflow-y-auto rounded-t-4xl border border-white/10 bg-background lg:hidden"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/5 bg-background px-4 py-3">
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                [ tu constelación ]
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-celeste/15 hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="flex flex-col gap-4 px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
              {children}
            </div>
          </div>
        </>
      )}
    </>
  );
}
