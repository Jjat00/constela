import type { Metadata } from "next";
import { VistaCategoria } from "@/components/vista-categoria";
import { copy } from "@/lib/copy";
import { metaPagina } from "@/lib/seo";

/** La página de categoría en español. El contenido está en `VistaCategoria`. */
export const metadata: Metadata = metaPagina({
  locale: "es",
  pagina: "categoria",
  titulo: copy("es").categoria.titulo,
  descripcion: copy("es").categoria.descripcion,
});

export default function CategoriaPage() {
  return <VistaCategoria locale="es" />;
}
