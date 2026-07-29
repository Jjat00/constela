"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Orbit, QrCode, SlidersHorizontal } from "lucide-react";
import { AuraSol, Galaxia } from "@/components/cosmos";
import { cn } from "@/lib/utils";

// CONTEXT.md: la pantalla principal se llama «Universo»; «constelación» es
// el dibujo, nunca el evento — por eso /eventos se llama por su nombre.
// Ajustes (cuenta y preferencias) es distinto de /perfil (quién eres en el
// cielo): a /perfil se llega por la identidad del sidebar o desde Ajustes.
// (El tab «Estrellas» volverá cuando exista la lista de conexiones.)
const TABS = [
  { href: "/home", label: "Universo", icon: Orbit },
  { href: "/qr", label: "Mi QR", icon: QrCode },
  { href: "/eventos", label: "Eventos", icon: Globe },
  { href: "/ajustes", label: "Ajustes", icon: SlidersHorizontal },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type Identity = {
  name: string;
  subtitle: string | null;
  avatarUrl: string | null;
};

function Wordmark() {
  return (
    <Link href="/home" className="text-lg font-semibold tracking-tight">
      constela<span className="text-sol">✦</span>
    </Link>
  );
}

function AvatarSol({
  identity,
  size,
}: {
  identity: Identity;
  size: number;
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <AuraSol size={size} />
      {identity.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={identity.avatarUrl}
          alt=""
          className="relative z-1 h-full w-full rounded-full border border-sol/50 object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="relative z-1 flex h-full w-full items-center justify-center rounded-full border border-sol/50 bg-card text-sm font-semibold text-sol">
          {identity.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

/**
 * Navegación del observatorio en dos formas: sidebar de cristal flotando
 * sobre el cosmos en desktop (diseño 1b), y barra inferior al alcance del
 * pulgar en móvil (el evento se vive de pie y a una mano). La identidad
 * llega del layout servidor: tú eres el sol, y el sol vive abajo.
 */
export function AppNav({
  identity,
  activeEvent,
}: {
  identity: Identity | null;
  activeEvent: { name: string; slug: string } | null;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: sidebar de cristal (1b) */}
      <aside className="glass fixed top-5 bottom-5 left-5 z-40 hidden w-56 flex-col rounded-4xl px-4 py-5 lg:flex">
        <div className="px-2">
          <Wordmark />
        </div>

        {/* Dónde estás parado: tu galaxia activa, visible en toda pantalla */}
        {activeEvent && (
          <Link
            href="/eventos"
            className="mt-5 flex items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[0.03] px-2.5 py-2 transition-colors hover:border-celeste/30"
          >
            <Galaxia
              seed={activeEvent.slug.charCodeAt(0)}
              size={34}
              active
            />
            <span className="flex min-w-0 flex-col">
              <span className="font-mono text-[9px] tracking-[0.16em] text-faint uppercase">
                estás en
              </span>
              <span className="truncate text-[12.5px] font-medium">
                {activeEvent.name}
              </span>
            </span>
          </Link>
        )}

        <nav aria-label="Secciones" className="mt-5 flex flex-col gap-1">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                  active
                    ? "border-cosmic/40 bg-cosmic/15 text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <Icon
                  className="size-[1.15rem]"
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {identity && (
          <Link
            href="/perfil"
            className="mt-auto flex items-center gap-3 rounded-full border border-sol/20 bg-sol/5 p-2 transition-colors hover:bg-sol/10"
          >
            <AvatarSol identity={identity} size={38} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[13px] font-medium">
                {identity.name}
              </span>
              <span className="mt-0.5 truncate font-mono text-[10px] tracking-[0.14em] text-sol uppercase">
                {identity.subtitle ?? "completa tu perfil"}
              </span>
            </span>
          </Link>
        )}
      </aside>

      {/* Móvil y tablet: wordmark arriba, tabs abajo */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 lg:hidden">
        <span className="glass rounded-full px-4 py-2">
          <Wordmark />
        </span>
      </header>

      <nav
        aria-label="Secciones"
        className="glass fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 rounded-full lg:hidden"
      >
        <ul className="grid grid-cols-4">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] transition-colors",
                    active ? "text-celeste" : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn("size-5", active && "drop-shadow-glow")}
                    strokeWidth={active ? 2.2 : 1.8}
                    aria-hidden
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
