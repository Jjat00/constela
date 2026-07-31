"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/**
 * Pasar la tarjeta a alguien: la hoja nativa del teléfono si existe, y si no
 * el enlace al portapapeles. Nunca abre nada por su cuenta — compartir es un
 * gesto, no un efecto secundario.
 */
export function CompartirTarjeta({
  url,
  name,
  isMe,
}: {
  url: string;
  name: string;
  isMe: boolean;
}) {
  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    const texto = isMe
      ? "Mi estrella en Constela"
      : `La estrella de ${name} en Constela`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: texto, url });
        return;
      } catch {
        // Cancelar la hoja nativa no es un error: no hay nada que decir
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      // Sin portapapeles (http, permisos): el enlace está a la vista abajo
    }
  }

  return (
    <button
      type="button"
      onClick={compartir}
      className="chip-star inline-flex h-11 items-center justify-center gap-2 px-5 text-[13px] font-medium"
    >
      {copiado ? (
        <>
          <Check className="size-4 text-aurora" aria-hidden />
          enlace copiado
        </>
      ) : (
        <>
          <Share2 className="size-4" aria-hidden />
          Compartir tarjeta
        </>
      )}
    </button>
  );
}
