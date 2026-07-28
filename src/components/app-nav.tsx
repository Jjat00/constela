"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LogOut,
  Orbit,
  QrCode,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/home", label: "Universo", icon: Orbit },
  { href: "/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/qr", label: "Mi QR", icon: QrCode },
  { href: "/perfil", label: "Perfil", icon: UserRound },
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

function SignOut({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className={cn(
          "flex items-center gap-2.5 rounded-xl text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
          iconOnly ? "p-3.5" : "w-full px-3 py-2.5",
        )}
      >
        <LogOut className="size-4" aria-hidden />
        {iconOnly ? <span className="sr-only">Salir</span> : "Salir"}
      </button>
    </form>
  );
}

/**
 * Navegación del command center en dos formas: sidebar de cristal flotando
 * sobre el cosmos en desktop, y barra inferior al alcance del pulgar en
 * móvil (el evento se vive de pie y a una mano). La identidad llega del
 * layout servidor: tú eres el sol, y el sol vive abajo a la izquierda.
 */
export function AppNav({ identity }: { identity: Identity | null }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: sidebar de cristal */}
      <aside className="glass fixed top-4 bottom-4 left-4 z-40 hidden w-60 flex-col rounded-3xl p-4 lg:flex">
        <div className="px-2 pt-1 pb-6">
          <Wordmark />
        </div>

        <nav aria-label="Secciones" className="flex flex-col gap-1">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary/20 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("size-[1.15rem]", active && "text-lavanda")}
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          {identity && (
            <Link
              href="/perfil"
              className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3 transition-colors hover:bg-white/[0.06]"
            >
              {identity.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={identity.avatarUrl}
                  alt=""
                  className="sol-glow size-9 shrink-0 rounded-full border border-sol/50"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="sol-glow flex size-9 shrink-0 items-center justify-center rounded-full border border-sol/50 bg-card text-sm font-semibold text-sol">
                  {identity.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">
                  {identity.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {identity.subtitle ?? "completa tu perfil"}
                </span>
              </span>
            </Link>
          )}
          <SignOut />
        </div>
      </aside>

      {/* Móvil y tablet: wordmark arriba, tabs abajo */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 lg:hidden">
        <span className="glass rounded-full px-4 py-2">
          <Wordmark />
        </span>
        <span className="glass rounded-full">
          <SignOut iconOnly />
        </span>
      </header>

      <nav
        aria-label="Secciones"
        className="glass fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 rounded-2xl lg:hidden"
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
                    active ? "text-lavanda" : "text-muted-foreground",
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
