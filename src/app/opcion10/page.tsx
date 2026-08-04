import type { Metadata } from "next";
import Link from "next/link";
import { spaceGrotesk } from "@/app/opciones/fuentes";
import { MARCA, NO_HACE, PASOS, PREGUNTAS, VOCABULARIO } from "@/app/opciones/datos";
import { Conmutador } from "@/components/opciones/conmutador";
import { RedSVG } from "@/components/opciones/red-svg";

/*
 * OPCIÓN 10 · «Serigrafía» — riso duotono, cartel de evento.
 *
 * TESIS: Constela se reparte a mano, persona a persona, en un evento. Su
 * lenguaje natural no es el de una web sino el de un cartel fotocopiado: dos
 * tintas planas, sobreimpresión, grano y registro ligeramente desviado.
 * FORMA: papel crudo, azul de imprenta y rosa flúor sobre `multiply`; manchas
 * de tinta que se solapan, la constelación impresa girada un grado y bloques
 * de texto con márgenes de cartel. Cero degradados de pantalla: todo es tinta
 * plana o no es nada.
 * TIPO: Space Grotesk en todo, con versalitas para las etiquetas de imprenta.
 * COSTE: dos tintas dan poco margen para estados de UI (éxito, error) y el
 * grano encarece el pintado. Es la más memorable y la menos escalable.
 */

export const metadata: Metadata = {
  title: "Opción 10 · Serigrafía — Constela",
  description: "Propuesta de rediseño: riso duotono, tinta plana y grano.",
};

const CSS = `
body{background:#EFE7DA}
.o10{--papel:#EFE7DA;--tinta:#141210;--azul:#1B3FD8;--rosa:#FF4F58;--suave:#5C554C;
  font-family:var(--f-space-grotesk),ui-sans-serif,system-ui,sans-serif;letter-spacing:-.015em;
  background:var(--papel);color:var(--tinta);min-height:100svh;overflow-x:clip;position:relative}
.o10::after{content:"";position:fixed;inset:0;z-index:60;pointer-events:none;opacity:.14;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.o10 ::selection{background:var(--rosa);color:var(--papel)}
.o10 a:focus-visible{outline:3px solid var(--azul);outline-offset:2px}
.o10-carril{position:relative;z-index:10;width:100%;max-width:80rem;margin:0 auto;padding-inline:clamp(1.1rem,4vw,3rem)}
.o10-vers{font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:500;color:var(--suave)}
.o10-regla{height:2px;background:var(--tinta)}

/* — cabecera — */
.o10-top{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-block:1.1rem}
.o10-marca{font-size:1.35rem;font-weight:700;letter-spacing:-.04em;color:var(--tinta);text-decoration:none}
.o10-marca i{font-style:normal;color:var(--rosa)}
.o10-entrar{font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:var(--papel);background:var(--azul);padding:.6rem 1rem;text-decoration:none;display:inline-block;transition:background-color .15s linear}
.o10-entrar:hover{background:var(--rosa)}

/* — hero de cartel — */
.o10-hero{position:relative;padding-block:clamp(2.5rem,7vw,5rem) clamp(2rem,5vw,3.5rem)}
.o10-manchas{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.o10-manchas i{position:absolute;display:block;border-radius:50%;mix-blend-mode:multiply;filter:blur(2px)}
.o10-manchas i:nth-child(1){width:clamp(14rem,32vw,26rem);aspect-ratio:1;background:var(--azul);opacity:.9;right:-4rem;top:-3rem}
.o10-manchas i:nth-child(2){width:clamp(10rem,22vw,18rem);aspect-ratio:1;background:var(--rosa);opacity:.85;right:6rem;top:6rem}
.o10-hero>*{position:relative;z-index:1}
.o10-h1{margin:.9rem 0 0;font-size:clamp(3rem,13vw,9.5rem);line-height:.86;font-weight:700;letter-spacing:-.055em;text-transform:lowercase;overflow-wrap:anywhere;min-width:0}
.o10-h1 span{display:block;color:var(--azul)}
.o10-h1 em{font-style:normal;color:var(--rosa)}
.o10-bajo{display:grid;grid-template-columns:1fr;gap:1.5rem;margin-top:clamp(1.5rem,4vw,2.5rem);align-items:end}
.o10-lede{margin:0;font-size:clamp(1rem,1.9vw,1.25rem);line-height:1.5;max-width:38ch;color:var(--tinta)}
.o10-lede b{font-weight:700;box-shadow:inset 0 -.4em 0 rgba(255,79,88,.4)}
.o10-cta{display:inline-flex;align-items:center;justify-content:center;padding:1.15rem 1.9rem;background:var(--azul);color:var(--papel);font-size:1rem;font-weight:700;letter-spacing:-.02em;text-decoration:none;border:2px solid var(--azul);transition:background-color .15s linear,color .15s linear}
.o10-cta:hover{background:transparent;color:var(--azul)}
.o10-cta2{background:transparent;color:var(--tinta);border-color:var(--tinta)}
.o10-cta2:hover{background:var(--tinta);color:var(--papel)}
.o10-acc{display:flex;flex-wrap:wrap;gap:.75rem}
@media (min-width:900px){.o10-bajo{grid-template-columns:1.15fr auto}}

/* — lámina impresa — */
.o10-lamina{position:relative;margin-top:clamp(2rem,5vw,3rem);border:2px solid var(--tinta);background:#F6F0E6;min-width:0}
.o10-placa{position:relative;aspect-ratio:16/9;mix-blend-mode:multiply;transform:rotate(-.35deg)}
.o10-placa svg{position:absolute;inset:0;width:100%;height:100%}
.o10-pieLam{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem 1.5rem;padding:.7rem .9rem;border-top:2px solid var(--tinta)}

/* — bloques — */
.o10-bloque{padding-block:clamp(2.5rem,6vw,4rem)}
.o10-h2{margin:.8rem 0 0;font-size:clamp(2rem,6.4vw,4.25rem);line-height:.94;font-weight:700;letter-spacing:-.05em;text-transform:lowercase;max-width:16ch;overflow-wrap:anywhere}
.o10-h2 em{font-style:normal;color:var(--azul)}
.o10-p{margin:1rem 0 0;font-size:1rem;line-height:1.6;color:var(--suave);max-width:48ch}
.o10-pasos{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(1.75rem,4vw,2.5rem);border-top:2px solid var(--tinta);padding:0;list-style:none}
.o10-paso{border-bottom:2px solid var(--tinta);padding:1.4rem 0;display:grid;grid-template-columns:auto minmax(0,1fr);gap:1.25rem;align-items:start}
.o10-paso b{font-size:clamp(2.5rem,7vw,4rem);line-height:.8;font-weight:700;letter-spacing:-.05em;color:transparent;-webkit-text-stroke:2px var(--azul)}
.o10-paso h3{margin:0 0 .45rem;font-size:1.25rem;font-weight:700;letter-spacing:-.03em}
.o10-paso p{margin:0;font-size:.9375rem;line-height:1.6;color:var(--suave);max-width:52ch}

/* — franja azul — */
.o10-franja{background:var(--azul);color:var(--papel);padding-block:clamp(2.5rem,6vw,4rem)}
.o10-franja .o10-vers{color:rgba(239,231,218,.75)}
.o10-franja .o10-h2{color:var(--papel)}
.o10-franja .o10-h2 em{color:var(--rosa)}
.o10-no{display:grid;grid-template-columns:1fr;gap:0;margin:clamp(1.5rem,4vw,2.25rem) 0 0;padding:0;list-style:none;border-top:2px solid rgba(239,231,218,.35)}
.o10-no li{border-bottom:2px solid rgba(239,231,218,.35);padding:.95rem 0;font-size:clamp(1.05rem,2.4vw,1.5rem);font-weight:700;letter-spacing:-.03em;display:flex;gap:.85rem;align-items:baseline}
.o10-no li::before{content:"✕";color:var(--rosa);font-size:.85em;flex:none}
@media (min-width:820px){.o10-no{grid-template-columns:repeat(2,minmax(0,1fr))}.o10-no li:nth-child(odd){padding-right:1.5rem}.o10-no li:nth-child(even){padding-left:1.5rem}}

/* — vocabulario — */
.o10-voc{margin:clamp(1.75rem,4vw,2.5rem) 0 0;border-top:2px solid var(--tinta)}
.o10-voc>div{border-bottom:2px solid var(--tinta);padding:1.3rem 0;display:grid;grid-template-columns:1fr;gap:.4rem}
.o10-voc dt{font-size:1.4rem;font-weight:700;letter-spacing:-.035em;color:var(--azul)}
.o10-voc dd{margin:0;font-size:.9375rem;line-height:1.62;color:var(--suave);max-width:58ch}
.o10-voc dd.o10-vers{color:var(--rosa)}
@media (min-width:820px){.o10-voc>div{grid-template-columns:13rem 13rem minmax(0,1fr);gap:1.75rem;align-items:baseline}}

/* — preguntas — */
.o10-faq{margin-top:clamp(1.75rem,4vw,2.5rem);border-top:2px solid var(--tinta)}
.o10-faq>div{border-bottom:2px solid var(--tinta);padding:1.3rem 0}
.o10-faq h3{margin:0 0 .45rem;font-size:1.125rem;font-weight:700;letter-spacing:-.03em}
.o10-faq p{margin:0;font-size:.9375rem;line-height:1.62;color:var(--suave);max-width:62ch}
@media (min-width:820px){.o10-faq>div{display:grid;grid-template-columns:26rem minmax(0,1fr);gap:2rem;align-items:baseline}}

/* — cierre y pie — */
.o10-cierre{text-align:center;padding-block:clamp(3rem,8vw,5.5rem);display:flex;flex-direction:column;align-items:center;gap:1.4rem}
.o10-cierre h2{margin:0;font-size:clamp(2.4rem,10vw,7rem);line-height:.9;font-weight:700;letter-spacing:-.055em;text-transform:lowercase;max-width:14ch;overflow-wrap:anywhere}
.o10-cierre h2 em{font-style:normal;color:var(--azul)}
.o10-pie{border-top:2px solid var(--tinta);padding-block:1.5rem 6rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem}
.o10-pie nav{display:flex;gap:1.5rem}
.o10-pie a{font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:500;color:var(--suave);text-decoration:none}
.o10-pie a:hover{color:var(--rosa)}
`;

export default function Opcion10() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`o10 ${spaceGrotesk.variable}`}>
        <div className="o10-carril">
          <header>
            <div className="o10-top">
              <Link href="/opciones" className="o10-marca">
                {MARCA.wordmark}
                <i>✦</i>
              </Link>
              <span className="o10-vers">Dos tintas · un evento</span>
              <Link href="/login" className="o10-entrar">
                Entrar
              </Link>
            </div>
            <div className="o10-regla" />
          </header>

          <main>
            <section className="o10-hero">
              <div className="o10-manchas" aria-hidden>
                <i />
                <i />
              </div>
              <p className="o10-vers">{MARCA.tagline}</p>
              <h1 className="o10-h1">
                tu red es
                <span>
                  tu <em>universo</em>
                </span>
              </h1>
              <div className="o10-bajo">
                <p className="o10-lede">
                  <b>{MARCA.definicion}</b>
                </p>
                <div className="o10-acc">
                  <Link href="/login" className="o10-cta">
                    Continuar con Google
                  </Link>
                  <a href="#pasos" className="o10-cta o10-cta2">
                    Cómo funciona
                  </a>
                </div>
              </div>

              <figure className="o10-lamina" style={{ margin: 0 }}>
                <div className="o10-placa">
                  <RedSVG
                    n={32}
                    colores={["#1B3FD8"]}
                    colorSol="#FF4F58"
                    colorLinea="#1B3FD8"
                    colorTriada="#FF4F58"
                    grosor={0.85}
                    opacidadLinea={0.85}
                    halo={false}
                    picos={false}
                    nucleo={false}
                    corona={false}
                    escala={0.62}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </div>
                <figcaption className="o10-pieLam">
                  <span className="o10-vers">
                    Lám. 1 — constelación de un evento de ejemplo
                  </span>
                  <span className="o10-vers">
                    Azul: personas y encuentros · Rosa: tú y los triángulos
                  </span>
                </figcaption>
              </figure>
            </section>

            <section className="o10-bloque" id="pasos">
              <p className="o10-vers">Cómo funciona</p>
              <h2 className="o10-h2">
                tres gestos, <em>ninguno remoto</em>
              </h2>
              <p className="o10-p">
                Una conexión en Constela solo nace de abrir el QR personal de la
                otra persona. Eso significa que os visteis la cara.
              </p>
              <ul className="o10-pasos">
                {PASOS.map((p) => (
                  <li key={p.n} className="o10-paso">
                    <b>{p.n}</b>
                    <div>
                      <h3>{p.titulo}</h3>
                      <p>{p.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </main>
        </div>

        <section className="o10-franja">
          <div className="o10-carril">
            <p className="o10-vers">Lo que aquí no existe</p>
            <h2 className="o10-h2">
              fuera del <em>catálogo</em>
            </h2>
            <ul className="o10-no">
              {NO_HACE.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="o10-carril">
          <section className="o10-bloque">
            <p className="o10-vers">Diccionario</p>
            <h2 className="o10-h2">
              el cielo <em>significa cosas</em>
            </h2>
            <dl className="o10-voc">
              {VOCABULARIO.map((v) => (
                <div key={v.termino}>
                  <dt>{v.termino}</dt>
                  <dd className="o10-vers">{v.dominio}</dd>
                  <dd>{v.texto}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="o10-bloque">
            <p className="o10-vers">Preguntas</p>
            <h2 className="o10-h2">sin letra pequeña</h2>
            <div className="o10-faq">
              {PREGUNTAS.map((p) => (
                <div key={p.q}>
                  <h3>{p.q}</h3>
                  <p>{p.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="o10-cierre">
            <p className="o10-vers">Última llamada</p>
            <h2>
              entra por <em>una estrella</em>
            </h2>
            <Link href="/login" className="o10-cta">
              Continuar con Google
            </Link>
          </section>

          <footer className="o10-pie">
            <span className="o10-vers">© 2026 Constela · {MARCA.tagline}</span>
            <nav aria-label="Enlaces legales">
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
            </nav>
          </footer>
        </div>
      </div>
      <Conmutador n={10} />
    </>
  );
}
