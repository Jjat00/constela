"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { AuraSol, HaloEstelar, spectralLetterOf, spectrumOf } from "@/components/cosmos";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

/**
 * La tarjeta de presentación de una estrella (vista `/tarjeta/[slug]`, se
 * abre desde el MiniPerfil del mapa).
 *
 * Es un objeto, no una pantalla: proporción de tarjeta de visita real
 * (85.6 × 54 mm) en desktop, retrato de credencial en el teléfono — donde se
 * vive el evento. Dos caras: delante la identidad, detrás el QR que abre su
 * estrella. Ese QR va SIN `?e=` a propósito: lleva a la ficha pública y no
 * conecta a nadie (ADR 0001) — la arista solo nace de escanear el QR de
 * verdad, en persona.
 *
 * El color de la tarjeta no se elige: es la clase espectral de la persona, la
 * misma que pinta su estrella en el grafo. Tu propia tarjeta es oro, como tu
 * sol. Al mover el puntero la superficie se inclina apenas (±5°) y la luz
 * cruza el cristal: es lo que separa una tarjeta de un rectángulo con datos.
 */
export function TarjetaEstelar({
  id,
  name,
  headline,
  roleLabel,
  tags,
  extraTags = 0,
  avatarUrl,
  isMe,
  qrMarkup,
  publicUrl,
  encuentro,
}: {
  id: string;
  name: string;
  headline: string | null;
  /** Los roles ya en humano, unidos con « · ». */
  roleLabel: string | null;
  /** Intereses e intención, en labels del catálogo. Máximo 4 caben aquí. */
  tags: string[];
  /** Cuántas señales quedaron fuera de la tarjeta. */
  extraTags?: number;
  avatarUrl: string | null;
  isMe: boolean;
  /** SVG del QR ya dibujado en servidor (`qrSvg`). */
  qrMarkup: string;
  /** La URL de su estrella, sin protocolo: el pie de la tarjeta. */
  publicUrl: string;
  /** Cómo se cruzaron, si ya se cruzaron. */
  encuentro: string | null;
}) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const quieto = useRef(false);
  const spec = isMe ? { halo: "#FFD97A" } : spectrumOf(id);
  const letra = isMe ? "Sol" : spectralLetterOf(id);

  // Con calma pedida la tarjeta no se inclina ni gira con transición: se
  // voltea y ya. El canvas del mapa hace lo mismo (ver ConstellationGraph).
  useEffect(() => {
    quieto.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("calm");
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* La perspectiva vive fuera: es la distancia del ojo a la tarjeta */}
      <div
        className="w-full max-w-[22rem] sm:max-w-[34rem]"
        style={{ perspective: "1400px" }}
        onPointerMove={(e) => {
          if (quieto.current || e.pointerType !== "mouse") return;
          const rect = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          setTilt({ x: -py * 10, y: px * 10 });
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      >
        {/* Dos capas de transformación: la inclinación sigue al puntero al
            instante; el giro es un gesto largo. Una sola las mezclaría y el
            volteo arrastraría al ratón. */}
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          <button
            type="button"
            onClick={() => setFlipped(!flipped)}
            aria-label={
              flipped ? "Ver el frente de la tarjeta" : "Ver el reverso: su QR"
            }
            className={cn(
              "relative block w-full cursor-pointer aspect-[0.66] sm:aspect-[1.586]",
              "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none",
            )}
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : undefined,
            }}
          >
            <Cara oculta={flipped}>
              <Frente
                name={name}
                headline={headline}
                roleLabel={roleLabel}
                tags={tags}
                extraTags={extraTags}
                avatarUrl={avatarUrl}
                isMe={isMe}
                id={id}
                halo={spec.halo}
                letra={letra}
                publicUrl={publicUrl}
              />
            </Cara>
            <Cara girada oculta={!flipped}>
              <Reverso
                qrMarkup={qrMarkup}
                publicUrl={publicUrl}
                encuentro={encuentro}
                isMe={isMe}
                halo={spec.halo}
              />
            </Cara>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        aria-pressed={flipped}
        className="chip-star inline-flex h-9 items-center gap-2 px-4 font-mono text-[11px] tracking-wide"
      >
        <RotateCw className="size-3.5" aria-hidden />
        {flipped ? "ver el frente" : "ver el reverso"}
      </button>
    </div>
  );
}

/**
 * Una cara de la tarjeta: mismo sitio, misma luz — solo cambia el lado.
 * La que mira al otro lado sale del árbol accesible: si no, un lector de
 * pantalla leería el nombre dos veces y anunciaría un QR que no se ve.
 */
function Cara({
  girada = false,
  oculta,
  children,
}: {
  girada?: boolean;
  oculta: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={oculta}
      inert={oculta}
      className="absolute inset-0 overflow-hidden rounded-[1.75rem] text-left"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: girada ? "rotateY(180deg)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

/** El fondo común: cristal profundo teñido por la clase espectral. */
function Superficie({
  halo,
  children,
  className,
}: {
  halo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col border border-white/10 p-6 sm:p-7",
        className,
      )}
      style={{
        background: `
          radial-gradient(120% 90% at 8% 0%, ${halo}1F 0%, transparent 55%),
          radial-gradient(90% 70% at 100% 100%, ${halo}14 0%, transparent 60%),
          linear-gradient(155deg, #0C111C 0%, #070A12 55%, #05070E 100%)`,
        boxShadow:
          "0 40px 90px -45px rgba(2,3,10,0.95), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      {/* El filo de luz superior: el canto de una tarjeta impresa */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${halo}99, transparent)`,
        }}
      />
      {children}
    </div>
  );
}

function Frente({
  id,
  name,
  headline,
  roleLabel,
  tags,
  extraTags,
  avatarUrl,
  isMe,
  halo,
  letra,
  publicUrl,
}: {
  id: string;
  name: string;
  headline: string | null;
  roleLabel: string | null;
  tags: string[];
  extraTags: number;
  avatarUrl: string | null;
  isMe: boolean;
  halo: string;
  letra: string;
  publicUrl: string;
}) {
  const inicial = name?.charAt(0)?.toUpperCase() ?? "✦";
  const foto = avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl}
      alt=""
      className="h-full w-full object-cover"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div
      className="flex h-full w-full items-center justify-center bg-card text-2xl font-bold"
      style={{ color: halo }}
    >
      {inicial}
    </div>
  );

  return (
    <Superficie halo={halo}>
      <div className="flex items-start justify-between gap-3">
        <Logo className="h-3.5 opacity-55" />
        <span
          className="font-mono text-[9px] tracking-wider uppercase"
          style={{ color: halo }}
        >
          [ clase {letra} ]
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        {isMe ? (
          <div className="relative size-16 sm:size-[4.5rem]">
            <AuraSol size={72} />
            <div className="relative z-1 size-full overflow-hidden rounded-full border border-sol/60">
              {foto}
            </div>
          </div>
        ) : (
          <HaloEstelar id={id} size={68}>
            {foto}
          </HaloEstelar>
        )}

        <div className="flex flex-col gap-1.5">
          <p className="text-[26px] leading-[1.1] font-bold tracking-tight text-balance sm:text-[30px]">
            {name}
          </p>
          {roleLabel && (
            <p className="font-mono text-[10px] tracking-wider text-celeste uppercase">
              {roleLabel}
            </p>
          )}
          {headline && (
            <p className="line-clamp-2 max-w-[26ch] text-[13px] leading-5 text-muted-foreground text-balance sm:max-w-[42ch]">
              {headline}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/8 pt-3.5">
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="chip-star px-2.5 py-1 text-[10.5px] font-medium text-estrella-a"
              >
                {tag}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="self-center font-mono text-[10px] text-faint">
                +{extraTags}
              </span>
            )}
          </div>
        )}
        <p className="text-center font-mono text-[9.5px] tracking-wide text-faint">
          {publicUrl}
        </p>
      </div>
    </Superficie>
  );
}

function Reverso({
  qrMarkup,
  publicUrl,
  encuentro,
  isMe,
  halo,
}: {
  qrMarkup: string;
  publicUrl: string;
  encuentro: string | null;
  isMe: boolean;
  halo: string;
}) {
  return (
    <Superficie halo={halo}>
      <p className="text-center font-mono text-[9px] tracking-wider text-faint uppercase">
        [ {isMe ? "tu estrella" : "su estrella"} ]
      </p>

      <div className="flex flex-1 flex-col items-center justify-center gap-3.5">
        <div
          className="rounded-2xl border p-3.5 backdrop-blur-xl"
          style={{
            borderColor: `${halo}40`,
            background: `${halo}0A`,
          }}
        >
          <div
            className="w-[7.5rem] sm:w-[8.5rem] [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qrMarkup }}
          />
        </div>
        <p className="font-mono text-[10px] tracking-wide text-muted-foreground">
          {publicUrl}
        </p>
      </div>

      <p className="text-center font-mono text-[9.5px] leading-4 text-faint">
        {encuentro ??
          (isMe
            ? "este código abre tu estrella — no conecta a nadie"
            : "este código abre su estrella — conectarse pide escanear su QR en persona")}
      </p>
    </Superficie>
  );
}
