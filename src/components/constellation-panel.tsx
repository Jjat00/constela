"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { QrCode, Search, SlidersHorizontal, X } from "lucide-react";
import {
  ConstellationGraph,
  type GraphEdge,
  type GraphNode,
} from "@/components/constellation-graph";
import { Galaxia } from "@/components/cosmos";
import { Button } from "@/components/ui/button";
import {
  TAG_CATEGORIES,
  foldForSearch,
  type TagCategory,
  type TagFacet,
} from "@/lib/tags";
import { cn } from "@/lib/utils";

const GROUP_TITLE: Record<TagCategory, string> = {
  rol: "rol",
  interes: "intereses",
  intencion: "busca",
};

/** Cuántos chips por grupo antes de plegar el resto. */
const TOP = 6;

type Active = Record<TagCategory, string[]>;

const NOTHING: Active = { rol: [], interes: [], intencion: [] };

/**
 * El universo del evento: el grafo a sangre completa y, flotando encima,
 * cristal — la galaxia activa, la búsqueda de estrellas (real: busca por
 * nombre entre quienes están AQUÍ) y los filtros. Filtrar o buscar nunca
 * reordena el mapa: lo no coincidente se apaga a polvo (DESIGN.md v4 §6).
 */
export type ActiveGalaxy = {
  name: string;
  dateLabel: string | null;
  /** Semilla de la espiral: estable por evento. */
  galaxySeed: number;
  switchHref: string;
  switchLabel: string;
};

export function ConstellationPanel({
  nodes,
  edges,
  myId,
  facets,
  event,
  showHero = false,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  myId: string;
  facets: Record<TagCategory, TagFacet[]>;
  /** La galaxia activa: se pasa como datos (no JSX) — el JSX que cruza la
   *  frontera server→client pierde la validación de keys de React. */
  event: ActiveGalaxy;
  /** Titular Persuade sobre el vacío del grafo, solo desktop. */
  showHero?: boolean;
}) {
  const [active, setActive] = useState<Active>(NOTHING);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState<TagCategory | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K: buscar es alcanzar el universo con el teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeCount = TAG_CATEGORIES.reduce(
    (total, category) => total + active[category].length,
    0,
  );
  const folded = foldForSearch(query.trim());
  const filtering = activeCount > 0 || folded.length > 0;

  const matchedIds = useMemo(() => {
    if (!filtering) return null;
    const matches = (node: GraphNode) => {
      // Dentro de una categoría basta con una coincidencia; entre categorías
      // (y con la búsqueda) se exigen todas a la vez.
      if (folded && !foldForSearch(node.name).includes(folded)) return false;
      if (active.rol.length > 0 && (!node.role || !active.rol.includes(node.role)))
        return false;
      if (
        active.interes.length > 0 &&
        !node.tags?.some((t) => active.interes.includes(t))
      )
        return false;
      if (
        active.intencion.length > 0 &&
        !node.intents?.some((i) => active.intencion.includes(i))
      )
        return false;
      return true;
    };
    return new Set(nodes.filter(matches).map((n) => n.id));
  }, [nodes, active, folded, filtering]);

  const shown = matchedIds
    ? nodes.filter((n) => matchedIds.has(n.id)).length
    : nodes.length;

  const hasFacets = TAG_CATEGORIES.some((c) => facets[c].length > 0);

  function toggle(category: TagCategory, slug: string) {
    setActive((prev) => ({
      ...prev,
      [category]: prev[category].includes(slug)
        ? prev[category].filter((s) => s !== slug)
        : [...prev[category], slug],
    }));
  }

  function clearAll() {
    setActive(NOTHING);
    setQuery("");
  }

  return (
    <section className="relative h-full min-h-0 w-full">
      {/* La constelación vive EN el cosmos, jamás dentro de una card.
          Con el hero visible, el cúmulo se centra a la derecha del titular. */}
      <div
        className={cn(
          "absolute inset-0",
          showHero && "xl:left-[23rem] 2xl:left-[26rem]",
        )}
      >
        <ConstellationGraph
          nodes={nodes}
          edges={edges}
          myId={myId}
          matchedIds={matchedIds}
        />
      </div>

      {/* Persuade dentro de Operate: cada pantalla es una primera impresión.
          Decorativo para el lector de pantalla — el h1 real vive en la página. */}
      {showHero && (
        <div className="pointer-events-none absolute top-1/2 left-6 z-10 hidden max-w-sm -translate-y-1/2 flex-col items-start gap-5 xl:flex 2xl:left-10">
          {/* El texto duplica al h1 de la página: decorativo para el lector.
              El CTA sí queda expuesto — un botón enfocable jamás va aria-hidden. */}
          <p
            aria-hidden
            className="text-5xl leading-[1.05] font-bold tracking-tight 2xl:text-6xl"
          >
            Tu red es
            <br />
            <span className="text-glow text-lavanda">tu universo.</span>
          </p>
          <p
            aria-hidden
            className="max-w-72 text-base leading-7 text-muted-foreground"
          >
            Cada persona que conoces es una estrella. Escanea, conecta y mira
            crecer tu constelación.
          </p>
          <Button
            asChild
            size="lg"
            className="node-glow pointer-events-auto h-12 rounded-full px-6 text-base"
          >
            <Link href="/qr">
              <QrCode className="size-4" aria-hidden />
              Mostrar mi QR
            </Link>
          </Button>
        </div>
      )}

      {/* Cristal flotante: galaxia activa + búsqueda + filtros */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4 lg:p-6">
        <div className="pointer-events-auto glass flex min-w-0 items-center gap-3 rounded-2xl py-2 pr-4 pl-2.5">
          <Galaxia seed={event.galaxySeed} size={38} />
          <div className="flex min-w-0 flex-col">
            <p className="font-mono text-[9px] tracking-[0.3em] text-lavanda uppercase">
              [ estás en ]
            </p>
            <p className="max-w-44 truncate text-sm leading-tight font-semibold sm:max-w-56">
              {event.name}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {event.dateLabel ?? "fecha por definir"}
              {" · "}
              <Link
                href={event.switchHref}
                className="text-lavanda underline-offset-4 hover:underline"
              >
                {event.switchLabel}
              </Link>
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <label className="glass flex h-11 items-center gap-2 rounded-full pr-3 pl-3.5 transition-colors focus-within:border-primary/50">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar estrellas…"
              aria-label={`Buscar estrellas de ${event.name} por nombre`}
              className="w-28 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-40 lg:w-52"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            ) : (
              <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground lg:inline">
                ⌘K
              </kbd>
            )}
          </label>

          {hasFacets && (
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Ocultar filtros" : "Filtrar estrellas"}
              className={cn(
                "glass flex h-11 items-center gap-2 rounded-full px-3.5 text-sm transition-colors",
                activeCount > 0
                  ? "border-primary/60 text-lavanda"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              {activeCount > 0 && activeCount}
            </button>
          )}
        </div>
      </div>

      {/* Panel de filtros: una hoja de cristal bajo los controles */}
      {open && hasFacets && (
        <div className="glass absolute top-16 right-3 z-10 flex max-h-[min(24rem,60%)] w-[min(21rem,calc(100%-1.5rem))] flex-col gap-4 overflow-y-auto rounded-2xl p-4 sm:right-4 lg:top-[4.5rem] lg:right-6">
          {TAG_CATEGORIES.filter((c) => facets[c].length > 0).map((category) => {
            const all = facets[category];
            const list = showAll === category ? all : all.slice(0, TOP);
            return (
              <div key={category} className="flex flex-col gap-2">
                <p className="font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase">
                  [ {GROUP_TITLE[category]} ]
                </p>
                <div className="flex flex-wrap gap-2">
                  {list.map((facet) => {
                    const on = active[category].includes(facet.slug);
                    return (
                      <button
                        key={facet.slug}
                        type="button"
                        onClick={() => toggle(category, facet.slug)}
                        aria-pressed={on}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                          on
                            ? "border-primary/70 bg-primary/20 text-lavanda"
                            : "border-white/10 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                        )}
                      >
                        {facet.label}
                        <span className="font-mono text-[0.7rem] opacity-70">
                          {facet.count}
                        </span>
                      </button>
                    );
                  })}
                  {all.length > TOP && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAll(showAll === category ? null : category)
                      }
                      className="inline-flex min-h-11 items-center px-2 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {showAll === category ? "menos" : `+${all.length - TOP}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lectura del filtro y guía de la sala, abajo y discretas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1.5 p-3 text-center">
        {filtering && (
          <p className="pointer-events-auto glass flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs">
            {shown === 0 ? (
              <span className="text-muted-foreground">
                ninguna estrella coincide
              </span>
            ) : (
              <span>
                <span className="text-lavanda">{shown}</span>{" "}
                <span className="text-muted-foreground">
                  de {nodes.length} estrellas
                </span>
              </span>
            )}
            <button
              type="button"
              onClick={clearAll}
              className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              limpiar
            </button>
          </p>
        )}
        <p className="font-mono text-[10px] leading-4 text-muted-foreground/80 sm:text-xs">
          toca una estrella para verla — arrastra para reacomodar tu cielo
        </p>
      </div>
    </section>
  );
}
