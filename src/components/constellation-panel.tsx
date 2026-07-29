"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { QrCode, Search, SlidersHorizontal, Triangle, X } from "lucide-react";
import {
  ConstellationGraph,
  type GraphEdge,
  type GraphNode,
} from "@/components/constellation-graph";
import { Galaxia } from "@/components/cosmos";
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

/** Cuántos chips por grupo antes de plegar el resto (panel de filtros). */
const TOP = 6;

/** Chips rápidos en la barra: los tags más poblados del evento. */
const QUICK = 4;

type Active = Record<TagCategory, string[]>;

const NOTHING: Active = { rol: [], interes: [], intencion: [] };

/**
 * El universo del evento (diseño 1b): el grafo a sangre completa y, flotando
 * encima, cristal — búsqueda de estrellas con chips rápidos y el toggle de
 * cierres triádicos arriba en desktop; en móvil, el evento como pill arriba
 * y los controles al alcance del pulgar abajo. Filtrar o buscar nunca
 * reordena el mapa: lo no coincidente se apaga al 14 %.
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
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  myId: string;
  facets: Record<TagCategory, TagFacet[]>;
  /** La galaxia activa: se pasa como datos (no JSX) — el JSX que cruza la
   *  frontera server→client pierde la validación de keys de React. */
  event: ActiveGalaxy;
}) {
  const [active, setActive] = useState<Active>(NOTHING);
  const [query, setQuery] = useState("");
  const [triads, setTriads] = useState(true);
  const [showNames, setShowNames] = useState(true);
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

  // Los tags más poblados del evento, entre todas las categorías: chips
  // rápidos de la barra. Solo datos que existen aquí, nunca un catálogo fijo.
  const quickChips = useMemo(
    () =>
      TAG_CATEGORIES.flatMap((c) => facets[c])
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
        .slice(0, QUICK),
    [facets],
  );

  // slug → label para que el MiniPerfil hable en humano
  const tagLabels = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of TAG_CATEGORIES)
      for (const f of facets[c]) map.set(f.slug, f.label);
    return map;
  }, [facets]);

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

  const searchInput = (
    <>
      <Search className="size-4 shrink-0 text-faint" aria-hidden />
      <input
        ref={searchRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar estrellas…"
        aria-label={`Buscar estrellas de ${event.name} por nombre`}
        className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
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
      ) : null}
    </>
  );

  return (
    <section className="relative h-full min-h-0 w-full">
      {/* La constelación vive EN el cosmos, jamás dentro de una card. */}
      <div className="absolute inset-0">
        <ConstellationGraph
          nodes={nodes}
          edges={edges}
          myId={myId}
          matchedIds={matchedIds}
          tagLabels={tagLabels}
          showTriads={triads}
          showNames={showNames}
        />
      </div>

      {/* Desktop: la barra de mando sobre el mapa (búsqueda + chips + triádicos) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden justify-center p-4 lg:flex">
        <div className="pointer-events-auto glass flex h-[54px] w-full max-w-3xl items-center gap-3.5 rounded-full py-0 pr-2 pl-4.5">
          {searchInput}
          {quickChips.length > 0 && (
            <>
              <div className="h-5.5 w-px shrink-0 bg-white/10" aria-hidden />
              <div className="flex shrink-0 gap-1.5">
                {quickChips.map((facet) => (
                  <button
                    key={facet.slug}
                    type="button"
                    onClick={() => toggle(facet.category, facet.slug)}
                    aria-pressed={active[facet.category].includes(facet.slug)}
                    className="chip-star px-3 py-[7px] text-xs font-medium"
                  >
                    {facet.label}
                  </button>
                ))}
              </div>
            </>
          )}
          <button
            type="button"
            onClick={() => setShowNames(!showNames)}
            aria-pressed={showNames}
            aria-label={showNames ? "Ocultar nombres" : "Mostrar nombres"}
            className="chip-star grid size-10 shrink-0 place-items-center"
          >
            <span aria-hidden className="text-sm font-bold">A</span>
          </button>
          <button
            type="button"
            onClick={() => setTriads(!triads)}
            aria-pressed={triads}
            className="chip-triad flex h-10 shrink-0 items-center gap-2 px-3.5 text-xs font-medium"
          >
            <Triangle className="size-3.5" aria-hidden />
            Cierres triádicos
          </button>
          {hasFacets && (
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Ocultar filtros" : "Filtrar estrellas"}
              className={cn(
                "chip-star grid size-10 shrink-0 place-items-center",
                activeCount > 0 && "text-celeste",
              )}
              data-active={activeCount > 0}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Móvil: la galaxia activa como pill arriba */}
      <div className="pointer-events-none absolute inset-x-3 top-2 z-10 flex justify-start lg:hidden">
        <div className="pointer-events-auto glass flex min-w-0 items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2">
          <Galaxia seed={event.galaxySeed} size={30} active />
          <div className="min-w-0">
            <p className="max-w-52 truncate text-[13px] leading-tight font-medium">
              {event.name}
            </p>
            <p className="font-mono text-[10px] text-faint">
              {nodes.length} estrellas ·{" "}
              <Link
                href={event.switchHref}
                className="pointer-events-auto text-celeste"
              >
                {event.switchLabel}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Panel de filtros completo: una hoja de cristal bajo la barra */}
      {open && hasFacets && (
        <div className="glass absolute top-16 left-1/2 z-10 flex max-h-[min(24rem,60%)] w-[min(24rem,calc(100%-1.5rem))] -translate-x-1/2 flex-col gap-4 overflow-y-auto rounded-3xl p-4 lg:top-[4.75rem]">
          {TAG_CATEGORIES.filter((c) => facets[c].length > 0).map((category) => {
            const all = facets[category];
            const list = showAll === category ? all : all.slice(0, TOP);
            return (
              <div key={category} className="flex flex-col gap-2">
                <p className="font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
                  [ {GROUP_TITLE[category]} ]
                </p>
                <div className="flex flex-wrap gap-2">
                  {list.map((facet) => (
                    <button
                      key={facet.slug}
                      type="button"
                      onClick={() => toggle(category, facet.slug)}
                      aria-pressed={active[category].includes(facet.slug)}
                      className="chip-star inline-flex min-h-10 items-center gap-1.5 px-3 py-1.5 text-sm"
                    >
                      {facet.label}
                      <span className="font-mono text-[0.7rem] opacity-70">
                        {facet.count}
                      </span>
                    </button>
                  ))}
                  {all.length > TOP && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAll(showAll === category ? null : category)
                      }
                      className="inline-flex min-h-10 items-center px-2 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {showAll === category ? "menos" : `+${all.length - TOP}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtering && (
            <p className="flex items-center gap-2 font-mono text-xs">
              {shown === 0 ? (
                <span className="text-muted-foreground">
                  ninguna estrella coincide
                </span>
              ) : (
                <span>
                  <span className="text-celeste">{shown}</span>{" "}
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
        </div>
      )}

      {/* Lectura del filtro en desktop, discreta bajo la barra */}
      {filtering && !open && (
        <div className="pointer-events-none absolute inset-x-0 top-[4.75rem] z-10 hidden justify-center lg:flex">
          <p className="pointer-events-auto glass flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs">
            {shown === 0 ? (
              <span className="text-muted-foreground">
                ninguna estrella coincide
              </span>
            ) : (
              <span>
                <span className="text-celeste">{shown}</span>{" "}
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
        </div>
      )}

      {/* Móvil: chips + búsqueda + tu QR, al alcance del pulgar */}
      <div className="pointer-events-none absolute inset-x-3 bottom-2 z-10 flex flex-col gap-2.5 lg:hidden">
        {filtering && (
          <div className="flex justify-center">
            <p className="pointer-events-auto glass flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs">
              {shown === 0 ? (
                <span className="text-muted-foreground">
                  ninguna estrella coincide
                </span>
              ) : (
                <span>
                  <span className="text-celeste">{shown}</span>{" "}
                  <span className="text-muted-foreground">
                    de {nodes.length}
                  </span>
                </span>
              )}
              <button
                type="button"
                onClick={clearAll}
                className="text-muted-foreground underline-offset-4 hover:text-foreground"
              >
                limpiar
              </button>
            </p>
          </div>
        )}
        {quickChips.length > 0 && (
          <div
            className="pointer-events-auto flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]"
            style={{
              maskImage:
                "linear-gradient(to right, #000 0, #000 88%, transparent 100%)",
            }}
          >
            {quickChips.map((facet) => (
              <button
                key={facet.slug}
                type="button"
                onClick={() => toggle(facet.category, facet.slug)}
                aria-pressed={active[facet.category].includes(facet.slug)}
                className="chip-star px-3.5 py-2.5 text-[13px] font-medium"
              >
                {facet.label}
              </button>
            ))}
          </div>
        )}
        <div className="pointer-events-auto glass flex h-14 items-center gap-2.5 rounded-full py-0 pr-2 pl-4">
          {searchInput}
          <button
            type="button"
            onClick={() => setShowNames(!showNames)}
            aria-pressed={showNames}
            aria-label={
              showNames ? "Ocultar nombres" : "Mostrar nombres"
            }
            className="chip-star grid size-11 shrink-0 place-items-center text-sm font-bold"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setTriads(!triads)}
            aria-pressed={triads}
            aria-label={
              triads ? "Ocultar cierres triádicos" : "Mostrar cierres triádicos"
            }
            className="chip-triad grid size-11 shrink-0 place-items-center"
          >
            <Triangle className="size-4" aria-hidden />
          </button>
          <Link
            href="/qr"
            className="btn-sol grid size-11 shrink-0 place-items-center"
            aria-label="Mostrar mi QR"
          >
            <QrCode className="size-5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
