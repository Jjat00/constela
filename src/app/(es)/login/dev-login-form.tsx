"use client";

// Herramienta SOLO de desarrollo local (ver docs/adr/0002): Google OAuth exige
// credenciales reales incluso en local, así que este acceso por correo (los
// mails caen en Mailpit) permite probar la app sin ellas. Nunca en producción.

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DevLoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const callback = new URL("/auth/callback", location.origin);
    if (next) callback.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callback.toString() },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <details className="rounded-xl border border-dashed border-border/60 p-4">
      <summary className="cursor-pointer font-mono text-xs text-muted-foreground">
        ⚙ acceso dev (correo → Mailpit)
      </summary>

      {status === "sent" ? (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Enlace enviado a <span className="text-foreground">{email}</span>.
          </p>
          <a
            href="http://127.0.0.1:44324"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-primary underline-offset-4 hover:underline"
          >
            abrir Mailpit ↗
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <Input
            id="email"
            type="email"
            required
            placeholder="dev@constela.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-lg"
          />
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={status === "sending"}
            className="rounded-full"
          >
            {status === "sending" ? "Enviando…" : "Enviarme el enlace"}
          </Button>
          {status === "error" && (
            <p className="text-sm text-destructive">
              No se pudo enviar. ¿Está corriendo el stack local?
            </p>
          )}
        </form>
      )}
    </details>
  );
}
