import type { Metadata } from "next";
import Link from "next/link";
import { geist } from "@/app/opciones/fuentes";
import {
  MAPA,
  MARCA,
  NO_HACE,
  PASOS,
  PREGUNTAS,
  VIDEO,
  VOCABULARIO,
} from "@/app/opciones/datos";
import { Conmutador } from "@/components/opciones/conmutador";
import { RedSVG } from "@/components/opciones/red-svg";
import { DEMO_EDGES, DEMO_NODES } from "@/lib/demo-universe";
import { MapaDocumento, VideoDocumento } from "./demo";

/*
 * OPCIÓN 2 · «Documento» — la escuela Vercel.
 *
 * TESIS: blanco, preciso, técnico. La confianza se transmite con contraste
 * puro (negro sobre blanco), bordes de 1px y cero adorno: parece
 * infraestructura, no una fiesta. Es la apuesta contraria a todo lo que
 * Constela es hoy — y por eso vale mirarla.
 * FORMA: hero centrado con píldora negra, retícula de cajas de 1px con radio
 * corto, una banda invertida en negro a mitad de página para partir el ritmo
 * y un pie de tres columnas. Nada de degradados de color.
 * TIPO: Geist en todo — display y cuerpo — con el mono del sistema para los
 * datos. Tracking negativo fuerte en los titulares.
 * COSTE: pierde el cosmos, del todo. Aquí no hay cielo en ninguna parte —
 * ni siquiera dentro del mapa que sí se toca, que se imprime en negro sobre
 * papel con los cierres triádicos en azul. Quien compre esta opción compra
 * un producto serio y frío; el oro, el celeste y el H-alfa de la marca no
 * sobreviven a la mudanza.
 *
 * AÑADIDO (2026-08-01, a pedido del usuario): monta también el video de
 * presentación y la constelación real de ejemplo que la landing de producción
 * tiene bajo su hero. No incrustados tal cual: el video entra como lámina
 * sobre passe-partout con el mando en la cabecera —nada de cristal flotando
 * sobre la imagen— y el `ConstellationPanel` real se dibuja con la paleta de
 * esta opción (`TINTA_DOCUMENTO` en `./demo`) mientras su chrome se traduce a
 * papel redefiniendo los tokens del tema dentro de `.o2-app`. Tres figuras,
 * un solo marco de 1px: diagrama, película y mapa.
 */

export const metadata: Metadata = {
  title: "Opción 2 · Documento — Constela",
  description: "Propuesta de rediseño: blanco, preciso y técnico, escuela Vercel.",
};

const CSS = `
body{background:#fff}
.o2{--tinta:#000;--suave:#666;--tenue:#6E6E6E;--borde:#EAEAEA;--fondo2:#FAFAFA;--papel:#fff;
  font-family:var(--f-geist),ui-sans-serif,system-ui,sans-serif;letter-spacing:normal;
  background:var(--papel);color:var(--tinta);min-height:100svh;overflow-x:clip}
.o2 ::selection{background:#000;color:#fff}
/* El anillo de foco del documento se detiene en el borde de la isla de la
   app, que trae el suyo: sin el :not(), el border-radius de esta regla
   cuadraría todas las píldoras del panel al enfocarlas. */
.o2 :is(a,button):focus-visible:not(.o2-app *){outline:2px solid #000;outline-offset:2px;border-radius:6px}
.o2-carril{width:100%;max-width:68rem;margin:0 auto;padding-inline:clamp(1.25rem,4vw,1.5rem)}
.o2-mono{font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:11px;letter-spacing:.02em;color:var(--tenue)}

/* — nav de tres secciones — */
.o2-nav{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--borde)}
.o2-nav>div{height:3.75rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.o2-marca{display:flex;align-items:center;gap:.5rem;font-size:1rem;font-weight:600;letter-spacing:-.03em;color:#000;text-decoration:none}
.o2-marca svg{width:18px;height:18px}
.o2-links{display:none;gap:1.5rem}
.o2-links a{font-size:.875rem;color:var(--suave);text-decoration:none;transition:color .15s ease}
.o2-links a:hover{color:#000}
.o2-btn{display:inline-flex;align-items:center;justify-content:center;height:2.25rem;padding-inline:1rem;border-radius:6px;background:#000;color:#fff;font-size:.875rem;font-weight:500;text-decoration:none;border:1px solid #000;transition:background-color .15s ease,color .15s ease}
.o2-btn:hover{background:#fff;color:#000}
.o2-btn-ghost{background:#fff;color:#000;border:1px solid var(--borde)}
.o2-btn-ghost:hover{background:var(--fondo2);color:#000;border-color:#000}
.o2-btn-lg{height:2.75rem;padding-inline:1.5rem;font-size:.9375rem}
@media (min-width:820px){.o2-links{display:flex}}

/* — hero centrado — */
.o2-hero{padding-block:clamp(4rem,10vw,7.5rem) clamp(2.5rem,5vw,4rem);text-align:center;display:flex;flex-direction:column;align-items:center}
.o2-pill{display:inline-flex;align-items:center;gap:.5rem;height:1.9rem;padding-inline:.75rem;border:1px solid var(--borde);border-radius:999px;font-size:.75rem;color:var(--suave);background:var(--papel)}
.o2-pill b{color:#000;font-weight:500}
.o2-h1{margin:1.5rem 0 0;font-size:clamp(2.5rem,7.5vw,4.5rem);line-height:1.02;font-weight:600;letter-spacing:-.045em;max-width:16ch;overflow-wrap:anywhere;min-width:0}
.o2-lede{margin:1.25rem 0 0;max-width:38rem;font-size:clamp(1rem,1.8vw,1.125rem);line-height:1.6;color:var(--suave)}
.o2-acciones{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem;margin-top:2rem}

/* — diagrama — */
.o2-diagrama{margin-top:clamp(2.5rem,6vw,4rem);border:1px solid var(--borde);border-radius:12px;background:var(--fondo2);overflow:hidden}
.o2-diagrama-cab{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.35rem 1rem;padding:.7rem 1rem;border-bottom:1px solid var(--borde);background:var(--papel)}
.o2-lienzo{position:relative;aspect-ratio:16/10;min-width:0}
.o2-lienzo svg{position:absolute;inset:0;width:100%;height:100%}

/* — el video, como lámina reproducida en un documento — */
/* El video está re-renderizado en la tinta de esta página (composición
   Constela-doc-* en video/), así que la lámina es papel: se distingue del
   passe-partout blanco por su filete y por medio tono de gris, no por
   contraste. El control no flota encima del video (eso es cristal, y el
   cristal es de otra escuela): vive en la cabecera blanca, con los demás
   datos de la figura. */
.o2-pelicula{padding:clamp(.9rem,3vw,2rem);background:var(--papel)}
.o2-fotograma{position:relative;aspect-ratio:9/16;border:1px solid var(--borde);background:var(--fondo2) url("/video/poster-doc-9x16.webp") center/cover no-repeat}
.o2-fotograma video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.o2-toque{position:absolute;inset:0;background:transparent;border:0;cursor:pointer}
.o2-ctrl{display:inline-flex;align-items:center;gap:.4rem;height:1.75rem;padding-inline:.55rem;border:1px solid var(--borde);border-radius:6px;background:var(--papel);
  font-family:inherit;font-size:.75rem;color:#000;cursor:pointer;transition:border-color .15s ease}
.o2-ctrl:hover{border-color:#000}
.o2-ctrl svg{width:.8rem;height:.8rem}
.o2-cab-fin{display:flex;align-items:center;gap:.75rem}
@media (min-width:768px){.o2-fotograma{aspect-ratio:16/9;background-image:url("/video/poster-doc-16x9.webp")}}

/* — el mapa jugable, impreso — */
/* La app entra al documento en la tinta del documento: papel, negro y el azul
   de la escuela (ver TINTA_DOCUMENTO en ./demo para el canvas). Aquí se
   redefinen los tokens del tema para que TODO el chrome del panel —que está
   escrito con utilidades de la app: text-muted-foreground, bg-celeste/15,
   .glass, .chip-star— se resuelva sobre papel sin tocar el componente.
   Funciona porque este <style> va sin @layer y gana a globals.css. */
.o2-app{position:relative;height:76svh;max-height:44rem;min-height:28rem;background:var(--fondo2);
  color:#000;font-family:var(--f-geist),ui-sans-serif,system-ui,sans-serif;letter-spacing:normal;
  --foreground:#000;--muted-foreground:#555;--faint:#6E6E6E;--background:#fff;
  --celeste:#0070F3;--cosmic:#0070F3;--sol:#0070F3;--halfa:#0070F3;--estrella-a:#555;
  /* Toda la escala de radios cuelga de --radius: un solo número deja las
     cards del mini-perfil en el radio corto de esta opción. */
  --radius:.28rem;
  /* El mono de la app abre el tracking (voz de observatorio); el de este
     documento casi lo cierra. */
  --tracking-wide:.02em;--tracking-wider:.02em;--tracking-widest:.04em}
.o2-app ::selection{background:#000;color:#fff}
.o2-app a:focus-visible,.o2-app button:focus-visible,.o2-app input:focus-visible{outline:2px solid #000;outline-offset:2px}
.o2-app-espera{display:grid;height:100%;place-items:center}

/* El cristal se vuelve papel: superficie opaca, filete de 1px y radio corto.
   Nada de píldoras gigantes ni sombras de 70px. */
.o2-app .glass{background:rgba(255,255,255,.93);border:1px solid var(--borde);border-radius:10px;
  box-shadow:0 2px 12px rgba(0,0,0,.06);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
/* Los chips sí siguen siendo píldoras: el documento ya las usa en «lo que no
   hace». Encendido = negro pleno, el contraste puro de la escuela. */
.o2-app .chip-star,.o2-app .chip-triad,.o2-app .btn-sol{border:1px solid var(--borde);background:var(--papel);color:#555;border-radius:999px}
.o2-app .chip-star:hover,.o2-app .chip-triad:hover,.o2-app .btn-sol:hover{border-color:#000;background:var(--papel);color:#000}
.o2-app .chip-star[data-active="true"],.o2-app .chip-star[aria-pressed="true"]{border-color:#000;background:#000;color:#fff}
.o2-app .chip-triad[aria-pressed="true"]{border-color:#0070F3;background:rgba(0,112,243,.08);color:#0070F3}
.o2-app .btn-cosmic{border:1px solid #000;background:#000;color:#fff;border-radius:6px}
.o2-app .btn-cosmic:hover{background:#fff;color:#000}
/* Los blancos literales del tema oscuro (border-white/10, bg-white/5…) no
   existen sobre papel: se traducen al filete y al gris de fondo del documento. */
.o2-app [class*="border-white"]{border-color:var(--borde)}
.o2-app [class*="bg-white"]{background-color:var(--fondo2)}

/* — retícula de cajas — */
.o2-seccion{padding-block:clamp(3.5rem,8vw,6rem)}
.o2-cab{display:flex;flex-direction:column;gap:.6rem;margin-bottom:2.5rem}
.o2-h2{margin:0;font-size:clamp(1.75rem,4vw,2.5rem);line-height:1.1;font-weight:600;letter-spacing:-.04em;max-width:20ch;overflow-wrap:anywhere}
.o2-sub{margin:0;font-size:1rem;line-height:1.6;color:var(--suave);max-width:46ch}
.o2-cajas{display:grid;grid-template-columns:1fr;gap:1rem}
.o2-caja{border:1px solid var(--borde);border-radius:12px;padding:1.5rem;background:var(--papel);transition:border-color .15s ease,box-shadow .15s ease}
.o2-caja:hover{border-color:#000;box-shadow:0 2px 10px rgba(0,0,0,.06)}
.o2-caja h3{margin:.75rem 0 .5rem;font-size:1.0625rem;font-weight:600;letter-spacing:-.02em}
.o2-caja p{margin:0;font-size:.9375rem;line-height:1.6;color:var(--suave)}
@media (min-width:820px){.o2-cajas{grid-template-columns:repeat(3,minmax(0,1fr))}}

/* — banda invertida — */
.o2-inversa{background:#000;color:#fff}
.o2-inversa .o2-h2,.o2-inversa h3{color:#fff}
.o2-inversa .o2-sub,.o2-inversa p{color:#A1A1A1}
.o2-inversa .o2-mono{color:#7A7A7A}
.o2-tabla{border:1px solid #222;border-radius:12px;overflow:hidden}
.o2-fila{display:grid;grid-template-columns:1fr;gap:.35rem;padding:1.25rem 1.25rem;border-top:1px solid #222}
.o2-fila:first-child{border-top:0}
.o2-fila dt{font-size:1rem;font-weight:600;letter-spacing:-.02em;color:#fff}
.o2-fila dd{margin:0;font-size:.9375rem;line-height:1.6;color:#A1A1A1}
.o2-fila .o2-mono{color:#fff}
@media (min-width:820px){.o2-fila{grid-template-columns:11rem 13rem minmax(0,1fr);gap:1.5rem;align-items:baseline}}

/* — negativo — */
.o2-chips{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.5rem;padding:0;list-style:none}
.o2-chips li{border:1px solid var(--borde);border-radius:999px;padding:.4rem .85rem;font-size:.8125rem;color:var(--suave)}

/* — preguntas — */
.o2-faq{display:grid;gap:0;border-top:1px solid var(--borde)}
.o2-faq>div{padding:1.5rem 0;border-bottom:1px solid var(--borde);display:grid;gap:.5rem}
.o2-faq h3{margin:0;font-size:1rem;font-weight:600;letter-spacing:-.02em}
.o2-faq p{margin:0;font-size:.9375rem;line-height:1.6;color:var(--suave);max-width:62ch}
@media (min-width:820px){.o2-faq>div{grid-template-columns:24rem minmax(0,1fr);gap:2rem;align-items:baseline}}

/* — cierre y pie — */
.o2-cierre{border:1px solid var(--borde);border-radius:12px;padding:clamp(2rem,5vw,3.5rem);text-align:center;background:var(--fondo2);display:flex;flex-direction:column;align-items:center}
.o2-pie{border-top:1px solid var(--borde);margin-top:clamp(3rem,7vw,5rem)}
.o2-pie>div{display:grid;grid-template-columns:1fr;gap:2rem;padding-block:2.5rem 6rem}
.o2-pie h4{margin:0 0 .75rem;font-size:.8125rem;font-weight:500;color:#000}
.o2-pie ul{margin:0;padding:0;list-style:none;display:grid;gap:.55rem}
.o2-pie a{font-size:.8125rem;color:var(--suave);text-decoration:none}
.o2-pie a:hover{color:#000}
@media (min-width:640px){.o2-pie>div{grid-template-columns:2fr 1fr 1fr}}
`;

function Isotipo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 18 12 4l7 14M5 18l7-4m7 4-7-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="5" cy="18" r="1.8" fill="currentColor" />
      <circle cx="12" cy="4" r="1.8" fill="currentColor" />
      <circle cx="19" cy="18" r="1.8" fill="currentColor" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function Opcion2() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`o2 ${geist.variable}`}>
        <nav className="o2-nav" aria-label="Principal">
          <div className="o2-carril">
            <Link href="/opciones" className="o2-marca">
              <Isotipo />
              {MARCA.wordmark}
            </Link>
            <div className="o2-links">
              <a href="#como">Cómo funciona</a>
              <a href="#modelo">Modelo</a>
              <a href="#preguntas">Preguntas</a>
            </div>
            <Link href="/login" className="o2-btn">
              Entrar
            </Link>
          </div>
        </nav>

        <main>
          <div className="o2-carril">
            <section className="o2-hero">
              <p className="o2-pill">
                <b>Constela</b> para cualquier evento presencial
              </p>
              <h1 className="o2-h1">El networking que por fin se ve.</h1>
              <p className="o2-lede">{MARCA.definicion}</p>
              <div className="o2-acciones">
                <Link href="/login" className="o2-btn o2-btn-lg">
                  Continuar con Google
                </Link>
                <a href="#como" className="o2-btn o2-btn-ghost o2-btn-lg">
                  Ver cómo funciona
                </a>
              </div>
            </section>

            <figure className="o2-diagrama" style={{ margin: 0 }}>
              <figcaption className="o2-diagrama-cab">
                <span className="o2-mono">la red de un evento · diagrama</span>
                <span className="o2-mono">30 estrellas · cierres triádicos en azul</span>
              </figcaption>
              <div className="o2-lienzo">
                <RedSVG
                  n={30}
                  colores={["#000000"]}
                  colorSol="#000000"
                  colorLinea="#9B9B9B"
                  colorTriada="#0070F3"
                  grosor={0.7}
                  opacidadLinea={0.75}
                  halo={false}
                  picos={false}
                  nucleo={false}
                  corona={false}
                  escala={0.55}
                  preserveAspectRatio="xMidYMid meet"
                />
              </div>
            </figure>

            {/* El video antes de la explicación: quien no quiere leer se
                lleva la historia entera en 35 segundos. Mismo marco y misma
                cabecera que el diagrama — el documento tiene un solo tipo de
                figura, y dentro va el producto tal como es. */}
            <section className="o2-seccion" id="video">
              <div className="o2-cab">
                <span className="o2-mono">{VIDEO.etiqueta}</span>
                <h2 className="o2-h2">{VIDEO.titulo}</h2>
                <p className="o2-sub">{VIDEO.texto}</p>
              </div>
              <VideoDocumento marco={VIDEO.marco} pie={VIDEO.pie} />
            </section>

            <section className="o2-seccion" id="como">
              <div className="o2-cab">
                <span className="o2-mono">Cómo funciona</span>
                <h2 className="o2-h2">Tres gestos, cero solicitudes.</h2>
                <p className="o2-sub">
                  Una conexión solo puede nacer de un encuentro real. No hay forma
                  de fabricarla desde casa.
                </p>
              </div>
              <div className="o2-cajas">
                {PASOS.map((p) => (
                  <article key={p.n} className="o2-caja">
                    <span className="o2-mono">{p.n}</span>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="o2-inversa" id="modelo">
            <div className="o2-carril o2-seccion">
              <div className="o2-cab">
                <span className="o2-mono">Modelo</span>
                <h2 className="o2-h2">El cosmos mapea al dominio.</h2>
                <p className="o2-sub">
                  Cada objeto del cielo significa algo concreto del evento. No hay
                  metáfora decorativa.
                </p>
              </div>
              <dl className="o2-tabla" style={{ margin: 0 }}>
                {VOCABULARIO.map((v) => (
                  <div key={v.termino} className="o2-fila">
                    <dt>{v.termino}</dt>
                    <dd className="o2-mono">{v.dominio}</dd>
                    <dd>{v.texto}</dd>
                  </div>
                ))}
              </dl>
              <ul className="o2-chips" aria-label="Lo que Constela no hace">
                {NO_HACE.map((t) => (
                  <li key={t} style={{ borderColor: "#333", color: "#A1A1A1" }}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="o2-carril">
            <section className="o2-seccion" id="preguntas">
              <div className="o2-cab">
                <span className="o2-mono">Preguntas</span>
                <h2 className="o2-h2">Lo que se pregunta todo el mundo.</h2>
              </div>
              <div className="o2-faq">
                {PREGUNTAS.map((p) => (
                  <div key={p.q}>
                    <h3>{p.q}</h3>
                    <p>{p.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Lo último antes de la puerta es la app, no un argumento: el
                mapa real de /home sobre el evento de ejemplo. Los números de
                la cabecera salen de los datos, nunca del copy. */}
            <section className="o2-seccion" id="mapa">
              <div className="o2-cab">
                <span className="o2-mono">{MAPA.etiqueta}</span>
                <h2 className="o2-h2">{MAPA.titulo}</h2>
                <p className="o2-sub">{MAPA.texto}</p>
                <p className="o2-sub">{MAPA.textoDos}</p>
              </div>
              <figure className="o2-diagrama" style={{ margin: 0 }}>
                <figcaption className="o2-diagrama-cab">
                  <span className="o2-mono">
                    {MAPA.marco} · {DEMO_NODES.length} estrellas ·{" "}
                    {DEMO_EDGES.length} conexiones
                  </span>
                  <span className="o2-mono">{MAPA.pie}</span>
                </figcaption>
                <MapaDocumento />
              </figure>
            </section>

            <section className="o2-cierre">
              <h2 className="o2-h2" style={{ maxWidth: "18ch" }}>
                La próxima persona que conozcas ya es una estrella.
              </h2>
              <p className="o2-sub" style={{ marginTop: ".9rem" }}>
                {MARCA.tagline}.
              </p>
              <div className="o2-acciones">
                <Link href="/login" className="o2-btn o2-btn-lg">
                  Continuar con Google
                </Link>
              </div>
            </section>
          </div>

          <footer className="o2-pie">
            <div className="o2-carril">
              <div>
                <Link href="/opciones" className="o2-marca">
                  <Isotipo />
                  {MARCA.wordmark}
                </Link>
                <p className="o2-mono" style={{ marginTop: ".75rem" }}>
                  © 2026 Constela · {MARCA.tagline}
                </p>
              </div>
              <div>
                <h4>Producto</h4>
                <ul>
                  <li>
                    <a href="#como">Cómo funciona</a>
                  </li>
                  <li>
                    <a href="#modelo">Modelo</a>
                  </li>
                </ul>
              </div>
              <div>
                <h4>Legal</h4>
                <ul>
                  <li>
                    <Link href="/privacidad">Privacidad</Link>
                  </li>
                  <li>
                    <Link href="/terminos">Términos</Link>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
        </main>
      </div>
      <Conmutador n={2} />
    </>
  );
}
