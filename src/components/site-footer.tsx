import Link from "next/link";
import { cn } from "@/lib/utils";

/*
 * CONTRATO DE DIRECCIÓN — pie de sitio
 *
 * THESIS: el borde del universo, no un mapa del sitio. La landing cabe en un
 * viewport por contrato (v5 «Observatorio»), así que el pie es una sola línea
 * de anotación de observatorio: la tesis a un lado, lo legal al otro.
 * OWN-WORLD: mono Geist, tinta `faint`, separadores `·` — la misma voz que
 * «[ PARA CUALQUIER EVENTO ]». Nada de cristal ni bordes: el pie no es un panel.
 * STORY: quien busca lo legal lo encuentra; quien vino a entrar ni lo nota.
 */
export function SiteFooter({
  tagline,
  className,
}: {
  /** Microcopy de observatorio a la izquierda (solo la landing lo usa). */
  tagline?: string;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        "relative z-10 flex flex-col items-center gap-2.5 px-7 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center lg:flex-row lg:justify-between lg:gap-6 lg:px-14 lg:pb-10 lg:text-left",
        className,
      )}
    >
      {tagline ? (
        <p className="font-mono text-[10px] tracking-[0.2em] whitespace-nowrap text-faint lg:text-[11px]">
          {tagline}
        </p>
      ) : (
        // Mantiene el reparto a los extremos en ≥lg cuando no hay tesis
        <span aria-hidden className="hidden lg:block" />
      )}

      <nav
        aria-label="Enlaces legales"
        className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.14em] text-faint lg:text-[11px]"
      >
        {/* El año es fijo a propósito: no hay nada que actualizar cada enero
            en un texto legal que sí lleva su propia fecha de vigencia. */}
        <span>© 2026 constela</span>
        <span aria-hidden>·</span>
        <Link
          href="/privacidad"
          className="transition-colors hover:text-celeste"
        >
          Privacidad
        </Link>
        <span aria-hidden>·</span>
        <Link href="/terminos" className="transition-colors hover:text-celeste">
          Términos
        </Link>
      </nav>
    </footer>
  );
}
