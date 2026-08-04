import Link from "next/link";
import { GoogleButton } from "@/app/login/google-button";
import { Logo } from "@/components/logo";

/*
 * El chrome compartido de las páginas de documento
 * (`/app-de-networking-para-eventos`, `/networking-en-eventos`).
 *
 * Es el mismo de la portada —cabecera con el lockup a la izquierda y la
 * puerta a la derecha, hairline a sangre debajo, pie con lo legal— y vive
 * aquí para que las dos páginas no puedan diverger de ella ni entre sí.
 *
 * POR QUÉ AQUÍ NO SE MIRA LA SESIÓN, y en la portada sí: estas dos páginas
 * existen para recibir tráfico de buscadores, y ese tráfico es anónimo por
 * definición. Consultar Supabase para decidir el texto de un enlace las
 * convertía en rutas dinámicas —render en cada visita, TTFB de servidor— a
 * cambio de nada para el 100 % de sus visitantes reales. Sin esa consulta se
 * prerrenderizan en el build y se sirven desde el borde, que es exactamente lo
 * que mide Core Web Vitals.
 *
 * El caso de quien SÍ tiene sesión no se rompe: `/login` ya redirige solo a
 * `/home` cuando encuentra usuario (ver `src/app/login/page.tsx`), así que el
 * enlace de la cabecera acaba donde tiene que acabar sin preguntarle nada a
 * nadie.
 */

/** La puerta: el mismo botón de Google de `/login` y de la portada. */
export function DocPuerta() {
  return (
    <div className="obs-puerta">
      <GoogleButton next="/home" />
    </div>
  );
}

export function DocHeader() {
  return (
    <>
      <header className="obs-carril">
        <div className="obs-top">
          {/* En una página que no es la portada el logo es también el camino
              de vuelta, así que aquí sí es un enlace. */}
          <Link
            href="/"
            aria-label="Constela — ir a la portada"
            className="inline-flex transition-opacity hover:opacity-75"
          >
            <Logo className="h-8 lg:h-9" priority />
          </Link>
          <Link href="/login" className="obs-entrar">
            Entrar →
          </Link>
        </div>
      </header>
      <div className="obs-regla" />
    </>
  );
}

/**
 * Las migas. Existen por el lector, que necesita saber dónde está dentro de un
 * sitio de cinco páginas, y por el buscador, que las enseña en el resultado en
 * vez de la URL cruda — para eso el `BreadcrumbList` de cada página las
 * declara además en JSON-LD.
 */
export function DocMigas({ actual }: { actual: string }) {
  return (
    <nav aria-label="Migas de pan" className="obs-carril">
      <ol className="obs-migas">
        <li>
          <Link href="/">Constela</Link>
        </li>
        <li>
          <span aria-current="page">{actual}</span>
        </li>
      </ol>
    </nav>
  );
}

export function DocPie() {
  return (
    <footer className="obs-pie">
      <span className="obs-mono">© 2026 Constela</span>
      <nav aria-label="Enlaces del sitio">
        <Link href="/">Portada</Link>
        <Link href="/privacidad">Privacidad</Link>
        <Link href="/terminos">Términos</Link>
      </nav>
    </footer>
  );
}
