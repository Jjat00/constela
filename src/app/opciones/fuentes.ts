/**
 * Las tipografías de las diez propuestas.
 *
 * Cada opción es un mundo tipográfico distinto — es la mitad del rediseño —, y
 * todas se cargan por `next/font/google` para que se sirvan desde nuestro
 * propio origen, con `font-display: swap` y sin petición a Google en runtime.
 * Solo se declaran aquí; cada página aplica la clase `.variable` que necesita
 * en su contenedor raíz, así que una opción no paga el peso de las otras.
 *
 * DM Sans y Geist Mono no están aquí: ya viven en el layout raíz (son las de
 * producción) y las opciones que las usan las heredan.
 */
import {
  Anton,
  Fraunces,
  Geist,
  IBM_Plex_Mono,
  Instrument_Serif,
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Manrope,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Space_Mono,
} from "next/font/google";

/** 1 · Observatorio — grotesca apretada + mono de ingeniería */
export const interTight = Inter_Tight({
  variable: "--f-inter-tight",
  subsets: ["latin"],
});
export const plexMono = IBM_Plex_Mono({
  variable: "--f-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

/** 2 · Documento — la familia de Vercel */
export const geist = Geist({ variable: "--f-geist", subsets: ["latin"] });

/** 3 · Corriente — Inter, la voz de Linear */
export const inter = Inter({ variable: "--f-inter", subsets: ["latin"] });

/** 4 · Telemetría — monoespaciada y nada más */
export const jetbrains = JetBrains_Mono({
  variable: "--f-jetbrains",
  subsets: ["latin"],
});

/** 5 · Encuentro — humanista redonda + serif de display con óptica */
export const jakarta = Plus_Jakarta_Sans({
  variable: "--f-jakarta",
  subsets: ["latin"],
});
export const fraunces = Fraunces({
  variable: "--f-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

/** 6 · Efemérides — serif de alto contraste sobre papel */
export const instrument = Instrument_Serif({
  variable: "--f-instrument",
  weight: "400",
  subsets: ["latin"],
});

/** 7 · Cartel — condensada de póster + mono de imprenta */
export const anton = Anton({
  variable: "--f-anton",
  weight: "400",
  subsets: ["latin"],
});
export const spaceMono = Space_Mono({
  variable: "--f-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

/** 9 · Cristal — humanista de pantalla, muy abierta */
export const manrope = Manrope({ variable: "--f-manrope", subsets: ["latin"] });

/** 10 · Serigrafía — grotesca con carácter de imprenta */
export const spaceGrotesk = Space_Grotesk({
  variable: "--f-space-grotesk",
  subsets: ["latin"],
});
