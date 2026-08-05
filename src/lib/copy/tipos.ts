/**
 * La forma del copy, idéntica en los dos idiomas.
 *
 * POR QUÉ ESTE ARCHIVO EXISTE: dos bancos de texto sueltos divergen. Uno gana
 * una pregunta frecuente que el otro no tiene, alguien retoca un titular en
 * español y el inglés se queda con el de la semana pasada, y al cabo de un mes
 * las dos versiones de la misma página ya no dicen lo mismo — que es
 * exactamente lo que un `hreflang` le promete a Google que no pasa.
 *
 * Aquí no se declara ninguna frase: se declara qué frases tiene que haber.
 * `es.ts` y `en.ts` implementan este contrato, y si a uno le falta una pieza
 * el proyecto no compila. La paridad deja de depender de que alguien se
 * acuerde.
 *
 * Lo que este archivo NO garantiza —y ninguna estructura de datos puede— es
 * que el inglés diga la verdad. Eso sigue siendo cosa de PRODUCT.md
 * § Evidence on Hand: **no hay testimonios, métricas, prensa ni clientes, y
 * traducir no es la ocasión de inventarlos.** Si una afirmación no se sostiene
 * en español, tampoco se sostiene en inglés.
 */

import type { Pagina } from "@/lib/i18n";

/** Una pregunta con su respuesta. Va a la página y al `FAQPage` de JSON-LD. */
export type Pregunta = { q: string; a: string };

/** Un término del vocabulario del dominio (CONTEXT.md). */
export type Termino = { termino: string; dominio: string; texto: string };

/**
 * Un párrafo que lleva un enlace a la otra página del sitio dentro. Se parte
 * en tres porque el enlace va en mitad de la frase, y una frase partida por
 * concatenación no se puede traducir sin que el orden de las palabras acabe
 * decidido por el español.
 */
export type Cruce = {
  antes: string;
  enlace: string;
  despues: string;
  a: Pagina;
};

/** El chrome: cabecera, migas, pie y las etiquetas que se repiten. */
export type Chrome = {
  /** El enlace de la cabecera cuando no hay sesión. */
  entrar: string;
  /** El de la portada cuando sí la hay. */
  entrarConstelacion: string;
  /** `aria-label` del lockup cuando es el camino de vuelta. */
  volverPortada: string;
  migasAria: string;
  migasInicio: string;
  pieAria: string;
  pieLegalAria: string;
  portada: string;
  privacidad: string;
  terminos: string;
  copyright: string;
  /** El pie de la puerta en las páginas de documento. */
  gratis: string;
  /** El selector de idioma: qué dice el botón que lleva al otro idioma. */
  idioma: { aria: string; otro: string; otroNombre: string };
  /**
   * Aviso honesto en el árbol inglés: la aplicación —no el sitio— todavía
   * habla español. Vale más decirlo que dejar que alguien lo descubra al
   * entrar. En español es la cadena vacía: allí no hay nada que advertir.
   */
  avisoIdiomaApp: string;
  /**
   * La puerta. Es el CTA principal de las cuatro páginas de contenido y el
   * único botón que la landing enseña dos veces: dejarlo en español dentro
   * del árbol inglés sería el detalle más visible de todos.
   */
  google: { continuar: string; abriendo: string; error: string };
  /**
   * Los rótulos de la ficha de bienvenida que la portada enseña jugable.
   *
   * Solo el chrome. Los valores —«ai engineer», «diseño», «busco trabajo»—
   * son el catálogo curado real de la base de datos (migración 0007) y NO se
   * traducen: la banda promete que lo que se ve es la aplicación, y traducir
   * sus datos para la foto rompería justo esa promesa. De ahí el aviso de
   * `avisoIdiomaApp`, que existe para decirlo en voz alta.
   */
  ficha: {
    rol: string;
    intereses: string;
    intencion: string;
    buscaRol: string;
    buscaIntereses: string;
    buscaIntencion: string;
    /**
     * «ver los {n} restantes». Plantilla y no función: este objeto cruza la
     * frontera del servidor al cliente (`BienvenidaYMapa` lleva "use client")
     * y una función no se serializa.
     */
    verRestantes: string;
  };
};

export type Portada = {
  marca: {
    nombre: string;
    tagline: string;
    definicion: string;
    titular: { antes: string; destacado: string };
  };
  hero: {
    mono: string;
    /** La primera frase del lede, en tinta plena: nombre + tesis. */
    ledeFuerte: string;
    /**
     * El verso del dominio bajo el lede, en mono de caja baja: persona →
     * estrella, encuentro → línea, evento → constelación. Vivió como meta
     * description hasta que el SEO la reescribió (`d61f39c`); aquí vuelve
     * donde sí se ve.
     */
    verso: string;
    /** Cuánto se tarda en entrar. */
    tiempo: string;
  };
  video: {
    etiqueta: string;
    titulo: string;
    texto: string;
    marco: string;
    pie: string;
  };
  pasos: {
    mono: string;
    titulo: string;
    lista: readonly { n: string; titulo: string; texto: string }[];
    /** El nombre del `HowTo` en JSON-LD. */
    howTo: string;
  };
  vocabulario: { mono: string; titulo: string; lista: readonly Termino[] };
  noHace: { mono: string; lista: readonly string[] };
  preguntas: { mono: string; lista: readonly Pregunta[] };
  bienvenida: {
    etiqueta: string;
    titulo: string;
    texto: string;
    textoDos: string;
    pie: string;
  };
  mapa: {
    etiqueta: string;
    titulo: string;
    texto: string;
    textoDos: string;
    marco: string;
    pie: string;
  };
  siguiente: {
    mono: string;
    titulo: string;
    enlaces: readonly { a: Pagina; titulo: string; texto: string }[];
  };
  cierre: { titulo: string };
  /**
   * Los rótulos de las dos piezas jugables (el video y el mapa real). Viven en
   * el copy y no dentro del componente porque ese componente lo montan las dos
   * portadas: si se quedaran incrustados, la portada inglesa tendría botones
   * en español justo en la parte que se toca.
   */
  demo: {
    reproducir: string;
    pausar: string;
    videoAria: string;
    encendiendo: string;
    filtrar: string;
    eligeRol: string;
    /** Singular y plural de «señal elegida»: el contador de la ficha. */
    senal: string;
    senales: string;
    seApaga: string;
    pistaVacia: string;
    estrellas: string;
    conexiones: string;
    tusEventos: string;
  };
};

export type Categoria = {
  etiqueta: string;
  /** El `<title>` y el `headline` del `Article`. */
  titulo: string;
  h1: string;
  /** La respuesta directa: el primer párrafo, y lo que un motor extrae. */
  clave: string;
  descripcion: string;
  problema: { mono: string; titulo: string; parrafos: readonly string[] };
  tabla: {
    mono: string;
    titulo: string;
    /** Descripción para lectores de pantalla; no se ve. */
    caption: string;
    columnas: readonly [string, string, string];
    filas: readonly {
      metodo: string;
      cuesta: string;
      queda: string;
      nuestro?: boolean;
    }[];
  };
  diferencia: {
    mono: string;
    titulo: string;
    parrafos: readonly string[];
    cruce: Cruce;
  };
  preguntas: { mono: string; titulo: string; lista: readonly Pregunta[] };
};

export type Guia = {
  etiqueta: string;
  titulo: string;
  h1: string;
  clave: string;
  descripcion: string;
  /** «Revisada el 4 de agosto de 2026», escrita en el idioma que toca. */
  revisada: string;
  tiempos: readonly { mono: string; titulo: string; parrafos: readonly string[] }[];
  errores: { mono: string; titulo: string; lista: readonly string[] };
  preguntas: { mono: string; titulo: string; lista: readonly Pregunta[] };
  cruce: { mono: string } & Cruce;
};

export type Copy = {
  chrome: Chrome;
  portada: Portada;
  categoria: Categoria;
  guia: Guia;
};
