import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ObsCSS } from "@/components/obs-css";
import { DocHeader, DocMigas, DocPie, DocPuerta } from "@/components/obs-doc";
import { copy, REVISADO } from "@/lib/copy";
import { type Locale, RUTAS } from "@/lib/i18n";
import { articuloLd, faqLd, grafoLd, migasLd, NOMBRE } from "@/lib/seo";

/*
 * CONTRATO DE DIRECCIÓN — la guía
 *
 * DE DÓNDE SALE: la otra mitad de las búsquedas de la categoría no preguntan
 * por una herramienta, preguntan por el problema: «cómo hacer networking en un
 * evento», «how to network at an event». Quien busca eso no quiere que le
 * vendan una app — y esta página no se la vende hasta el final.
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
 * por internet no se pueden rastrear hasta un estudio y aquí no se repiten, ni
 * traducidos.
 */

export function ldGuia(locale: Locale) {
  const t = copy(locale).guia;
  return grafoLd(
    articuloLd({
      locale,
      pagina: "guia",
      titulo: t.titulo,
      descripcion: t.descripcion,
      publicado: REVISADO,
      modificado: REVISADO,
    }),
    faqLd([...t.preguntas.lista]),
    migasLd([
      { nombre: NOMBRE, path: RUTAS[locale].portada },
      { nombre: t.titulo, path: RUTAS[locale].guia },
    ]),
  );
}

export function VistaGuia({ locale }: { locale: Locale }) {
  const t = copy(locale).guia;
  const chrome = copy(locale).chrome;

  return (
    <>
      <ObsCSS doc />
      <JsonLd data={ldGuia(locale)} />
      <div className="obs">
        <DocHeader locale={locale} pagina="guia" />
        <DocMigas locale={locale} actual={t.etiqueta} />

        <main className="obs-carril">
          <article>
            <header className="obs-banda" style={{ paddingTop: 0 }}>
              <p className="obs-mono">{t.etiqueta}</p>
              <h1 className="obs-h1-doc">{t.h1}</h1>
              <p className="obs-clave">{t.clave}</p>
              {/* La fecha no es adorno: en una guía, saber de cuándo es
                  cambia cuánto te fías de ella. */}
              <p className="obs-mono" style={{ marginTop: "1.75rem" }}>
                {t.revisada}
              </p>
            </header>

            {t.tiempos.map((tiempo) => (
              <section key={tiempo.mono} className="obs-banda">
                <p className="obs-mono">{tiempo.mono}</p>
                <h2 className="obs-titulo">{tiempo.titulo}</h2>
                <div className="obs-prosa">
                  {tiempo.parrafos.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="obs-banda">
              <p className="obs-mono">{t.errores.mono}</p>
              <h2 className="obs-titulo">{t.errores.titulo}</h2>
              <div className="obs-prosa">
                <ul>
                  {t.errores.lista.map((e) => (
                    <li key={e.slice(0, 32)}>{e}</li>
                  ))}
                </ul>
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

            <section className="obs-banda">
              <p className="obs-mono">{t.cruce.mono}</p>
              <div className="obs-prosa">
                <p>
                  {t.cruce.antes}
                  <Link href={RUTAS[locale][t.cruce.a]}>{t.cruce.enlace}</Link>
                  {t.cruce.despues}
                </p>
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
