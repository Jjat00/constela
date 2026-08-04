"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Pause, Play } from "lucide-react";
import type { PaletaGrafo } from "@/components/constellation-graph";
import {
  DEMO_EDGES,
  DEMO_EVENT,
  DEMO_FACETS,
  DEMO_ME_ID,
  DEMO_NODES,
} from "@/lib/demo-universe";

/*
 * La isla de cliente de /opcion2 «Documento»: las dos piezas que la landing de
 * producción monta bajo su hero —el video de presentación y el mapa real de
 * `/home`— vestidas con el idioma de esta opción.
 *
 * Vive junto a la página y no en `src/components/opciones/` porque sus clases
 * (`o2-*`) están definidas en el bloque CSS de `page.tsx`: es chrome de esta
 * propuesta, no una pieza compartida por las diez.
 *
 * La invariancia se respeta igual: el copy sale de `datos.ts` y los datos del
 * mapa son los del evento de ejemplo (`demo-universe.ts`), exactamente los
 * mismos que ya usa la landing en producción. Aquí no se maqueta nada.
 */

/**
 * La tinta del Documento, exactamente la del diagrama del hero: negro sobre
 * papel, filamentos gris medio y cierres triádicos en el azul de la escuela
 * (#0070F3). Apagadas las tres cosas que solo funcionan sobre cielo negro —
 * halo difuso, núcleo blanco y picos de difracción—, que en papel son niebla,
 * un agujero y unas cruces sucias. Es el mismo grafo, impreso.
 */
const TINTA_DOCUMENTO: PaletaGrafo = {
  // El mapa pinta los filamentos al 34 % y el diagrama del hero al 75 %: con
  // el mismo #9B9B9B el trazo saldría en #D5D5D5, casi invisible sobre papel.
  // Se compensa oscureciendo la tinta hasta que 0,34 sobre #FAFAFA cae donde
  // cae el hero (~#B5B5B5).
  filamento: "50, 50, 50",
  triada: "0, 112, 243", // #0070F3
  tinta: "#000000",
  sol: "#0070F3", // «tú» es la única estrella con color, como el enlace
  nucleo: null,
  halo: false,
  picos: false,
  corona: false,
  seleccion: "#0070F3",
  etiqueta: "#000000",
  etiquetaBorde: "rgba(255, 255, 255, 0.9)",
};

function MapaDurmiendo() {
  return (
    <div className="o2-app-espera">
      <span className="o2-mono">encendiendo la constelación…</span>
    </div>
  );
}

/**
 * El panel real de `/home`, cargado aparte: arrastra el motor de canvas del
 * grafo, y quien solo lee el documento no debería descargarlo.
 */
const ConstellationPanel = dynamic(
  () =>
    import("@/components/constellation-panel").then((m) => m.ConstellationPanel),
  { ssr: false, loading: () => <MapaDurmiendo /> },
);

/**
 * Suscripción vacía a propósito: las dos consultas de abajo se leen una sola
 * vez. Re-suscribirse haría que cruzar los 768px cambiara el archivo a media
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
 * El video de presentación (35 s, Remotion), en la tinta del documento: no es
 * el master cósmico de la landing metido en un marco blanco, sino el mismo
 * guion re-renderizado sobre papel —`Constela-doc-*` en `video/src`, paleta
 * `DOCUMENTO`—, con Geist, tinta negra y el azul de la escuela. Un rectángulo
 * de cielo nocturno entre dos secciones de papel se lee como una cita de otra
 * publicación, y esta página no cita: traduce.
 *
 * Copia los tres cuidados del componente de producción, porque la escena de
 * uso es la misma —un teléfono, en datos, de pie— y solo cambia el vestido:
 * - nada se descarga hasta que el marco se acerca al viewport (`preload="none"`
 *   + IntersectionObserver): el documento no paga 1,4 MB por adelantado;
 * - se monta UNA sola etiqueta, la del encuadre que toca, porque un `<video>`
 *   oculto por CSS igual descarga;
 * - con `prefers-reduced-motion` no arranca solo: se queda en su fotograma.
 */
export function VideoDocumento({ marco, pie }: { marco: string; pie: string }) {
  const marcoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sonando, setSonando] = useState(false);

  // Qué archivo pedir lo decide el encuadre, no el ancho del contenedor.
  const apaisado = useConsulta("(min-width: 768px)");
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
    <figure className="o2-diagrama" style={{ margin: 0 }}>
      {/* El control va en la cabecera, con los datos de la figura: en este
          documento los mandos no flotan sobre la imagen. */}
      <figcaption className="o2-diagrama-cab">
        <span className="o2-mono">{marco}</span>
        <span className="o2-cab-fin">
          <span className="o2-mono">{pie}</span>
          <button type="button" onClick={alternar} className="o2-ctrl">
            {sonando ? (
              <Pause aria-hidden />
            ) : (
              <Play aria-hidden />
            )}
            {sonando ? "Pausar" : "Reproducir"}
          </button>
        </span>
      </figcaption>

      {/* El póster va en CSS (proporción e imagen por breakpoint), así que ya
          está en el HTML servido y no hay salto cuando el video se monta. */}
      <div className="o2-pelicula">
        <div ref={marcoRef} className="o2-fotograma">
          {orientacion && (
            <video
              ref={videoRef}
              // Silencioso de fábrica: el archivo no lleva pista de audio. Es
              // condición para que un navegador deje arrancar un video solo.
              muted
              loop
              playsInline
              preload="none"
              poster={`/video/poster-doc-${orientacion}.webp`}
              aria-label="Constela en 35 segundos: cómo se dibuja la constelación de un evento"
              onPlay={() => setSonando(true)}
              onPause={() => setSonando(false)}
            >
              <source
                src={`/video/constela-doc-${orientacion}.mp4`}
                type="video/mp4"
              />
            </video>
          )}
          {/* Tocar el fotograma también pausa, que es lo que todo el mundo
              intenta. Duplica el botón de la cabecera, así que se esconde del
              teclado y de los lectores de pantalla en vez de repetirse. */}
          <button
            type="button"
            onClick={alternar}
            className="o2-toque"
            tabIndex={-1}
            aria-hidden
          />
        </div>
      </div>
    </figure>
  );
}

/**
 * El mapa del evento de ejemplo: el `ConstellationPanel` de `/home`, con sus
 * filtros, su búsqueda y sus cierres triádicos. `embedded` devuelve la rueda y
 * el dedo al documento, que aquí scrollea. Se enciende cuando se acerca al
 * viewport: nadie ha pedido una simulación de fuerzas mientras lee el hero.
 */
export function MapaDocumento() {
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
    <div ref={marcoRef} className="o2-app">
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
          paleta={TINTA_DOCUMENTO}
        />
      ) : (
        <MapaDurmiendo />
      )}
    </div>
  );
}
