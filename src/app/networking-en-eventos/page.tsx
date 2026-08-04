import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ObsCSS } from "@/components/obs-css";
import { DocHeader, DocMigas, DocPie, DocPuerta } from "@/components/obs-doc";
import { GUIA, REVISADO } from "@/lib/guia";
import { articuloLd, faqLd, grafoLd, metaPagina, migasLd } from "@/lib/seo";

/*
 * CONTRATO DE DIRECCIÓN — la guía
 *
 * DE DÓNDE SALE: la otra mitad de las búsquedas de la categoría no preguntan
 * por una herramienta, preguntan por el problema: «cómo hacer networking en un
 * evento». Quien busca eso no quiere que le vendan una app — y esta página no
 * se la vende hasta el final.
 *
 * THESIS: una guía que sirve aunque no uses Constela. Es la única forma
 * honesta de escribirla y, de paso, la única que consigue que alguien la
 * enlace o la cite. Constela aparece dos veces en todo el texto, las dos como
 * ejemplo de un principio que se sostiene solo.
 * OWN-WORLD: v6 «Observatorio» vía `ObsCSS`, en modo documento. Tres tiempos
 * —antes, durante, después— separados por hairlines, sin ilustraciones: es la
 * página más textual del sitio y no finge ser otra cosa.
 * FORM: respuesta directa arriba, tres bandas de prosa, los cuatro errores en
 * lista, preguntas, puerta.
 *
 * HONESTIDAD: ni una cifra. Los «80 % de las tarjetas se tiran» que circulan
 * por internet no se pueden rastrear hasta un estudio y aquí no se repiten.
 */

export const metadata: Metadata = metaPagina({
  titulo: GUIA.titulo,
  descripcion: GUIA.descripcion,
  path: GUIA.ruta,
});

const LD = grafoLd(
  articuloLd({
    titulo: GUIA.titulo,
    descripcion: GUIA.descripcion,
    path: GUIA.ruta,
    publicado: REVISADO,
    modificado: REVISADO,
  }),
  faqLd([...GUIA.preguntas]),
  migasLd([
    { nombre: "Constela", path: "/" },
    { nombre: GUIA.titulo, path: GUIA.ruta },
  ]),
);

/** Los tres tiempos, en orden. Es la estructura entera de la guía. */
const TIEMPOS = [
  { mono: "Antes", ...GUIA.antes },
  { mono: "Durante", ...GUIA.durante },
  { mono: "Después", ...GUIA.despues },
] as const;

export default function GuiaPage() {
  return (
    <>
      <ObsCSS doc />
      <JsonLd data={LD} />
      <div className="obs">
        <DocHeader />
        <DocMigas actual={GUIA.etiqueta} />

        <main className="obs-carril">
          <article>
            <header className="obs-banda" style={{ paddingTop: 0 }}>
              <p className="obs-mono">{GUIA.etiqueta}</p>
              <h1 className="obs-h1-doc">{GUIA.h1}</h1>
              <p className="obs-clave">{GUIA.clave}</p>
              {/* La fecha no es adorno: en una guía, saber de cuándo es
                  cambia cuánto te fías de ella. */}
              <p className="obs-mono" style={{ marginTop: "1.75rem" }}>
                Revisada el 4 de agosto de 2026
              </p>
            </header>

            {TIEMPOS.map((t) => (
              <section key={t.mono} className="obs-banda">
                <p className="obs-mono">{t.mono}</p>
                <h2 className="obs-titulo">{t.titulo}</h2>
                <div className="obs-prosa">
                  {t.parrafos.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="obs-banda">
              <p className="obs-mono">Lo que no funciona</p>
              <h2 className="obs-titulo">{GUIA.errores.titulo}</h2>
              <div className="obs-prosa">
                <ul>
                  {GUIA.errores.lista.map((e) => (
                    <li key={e.slice(0, 32)}>{e}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="obs-banda">
              <p className="obs-mono">Preguntas</p>
              <h2 className="obs-titulo">
                Las que se hacen antes de entrar al salón.
              </h2>
              <div className="obs-preg">
                {GUIA.preguntas.map((p) => (
                  <div key={p.q}>
                    <h3>{p.q}</h3>
                    <p>{p.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="obs-banda">
              <p className="obs-mono">Y si buscabas herramienta</p>
              <div className="obs-prosa">
                <p>
                  Esta guía funciona con una libreta y cuatro tarjetas de papel.
                  Si además estabas comparando herramientas, la página sobre{" "}
                  <Link href="/app-de-networking-para-eventos">
                    qué es una app de networking para eventos
                  </Link>{" "}
                  compara los cuatro métodos por lo que queda después de cada
                  uno.
                </p>
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
