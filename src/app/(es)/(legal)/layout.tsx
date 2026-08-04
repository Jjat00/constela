import Link from "next/link";
import { CosmicSky } from "@/components/cosmos";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";

/*
 * CONTRATO DE DIRECCIÓN — páginas legales
 *
 * THESIS: lo legal también es Constela. Mismo cielo, misma voz — pero el
 * documento manda: medida corta, cristal bajo el texto y cero adorno.
 * OWN-WORLD: cielo fijo detrás del scroll (las estrellas no se estiran con la
 * página); el texto flota en una hoja de cristal, nunca directo sobre el vacío.
 * STORY: llegas desde el pie o desde la pantalla de Google, lees, y el
 * wordmark te devuelve a la puerta.
 */
export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grain relative flex flex-1 flex-col">
      <CosmicSky className="fixed" />

      <header className="relative z-10 flex items-center justify-between px-5 pt-[calc(1.75rem+env(safe-area-inset-top))] sm:px-8 lg:px-14 lg:pt-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo className="h-8 lg:h-9" priority />
        </Link>
        <Link
          href="/login"
          className="chip-star flex h-9.5 items-center px-5 text-[13px] font-medium"
        >
          Entrar
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:px-8 lg:py-16">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
