import type { Metadata } from "next";
import { VistaPortada } from "@/components/vista-portada";
import { alternativas } from "@/lib/seo";

/**
 * La portada en español. Todo lo que se ve vive en `VistaPortada`, que la
 * comparte con `/en` — aquí solo se declara qué URL es esta y cuál es su
 * gemela.
 *
 * El canónico se declara aquí y no en el layout raíz: heredado, le diría a
 * Google que /privacidad y / son la misma página.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/", languages: alternativas("portada") },
};

export default function Portada() {
  return <VistaPortada locale="es" />;
}
