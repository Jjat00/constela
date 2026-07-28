"use client";

import Link from "next/link";
import { spectralLetterOf, spectrumOf } from "@/components/cosmos";
import type { GraphNode } from "@/components/constellation-graph";
import { cn } from "@/lib/utils";

/**
 * MiniPerfil — la ficha de una estrella seleccionada en el mapa (diseño 1b).
 * Card de cristal flotante en desktop; sheet pegada abajo en móvil.
 * Muestra solo datos que existen: identidad, tags, y el estado real del
 * vínculo contigo. Tocar una estrella nunca conecta (ADR 0001).
 */
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
        "glass animate-rise rounded-t-4xl p-5 pb-6 lg:rounded-4xl lg:pb-5",
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

      <div className="mt-4.5 flex gap-5.5 border-t border-white/5 pt-3.5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
            [ CONEXIONES ]
          </p>
          <p className="mt-1.5 text-[17px] font-semibold">{degree}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
            [ MAGNITUD ]
          </p>
          <p className="mt-1.5 text-[17px] font-semibold">{magnitud}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
            [ CLASE ]
          </p>
          <p
            className="mt-1.5 text-[17px] font-semibold"
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
              <p className="text-sm text-muted-foreground">“{note}”</p>
            )}
          </div>
        ) : (
          <p className="font-mono text-xs leading-5 text-muted-foreground">
            aún no se han cruzado — escanea su QR cuando se encuentren
          </p>
        )}
      </div>
    </div>
  );
}
