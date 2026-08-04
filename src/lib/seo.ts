/**
 * El banco de hechos del SEO, en los dos idiomas.
 *
 * Mismo contrato que `copy/`: todo lo que Constela le dice a un buscador —o a
 * un modelo de lenguaje— sale de aquí, y todo lo de aquí sale de PRODUCT.md,
 * CONTEXT.md y los ADR. La regla dura sigue siendo la misma: **no existen
 * testimonios, métricas de uso, prensa, casos ni clientes — no fabricar
 * ninguno** (PRODUCT.md § Evidence on Hand). Por eso el `SoftwareApplication`
 * de más abajo no lleva `aggregateRating` ni `interactionStatistic`: sería la
 * única forma de mentirle a Google desde un archivo de datos.
 *
 * POR QUÉ EXISTE: hasta 2026-08-04 la app entera declaraba dos etiquetas
 * (`title` y `description`) y nada más. Sin `metadataBase` los canónicos y las
 * imágenes sociales salían relativos —es decir, rotos—, sin `robots.txt` los
 * perfiles de personas reales quedaban expuestos a los rastreadores, y el
 * título no contenía una sola palabra que alguien fuera a escribir en un
 * buscador: a Constela solo se llegaba sabiendo que se llama Constela.
 *
 * POR QUÉ ES BILINGÜE (mismo día, más tarde): resuelto lo anterior, el sitio
 * seguía compitiendo solo en español. `hreflang` es la pieza que convierte dos
 * páginas parecidas en dos versiones declaradas de la misma —sin él, la
 * portada inglesa y la española compiten entre ellas por las mismas búsquedas
 * y Google se queda con una.
 */

import type { Metadata } from "next";
import { type Locale, LOCALES, type Pagina, RUTAS } from "@/lib/i18n";

/**
 * El dominio canónico, fijo y no derivado del entorno.
 *
 * `NEXT_PUBLIC_SITE_URL` sirve para construir QRs —ahí sí importa el origen
 * real donde corre la app, incluido `localhost`— pero un canónico apuntando a
 * un preview de Vercel le enseña a Google una copia del sitio. Aquí el
 * canónico siempre es producción, y los despliegues que no son producción se
 * cierran con `noindex` desde `app/robots.ts`.
 */
export const SITIO_URL = "https://constela.com.co";

/** URL absoluta de una ruta interna. Los metadatos sociales no aceptan otra. */
export const abs = (path: string) => new URL(path, SITIO_URL).toString();

/**
 * La tarjeta social de un idioma. La dibuja `src/app/og/[locale]/route.tsx`,
 * que existe precisamente para que esta URL se pueda escribir aquí: la
 * convención `opengraph-image.tsx` de Next le pone un hash de contenido a la
 * dirección en cuanto el archivo no está en la raíz, y una dirección que nadie
 * puede predecir no sirve cuando hay que declararla a mano.
 */
export function imagenSocial(locale: Locale) {
  return {
    url: `/og/${locale}`,
    width: 1200,
    height: 630,
    alt: `${NOMBRE} — ${SITIO[locale].tagline}`,
  };
}

/** El nombre no se traduce, y es el único dato que no depende del idioma. */
export const NOMBRE = "Constela";

/**
 * La ficha de identidad de la marca, una por idioma.
 *
 * `titulo` es la única línea del proyecto donde el tagline convive con la
 * categoría: «app de networking para eventos» es lo que se busca, «que por fin
 * se ve» es lo que somos. Cabe en los ~60 caracteres que Google no recorta, y
 * su versión inglesa se construye con la frase por la que se busca en inglés
 * —«event networking app»—, no con la traducción de la española.
 */
export const SITIO: Record<
  Locale,
  {
    titulo: string;
    descripcion: string;
    definicion: string;
    tagline: string;
    /** El valor del atributo `lang` y del `inLanguage` de JSON-LD. */
    idioma: string;
    /** El de `og:locale`, que sí quiere región. */
    ogLocale: string;
    /** Cómo se llama este idioma en su propio idioma. */
    nombreIdioma: string;
  }
> = {
  es: {
    titulo: "Constela — App de networking para eventos que por fin se ve",
    /** ~150 caracteres: la definición completa, sin adjetivos de más. */
    descripcion:
      "Constela es la app de networking para eventos presenciales: escaneas el QR de quien acabas de conocer y la red del evento se dibuja en vivo. Gratis.",
    /** La misma idea en una frase, para OG y para los modelos que la citen. */
    definicion:
      "Constela es una app web de networking para eventos presenciales en la que cada asistente es una estrella y cada encuentro cara a cara, una línea entre dos: se conecta escaneando el QR personal del otro y la red completa del evento se dibuja en vivo.",
    tagline: "El networking que por fin se ve",
    idioma: "es",
    /** Español de América; el arranque real es un evento tech en Bogotá. */
    ogLocale: "es_CO",
    nombreIdioma: "Español",
  },
  en: {
    titulo: "Constela — The event networking app you can actually see",
    descripcion:
      "Constela is the event networking app for in-person events: scan the QR code of someone you just met and the network of the room draws itself live. Free.",
    definicion:
      "Constela is a web-based event networking app for in-person events where every attendee is a star and every face-to-face encounter a line between two: you connect by scanning the other person's personal QR code, and the full network of the event draws itself live.",
    tagline: "Networking you can finally see",
    idioma: "en",
    ogLocale: "en_US",
    nombreIdioma: "English",
  },
};

/**
 * Los términos por los que queremos ser encontrados, en el idioma en que la
 * gente los escribe. No van en una meta `keywords` —Google la ignora desde
 * 2009— sino que son la lista de verificación de qué tiene que decir el copy
 * de verdad: si una de estas frases no aparece en un `h1`, `h2` o párrafo de
 * alguna página, no la estamos cubriendo.
 *
 * Las inglesas no son la traducción de las españolas: se buscan otras cosas.
 * Nadie escribe «app for networking at events» — escribe «event networking
 * app», y ese orden de palabras es el que gobierna el copy de `en.ts`.
 */
export const BUSQUEDAS: Record<Locale, readonly string[]> = {
  es: [
    "app de networking",
    "app de networking para eventos",
    "networking en eventos presenciales",
    "cómo hacer networking en un evento",
    "app para conectar en eventos",
    "tarjeta de presentación con QR",
    "QR para networking",
    "red de contactos de un evento",
    "alternativa a intercambiar LinkedIn en eventos",
  ],
  en: [
    "event networking app",
    "networking app for events",
    "conference networking app",
    "how to network at an event",
    "networking at events",
    "QR code business card",
    "digital business card for events",
    "meet people at a conference",
    "alternative to swapping LinkedIn at events",
  ],
};

/**
 * Las legales, que existen solo en español.
 *
 * NO es un olvido: son documentos jurídicos y publicar una traducción sin
 * decir cuál de las dos versiones prevalece crea un problema legal, no un
 * beneficio de SEO. Por eso tampoco declaran `hreflang`: no tienen gemela.
 */
export const RUTAS_LEGALES = ["/privacidad", "/terminos"] as const;

/**
 * Las rutas que NO se indexan, y por qué cada una.
 *
 * `/u/` es el caso serio: son fichas de personas reales que llegaron aquí
 * escaneando un QR, no perfiles públicos que alguien haya publicado a
 * sabiendas. Que Google las guarde sería exponerlas; que además compitan con
 * la portada por relevancia sería, encima, contraproducente.
 */
export const RUTAS_PRIVADAS = [
  "/home",
  "/perfil",
  "/qr",
  "/eventos",
  "/ajustes",
  "/tarjeta/",
  "/bienvenida",
  "/u/",
  "/e/",
  "/login",
  "/auth/",
  "/me",
] as const;

/**
 * El bloque `hreflang` de una página que existe en los dos idiomas.
 *
 * TRES REGLAS QUE GOOGLE EXIGE Y QUE AQUÍ SE CUMPLEN POR CONSTRUCCIÓN:
 * la declaración es recíproca (las dos versiones se nombran la una a la otra),
 * cada una se incluye a sí misma, y las URL son absolutas.
 *
 * `x-default` apunta al inglés. No es un desaire al idioma de la casa: es la
 * versión que se le sirve a quien no pide español —un lector en alemán o en
 * japonés lee inglés antes que castellano— y `hreflang` tiene que describir lo
 * que el sitio hace de verdad, que es justo lo que decide `src/proxy.ts`.
 */
export function alternativas(pagina: Pagina): NonNullable<
  Metadata["alternates"]
>["languages"] {
  return {
    es: abs(RUTAS.es[pagina]),
    en: abs(RUTAS.en[pagina]),
    "x-default": abs(RUTAS.en[pagina]),
  };
}

/**
 * Los metadatos que hereda un árbol entero, uno por idioma.
 *
 * `metadataBase` es el que faltaba y el que rompía el resto: sin él, Next
 * emite las imágenes sociales y los canónicos como rutas relativas, y una
 * `og:image` relativa no la resuelve ningún cliente —ni WhatsApp, ni LinkedIn,
 * ni el buscador—. Con Constela repartiéndose por link pegado en un chat, eso
 * significaba que cada vez que alguien la compartía llegaba una tarjeta gris
 * sin imagen ni descripción.
 *
 * `alternates.canonical` NO se declara aquí a propósito: Next lo heredaría en
 * cada ruta que no lo sobrescriba y acabaríamos diciéndole a Google que
 * /privacidad y / son la misma página. Cada página pública declara el suyo.
 */
export function metadataRaiz(locale: Locale): Metadata {
  const sitio = SITIO[locale];

  return {
    metadataBase: new URL(SITIO_URL),
    title: {
      default: sitio.titulo,
      template: `%s — ${NOMBRE}`,
    },
    description: sitio.descripcion,
    applicationName: NOMBRE,
    category: "Networking",
    keywords: [...BUSQUEDAS[locale]],
    authors: [{ name: NOMBRE, url: SITIO_URL }],
    creator: NOMBRE,
    publisher: NOMBRE,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        // Sin esto Google recorta el fragmento y muestra la imagen en
        // miniatura. Un producto que se explica con un mapa merece la vista
        // previa grande.
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: NOMBRE,
      locale: sitio.ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => SITIO[l].ogLocale,
      ),
      url: abs(RUTAS[locale].portada),
      title: `${NOMBRE} — ${sitio.tagline}`,
      description: sitio.descripcion,
      images: [imagenSocial(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${NOMBRE} — ${sitio.tagline}`,
      description: sitio.descripcion,
      images: [imagenSocial(locale)],
    },
    // La verificación de Search Console entra por entorno para que dar de alta
    // el dominio no exija un despliegue de código. A 2026-08-04 el dominio
    // está verificado por registro DNS, así que la variable no existe y esta
    // etiqueta no se emite: es la alternativa, no un requisito.
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    // iOS necesita saberlo por su cuenta: el manifest no le basta para tratar
    // la app como app cuando alguien la guarda en la pantalla de inicio.
    appleWebApp: {
      capable: true,
      title: NOMBRE,
      statusBarStyle: "black-translucent",
    },
    formatDetection: { telephone: false },
  };
}

/**
 * Los metadatos completos de una página pública.
 *
 * EXISTE POR UNA TRAMPA DE NEXT: los campos `openGraph` y `twitter` se
 * **reemplazan enteros**, no se fusionan campo a campo con los del layout
 * raíz. Declarar `twitter: { title, description }` en una página no le añade
 * un título a la tarjeta heredada: la sustituye, y con ella se van el
 * `card: "summary_large_image"` y la imagen — la tarjeta pasa de una lámina de
 * 1200×630 a un cuadradito. Lo mismo con `og:site_name` y `og:locale`.
 *
 * Por eso aquí se devuelve el objeto completo siempre. Es también la razón de
 * que `images` se declare a mano: se probó a omitirlas para que Next heredara
 * la imagen del segmento y el HTML generado salió **sin una sola etiqueta
 * `og:image`**. En cuanto una página define su propio `openGraph`, esa
 * herencia deja de ocurrir — y una página que declara `openGraph` sin imagen
 * no cae en la del layout: se queda sin ninguna.
 */
export function metaPagina(p: {
  locale: Locale;
  pagina: Pagina;
  titulo: string;
  descripcion: string;
  tipo?: "website" | "article";
}): Metadata {
  const sitio = SITIO[p.locale];
  const path = RUTAS[p.locale][p.pagina];
  const titulo = `${p.titulo} — ${NOMBRE}`;

  return {
    title: p.titulo,
    description: p.descripcion,
    alternates: { canonical: path, languages: alternativas(p.pagina) },
    openGraph: {
      type: p.tipo ?? "article",
      siteName: NOMBRE,
      locale: sitio.ogLocale,
      url: path,
      title: titulo,
      description: p.descripcion,
      images: [imagenSocial(p.locale)],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: p.descripcion,
      images: [imagenSocial(p.locale)],
    },
  };
}

/**
 * Los metadatos de una pantalla que no se indexa.
 *
 * `follow: true` y no `false`: que Google no archive el perfil de alguien no
 * significa que deba ignorar el enlace a la portada que esa página lleva
 * dentro. Es la diferencia entre «no guardes esto» y «esta rama del sitio no
 * existe», y solo lo primero es cierto.
 *
 * `robots.txt` ya cierra estas rutas, pero un `Disallow` únicamente impide
 * *rastrear*: una URL enlazada desde fuera puede acabar indexada sin haber
 * sido leída jamás. La etiqueta es la que de verdad la saca del índice.
 */
export const NO_INDEXAR = {
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
} satisfies Metadata;

// ─────────────────────────────────────────────────────────────────────────────
// Datos estructurados (JSON-LD)
//
// Es la parte del sitio escrita para máquinas: Google la usa para resultados
// enriquecidos y los motores de respuesta (ChatGPT, Perplexity, AI Overviews)
// la parsean mucho mejor que la prosa. Todo lo de aquí es reafirmación de algo
// que además está escrito en la página, nunca información exclusiva del
// script — decir en JSON-LD algo que el usuario no puede leer es spam
// estructurado, y Google lo penaliza como tal.
//
// Los `@id` NO llevan idioma: la organización, el sitio y la aplicación son
// una sola entidad descrita en dos lenguas, no dos entidades. Lo que cambia
// entre versiones es `inLanguage` y el texto; la identidad, no.
// ─────────────────────────────────────────────────────────────────────────────

/** El `@id` estable de la organización: el resto de nodos apunta aquí. */
const ID_ORG = `${SITIO_URL}/#organizacion`;
const ID_SITIO = `${SITIO_URL}/#sitio`;
const ID_APP = `${SITIO_URL}/#app`;

export function orgLd(locale: Locale) {
  return {
    "@type": "Organization",
    "@id": ID_ORG,
    name: NOMBRE,
    url: SITIO_URL,
    logo: abs("/icon.png"),
    description: SITIO[locale].definicion,
    // Sin `sameAs`: Constela no tiene perfiles sociales verificados y
    // declarar uno inexistente rompe la entidad en el Knowledge Graph.
  };
}

/** El sitio no lleva idioma: es uno solo, y habla los dos. */
export function sitioLd() {
  return {
    "@type": "WebSite",
    "@id": ID_SITIO,
    name: NOMBRE,
    url: SITIO_URL,
    inLanguage: LOCALES.map((l) => SITIO[l].idioma),
    publisher: { "@id": ID_ORG },
  };
}

/**
 * La app en sí. `price: "0"` no es marketing: Constela no cobra, no tiene
 * planes y no existe una pasarela de pago en el producto. Es el dato que un
 * agente comparando apps de networking necesita para no descartarnos.
 */
export function appLd(locale: Locale) {
  const es = locale === "es";
  return {
    "@type": "SoftwareApplication",
    "@id": ID_APP,
    name: NOMBRE,
    alternateName: es
      ? "Constela — app de networking para eventos"
      : "Constela — event networking app",
    applicationCategory: "SocialNetworkingApplication",
    applicationSubCategory: es
      ? "Networking de eventos presenciales"
      : "In-person event networking",
    operatingSystem: es
      ? "Web — cualquier navegador móvil o de escritorio"
      : "Web — any mobile or desktop browser",
    url: SITIO_URL,
    description: SITIO[locale].definicion,
    // La interfaz del producto todavía habla un solo idioma, y decir aquí que
    // habla dos sería exactamente la clase de dato que un agente repite sin
    // comprobar. El sitio es bilingüe; la aplicación, no.
    inLanguage: "es",
    isAccessibleForFree: true,
    browserRequirements: es
      ? "Requiere JavaScript. Se entra con una cuenta Google."
      : "Requires JavaScript. Sign-in is with a Google account.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "COP",
      availability: "https://schema.org/InStock",
    },
    publisher: { "@id": ID_ORG },
    featureList: es
      ? [
          "Conexión por escaneo del QR personal, sin solicitudes ni botón de agregar",
          "Mapa en vivo de la red completa del evento, visible para cualquier asistente",
          "Filtros por rol, interés e intención",
          "Cierres triádicos: se iluminan los grupos de tres que ya se conocen",
          "Tarjeta de presentación digital con los canales de contacto",
        ]
      : [
          "Connection by scanning a personal QR code — no requests, no add button",
          "Live map of the event's full network, visible to every attendee",
          "Filters by role, interest and intent",
          "Triadic closures: groups of three who already know each other light up",
          "Digital business card with your contact channels",
        ],
  };
}

/** Una pregunta con respuesta que ya está escrita en la página. */
export type Pregunta = { q: string; a: string };

export function faqLd(preguntas: readonly Pregunta[]) {
  return {
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  };
}

export function howToLd(
  locale: Locale,
  nombre: string,
  pasos: readonly { titulo: string; texto: string }[],
) {
  return {
    "@type": "HowTo",
    name: nombre,
    description: SITIO[locale].definicion,
    totalTime: "PT1M",
    inLanguage: SITIO[locale].idioma,
    supply: [],
    tool: [
      {
        "@type": "HowToTool",
        name: locale === "es" ? "Un teléfono con cámara" : "A phone with a camera",
      },
    ],
    step: pasos.map((p, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: p.titulo,
      text: p.texto,
    })),
  };
}

/**
 * El vocabulario del dominio como glosario legible por máquinas. Es lo que
 * permite que un modelo responda «¿qué es un cierre triádico?» citando a
 * Constela en vez de improvisar: los términos son nuestros y la definición
 * está publicada.
 *
 * El `@id` lleva el idioma —es el único que lo lleva— porque «Estrella» y
 * «Star» son dos términos distintos del mismo vocabulario, no el mismo
 * término dicho dos veces: un `DefinedTermSet` con los ocho mezclados diría
 * que Constela tiene ocho conceptos.
 */
export function glosarioLd(
  locale: Locale,
  terminos: readonly { termino: string; dominio: string; texto: string }[],
) {
  const id = `${SITIO_URL}/#vocabulario-${locale}`;
  return {
    "@type": "DefinedTermSet",
    "@id": id,
    name: locale === "es" ? "Vocabulario de Constela" : "Constela's vocabulary",
    description:
      locale === "es"
        ? "El lenguaje del dominio de Constela: cómo se llama cada pieza del networking de eventos cuando la red se dibuja como una constelación."
        : "Constela's domain language: what each piece of event networking is called when the network is drawn as a constellation.",
    inLanguage: SITIO[locale].idioma,
    hasDefinedTerm: terminos.map((t) => ({
      "@type": "DefinedTerm",
      name: t.termino,
      description: `${t.dominio}. ${t.texto}`,
      inDefinedTermSet: { "@id": id },
    })),
  };
}

/**
 * Una página de contenido.
 *
 * `author` y `publisher` apuntan a la organización y no a una persona: las dos
 * guías las firma Constela. Poner un nombre propio inventado para simular
 * autoría —el truco clásico para aparentar E-E-A-T— sería exactamente la clase
 * de evidencia fabricada que este proyecto no se permite.
 */
export function articuloLd(a: {
  locale: Locale;
  pagina: Pagina;
  titulo: string;
  descripcion: string;
  publicado: string;
  modificado: string;
}) {
  const path = RUTAS[a.locale][a.pagina];
  return {
    "@type": "Article",
    headline: a.titulo,
    description: a.descripcion,
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(path) },
    url: abs(path),
    inLanguage: SITIO[a.locale].idioma,
    author: { "@id": ID_ORG },
    publisher: { "@id": ID_ORG },
    datePublished: a.publicado,
    dateModified: a.modificado,
    about: { "@id": ID_APP },
    image: abs(imagenSocial(a.locale).url),
  };
}

export function migasLd(migas: readonly { nombre: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nombre,
      item: abs(m.path),
    })),
  };
}

/**
 * Empaqueta varios nodos en un solo `@graph`. Un único script por página con
 * todo dentro se valida mejor que cinco scripts sueltos, y deja que los nodos
 * se referencien entre sí por `@id` (la app pertenece a la organización, la
 * organización publica el sitio) en vez de repetirse.
 */
export function grafoLd(...nodos: object[]) {
  return { "@context": "https://schema.org", "@graph": nodos };
}
