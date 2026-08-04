"use client";

import { useMemo, useState } from "react";
import {
  foldForSearch,
  slugifyTag,
  type CatalogTag,
  type TagChoice,
} from "@/lib/tags";
import { cn } from "@/lib/utils";

/** Cuántas sugerencias se ven sin buscar: las más usadas del evento. */
const PREVIEW = 14;
const MAX_RESULTS = 40;

export function TagPicker({
  options,
  value,
  onChange,
  mode = "multiple",
  placeholder = "busca o escribe el tuyo",
  emptyHint,
  preview = PREVIEW,
  verRestantes = "ver los {n} restantes",
}: {
  options: CatalogTag[];
  value: TagChoice[];
  onChange: (next: TagChoice[]) => void;
  mode?: "single" | "multiple";
  placeholder?: string;
  emptyHint?: string;
  /** Cuántas sugerencias se ven antes de «ver los N restantes». En columnas
   *  estrechas (la bienvenida de la landing) caben menos sin desbordar. */
  preview?: number;
  /** La plantilla de ese enlace: `{n}` se sustituye por cuántas quedan. */
  verRestantes?: string;
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const selectedSlugs = useMemo(
    () => new Set(value.map((v) => v.slug ?? slugifyTag(v.label))),
    [value],
  );

  const folded = foldForSearch(query);

  const matches = useMemo(() => {
    const available = options.filter((o) => !selectedSlugs.has(o.slug));
    if (!folded) return available;
    // Lo que empieza por lo que escribes va primero; los alias también cuentan
    // ("sre" encuentra devops) pero pesan menos que el nombre visible.
    const scored = available.flatMap((o) => {
      const label = foldForSearch(o.label);
      if (label.startsWith(folded)) return [{ o, score: 0 }];
      if (label.includes(folded)) return [{ o, score: 1 }];
      if (o.aliases.some((a) => foldForSearch(a).startsWith(folded)))
        return [{ o, score: 2 }];
      if (o.aliases.some((a) => foldForSearch(a).includes(folded)))
        return [{ o, score: 3 }];
      return [];
    });
    return scored.sort((a, b) => a.score - b.score).map((s) => s.o);
  }, [options, selectedSlugs, folded]);

  const visible =
    folded || expanded ? matches.slice(0, MAX_RESULTS) : matches.slice(0, preview);

  const trimmed = query.trim();
  const newSlug = slugifyTag(trimmed);
  // Solo se ofrece crear lo que de verdad no existe: si el texto resuelve a un
  // tag del catálogo (por slug o alias) se elige ese, nunca uno gemelo.
  const resolvesToExisting =
    newSlug !== "" &&
    options.some(
      (o) => o.slug === newSlug || o.aliases.some((a) => slugifyTag(a) === newSlug),
    );
  const canCreate =
    newSlug.length >= 2 && !resolvesToExisting && !selectedSlugs.has(newSlug);

  function pick(choice: TagChoice) {
    const slug = choice.slug ?? slugifyTag(choice.label);
    if (selectedSlugs.has(slug)) return;
    onChange(mode === "single" ? [choice] : [...value, choice]);
    setQuery("");
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((choice, index) => (
            <button
              key={choice.slug ?? `nuevo-${choice.label}`}
              type="button"
              onClick={() => remove(index)}
              aria-label={`Quitar ${choice.label}`}
              data-active="true"
              className="chip-star inline-flex min-h-9 items-center gap-1.5 px-3.5 py-1.5 text-sm"
            >
              {choice.label}
              <span aria-hidden className="opacity-70">
                ✕
              </span>
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        inputMode="search"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          if (visible.length > 0 && folded) {
            const first = visible[0];
            pick({ slug: first.slug, label: first.label });
          } else if (canCreate) {
            pick({ slug: null, label: trimmed });
          }
        }}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border px-4 text-base outline-none transition-colors placeholder:text-faint focus:border-cosmic/60"
      />

      <div className="flex flex-wrap gap-2">
        {canCreate && (
          <button
            type="button"
            onClick={() => pick({ slug: null, label: trimmed })}
            className="inline-flex min-h-11 items-center rounded-full border border-primary/60 border-dashed px-3.5 py-2 text-sm text-primary transition-colors hover:bg-primary/10"
          >
            + crear «{trimmed.toLowerCase()}»
          </button>
        )}

        {visible.map((option) => (
          <button
            key={option.slug}
            type="button"
            onClick={() => pick({ slug: option.slug, label: option.label })}
            className={cn(
              "chip-star inline-flex min-h-11 items-center gap-2 px-3.5 py-2 text-sm",
              !option.isCurated && "border-dashed",
            )}
          >
            {option.label}
            {option.uses > 0 && (
              <span className="font-mono text-[0.7rem] text-muted-foreground/70">
                {option.uses}
              </span>
            )}
          </button>
        ))}

        {!folded && !expanded && matches.length > preview && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex min-h-11 items-center px-2 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {verRestantes.replace("{n}", String(matches.length - preview))}
          </button>
        )}

        {folded && visible.length === 0 && !canCreate && (
          <p className="font-mono text-xs text-muted-foreground">
            nada con ese nombre — escribe al menos 2 letras para crearlo
          </p>
        )}
      </div>

      {emptyHint && value.length === 0 && (
        <p className="font-mono text-xs text-muted-foreground">{emptyHint}</p>
      )}
    </div>
  );
}
