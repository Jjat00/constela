import type { Metadata } from "next";
import Link from "next/link";
import { MARCA, NO_HACE, PASOS, PREGUNTAS, VOCABULARIO } from "@/app/opciones/datos";
import { Conmutador } from "@/components/opciones/conmutador";
import { RedSVG } from "@/components/opciones/red-svg";

/*
 * OPCIÓN 8 · «Secuencia» — cinematográfica.
 *
 * TESIS: es la única que NO cambia la marca. Conserva la paleta v5, DM Sans y
 * Geist Mono, y cambia solo la estructura: la landing deja de ser una página
 * con secciones y pasa a ser una película corta —escenas numeradas, cartelas
 * de título centradas, letterbox 2.39:1 y créditos al final—. Es la propuesta
 * de menor riesgo de marca y mayor riesgo de ritmo.
 * FORMA: cada bloque es un fotograma con barras negras arriba y abajo; el
 * texto vive en cartelas centradas entre fotogramas, nunca encima de ellos.
 * TIPO: DM Sans (heredada del layout raíz) + Geist Mono para los pies de
 * escena. Cero fuentes nuevas: esta opción no cuesta un byte de tipografía.
 * COSTE: leer requiere scrollear, y el contenido denso (glosario, preguntas)
 * se resiste al formato de cartela.
 */

export const metadata: Metadata = {
  title: "Opción 8 · Secuencia — Constela",
  description: "Propuesta de rediseño: escenas, letterbox y cartelas de título.",
};

const CSS = `
body{background:#02030A}
.o8{--vacio:#02030A;--cielo:#070A14;--tinta:#F8FAFF;--suave:#AAB2C8;--tenue:#79839C;--oro:#FFD97A;--celeste:#9DC8FF;--halfa:#F0699F;--borde:rgba(255,255,255,.1);
  font-family:var(--font-dm-sans),ui-sans-serif,system-ui,sans-serif;letter-spacing:-.02em;
  background:var(--vacio);color:var(--tinta);min-height:100svh;overflow-x:clip}
.o8 ::selection{background:rgba(157,200,255,.28)}
.o8 a:focus-visible{outline:2px solid var(--celeste);outline-offset:3px;border-radius:4px}
.o8-carril{width:100%;max-width:74rem;margin:0 auto;padding-inline:clamp(1.25rem,4vw,2.5rem)}
.o8-mono{font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--tenue)}
.o8-mono b{color:var(--celeste);font-weight:400}

/* — chrome de cabina — */
.o8-top{position:sticky;top:0;z-index:30;background:rgba(2,3,10,.8);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--borde)}
.o8-top>div{height:3.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.o8-marca{font-size:1rem;font-weight:600;letter-spacing:-.045em;color:var(--tinta);text-decoration:none}
.o8-marca i{font-style:normal;color:var(--oro)}
.o8-entrar{display:inline-flex;align-items:center;height:2.1rem;padding-inline:.95rem;border-radius:999px;border:1px solid rgba(78,168,255,.7);background:rgba(78,168,255,.14);color:var(--tinta);font-size:.8125rem;font-weight:500;text-decoration:none;transition:background-color .2s ease}
.o8-entrar:hover{background:rgba(78,168,255,.26)}

/* — fotograma con letterbox — */
.o8-frame{position:relative;background:#000;border-block:1px solid var(--borde)}
.o8-frame-in{position:relative;aspect-ratio:16/9;overflow:hidden;background:radial-gradient(130% 120% at 50% 30%,#0C1122,#02030A 70%);min-width:0}
.o8-frame-in svg{position:absolute;inset:0;width:100%;height:100%}
.o8-frame::before,.o8-frame::after{content:"";position:absolute;left:0;right:0;height:clamp(1.1rem,3.2vw,2.2rem);background:#000;z-index:2;pointer-events:none}
.o8-frame::before{top:0}
.o8-frame::after{bottom:0}
.o8-slate{position:absolute;z-index:3;left:clamp(1rem,3vw,2rem);bottom:clamp(1.6rem,4.4vw,3rem);display:flex;gap:1rem;flex-wrap:wrap}
@media (min-width:900px){.o8-frame-in{aspect-ratio:2.39/1}}

/* — cartela — */
.o8-cartela{text-align:center;padding-block:clamp(3rem,8vw,6rem);display:flex;flex-direction:column;align-items:center;gap:1.1rem}
.o8-h1{margin:0;font-size:clamp(2.6rem,9vw,6rem);line-height:.96;font-weight:500;letter-spacing:-.055em;max-width:14ch;overflow-wrap:anywhere;min-width:0}
.o8-h1 span{color:var(--celeste)}
.o8-h2{margin:0;font-size:clamp(1.8rem,5vw,3.4rem);line-height:1;font-weight:500;letter-spacing:-.05em;max-width:18ch;overflow-wrap:anywhere}
.o8-h2 span{color:var(--celeste)}
.o8-lede{margin:0;max-width:44ch;font-size:clamp(.9375rem,1.7vw,1.0625rem);line-height:1.62;color:var(--suave)}
.o8-lede b{color:var(--tinta);font-weight:500}
.o8-hairline{width:3.5rem;height:1px;background:linear-gradient(90deg,transparent,var(--celeste),transparent)}
.o8-cta{display:inline-flex;align-items:center;height:3.35rem;padding-inline:1.85rem;border-radius:999px;border:1px solid rgba(78,168,255,.75);background:rgba(78,168,255,.14);color:var(--tinta);font-size:1rem;font-weight:500;text-decoration:none;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:background-color .2s ease}
.o8-cta:hover{background:rgba(78,168,255,.26)}

/* — escenas de texto — */
.o8-escena{padding-block:clamp(3rem,7vw,5rem)}
.o8-cab{display:flex;flex-direction:column;align-items:center;gap:.9rem;text-align:center}
.o8-tomas{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(2rem,4vw,3rem);border-top:1px solid var(--borde)}
.o8-toma{padding:1.6rem 0;border-bottom:1px solid var(--borde)}
.o8-toma h3{margin:.7rem 0 .5rem;font-size:1.125rem;font-weight:600;letter-spacing:-.04em}
.o8-toma p{margin:0;font-size:.9375rem;line-height:1.65;color:var(--suave);max-width:40ch}
@media (min-width:880px){
  .o8-tomas{grid-template-columns:repeat(3,minmax(0,1fr))}
  .o8-toma{padding:1.8rem 1.6rem 1.8rem 0;border-right:1px solid var(--borde)}
  .o8-toma:last-child{border-right:0}
  .o8-toma+.o8-toma{padding-left:1.6rem}
}

/* — reparto (vocabulario) — */
.o8-reparto{margin-top:clamp(2rem,4vw,3rem);display:grid;gap:0;border-top:1px solid var(--borde)}
.o8-reparto>div{padding:1.35rem 0;border-bottom:1px solid var(--borde);display:grid;gap:.4rem}
.o8-reparto dt{font-size:1.0625rem;font-weight:600;letter-spacing:-.04em}
.o8-reparto dd{margin:0;font-size:.9375rem;line-height:1.62;color:var(--suave);max-width:58ch}
.o8-reparto .o8-mono{color:var(--oro)}
@media (min-width:880px){.o8-reparto>div{grid-template-columns:12rem 13rem minmax(0,1fr);gap:1.75rem;align-items:baseline}}

/* — descartes — */
.o8-no{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;margin:1.5rem 0 0;padding:0;list-style:none}
.o8-no li{border:1px solid var(--borde);border-radius:999px;padding:.45rem .9rem;font-size:.8125rem;color:var(--suave);background:rgba(255,255,255,.04)}

/* — preguntas — */
.o8-faq{margin-top:clamp(2rem,4vw,3rem);display:grid;gap:0;border-top:1px solid var(--borde)}
.o8-faq>div{padding:1.35rem 0;border-bottom:1px solid var(--borde)}
.o8-faq h3{margin:0 0 .45rem;font-size:1rem;font-weight:600;letter-spacing:-.04em}
.o8-faq p{margin:0;font-size:.9375rem;line-height:1.65;color:var(--suave);max-width:62ch}
@media (min-width:880px){.o8-faq>div{display:grid;grid-template-columns:25rem minmax(0,1fr);gap:2rem;align-items:baseline}}

/* — créditos — */
.o8-creditos{text-align:center;padding-block:clamp(3rem,7vw,5rem) 6rem;border-top:1px solid var(--borde);display:flex;flex-direction:column;align-items:center;gap:.9rem}
.o8-creditos nav{display:flex;gap:1.5rem;margin-top:.5rem}
.o8-creditos a{font-size:.8125rem;color:var(--tenue);text-decoration:none}
.o8-creditos a:hover{color:var(--celeste)}
`;

const ESCENAS = [
  { n: "ESC. 02", t: "El gesto" },
  { n: "ESC. 03", t: "El reparto" },
  { n: "ESC. 04", t: "La sala" },
];

export default function Opcion8() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="o8">
        <header className="o8-top">
          <div className="o8-carril">
            <Link href="/opciones" className="o8-marca">
              {MARCA.wordmark}
              <i>✦</i>
            </Link>
            <span className="o8-mono">
              ESC. 01 · <b>Tu red es tu universo</b>
            </span>
            <Link href="/login" className="o8-entrar">
              Entrar
            </Link>
          </div>
        </header>

        <main>
          <div className="o8-carril">
            <section className="o8-cartela">
              <p className="o8-mono">Constela · para cualquier evento presencial</p>
              <h1 className="o8-h1">
                Tu red es <span>tu universo.</span>
              </h1>
              <div className="o8-hairline" aria-hidden />
              <p className="o8-lede">
                <b>{MARCA.nombre} es el networking que por fin se ve.</b>{" "}
                {MARCA.definicion}
              </p>
              <Link href="/login" className="o8-cta">
                Continuar con Google
              </Link>
              <p className="o8-mono">8 segundos</p>
            </section>
          </div>

          <figure className="o8-frame" style={{ margin: 0 }}>
            <div className="o8-frame-in">
              <RedSVG
                n={36}
                escala={0.9}
                preserveAspectRatio="xMidYMid slice"
              />
            </div>
            <figcaption className="o8-slate">
              <span className="o8-mono">ESC. 01 — La constelación</span>
              <span className="o8-mono">
                Oro: <b>tú</b> · Rosa: cierres triádicos
              </span>
            </figcaption>
          </figure>

          <div className="o8-carril">
            <section className="o8-escena">
              <div className="o8-cab">
                <p className="o8-mono">{ESCENAS[0].n} — {ESCENAS[0].t}</p>
                <h2 className="o8-h2">
                  Un escaneo, y estás <span>dentro y conectado.</span>
                </h2>
                <p className="o8-lede">
                  Ninguno de los tres gestos se puede hacer desde casa: una arista
                  significa que os visteis la cara.
                </p>
              </div>
              <div className="o8-tomas">
                {PASOS.map((p) => (
                  <article key={p.n} className="o8-toma">
                    <span className="o8-mono">TOMA {p.n}</span>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </article>
                ))}
              </div>
              <ul className="o8-no" aria-label="Lo que Constela no hace">
                {NO_HACE.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          </div>

          <figure className="o8-frame" style={{ margin: 0 }}>
            <div className="o8-frame-in">
              <RedSVG
                seed={5}
                n={22}
                colorLinea="#F0699F"
                colorTriada="#F0699F"
                grosor={0.8}
                opacidadLinea={0.5}
                escala={1.15}
              />
            </div>
            <figcaption className="o8-slate">
              <span className="o8-mono">ESC. 02 — El cierre triádico</span>
              <span className="o8-mono">Tres personas que se conocen entre sí</span>
            </figcaption>
          </figure>

          <div className="o8-carril">
            <section className="o8-escena">
              <div className="o8-cab">
                <p className="o8-mono">{ESCENAS[1].n} — {ESCENAS[1].t}</p>
                <h2 className="o8-h2">
                  Cada objeto del cielo <span>significa algo.</span>
                </h2>
              </div>
              <dl className="o8-reparto">
                {VOCABULARIO.map((v) => (
                  <div key={v.termino}>
                    <dt>{v.termino}</dt>
                    <dd className="o8-mono">{v.dominio}</dd>
                    <dd>{v.texto}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="o8-escena">
              <div className="o8-cab">
                <p className="o8-mono">{ESCENAS[2].n} — {ESCENAS[2].t}</p>
                <h2 className="o8-h2">Lo que se pregunta todo el mundo.</h2>
              </div>
              <div className="o8-faq">
                {PREGUNTAS.map((p) => (
                  <div key={p.q}>
                    <h3>{p.q}</h3>
                    <p>{p.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="o8-cartela">
              <p className="o8-mono">Escena final</p>
              <h2 className="o8-h2">
                Entra por <span>una estrella.</span>
              </h2>
              <Link href="/login" className="o8-cta">
                Continuar con Google
              </Link>
            </section>

            <footer className="o8-creditos">
              <p className="o8-mono">{MARCA.tagline}</p>
              <p className="o8-mono">© 2026 Constela</p>
              <nav aria-label="Enlaces legales">
                <Link href="/privacidad">Privacidad</Link>
                <Link href="/terminos">Términos</Link>
              </nav>
            </footer>
          </div>
        </main>
      </div>
      <Conmutador n={8} />
    </>
  );
}
