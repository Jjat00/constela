import type { Metadata } from "next";
import { VistaPortada } from "@/components/vista-portada";
import { RUTAS } from "@/lib/i18n";
import { alternativas } from "@/lib/seo";

/**
 * La portada en inglés: la misma vista, el mismo producto, otro idioma.
 *
 * No es una página de aterrizaje aparte ni una versión recortada. Si algún día
 * las dos dejaran de decir lo mismo, el `hreflang` que las declara hermanas
 * pasaría a ser una promesa falsa.
 */
export const metadata: Metadata = {
  alternates: {
    canonical: RUTAS.en.portada,
    languages: alternativas("portada"),
  },
};

export default function HomePage() {
  return <VistaPortada locale="en" />;
}
