import Link from "next/link";
import { cn } from "@/lib/utils";

/*
 * CONTRATO DE DIRECCIÓN — pie de sitio
 *
 * THESIS: el borde del universo, no un mapa del sitio. La landing cabe en un
 * viewport por contrato (v5 «Observatorio»), así que el pie es una sola línea
 * de anotación de observatorio: la tesis a un lado, lo legal al otro.
 * OWN-WORLD: mono Geist Mono, tinta `faint`, separadores `·` — la misma voz que
 * «[ PARA CUALQUIER EVENTO ]». Nada de cristal ni bordes: el pie no es un panel.
 * STORY: quien busca lo legal lo encuentra; quien vino a entrar ni lo nota.
 */
export function SiteFooter({
  tagline,
  notice,
  className,
}: {
  /** Microcopy de observatorio a la izquierda (solo la landing lo usa). */
  tagline?: string;
  /**
   * Aviso de datos sobre la línea de anotación (solo la landing lo usa): qué
   * pide la app al entrar con Google y para qué. Vive aquí y no en el hero por
   * decisión del usuario, pero tiene que estar en la página principal — es
   * requisito propio de la verificación de marca de Google, distinto de
   * describir la funcionalidad y de enlazar la política de privacidad.
   */
  notice?: string;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        "relative z-10 flex flex-col items-center gap-3 px-7 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center lg:items-stretch lg:gap-3.5 lg:px-14 lg:pb-10 lg:text-left",
        className,
      )}
    >
      {/* En prosa y no en versalitas como el resto del pie: es una frase larga
          que se lee, no una anotación que se ojea. El mono la mantiene en la
          voz del observatorio sin gritarla. */}
      {notice ? (
        <p className="max-w-88 font-mono text-[10.5px] leading-relaxed text-balance text-faint lg:max-w-[46rem] lg:text-[11px]">
          {notice}
        </p>
      ) : null}

      <div className="flex flex-col items-center gap-2.5 lg:flex-row lg:justify-between lg:gap-6">
        {tagline ? (
          // Sin nowrap: el eslogan completo parte en dos líneas en móvil antes
          // que salirse de la pantalla o encoger hasta lo ilegible.
          <p className="max-w-88 font-mono text-[10px] tracking-wider text-balance text-faint lg:max-w-none lg:text-[10.5px]">
            {tagline}
          </p>
        ) : (
          // Mantiene el reparto a los extremos en ≥lg cuando no hay tesis
          <span aria-hidden className="hidden lg:block" />
        )}

        <nav
          aria-label="Enlaces legales"
          className="flex items-center gap-2.5 font-mono text-[10px] tracking-wide text-faint lg:text-[11px]"
        >
          {/* El año es fijo a propósito: no hay nada que actualizar cada enero
              en un texto legal que sí lleva su propia fecha de vigencia. Y el
              nombre va con mayúscula aunque el wordmark sea minúsculo: aquí es
              texto corrido, y es el nombre que Google contrasta con el de la
              pantalla de consentimiento. Sube a `muted-foreground` mientras lo
              legal se queda en `faint`: el nombre de la marca no puede ser lo
              más tenue de la página. */}
          <span className="text-muted-foreground">© 2026 Constela</span>
          <span aria-hidden>·</span>
          <Link
            href="/privacidad"
            className="transition-colors hover:text-celeste"
          >
            Privacidad
          </Link>
          <span aria-hidden>·</span>
          <Link
            href="/terminos"
            className="transition-colors hover:text-celeste"
          >
            Términos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
