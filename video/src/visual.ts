import { createContext, useContext } from "react";
import { Easing, useVideoConfig } from "remotion";
import { loadFont as cargarSans } from "@remotion/google-fonts/DMSans";
import { loadFont as cargarGeist } from "@remotion/google-fonts/Geist";
import { loadFont as cargarMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as cargarPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as cargarInterTight } from "@remotion/google-fonts/InterTight";

/** Las dos fuentes de la app: DM Sans para todo, Geist Mono de observatorio. */
export const { fontFamily: SANS } = cargarSans();
export const { fontFamily: MONO } = cargarMono();
/** La familia de Vercel: solo la usa el tema Documento, que es su escuela. */
export const { fontFamily: GEIST } = cargarGeist();
/** El par de `/opcion1`: grotesca apretada + mono de ingeniería. */
export const { fontFamily: INTER_TIGHT } = cargarInterTight();
export const { fontFamily: PLEX_MONO } = cargarPlexMono();

/**
 * EL VIDEO TIENE TRES TINTAS
 *
 * NOTA DE LECTURA (2026-08-04): los comentarios de este archivo nombran
 * `/opcion1` y `/opcion2`. Eran dos de las diez propuestas de rediseño de
 * portada que el usuario revisó; esas rutas **ya no existen en el árbol**.
 * `/opcion1` «Observatorio» ganó, se promovió a `/` y hoy es **v6, el sistema
 * visual de toda la app**; `/opcion2` «Documento» se retiró con las otras
 * ocho. Los nombres se conservan aquí porque explican de dónde salió cada
 * hex, y esa historia vive en git.
 *
 * `cosmos` es el video de siempre —el de producción, el de la landing— y sus
 * valores son los de `DESIGN.md` v5 sin traducir. `documento` es el mismo
 * video impreso: los tokens de `/opcion2` (papel #FAFAFA, tinta negra, azul
 * #0070F3 de la escuela) para que la lámina no desentone con la página que la
 * enseña. `observatorio` es el de `/opcion1`: sigue siendo de noche, pero es
 * un instrumento, no una película — un solo azul frío, cero cine.
 *
 * No es un cambio de hex: es una puesta en escena distinta. Las tres cosas
 * que solo funcionan sobre cielo negro —halo difuso, núcleo blanco y picos de
 * difracción— se APAGAN en papel, donde serían niebla, un agujero y unas
 * cruces sucias. Igual que hace `TINTA_DOCUMENTO` con el canvas del mapa
 * interactivo, en `src/app/opcion2/demo.tsx`: las dos piezas de esa página
 * tienen que ser la misma tinta.
 *
 * Y apagar no es solo cosa del papel: `observatorio` tiene todo el cielo a su
 * favor y aun así renuncia al halo, a los picos y a la corona, porque su
 * tesis es que la red **mide** en vez de iluminar. La luz es el registro que
 * esa propuesta rechaza, no un recurso que el fondo le permita.
 */
export type Paleta = {
  id: "cosmos" | "documento" | "observatorio";

  /* — la superficie — */
  /** Color base del lienzo, detrás de todo. */
  fondo: string;
  /** Gradiente del cielo; en papel los dos extremos son el mismo papel. */
  cieloA: string;
  cieloB: string;
  /** Ambiente que solo tiene sentido en un cielo: se apaga en papel. */
  campo: boolean;
  nebulosa: boolean;
  vineta: boolean;
  grano: boolean;

  /* — la tinta — */
  tinta: string;
  suave: string;
  tenue: string;
  /** La palabra que remata un titular. */
  remate: string;
  /** «Tú», la única estrella con nombre propio. */
  sol: string;
  supernova: string;
  /** Los cierres triádicos: H-alfa en el cielo, azul de enlace en papel. */
  triada: string;
  filamento: string;
  /**
   * Cuánto de la opacidad escrita en las escenas llega al trazo. En papel la
   * tinta es negra y las opacidades del cielo la dejarían casi sólida: 0.68
   * hace que el filamento fino (0.42) caiga en ~#B3B3B3, que es exactamente
   * donde cae el diagrama del hero de `/opcion2` (#9B9B9B al 75 %).
   */
  filamentoFuerza: number;

  /* — la anatomía de la estrella — */
  /** ¿El color lo pone la clase espectral, o manda una sola tinta? */
  espectral: boolean;
  /**
   * El cuerpo de una estrella anónima cuando no hay clase espectral. Suele
   * ser la tinta del texto, pero no tiene por qué: en `observatorio` el sol
   * es el blanco de la tinta y las anónimas bajan un peldaño de la escala
   * gris, que es como las imprime el diagrama del hero de `/opcion1`. Sin
   * esa distancia, «tú» sería una estrella más.
   */
  cuerpo: string;
  halo: boolean;
  picos: boolean;
  corona: boolean;
  /** El punto blanco-caliente del centro; `null` lo apaga. */
  nucleo: string | null;
  /** Opacidad del disco. Sin halo detrás tiene que sostenerse solo. */
  disco: number;

  /* — el velo del pie, en los canales de su fondo — */
  velo: string;
  /**
   * Cuánto sube la transición del velo por encima de la franja de texto, en
   * altos de esa franja. En el cielo es una bruma larga que hunde el mapa en
   * el vacío; en papel tiene que ser corta —una banda limpia, no niebla—
   * porque un velo blanco largo deslava «tú» hasta dejarlo por debajo de las
   * estrellas anónimas, que es justo la jerarquía contraria.
   */
  veloArranque: number;
  /** Contorno del nombre de una estrella, para que se lea sobre el mapa. */
  etiquetaBorde: string;

  /* — lo que en el cielo es cristal y en papel es papel — */
  cristal: {
    borde: string;
    fondo: string;
    blur: string;
    sombra: string;
    /** Radio en unidades `u`. El documento redondea corto. */
    radio: number;
  };
  /** El chip del filtro: en reposo y cuando está puesto. */
  chip: { borde: string; fondo: string; radio: number };
  chipActivo: { borde: string; fondo: string; texto: string };

  /* — voz — */
  sans: string;
  /** La mono de las anotaciones `[ ASÍ ]` y de los nombres del mapa. */
  mono: string;
  /** Tracking del titular: Geist no pide el cierre que pide DM Sans. */
  tracking: string;

  /* — los assets, que también tienen dos tintas — */
  logo: string;
  qr: string;
};

/** El video de siempre. Estos valores NO se tocan: son los de producción. */
export const COSMOS: Paleta = {
  id: "cosmos",
  fondo: "#02030A",
  cieloA: "#070A12",
  cieloB: "#0A0D18",
  campo: true,
  nebulosa: true,
  vineta: true,
  grano: true,
  tinta: "#F8FAFF",
  suave: "#AAB2C8",
  tenue: "#79839C",
  remate: "#9DC8FF",
  sol: "#FFD97A",
  supernova: "#FFF4C7",
  triada: "#F0699F",
  filamento: "#CDD8FF",
  filamentoFuerza: 1,
  espectral: true,
  // Sin efecto mientras `espectral` sea true: el cielo pinta cada estrella
  // con su clase. Queda escrito para que el tipo no tenga huecos.
  cuerpo: "#F8FAFF",
  halo: true,
  picos: true,
  corona: true,
  nucleo: "#FFFFFF",
  disco: 0.62,
  velo: "4, 6, 14",
  veloArranque: 0.95,
  etiquetaBorde: "rgba(2, 3, 10, 0.8)",
  cristal: {
    borde: "rgba(255,255,255,0.10)",
    fondo: "rgba(255,255,255,0.05)",
    blur: "blur(26px)",
    sombra: "0 30px 70px -30px rgba(2,3,10,0.9)",
    radio: 30,
  },
  chip: { borde: "rgba(255,255,255,0.09)", fondo: "rgba(255,255,255,0.04)", radio: 999 },
  chipActivo: {
    borde: "rgba(78,168,255,0.8)",
    fondo: "rgba(78,168,255,0.22)",
    texto: "#F8FAFF",
  },
  sans: SANS,
  mono: MONO,
  tracking: "-0.055em",
  logo: "logo-constela.png",
  qr: "qr-constela.svg",
};

/** El mismo video, impreso. Los tokens salen del CSS de `/opcion2`. */
export const DOCUMENTO: Paleta = {
  id: "documento",
  // `--fondo2`: el papel sobre el que la página apoya sus figuras.
  fondo: "#FAFAFA",
  cieloA: "#FAFAFA",
  cieloB: "#FAFAFA",
  // Un papel no tiene estrellas de fondo, ni nebulosas, ni viñeta. El grano
  // en `mixBlendMode:overlay` sobre blanco solo ensucia.
  campo: false,
  nebulosa: false,
  vineta: false,
  grano: false,
  tinta: "#000000",
  suave: "#666666", // `--suave`
  tenue: "#6E6E6E", // `--tenue`
  remate: "#0070F3",
  sol: "#0070F3", // «tú» es la única con color, como el enlace
  supernova: "#0070F3",
  triada: "#0070F3",
  filamento: "#000000",
  filamentoFuerza: 0.68,
  espectral: false,
  // Sobre papel no hay escala de brillos: todas las estrellas son la misma
  // tinta y «tú» se distingue por color, no por peldaño.
  cuerpo: "#000000",
  halo: false,
  picos: false,
  corona: false,
  nucleo: null,
  // Sin halo detrás, el disco es toda la estrella: el mismo 0.9 que usa el
  // grafo de la app cuando se le apaga el halo.
  disco: 0.9,
  velo: "250, 250, 250",
  veloArranque: 0.25,
  etiquetaBorde: "rgba(255, 255, 255, 0.9)",
  cristal: {
    borde: "#EAEAEA", // `--borde`
    fondo: "#FFFFFF", // `--papel`
    blur: "none",
    sombra: "none",
    radio: 8,
  },
  // Píldora: `/opcion2` ya usa píldoras en «lo que no hace».
  chip: { borde: "#EAEAEA", fondo: "#FFFFFF", radio: 999 },
  // Calcado de `.o2-app .chip-triad[aria-pressed="true"]` en `/opcion2`.
  chipActivo: {
    borde: "#0070F3",
    fondo: "rgba(0,112,243,0.08)",
    texto: "#0070F3",
  },
  sans: GEIST,
  // Geist Mono ya es el mono de la app y el que usa `.o2-mono`: no cambia.
  mono: MONO,
  // La escuela del documento no aprieta el titular: `letter-spacing:-.045em`.
  tracking: "-0.045em",
  logo: "logo-constela-tinta.png",
  qr: "qr-constela-tinta.svg",
};

/**
 * El mismo video, medido. Los tokens salen del CSS de `/opcion1`.
 *
 * Es la tinta más fácil de confundir con la de producción —las dos son de
 * noche— y la que más se le opone: `/opcion1` renuncia al cine para quedarse
 * con el instrumento. Aquí eso significa apagar las cuatro capas de ambiente
 * (campo, nebulosa, viñeta, grano) aunque el cielo las sostendría, dejar el
 * gradiente en un papel liso porque esa página no tiene degradados, y reducir
 * la anatomía de la estrella a disco y núcleo, que es exactamente lo que
 * dibuja su diagrama del hero (`RedSVG` con `halo`, `picos` y `corona` en
 * false). Del oro y del H-alfa no queda nada: un solo azul frío, el `--azul`.
 */
export const OBSERVATORIO: Paleta = {
  id: "observatorio",
  // `--papel`, que en esta propuesta es casi negro.
  fondo: "#0B0C0F",
  // Sin degradado: la página entera no tiene ni uno.
  cieloA: "#0B0C0F",
  cieloB: "#0B0C0F",
  campo: false,
  nebulosa: false,
  vineta: false,
  grano: false,
  tinta: "#F2F3F5", // `--tinta`
  suave: "#8E939C", // `--suave`
  tenue: "#7C828C", // `--tenue`
  // El remate no es un color: `.o1-h1 em` remata en gris. La página guarda
  // el azul para una sola cosa —los cierres triádicos y los enlaces—, y un
  // titular no es ninguna de las dos.
  remate: "#8E939C",
  sol: "#F2F3F5", // `colorSol` del diagrama del hero: el blanco pleno
  supernova: "#FFFFFF",
  triada: "#6E9BFF", // `--azul`
  filamento: "#8E939C", // `colorLinea` del diagrama del hero
  // El diagrama del hero traza en #8E939C al 40 % sobre #0B0C0F, que cae en
  // rgb(63, 66, 71). El filamento fino del mapa va al 42 % con la misma
  // tinta: 11 + 0,42·f·(142−11) = 63,4 → f = 0,95.
  filamentoFuerza: 0.95,
  espectral: false,
  // Un peldaño por debajo del sol en la escala gris del hero (#B9BEC7 es su
  // segunda tinta): las anónimas se leen, «tú» manda.
  cuerpo: "#B9BEC7",
  halo: false,
  picos: false,
  corona: false,
  // El núcleo sí se queda: sobre cielo negro es luz que el papel no podía
  // sostener, y el diagrama del hero lo dibuja (`nucleo` viene en true).
  nucleo: "#FFFFFF",
  disco: 0.9,
  velo: "11, 12, 15",
  /*
   * El velo más corto de las tres tintas, y no por gusto: aquí el sol no
   * tiene ni corona ni halo que lo sostengan bajo la bruma. Con el 0.95 del
   * cosmos, «tú» —que en la escena del escaneo cae por debajo del centro—
   * salía a rgb(120) mientras la otra estrella, más arriba, llegaba intacta:
   * la jerarquía al revés, el mismo fallo que el velo blanco causa en papel.
   * 0.12 deja el disco entero por encima de la transición (en 16:9 el sol
   * termina en y≈610 y el velo arranca en y≈600). Y no cuesta nada: sin campo
   * de estrellas ni nebulosa, aquí el velo solo tiene que tapar el mapa.
   */
  veloArranque: 0.12,
  etiquetaBorde: "rgba(11, 12, 15, 0.8)",
  // Cero cristal, que es literalmente la tesis de la propuesta: superficie
  // opaca, filete de 1px y la esquina de 2px de su CTA.
  cristal: {
    borde: "rgba(255,255,255,0.11)", // `--linea`
    fondo: "#0B0C0F",
    blur: "none",
    sombra: "none",
    radio: 2,
  },
  // Aquí no hay una sola píldora: el CTA, el foco y las cajas de la propuesta
  // van a 2px. El chip se cuadra con ellos.
  chip: { borde: "rgba(255,255,255,0.11)", fondo: "transparent", radio: 2 },
  // Puesto = tinta plena invertida, que es como `/opcion1` marca su acción
  // principal (`.o1-cta`). No hay color de estado en esa escuela.
  chipActivo: {
    borde: "#F2F3F5",
    fondo: "#F2F3F5",
    texto: "#0B0C0F",
  },
  sans: INTER_TIGHT,
  mono: PLEX_MONO,
  // El titular de `/opcion1` aprieta a `-.05em`.
  tracking: "-0.05em",
  // El logo ya es blanco: sobre este papel se lee tal cual.
  logo: "logo-constela.png",
  qr: "qr-constela-observatorio.svg",
};

export const PALETAS = {
  cosmos: COSMOS,
  documento: DOCUMENTO,
  observatorio: OBSERVATORIO,
} as const;
export type TemaId = keyof typeof PALETAS;

/** Sin proveedor, el cielo: lo de producción no cambia por existir esto. */
const PaletaContext = createContext<Paleta>(COSMOS);
export const PaletaProvider = PaletaContext.Provider;
export const usePaleta = () => useContext(PaletaContext);

/** El easing de la app: el mismo con el que se dibuja la constelación. */
export const SUAVE = Easing.bezier(0.16, 1, 0.3, 1);
export const TRAZO = Easing.bezier(0.6, 0, 0.2, 1);

/**
 * Una sola unidad para las dos orientaciones. `u` vale 1 en el vertical
 * (1080 de ancho) y 1.78 en el horizontal, así que los tamaños se escriben
 * una vez y crecen con la composición, como pide la guía de layout.
 */
export function useLienzo() {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const vertical = height > width;
  const u = width / 1080;
  const margen = vertical ? 84 : 132;

  return {
    width,
    height,
    fps,
    durationInFrames,
    vertical,
    u,
    /** Zona segura lateral. */
    margen,
    /**
     * El mapa manda: va centrado y a sangre en las dos orientaciones, y el
     * texto de esas escenas baja a una franja al pie. La alternativa —tipo
     * gigante a un lado, mapa al otro— obligaba a partir titulares en cuatro
     * líneas y a encoger la constelación hasta el tamaño de un logo.
     */
    mapa: vertical
      ? {
          cx: width / 2,
          cy: height * 0.42,
          // El dibujo va girado 90°: la constelación es ancha y el encuadre
          // alto, así que su eje largo se acuesta sobre el del teléfono.
          rotar: true,
          // El límite lo pone el ANCHO tras el giro (1.4 × radio) más el
          // sitio que piden los nombres a cada lado.
          radio: Math.min(width * 0.42, height * 0.25),
          cuerpo: 2.4,
        }
      : {
          cx: width / 2,
          cy: height * 0.38,
          rotar: false,
          radio: Math.min(width * 0.33, height * 0.37),
          cuerpo: 2.4,
        },
    /**
     * Franja de texto al pie, para las escenas donde el mapa es el sujeto.
     * Se ancla ABAJO —no arriba— para que ni el titular ni los chips crucen
     * nunca la zona segura inferior; el mapa puede pasar por detrás, que para
     * eso lleva velo.
     */
    pie: {
      left: margen,
      ancho: width - margen * 2,
      alto: (vertical ? 196 : 178) * u,
      top: height - margen - (vertical ? 196 : 178) * u,
    },
    /** Bloque centrado, para las escenas que son solo tipografía. */
    titular: (vertical ? 88 : 84) * u,
    /** Titular en presencia del mapa: subtítulo de cine, no cartel. */
    titularPie: (vertical ? 60 : 52) * u,
    lede: (vertical ? 36 : 32) * u,
    /** Las microetiquetas `[ ASÍ ]`: pequeñas, nunca ilegibles en un móvil. */
    anotacion: (vertical ? 26 : 18) * u,
    /** El nombre de cada estrella dentro del mapa. */
    nombreEstrella: (vertical ? 22 : 15) * u,
    /** Los chips del filtro, calcados del panel. */
    chip: (vertical ? 30 : 24) * u,
  };
}

/** El grano de cine del `globals.css`, idéntico. */
export const GRANO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Mono de observatorio: `[ ASÍ ]`, con el tracking de las microetiquetas. */
export const MONO_TRACKING = "0.16em";
