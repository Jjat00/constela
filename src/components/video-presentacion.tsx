"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * El video de presentación (35 s, hecho en Remotion — el proyecto vive en
 * `video/`). No es un adorno de fondo: es la misma historia que cuentan las
 * dos secciones de abajo, contada de corrido para quien no quiere tocar nada.
 *
 * Tres cuidados, todos por la escena de uso —un teléfono, en datos, de pie—:
 * - **Nada se descarga hasta que se acerca al viewport** (`preload="none"` +
 *   IntersectionObserver): el hero no paga 1,4 MB por un video que quizá
 *   nadie llegue a ver.
 * - **La versión que se descarga es la del encuadre**: vertical en móvil,
 *   apaisada en desktop. Se elige en cliente y se monta UNA sola etiqueta,
 *   porque un `<video>` oculto por CSS igual descarga.
 * - **`prefers-reduced-motion` manda**: con calma pedida no arranca solo; se
 *   queda en su fotograma con el botón de reproducir.
 */
export function VideoPresentacion() {
  const marcoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [orientacion, setOrientacion] = useState<"16x9" | "9x16" | null>(null);
  const [calma, setCalma] = useState(false);
  const [sonando, setSonando] = useState(false);
  const [cerca, setCerca] = useState(false);

  // Qué archivo pedir: lo decide el encuadre, no el ancho del contenedor. Se
  // lee UNA vez al montar y no se re-suscribe a propósito: cambiar el archivo
  // a media reproducción obliga a un `load()` y deja el video parado en su
  // póster, que es peor que servir el encuadre con el que se entró.
  useEffect(() => {
    const leerViewport = () => {
      setOrientacion(
        window.matchMedia("(min-width: 768px)").matches ? "16x9" : "9x16",
      );
      setCalma(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    leerViewport();
  }, []);

  useEffect(() => {
    const marco = marcoRef.current;
    if (!marco) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        setCerca(entrada.isIntersecting);
        const video = videoRef.current;
        if (!video || calma) return;
        if (entrada.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
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
    <div className="flex flex-col gap-3">
      {/* El marco y su póster son CSS puro —proporción y imagen por breakpoint—
          así que salen bien en el HTML servido y no hay salto cuando el video
          se monta encima ya hidratado. El corte de 768px es el mismo que lee
          el efecto para elegir archivo. */}
      <div
        ref={marcoRef}
        className="relative aspect-[9/16] w-full overflow-hidden rounded-4xl border border-white/8 bg-[#070A12] bg-[url('/video/poster-9x16.webp')] bg-cover bg-center shadow-[0_40px_120px_-40px_rgba(2,3,10,0.95)] md:aspect-video md:bg-[url('/video/poster-16x9.webp')]"
      >
        {orientacion && (
          <video
            ref={videoRef}
            // Silencioso de fábrica: el archivo no lleva pista de audio. Es
            // condición para que un navegador deje arrancar un video solo.
            muted
            loop
            playsInline
            preload="none"
            poster={`/video/poster-${orientacion}.webp`}
            aria-label="Constela en 35 segundos: cómo se dibuja la constelación de un evento"
            className="absolute inset-0 h-full w-full object-cover"
            onPlay={() => setSonando(true)}
            onPause={() => setSonando(false)}
          >
            <source src={`/video/constela-${orientacion}.mp4`} type="video/mp4" />
          </video>
        )}

        {/* Un solo control. Mientras corre se atenúa, pero NUNCA desaparece:
            en un teléfono no hay hover con el que hacerlo volver. */}
        <button
          type="button"
          onClick={alternar}
          aria-label={sonando ? "Pausar el video" : "Reproducir el video"}
          className={`glass absolute bottom-4 left-4 grid size-11 place-items-center rounded-full transition-opacity hover:border-celeste/35 hover:opacity-100 focus-visible:opacity-100 ${
            sonando && cerca ? "opacity-55" : "opacity-100"
          }`}
        >
          {sonando ? (
            <Pause className="size-4.5" aria-hidden />
          ) : (
            <Play className="size-4.5 translate-x-px" aria-hidden />
          )}
        </button>
      </div>

      <p className="px-1 font-mono text-[10px] leading-5 tracking-wider text-faint">
        [ 35 SEGUNDOS · SIN SONIDO · TODO LO QUE SE VE ES LA APP ]
      </p>
    </div>
  );
}
