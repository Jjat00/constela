"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { connectOnScan, type ConnectResult } from "./actions";

/**
 * Dispara la conexión al montar: el usuario abrió el QR, ese ES el gesto.
 * Al ser una acción invocada desde el cliente, ningún prefetch puede crearla.
 */
export function AutoConnect({ slug }: { slug: string }) {
  const [result, setResult] = useState<ConnectResult | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return; // StrictMode monta dos veces en desarrollo
    fired.current = true;
    startTransition(async () => {
      setResult(await connectOnScan(slug));
    });
  }, [slug]);

  if (!result) {
    return (
      <p className="animate-pulse font-mono text-sm text-muted-foreground">
        [ trazando la línea… ]
      </p>
    );
  }

  if (result.status === "conectados") {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-sm text-primary">
          [ conectados en {result.eventName} ]
        </p>
        <Button asChild size="lg" className="node-glow h-12 rounded-full px-7">
          <Link href={`/home?e=${result.eventSlug}`}>Ver la constelación</Link>
        </Button>
      </div>
    );
  }

  if (result.status === "sin-evento") {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        Esta estrella aún no está en ningún evento. Cuando entre a uno, abrir su
        QR los conectará.
      </p>
    );
  }

  if (result.status === "sin-sesion") {
    return (
      <Button asChild size="lg" className="node-glow h-12 rounded-full px-7">
        <a href={`/login?next=/u/${slug}`}>Entrar para conectar</a>
      </Button>
    );
  }

  return (
    <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      No pudimos crear la conexión. Recarga la página para intentarlo de nuevo.
    </p>
  );
}
