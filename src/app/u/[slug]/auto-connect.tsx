"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AuraSol, spectrumOf } from "@/components/cosmos";
import { connectOnScan, type ConnectResult } from "./actions";

export type ScanPeer = {
  id: string;
  name: string;
  avatarUrl: string | null;
  /** «ROL · INTENCIÓN» ya resuelto a labels en el servidor. */
  meta: string | null;
};

export type ScanMe = {
  name: string;
  avatarUrl: string | null;
};

function StarAvatar({
  name,
  avatarUrl,
  halo,
  isSun,
  size = 66,
}: {
  name: string;
  avatarUrl: string | null;
  halo: string;
  isSun?: boolean;
  size?: number;
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {isSun ? (
        <AuraSol size={size} />
      ) : (
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{
            inset: -Math.round(size * 0.2),
            background: `radial-gradient(circle, ${halo}80 0%, transparent 70%)`,
            filter: "blur(9px)",
          }}
        />
      )}
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          className="relative z-1 h-full w-full rounded-full object-cover"
          style={{ boxShadow: `0 0 0 1.5px ${halo}99` }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className="relative z-1 flex h-full w-full items-center justify-center rounded-full bg-card text-xl font-bold"
          style={{ color: halo, boxShadow: `0 0 0 1.5px ${halo}99` }}
        >
          {name?.charAt(0)?.toUpperCase() ?? "✦"}
        </div>
      )}
    </div>
  );
}

/**
 * El encuentro (diseño 2c): dispara la conexión al montar — el usuario abrió
 * el QR, ese ES el gesto (ADR 0001) — y celebra el filamento nuevo con los
 * números reales del evento. El QR trae su galaxia (ADR 0005): la acción une
 * a ESA y falla claro si su dueño ya no está dentro. Al ser una acción
 * invocada desde el cliente, ningún prefetch puede crearla.
 */
export function AutoConnect({
  slug,
  eventSlug,
  peer,
  me,
}: {
  slug: string;
  eventSlug: string;
  peer: ScanPeer;
  me: ScanMe;
}) {
  const [result, setResult] = useState<ConnectResult | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return; // StrictMode monta dos veces en desarrollo
    fired.current = true;
    startTransition(async () => {
      setResult(await connectOnScan(slug, eventSlug));
    });
  }, [slug, eventSlug]);

  const peerHalo = spectrumOf(peer.id).halo;

  if (!result) {
    return (
      <div className="flex flex-col items-center gap-8">
        <StarAvatar
          name={peer.name}
          avatarUrl={peer.avatarUrl}
          halo={peerHalo}
        />
        <p className="animate-pulse font-mono text-sm text-muted-foreground">
          [ trazando la línea… ]
        </p>
      </div>
    );
  }

  if (result.status === "conectados") {
    return (
      <div className="animate-rise flex w-full flex-col items-center gap-7">
        <p className="rounded-full border border-aurora/30 bg-aurora/[0.08] px-3.5 py-2 font-mono text-[10px] tracking-[0.18em] text-aurora">
          [ NUEVA CONEXIÓN ]
        </p>

        {/* El filamento entre ustedes dos */}
        <div className="my-2 flex items-center">
          <StarAvatar
            name={me.name}
            avatarUrl={me.avatarUrl}
            halo="#FFD97A"
            isSun
          />
          <div className="h-px w-16 bg-estrella-a/70 sm:w-20" aria-hidden />
          <StarAvatar
            name={peer.name}
            avatarUrl={peer.avatarUrl}
            halo={peerHalo}
          />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-[28px] leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-[32px]">
            {peer.name}
          </h2>
          {peer.meta && (
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              {peer.meta}
            </p>
          )}
          <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
            Se acaba de trazar el filamento entre ustedes dos.
            {result.closedWith
              ? ` Y cerró un triángulo con ${result.closedWith}.`
              : ""}
          </p>
        </div>

        <div className="flex w-full max-w-xs gap-3.5">
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-3.5 text-center">
            <p className="text-[22px] leading-none font-semibold">
              {result.connections}
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {result.connections === 1 ? "conexión" : "conexiones"}
            </p>
          </div>
          <div className="flex-1 rounded-2xl border border-halfa/25 bg-halfa/[0.06] px-3 py-3.5 text-center">
            <p className="text-[22px] leading-none font-semibold text-halfa">
              {result.triangles}
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {result.triangles === 1 ? "triángulo" : "triángulos"}
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-xs flex-col items-center gap-2">
          {/* El escaneo ya te situó en este evento (join_event_via_profile
              fija tu active_event_id): /home aterriza en esta constelación */}
          <Link
            href="/home"
            className="btn-cosmic flex h-14 w-full items-center justify-center text-base font-medium"
          >
            Ver tu constelación
          </Link>
          <Link
            href="/qr"
            className="flex h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Mostrar mi QR a alguien más
          </Link>
        </div>
      </div>
    );
  }

  if (result.status === "dueno-fuera") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <StarAvatar
          name={peer.name}
          avatarUrl={peer.avatarUrl}
          halo={peerHalo}
        />
        <p className="max-w-xs text-sm leading-6 text-muted-foreground">
          {peer.name} ya no está en la galaxia que prometía este QR, así que
          no puede llevarte a ella. Pídele que te muestre su QR de ahora y
          escanéalo de nuevo.
        </p>
      </div>
    );
  }

  if (result.status === "galaxia-no-existe") {
    return (
      <p className="max-w-xs text-center text-sm leading-6 text-muted-foreground">
        La galaxia de este QR ya no existe. Pídele a {peer.name} que te
        muestre su QR de ahora.
      </p>
    );
  }

  if (result.status === "sin-sesion") {
    return (
      <a
        href={`/login?next=${encodeURIComponent(`/u/${slug}?e=${eventSlug}`)}`}
        className="btn-cosmic flex h-13 items-center px-7 text-[15px] font-medium"
      >
        Entrar para conectar
      </a>
    );
  }

  return (
    <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      No pudimos crear la conexión. Recarga la página para intentarlo de nuevo.
    </p>
  );
}
