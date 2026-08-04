import type { Metadata } from "next";
import Link from "next/link";
import { instrument, inter } from "@/app/opciones/fuentes";
import { MARCA, NO_HACE, PASOS, PREGUNTAS, VOCABULARIO } from "@/app/opciones/datos";
import { Conmutador } from "@/components/opciones/conmutador";
import { RedSVG } from "@/components/opciones/red-svg";

/*
 * OPCIÓN 6 · «Efemérides» — editorial: la revista del observatorio.
 *
 * TESIS: Constela lleva dentro un vocabulario de astronomía que nadie ha
 * tratado nunca como lo que es — material de imprenta. Esta versión monta la
 * landing como un boletín astronómico: cabecera con filetes, capitular,
 * columnas de texto, la constelación grabada a línea y un colofón.
 * FORMA: documento largo con secciones numeradas en romanos (aquí la
 * numeración SÍ es ordinal de verdad), figura con pie de foto y glosario con
 * sangría francesa. Cero cards, cero cristal, cero sombras.
 * TIPO: Instrument Serif en display (romana, nunca cursiva) + Inter en
 * cuerpo. Tinta azul de imprenta para lo destacado, rojo de corrección para
 * las marcas.
 * COSTE: la más lenta de leer y la menos «app». A cambio, la única que
 * transmite autoridad y la que mejor sostiene texto largo.
 */

export const metadata: Metadata = {
  title: "Opción 6 · Efemérides — Constela",
  description: "Propuesta de rediseño: boletín astronómico impreso, serif y columnas.",
};

const CSS = `
body{background:#F4F1EA}
.o6{--papel:#F4F1EA;--tinta:#16161A;--suave:#4A4A52;--tenue:#6B6960;--azul:#1B3A6B;--rojo:#A93226;--filete:#C9C4B7;
  font-family:var(--f-inter),ui-sans-serif,system-ui,sans-serif;letter-spacing:normal;
  background:var(--papel);color:var(--tinta);min-height:100svh;overflow-x:clip}
.o6 ::selection{background:rgba(27,58,107,.18)}
.o6 a:focus-visible{outline:2px solid var(--azul);outline-offset:3px}
.o6-carril{width:100%;max-width:66rem;margin:0 auto;padding-inline:clamp(1.25rem,4vw,2.5rem)}
.o6-serif{font-family:var(--f-instrument),Georgia,serif;font-style:normal;font-weight:400}
.o6-vers{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--tenue)}
.o6-filete{height:1px;background:var(--filete)}
.o6-filete-doble{border-top:3px double var(--filete);height:0}

/* — cabecera — */
.o6-cab{padding-top:1.25rem}
.o6-cabtop{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-bottom:.75rem}
.o6-masthead{text-align:center;padding-block:clamp(1.5rem,4vw,2.5rem)}
.o6-masthead a{font-family:var(--f-instrument),Georgia,serif;font-size:clamp(3rem,13vw,8rem);line-height:.85;letter-spacing:-.02em;color:var(--tinta);text-decoration:none;display:block;overflow-wrap:anywhere}
.o6-meta{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem 1.5rem;padding-block:.75rem}
.o6-entrar{font-size:.8125rem;color:var(--azul);text-decoration:none;border-bottom:1px solid var(--azul);padding-bottom:1px}
.o6-entrar:hover{color:var(--rojo);border-color:var(--rojo)}

/* — apertura — */
.o6-apertura{padding-block:clamp(2rem,5vw,3rem)}
.o6-h1{font-family:var(--f-instrument),Georgia,serif;font-style:normal;margin:.75rem 0 0;font-size:clamp(2.6rem,8vw,5.5rem);line-height:.98;font-weight:400;letter-spacing:-.02em;max-width:16ch;overflow-wrap:anywhere;min-width:0}
.o6-h1 em{font-style:normal;color:var(--azul)}
.o6-bajada{margin:1.25rem 0 0;font-size:clamp(1.0625rem,2vw,1.25rem);line-height:1.5;color:var(--suave);max-width:46ch}
.o6-cuerpo{margin-top:clamp(1.75rem,4vw,2.5rem);font-size:1rem;line-height:1.72;color:var(--tinta)}
.o6-cuerpo p{margin:0 0 1.1rem}
.o6-cuerpo p:first-of-type::first-letter{float:left;font-family:var(--f-instrument),Georgia,serif;font-size:3.9em;line-height:.78;padding:.06em .1em 0 0;color:var(--azul)}
@media (min-width:820px){.o6-cuerpo{column-count:2;column-gap:2.75rem}}
.o6-acc{display:flex;flex-wrap:wrap;align-items:center;gap:1.25rem;margin-top:1.5rem}
.o6-cta{display:inline-flex;align-items:center;height:3rem;padding-inline:1.6rem;background:var(--azul);color:#F4F1EA;font-size:.9375rem;font-weight:500;text-decoration:none;transition:background-color .18s ease}
.o6-cta:hover{background:var(--tinta)}

/* — lámina — */
.o6-lamina{margin:clamp(2rem,5vw,3rem) 0 0;border-top:1px solid var(--filete);border-bottom:1px solid var(--filete);padding-block:1.5rem}
.o6-placa{position:relative;aspect-ratio:16/10;background:#FBF9F4;border:1px solid var(--filete);min-width:0}
.o6-placa svg{position:absolute;inset:0;width:100%;height:100%}
.o6-pie{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem 1.5rem;margin-top:.75rem}

/* — artículos — */
.o6-art{padding-block:clamp(2.25rem,5vw,3.25rem);border-top:1px solid var(--filete)}
.o6-h2{font-family:var(--f-instrument),Georgia,serif;font-style:normal;margin:.5rem 0 0;font-size:clamp(1.75rem,4.4vw,3rem);line-height:1.05;font-weight:400;letter-spacing:-.015em;max-width:20ch;overflow-wrap:anywhere}
.o6-cols{margin-top:1.5rem;font-size:.9375rem;line-height:1.72;color:var(--suave)}
@media (min-width:820px){.o6-cols{column-count:3;column-gap:2.25rem}}
.o6-cols h3{font-family:var(--f-instrument),Georgia,serif;font-style:normal;margin:0 0 .4rem;font-size:1.35rem;font-weight:400;color:var(--tinta);letter-spacing:-.01em;break-after:avoid}
.o6-cols section{break-inside:avoid;margin-bottom:1.5rem}
.o6-cols p{margin:0}

/* — glosario con sangría francesa — */
.o6-glos{margin:1.5rem 0 0}
.o6-glos div{padding:1.1rem 0;border-top:1px dotted var(--filete)}
.o6-glos dt{font-family:var(--f-instrument),Georgia,serif;font-style:normal;font-size:1.45rem;line-height:1.15;letter-spacing:-.01em}
.o6-glos dt small{font-family:var(--f-inter),sans-serif;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--rojo);margin-left:.7rem;vertical-align:.28em}
.o6-glos dd{margin:.4rem 0 0;font-size:.9375rem;line-height:1.7;color:var(--suave);max-width:64ch}
@media (min-width:820px){.o6-glos div{padding-left:12rem;position:relative}.o6-glos dt{position:absolute;left:0;top:1.1rem;width:11rem}}

/* — nota al margen: filete fino arriba y ladillo en rojo de corrección, como
     en una caja de imprenta; nunca una pestaña de color al costado — */
.o6-nota{margin-top:1.75rem;border-top:1px solid var(--filete);padding-top:.9rem}
.o6-nota .o6-vers{color:var(--rojo)}
.o6-nota ul{margin:.55rem 0 0;padding-left:1.1rem;font-size:.9375rem;line-height:1.7;color:var(--suave)}
.o6-nota li::marker{color:var(--rojo)}
@media (min-width:820px){
  .o6-nota{display:grid;grid-template-columns:11rem minmax(0,1fr);gap:2.25rem;align-items:baseline}
  .o6-nota ul{margin-top:0}
}

/* — preguntas — */
.o6-qa{margin-top:1.5rem;font-size:.9375rem;line-height:1.72;color:var(--suave)}
@media (min-width:820px){.o6-qa{column-count:2;column-gap:2.75rem}}
.o6-qa section{break-inside:avoid;margin-bottom:1.4rem}
.o6-qa h3{margin:0 0 .3rem;font-size:1rem;font-weight:600;color:var(--tinta);letter-spacing:-.01em}
.o6-qa p{margin:0}

/* — colofón — */
.o6-colofon{padding-block:clamp(2.5rem,6vw,4rem) 6rem;border-top:3px double var(--filete);margin-top:clamp(2rem,5vw,3rem);text-align:center;display:flex;flex-direction:column;align-items:center;gap:1rem}
.o6-colofon h2{font-family:var(--f-instrument),Georgia,serif;font-style:normal;margin:0;font-size:clamp(1.9rem,5.5vw,3.4rem);line-height:1;font-weight:400;letter-spacing:-.02em;overflow-wrap:anywhere}
.o6-colofon nav{display:flex;gap:1.5rem}
.o6-colofon a{font-size:.8125rem;color:var(--suave);text-decoration:none}
.o6-colofon a:hover{color:var(--rojo)}
`;

const ROMANOS = ["I", "II", "III"];

export default function Opcion6() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`o6 ${inter.variable} ${instrument.variable}`}>
        <div className="o6-carril">
          <header className="o6-cab">
            <div className="o6-cabtop">
              <span className="o6-vers">Boletín del observatorio</span>
              <Link href="/login" className="o6-entrar">
                Entrar con Google
              </Link>
            </div>
            <div className="o6-filete" />
            <div className="o6-masthead">
              <Link href="/opciones">{MARCA.wordmark}</Link>
            </div>
            <div className="o6-filete" />
            <div className="o6-meta">
              <span className="o6-vers">Networking de eventos presenciales</span>
              <span className="o6-vers">·</span>
              <span className="o6-vers">{MARCA.tagline}</span>
              <span className="o6-vers">·</span>
              <span className="o6-vers">Acceso con Google</span>
            </div>
            <div className="o6-filete-doble" />
          </header>

          <main>
            <article className="o6-apertura">
              <p className="o6-vers">Apertura</p>
              <h1 className="o6-h1">
                Tu red es <em>tu universo.</em>
              </h1>
              <p className="o6-bajada">{MARCA.definicion}</p>
              <div className="o6-cuerpo">
                <p>
                  Durante años el networking de un evento ha vivido en una pila de
                  tarjetas y en una lista de contactos que nadie vuelve a abrir. La
                  red existía —cada conversación era una arista— pero nadie podía
                  verla. Constela parte de esa ausencia: si las personas son
                  estrellas y los encuentros, filamentos, entonces un evento tiene
                  forma, y esa forma se puede dibujar mientras ocurre.
                </p>
                <p>
                  La regla que sostiene el sistema es dura y deliberada: una arista
                  solo nace al abrir el QR personal de otra persona. No hay
                  solicitudes, ni botón de agregar, ni manera de fabricar una
                  conexión desde el sofá. Lo que la constelación muestra ocurrió de
                  verdad, cara a cara, en el mismo edificio.
                </p>
                <p>
                  Y lo que se ve no es «tu red»: es la del evento entero. Cualquier
                  asistente puede mirar el grafo completo, encontrar los triángulos
                  cerrados y decidir a quién acercarse. La visión colectiva no es un
                  extra del producto — es el producto.
                </p>
              </div>
              <div className="o6-acc">
                <Link href="/login" className="o6-cta">
                  Continuar con Google
                </Link>
                <span className="o6-vers">Entrar toma unos 8 segundos</span>
              </div>
            </article>

            <figure className="o6-lamina" style={{ margin: 0 }}>
              <div className="o6-placa">
                <RedSVG
                  n={34}
                  colores={["#16161A"]}
                  colorSol="#A93226"
                  colorLinea="#16161A"
                  colorTriada="#1B3A6B"
                  grosor={0.45}
                  opacidadLinea={0.55}
                  halo={false}
                  nucleo={false}
                  corona={false}
                  escala={0.5}
                  preserveAspectRatio="xMidYMid meet"
                />
              </div>
              <figcaption className="o6-pie">
                <span className="o6-vers">
                  Lám. 1 — Constelación de un evento de ejemplo
                </span>
                <span className="o6-vers">
                  Rojo: tú · Azul: cierres triádicos
                </span>
              </figcaption>
            </figure>

            <article className="o6-art">
              <p className="o6-vers">Artículo I — Procedimiento</p>
              <h2 className="o6-h2">Tres gestos y ninguna solicitud.</h2>
              <div className="o6-cols">
                {PASOS.map((p, i) => (
                  <section key={p.n}>
                    <h3>
                      {ROMANOS[i]}. {p.titulo}
                    </h3>
                    <p>{p.texto}</p>
                  </section>
                ))}
              </div>
              <div className="o6-nota">
                <p className="o6-vers">De lo que carece este instrumento</p>
                <ul>
                  {NO_HACE.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="o6-art">
              <p className="o6-vers">Artículo II — Nomenclatura</p>
              <h2 className="o6-h2">El cielo, término a término.</h2>
              <dl className="o6-glos">
                {VOCABULARIO.map((v) => (
                  <div key={v.termino}>
                    <dt>
                      {v.termino}
                      <small>{v.dominio}</small>
                    </dt>
                    <dd>{v.texto}</dd>
                  </div>
                ))}
              </dl>
            </article>

            <article className="o6-art">
              <p className="o6-vers">Artículo III — Correspondencia</p>
              <h2 className="o6-h2">Preguntas de los lectores.</h2>
              <div className="o6-qa">
                {PREGUNTAS.map((p) => (
                  <section key={p.q}>
                    <h3>{p.q}</h3>
                    <p>{p.a}</p>
                  </section>
                ))}
              </div>
            </article>
          </main>

          <footer className="o6-colofon">
            <p className="o6-vers">Colofón</p>
            <h2>Entra por una estrella.</h2>
            <Link href="/login" className="o6-cta">
              Continuar con Google
            </Link>
            <p className="o6-vers" style={{ marginTop: ".5rem" }}>
              © 2026 Constela · {MARCA.tagline}
            </p>
            <nav aria-label="Enlaces legales">
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
            </nav>
          </footer>
        </div>
      </div>
      <Conmutador n={6} />
    </>
  );
}
