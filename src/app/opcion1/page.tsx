import type { Metadata } from "next";
import Link from "next/link";
import { interTight, plexMono } from "@/app/opciones/fuentes";
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
import { MapaObservatorio, VideoObservatorio } from "./demo";

/*
 * OPCIÓN 1 · «Observatorio» — minimalismo suizo, casi monocromo.
 *
 * TESIS: quitar el cine y dejar el instrumento. Un solo azul frío en toda la
 * página, retícula de 12 columnas visible, hairlines que cruzan a sangre y
 * cero cristal. La red del evento no ilumina: mide.
 * FORMA: documento largo con bandas separadas por línea de 1px; el titular
 * ocupa 7 columnas y la red las 5 restantes, recortada por el borde. Sin
 * cards, sin sombras, sin degradados — la jerarquía la hace el tamaño del
 * tipo y el aire, no el color.
 * TIPO: Inter Tight (display, tracking cerrado) + IBM Plex Mono (etiquetas).
 * MOTIVO PARA ELEGIRLA: es la que mejor envejece y la que más se parece a un
 * instrumento serio; renuncia al «wow» del cosmos a cambio de precisión.
 *
 * AÑADIDO (2026-08-03, a pedido del usuario): monta también el video de
 * presentación y la constelación real de ejemplo que la landing de producción
 * tiene bajo su hero. La trampa aquí es que el fondo ya coincide —esta
 * propuesta y el producto son las dos de noche—, así que parece que bastaría
 * con incrustarlos. No basta: lo que esta opción rechaza no es el color del
 * cielo, es el cine. El video se re-renderiza sin halos, sin picos, sin
 * corona, sin grano y sin oro (`Constela-obs-*` en `video/`, paleta
 * `OBSERVATORIO`) y el `ConstellationPanel` real se dibuja con
 * `TINTA_OBSERVATORIO` mientras su chrome se cuadra y se apaga redefiniendo
 * los tokens del tema dentro de `.o1-app`. Tres figuras y ninguna caja:
 * diagrama, película y mapa, cada una entre hairlines.
 */

export const metadata: Metadata = {
  title: "Opción 1 · Observatorio — Constela",
  description: "Propuesta de rediseño: minimalismo suizo, retícula y hairlines.",
};

const CSS = `
body{background:#0B0C0F}
.o1{--tinta:#F2F3F5;--suave:#8E939C;--tenue:#7C828C;--papel:#0B0C0F;--linea:rgba(255,255,255,.11);--azul:#6E9BFF;
  font-family:var(--f-inter-tight),ui-sans-serif,system-ui,sans-serif;letter-spacing:normal;
  background:var(--papel);color:var(--tinta);min-height:100svh;overflow-x:clip}
.o1 ::selection{background:rgba(110,155,255,.28)}
.o1 a:focus-visible,.o1 button:focus-visible{outline:2px solid var(--azul);outline-offset:3px;border-radius:2px}

.o1-carril{width:100%;max-width:88rem;margin:0 auto;padding-inline:clamp(1.25rem,4vw,4.5rem)}
.o1-regla{height:1px;background:var(--linea);width:100%}
.o1-mono{font-family:var(--f-plex-mono),ui-monospace,monospace;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--tenue)}

/* — chrome — */
.o1-top{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:4.5rem}
.o1-marca{font-size:1.0625rem;font-weight:600;letter-spacing:-.035em;color:var(--tinta);text-decoration:none}
.o1-marca i{font-style:normal;color:var(--azul)}
.o1-entrar{font-size:.8125rem;font-weight:500;color:var(--suave);text-decoration:none;padding:.55rem .1rem;transition:color .18s ease}
.o1-entrar:hover{color:var(--tinta)}

/* — hero — */
.o1-hero{display:grid;grid-template-columns:1fr;gap:clamp(2.5rem,5vw,3rem);padding-block:clamp(3.5rem,9vw,7rem) clamp(3rem,7vw,6rem);align-items:center}
.o1-h1{font-size:clamp(2.9rem,9.2vw,6.4rem);line-height:.95;font-weight:600;letter-spacing:-.05em;margin:0;overflow-wrap:anywhere;min-width:0}
.o1-h1 em{font-style:normal;color:var(--suave)}
.o1-lede{margin:clamp(1.5rem,3vw,2rem) 0 0;max-width:34rem;font-size:clamp(1rem,1.5vw,1.1875rem);line-height:1.55;color:var(--suave)}
.o1-lede b{color:var(--tinta);font-weight:500}
.o1-acciones{display:flex;flex-wrap:wrap;align-items:center;gap:1.25rem;margin-top:clamp(2rem,4vw,2.75rem)}
.o1-cta{display:inline-flex;align-items:center;height:3rem;padding-inline:1.75rem;background:var(--tinta);color:var(--papel);font-size:.9375rem;font-weight:500;letter-spacing:-.01em;text-decoration:none;border-radius:2px;transition:background-color .18s ease,transform .18s ease}
.o1-cta:hover{background:#fff;transform:translateY(-1px)}
.o1-cta:active{transform:translateY(0)}
.o1-red{position:relative;aspect-ratio:1;min-width:0;margin-inline:calc(clamp(1.25rem,4vw,4.5rem)*-1)}
.o1-red svg{position:absolute;inset:0;width:100%;height:100%;
  -webkit-mask-image:radial-gradient(62% 62% at 50% 50%,#000 35%,transparent 100%);
  mask-image:radial-gradient(62% 62% at 50% 50%,#000 35%,transparent 100%)}
@media (min-width:900px){
  .o1-hero{grid-template-columns:7fr 5fr;gap:clamp(2rem,4vw,4rem)}
  .o1-red{margin-inline:0;margin-right:calc(clamp(1.25rem,4vw,4.5rem)*-1)}
}

/* — bandas — */
.o1-banda{padding-block:clamp(3rem,6vw,5.5rem)}
.o1-titulo{font-size:clamp(1.5rem,3vw,2.25rem);line-height:1.12;font-weight:600;letter-spacing:-.04em;margin:.9rem 0 0;max-width:26ch;overflow-wrap:anywhere}
.o1-rejilla3{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(2rem,4vw,3rem)}
.o1-celda{padding:1.75rem 0;border-top:1px solid var(--linea)}
.o1-celda h3{margin:.75rem 0 .5rem;font-size:1.0625rem;font-weight:600;letter-spacing:-.03em}
.o1-celda p{margin:0;font-size:.9375rem;line-height:1.62;color:var(--suave);max-width:38ch}
@media (min-width:820px){
  .o1-rejilla3{grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
  .o1-celda{padding:2rem 2.25rem 0 0;border-top:1px solid var(--linea)}
  .o1-celda+.o1-celda{padding-left:2.25rem;border-left:1px solid var(--linea)}
}

.o1-parrafo{margin:1.25rem 0 0;max-width:56ch;font-size:.9375rem;line-height:1.62;color:var(--suave)}
.o1-parrafo+.o1-parrafo{margin-top:.9rem}

/* — la figura: una lámina entre reglas — */
/* Aquí no hay cajas: el marco de una figura es la misma hairline que separa
   las celdas del resto de la página, y sus datos van en una fila mono, no en
   una cabecera con fondo. El video ya viene re-renderizado en esta tinta
   (composición Constela-obs-* en video/), así que el fotograma no necesita
   passe-partout: lo que enseña es del mismo cielo que la página. */
.o1-figura{margin:clamp(2rem,4vw,3rem) 0 0}
.o1-figura-cab{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem 1.5rem;padding-block:.9rem;border-top:1px solid var(--linea)}
.o1-cab-fin{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1.25rem}
.o1-ctrl{display:inline-flex;align-items:center;height:1.9rem;padding-inline:.75rem;border:1px solid var(--linea);border-radius:2px;background:transparent;cursor:pointer;
  font-family:var(--f-plex-mono),ui-monospace,monospace;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--suave);
  transition:border-color .18s ease,color .18s ease}
.o1-ctrl:hover{border-color:var(--tinta);color:var(--tinta)}
.o1-fotograma{position:relative;aspect-ratio:9/16;border:1px solid var(--linea);background:var(--papel) url("/video/poster-obs-9x16.webp") center/cover no-repeat}
.o1-fotograma video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.o1-toque{position:absolute;inset:0;background:transparent;border:0;cursor:pointer}
@media (min-width:900px){.o1-fotograma{aspect-ratio:16/9;background-image:url("/video/poster-obs-16x9.webp")}}

/* — el mapa jugable, medido — */
/* La app entra con la tinta de la propuesta. El fondo casi coincide —las dos
   son de noche— y por eso lo que hay que traducir no es el papel: es el oro
   de «tú», el H-alfa de los triángulos, el cristal y todas las esquinas
   redondas. Se redefinen los tokens del tema para que TODO el chrome del
   panel —escrito con utilidades de la app: text-muted-foreground, bg-celeste/15,
   .glass, .chip-star— se resuelva en esta escuela sin tocar el componente.
   Funciona porque este <style> va sin @layer y gana a globals.css. */
.o1-app{position:relative;height:76svh;max-height:44rem;min-height:28rem;border:1px solid var(--linea);overflow:hidden;
  background:var(--papel);color:var(--tinta);
  font-family:var(--f-inter-tight),ui-sans-serif,system-ui,sans-serif;letter-spacing:normal;
  --foreground:#F2F3F5;--muted-foreground:#8E939C;--faint:#7C828C;--background:#0B0C0F;
  --celeste:#6E9BFF;--cosmic:#6E9BFF;--sol:#F2F3F5;--halfa:#6E9BFF;--estrella-a:#B9BEC7;
  /* Toda la escala de radios cuelga de --radius: un solo número deja las
     cards del mini-perfil en la esquina de 2px de esta opción. */
  --radius:.125rem;
  /* El mono de la app es Geist Mono; el de esta propuesta, Plex Mono. Se
     cambia en la variable, que es de donde cuelga la utilidad font-mono. */
  --font-geist-mono:var(--f-plex-mono)}
.o1-app-espera{display:grid;height:100%;place-items:center}
/* El cristal se vuelve superficie: opaca, con filete y sin sombra. La tesis
   de la propuesta es literalmente que aquí no hay vidrio. */
.o1-app .glass{background:var(--papel);border:1px solid var(--linea);border-radius:2px;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none}
/* Y no hay una sola píldora: ni en los chips, ni en el chrome del panel.
   rounded-full no cuelga de --radius, así que se cuadra a mano. */
.o1-app [class*="rounded-full"],.o1-app .chip-star,.o1-app .chip-triad,.o1-app .btn-sol,.o1-app .btn-cosmic{border-radius:2px}
.o1-app :is(.chip-star,.chip-triad,.btn-sol){border:1px solid var(--linea);background:transparent;color:var(--suave)}
.o1-app :is(.chip-star,.chip-triad,.btn-sol):hover{border-color:var(--tinta);background:transparent;color:var(--tinta)}
/* Puesto = tinta plena invertida, que es como esta página marca su acción
   principal. No hay color de estado en esta escuela — salvo el azul, que se
   reserva para lo que ya era azul: los cierres triádicos. */
.o1-app .chip-star[data-active="true"],.o1-app .chip-star[aria-pressed="true"]{border-color:var(--tinta);background:var(--tinta);color:var(--papel)}
.o1-app .chip-triad[data-active="true"],.o1-app .chip-triad[aria-pressed="true"]{border-color:var(--azul);background:rgba(110,155,255,.14);color:var(--azul)}
.o1-app .btn-cosmic{border:1px solid var(--tinta);background:var(--tinta);color:var(--papel);backdrop-filter:none;-webkit-backdrop-filter:none}
.o1-app .btn-cosmic:hover{background:#fff;color:var(--papel)}

/* — glosario — */
.o1-glosario{margin:clamp(2rem,4vw,3rem) 0 0;display:grid;grid-template-columns:1fr;gap:0}
.o1-def{display:grid;grid-template-columns:1fr;gap:.35rem;padding:1.5rem 0;border-top:1px solid var(--linea)}
.o1-def dt{font-size:1.125rem;font-weight:600;letter-spacing:-.035em}
.o1-def dd{margin:0;font-size:.9375rem;line-height:1.6;color:var(--suave);max-width:52ch}
.o1-def .o1-mono{color:var(--azul)}
@media (min-width:820px){
  .o1-def{grid-template-columns:14rem 12rem minmax(0,1fr);align-items:baseline;gap:2rem}
}

/* — negativo — */
.o1-no{display:flex;flex-wrap:wrap;gap:.5rem 2rem;margin-top:1.5rem;padding:0;list-style:none}
.o1-no li{font-size:.9375rem;color:var(--suave);display:flex;align-items:center;gap:.6rem}
.o1-no li::before{content:"";width:14px;height:1px;background:var(--azul);flex:none}

/* — preguntas — */
.o1-preg{margin-top:clamp(2rem,4vw,3rem);display:grid;gap:0}
.o1-preg>div{padding:1.5rem 0;border-top:1px solid var(--linea);display:grid;gap:.5rem}
.o1-preg h3{margin:0;font-size:1rem;font-weight:600;letter-spacing:-.03em}
.o1-preg p{margin:0;font-size:.9375rem;line-height:1.6;color:var(--suave);max-width:60ch}
@media (min-width:820px){.o1-preg>div{grid-template-columns:26rem minmax(0,1fr);gap:2rem;align-items:baseline}}

/* — cierre — */
.o1-cierre{padding-block:clamp(4rem,9vw,8rem);text-align:left}
.o1-cierre h2{font-size:clamp(2rem,6vw,4rem);line-height:1;font-weight:600;letter-spacing:-.05em;margin:0;overflow-wrap:anywhere}
.o1-pie{padding-block:2.5rem 6rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;border-top:1px solid var(--linea)}
.o1-pie nav{display:flex;gap:1.5rem}
.o1-pie a{font-size:.8125rem;color:var(--tenue);text-decoration:none;transition:color .18s ease}
.o1-pie a:hover{color:var(--tinta)}
`;

export default function Opcion1() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`o1 ${interTight.variable} ${plexMono.variable}`}>
        <header className="o1-carril">
          <div className="o1-top">
            <Link href="/opciones" className="o1-marca">
              {MARCA.wordmark}
              <i>✦</i>
            </Link>
            <Link href="/login" className="o1-entrar">
              Entrar →
            </Link>
          </div>
        </header>
        <div className="o1-regla" />

        <main className="o1-carril">
          <section className="o1-hero">
            <div>
              <p className="o1-mono">Constela · para cualquier evento</p>
              <h1 className="o1-h1">
                Tu red es
                <br />
                <em>tu universo.</em>
              </h1>
              <p className="o1-lede">
                <b>{MARCA.nombre} es el networking que por fin se ve.</b>{" "}
                {MARCA.definicion}
              </p>
              <div className="o1-acciones">
                <Link href="/login" className="o1-cta">
                  Continuar con Google
                </Link>
                <span className="o1-mono">8 segundos</span>
              </div>
            </div>
            <div className="o1-red">
              <RedSVG
                colores={["#8E939C", "#B9BEC7", "#E4E7EC", "#8E939C", "#6E9BFF"]}
                colorSol="#F2F3F5"
                colorLinea="#8E939C"
                colorTriada="#6E9BFF"
                grosor={0.55}
                opacidadLinea={0.4}
                halo={false}
                picos={false}
                corona={false}
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
          </section>

          {/* El video antes de la explicación: quien no quiere leer se lleva
              la historia entera en 35 segundos. Va justo debajo del diagrama
              del hero y en su misma tinta — el diagrama es la red dibujada, la
              película es la red dibujándose. */}
          <section className="o1-banda" id="video">
            <p className="o1-mono">{VIDEO.etiqueta}</p>
            <h2 className="o1-titulo">{VIDEO.titulo}</h2>
            <p className="o1-parrafo">{VIDEO.texto}</p>
            <VideoObservatorio marco={VIDEO.marco} pie={VIDEO.pie} />
          </section>

          <section className="o1-banda">
            <p className="o1-mono">Cómo funciona</p>
            <h2 className="o1-titulo">
              Tres gestos, ninguno remoto: la conexión existe porque os visteis.
            </h2>
            <div className="o1-rejilla3">
              {PASOS.map((p) => (
                <article key={p.n} className="o1-celda">
                  <span className="o1-mono">{p.n}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="o1-banda">
            <p className="o1-mono">Vocabulario</p>
            <h2 className="o1-titulo">El cosmos no es decoración: es el modelo.</h2>
            <dl className="o1-glosario">
              {VOCABULARIO.map((v) => (
                <div key={v.termino} className="o1-def">
                  <dt>{v.termino}</dt>
                  <dd className="o1-mono">{v.dominio}</dd>
                  <dd>{v.texto}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="o1-banda">
            <p className="o1-mono">Lo que no encontrarás</p>
            <ul className="o1-no">
              {NO_HACE.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          <section className="o1-banda">
            <p className="o1-mono">Preguntas</p>
            <div className="o1-preg">
              {PREGUNTAS.map((p) => (
                <div key={p.q}>
                  <h3>{p.q}</h3>
                  <p>{p.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Lo último antes de la puerta es el instrumento, no un argumento:
              el mapa real de /home sobre el evento de ejemplo. Los números de
              la fila de datos salen de los datos, nunca del copy. */}
          <section className="o1-banda" id="mapa">
            <p className="o1-mono">{MAPA.etiqueta}</p>
            <h2 className="o1-titulo">{MAPA.titulo}</h2>
            <p className="o1-parrafo">{MAPA.texto}</p>
            <p className="o1-parrafo">{MAPA.textoDos}</p>
            <figure className="o1-figura">
              <figcaption className="o1-figura-cab">
                <span className="o1-mono">
                  {MAPA.marco} · {DEMO_NODES.length} estrellas ·{" "}
                  {DEMO_EDGES.length} conexiones
                </span>
                <span className="o1-mono">{MAPA.pie}</span>
              </figcaption>
              <MapaObservatorio />
            </figure>
          </section>

          <section className="o1-cierre">
            <div className="o1-regla" style={{ marginBottom: "clamp(2rem,5vw,3.5rem)" }} />
            <h2>Entra por una estrella.</h2>
            <div className="o1-acciones">
              <Link href="/login" className="o1-cta">
                Continuar con Google
              </Link>
              <span className="o1-mono">{MARCA.tagline}</span>
            </div>
          </section>

          <footer className="o1-pie">
            <span className="o1-mono">© 2026 Constela</span>
            <nav aria-label="Enlaces legales">
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
            </nav>
          </footer>
        </main>
      </div>
      <Conmutador n={1} />
    </>
  );
}
