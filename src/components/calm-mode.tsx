"use client";

import { useEffect, useSyncExternalStore } from "react";

// Preferencia local (diseño 3a): congelar el titileo y la deriva del cielo
// sin depender del ajuste del sistema. Vive en localStorage y se aplica como
// clase en <html> — el CSS de globals.css hace el resto.
const KEY = "constela-calma";
const EVENT = "constela-calma";

function readCalm() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function apply(on: boolean) {
  document.documentElement.classList.toggle("calm", on);
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

/** Montado en el root layout: aplica la preferencia guardada en cada página. */
export function CalmMode() {
  useEffect(() => {
    apply(readCalm());
  }, []);
  return null;
}

/** El interruptor de Ajustes (3a): pista azul, perilla que viaja. */
export function CalmToggle() {
  // En el servidor no hay preferencia: se hidrata apagado y el snapshot
  // real llega en cuanto el store se lee en cliente.
  const on = useSyncExternalStore(subscribe, readCalm, () => false);

  function toggle() {
    const next = !on;
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      // sin localStorage la preferencia vive solo esta sesión
    }
    apply(next);
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Movimiento reducido"
      onClick={toggle}
      className={`relative h-[26px] w-11 shrink-0 cursor-pointer rounded-full border transition-colors ${
        on ? "border-cosmic/75 bg-cosmic/30" : ""
      }`}
    >
      <span
        className={`absolute top-[3px] size-[18px] rounded-full transition-all ${
          on ? "left-[21px] bg-foreground" : "left-[3px] bg-muted-foreground"
        }`}
      />
    </button>
  );
}
