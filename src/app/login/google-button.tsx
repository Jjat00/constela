"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function GoogleButton({ next }: { next?: string }) {
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
      <Button
        size="lg"
        onClick={handleClick}
        disabled={status === "redirecting"}
        className="node-glow h-13 w-full rounded-full text-base"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-5">
          <path
            fill="currentColor"
            d="M21.35 11.1H12v2.9h5.35c-.5 2.4-2.55 3.9-5.35 3.9a6 6 0 1 1 0-12c1.5 0 2.85.55 3.9 1.45l2.2-2.2A9 9 0 1 0 12 21c5.2 0 8.85-3.65 8.85-8.8 0-.4-.05-.75-.1-1.1Z"
          />
        </svg>
        {status === "redirecting" ? "Abriendo Google…" : "Continuar con Google"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-destructive">
          Google no respondió. Intenta de nuevo.
        </p>
      )}
    </div>
  );
}
