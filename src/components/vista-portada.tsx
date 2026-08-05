import Link from "next/link";
import { GoogleButton } from "@/app/(es)/login/google-button";
import { LogoutButton } from "@/app/(es)/login/logout-button";
import { JsonLd } from "@/components/json-ld";
import { Logo } from "@/components/logo";
import { ObsCSS } from "@/components/obs-css";
import { BienvenidaYMapa, VideoPortada } from "@/components/portada-demo";
import { RedSVG } from "@/components/red-svg";
import { SelectorIdioma } from "@/components/selector-idioma";
import { copy } from "@/lib/copy";
import { type Locale, RUTAS } from "@/lib/i18n";
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
 * POR QUÉ ES UN COMPONENTE Y NO `page.tsx`: la misma portada se sirve en dos
 * idiomas desde dos árboles distintos (`/` y `/en`). El copy entra por
 * `copy(locale)` y no queda una sola frase escrita aquí dentro — si aparece
 * una, es un texto que la portada inglesa enseñará en español.
 */

export function ldPortada(locale: Locale) {
  const c = copy(locale).portada;
  return grafoLd(
    orgLd(locale),
    sitioLd(),
    appLd(locale),
    howToLd(locale, c.pasos.howTo, [...c.pasos.lista]),
    faqLd([...c.preguntas.lista]),
    glosarioLd(locale, [...c.vocabulario.lista]),
  );
}

export async function VistaPortada({ locale }: { locale: Locale }) {
  const { portada: t, chrome } = copy(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // La puerta aparece dos veces —bajo el titular y en el cierre— y las dos
  // tienen que saber si ya hay sesión. Se arma una sola vez para que no
  // puedan diverger.
  const puerta = user ? (
    <Link href="/home" className="obs-cta">
      {chrome.entrarConstelacion}
    </Link>
  ) : (
    <div className="obs-puerta">
      <GoogleButton next="/home" textos={chrome.google} />
    </div>
  );

  return (
    <>
      <ObsCSS doc />
      <JsonLd data={ldPortada(locale)} />
      <div className="obs">
        <header className="obs-carril">
          <div className="obs-top">
            <Logo className="h-8 lg:h-9" priority />
            <div className="obs-top-fin">
              <SelectorIdioma locale={locale} pagina="portada" />
              {user ? (
                <LogoutButton />
              ) : (
                <Link href="/login" className="obs-entrar">
                  {chrome.entrar}
                </Link>
              )}
            </div>
          </div>
        </header>
        <div className="obs-regla" />

        <main className="obs-carril">
          <section className="obs-hero">
            <div>
              <p className="obs-mono">{t.hero.mono}</p>
              <h1 className="obs-h1">
                {t.marca.titular.antes}
                <br />
                <em>{t.marca.titular.destacado}</em>
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
                <b>{t.hero.ledeFuerte}</b> {t.marca.definicion}
              </p>
              <div className="obs-acciones">
                {puerta}
                <span className="obs-mono">{t.hero.tiempo}</span>
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
            {/* El verso del dominio cierra el hero, centrado y con la frase
                EXACTA que fue la meta description original. */}
            <p className="obs-verso">{t.hero.verso}</p>
          </section>

          {/* El video antes de la explicación: quien no quiere leer se lleva
              la historia entera en 35 segundos. Va justo debajo del diagrama
              del hero y en su misma tinta — el diagrama es la red dibujada, la
              película es la red dibujándose. */}
          <section className="obs-banda" id="video">
            <p className="obs-mono">{t.video.etiqueta}</p>
            <h2 className="obs-titulo">{t.video.titulo}</h2>
            <p className="obs-parrafo">{t.video.texto}</p>
            <VideoPortada video={t.video} demo={t.demo} />
          </section>

          <section className="obs-banda">
            <p className="obs-mono">{t.pasos.mono}</p>
            <h2 className="obs-titulo">{t.pasos.titulo}</h2>
            <div className="obs-rejilla3">
              {t.pasos.lista.map((p) => (
                <article key={p.n} className="obs-celda">
                  <span className="obs-mono">{p.n}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="obs-banda">
            <p className="obs-mono">{t.vocabulario.mono}</p>
            <h2 className="obs-titulo">{t.vocabulario.titulo}</h2>
            <dl className="obs-glosario">
              {t.vocabulario.lista.map((v) => (
                <div key={v.termino} className="obs-def">
                  <dt>{v.termino}</dt>
                  <dd className="obs-mono">{v.dominio}</dd>
                  <dd>{v.texto}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="obs-banda">
            <p className="obs-mono">{t.noHace.mono}</p>
            <ul className="obs-no">
              {t.noHace.lista.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>

          <section className="obs-banda">
            <p className="obs-mono">{t.preguntas.mono}</p>
            <div className="obs-preg">
              {t.preguntas.lista.map((p) => (
                <div key={p.q}>
                  <h3>{p.q}</h3>
                  <p>{p.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* El aviso de que el producto todavía habla español. Va aquí —justo
              antes de la parte jugable, que es la primera pantalla real de la
              app que se ve— y no en el pie: quien está a punto de tocar la
              interfaz merece saberlo antes, no después de entrar. En español
              es la cadena vacía y no se renderiza nada. */}
          {chrome.avisoIdiomaApp && (
            <p className="obs-aviso">{chrome.avisoIdiomaApp}</p>
          )}

          {/* Las dos últimas bandas van juntas y en cliente: la bienvenida
              real y el mapa real, encadenados — lo que eliges arriba filtra
              lo de abajo. */}
          <BienvenidaYMapa portada={t} ficha={chrome.ficha} />

          {/* Las dos páginas que explican la categoría, no el producto. Van
              aquí y no en el pie a propósito: son el único enlace interno de
              todo el sitio con texto descriptivo, y desde la portada es desde
              donde valen algo. Quien llegó hasta abajo sin entrar es
              exactamente quien todavía está comparando. */}
          <section className="obs-banda">
            <p className="obs-mono">{t.siguiente.mono}</p>
            <h2 className="obs-titulo">{t.siguiente.titulo}</h2>
            <div className="obs-siguiente">
              {t.siguiente.enlaces.map((e) => (
                <Link key={e.a} href={RUTAS[locale][e.a]}>
                  <strong>{e.titulo}</strong>
                  <span>{e.texto}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="obs-cierre">
            <div
              className="obs-regla"
              style={{ marginBottom: "clamp(2rem,5vw,3.5rem)" }}
            />
            <h2>{t.cierre.titulo}</h2>
            <div className="obs-acciones">
              {puerta}
              <span className="obs-mono">{t.marca.tagline}</span>
            </div>
          </section>

          <footer className="obs-pie">
            <span className="obs-mono">{chrome.copyright}</span>
            <nav aria-label={chrome.pieLegalAria}>
              <Link href="/privacidad" hrefLang="es">
                {chrome.privacidad}
              </Link>
              <Link href="/terminos" hrefLang="es">
                {chrome.terminos}
              </Link>
            </nav>
          </footer>
        </main>
      </div>
    </>
  );
}
