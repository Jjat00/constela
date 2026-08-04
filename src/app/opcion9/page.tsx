import type { Metadata } from "next";
import Link from "next/link";
import { manrope } from "@/app/opciones/fuentes";
import { MARCA, NO_HACE, PASOS, PREGUNTAS, VOCABULARIO } from "@/app/opciones/datos";
import { Conmutador } from "@/components/opciones/conmutador";
import { RedSVG } from "@/components/opciones/red-svg";

/*
 * OPCIÓN 9 · «Cristal» — spatial, escuela Vision Pro.
 *
 * TESIS: llevar el glassmorphism de la app al extremo y hacerlo la landing
 * entera. Nada se apoya en el fondo: todo flota en placas de vidrio con radios
 * enormes, blur alto y luz ambiental de detrás. La jerarquía la da la
 * profundidad, no el tamaño del tipo.
 * FORMA: bento de placas de vidrio con vanos desiguales — la red ocupa la
 * placa grande, los pasos una columna alta, el vocabulario dos placas medianas
 * y lo descartado una fila baja de píldoras. Nav en chip flotante.
 * TIPO: Manrope en pesos ligeros (300/400) incluso en display: la ligereza es
 * parte del material.
 * COSTE: el vidrio es caro de pintar y frágil en móviles antiguos; y si el
 * fondo pierde luz, todo el sistema se apaga a la vez.
 */

export const metadata: Metadata = {
  title: "Opción 9 · Cristal — Constela",
  description: "Propuesta de rediseño: vidrio, profundidad y bento espacial.",
};

const CSS = `
body{background:#060A16}
.o9{--vacio:#060A16;--tinta:#EEF3FF;--suave:#A6B2CC;--tenue:#75819B;--hielo:#A8D8FF;--lila:#B9B4FF;--oro:#FFD97A;--borde:rgba(255,255,255,.14);
  font-family:var(--f-manrope),ui-sans-serif,system-ui,sans-serif;letter-spacing:-.015em;
  background:var(--vacio);color:var(--tinta);min-height:100svh;overflow-x:clip;position:relative}
.o9 ::selection{background:rgba(168,216,255,.3)}
.o9 a:focus-visible{outline:2px solid var(--hielo);outline-offset:3px;border-radius:14px}
.o9-carril{position:relative;z-index:10;width:100%;max-width:78rem;margin:0 auto;padding-inline:clamp(1rem,3.5vw,2rem)}

/* — luz ambiental: lo único que ilumina el vidrio — */
.o9-luz{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.o9-luz i{position:absolute;display:block;border-radius:50%;filter:blur(110px)}
.o9-luz i:nth-child(1){width:52rem;height:36rem;left:-8rem;top:-10rem;background:radial-gradient(closest-side,rgba(80,130,255,.32),transparent)}
.o9-luz i:nth-child(2){width:40rem;height:32rem;right:-6rem;top:14rem;background:radial-gradient(closest-side,rgba(185,180,255,.24),transparent)}
.o9-luz i:nth-child(3){width:36rem;height:28rem;left:30%;bottom:-8rem;background:radial-gradient(closest-side,rgba(255,217,122,.14),transparent)}

/* — vidrio — */
.o9-vidrio{border:1px solid var(--borde);border-radius:28px;background:linear-gradient(160deg,rgba(255,255,255,.11),rgba(255,255,255,.035));backdrop-filter:blur(28px) saturate(140%);-webkit-backdrop-filter:blur(28px) saturate(140%);box-shadow:0 30px 70px -34px rgba(0,0,0,.85),inset 0 1px 0 rgba(255,255,255,.16)}

/* — chip flotante — */
.o9-nav{position:sticky;top:.85rem;z-index:40;display:flex;justify-content:center;margin-top:.85rem}
.o9-nav>div{display:flex;align-items:center;gap:.4rem;padding:.4rem .4rem .4rem 1.1rem;border-radius:999px}
.o9-marca{font-size:.9375rem;font-weight:600;color:var(--tinta);text-decoration:none;letter-spacing:-.02em}
.o9-marca i{font-style:normal;color:var(--oro)}
.o9-sep{width:1px;height:1.1rem;background:var(--borde);margin-inline:.5rem}
.o9-navlink{display:none;font-size:.8125rem;color:var(--suave);text-decoration:none;padding:.4rem .6rem;border-radius:999px}
.o9-navlink:hover{color:var(--tinta);background:rgba(255,255,255,.1)}
.o9-btn{display:inline-flex;align-items:center;justify-content:center;height:2.15rem;padding-inline:1rem;border-radius:999px;border:1px solid rgba(168,216,255,.4);background:rgba(168,216,255,.18);color:var(--tinta);font-size:.8125rem;font-weight:600;text-decoration:none;transition:background-color .2s ease,transform .2s ease}
.o9-btn:hover{background:rgba(168,216,255,.3)}
.o9-btn:active{transform:scale(.985)}
.o9-btn-lg{height:3.3rem;padding-inline:1.9rem;font-size:1rem}
.o9-btn-2{background:rgba(255,255,255,.08);border-color:var(--borde)}
.o9-btn-2:hover{background:rgba(255,255,255,.14)}
@media (min-width:760px){.o9-navlink{display:inline-flex}}

/* — hero — */
.o9-hero{text-align:center;padding-block:clamp(3.5rem,10vw,7rem) clamp(2rem,4vw,3rem);display:flex;flex-direction:column;align-items:center;gap:1.4rem}
.o9-h1{margin:0;font-size:clamp(2.6rem,8vw,5.5rem);line-height:1.02;font-weight:300;letter-spacing:-.04em;max-width:15ch;overflow-wrap:anywhere;min-width:0}
.o9-h1 b{font-weight:600;color:var(--hielo)}
.o9-lede{margin:0;max-width:42ch;font-size:clamp(1rem,1.8vw,1.1875rem);line-height:1.6;font-weight:400;color:var(--suave)}
.o9-acc{display:flex;flex-wrap:wrap;justify-content:center;gap:.7rem}

/* — bento — */
.o9-bento{display:grid;grid-template-columns:1fr;gap:1rem;padding-bottom:clamp(2rem,5vw,3.5rem)}
.o9-placa{padding:clamp(1.25rem,3vw,1.9rem);min-width:0}
.o9-placa h3{margin:0 0 .5rem;font-size:1.125rem;font-weight:600;letter-spacing:-.025em}
.o9-placa p{margin:0;font-size:.9375rem;line-height:1.62;color:var(--suave)}
.o9-et{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--tenue);font-weight:500}
.o9-lienzo{position:relative;aspect-ratio:16/10;border-radius:20px;overflow:hidden;background:radial-gradient(120% 120% at 50% 20%,rgba(12,20,42,.9),rgba(6,10,22,.95));border:1px solid rgba(255,255,255,.08);min-width:0}
.o9-lienzo svg{position:absolute;inset:0;width:100%;height:100%}
.o9-pasos{margin:0;padding:0;list-style:none;display:grid;gap:.9rem}
.o9-pasos li{display:flex;gap:.9rem;align-items:flex-start}
.o9-pasos b{flex:none;width:1.9rem;height:1.9rem;border-radius:999px;display:grid;place-items:center;background:rgba(168,216,255,.16);border:1px solid rgba(168,216,255,.3);color:var(--hielo);font-size:.6875rem;font-weight:700}
.o9-pasos h4{margin:0 0 .2rem;font-size:.9375rem;font-weight:600;letter-spacing:-.02em}
.o9-pasos p{margin:0;font-size:.8125rem;line-height:1.55;color:var(--suave)}
.o9-no{display:flex;flex-wrap:wrap;gap:.5rem;margin:.9rem 0 0;padding:0;list-style:none}
.o9-no li{border:1px solid var(--borde);border-radius:999px;padding:.42rem .9rem;font-size:.8125rem;color:var(--suave);background:rgba(255,255,255,.06)}
@media (min-width:900px){
  .o9-bento{grid-template-columns:repeat(6,minmax(0,1fr));grid-auto-flow:dense}
  .o9-p-red{grid-column:span 4}
  .o9-p-pasos{grid-column:span 2}
  .o9-p-voc{grid-column:span 3}
  .o9-p-no{grid-column:span 6}
}

/* — preguntas — */
.o9-seccion{padding-bottom:clamp(2.5rem,6vw,4rem)}
.o9-h2{margin:0 0 1.25rem;font-size:clamp(1.6rem,3.6vw,2.4rem);line-height:1.1;font-weight:300;letter-spacing:-.035em;max-width:20ch;overflow-wrap:anywhere}
.o9-h2 b{font-weight:600;color:var(--hielo)}
.o9-faq{padding:clamp(.5rem,2vw,1rem)}
.o9-faq>div{padding:1.15rem clamp(.75rem,2vw,1rem);border-bottom:1px solid rgba(255,255,255,.09)}
.o9-faq>div:last-child{border-bottom:0}
.o9-faq h3{margin:0 0 .4rem;font-size:1rem;font-weight:600;letter-spacing:-.02em}
.o9-faq p{margin:0;font-size:.9375rem;line-height:1.62;color:var(--suave);max-width:64ch}

/* — cierre y pie — */
.o9-cierre{text-align:center;padding:clamp(2.25rem,6vw,4rem);display:flex;flex-direction:column;align-items:center;gap:1.2rem}
.o9-pie{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;padding-block:2rem 6rem}
.o9-pie p{margin:0;font-size:.8125rem;color:var(--tenue)}
.o9-pie nav{display:flex;gap:1.25rem}
.o9-pie a{font-size:.8125rem;color:var(--tenue);text-decoration:none}
.o9-pie a:hover{color:var(--hielo)}
`;

export default function Opcion9() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`o9 ${manrope.variable}`}>
        <div className="o9-luz" aria-hidden>
          <i />
          <i />
          <i />
        </div>

        <div className="o9-carril">
          <nav className="o9-nav" aria-label="Principal">
            <div className="o9-vidrio">
              <Link href="/opciones" className="o9-marca">
                {MARCA.wordmark}
                <i>✦</i>
              </Link>
              <span className="o9-sep" aria-hidden />
              <a href="#bento" className="o9-navlink">
                Cómo funciona
              </a>
              <a href="#preguntas" className="o9-navlink">
                Preguntas
              </a>
              <Link href="/login" className="o9-btn">
                Entrar
              </Link>
            </div>
          </nav>

          <main>
            <section className="o9-hero">
              <p className="o9-et">Constela · para cualquier evento presencial</p>
              <h1 className="o9-h1">
                Tu red es <b>tu universo.</b>
              </h1>
              <p className="o9-lede">{MARCA.definicion}</p>
              <div className="o9-acc">
                <Link href="/login" className="o9-btn o9-btn-lg">
                  Continuar con Google
                </Link>
                <a href="#bento" className="o9-btn o9-btn-2 o9-btn-lg">
                  Ver la constelación
                </a>
              </div>
            </section>

            <div className="o9-bento" id="bento">
              <section className="o9-vidrio o9-placa o9-p-red">
                <p className="o9-et">La constelación del evento</p>
                <h3 style={{ marginTop: ".5rem" }}>
                  El grafo completo, visible para todos.
                </h3>
                <p style={{ marginBottom: "1.1rem", maxWidth: "48ch" }}>
                  No es «tu red hasta segundo grado»: cualquier asistente ve quién
                  está y quién se conoce con quién.
                </p>
                <div className="o9-lienzo">
                  <RedSVG
                    n={34}
                    colores={["#A8D8FF", "#B9B4FF", "#EEF3FF", "#CFE6FF", "#9BC4FF"]}
                    colorSol="#FFD97A"
                    colorLinea="#CFE0FF"
                    colorTriada="#B9B4FF"
                    grosor={0.6}
                    opacidadLinea={0.4}
                    escala={0.85}
                  />
                </div>
              </section>

              <section className="o9-vidrio o9-placa o9-p-pasos">
                <p className="o9-et">Tres gestos</p>
                <h3 style={{ marginTop: ".5rem", marginBottom: "1.1rem" }}>
                  Ninguno se hace desde casa.
                </h3>
                <ul className="o9-pasos">
                  {PASOS.map((p) => (
                    <li key={p.n}>
                      <b>{p.n}</b>
                      <div>
                        <h4>{p.titulo}</h4>
                        <p>{p.texto}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {VOCABULARIO.map((v) => (
                <section key={v.termino} className="o9-vidrio o9-placa o9-p-voc">
                  <p className="o9-et">{v.dominio}</p>
                  <h3 style={{ marginTop: ".5rem" }}>{v.termino}</h3>
                  <p>{v.texto}</p>
                </section>
              ))}

              <section className="o9-vidrio o9-placa o9-p-no">
                <p className="o9-et">Lo que aquí no existe</p>
                <ul className="o9-no">
                  {NO_HACE.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="o9-seccion" id="preguntas">
              <h2 className="o9-h2">
                Lo que se pregunta <b>todo el mundo.</b>
              </h2>
              <div className="o9-vidrio o9-faq">
                {PREGUNTAS.map((p) => (
                  <div key={p.q}>
                    <h3>{p.q}</h3>
                    <p>{p.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="o9-vidrio o9-cierre">
              <p className="o9-et">{MARCA.tagline}</p>
              <h2 className="o9-h2" style={{ margin: 0 }}>
                Entra por <b>una estrella.</b>
              </h2>
              <Link href="/login" className="o9-btn o9-btn-lg">
                Continuar con Google
              </Link>
            </section>
          </main>

          <footer className="o9-pie">
            <p>© 2026 Constela · {MARCA.tagline}</p>
            <nav aria-label="Enlaces legales">
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
            </nav>
          </footer>
        </div>
      </div>
      <Conmutador n={9} />
    </>
  );
}
