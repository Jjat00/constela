import Link from "next/link";
import { GoogleButton } from "@/app/login/google-button";
import { LogoutButton } from "@/app/login/logout-button";
import { Logo } from "@/components/logo";
import { BienvenidaYMapa, VideoPortada } from "@/components/portada-demo";
import { RedSVG } from "@/components/red-svg";
import {
  MARCA,
  NO_HACE,
  PASOS,
  PREGUNTAS,
  VIDEO,
  VOCABULARIO,
} from "@/lib/portada";
import { createClient } from "@/lib/supabase/server";

/*
 * CONTRATO DE DIRECCIÓN — v6 «Observatorio»
 *
 * DE DÓNDE SALE: el usuario pidió diez rediseños de portada, los revisó y se
 * quedó con la propuesta 1 (2026-08-04). Esto es esa propuesta promovida a
 * producción — ya no una maqueta: logo real, sesión real, OAuth real. Las
 * otras nueve y la maqueta original se retiraron el mismo día: viven en el
 * historial de git, no en el árbol.
 *
 * THESIS: quitar el cine y dejar el instrumento. Un solo azul frío en toda la
 * página, retícula de 12 columnas, hairlines que cruzan a sangre y cero
 * cristal. La red del evento no ilumina: mide.
 * OWN-WORLD: papel liso #0B0C0F, filete blanco al 11 %, esquina de 2px, Inter
 * Tight + IBM Plex Mono. Sin cards, sin sombras, sin degradados — la jerarquía
 * la hacen el tamaño del tipo y el aire, no el color. La acción principal es
 * tinta plena invertida, nunca una píldora de color.
 * STORY: ver la red dibujada → «tu red es tu universo» → la película de 35 s →
 * los tres gestos → el vocabulario → lo que NO hace → el mapa de verdad, que
 * se toca → entrar con Google en 8 segundos.
 * FORM: documento largo con bandas separadas por línea de 1px; el titular
 * ocupa 7 columnas y la red las 5 restantes, recortada por el borde.
 *
 * Tres figuras y ninguna caja —diagrama, película y mapa—, cada una entre
 * hairlines. Las dos últimas no son ilustración: son la aplicación corriendo
 * sobre el evento de ejemplo (`src/lib/demo-universe.ts`).
 *
 * La app entera habla este idioma desde `globals.css`, así que aquí NO se
 * traduce nada. Si el mapa de esta página se viera distinto al de `/home`, el
 * que está mal es este archivo.
 *
 * QUÉ SE INJERTÓ de la landing v5: la banda «Entras con Google y dices quién
 * eres» —la bienvenida real, jugable— que la propuesta 1 no traía y que el
 * usuario pidió conservar. Va pegada al mapa y en su mismo componente de
 * cliente (`BienvenidaYMapa`), porque lo que eliges en ella es el filtro que
 * se aplica abajo: esa cadena es el argumento entero de la portada.
 */

const CSS = `
.obs{overflow-x:clip;min-height:100svh}
.obs a:focus-visible,.obs button:focus-visible{outline:2px solid var(--celeste);outline-offset:3px;border-radius:2px}

.obs-carril{width:100%;max-width:88rem;margin:0 auto;padding-inline:clamp(1.25rem,4vw,4.5rem)}
.obs-regla{height:1px;background:var(--border);width:100%}
.obs-mono{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}

/* — chrome — */
.obs-top{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:4.5rem}
.obs-entrar{font-size:.8125rem;font-weight:500;color:var(--muted-foreground);text-decoration:none;padding:.55rem .1rem;transition:color .18s ease}
.obs-entrar:hover{color:var(--foreground)}

/* — hero — */
/* En móvil el hero es una banda más y se lee de arriba abajo. A partir de
   900px se le da la altura del viewport MENOS la cabecera y su contenido se
   centra con align-content: es lo que pidió el usuario —«en el laptop, el
   hero centrado verticalmente»— y lo que evita que el titular caiga bajo el
   pliegue en portátiles de 1440×780. Si el contenido creciera más que el
   viewport, min-height cede y la página scrollea; nada se recorta. */
.obs-hero{display:grid;grid-template-columns:1fr;gap:clamp(2.5rem,5vw,3rem);padding-block:clamp(3.5rem,9vw,7rem) clamp(3rem,7vw,6rem);align-items:center}
.obs-h1{font-size:clamp(2.9rem,9.2vw,6.4rem);line-height:.95;font-weight:600;letter-spacing:-.05em;margin:0;overflow-wrap:anywhere;min-width:0}
.obs-h1 em{font-style:normal;color:var(--muted-foreground)}
.obs-lede{margin:clamp(1.5rem,3vw,2rem) 0 0;max-width:34rem;font-size:clamp(1rem,1.5vw,1.1875rem);line-height:1.55;color:var(--muted-foreground)}
.obs-lede b{color:var(--foreground);font-weight:500}
.obs-acciones{display:flex;flex-wrap:wrap;align-items:center;gap:1.25rem;margin-top:clamp(2rem,4vw,2.75rem)}
/* La puerta de verdad: el botón de Google es un componente de cliente que se
   comparte con /login, así que se le da el ancho desde fuera en vez de
   re-vestirlo aquí. Su alto (3.5rem) es el que replica .obs-cta. */
.obs-puerta{width:100%;max-width:21rem}
.obs-cta{display:inline-flex;align-items:center;height:3.5rem;padding-inline:1.75rem;background:var(--foreground);color:var(--background);font-size:.9375rem;font-weight:500;letter-spacing:-.01em;text-decoration:none;border-radius:var(--radius);transition:background-color .18s ease,transform .18s ease}
.obs-cta:hover{background:#fff;transform:translateY(-1px)}
.obs-cta:active{transform:translateY(0)}
.obs-red{position:relative;aspect-ratio:1;min-width:0;margin-inline:calc(clamp(1.25rem,4vw,4.5rem)*-1)}
.obs-red svg{position:absolute;inset:0;width:100%;height:100%;
  -webkit-mask-image:radial-gradient(62% 62% at 50% 50%,#000 35%,transparent 100%);
  mask-image:radial-gradient(62% 62% at 50% 50%,#000 35%,transparent 100%)}
@media (min-width:900px){
  .obs-hero{grid-template-columns:7fr 5fr;gap:clamp(2rem,4vw,4rem);
    min-height:calc(100svh - 4.5rem - 1px);align-content:center;
    padding-block:clamp(2rem,4vw,4rem)}
  .obs-red{margin-inline:0;margin-right:calc(clamp(1.25rem,4vw,4.5rem)*-1)}
}

/* — bandas — */
.obs-banda{padding-block:clamp(3rem,6vw,5.5rem)}
.obs-titulo{font-size:clamp(1.5rem,3vw,2.25rem);line-height:1.12;font-weight:600;letter-spacing:-.04em;margin:.9rem 0 0;max-width:26ch;overflow-wrap:anywhere}
.obs-rejilla3{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(2rem,4vw,3rem)}
.obs-celda{padding:1.75rem 0;border-top:1px solid var(--border)}
.obs-celda h3{margin:.75rem 0 .5rem;font-size:1.0625rem;font-weight:600;letter-spacing:-.03em}
.obs-celda p{margin:0;font-size:.9375rem;line-height:1.62;color:var(--muted-foreground);max-width:38ch}
@media (min-width:820px){
  .obs-rejilla3{grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
  .obs-celda{padding:2rem 2.25rem 0 0;border-top:1px solid var(--border)}
  .obs-celda+.obs-celda{padding-left:2.25rem;border-left:1px solid var(--border)}
}

.obs-parrafo{margin:1.25rem 0 0;max-width:56ch;font-size:.9375rem;line-height:1.62;color:var(--muted-foreground)}
.obs-parrafo+.obs-parrafo{margin-top:.9rem}

/* Banda a sangre: el titular y los párrafos sueltan su medida y ocupan el
   carril entero. Es una excepción pedida a mano por el usuario para la banda
   del mapa, donde la medida corta dejaba media página vacía y el bloque se
   leía como una columna huérfana. Es a propósito, no un descuido: la línea
   pasa de 56 a ~140 caracteres, así que NO se aplique a bandas nuevas sin
   volver a decidirlo. */
.obs-banda-ancha .obs-titulo,.obs-banda-ancha .obs-parrafo{max-width:none}

/* — la figura: una lámina entre reglas — */
/* Aquí no hay cajas: el marco de una figura es la misma hairline que separa
   las celdas del resto de la página, y sus datos van en una fila mono, no en
   una cabecera con fondo. El video ya viene renderizado en esta tinta
   (composición Constela-obs-* en video/), así que el fotograma no necesita
   passe-partout: lo que enseña es del mismo cielo que la página. */
.obs-figura{margin:clamp(2rem,4vw,3rem) 0 0}
.obs-figura-cab{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem 1.5rem;padding-block:.9rem;border-top:1px solid var(--border)}
.obs-cab-fin{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1.25rem}
.obs-ctrl{display:inline-flex;align-items:center;height:1.9rem;padding-inline:.75rem;border:1px solid var(--border);border-radius:var(--radius);background:transparent;cursor:pointer;
  font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted-foreground);
  transition:border-color .18s ease,color .18s ease}
.obs-ctrl:hover{border-color:var(--foreground);color:var(--foreground)}
.obs-fotograma{position:relative;aspect-ratio:9/16;border:1px solid var(--border);background:var(--background) url("/video/poster-obs-9x16.webp") center/cover no-repeat}
.obs-fotograma video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.obs-toque{position:absolute;inset:0;background:transparent;border:0;cursor:pointer}
@media (min-width:900px){.obs-fotograma{aspect-ratio:16/9;background-image:url("/video/poster-obs-16x9.webp")}}

/* — el mapa jugable — */
/* Solo el marco. Todo el chrome del panel —cristal, chips, esquinas, tinta—
   ya se resuelve en esta escuela desde globals.css, y eso es lo que permite
   que la sección prometa que ninguna pantalla está maquetada. */
.obs-app{position:relative;height:76svh;max-height:44rem;min-height:28rem;border:1px solid var(--border);overflow:hidden;background:var(--background)}
.obs-app-espera{display:grid;height:100%;place-items:center}

/* — la ficha del formulario: la misma lámina entre filetes que las figuras —
   El botón apagado no es un botón gris: es el mismo rectángulo con filete y
   tinta tenue, para que el salto a tinta plena al elegir el primer rol se lea
   como que algo se encendió. */
.obs-ficha{margin:clamp(2rem,4vw,3rem) 0 0;border:1px solid var(--border);padding:clamp(1.25rem,3vw,2rem)}
.obs-campos{display:grid;gap:1.75rem}
@media (min-width:900px){.obs-campos{grid-template-columns:repeat(3,minmax(0,1fr));gap:2.25rem}}
.obs-ficha-pie{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.5rem;margin-top:1.75rem;padding-top:1.5rem;border-top:1px solid var(--border)}
.obs-cta-apagado{display:inline-flex;align-items:center;height:3.5rem;padding-inline:1.75rem;border:1px solid var(--border);background:transparent;color:var(--faint);font-size:.9375rem;font-weight:500;border-radius:var(--radius);cursor:not-allowed}
.obs-nota{margin:.9rem 0 0}

/* — glosario — */
.obs-glosario{margin:clamp(2rem,4vw,3rem) 0 0;display:grid;grid-template-columns:1fr;gap:0}
.obs-def{display:grid;grid-template-columns:1fr;gap:.35rem;padding:1.5rem 0;border-top:1px solid var(--border)}
.obs-def dt{font-size:1.125rem;font-weight:600;letter-spacing:-.035em}
.obs-def dd{margin:0;font-size:.9375rem;line-height:1.6;color:var(--muted-foreground);max-width:52ch}
.obs-def .obs-mono{color:var(--celeste)}
@media (min-width:820px){
  .obs-def{grid-template-columns:14rem 12rem minmax(0,1fr);align-items:baseline;gap:2rem}
}

/* — negativo — */
.obs-no{display:flex;flex-wrap:wrap;gap:.5rem 2rem;margin-top:1.5rem;padding:0;list-style:none}
.obs-no li{font-size:.9375rem;color:var(--muted-foreground);display:flex;align-items:center;gap:.6rem}
.obs-no li::before{content:"";width:14px;height:1px;background:var(--celeste);flex:none}

/* — preguntas — */
.obs-preg{margin-top:clamp(2rem,4vw,3rem);display:grid;gap:0}
.obs-preg>div{padding:1.5rem 0;border-top:1px solid var(--border);display:grid;gap:.5rem}
.obs-preg h3{margin:0;font-size:1rem;font-weight:600;letter-spacing:-.03em}
.obs-preg p{margin:0;font-size:.9375rem;line-height:1.6;color:var(--muted-foreground);max-width:60ch}
@media (min-width:820px){.obs-preg>div{grid-template-columns:26rem minmax(0,1fr);gap:2rem;align-items:baseline}}

/* — cierre — */
.obs-cierre{padding-block:clamp(4rem,9vw,8rem);text-align:left}
.obs-cierre h2{font-size:clamp(2rem,6vw,4rem);line-height:1;font-weight:600;letter-spacing:-.05em;margin:0;overflow-wrap:anywhere}
.obs-pie{padding-block:2.5rem 6rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;border-top:1px solid var(--border)}
.obs-pie nav{display:flex;gap:1.5rem}
.obs-pie a{font-size:.8125rem;color:var(--faint);text-decoration:none;transition:color .18s ease}
.obs-pie a:hover{color:var(--foreground)}
`;

export default async function Portada() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // La puerta aparece dos veces —bajo el titular y en el cierre— y las dos
  // tienen que saber si ya hay sesión. Se arma una sola vez para que no
  // puedan diverger.
  const puerta = user ? (
    <Link href="/home" className="obs-cta">
      Entrar a tu constelación
    </Link>
  ) : (
    <div className="obs-puerta">
      <GoogleButton next="/home" />
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="obs">
        <header className="obs-carril">
          <div className="obs-top">
            <Logo className="h-8 lg:h-9" priority />
            {user ? (
              <LogoutButton />
            ) : (
              <Link href="/login" className="obs-entrar">
                Entrar →
              </Link>
            )}
          </div>
        </header>
        <div className="obs-regla" />

        <main className="obs-carril">
          <section className="obs-hero">
            <div>
              <p className="obs-mono">Constela · para cualquier evento</p>
              <h1 className="obs-h1">
                {MARCA.titular.antes}
                <br />
                <em>{MARCA.titular.destacado}</em>
              </h1>
              {/* El titular es poesía; esta es la definición, y va primero en
                  tinta plena porque quien llega aquí acaba de ser escaneado
                  por un desconocido y no sabe qué es esto (PRODUCT.md: cada
                  pantalla es una primera impresión). Es también lo que pide la
                  verificación de marca de Google —el nombre como texto legible
                  y el propósito explicado—, imposible desde el logo, que es un
                  PNG: sin esta línea «Constela» solo viviría en el título del
                  documento y en un alt, y el alt no cuenta. */}
              <p className="obs-lede">
                <b>{MARCA.nombre} es el networking que por fin se ve.</b>{" "}
                {MARCA.definicion}
              </p>
              <div className="obs-acciones">
                {puerta}
                <span className="obs-mono">8 segundos</span>
              </div>
            </div>
            <div className="obs-red">
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
          <section className="obs-banda" id="video">
            <p className="obs-mono">{VIDEO.etiqueta}</p>
            <h2 className="obs-titulo">{VIDEO.titulo}</h2>
            <p className="obs-parrafo">{VIDEO.texto}</p>
            <VideoPortada marco={VIDEO.marco} pie={VIDEO.pie} />
          </section>

          <section className="obs-banda">
            <p className="obs-mono">Cómo funciona</p>
            <h2 className="obs-titulo">
              Tres gestos, ninguno remoto: la conexión existe porque se vieron.
            </h2>
            <div className="obs-rejilla3">
              {PASOS.map((p) => (
                <article key={p.n} className="obs-celda">
                  <span className="obs-mono">{p.n}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="obs-banda">
            <p className="obs-mono">Vocabulario</p>
            <h2 className="obs-titulo">
              El cosmos no es decoración: es el modelo.
            </h2>
            <dl className="obs-glosario">
              {VOCABULARIO.map((v) => (
                <div key={v.termino} className="obs-def">
                  <dt>{v.termino}</dt>
                  <dd className="obs-mono">{v.dominio}</dd>
                  <dd>{v.texto}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="obs-banda">
            <p className="obs-mono">Lo que no encontrarás</p>
            <ul className="obs-no">
              {NO_HACE.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          <section className="obs-banda">
            <p className="obs-mono">Preguntas</p>
            <div className="obs-preg">
              {PREGUNTAS.map((p) => (
                <div key={p.q}>
                  <h3>{p.q}</h3>
                  <p>{p.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Las dos últimas bandas van juntas y en cliente: la bienvenida
              real y el mapa real, encadenados — lo que eliges arriba filtra
              lo de abajo. */}
          <BienvenidaYMapa />

          <section className="obs-cierre">
            <div
              className="obs-regla"
              style={{ marginBottom: "clamp(2rem,5vw,3.5rem)" }}
            />
            <h2>Entra por una estrella.</h2>
            <div className="obs-acciones">
              {puerta}
              <span className="obs-mono">{MARCA.tagline}</span>
            </div>
          </section>

          <footer className="obs-pie">
            <span className="obs-mono">© 2026 Constela</span>
            <nav aria-label="Enlaces legales">
              <Link href="/privacidad">Privacidad</Link>
              <Link href="/terminos">Términos</Link>
            </nav>
          </footer>
        </main>
      </div>
    </>
  );
}
