import type { Metadata } from "next";
import Link from "next/link";
import { anton, spaceMono } from "@/app/opciones/fuentes";
import { MARCA, NO_HACE, PASOS, PREGUNTAS, VOCABULARIO } from "@/app/opciones/datos";
import { Conmutador } from "@/components/opciones/conmutador";
import { RedSVG } from "@/components/opciones/red-svg";

/*
 * OPCIÓN 7 · «Cartel» — brutalista de póster.
 *
 * TESIS: el evento es ruido, luz mala y gente de pie. Un cartel grita mejor
 * que un observatorio. Tipografía condensada a tamaño de valla, amarillo
 * eléctrico, bordes de 3px y bloques que se invierten sin transición.
 * FORMA: losas a sangre que alternan negro y amarillo; el titular ocupa la
 * pantalla; los pasos son números enormes; el vocabulario es una tabla con
 * filetes gruesos. Nada redondeado, ninguna sombra, ningún degradado.
 * TIPO: Anton (display, versalitas) + Space Mono (datos y etiquetas).
 * COSTE: es la menos «premium» y la que peor sostiene texto largo. A cambio
 * es la única legible de lejos y de reojo — que es exactamente cómo se mira
 * un teléfono ajeno en medio de un evento.
 */

export const metadata: Metadata = {
  title: "Opción 7 · Cartel — Constela",
  description: "Propuesta de rediseño: brutalismo de póster, amarillo eléctrico.",
};

const CSS = `
body{background:#0D0D0D}
.o7{--negro:#0D0D0D;--hueso:#F5F5F0;--amarillo:#E8FF4D;--gris:#9A9A93;
  font-family:var(--f-space-mono),ui-monospace,monospace;letter-spacing:normal;
  background:var(--negro);color:var(--hueso);min-height:100svh;overflow-x:clip}
.o7 ::selection{background:var(--amarillo);color:var(--negro)}
.o7 a:focus-visible{outline:3px solid var(--amarillo);outline-offset:2px}
.o7-carril{width:100%;max-width:84rem;margin:0 auto;padding-inline:clamp(1rem,3.5vw,2rem)}
.o7-display{font-family:var(--f-anton),Impact,sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:.005em;line-height:.86;overflow-wrap:anywhere;min-width:0}
.o7-et{font-size:11px;letter-spacing:.2em;text-transform:uppercase}

/* — barra — */
.o7-barra{border-bottom:3px solid var(--hueso);display:flex;align-items:stretch;justify-content:space-between;gap:0}
.o7-marca{font-family:var(--f-anton),Impact,sans-serif;text-transform:uppercase;font-size:clamp(1.25rem,3vw,1.75rem);line-height:1;color:var(--hueso);text-decoration:none;display:flex;align-items:center;padding:.9rem clamp(1rem,3.5vw,2rem)}
.o7-marca:hover{color:var(--amarillo)}
.o7-barra-mid{display:none;align-items:center;padding-inline:1.25rem;border-left:3px solid var(--hueso);color:var(--gris)}
.o7-entrar{display:flex;align-items:center;padding:.9rem clamp(1rem,3.5vw,2rem);border-left:3px solid var(--hueso);background:var(--amarillo);color:var(--negro);font-weight:700;font-size:.8125rem;letter-spacing:.14em;text-transform:uppercase;text-decoration:none}
.o7-entrar:hover{background:var(--hueso)}
@media (min-width:900px){.o7-barra-mid{display:flex}}

/* — hero — */
.o7-hero{padding-block:clamp(2rem,6vw,4rem) clamp(2rem,5vw,3rem)}
.o7-h1{margin:0;font-size:clamp(3.2rem,15.5vw,12rem)}
.o7-h1 mark{background:var(--amarillo);color:var(--negro);padding:0 .1em;display:inline-block}
.o7-hero-bajo{display:grid;grid-template-columns:1fr;gap:1.5rem;margin-top:clamp(1.5rem,4vw,2.5rem);align-items:end}
.o7-lede{margin:0;font-size:clamp(1rem,1.8vw,1.1875rem);line-height:1.55;max-width:42ch;color:var(--hueso)}
.o7-lede b{background:var(--amarillo);color:var(--negro);font-weight:700}
.o7-cta{display:inline-flex;align-items:center;justify-content:center;padding:1.1rem 2rem;background:var(--amarillo);color:var(--negro);border:3px solid var(--amarillo);font-family:var(--f-anton),Impact,sans-serif;text-transform:uppercase;font-size:clamp(1.1rem,2.4vw,1.5rem);line-height:1;letter-spacing:.02em;text-decoration:none;transition:background-color .12s linear,color .12s linear}
.o7-cta:hover{background:var(--negro);color:var(--amarillo)}
.o7-cta2{background:transparent;color:var(--hueso);border-color:var(--hueso)}
.o7-cta2:hover{background:var(--hueso);color:var(--negro)}
.o7-acc{display:flex;flex-wrap:wrap;gap:.75rem}
@media (min-width:900px){.o7-hero-bajo{grid-template-columns:1.2fr auto}}

/* — losa — */
.o7-losa{border-top:3px solid var(--hueso);padding-block:clamp(2.5rem,6vw,4rem)}
.o7-losa-amarilla{background:var(--amarillo);color:var(--negro);border-top:3px solid var(--negro)}
.o7-losa-amarilla .o7-et,.o7-losa-amarilla .o7-p{color:var(--negro)}
.o7-h2{margin:.9rem 0 0;font-size:clamp(2rem,7vw,5rem)}
.o7-p{margin:1rem 0 0;font-size:.9375rem;line-height:1.65;color:var(--gris);max-width:52ch}

/* — pasos — */
.o7-pasos{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(1.75rem,4vw,2.5rem);border-top:3px solid var(--negro)}
.o7-paso{border-bottom:3px solid var(--negro);padding:1.5rem 0}
.o7-paso b{font-family:var(--f-anton),Impact,sans-serif;font-size:clamp(3rem,8vw,5.5rem);line-height:.8;display:block}
.o7-paso h3{font-family:var(--f-anton),Impact,sans-serif;text-transform:uppercase;margin:.85rem 0 .5rem;font-size:1.5rem;line-height:1;letter-spacing:.01em}
.o7-paso p{margin:0;font-size:.875rem;line-height:1.6;max-width:36ch}
@media (min-width:900px){
  .o7-pasos{grid-template-columns:repeat(3,minmax(0,1fr))}
  .o7-paso{padding:1.75rem 1.5rem;border-right:3px solid var(--negro)}
  .o7-paso:last-child{border-right:0}
  .o7-paso:first-child{padding-left:0}
}

/* — negativo — */
.o7-no{display:grid;grid-template-columns:1fr;gap:0;margin:clamp(1.5rem,4vw,2.5rem) 0 0;padding:0;list-style:none;border-top:3px solid var(--hueso)}
.o7-no li{border-bottom:3px solid var(--hueso);padding:1rem 0;font-family:var(--f-anton),Impact,sans-serif;text-transform:uppercase;font-size:clamp(1.5rem,4.6vw,3rem);line-height:1;letter-spacing:.01em;color:var(--gris);text-decoration:line-through;text-decoration-thickness:3px;text-decoration-color:var(--amarillo);overflow-wrap:anywhere}
@media (min-width:900px){.o7-no{grid-template-columns:repeat(2,minmax(0,1fr))}.o7-no li:nth-child(odd){padding-right:1.5rem;border-right:3px solid var(--hueso)}.o7-no li:nth-child(even){padding-left:1.5rem}}

/* — tabla — */
.o7-tabla{width:100%;margin-top:clamp(1.5rem,4vw,2.5rem);border-collapse:collapse;display:block;overflow-x:auto}
.o7-tabla th{text-align:left;padding:.75rem 1rem .75rem 0;border-bottom:3px solid var(--hueso);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--gris);font-weight:400;white-space:nowrap}
.o7-tabla td{padding:1.1rem 1rem 1.1rem 0;border-bottom:1px solid #333;vertical-align:top;font-size:.875rem;line-height:1.6;color:var(--gris)}
.o7-tabla td:first-child{font-family:var(--f-anton),Impact,sans-serif;text-transform:uppercase;font-size:1.5rem;line-height:1;color:var(--amarillo);white-space:nowrap}
.o7-tabla td:nth-child(2){color:var(--hueso);white-space:nowrap}
.o7-tabla td:last-child{min-width:22rem}

/* — lámina — */
.o7-lamina{position:relative;aspect-ratio:16/9;border:3px solid var(--negro);background:var(--negro);margin-top:clamp(1.5rem,4vw,2.5rem);min-width:0}
.o7-lamina svg{position:absolute;inset:0;width:100%;height:100%}

/* — preguntas — */
.o7-faq{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(1.5rem,4vw,2.5rem);border-top:3px solid var(--hueso)}
.o7-faq>div{border-bottom:3px solid var(--hueso);padding:1.35rem 0}
.o7-faq h3{font-family:var(--f-anton),Impact,sans-serif;text-transform:uppercase;margin:0 0 .55rem;font-size:clamp(1.1rem,2.6vw,1.6rem);line-height:1.05;letter-spacing:.01em;color:var(--amarillo)}
.o7-faq p{margin:0;font-size:.875rem;line-height:1.65;color:var(--gris);max-width:64ch}
@media (min-width:900px){.o7-faq>div{display:grid;grid-template-columns:24rem minmax(0,1fr);gap:2rem;align-items:start}}

/* — cierre y pie — */
.o7-cierre{background:var(--amarillo);color:var(--negro);border-top:3px solid var(--negro);text-align:center;padding-block:clamp(3rem,8vw,6rem)}
.o7-cierre h2{margin:0 auto;font-size:clamp(2.4rem,11vw,8rem);max-width:14ch}
.o7-pie{border-top:3px solid var(--negro);background:var(--negro);color:var(--gris);padding-block:1.5rem 6rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem}
.o7-pie nav{display:flex;gap:1.5rem}
.o7-pie a{color:var(--gris);text-decoration:none;font-size:11px;letter-spacing:.2em;text-transform:uppercase}
.o7-pie a:hover{color:var(--amarillo)}
`;

export default function Opcion7() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`o7 ${anton.variable} ${spaceMono.variable}`}>
        <header className="o7-barra">
          <Link href="/opciones" className="o7-marca">
            {MARCA.wordmark}✦
          </Link>
          <span className="o7-barra-mid o7-et">
            Networking de eventos presenciales
          </span>
          <Link href="/login" className="o7-entrar">
            Entrar
          </Link>
        </header>

        <main>
          <section className="o7-carril o7-hero">
            <p className="o7-et" style={{ color: "var(--amarillo)" }}>
              El networking que por fin se ve
            </p>
            <h1 className="o7-display o7-h1">
              Tu red
              <br />
              es <mark>tu universo</mark>
            </h1>
            <div className="o7-hero-bajo">
              <p className="o7-lede">
                <b>{MARCA.definicion}</b>
              </p>
              <div className="o7-acc">
                <Link href="/login" className="o7-cta">
                  Entrar con Google
                </Link>
                <a href="#pasos" className="o7-cta o7-cta2">
                  Cómo va
                </a>
              </div>
            </div>
          </section>

          <section className="o7-losa o7-losa-amarilla" id="pasos">
            <div className="o7-carril">
              <p className="o7-et">Cómo va</p>
              <h2 className="o7-display o7-h2">Tres gestos</h2>
              <p className="o7-p">
                Ninguno se hace desde casa. Una conexión existe porque os visteis
                la cara.
              </p>
              <div className="o7-pasos">
                {PASOS.map((p) => (
                  <article key={p.n} className="o7-paso">
                    <b>{p.n}</b>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="o7-losa">
            <div className="o7-carril">
              <p className="o7-et" style={{ color: "var(--amarillo)" }}>
                Lo que no hay
              </p>
              <h2 className="o7-display o7-h2">Fuera</h2>
              <ul className="o7-no">
                {NO_HACE.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="o7-losa">
            <div className="o7-carril">
              <p className="o7-et" style={{ color: "var(--amarillo)" }}>
                Diccionario
              </p>
              <h2 className="o7-display o7-h2">El cielo significa cosas</h2>
              <table className="o7-tabla">
                <thead>
                  <tr>
                    <th scope="col">Palabra</th>
                    <th scope="col">Es</th>
                    <th scope="col">Y quiere decir</th>
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
            </div>
          </section>

          <section className="o7-losa o7-losa-amarilla">
            <div className="o7-carril">
              <p className="o7-et">La red</p>
              <h2 className="o7-display o7-h2">Un evento tiene forma</h2>
              <figure className="o7-lamina" style={{ margin: 0 }}>
                <RedSVG
                  n={30}
                  colores={["#E8FF4D"]}
                  colorSol="#F5F5F0"
                  colorLinea="#E8FF4D"
                  colorTriada={null}
                  grosor={1.1}
                  opacidadLinea={0.9}
                  halo={false}
                  picos={false}
                  nucleo={false}
                  corona={false}
                  escala={0.7}
                  preserveAspectRatio="xMidYMid meet"
                />
              </figure>
            </div>
          </section>

          <section className="o7-losa">
            <div className="o7-carril">
              <p className="o7-et" style={{ color: "var(--amarillo)" }}>
                Preguntas
              </p>
              <h2 className="o7-display o7-h2">Sin letra pequeña</h2>
              <div className="o7-faq">
                {PREGUNTAS.map((p) => (
                  <div key={p.q}>
                    <h3>{p.q}</h3>
                    <p>{p.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="o7-cierre">
            <h2 className="o7-display">Entra por una estrella</h2>
            <div
              className="o7-acc"
              style={{ justifyContent: "center", marginTop: "2rem" }}
            >
              <Link href="/login" className="o7-cta o7-cta2">
                Entrar con Google
              </Link>
            </div>
          </section>
        </main>

        <footer className="o7-pie">
          <div
            className="o7-carril"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <span className="o7-et">© 2026 Constela · {MARCA.tagline}</span>
            <nav aria-label="Enlaces legales">
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
            </nav>
          </div>
        </footer>
      </div>
      <Conmutador n={7} />
    </>
  );
}
