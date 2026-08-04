import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ObsCSS } from "@/components/obs-css";
import { DocHeader, DocMigas, DocPie, DocPuerta } from "@/components/obs-doc";
import { CATEGORIA, REVISADO } from "@/lib/guia";
import { articuloLd, faqLd, grafoLd, metaPagina, migasLd } from "@/lib/seo";

/*
 * CONTRATO DE DIRECCIÓN — página de categoría
 *
 * DE DÓNDE SALE: la portada solo compite por «Constela». Quien no conoce el
 * nombre busca la categoría —«app de networking para eventos»— y hasta hoy no
 * había nada en el sitio que respondiera a eso. Esta página es esa respuesta.
 *
 * THESIS: el mismo instrumento de la portada, en modo documento. Aquí no hay
 * demo ni película: hay una tabla y tres argumentos. La página gana si alguien
 * que estaba comparando herramientas entiende en treinta segundos qué clase de
 * cosa es Constela — incluso si concluye que no la necesita.
 * OWN-WORLD: heredado entero de v6 «Observatorio» vía `ObsCSS`. Papel liso,
 * hairlines a sangre, un solo azul, cero cajas. La tabla no es una tarjeta con
 * bordes: son filas separadas por la misma línea de 1px que todo lo demás.
 * FORM: respuesta directa arriba (para quien lee de pie y para el motor que la
 * extrae), tabla en el centro, preguntas al final, puerta abajo.
 *
 * HONESTIDAD: la comparación es entre métodos, nunca entre productos con
 * nombre, y no contiene una sola cifra. El porqué está en `src/lib/guia.ts`.
 */

export const metadata: Metadata = metaPagina({
  titulo: CATEGORIA.titulo,
  descripcion: CATEGORIA.descripcion,
  path: CATEGORIA.ruta,
});

const LD = grafoLd(
  articuloLd({
    titulo: CATEGORIA.titulo,
    descripcion: CATEGORIA.descripcion,
    path: CATEGORIA.ruta,
    publicado: REVISADO,
    modificado: REVISADO,
  }),
  faqLd([...CATEGORIA.preguntas]),
  migasLd([
    { nombre: "Constela", path: "/" },
    { nombre: CATEGORIA.titulo, path: CATEGORIA.ruta },
  ]),
);

export default function CategoriaPage() {
  return (
    <>
      <ObsCSS doc />
      <JsonLd data={LD} />
      <div className="obs">
        <DocHeader />
        <DocMigas actual={CATEGORIA.etiqueta} />

        <main className="obs-carril">
          <article>
            <header className="obs-banda" style={{ paddingTop: 0 }}>
              <p className="obs-mono">{CATEGORIA.etiqueta}</p>
              <h1 className="obs-h1-doc">{CATEGORIA.h1}</h1>
              {/* La definición, en tinta plena y arriba del todo: es lo que se
                  lee de pie en un pasillo y lo que un motor de respuestas
                  extrae cuando le preguntan qué es esto. */}
              <p className="obs-clave">{CATEGORIA.clave}</p>
            </header>

            <section className="obs-banda">
              <p className="obs-mono">El problema</p>
              <h2 className="obs-titulo">{CATEGORIA.problema.titulo}</h2>
              <div className="obs-prosa">
                {CATEGORIA.problema.parrafos.map((t) => (
                  <p key={t.slice(0, 32)}>{t}</p>
                ))}
              </div>
            </section>

            <section className="obs-banda obs-banda-ancha">
              <p className="obs-mono">Comparación</p>
              <h2 className="obs-titulo">{CATEGORIA.tabla.titulo}</h2>
              <div className="obs-tabla-marco">
                <table className="obs-tabla">
                  <caption className="sr-only">
                    Las cuatro formas de intercambiar contactos en un evento
                    presencial, comparadas por lo que cuestan en el momento y
                    por lo que queda después.
                  </caption>
                  <thead>
                    <tr>
                      {CATEGORIA.tabla.columnas.map((c) => (
                        <th key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CATEGORIA.tabla.filas.map((f) => (
                      <tr key={f.metodo}>
                        <th scope="row">
                          {f.metodo}
                          {"nuestro" in f && f.nuestro ? (
                            <span
                              className="obs-mono obs-si"
                              style={{ display: "block", marginTop: ".4rem" }}
                            >
                              Constela
                            </span>
                          ) : null}
                        </th>
                        <td>{f.cuesta}</td>
                        <td>{f.queda}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="obs-banda">
              <p className="obs-mono">La diferencia</p>
              <h2 className="obs-titulo">{CATEGORIA.diferencia.titulo}</h2>
              <div className="obs-prosa">
                {CATEGORIA.diferencia.parrafos.map((t) => (
                  <p key={t.slice(0, 32)}>{t}</p>
                ))}
                <p>
                  Si lo que buscas no es comparar herramientas sino salir mejor
                  del próximo evento, la{" "}
                  <Link href="/networking-en-eventos">
                    guía de networking en eventos presenciales
                  </Link>{" "}
                  entra en el cómo.
                </p>
              </div>
            </section>

            <section className="obs-banda">
              <p className="obs-mono">Preguntas</p>
              <h2 className="obs-titulo">
                Lo que se pregunta todo el mundo antes de instalar nada.
              </h2>
              <div className="obs-preg">
                {CATEGORIA.preguntas.map((p) => (
                  <div key={p.q}>
                    <h3>{p.q}</h3>
                    <p>{p.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <section className="obs-cierre">
            <div
              className="obs-regla"
              style={{ marginBottom: "clamp(2rem,5vw,3.5rem)" }}
            />
            <h2>Entra por una estrella.</h2>
            <div className="obs-acciones">
              <DocPuerta />
              <span className="obs-mono">Gratis · sin instalar nada</span>
            </div>
          </section>

          <DocPie />
        </main>
      </div>
    </>
  );
}
