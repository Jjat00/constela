/**
 * Los dos idiomas del sitio público.
 *
 * POR QUÉ EXISTE: hasta 2026-08-04 Constela hablaba un solo idioma. Las tres
 * páginas que un buscador puede ver enteras —portada, categoría y guía—
 * estaban escritas en español y solo competían por búsquedas en español, que
 * es una fracción de las búsquedas de esta categoría: «event networking app»
 * y «how to network at a conference» se escriben muchísimo más que sus
 * equivalentes en castellano, y no había una sola línea del sitio que
 * respondiera a ellas.
 *
 * LA FORMA ELEGIDA, y por qué no otra:
 *
 * 1. **El español se queda en la raíz** (`/`, `/app-de-networking-para-eventos`,
 *    `/networking-en-eventos`) y el inglés vive bajo `/en`. Mover el español a
 *    `/es` habría cambiado el canónico de la portada —la URL que ya está
 *    indexada, la que llevan los QR y la que la gente pega en los chats— a
 *    cambio de simetría. La simetría no vale una redirección permanente en la
 *    puerta de entrada del producto.
 *
 * 2. **Cada idioma tiene su propia URL.** Servir dos idiomas en la misma
 *    dirección según la cabecera del navegador es la forma clásica de que
 *    Google indexe solo uno de los dos: rastrea desde Estados Unidos y guarda
 *    lo que le sirvan. Con dos URL y `hreflang` recíproco (ver `seo.ts`) las
 *    dos versiones existen, se declaran hermanas y ninguna canibaliza a la
 *    otra.
 *
 * 3. **Los slugs se traducen.** `/en/event-networking-app` y no
 *    `/en/app-de-networking-para-eventos`: la URL es uno de los pocos sitios
 *    donde la palabra buscada todavía pesa, y una ruta en español dentro del
 *    árbol inglés no la lee nadie.
 *
 * La adaptación automática al idioma del navegador vive en `src/proxy.ts` y
 * usa las piezas de este archivo.
 */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * El idioma de la casa. Es también el que se sirve cuando no hay forma de
 * saber qué prefiere quien llama — el caso de casi todos los rastreadores.
 */
export const LOCALE_BASE: Locale = "es";

export const esLocale = (v: string): v is Locale =>
  (LOCALES as readonly string[]).includes(v);

/** Las tres páginas públicas. Todas existen en los dos idiomas, sin huecos. */
export const PAGINAS = ["portada", "categoria", "guia"] as const;
export type Pagina = (typeof PAGINAS)[number];

/**
 * El mapa de rutas gemelas: la fuente única de qué URL es qué en cada idioma.
 * De aquí salen el `hreflang`, el sitemap, el selector de idioma de la
 * cabecera y las redirecciones del proxy — si estuvieran escritas cuatro
 * veces, tarde o temprano dirían cuatro cosas distintas.
 */
export const RUTAS: Record<Locale, Record<Pagina, string>> = {
  es: {
    portada: "/",
    categoria: "/app-de-networking-para-eventos",
    guia: "/networking-en-eventos",
  },
  en: {
    portada: "/en",
    categoria: "/en/event-networking-app",
    guia: "/en/networking-at-events",
  },
};

/** Índice inverso: de una ruta pública a qué página y en qué idioma es. */
const POR_RUTA = new Map<string, { locale: Locale; pagina: Pagina }>(
  LOCALES.flatMap((locale) =>
    PAGINAS.map(
      (pagina) =>
        [RUTAS[locale][pagina], { locale, pagina }] as [
          string,
          { locale: Locale; pagina: Pagina },
        ],
    ),
  ),
);

/** Qué página pública es esta ruta, si es alguna. */
export function ubicar(path: string) {
  const limpia =
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return POR_RUTA.get(limpia);
}

/** La misma página en el otro idioma. `null` si la ruta no es pública. */
export function gemela(path: string, destino: Locale): string | null {
  const donde = ubicar(path);
  return donde ? RUTAS[destino][donde.pagina] : null;
}

/**
 * El idioma que pide el navegador.
 *
 * DOS DECISIONES DE COMPORTAMIENTO:
 *
 * - **Sin cabecera, español.** `Accept-Language` es opcional y casi ningún
 *   rastreador la manda. Que su ausencia signifique «español» es lo que
 *   garantiza que Googlebot vea la portada española en `/` y la indexe ahí,
 *   en vez de acabar rebotado al árbol inglés.
 *
 * - **Manda la primera de las dos que aparezca en la lista.** Un navegador que
 *   pide `fr, es` recibe español: lo pidió, aunque en segundo lugar. Uno que
 *   pide `de, en` recibe inglés. Y quien no menciona ninguna de las dos
 *   —japonés, árabe— recibe inglés, que es lo que lee el resto del mundo
 *   antes que castellano.
 */
export function localeDeAcceptLanguage(cabecera: string | null): Locale {
  if (!cabecera) return LOCALE_BASE;

  const preferencias = cabecera
    .split(",")
    .map((trozo) => {
      const [etiqueta, ...parametros] = trozo.split(";");
      const q = parametros
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      const peso = q === undefined ? 1 : Number.parseFloat(q);
      return {
        idioma: etiqueta.trim().toLowerCase().split("-")[0],
        peso: Number.isFinite(peso) ? peso : 0,
      };
    })
    .filter((p) => p.idioma !== "" && p.peso > 0)
    .sort((a, b) => b.peso - a.peso);

  for (const { idioma } of preferencias) {
    // `*` es «me da igual»: se le da la casa, no el inglés.
    if (idioma === "*" || idioma === "es") return "es";
    if (idioma === "en") return "en";
  }

  // Pidió idiomas, pero ninguno de los dos que hablamos.
  return preferencias.length > 0 ? "en" : LOCALE_BASE;
}

/**
 * La cookie donde queda escrita la elección explícita de quien navega.
 *
 * Existe para que el selector de idioma funcione: sin ella, alguien con el
 * navegador en inglés que pulsa «ES» sería devuelto a `/en` por la misma
 * detección que lo trajo, y el botón parecería roto.
 */
export const COOKIE_IDIOMA = "constela_idioma";

/** Un año: la preferencia de idioma de una persona no cambia cada semana. */
export const COOKIE_IDIOMA_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * El parámetro con el que el selector fija esa cookie sin necesitar
 * JavaScript. El proxy lo consume y redirige a la URL limpia, así que nunca
 * llega a existir una dirección con `?lang=` indexable.
 */
export const PARAM_IDIOMA = "lang";

/**
 * ¿Quien llama es un rastreador?
 *
 * Se usa para NO redirigirlo por idioma. No es una versión distinta del sitio
 * —el HTML que recibe en `/` es exactamente el que recibe una persona con el
 * navegador en español— sino la garantía de que las dos versiones se pueden
 * rastrear por su propia URL. Un buscador que solo pudiera llegar a `/en`
 * nunca indexaría la portada en español, y al revés.
 */
const RASTREADORES =
  /bot|crawler|spider|slurp|googlebot|bingbot|duckduckbot|yandex|baiduspider|applebot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|gptbot|oai-searchbot|chatgpt-user|claudebot|claude-user|anthropic-ai|perplexity|cohere-ai|ccbot|bytespider|amazonbot|meta-externalagent/i;

export const esRastreador = (userAgent: string | null) =>
  userAgent !== null && RASTREADORES.test(userAgent);
