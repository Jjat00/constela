import type { Metadata } from "next";
import Link from "next/link";
import { jetbrains } from "@/app/opciones/fuentes";
import { MARCA, NO_HACE, PASOS, PREGUNTAS, VOCABULARIO } from "@/app/opciones/datos";
import { Conmutador } from "@/components/opciones/conmutador";
import { RedSVG } from "@/components/opciones/red-svg";

/*
 * OPCIÓN 4 · «Telemetría» — futurista: consola de misión.
 *
 * TESIS: si el producto es un observatorio, la landing es su consola. Todo es
 * monoespaciado, todo está etiquetado y todo se lee como una lectura de
 * instrumento. El ámbar es luz de aviso, no decoración; el cian, dato frío.
 * FORMA: retícula técnica de fondo, marcos con esquinas marcadas, un panel
 * grande con la red y columnas de lecturas alrededor. Las secciones son
 * «módulos» numerados, no cards.
 * TIPO: JetBrains Mono y nada más — la monoespaciada ES el diseño, así que la
 * regla de emparejar dos familias no aplica.
 * COSTE: es la más lejana de la marca actual y la que peor envejece si el
 * producto crece más allá del nicho tecnológico. Deliberadamente extrema:
 * está aquí para marcar el borde del espacio de diseño.
 */

export const metadata: Metadata = {
  title: "Opción 4 · Telemetría — Constela",
  description: "Propuesta de rediseño: consola de misión, monoespaciada y ámbar.",
};

const CSS = `
body{background:#05070A}
.o4{--papel:#05070A;--sup:#0A0E14;--linea:rgba(125,200,255,.16);--tinta:#DCE6F0;--suave:#7E8B9B;--tenue:#78838F;--ambar:#FFB000;--cian:#6FE3FF;
  font-family:var(--f-jetbrains),ui-monospace,monospace;letter-spacing:normal;
  background:var(--papel);color:var(--tinta);min-height:100svh;overflow-x:clip;position:relative}
.o4::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;
  background-image:linear-gradient(var(--linea) 1px,transparent 1px),linear-gradient(90deg,var(--linea) 1px,transparent 1px);
  background-size:64px 64px;
  -webkit-mask-image:radial-gradient(120% 90% at 50% 0%,#000 10%,transparent 78%);
  mask-image:radial-gradient(120% 90% at 50% 0%,#000 10%,transparent 78%)}
.o4 ::selection{background:rgba(255,176,0,.3)}
.o4 a:focus-visible{outline:2px solid var(--ambar);outline-offset:3px}
.o4-carril{position:relative;z-index:10;width:100%;max-width:80rem;margin:0 auto;padding-inline:clamp(1rem,3vw,2rem)}
.o4-et{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--tenue)}
.o4-et b{color:var(--ambar);font-weight:500}

/* — barra de estado — */
.o4-barra{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:2.75rem;border-bottom:1px solid var(--linea)}
.o4-marca{display:flex;align-items:center;gap:.6rem;font-size:.875rem;font-weight:500;color:var(--tinta);text-decoration:none;letter-spacing:.02em}
.o4-punto{width:6px;height:6px;border-radius:50%;background:var(--ambar);box-shadow:0 0 10px var(--ambar);flex:none}
.o4-estado{display:none;gap:1.25rem}
.o4-entrar{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ambar);text-decoration:none;border:1px solid rgba(255,176,0,.45);padding:.45rem .8rem;transition:background-color .15s ease}
.o4-entrar:hover{background:rgba(255,176,0,.14)}
@media (min-width:900px){.o4-estado{display:flex}}

/* — marco técnico — */
.o4-marco{position:relative;border:1px solid var(--linea);background:linear-gradient(180deg,rgba(111,227,255,.035),transparent)}
.o4-marco::before,.o4-marco::after{content:"";position:absolute;width:9px;height:9px;border:1px solid var(--ambar);opacity:.85}
.o4-marco::before{top:-1px;left:-1px;border-right:0;border-bottom:0}
.o4-marco::after{bottom:-1px;right:-1px;border-left:0;border-top:0}

/* — hero — */
.o4-hero{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(1.5rem,4vw,2.5rem)}
.o4-hero-txt{padding:clamp(1.5rem,4vw,2.75rem)}
.o4-h1{margin:1.1rem 0 0;font-size:clamp(2rem,6.4vw,4rem);line-height:1.04;font-weight:700;letter-spacing:-.03em;text-transform:uppercase;overflow-wrap:anywhere;min-width:0}
.o4-h1 span{color:var(--ambar)}
.o4-lede{margin:1.25rem 0 0;max-width:46ch;font-size:.875rem;line-height:1.75;color:var(--suave)}
.o4-lede b{color:var(--tinta);font-weight:500}
.o4-acc{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;margin-top:1.75rem}
.o4-cta{display:inline-flex;align-items:center;height:2.9rem;padding-inline:1.4rem;background:var(--ambar);color:#0A0700;font-size:.8125rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;transition:filter .15s ease,transform .15s ease}
.o4-cta:hover{filter:brightness(1.12)}
.o4-cta:active{transform:translateY(1px)}
.o4-cta2{display:inline-flex;align-items:center;height:2.9rem;padding-inline:1.2rem;border:1px solid var(--linea);color:var(--tinta);font-size:.8125rem;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}
.o4-cta2:hover{border-color:var(--cian);color:var(--cian)}
.o4-visor{position:relative;border-top:1px solid var(--linea);min-height:18rem;aspect-ratio:1;min-width:0}
.o4-visor svg{position:absolute;inset:0;width:100%;height:100%}
.o4-visor-et{position:absolute;left:.9rem;top:.9rem;z-index:2}
@media (min-width:960px){
  .o4-hero{grid-template-columns:minmax(0,1fr) minmax(0,26rem)}
  .o4-visor{border-top:0;border-left:1px solid var(--linea);aspect-ratio:auto}
}

/* — lecturas — */
.o4-lecturas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-top:1px solid var(--linea)}
.o4-lectura{padding:1rem;border-right:1px solid var(--linea)}
.o4-lectura:last-child{border-right:0}
.o4-lectura strong{display:block;margin-top:.4rem;font-size:.8125rem;font-weight:500;color:var(--cian);letter-spacing:.02em}
@media (min-width:720px){.o4-lecturas{grid-template-columns:repeat(4,minmax(0,1fr))}}

/* — módulos — */
.o4-modulo{margin-top:clamp(2rem,5vw,3.5rem)}
.o4-cab{display:flex;align-items:baseline;gap:.85rem;padding-bottom:.6rem;border-bottom:1px solid var(--linea);flex-wrap:wrap}
.o4-h2{margin:0;font-size:clamp(1.15rem,2.4vw,1.5rem);font-weight:700;letter-spacing:-.01em;text-transform:uppercase}
.o4-grid3{display:grid;grid-template-columns:1fr;border-left:1px solid var(--linea);border-bottom:1px solid var(--linea)}
.o4-grid3>article{padding:1.35rem;border-right:1px solid var(--linea);border-top:1px solid var(--linea)}
.o4-grid3 h3{margin:.7rem 0 .45rem;font-size:.9375rem;font-weight:700;letter-spacing:.02em;color:var(--ambar)}
.o4-grid3 p{margin:0;font-size:.8125rem;line-height:1.7;color:var(--suave)}
@media (min-width:820px){.o4-grid3{grid-template-columns:repeat(3,minmax(0,1fr))}}

/* — tabla de vocabulario — */
.o4-tabla{width:100%;border-collapse:collapse;font-size:.8125rem;display:block;overflow-x:auto}
.o4-tabla thead th{text-align:left;padding:.7rem .9rem;border-bottom:1px solid var(--linea);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--tenue);font-weight:400;white-space:nowrap}
.o4-tabla td{padding:.9rem;border-bottom:1px solid var(--linea);vertical-align:top;line-height:1.65;color:var(--suave)}
.o4-tabla td:first-child{color:var(--cian);white-space:nowrap}
.o4-tabla td:nth-child(2){color:var(--tinta);white-space:nowrap}
.o4-tabla td:last-child{min-width:22rem}

/* — negativo — */
.o4-no{display:grid;grid-template-columns:1fr;gap:0;margin:0;padding:0;list-style:none;border-left:1px solid var(--linea)}
.o4-no li{padding:.85rem 1rem;border-right:1px solid var(--linea);border-top:1px solid var(--linea);font-size:.8125rem;color:var(--suave);display:flex;gap:.7rem;align-items:center}
.o4-no li::before{content:"✕";color:var(--ambar);font-size:.75rem}
.o4-no li:last-child{border-bottom:1px solid var(--linea)}
@media (min-width:720px){.o4-no{grid-template-columns:repeat(2,minmax(0,1fr))}.o4-no li:nth-last-child(-n+2){border-bottom:1px solid var(--linea)}}

/* — preguntas — */
.o4-faq{border-left:1px solid var(--linea);border-bottom:1px solid var(--linea)}
.o4-faq>div{padding:1.15rem 1.25rem;border-top:1px solid var(--linea);border-right:1px solid var(--linea)}
.o4-faq h3{margin:0 0 .45rem;font-size:.875rem;font-weight:700;letter-spacing:.01em;color:var(--tinta)}
.o4-faq p{margin:0;font-size:.8125rem;line-height:1.7;color:var(--suave);max-width:70ch}

/* — cierre y pie — */
.o4-cierre{margin-top:clamp(2rem,5vw,3.5rem);padding:clamp(1.75rem,5vw,3rem);text-align:center;display:flex;flex-direction:column;align-items:center;gap:1.1rem}
.o4-cierre h2{margin:0;font-size:clamp(1.5rem,4.5vw,2.75rem);line-height:1.05;font-weight:700;letter-spacing:-.02em;text-transform:uppercase;overflow-wrap:anywhere}
.o4-pie{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;margin-top:2rem;padding-block:1.1rem 6rem;border-top:1px solid var(--linea)}
.o4-pie nav{display:flex;gap:1.25rem}
.o4-pie a{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--tenue);text-decoration:none}
.o4-pie a:hover{color:var(--cian)}
`;

const LECTURAS = [
  { et: "Objeto", v: "Estrella = persona" },
  { et: "Arista", v: "Encuentro presencial" },
  { et: "Acceso", v: "Escaneo de QR" },
  { et: "Alcance", v: "Grafo completo" },
];

export default function Opcion4() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`o4 ${jetbrains.variable}`}>
        <div className="o4-carril">
          <header className="o4-barra">
            <Link href="/opciones" className="o4-marca">
              <span className="o4-punto" aria-hidden />
              CONSTELA
            </Link>
            <div className="o4-estado o4-et">
              <span>
                MODO <b>EVENTO PRESENCIAL</b>
              </span>
              <span>
                ACCESO <b>QR PERSONAL</b>
              </span>
              <span>
                VISTA <b>COLECTIVA</b>
              </span>
            </div>
            <Link href="/login" className="o4-entrar">
              Entrar
            </Link>
          </header>

          <main>
            <section className="o4-marco o4-hero">
              <div className="o4-hero-txt">
                <p className="o4-et">
                  [ 01 ] SISTEMA DE OBSERVACIÓN DE REDES · <b>EN VIVO</b>
                </p>
                <h1 className="o4-h1">
                  Tu red es
                  <br />
                  <span>tu universo</span>
                </h1>
                <p className="o4-lede">
                  <b>{MARCA.nombre} es el networking que por fin se ve.</b>{" "}
                  {MARCA.definicion}
                </p>
                <div className="o4-acc">
                  <Link href="/login" className="o4-cta">
                    Continuar con Google
                  </Link>
                  <a href="#modulo-2" className="o4-cta2">
                    Ver protocolo
                  </a>
                </div>
              </div>
              <div className="o4-visor">
                <span className="o4-visor-et o4-et">
                  [ VISOR ] CONSTELACIÓN · EVENTO DE EJEMPLO
                </span>
                <RedSVG
                  n={32}
                  colores={["#6FE3FF", "#9EEDFF", "#DCE6F0", "#FFB000", "#FFD27A"]}
                  colorSol="#FFB000"
                  colorLinea="#6FE3FF"
                  colorTriada="#FFB000"
                  grosor={0.5}
                  opacidadLinea={0.5}
                  halo={false}
                  nucleo={false}
                  escala={0.7}
                  preserveAspectRatio="xMidYMid meet"
                />
              </div>
            </section>

            <div className="o4-marco" style={{ borderTop: 0 }}>
              <div className="o4-lecturas" style={{ borderTop: 0 }}>
                {LECTURAS.map((l) => (
                  <div key={l.et} className="o4-lectura">
                    <span className="o4-et">{l.et}</span>
                    <strong>{l.v}</strong>
                  </div>
                ))}
              </div>
            </div>

            <section className="o4-modulo" id="modulo-2">
              <div className="o4-cab">
                <span className="o4-et">[ 02 ]</span>
                <h2 className="o4-h2">Protocolo de conexión</h2>
              </div>
              <div className="o4-grid3">
                {PASOS.map((p) => (
                  <article key={p.n}>
                    <span className="o4-et">PASO {p.n}</span>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="o4-modulo">
              <div className="o4-cab">
                <span className="o4-et">[ 03 ]</span>
                <h2 className="o4-h2">Diccionario del sistema</h2>
              </div>
              <table className="o4-tabla">
                <thead>
                  <tr>
                    <th scope="col">Objeto</th>
                    <th scope="col">Dominio</th>
                    <th scope="col">Definición</th>
                  </tr>
                </thead>
                <tbody>
                  {VOCABULARIO.map((v) => (
                    <tr key={v.termino}>
                      <td>{v.termino}</td>
                      <td>{v.dominio}</td>
                      <td>{v.texto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="o4-modulo">
              <div className="o4-cab">
                <span className="o4-et">[ 04 ]</span>
                <h2 className="o4-h2">Fuera de especificación</h2>
              </div>
              <ul className="o4-no">
                {NO_HACE.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>

            <section className="o4-modulo">
              <div className="o4-cab">
                <span className="o4-et">[ 05 ]</span>
                <h2 className="o4-h2">Consultas frecuentes</h2>
              </div>
              <div className="o4-faq">
                {PREGUNTAS.map((p) => (
                  <div key={p.q}>
                    <h3>{p.q}</h3>
                    <p>{p.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="o4-marco o4-cierre">
              <span className="o4-et">[ FIN DE TRANSMISIÓN ]</span>
              <h2>Entra por una estrella</h2>
              <Link href="/login" className="o4-cta">
                Continuar con Google
              </Link>
            </section>
          </main>

          <footer className="o4-pie">
            <span className="o4-et">© 2026 CONSTELA · {MARCA.tagline}</span>
            <nav aria-label="Enlaces legales">
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
            </nav>
          </footer>
        </div>
      </div>
      <Conmutador n={4} />
    </>
  );
}
