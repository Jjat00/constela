import Link from "next/link";
import { copy } from "@/lib/copy";
import {
  gemela,
  type Locale,
  LOCALES,
  type Pagina,
  PARAM_IDIOMA,
  RUTAS,
} from "@/lib/i18n";

/**
 * El cambio manual de idioma.
 *
 * NO ES DECORACIÓN NI CORTESÍA: es lo que hace legítima la adaptación
 * automática del proxy. Un sitio que decide el idioma por ti y no te deja
 * cambiarlo está roto para todo el que viaja, para el que tiene el sistema
 * operativo en otro idioma que el suyo y para el que simplemente prefiere
 * leer el original. Google lo pide explícitamente cuando hay redirección por
 * `Accept-Language`, y con razón.
 *
 * POR QUÉ LLEVA `?lang=` EN EL ENLACE: sin ese parámetro, alguien con el
 * navegador en inglés que pulsa «ES» iría a `/` y la misma detección que lo
 * trajo lo devolvería a `/en` — el botón parecería roto y no habría forma de
 * leer el español. El proxy ve el parámetro, escribe la cookie de preferencia
 * y redirige a la URL limpia, así que la dirección con `?lang=` no llega a
 * existir para un buscador ni para el historial.
 *
 * `hrefLang` y `lang` en el mismo enlace no se pisan: el primero declara el
 * idioma del destino, el segundo dice en qué idioma está escrita la palabra
 * «English», para que un lector de pantalla no la pronuncie en castellano.
 */
export function SelectorIdioma({
  locale,
  pagina,
}: {
  locale: Locale;
  pagina: Pagina;
}) {
  const otro = LOCALES.find((l) => l !== locale) ?? locale;
  const c = copy(locale).chrome;
  const destino = gemela(RUTAS[locale][pagina], otro) ?? RUTAS[otro].portada;

  return (
    <Link
      href={`${destino}?${PARAM_IDIOMA}=${otro}`}
      hrefLang={otro}
      lang={otro}
      className="obs-idioma"
      aria-label={`${c.idioma.aria}: ${c.idioma.otroNombre}`}
    >
      {c.idioma.otro}
    </Link>
  );
}
