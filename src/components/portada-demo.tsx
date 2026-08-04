"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import type { ActiveFilters } from "@/components/constellation-panel";
import { OnboardingFields } from "@/components/onboarding-fields";
import type { Chrome, Portada } from "@/lib/copy";
import {
  DEMO_CATALOG,
  DEMO_EDGES,
  DEMO_EVENT,
  DEMO_FACETS,
  DEMO_ME_ID,
  DEMO_NODES,
} from "@/lib/demo-universe";
import { slugifyTag, type TagChoice } from "@/lib/tags";

/*
 * Las dos piezas jugables de la portada: el video de presentación y el mapa
 * real de `/home` corriendo sobre el evento de ejemplo.
 *
 * Ninguna de las dos lleva paleta propia. Mientras esto fue una propuesta sí:
 * había que traducir el producto —el oro, el H-alfa, los halos, las esquinas
 * redondas— al idioma de la propuesta con un prop `paleta` y una tanda de
 * overrides de tokens. Al promover la propuesta a producción (2026-08-04)
 * esos overrides subieron a `globals.css` y al default del grafo, así que
 * aquí ya no queda traducción: el mapa se dibuja como se dibuja en la app.
 * Esa es justamente la promesa de la sección —«todo lo que se ve es la
 * aplicación»—, y si algún día los dos divergen, el que está mal es este
 * archivo.
 */

function MapaDurmiendo({ aviso }: { aviso?: string }) {
  return (
    <div className="obs-app-espera">
      <span className="obs-mono">{aviso}</span>
    </div>
  );
}

/**
 * El panel real de `/home`, cargado aparte: arrastra el motor de canvas del
 * grafo, y quien solo lee la página no debería descargarlo.
 *
 * El `loading` no lleva copy: es el parpadeo entre que el mapa entra en el
 * viewport y termina de llegar su código, y para entonces la banda ya enseñó
 * su propio aviso. Poner texto aquí obligaría a pasarle el idioma a un
 * `dynamic()` que se evalúa en el módulo, fuera de todo componente.
 */
const ConstellationPanel = dynamic(
  () =>
    import("@/components/constellation-panel").then((m) => m.ConstellationPanel),
  { ssr: false, loading: () => <MapaDurmiendo /> },
);

/**
 * Suscripción vacía a propósito: las dos consultas de abajo se leen una sola
 * vez. Re-suscribirse haría que cruzar los 900px cambiara el archivo a media
 * reproducción, y eso obliga a un `load()` que deja el video parado en su
 * póster — peor que servir el encuadre con el que se entró. Va fuera del
 * componente para que su identidad sea estable entre renders.
 */
const SIN_SUSCRIPCION = () => () => {};

/** Una media query sin cascada de renders: `null` en servidor y en el pase de
 *  hidratación, el valor real en cuanto manda el cliente. */
function useConsulta(consulta: string): boolean | null {
  return useSyncExternalStore(
    SIN_SUSCRIPCION,
    () => window.matchMedia(consulta).matches,
    () => null,
  );
}

/**
 * El video de presentación (35 s, hecho en Remotion — el proyecto vive en
 * `video/`), en la tinta del observatorio: no es un master metido en un marco,
 * sino el mismo guion renderizado sin cine —`Constela-obs-*`, paleta
 * `OBSERVATORIO`—, con Inter Tight, IBM Plex Mono y un solo azul frío.
 *
 * Tres cuidados que no son opcionales, porque la escena de uso es un teléfono,
 * en datos, de pie:
 * - nada se descarga hasta que el marco se acerca al viewport (`preload="none"`
 *   + IntersectionObserver): la página no paga 1,4 MB por adelantado;
 * - se monta UNA sola etiqueta, la del encuadre que toca, porque un `<video>`
 *   oculto por CSS igual descarga;
 * - con `prefers-reduced-motion` no arranca solo: se queda en su fotograma.
 */
export function VideoPortada({
  video,
  demo,
}: {
  video: Portada["video"];
  demo: Portada["demo"];
}) {
  const { marco, pie } = video;
  const marcoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sonando, setSonando] = useState(false);

  // Qué archivo pedir lo decide el encuadre, no el ancho del contenedor. El
  // corte es el de la retícula de la portada (900px), no el del documento.
  const apaisado = useConsulta("(min-width: 900px)");
  const orientacion = apaisado === null ? null : apaisado ? "16x9" : "9x16";
  const calma = useConsulta("(prefers-reduced-motion: reduce)") ?? false;

  useEffect(() => {
    const marco = marcoRef.current;
    if (!marco) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        const video = videoRef.current;
        if (!video || calma) return;
        if (entrada.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.25 },
    );
    observador.observe(marco);
    return () => observador.disconnect();
  }, [calma]);

  function alternar() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  }

  return (
    <figure className="obs-figura">
      {/* El mando va en la fila de datos, no encima de la imagen: en esta
          escuela nada flota sobre nada. */}
      <figcaption className="obs-figura-cab">
        <span className="obs-mono">{marco}</span>
        <span className="obs-cab-fin">
          <span className="obs-mono">{pie}</span>
          <button type="button" onClick={alternar} className="obs-ctrl">
            {sonando ? demo.pausar : demo.reproducir}
          </button>
        </span>
      </figcaption>

      {/* El póster va en CSS (proporción e imagen por breakpoint), así que ya
          está en el HTML servido y no hay salto cuando el video se monta. */}
      <div ref={marcoRef} className="obs-fotograma">
        {orientacion && (
          <video
            ref={videoRef}
            // Silencioso de fábrica: el archivo no lleva pista de audio. Es
            // condición para que un navegador deje arrancar un video solo.
            muted
            loop
            playsInline
            preload="none"
            poster={`/video/poster-obs-${orientacion}.webp`}
            aria-label={demo.videoAria}
            onPlay={() => setSonando(true)}
            onPause={() => setSonando(false)}
          >
            <source
              src={`/video/constela-obs-${orientacion}.mp4`}
              type="video/mp4"
            />
          </video>
        )}
        {/* Tocar el fotograma también pausa, que es lo que todo el mundo
            intenta. Duplica el botón de la fila de datos, así que se esconde
            del teclado y de los lectores de pantalla en vez de repetirse. */}
        <button
          type="button"
          onClick={alternar}
          className="obs-toque"
          tabIndex={-1}
          aria-hidden
        />
      </div>
    </figure>
  );
}

/** El filtro vacío: se define aquí para no cargar el panel antes de tiempo. */
const SIN_FILTRO: ActiveFilters = { rol: [], interes: [], intencion: [] };

/**
 * Las dos bandas finales de la portada: la bienvenida de verdad y, debajo, el
 * mapa de verdad. Van en un solo componente —y no en dos secciones del
 * servidor— porque comparten estado: lo que eliges arriba se convierte en el
 * filtro de abajo. Esa cadena es el argumento entero de la portada, así que
 * separarlas por limpieza rompería lo único que estas dos bandas demuestran.
 *
 * Recibe su copy por props desde la portada que la monta. Antes se lo llevaba
 * él mismo de `@/lib/portada`, que era más cómodo mientras hubo una sola
 * portada; con dos idiomas eso significaría que la portada inglesa enseña la
 * bienvenida en español.
 */
export function BienvenidaYMapa({
  portada,
  ficha,
}: {
  portada: Portada;
  ficha: Chrome["ficha"];
}) {
  const { bienvenida: BIENVENIDA, mapa: MAPA, demo } = portada;
  const [rol, setRol] = useState<TagChoice[]>([]);
  const [intereses, setIntereses] = useState<TagChoice[]>([]);
  const [intenciones, setIntenciones] = useState<TagChoice[]>([]);
  const [filtro, setFiltro] = useState<ActiveFilters>(SIN_FILTRO);
  const [armado, setArmado] = useState(false);
  const marcoRef = useRef<HTMLDivElement>(null);

  const elegidas = rol.length + intereses.length + intenciones.length;

  // El grafo no se enciende hasta que el mapa está a punto de verse: nadie ha
  // pedido una simulación de fuerzas mientras lee el hero.
  useEffect(() => {
    const marco = marcoRef.current;
    if (!marco) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setArmado(true);
        observador.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observador.observe(marco);
    return () => observador.disconnect();
  }, []);

  /** Lo que elegiste arriba, hecho filtro abajo: el mismo vocabulario. */
  function llevarSenalesAlMapa() {
    const slugDe = (eleccion: TagChoice) =>
      eleccion.slug ?? slugifyTag(eleccion.label);
    setFiltro({
      rol: rol.map(slugDe),
      interes: intereses.map(slugDe),
      intencion: intenciones.map(slugDe),
    });
    setArmado(true);
    marcoRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  }

  return (
    <>
      {/* PRIMERO — la bienvenida real, con el catálogo del evento de ejemplo.
          Las tres preguntas van en fila —una columna cada una— porque
          apiladas hacen una torre de chips contra un párrafo corto. */}
      <section className="obs-banda obs-banda-ancha" id="bienvenida">
        <p className="obs-mono">{BIENVENIDA.etiqueta}</p>
        <h2 className="obs-titulo">{BIENVENIDA.titulo}</h2>
        <p className="obs-parrafo">{BIENVENIDA.texto}</p>
        <p className="obs-parrafo">{BIENVENIDA.textoDos}</p>

        <div className="obs-ficha">
          <div className="obs-campos">
            <OnboardingFields
              roleOptions={DEMO_CATALOG.rol}
              interestOptions={DEMO_CATALOG.interes}
              intentOptions={DEMO_CATALOG.intencion}
              role={rol}
              interests={intereses}
              intents={intenciones}
              onRoleChange={setRol}
              onInterestsChange={setIntereses}
              onIntentsChange={setIntenciones}
              preview={9}
              textos={ficha}
            />
          </div>

          <div className="obs-ficha-pie">
            <button
              type="button"
              onClick={llevarSenalesAlMapa}
              disabled={elegidas === 0}
              className={elegidas > 0 ? "obs-cta" : "obs-cta-apagado"}
            >
              {elegidas > 0 ? demo.filtrar : demo.eligeRol}
            </button>
            <p className="obs-mono">
              {elegidas > 0
                ? `${elegidas} ${elegidas === 1 ? demo.senal : demo.senales} · ${demo.seApaga}`
                : demo.pistaVacia}
            </p>
          </div>
        </div>
        <p className="obs-mono obs-nota">{BIENVENIDA.pie}</p>
      </section>

      {/* DESPUÉS — el mapa real de /home sobre el evento de ejemplo. Lo último
          antes de la puerta es el instrumento, no un argumento. Los números de
          la fila de datos salen de los datos, nunca del copy. */}
      <section className="obs-banda obs-banda-ancha" id="mapa">
        <p className="obs-mono">{MAPA.etiqueta}</p>
        <h2 className="obs-titulo">{MAPA.titulo}</h2>
        <p className="obs-parrafo">{MAPA.texto}</p>
        <p className="obs-parrafo">{MAPA.textoDos}</p>
        <figure className="obs-figura">
          <figcaption className="obs-figura-cab">
            <span className="obs-mono">
              {MAPA.marco} · {DEMO_NODES.length} {demo.estrellas} ·{" "}
              {DEMO_EDGES.length} {demo.conexiones}
            </span>
            <span className="obs-mono">{MAPA.pie}</span>
          </figcaption>
          <div ref={marcoRef} className="obs-app">
            {armado ? (
              <ConstellationPanel
                nodes={DEMO_NODES}
                edges={DEMO_EDGES}
                myId={DEMO_ME_ID}
                facets={DEMO_FACETS}
                event={{
                  name: DEMO_EVENT.name,
                  dateLabel: DEMO_EVENT.dateLabel,
                  galaxySeed: DEMO_EVENT.galaxySeed,
                  switchHref: "/eventos",
                  switchLabel: demo.tusEventos,
                }}
                active={filtro}
                onActiveChange={setFiltro}
                embedded
              />
            ) : (
              <MapaDurmiendo aviso={demo.encendiendo} />
            )}
          </div>
        </figure>
      </section>
    </>
  );
}
