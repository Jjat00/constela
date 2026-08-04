import type { Metadata } from "next";
import Link from "next/link";
import { fraunces, jakarta } from "@/app/opciones/fuentes";
import { MARCA, NO_HACE, PASOS, PREGUNTAS, VOCABULARIO } from "@/app/opciones/datos";
import { Conmutador } from "@/components/opciones/conmutador";
import { RedSVG } from "@/components/opciones/red-svg";

/*
 * OPCIÓN 5 · «Encuentro» — startup cálida.
 *
 * TESIS: Constela va de conocer gente, y hoy la landing parece un
 * observatorio de la NASA. Esta versión es la hipótesis contraria: papel
 * crema, terracota, esquinas muy redondas y una voz que sonríe. La red se
 * dibuja en tinta cálida sobre papel, como un mapa dibujado a mano.
 * FORMA: cinta superior con la promesa incómoda («no necesitas al
 * organizador»), hero asimétrico con subrayado dibujado, pasos con números
 * grandes escalonados, preguntas en acordeón nativo (`<details>`).
 * TIPO: Fraunces (display, con óptica) + Plus Jakarta Sans (cuerpo).
 * COSTE: pierde la nocturnidad y el cine. Gana calidez y accesibilidad de
 * lectura — es la única opción clara y amable de las diez.
 */

export const metadata: Metadata = {
  title: "Opción 5 · Encuentro — Constela",
  description: "Propuesta de rediseño: papel crema, terracota y voz cálida.",
};

const CSS = `
body{background:#FBF6EF}
.o5{--papel:#FBF6EF;--papel2:#F3EADC;--tinta:#2A2320;--suave:#6B5F57;--tenue:#6F6055;--terra:#C25A3C;--miel:#E0A33D;--borde:#E3D6C6;
  font-family:var(--f-jakarta),ui-sans-serif,system-ui,sans-serif;letter-spacing:normal;
  background:var(--papel);color:var(--tinta);min-height:100svh;overflow-x:clip}
.o5 ::selection{background:rgba(194,90,60,.22)}
.o5 a:focus-visible,.o5 summary:focus-visible{outline:2px solid var(--terra);outline-offset:3px;border-radius:10px}
.o5-carril{width:100%;max-width:72rem;margin:0 auto;padding-inline:clamp(1.25rem,4vw,2.5rem)}
.o5-serif{font-family:var(--f-fraunces),Georgia,serif;font-style:normal}

/* — cinta + nav — */
.o5-cinta{background:var(--tinta);color:var(--papel);text-align:center;font-size:.8125rem;padding:.6rem 1rem;line-height:1.4}
.o5-cinta b{color:var(--miel);font-weight:600}
.o5-nav{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:4.5rem}
.o5-marca{font-family:var(--f-fraunces),Georgia,serif;font-size:1.4rem;font-weight:600;color:var(--tinta);text-decoration:none;letter-spacing:-.02em}
.o5-marca i{font-style:normal;color:var(--terra)}
.o5-navlinks{display:none;gap:1.75rem}
.o5-navlinks a{font-size:.9375rem;color:var(--suave);text-decoration:none}
.o5-navlinks a:hover{color:var(--terra)}
.o5-btn{display:inline-flex;align-items:center;justify-content:center;height:2.75rem;padding-inline:1.35rem;border-radius:999px;background:var(--terra);color:#fff;font-size:.9375rem;font-weight:600;text-decoration:none;box-shadow:0 8px 20px -10px rgba(194,90,60,.8);transition:transform .18s ease,background-color .18s ease}
.o5-btn:hover{background:#AC4A2F;transform:translateY(-2px)}
.o5-btn:active{transform:translateY(0)}
.o5-btn-lg{height:3.35rem;padding-inline:1.9rem;font-size:1rem}
.o5-btn-2{background:transparent;color:var(--tinta);border:1.5px solid var(--borde);box-shadow:none}
.o5-btn-2:hover{background:var(--papel2);border-color:var(--tinta);transform:none}
@media (min-width:880px){.o5-navlinks{display:flex}}

/* — hero — */
.o5-hero{display:grid;grid-template-columns:1fr;gap:clamp(2.5rem,5vw,4rem);align-items:center;padding-block:clamp(2.5rem,6vw,4.5rem) clamp(3rem,7vw,5rem)}
.o5-h1{font-family:var(--f-fraunces),Georgia,serif;font-style:normal;margin:0;font-size:clamp(2.6rem,7.4vw,4.6rem);line-height:1.02;font-weight:600;letter-spacing:-.03em;overflow-wrap:anywhere;min-width:0}
.o5-sub{position:relative;display:inline-block;color:var(--terra)}
.o5-sub svg{position:absolute;left:0;right:0;bottom:-.16em;width:100%;height:.28em;overflow:visible}
.o5-lede{margin:1.5rem 0 0;max-width:34rem;font-size:clamp(1.0625rem,1.8vw,1.1875rem);line-height:1.65;color:var(--suave)}
.o5-lede b{color:var(--tinta);font-weight:600}
.o5-acc{display:flex;flex-wrap:wrap;gap:.85rem;align-items:center;margin-top:2rem}
.o5-mini{font-size:.875rem;color:var(--tenue)}
.o5-tarjetaRed{position:relative;border-radius:28px;background:var(--papel2);border:1.5px solid var(--borde);padding:1rem;box-shadow:0 30px 60px -40px rgba(42,35,32,.5);min-width:0}
.o5-lienzo{position:relative;aspect-ratio:1;border-radius:20px;overflow:hidden;background:var(--papel)}
.o5-lienzo svg{position:absolute;inset:0;width:100%;height:100%}
.o5-pieTarjeta{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.85rem .4rem .2rem;font-size:.8125rem;color:var(--tenue)}
@media (min-width:900px){.o5-hero{grid-template-columns:1.05fr .95fr}}

/* — pasos escalonados — */
.o5-seccion{padding-block:clamp(3rem,7vw,5rem)}
.o5-h2{font-family:var(--f-fraunces),Georgia,serif;font-style:normal;margin:0;font-size:clamp(1.9rem,4.4vw,2.9rem);line-height:1.08;font-weight:600;letter-spacing:-.025em;max-width:18ch;overflow-wrap:anywhere}
.o5-intro{margin:1rem 0 0;font-size:1.0625rem;line-height:1.65;color:var(--suave);max-width:44ch}
.o5-pasos{display:grid;grid-template-columns:1fr;gap:1.25rem;margin-top:clamp(2rem,4vw,3rem);padding:0;list-style:none}
.o5-paso{background:#fff;border:1.5px solid var(--borde);border-radius:24px;padding:1.75rem}
.o5-paso b{display:grid;place-items:center;width:2.9rem;height:2.9rem;border-radius:50%;background:var(--papel2);color:var(--terra);font-family:var(--f-fraunces),Georgia,serif;font-size:1.25rem;font-weight:600}
.o5-paso h3{margin:1.1rem 0 .5rem;font-size:1.25rem;font-weight:700;letter-spacing:-.02em}
.o5-paso p{margin:0;font-size:.9375rem;line-height:1.65;color:var(--suave)}
@media (min-width:880px){
  .o5-pasos{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem}
  .o5-paso:nth-child(2){transform:translateY(1.75rem)}
  .o5-paso:nth-child(3){transform:translateY(3.5rem)}
  .o5-pasos{margin-bottom:3.5rem}
}

/* — franja oscura del negativo — */
.o5-franja{background:var(--tinta);color:var(--papel);border-radius:32px}
.o5-franja .o5-h2{color:var(--papel)}
.o5-franja .o5-intro{color:#C9BCB2}
.o5-no{display:grid;grid-template-columns:1fr;gap:.75rem;margin:2rem 0 0;padding:0;list-style:none}
.o5-no li{display:flex;align-items:center;gap:.85rem;font-size:1rem;color:#EFE5DA}
.o5-no li b{display:grid;place-items:center;width:1.6rem;height:1.6rem;border-radius:50%;background:rgba(224,163,61,.2);color:var(--miel);font-size:.75rem;flex:none}
@media (min-width:720px){.o5-no{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* — vocabulario — */
.o5-voc{display:grid;grid-template-columns:1fr;gap:1rem;margin-top:2.5rem}
@media (min-width:760px){.o5-voc{grid-template-columns:repeat(2,minmax(0,1fr))}}
.o5-vc{background:#fff;border:1.5px solid var(--borde);border-radius:22px;padding:1.5rem}
.o5-vc h3{font-family:var(--f-fraunces),Georgia,serif;font-style:normal;margin:0;font-size:1.3rem;font-weight:600;letter-spacing:-.02em}
.o5-vc small{display:block;margin-top:.2rem;font-size:.8125rem;color:var(--terra);font-weight:600}
.o5-vc p{margin:.75rem 0 0;font-size:.9375rem;line-height:1.62;color:var(--suave)}

/* — acordeón — */
.o5-faq{margin-top:2.25rem;display:grid;gap:.75rem}
.o5-faq details{background:#fff;border:1.5px solid var(--borde);border-radius:18px;overflow:hidden}
.o5-faq summary{list-style:none;cursor:pointer;padding:1.1rem 1.35rem;font-size:1.0625rem;font-weight:600;letter-spacing:-.015em;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.o5-faq summary::-webkit-details-marker{display:none}
.o5-faq summary::after{content:"+";color:var(--terra);font-size:1.35rem;line-height:1;flex:none}
.o5-faq details[open] summary::after{content:"–"}
.o5-faq details[open] summary{border-bottom:1.5px solid var(--borde)}
.o5-faq p{margin:0;padding:1.1rem 1.35rem;font-size:.9375rem;line-height:1.7;color:var(--suave)}

/* — cierre y pie — */
.o5-cierre{text-align:center;padding-block:clamp(3.5rem,8vw,6rem);display:flex;flex-direction:column;align-items:center}
.o5-pie{border-top:1.5px solid var(--borde);padding-block:2.5rem 6rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem}
.o5-pie p{margin:0;font-size:.875rem;color:var(--tenue)}
.o5-pie nav{display:flex;gap:1.5rem}
.o5-pie a{font-size:.875rem;color:var(--suave);text-decoration:none}
.o5-pie a:hover{color:var(--terra)}
`;

export default function Opcion5() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`o5 ${jakarta.variable} ${fraunces.variable}`}>
        <p className="o5-cinta">
          No necesitas que el organizador lo instale: <b>entras escaneando a alguien que ya está dentro</b>
        </p>

        <div className="o5-carril">
          <nav className="o5-nav" aria-label="Principal">
            <Link href="/opciones" className="o5-marca">
              {MARCA.wordmark}
              <i>✦</i>
            </Link>
            <div className="o5-navlinks">
              <a href="#como">Cómo funciona</a>
              <a href="#palabras">Las palabras</a>
              <a href="#preguntas">Preguntas</a>
            </div>
            <Link href="/login" className="o5-btn">
              Entrar
            </Link>
          </nav>

          <main>
            <section className="o5-hero">
              <div>
                <h1 className="o5-h1">
                  Conoces a alguien.
                  <br />
                  Y esta vez{" "}
                  <span className="o5-sub">
                    se nota
                    <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                      <path
                        d="M2 8C40 3 78 2 118 5c28 2 54 4 80 2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  .
                </h1>
                <p className="o5-lede">
                  <b>{MARCA.nombre} es el networking que por fin se ve.</b>{" "}
                  {MARCA.definicion}
                </p>
                <div className="o5-acc">
                  <Link href="/login" className="o5-btn o5-btn-lg">
                    Continuar con Google
                  </Link>
                  <a href="#como" className="o5-btn o5-btn-2 o5-btn-lg">
                    Cómo funciona
                  </a>
                </div>
                <p className="o5-mini" style={{ marginTop: "1rem" }}>
                  Entrar toma unos 8 segundos. El perfil, si quieres, después.
                </p>
              </div>

              <figure className="o5-tarjetaRed" style={{ margin: 0 }}>
                <div className="o5-lienzo">
                  <RedSVG
                    n={28}
                    colores={["#C25A3C", "#E0A33D", "#8C6E5D", "#C25A3C", "#B4795A"]}
                    colorSol="#C25A3C"
                    colorLinea="#B99C86"
                    colorTriada="#E0A33D"
                    grosor={0.8}
                    opacidadLinea={0.65}
                    halo={false}
                    picos={false}
                    nucleo={false}
                    corona={false}
                    escala={0.7}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </div>
                <figcaption className="o5-pieTarjeta">
                  <span>La constelación de un evento de ejemplo</span>
                  <span>▲ = un triángulo cerrado</span>
                </figcaption>
              </figure>
            </section>

            <section className="o5-seccion" id="como">
              <h2 className="o5-h2">Tres gestos, y ninguno se hace desde casa.</h2>
              <p className="o5-intro">
                Una conexión en Constela significa exactamente una cosa: os visteis
                la cara.
              </p>
              <ul className="o5-pasos">
                {PASOS.map((p) => (
                  <li key={p.n} className="o5-paso">
                    <b>{p.n}</b>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="o5-seccion">
              <div
                className="o5-franja"
                style={{ padding: "clamp(2rem,5vw,3.5rem)" }}
              >
                <h2 className="o5-h2">Lo que aquí no vas a encontrar.</h2>
                <p className="o5-intro">
                  Casi todo el ruido del networking digital viene de funciones que
                  Constela decidió no tener.
                </p>
                <ul className="o5-no">
                  {NO_HACE.map((t) => (
                    <li key={t}>
                      <b aria-hidden>✕</b>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="o5-seccion" id="palabras">
              <h2 className="o5-h2">Las palabras del cielo, en cristiano.</h2>
              <div className="o5-voc">
                {VOCABULARIO.map((v) => (
                  <article key={v.termino} className="o5-vc">
                    <h3>{v.termino}</h3>
                    <small>{v.dominio}</small>
                    <p>{v.texto}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="o5-seccion" id="preguntas">
              <h2 className="o5-h2">Preguntas razonables.</h2>
              <div className="o5-faq">
                {PREGUNTAS.map((p, i) => (
                  <details key={p.q} open={i === 0}>
                    <summary>{p.q}</summary>
                    <p>{p.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="o5-cierre">
              <h2 className="o5-h2" style={{ maxWidth: "16ch" }}>
                La próxima persona que conozcas ya es una estrella.
              </h2>
              <p className="o5-intro" style={{ maxWidth: "36ch" }}>
                {MARCA.tagline}.
              </p>
              <div className="o5-acc" style={{ justifyContent: "center" }}>
                <Link href="/login" className="o5-btn o5-btn-lg">
                  Continuar con Google
                </Link>
              </div>
            </section>
          </main>

          <footer className="o5-pie">
            <p>© 2026 Constela · {MARCA.tagline}</p>
            <nav aria-label="Enlaces legales">
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
            </nav>
          </footer>
        </div>
      </div>
      <Conmutador n={5} />
    </>
  );
}
