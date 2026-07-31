import { Easing, useVideoConfig } from "remotion";
import { loadFont as cargarSans } from "@remotion/google-fonts/DMSans";
import { loadFont as cargarMono } from "@remotion/google-fonts/GeistMono";

/** Las dos fuentes de la app: DM Sans para todo, Geist Mono de observatorio. */
export const { fontFamily: SANS } = cargarSans();
export const { fontFamily: MONO } = cargarMono();

/**
 * El sistema visual de Constela, traducido a video (DESIGN.md v5
 * «Observatorio» + `src/app/globals.css` de la app, que es la fuente de
 * verdad real). Nada de esto se inventa aquí: son los mismos hex.
 */
export const COLOR = {
  vacio: "#02030A",
  cielo: "#070A12",
  cieloClaro: "#0A0D18",
  tinta: "#F8FAFF",
  suave: "#AAB2C8",
  tenue: "#79839C",
  celeste: "#9DC8FF",
  cosmic: "#4EA8FF",
  sol: "#FFD97A",
  supernova: "#FFF4C7",
  halfa: "#F0699F",
  filamento: "#CDD8FF",
} as const;

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
