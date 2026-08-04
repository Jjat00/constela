import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/app/login/google-button";
import { LogoutButton } from "@/app/login/logout-button";
import { JsonLd } from "@/components/json-ld";
import { Logo } from "@/components/logo";
import { ObsCSS } from "@/components/obs-css";
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
import {
  appLd,
  faqLd,
  glosarioLd,
  grafoLd,
  howToLd,
  orgLd,
  sitioLd,
} from "@/lib/seo";
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

/**
 * El canónico se declara aquí y no en el layout raíz: heredado, le diría a
 * Google que /privacidad y / son la misma página.
 */
export const metadata: Metadata = { alternates: { canonical: "/" } };

/**
 * Todo lo que esta página le cuenta a una máquina ya está escrito en ella:
 * la app y su precio (cero), los tres gestos como `HowTo`, las preguntas como
 * `FAQPage` y el vocabulario del dominio como glosario. Nada de esto es
 * información exclusiva del script — declarar en JSON-LD algo que el visitante
 * no puede leer es spam estructurado, y Google lo trata como tal.
 */
const LD = grafoLd(
  orgLd(),
  sitioLd(),
  appLd(),
  howToLd("Cómo se conecta con alguien en Constela", [...PASOS]),
  faqLd([...PREGUNTAS]),
  glosarioLd([...VOCABULARIO]),
);

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
      <ObsCSS doc />
      <JsonLd data={LD} />
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

          {/* Las dos páginas que explican la categoría, no el producto. Van
              aquí y no en el pie a propósito: son el único enlace interno de
              todo el sitio con texto descriptivo, y desde la portada es desde
              donde valen algo. Quien llegó hasta abajo sin entrar es
              exactamente quien todavía está comparando. */}
          <section className="obs-banda">
            <p className="obs-mono">Seguir leyendo</p>
            <h2 className="obs-titulo">
              Si todavía estás decidiendo cómo hacer networking.
            </h2>
            <div className="obs-siguiente">
              <Link href="/app-de-networking-para-eventos">
                <strong>
                  Qué es una app de networking para eventos, y en qué se
                  diferencian
                </strong>
                <span>
                  Las cuatro formas de intercambiar contactos en un evento
                  —papel, LinkedIn, la app del organizador y el escaneo
                  presencial— comparadas por lo que cuesta cada una y por lo
                  que queda después.
                </span>
              </Link>
              <Link href="/networking-en-eventos">
                <strong>
                  Cómo hacer networking en un evento sin que se te haga cuesta
                  arriba
                </strong>
                <span>
                  Qué falla antes de la conversación, por qué los contactos que
                  te llevas a casa casi nunca se convierten en nada y qué hacer
                  distinto la próxima vez que entres a un salón lleno de
                  desconocidos.
                </span>
              </Link>
            </div>
          </section>

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
