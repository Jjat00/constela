import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ObsCSS } from "@/components/obs-css";
import { DocHeader, DocMigas, DocPie, DocPuerta } from "@/components/obs-doc";
import { copy, REVISADO } from "@/lib/copy";
import { type Locale, RUTAS } from "@/lib/i18n";
import { articuloLd, faqLd, grafoLd, migasLd, NOMBRE } from "@/lib/seo";

/*
 * CONTRATO DE DIRECCIÓN — página de categoría
 *
 * DE DÓNDE SALE: la portada solo compite por «Constela». Quien no conoce el
 * nombre busca la categoría —«app de networking para eventos», «event
 * networking app»— y hasta hoy no había nada en el sitio que respondiera a
 * eso. Esta página es esa respuesta, en los dos idiomas.
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
 * nombre, y no contiene una sola cifra — ni en español ni en inglés, que es
 * donde más barato habría salido inventarse una. El porqué está en
 * `src/lib/copy/es.ts`.
 */

export function ldCategoria(locale: Locale) {
  const t = copy(locale).categoria;
  return grafoLd(
    articuloLd({
      locale,
      pagina: "categoria",
      titulo: t.titulo,
      descripcion: t.descripcion,
      publicado: REVISADO,
      modificado: REVISADO,
    }),
    faqLd([...t.preguntas.lista]),
    migasLd([
      { nombre: NOMBRE, path: RUTAS[locale].portada },
      { nombre: t.titulo, path: RUTAS[locale].categoria },
    ]),
  );
}

export function VistaCategoria({ locale }: { locale: Locale }) {
  const t = copy(locale).categoria;
  const chrome = copy(locale).chrome;

  return (
    <>
      <ObsCSS doc />
      <JsonLd data={ldCategoria(locale)} />
      <div className="obs">
        <DocHeader locale={locale} pagina="categoria" />
        <DocMigas locale={locale} actual={t.etiqueta} />

        <main className="obs-carril">
          <article>
            <header className="obs-banda" style={{ paddingTop: 0 }}>
              <p className="obs-mono">{t.etiqueta}</p>
              <h1 className="obs-h1-doc">{t.h1}</h1>
              {/* La definición, en tinta plena y arriba del todo: es lo que se
                  lee de pie en un pasillo y lo que un motor de respuestas
                  extrae cuando le preguntan qué es esto. */}
              <p className="obs-clave">{t.clave}</p>
            </header>

            <section className="obs-banda">
              <p className="obs-mono">{t.problema.mono}</p>
              <h2 className="obs-titulo">{t.problema.titulo}</h2>
              <div className="obs-prosa">
                {t.problema.parrafos.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </section>

            <section className="obs-banda obs-banda-ancha">
              <p className="obs-mono">{t.tabla.mono}</p>
              <h2 className="obs-titulo">{t.tabla.titulo}</h2>
              <div className="obs-tabla-marco">
                <table className="obs-tabla">
                  <caption className="sr-only">{t.tabla.caption}</caption>
                  <thead>
                    <tr>
                      {t.tabla.columnas.map((c) => (
                        <th key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.tabla.filas.map((f) => (
                      <tr key={f.metodo}>
                        <th scope="row">
                          {f.metodo}
                          {f.nuestro ? (
                            <span
                              className="obs-mono obs-si"
                              style={{ display: "block", marginTop: ".4rem" }}
                            >
                              {NOMBRE}
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
              <p className="obs-mono">{t.diferencia.mono}</p>
              <h2 className="obs-titulo">{t.diferencia.titulo}</h2>
              <div className="obs-prosa">
                {t.diferencia.parrafos.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
                <p>
                  {t.diferencia.cruce.antes}
                  <Link href={RUTAS[locale][t.diferencia.cruce.a]}>
                    {t.diferencia.cruce.enlace}
                  </Link>
                  {t.diferencia.cruce.despues}
                </p>
              </div>
            </section>

            <section className="obs-banda">
              <p className="obs-mono">{t.preguntas.mono}</p>
              <h2 className="obs-titulo">{t.preguntas.titulo}</h2>
              <div className="obs-preg">
                {t.preguntas.lista.map((p) => (
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
            <h2>{copy(locale).portada.cierre.titulo}</h2>
            <div className="obs-acciones">
              <DocPuerta locale={locale} />
              <span className="obs-mono">{chrome.gratis}</span>
            </div>
          </section>

          <DocPie locale={locale} />
        </main>
      </div>
    </>
  );
}
