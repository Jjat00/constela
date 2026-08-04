"use client";

import { useState } from "react";
import type { Chrome } from "@/lib/copy";
import { ES } from "@/lib/copy/es";
import { createClient } from "@/lib/supabase/client";

/**
 * La puerta.
 *
 * `textos` es opcional y cae en español: este botón es el de `/login` y el de
 * la app, que hablan español, y solo la landing inglesa necesita pasarle otra
 * cosa. Ponerlo obligatorio habría obligado a tocar cinco pantallas que no
 * tienen nada que ver con los idiomas.
 */
export function GoogleButton({
  next,
  textos = ES.chrome.google,
}: {
  next?: string;
  textos?: Chrome["google"];
}) {
  const [status, setStatus] = useState<"idle" | "redirecting" | "error">(
    "idle",
  );

  async function handleClick() {
    setStatus("redirecting");

    const supabase = createClient();
    const callback = new URL("/auth/callback", location.origin);
    if (next) callback.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback.toString() },
    });

    if (error) setStatus("error");
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "redirecting"}
        className="btn-cosmic flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 text-base font-medium disabled:cursor-default disabled:opacity-60"
      >
        {/* v6: el botón pasó a tinta plena invertida, así que la marca de
            Google va en el color del papel (lo hereda por currentColor) — con
            la tinta espectral de v5 quedaba un azul claro sobre blanco. */}
        <svg aria-hidden viewBox="0 0 24 24" className="size-5">
          <path
            fill="currentColor"
            d="M21.35 11.1H12v2.9h5.35c-.5 2.4-2.55 3.9-5.35 3.9a6 6 0 1 1 0-12c1.5 0 2.85.55 3.9 1.45l2.2-2.2A9 9 0 1 0 12 21c5.2 0 8.85-3.65 8.85-8.8 0-.4-.05-.75-.1-1.1Z"
          />
        </svg>
        {status === "redirecting" ? textos.abriendo : textos.continuar}
      </button>
      {status === "error" && (
        <p className="text-sm text-destructive">{textos.error}</p>
      )}
    </div>
  );
}
