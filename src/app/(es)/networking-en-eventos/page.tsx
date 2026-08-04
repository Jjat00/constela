import type { Metadata } from "next";
import { VistaGuia } from "@/components/vista-guia";
import { copy } from "@/lib/copy";
import { metaPagina } from "@/lib/seo";

/** La guía en español. El contenido está en `VistaGuia`. */
export const metadata: Metadata = metaPagina({
  locale: "es",
  pagina: "guia",
  titulo: copy("es").guia.titulo,
  descripcion: copy("es").guia.descripcion,
});

export default function GuiaPage() {
  return <VistaGuia locale="es" />;
}
