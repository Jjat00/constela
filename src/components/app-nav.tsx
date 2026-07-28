"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, QrCode, Sparkles, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/home", label: "constelación", icon: Sparkles },
  { href: "/eventos", label: "eventos", icon: CalendarDays },
  { href: "/qr", label: "mi QR", icon: QrCode },
  { href: "/perfil", label: "perfil", icon: UserRound },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Una sola navegación en dos formas: barra inferior al alcance del pulgar en
 * móvil (el teléfono es donde se usa Constela, de pie y a una mano) y menú en
 * el header a partir de `md`, donde la barra inferior sobra.
 */
export function AppNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/85 px-4 backdrop-blur-md sm:px-6 md:h-16 lg:px-10">
        <Link
          href="/home"
          className="font-display text-lg font-semibold tracking-tight"
        >
          constela<span className="text-primary">✦</span>
        </Link>

        <nav aria-label="Secciones" className="hidden md:flex md:items-center">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-xs transition-colors lg:px-4",
                  active
                    ? "bg-card text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-full px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            salir
          </button>
        </form>
      </header>

      <nav
        aria-label="Secciones"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
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
                    "flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 font-mono text-[10px] transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn("size-5", active && "drop-shadow-glow")}
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
