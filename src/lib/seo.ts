/**
 * El banco de hechos del SEO.
 *
 * Mismo contrato que `portada.ts`: todo lo que Constela le dice a un buscador
 * —o a un modelo de lenguaje— sale de aquí, y todo lo de aquí sale de
 * PRODUCT.md, CONTEXT.md y los ADR. La regla dura sigue siendo la misma: **no
 * existen testimonios, métricas de uso, prensa, casos ni clientes — no
 * fabricar ninguno** (PRODUCT.md § Evidence on Hand). Por eso el
 * `SoftwareApplication` de más abajo no lleva `aggregateRating` ni
 * `interactionStatistic`: sería la única forma de mentirle a Google desde un
 * archivo de datos.
 *
 * POR QUÉ EXISTE: hasta 2026-08-04 la app entera declaraba dos etiquetas
 * (`title` y `description`) y nada más. Sin `metadataBase` los canónicos y las
 * imágenes sociales salían relativos —es decir, rotos—, sin `robots.txt` los
 * perfiles de personas reales quedaban expuestos a los rastreadores, y el
 * título no contenía una sola palabra que alguien fuera a escribir en un
 * buscador: a Constela solo se llegaba sabiendo que se llama Constela.
 */

import type { Metadata } from "next";

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
 * La ficha de identidad de la marca.
 *
 * `titulo` es la única línea del proyecto donde el tagline convive con la
 * categoría: «app de networking para eventos» es lo que se busca, «que por fin
 * se ve» es lo que somos. Cabe en los ~60 caracteres que Google no recorta.
 */
export const SITIO = {
  nombre: "Constela",
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
  locale: "es_CO",
} as const;

/**
 * Los términos por los que queremos ser encontrados, en el idioma en que la
 * gente los escribe. No van en una meta `keywords` —Google la ignora desde
 * 2009— sino que son la lista de verificación de qué tiene que decir el copy
 * de verdad: si una de estas frases no aparece en un `h1`, `h2` o párrafo de
 * alguna página, no la estamos cubriendo.
 */
export const BUSQUEDAS = [
  "app de networking",
  "app de networking para eventos",
  "networking en eventos presenciales",
  "cómo hacer networking en un evento",
  "app para conectar en eventos",
  "tarjeta de presentación con QR",
  "QR para networking",
  "red de contactos de un evento",
  "alternativa a intercambiar LinkedIn en eventos",
] as const;

/** Las rutas públicas del sitio: las que un buscador puede ver enteras. */
export const RUTAS_PUBLICAS = [
  "/",
  "/networking-en-eventos",
  "/app-de-networking-para-eventos",
  "/privacidad",
  "/terminos",
] as const;

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
 * que `images` se declare a mano en vez de confiar en que el
 * `app/opengraph-image.tsx` se herede: en cuanto una página define su propio
 * `openGraph`, esa herencia deja de ocurrir.
 */
export function metaPagina(p: {
  titulo: string;
  descripcion: string;
  path: string;
  tipo?: "website" | "article";
}): Metadata {
  const titulo = `${p.titulo} — ${SITIO.nombre}`;
  const imagen = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${SITIO.nombre} — ${SITIO.tagline}`,
  };

  return {
    title: p.titulo,
    description: p.descripcion,
    alternates: { canonical: p.path },
    openGraph: {
      type: p.tipo ?? "article",
      siteName: SITIO.nombre,
      locale: SITIO.locale,
      url: p.path,
      title: titulo,
      description: p.descripcion,
      images: [imagen],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: p.descripcion,
      images: [imagen],
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
// ─────────────────────────────────────────────────────────────────────────────

/** El `@id` estable de la organización: el resto de nodos apunta aquí. */
const ID_ORG = `${SITIO_URL}/#organizacion`;
const ID_SITIO = `${SITIO_URL}/#sitio`;

export function orgLd() {
  return {
    "@type": "Organization",
    "@id": ID_ORG,
    name: SITIO.nombre,
    url: SITIO_URL,
    logo: abs("/icon.png"),
    description: SITIO.definicion,
    // Sin `sameAs`: Constela no tiene perfiles sociales verificados y
    // declarar uno inexistente rompe la entidad en el Knowledge Graph.
  };
}

export function sitioLd() {
  return {
    "@type": "WebSite",
    "@id": ID_SITIO,
    name: SITIO.nombre,
    url: SITIO_URL,
    inLanguage: SITIO.idioma,
    publisher: { "@id": ID_ORG },
  };
}

/**
 * La app en sí. `price: "0"` no es marketing: Constela no cobra, no tiene
 * planes y no existe una pasarela de pago en el producto. Es el dato que un
 * agente comparando apps de networking necesita para no descartarnos.
 */
export function appLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITIO_URL}/#app`,
    name: SITIO.nombre,
    alternateName: "Constela — app de networking para eventos",
    applicationCategory: "SocialNetworkingApplication",
    applicationSubCategory: "Networking de eventos presenciales",
    operatingSystem: "Web — cualquier navegador móvil o de escritorio",
    url: SITIO_URL,
    description: SITIO.definicion,
    inLanguage: SITIO.idioma,
    isAccessibleForFree: true,
    browserRequirements: "Requiere JavaScript. Se entra con una cuenta Google.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "COP",
      availability: "https://schema.org/InStock",
    },
    publisher: { "@id": ID_ORG },
    featureList: [
      "Conexión por escaneo del QR personal, sin solicitudes ni botón de agregar",
      "Mapa en vivo de la red completa del evento, visible para cualquier asistente",
      "Filtros por rol, interés e intención",
      "Cierres triádicos: se iluminan los grupos de tres que ya se conocen",
      "Tarjeta de presentación digital con los canales de contacto",
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
  nombre: string,
  pasos: readonly { titulo: string; texto: string }[],
) {
  return {
    "@type": "HowTo",
    name: nombre,
    description: SITIO.definicion,
    totalTime: "PT1M",
    supply: [],
    tool: [{ "@type": "HowToTool", name: "Un teléfono con cámara" }],
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
 */
export function glosarioLd(
  terminos: readonly { termino: string; dominio: string; texto: string }[],
) {
  return {
    "@type": "DefinedTermSet",
    "@id": `${SITIO_URL}/#vocabulario`,
    name: "Vocabulario de Constela",
    description:
      "El lenguaje del dominio de Constela: cómo se llama cada pieza del networking de eventos cuando la red se dibuja como una constelación.",
    inDefinedTermSet: `${SITIO_URL}/#vocabulario`,
    hasDefinedTerm: terminos.map((t) => ({
      "@type": "DefinedTerm",
      name: t.termino,
      description: `${t.dominio}. ${t.texto}`,
      inDefinedTermSet: { "@id": `${SITIO_URL}/#vocabulario` },
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
  titulo: string;
  descripcion: string;
  path: string;
  publicado: string;
  modificado: string;
}) {
  return {
    "@type": "Article",
    headline: a.titulo,
    description: a.descripcion,
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(a.path) },
    url: abs(a.path),
    inLanguage: SITIO.idioma,
    author: { "@id": ID_ORG },
    publisher: { "@id": ID_ORG },
    datePublished: a.publicado,
    dateModified: a.modificado,
    about: { "@id": `${SITIO_URL}/#app` },
    image: abs("/opengraph-image"),
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
