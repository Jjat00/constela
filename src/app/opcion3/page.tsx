import type { Metadata } from "next";
import Link from "next/link";
import { inter } from "@/app/opciones/fuentes";
import { MARCA, NO_HACE, PASOS, PREGUNTAS, VOCABULARIO } from "@/app/opciones/datos";
import { Conmutador } from "@/components/opciones/conmutador";
import { RedSVG } from "@/components/opciones/red-svg";

/*
 * OPCIÓN 3 · «Corriente» — la escuela Linear.
 *
 * TESIS: producto de software premium. Fondo casi negro con una malla violeta
 * detrás del titular, tipo pequeño y nítido, bordes de gradiente y filas de
 * característica alternadas. La sensación es «herramienta cara», no «app de
 * evento».
 * FORMA: nav flotante en píldora, hero centrado con resplandor radial, luego
 * filas alternadas texto/visual, rejilla de tarjetas de cristal y cierre con
 * degradado. La escala tipográfica es corta a propósito: casi todo el texto
 * vive entre 13 y 16px, y el titular hace todo el salto.
 * TIPO: Inter con tracking muy cerrado en display.
 * COSTE: el violeta devuelve a Constela al territorio del que huyó la v5
 * (chrome azul); a cambio, es la opción que mejor comunica «producto».
 */

export const metadata: Metadata = {
  title: "Opción 3 · Corriente — Constela",
  description: "Propuesta de rediseño: violeta, malla y cristal, escuela Linear.",
};

const CSS = `
body{background:#08090D}
.o3{--papel:#08090D;--sup:#0E0F14;--borde:rgba(255,255,255,.09);--tinta:#F7F8F8;--suave:#8A8F98;--tenue:#7A7F87;--violeta:#7C74F0;--azul:#6E9BFF;
  font-family:var(--f-inter),ui-sans-serif,system-ui,sans-serif;letter-spacing:normal;
  background:var(--papel);color:var(--tinta);min-height:100svh;overflow-x:clip;position:relative}
.o3 ::selection{background:rgba(124,116,240,.35)}
.o3 a:focus-visible,.o3 button:focus-visible{outline:2px solid var(--violeta);outline-offset:3px;border-radius:8px}
.o3-carril{width:100%;max-width:70rem;margin:0 auto;padding-inline:clamp(1.25rem,4vw,2rem)}

/* — la malla: el único color fuerte de la página — */
.o3-malla{position:absolute;inset-inline:0;top:0;height:46rem;pointer-events:none;overflow:hidden;z-index:0}
.o3-malla i{position:absolute;display:block;border-radius:50%;filter:blur(90px);opacity:.5}
.o3-malla i:nth-child(1){width:44rem;height:30rem;left:50%;top:-12rem;transform:translateX(-50%);background:radial-gradient(closest-side,rgba(124,116,240,.55),transparent)}
.o3-malla i:nth-child(2){width:30rem;height:24rem;left:8%;top:6rem;background:radial-gradient(closest-side,rgba(110,155,255,.35),transparent)}
.o3-malla i:nth-child(3){width:26rem;height:22rem;right:4%;top:2rem;background:radial-gradient(closest-side,rgba(240,105,159,.22),transparent)}

/* — nav flotante — */
.o3-nav{position:sticky;top:.75rem;z-index:30;margin-top:.75rem}
.o3-nav>div{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:3.25rem;padding:0 .5rem 0 1rem;border:1px solid var(--borde);border-radius:999px;background:rgba(14,15,20,.72);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
.o3-marca{font-size:.9375rem;font-weight:600;letter-spacing:-.02em;color:var(--tinta);text-decoration:none}
.o3-marca i{font-style:normal;color:var(--violeta)}
.o3-navlinks{display:none;gap:1.5rem}
.o3-navlinks a{font-size:.8125rem;color:var(--suave);text-decoration:none;transition:color .15s ease}
.o3-navlinks a:hover{color:var(--tinta)}
.o3-btn{display:inline-flex;align-items:center;justify-content:center;height:2.25rem;padding-inline:1rem;border-radius:999px;font-size:.8125rem;font-weight:500;text-decoration:none;color:#fff;background:linear-gradient(180deg,#8B84F5,#6A61E8);border:1px solid rgba(255,255,255,.14);box-shadow:0 1px 0 rgba(255,255,255,.18) inset;transition:filter .15s ease,transform .15s ease}
.o3-btn:hover{filter:brightness(1.12)}
.o3-btn:active{transform:translateY(1px)}
.o3-btn-lg{height:2.75rem;padding-inline:1.4rem;font-size:.9375rem}
.o3-btn-2{background:rgba(255,255,255,.06);border-color:var(--borde);color:var(--tinta)}
.o3-btn-2:hover{background:rgba(255,255,255,.1);filter:none}
@media (min-width:860px){.o3-navlinks{display:flex}}

/* — hero — */
.o3-hero{position:relative;z-index:10;text-align:center;padding-block:clamp(4rem,11vw,8rem) clamp(2rem,4vw,3rem);display:flex;flex-direction:column;align-items:center}
.o3-badge{display:inline-flex;align-items:center;gap:.5rem;height:1.85rem;padding-inline:.4rem .85rem;border:1px solid var(--borde);border-radius:999px;background:rgba(255,255,255,.04);font-size:.75rem;color:var(--suave)}
.o3-badge b{display:inline-flex;align-items:center;height:1.25rem;padding-inline:.5rem;border-radius:999px;background:rgba(124,116,240,.22);color:#C9C4FF;font-weight:500;font-size:.6875rem}
.o3-h1{margin:1.5rem 0 0;font-size:clamp(2.6rem,7.6vw,4.75rem);line-height:1.02;font-weight:600;letter-spacing:-.045em;max-width:15ch;overflow-wrap:anywhere;min-width:0}
.o3-h1 span{background:linear-gradient(100deg,#C9C4FF,#8FB6FF 55%,#F0A9C6);-webkit-background-clip:text;background-clip:text;color:transparent}
.o3-lede{margin:1.25rem 0 0;max-width:36rem;font-size:clamp(.9375rem,1.6vw,1.0625rem);line-height:1.62;color:var(--suave)}
.o3-acciones{display:flex;flex-wrap:wrap;justify-content:center;gap:.65rem;margin-top:2rem}

/* — el visual del hero — */
.o3-marco{position:relative;z-index:10;margin-top:clamp(2.5rem,6vw,4rem);border:1px solid var(--borde);border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.01));padding:.5rem;box-shadow:0 40px 90px -40px rgba(0,0,0,.9)}
.o3-lienzo{position:relative;aspect-ratio:16/9;border-radius:11px;overflow:hidden;background:radial-gradient(120% 120% at 50% 0%,#101220,#08090D);min-width:0}
.o3-lienzo svg{position:absolute;inset:0;width:100%;height:100%}

/* — filas alternadas — */
.o3-seccion{position:relative;z-index:10;padding-block:clamp(3.5rem,8vw,6rem)}
.o3-eyebrow{font-size:.75rem;font-weight:500;letter-spacing:.02em;color:var(--violeta);margin:0}
.o3-h2{margin:.75rem 0 0;font-size:clamp(1.6rem,3.6vw,2.4rem);line-height:1.1;font-weight:600;letter-spacing:-.035em;max-width:20ch;overflow-wrap:anywhere}
.o3-p{margin:.9rem 0 0;font-size:.9375rem;line-height:1.65;color:var(--suave);max-width:46ch}
.o3-fila{display:grid;grid-template-columns:1fr;gap:clamp(1.5rem,4vw,3rem);align-items:center;padding-block:clamp(1.5rem,3vw,2rem)}
@media (min-width:900px){
  .o3-fila{grid-template-columns:repeat(2,minmax(0,1fr))}
  .o3-fila.inv>div:first-child{order:2}
}
.o3-panel{border:1px solid var(--borde);border-radius:14px;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.015));padding:1.25rem;min-width:0}
.o3-pasos{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
.o3-pasos li{display:flex;gap:.85rem;align-items:flex-start;padding:.85rem;border:1px solid var(--borde);border-radius:10px;background:rgba(255,255,255,.02)}
.o3-pasos b{flex:none;width:1.6rem;height:1.6rem;display:grid;place-items:center;border-radius:7px;background:rgba(124,116,240,.2);color:#C9C4FF;font-size:.6875rem;font-weight:600}
.o3-pasos h3{margin:0 0 .2rem;font-size:.9375rem;font-weight:600;letter-spacing:-.015em}
.o3-pasos p{margin:0;font-size:.8125rem;line-height:1.55;color:var(--suave)}

/* — tarjetas de vocabulario — */
.o3-tarjetas{display:grid;grid-template-columns:1fr;gap:1rem;margin-top:2.5rem}
@media (min-width:720px){.o3-tarjetas{grid-template-columns:repeat(2,minmax(0,1fr))}}
.o3-tarjeta{border:1px solid var(--borde);border-radius:14px;padding:1.35rem;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.012));transition:border-color .18s ease,background-color .18s ease}
.o3-tarjeta:hover{border-color:rgba(124,116,240,.5)}
.o3-tarjeta h3{margin:0;font-size:1rem;font-weight:600;letter-spacing:-.02em}
.o3-tarjeta small{display:block;margin-top:.15rem;font-size:.75rem;color:var(--violeta)}
.o3-tarjeta p{margin:.7rem 0 0;font-size:.875rem;line-height:1.6;color:var(--suave)}

/* — negativo — */
.o3-no{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.5rem 0 0;padding:0;list-style:none}
.o3-no li{border:1px solid var(--borde);border-radius:999px;padding:.4rem .85rem;font-size:.8125rem;color:var(--suave);background:rgba(255,255,255,.03)}

/* — preguntas — */
.o3-faq{display:grid;gap:.75rem;margin-top:2.25rem}
.o3-faq>div{border:1px solid var(--borde);border-radius:12px;padding:1.1rem 1.25rem;background:rgba(255,255,255,.02)}
.o3-faq h3{margin:0 0 .4rem;font-size:.9375rem;font-weight:600;letter-spacing:-.015em}
.o3-faq p{margin:0;font-size:.875rem;line-height:1.6;color:var(--suave)}

/* — cierre y pie — */
.o3-cierre{position:relative;z-index:10;text-align:center;border:1px solid var(--borde);border-radius:18px;padding:clamp(2.25rem,6vw,4rem);background:radial-gradient(120% 140% at 50% 0%,rgba(124,116,240,.22),rgba(255,255,255,.02));display:flex;flex-direction:column;align-items:center}
.o3-pie{position:relative;z-index:10;border-top:1px solid var(--borde);margin-top:clamp(3rem,7vw,5rem)}
.o3-pie>div{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;padding-block:1.75rem 6rem}
.o3-pie p{margin:0;font-size:.8125rem;color:var(--tenue)}
.o3-pie nav{display:flex;gap:1.25rem}
.o3-pie a{font-size:.8125rem;color:var(--tenue);text-decoration:none}
.o3-pie a:hover{color:var(--tinta)}
`;

export default function Opcion3() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`o3 ${inter.variable}`}>
        <div className="o3-malla" aria-hidden>
          <i />
          <i />
          <i />
        </div>

        <div className="o3-carril">
          <nav className="o3-nav" aria-label="Principal">
            <div>
              <Link href="/opciones" className="o3-marca">
                {MARCA.wordmark}
                <i>✦</i>
              </Link>
              <div className="o3-navlinks">
                <a href="#como">Cómo funciona</a>
                <a href="#modelo">Modelo</a>
                <a href="#preguntas">Preguntas</a>
              </div>
              <Link href="/login" className="o3-btn">
                Entrar
              </Link>
            </div>
          </nav>

          <main>
            <section className="o3-hero">
              <p className="o3-badge">
                <b>Nuevo</b> Constela para cualquier evento presencial
              </p>
              <h1 className="o3-h1">
                Tu red es <span>tu universo</span>
              </h1>
              <p className="o3-lede">{MARCA.definicion}</p>
              <div className="o3-acciones">
                <Link href="/login" className="o3-btn o3-btn-lg">
                  Continuar con Google
                </Link>
                <a href="#como" className="o3-btn o3-btn-2 o3-btn-lg">
                  Cómo funciona
                </a>
              </div>
            </section>

            <div className="o3-marco">
              <div className="o3-lienzo">
                <RedSVG
                  n={34}
                  colores={["#9DB4FF", "#C9C4FF", "#E6ECFF", "#F0A9C6", "#8FB6FF"]}
                  colorSol="#FFFFFF"
                  colorLinea="#A7ACF5"
                  colorTriada="#7C74F0"
                  grosor={0.6}
                  opacidadLinea={0.42}
                  escala={0.8}
                />
              </div>
            </div>

            <section className="o3-seccion" id="como">
              <div className="o3-fila">
                <div>
                  <p className="o3-eyebrow">Cómo funciona</p>
                  <h2 className="o3-h2">Un escaneo te mete dentro y os conecta.</h2>
                  <p className="o3-p">
                    No hay puerta, ni lista de invitados, ni solicitud pendiente.
                    Abres el QR de quien tienes delante y ya estás en el evento,
                    conectado con esa persona.
                  </p>
                  <ul className="o3-no" aria-label="Lo que Constela no hace">
                    {NO_HACE.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="o3-panel">
                  <ul className="o3-pasos">
                    {PASOS.map((p) => (
                      <li key={p.n}>
                        <b>{p.n}</b>
                        <div>
                          <h3>{p.titulo}</h3>
                          <p>{p.texto}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="o3-fila inv">
                <div>
                  <p className="o3-eyebrow">La visión colectiva</p>
                  <h2 className="o3-h2">La constelación entera, no «tu red».</h2>
                  <p className="o3-p">
                    Cualquier asistente ve el grafo completo del evento: quién está,
                    quién se conoce con quién y qué triángulos se han cerrado. Esa
                    vista compartida es el producto.
                  </p>
                </div>
                <div className="o3-panel" style={{ padding: ".4rem" }}>
                  <div
                    className="o3-lienzo"
                    style={{ aspectRatio: "4 / 3", borderRadius: "10px" }}
                  >
                    <RedSVG
                      seed={7}
                      n={26}
                      colores={["#C9C4FF", "#9DB4FF", "#E6ECFF", "#F0A9C6", "#8FB6FF"]}
                      colorSol="#FFFFFF"
                      colorLinea="#A7ACF5"
                      colorTriada="#7C74F0"
                      grosor={0.7}
                      opacidadLinea={0.45}
                      escala={0.9}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="o3-seccion" id="modelo">
              <p className="o3-eyebrow">Modelo</p>
              <h2 className="o3-h2">Cada objeto del cielo significa algo.</h2>
              <div className="o3-tarjetas">
                {VOCABULARIO.map((v) => (
                  <article key={v.termino} className="o3-tarjeta">
                    <h3>{v.termino}</h3>
                    <small>{v.dominio}</small>
                    <p>{v.texto}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="o3-seccion" id="preguntas">
              <p className="o3-eyebrow">Preguntas</p>
              <h2 className="o3-h2">Lo que se pregunta todo el mundo.</h2>
              <div className="o3-faq">
                {PREGUNTAS.map((p) => (
                  <div key={p.q}>
                    <h3>{p.q}</h3>
                    <p>{p.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="o3-cierre">
              <h2 className="o3-h2" style={{ maxWidth: "16ch" }}>
                Entra por una estrella.
              </h2>
              <p className="o3-p" style={{ maxWidth: "34ch" }}>
                {MARCA.tagline}.
              </p>
              <div className="o3-acciones">
                <Link href="/login" className="o3-btn o3-btn-lg">
                  Continuar con Google
                </Link>
              </div>
            </section>
          </main>

          <footer className="o3-pie">
            <div>
              <p>© 2026 Constela · {MARCA.tagline}</p>
              <nav aria-label="Enlaces legales">
                <Link href="/privacidad">Privacidad</Link>
                <Link href="/terminos">Términos</Link>
              </nav>
            </div>
          </footer>
        </div>
      </div>
      <Conmutador n={3} />
    </>
  );
}
