import type { Metadata } from "next";
import { VistaGuia } from "@/components/vista-guia";
import { copy } from "@/lib/copy";
import { metaPagina } from "@/lib/seo";

/**
 * La guía en inglés.
 *
 * `networking-at-events` cubre a la vez «networking at events» y el
 * «networking at conferences» del que la página habla en el cuerpo: son la
 * misma intención de búsqueda, y partirla en dos URLs sería crear dos páginas
 * casi idénticas compitiendo entre sí.
 */
export const metadata: Metadata = metaPagina({
  locale: "en",
  pagina: "guia",
  titulo: copy("en").guia.titulo,
  descripcion: copy("en").guia.descripcion,
});

export default function NetworkingAtEventsPage() {
  return <VistaGuia locale="en" />;
}
