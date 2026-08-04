import Link from "next/link";
import { GoogleButton } from "@/app/(es)/login/google-button";
import { Logo } from "@/components/logo";
import { SelectorIdioma } from "@/components/selector-idioma";
import { copy } from "@/lib/copy";
import { type Locale, type Pagina, RUTAS } from "@/lib/i18n";

/*
 * El chrome compartido de las páginas de documento, en los dos idiomas.
 *
 * Es el mismo de la portada —cabecera con el lockup a la izquierda, el idioma
 * y la puerta a la derecha, hairline a sangre debajo, pie con lo legal— y vive
 * aquí para que las cuatro páginas de documento no puedan diverger de ella ni
 * entre sí.
 *
 * POR QUÉ AQUÍ NO SE MIRA LA SESIÓN, y en la portada sí: estas páginas existen
 * para recibir tráfico de buscadores, y ese tráfico es anónimo por definición.
 * Consultar Supabase para decidir el texto de un enlace las convertía en rutas
 * dinámicas —render en cada visita, TTFB de servidor— a cambio de nada para el
 * 100 % de sus visitantes reales. Sin esa consulta se prerrenderizan en el
 * build y se sirven desde el borde, que es exactamente lo que mide Core Web
 * Vitals.
 *
 * El caso de quien SÍ tiene sesión no se rompe: `/login` ya redirige solo a
 * `/home` cuando encuentra usuario (ver `src/app/(es)/login/page.tsx`), así que
 * el enlace de la cabecera acaba donde tiene que acabar sin preguntarle nada a
 * nadie.
 */

/** La puerta: el mismo botón de Google de `/login` y de la portada. */
export function DocPuerta({ locale }: { locale: Locale }) {
  return (
    <div className="obs-puerta">
      <GoogleButton next="/home" textos={copy(locale).chrome.google} />
    </div>
  );
}

export function DocHeader({
  locale,
  pagina,
}: {
  locale: Locale;
  pagina: Pagina;
}) {
  const c = copy(locale).chrome;
  return (
    <>
      <header className="obs-carril">
        <div className="obs-top">
          {/* En una página que no es la portada el logo es también el camino
              de vuelta, así que aquí sí es un enlace — y vuelve a la portada
              del idioma en el que se está leyendo, no a la de la casa. */}
          <Link
            href={RUTAS[locale].portada}
            aria-label={c.volverPortada}
            className="inline-flex transition-opacity hover:opacity-75"
          >
            <Logo className="h-8 lg:h-9" priority />
          </Link>
          <div className="obs-top-fin">
            <SelectorIdioma locale={locale} pagina={pagina} />
            <Link href="/login" className="obs-entrar">
              {c.entrar}
            </Link>
          </div>
        </div>
      </header>
      <div className="obs-regla" />
    </>
  );
}

/**
 * Las migas. Existen por el lector, que necesita saber dónde está dentro de un
 * sitio pequeño, y por el buscador, que las enseña en el resultado en vez de
 * la URL cruda — para eso el `BreadcrumbList` de cada página las declara
 * además en JSON-LD.
 */
export function DocMigas({
  locale,
  actual,
}: {
  locale: Locale;
  actual: string;
}) {
  const c = copy(locale).chrome;
  return (
    <nav aria-label={c.migasAria} className="obs-carril">
      <ol className="obs-migas">
        <li>
          <Link href={RUTAS[locale].portada}>{c.migasInicio}</Link>
        </li>
        <li>
          <span aria-current="page">{actual}</span>
        </li>
      </ol>
    </nav>
  );
}

/**
 * El pie.
 *
 * Las dos legales apuntan siempre al español: no existen en inglés, y no por
 * descuido — publicar una traducción de un documento jurídico sin declarar
 * cuál de las dos versiones prevalece crea un problema legal a cambio de nada.
 * El enlace lleva `hrefLang="es"` para avisar de que lo que hay al otro lado
 * cambia de idioma.
 */
export function DocPie({ locale }: { locale: Locale }) {
  const c = copy(locale).chrome;
  return (
    <footer className="obs-pie">
      <span className="obs-mono">{c.copyright}</span>
      <nav aria-label={c.pieAria}>
        <Link href={RUTAS[locale].portada}>{c.portada}</Link>
        <Link href="/privacidad" hrefLang="es">
          {c.privacidad}
        </Link>
        <Link href="/terminos" hrefLang="es">
          {c.terminos}
        </Link>
      </nav>
    </footer>
  );
}
