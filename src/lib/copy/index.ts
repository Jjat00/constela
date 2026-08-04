/**
 * La puerta única al copy: se pide por idioma y se recibe la estructura
 * completa, garantizada por `tipos.ts`.
 *
 * Las páginas no importan `es.ts` ni `en.ts` directamente. Así una vista sirve
 * a los dos idiomas sin un solo condicional de idioma dentro, y añadir un
 * tercero sería añadir un archivo — no reescribir tres páginas.
 */

import type { Locale } from "@/lib/i18n";
import { EN } from "./en";
import { ES, REVISADO } from "./es";
import type { Copy } from "./tipos";

const BANCOS: Record<Locale, Copy> = { es: ES, en: EN };

export const copy = (locale: Locale): Copy => BANCOS[locale];

export { REVISADO };
export type {
  Categoria,
  Chrome,
  Copy,
  Cruce,
  Guia,
  Portada,
  Pregunta,
  Termino,
} from "./tipos";
