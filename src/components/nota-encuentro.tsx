"use client";

import { useEffect, useState, useTransition } from "react";
import { saveConnectionNote } from "@/lib/actions/connection-note";
import { cn } from "@/lib/utils";

/** Dónde suele nacer un encuentro en un evento: un tap y queda anotado. */
const CHIPS = [
  "en la charla",
  "en un stand",
  "en la fila del café",
  "en el after",
  "nos presentaron",
];

/**
 * Tu nota del encuentro (CONTEXT: opcional, editable después). Los chips
 * guardan al toque —de pie y a una mano no se teclea—; el texto libre pide su
 * «Guardar» explícito, que solo aparece cuando hay algo distinto de lo ya
 * guardado. La nota es PRIVADA por lado (migración 0014): cada extremo tiene
 * la suya y solo su autor la lee — se puede escribir con total franqueza.
 */
export function NotaEncuentro({
  connectionId,
  initialNote,
  label,
  chips = false,
  autoFocus = false,
  onSaved,
  className,
}: {
  connectionId: string;
  initialNote: string | null;
  /** Microetiqueta mono encima del campo; sin ella, el campo va solo. */
  label?: string;
  /** Mostrar los contextos de un tap (la pantalla del encuentro los quiere). */
  chips?: boolean;
  autoFocus?: boolean;
  /** Tu nota ya persistida (null si se borró) — para quien la cachea arriba. */
  onSaved?: (note: string | null) => void;
  className?: string;
}) {
  const [value, setValue] = useState(initialNote ?? "");
  const [saved, setSaved] = useState(initialNote ?? "");
  const [flash, setFlash] = useState<"ok" | "error" | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [flash]);

  const dirty = value.trim() !== saved.trim();
  const segments = value
    .split(" · ")
    .map((s) => s.trim())
    .filter(Boolean);

  const persist = (text: string) => {
    startTransition(async () => {
      const res = await saveConnectionNote(connectionId, text);
      if (res.status === "ok") {
        setSaved(res.note ?? "");
        setFlash("ok");
        onSaved?.(res.note);
      } else {
        setFlash("error");
      }
    });
  };

  const toggleChip = (chip: string) => {
    const next = (
      segments.includes(chip)
        ? segments.filter((s) => s !== chip)
        : [...segments, chip]
    ).join(" · ");
    setValue(next);
    persist(next);
  };

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {label && (
        <p className="font-mono text-[10px] tracking-wider text-faint">
          {label}
        </p>
      )}

      {chips && (
        <div className="flex flex-wrap gap-1.5">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => toggleChip(chip)}
              data-active={segments.includes(chip)}
              className="chip-star px-2.5 py-1.5 text-[11px] font-medium"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (dirty) persist(value);
        }}
      >
        <input
          aria-label="Nota del encuentro"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={240}
          autoFocus={autoFocus}
          placeholder="¿Dónde se conocieron? ¿De qué hablaron?"
          className="h-12 w-full min-w-0 flex-1 rounded-2xl border px-4 text-[15px] outline-none transition-colors placeholder:text-faint focus:border-cosmic/60"
        />
        {dirty && (
          <button
            type="submit"
            disabled={pending}
            className="btn-cosmic h-12 shrink-0 px-4 text-[13px] font-medium disabled:opacity-60"
          >
            Guardar
          </button>
        )}
      </form>

      <div className="flex h-4 items-baseline justify-between gap-2">
        <p className="font-mono text-[10px] text-faint">
          solo tú la ves
        </p>
        {(pending || flash) && (
          <p
            className={cn(
              "font-mono text-[10px]",
              flash === "error" ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {pending
              ? "[ guardando… ]"
              : flash === "ok"
                ? "[ guardada ]"
                : "[ no se guardó — reintenta ]"}
          </p>
        )}
      </div>
    </div>
  );
}
