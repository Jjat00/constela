import Link from "next/link";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

/*
 * CONTRATO DE DIRECCIÓN — pie de sitio
 *
 * THESIS: el borde del universo, no un mapa del sitio. Una firma centrada
 * bajo una línea de horizonte: la marca, su tesis y lo legal, en ese orden
 * de importancia. Rechaza el pie de cuatro columnas de enlaces del SaaS —
 * Constela tiene cinco páginas y ninguna necesita un directorio.
 * OWN-WORLD: hairline que se apaga en los extremos (el horizonte del
 * planeta, en 1px), el lockup del logo como único objeto con peso, mono de
 * observatorio en `tracking-widest` —el token que DESIGN reserva justo para
 * la tesis del pie— y celeste solo al pasar por lo legal.
 * STORY: quien llegó hasta abajo ya decidió; el pie firma, no vende. Quien
 * busca lo legal lo encuentra en el centro, a un pulgar.
 */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-auto w-full", className)}>
      {/* La línea de horizonte: no corta la página, se apaga en los bordes */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />

      <div className="flex flex-col items-center gap-9 px-7 pt-14 pb-[calc(2.5rem+env(safe-area-inset-bottom))] text-center lg:gap-11 lg:pt-20 lg:pb-16">
        {/* La firma: la marca y su tesis, juntas y apretadas */}
        <div className="flex flex-col items-center gap-4.5">
          <Link
            href="/"
            aria-label="Constela — volver al inicio"
            className="transition-opacity hover:opacity-75"
          >
            <Logo className="h-8 lg:h-9" />
          </Link>
          <p className="max-w-88 font-mono text-[10px] tracking-widest text-balance text-faint lg:max-w-none lg:text-[11px]">
            EL NETWORKING QUE POR FIN SE VE
          </p>
        </div>

        {/* Lo legal, y debajo la propiedad */}
        <div className="flex flex-col items-center gap-2.5">
          <nav
            aria-label="Enlaces legales"
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground"
          >
            <Link
              href="/privacidad"
              className="inline-flex min-h-11 items-center px-2.5 transition-colors hover:text-celeste"
            >
              Privacidad
            </Link>
            <span
              aria-hidden
              className="size-[3px] shrink-0 rounded-full bg-white/25"
            />
            <Link
              href="/terminos"
              className="inline-flex min-h-11 items-center px-2.5 transition-colors hover:text-celeste"
            >
              Términos
            </Link>
          </nav>
          {/* El año es fijo a propósito: no hay nada que actualizar cada enero
              en un texto legal que sí lleva su propia fecha de vigencia. Y el
              nombre va con mayúscula aunque el wordmark sea minúsculo: aquí es
              texto corrido, y es el nombre que Google contrasta con el de la
              pantalla de consentimiento. */}
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground">
            © 2026 Constela
          </p>
        </div>
      </div>
    </footer>
  );
}
