"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, X } from "lucide-react";
import { spectralLetterOf, spectrumOf } from "@/components/cosmos";
import type { GraphNode } from "@/components/constellation-graph";
import { cn } from "@/lib/utils";

const SPECTRAL_TYPES = [
  { letter: "O", color: "#2563EB", label: "Azul supercaliente", temp: "Mayor a 30,000 K" },
  { letter: "B", color: "#4F46E5", label: "Azul", temp: "10,000 a 30,000 K" },
  { letter: "A", color: "#9DC8FF", label: "Blanco-azulado", temp: "7,500 a 10,000 K" },
  { letter: "F", color: "#D4AF37", label: "Amarillo-blanco", temp: "6,000 a 7,500 K" },
  { letter: "G", color: "#FFD97A", label: "Amarillo (Sol)", temp: "5,200 a 6,000 K" },
  { letter: "K", color: "#FFA500", label: "Naranja", temp: "3,700 a 5,200 K" },
  { letter: "M", color: "#DC2626", label: "Rojo", temp: "Menor a 3,700 K" },
];

export function MiniPerfil({
  node,
  isMe,
  degree,
  connected,
  note,
  tagLabels,
  onClose,
  className,
}: {
  node: GraphNode;
  isMe: boolean;
  degree: number;
  connected: boolean;
  note: string | null;
  tagLabels?: Map<string, string>;
  onClose: () => void;
  className?: string;
}) {
  const [infoOpen, setInfoOpen] = useState<"magnitud" | "clase" | null>(null);
  const spec = isMe
    ? { halo: "#FFD97A", core: "#FFF6E3" }
    : spectrumOf(node.id);
  const letter = spectralLetterOf(node.id);
  const label = (slug: string) => tagLabels?.get(slug) ?? slug;
  const meta = [
    node.role ? label(node.role) : null,
    node.intents[0] ? label(node.intents[0]) : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const tags = [...node.tags, ...node.intents.slice(1)];
  const magnitud = (1.1 + degree * 0.14).toFixed(1);

  return (
    <div
      role="dialog"
      aria-label={isMe ? "Tu estrella" : node.name}
      className={cn(
        "animate-rise rounded-t-4xl p-5 pb-6 bg-background border border-white/10 lg:rounded-4xl lg:pb-5",
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="relative size-14 shrink-0">
          <div
            aria-hidden
            className="absolute -inset-2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${spec.halo}44 0%, transparent 70%)`,
              filter: "blur(6px)",
            }}
          />
          {node.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={node.avatarUrl}
              alt=""
              className="relative z-1 size-14 rounded-full object-cover"
              style={{ boxShadow: `0 0 0 1.5px ${spec.halo}99` }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="relative z-1 flex size-14 items-center justify-center rounded-full bg-card text-xl font-bold"
              style={{
                color: spec.halo,
                boxShadow: `0 0 0 1.5px ${spec.halo}99`,
              }}
            >
              {node.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[19px] leading-tight font-semibold">
            {isMe ? "Tú" : node.name}
          </p>
          <p className="mt-1.5 truncate font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            {meta || node.headline || "sin señales todavía"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="grid size-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-[13px] text-muted-foreground transition-colors hover:bg-celeste/15 hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="chip-star px-2.5 py-1.5 text-[11px] font-medium text-estrella-a"
            >
              {label(tag)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4.5 grid grid-cols-3 gap-3 border-t border-white/5 pt-3.5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground whitespace-nowrap">
            CONEXIONES
          </p>
          <p className="mt-2 text-[15px] font-semibold">{degree}</p>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <p className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground whitespace-nowrap">
              MAGNITUD
            </p>
            <button
              type="button"
              onClick={() => setInfoOpen("magnitud")}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label="Ver información de magnitud"
            >
              <Info className="size-3" />
            </button>
          </div>
          <p className="mt-2 text-[15px] font-semibold">{magnitud}</p>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <p className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground whitespace-nowrap">
              CLASE
            </p>
            <button
              type="button"
              onClick={() => setInfoOpen("clase")}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label="Ver información de clase"
            >
              <Info className="size-3" />
            </button>
          </div>
          <p
            className="mt-2 text-[15px] font-semibold"
            style={{ color: spec.halo }}
          >
            {isMe ? "Sol" : letter}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {isMe ? (
          <Link
            href="/perfil"
            className="btn-cosmic inline-flex h-10 items-center px-5 text-[13px] font-medium"
          >
            Editar tu estrella
          </Link>
        ) : connected ? (
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs tracking-[0.14em] text-aurora">
              [ CONECTADOS ]
            </p>
            {note && (
              <p className="text-sm text-muted-foreground">&quot;{note}&quot;</p>
            )}
          </div>
        ) : (
          <p className="font-mono text-xs leading-5 text-muted-foreground">
            aun no se han cruzado - escanea su QR cuando se encuentren
          </p>
        )}
      </div>

      {infoOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setInfoOpen(null)}
            aria-hidden
          />
          <div className="fixed inset-x-4 bottom-20 z-50 bg-background border border-white/10 rounded-xl p-3 sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:w-80">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm">
                {infoOpen === "magnitud" ? "Magnitud" : "Clase Estelar"}
              </h3>
              <button
                type="button"
                onClick={() => setInfoOpen(null)}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            {infoOpen === "magnitud" ? (
              <div className="space-y-1.5 text-xs">
                <p className="text-muted-foreground">
                  Tu brillo determina el tamaño de tu estrella.
                </p>
                <p className="text-muted-foreground">
                  Se calcula por tus conexiones:
                </p>
                <p className="font-mono bg-white/5 rounded p-1.5">
                  (Conexiones × 0.34) + 1.0
                </p>
                <p className="text-muted-foreground">
                  Actual: <span className="text-foreground font-semibold">{magnitud}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground">
                  Color visual asignado al azar. No está relacionado con tus conexiones.
                </p>
                <p className="text-muted-foreground">
                  La escala de Harvard clasifica estrellas por temperatura:
                </p>
                <div className="flex flex-wrap gap-1">
                  {SPECTRAL_TYPES.map((type) => (
                    <div
                      key={type.letter}
                      className="flex items-center gap-1 bg-white/5 rounded px-1.5 py-0.5"
                      title={`${type.label}: ${type.temp}`}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="font-semibold">{type.letter}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Tu tipo: <span className="font-semibold" style={{ color: spec.halo }}>
                    {isMe ? "Sol" : letter}
                  </span>
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
