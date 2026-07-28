"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * La constelación activa del sidebar (diseño 1b): `/home` la publica al
 * montarse y el sidebar la lee — mismo patrón de store mínimo que calm-mode.
 * El sidebar es un client component compartido y el evento activo solo lo
 * conoce la página, así que viaja por aquí y no por props del layout.
 */
export type ActiveConstellation = {
  name: string;
  stars: number;
  /** Tu magnitud en ESTE evento — el pill dorado del sidebar. */
  magnitude: string;
};

const EVENT = "constela-constelacion-activa";

let current: ActiveConstellation | null = null;

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

export function useActiveConstellation() {
  // En el servidor no hay evento activo: el sidebar hidrata sin la card
  // y esta llega en cuanto la página la publica.
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

/** Montado por la página que sabe cuál es la galaxia activa. Renderiza nada. */
export function PublishActiveConstellation({
  name,
  stars,
  magnitude,
}: ActiveConstellation) {
  useEffect(() => {
    current = { name, stars, magnitude };
    window.dispatchEvent(new Event(EVENT));
    return () => {
      current = null;
      window.dispatchEvent(new Event(EVENT));
    };
  }, [name, stars, magnitude]);
  return null;
}
