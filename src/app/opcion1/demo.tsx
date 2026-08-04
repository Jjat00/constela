"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import type { PaletaGrafo } from "@/components/constellation-graph";
import {
  DEMO_EDGES,
  DEMO_EVENT,
  DEMO_FACETS,
  DEMO_ME_ID,
  DEMO_NODES,
} from "@/lib/demo-universe";

/*
 * La isla de cliente de /opcion1 «Observatorio»: las dos piezas que la landing
 * de producción monta bajo su hero —el video de presentación y el mapa real de
 * `/home`— medidas con el instrumento de esta opción.
 *
 * Vive junto a la página y no en `src/components/opciones/` porque sus clases
 * (`o1-*`) están definidas en el bloque CSS de `page.tsx`: es chrome de esta
 * propuesta, no una pieza compartida por las diez.
 *
 * Es la traducción más traicionera de las diez, porque la propuesta y el
 * producto comparten la hora: las dos son de noche. Traducir aquí no es
 * cambiar de fondo —eso ya coincide— sino apagar el cine: el oro de «tú», el
 * H-alfa de los triángulos, los halos, los picos y todas las esquinas
 * redondas. Lo que queda mide.
 */

/**
 * La tinta del Observatorio, la misma del diagrama del hero: escala gris sobre
 * casi negro, «tú» en blanco pleno y un único azul frío —`--azul`— para los
 * cierres triádicos y la selección. Apagados el halo, los picos y la corona,
 * que en esta propuesta no son un problema de fondo sino de tesis: la red del
 * evento no ilumina, mide. El núcleo sí se queda: el `RedSVG` del hero lo
 * dibuja.
 */
const TINTA_OBSERVATORIO: PaletaGrafo = {
  // El diagrama del hero traza en #8E939C al 40 % sobre #0B0C0F, que cae en
  // rgb(63, 66, 71). El canvas pinta sus filamentos al 34 %, así que con el
  // mismo gris saldría medio tono por debajo: se compensa aclarando la tinta
  // hasta que 0,34 sobre el papel oscuro aterriza donde aterriza el hero.
  filamento: "165, 171, 181",
  triada: "110, 155, 255", // #6E9BFF
  // Las anónimas, un peldaño por debajo de «tú» en la escala del hero.
  tinta: "#B9BEC7",
  sol: "#F2F3F5", // «tú» es la única estrella en blanco pleno
  nucleo: "#FFFFFF",
  halo: false,
  picos: false,
  corona: false,
  seleccion: "#6E9BFF",
  etiqueta: "#F2F3F5",
  etiquetaBorde: "rgba(11, 12, 15, 0.8)",
};

function MapaDurmiendo() {
  return (
    <div className="o1-app-espera">
      <span className="o1-mono">encendiendo la constelación…</span>
    </div>
  );
}

/**
 * El panel real de `/home`, cargado aparte: arrastra el motor de canvas del
 * grafo, y quien solo lee la página no debería descargarlo.
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
 * El video de presentación (35 s, Remotion), en la tinta del observatorio: no
 * es el master de la landing metido en un marco, sino el mismo guion
 * re-renderizado sin cine —`Constela-obs-*` en `video/src`, paleta
 * `OBSERVATORIO`—, con Inter Tight, IBM Plex Mono y un solo azul frío. El
 * fondo coincide casi por accidente; lo que se traduce es todo lo demás.
 *
 * Copia los tres cuidados del componente de producción, porque la escena de
 * uso es la misma —un teléfono, en datos, de pie— y solo cambia el vestido:
 * - nada se descarga hasta que el marco se acerca al viewport (`preload="none"`
 *   + IntersectionObserver): la página no paga 1,4 MB por adelantado;
 * - se monta UNA sola etiqueta, la del encuadre que toca, porque un `<video>`
 *   oculto por CSS igual descarga;
 * - con `prefers-reduced-motion` no arranca solo: se queda en su fotograma.
 */
export function VideoObservatorio({ marco, pie }: { marco: string; pie: string }) {
  const marcoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sonando, setSonando] = useState(false);

  // Qué archivo pedir lo decide el encuadre, no el ancho del contenedor. El
  // corte es el de la retícula de esta opción (900px), no el del documento.
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
    <figure className="o1-figura">
      {/* El mando va en la fila de datos, no encima de la imagen: en esta
          escuela nada flota sobre nada. */}
      <figcaption className="o1-figura-cab">
        <span className="o1-mono">{marco}</span>
        <span className="o1-cab-fin">
          <span className="o1-mono">{pie}</span>
          <button type="button" onClick={alternar} className="o1-ctrl">
            {sonando ? "Pausar" : "Reproducir"}
          </button>
        </span>
      </figcaption>

      {/* El póster va en CSS (proporción e imagen por breakpoint), así que ya
          está en el HTML servido y no hay salto cuando el video se monta. */}
      <div ref={marcoRef} className="o1-fotograma">
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
            aria-label="Constela en 35 segundos: cómo se dibuja la constelación de un evento"
            onPlay={() => setSonando(true)}
            onPause={() => setSonando(false)}
          >
            <source src={`/video/constela-obs-${orientacion}.mp4`} type="video/mp4" />
          </video>
        )}
        {/* Tocar el fotograma también pausa, que es lo que todo el mundo
            intenta. Duplica el botón de la fila de datos, así que se esconde
            del teclado y de los lectores de pantalla en vez de repetirse. */}
        <button
          type="button"
          onClick={alternar}
          className="o1-toque"
          tabIndex={-1}
          aria-hidden
        />
      </div>
    </figure>
  );
}

/**
 * El mapa del evento de ejemplo: el `ConstellationPanel` de `/home`, con sus
 * filtros, su búsqueda y sus cierres triádicos. `embedded` devuelve la rueda y
 * el dedo a la página, que aquí scrollea. Se enciende cuando se acerca al
 * viewport: nadie ha pedido una simulación de fuerzas mientras lee el hero.
 */
export function MapaObservatorio() {
  const marcoRef = useRef<HTMLDivElement>(null);
  const [armado, setArmado] = useState(false);

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

  return (
    <div ref={marcoRef} className="o1-app">
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
            switchLabel: "tus eventos",
          }}
          embedded
          paleta={TINTA_OBSERVATORIO}
        />
      ) : (
        <MapaDurmiendo />
      )}
    </div>
  );
}
