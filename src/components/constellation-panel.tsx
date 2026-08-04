"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { QrCode, Search, SlidersHorizontal, Triangle, X } from "lucide-react";
import {
  ConstellationGraph,
  type GraphEdge,
  type GraphNode,
  type PaletaGrafo,
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

/** Qué tags están encendidos ahora mismo, por categoría. */
export type ActiveFilters = Record<TagCategory, string[]>;

const NO_FILTERS: ActiveFilters = { rol: [], interes: [], intencion: [] };

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
  creatorId = null,
  facets,
  event,
  active: controlledActive,
  onActiveChange,
  embedded = false,
  paleta,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  myId: string;
  /** Quién encendió esta galaxia — lo cuenta el MiniPerfil de su estrella. */
  creatorId?: string | null;
  facets: Record<TagCategory, TagFacet[]>;
  /** La galaxia activa: se pasa como datos (no JSX) — el JSX que cruza la
   *  frontera server→client pierde la validación de keys de React. */
  event: ActiveGalaxy;
  /** Filtro gobernado desde fuera (la demo de la landing lo empuja con lo que
   *  elegiste arriba). Sin él, el panel es dueño de su filtro, como en `/home`. */
  active?: ActiveFilters;
  onActiveChange?: (next: ActiveFilters) => void;
  /** El mapa vive dentro de una página que scrollea: devuelve los gestos de
   *  navegación al documento (ver `ConstellationGraph`). */
  embedded?: boolean;
  /** Otra tinta para el mismo mapa: lo usa `/opcion2`, que lo imprime sobre
   *  papel blanco. Sin ella, el cosmos de la app. */
  paleta?: PaletaGrafo;
}) {
  const [ownActive, setOwnActive] = useState<ActiveFilters>(NO_FILTERS);
  const active = controlledActive ?? ownActive;
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
      if (
        active.rol.length > 0 &&
        !node.role.some((r) => active.rol.includes(r))
      )
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

  function applyActive(next: ActiveFilters) {
    if (controlledActive === undefined) setOwnActive(next);
    onActiveChange?.(next);
  }

  function toggle(category: TagCategory, slug: string) {
    applyActive({
      ...active,
      [category]: active[category].includes(slug)
        ? active[category].filter((s) => s !== slug)
        : [...active[category], slug],
    });
  }

  function clearAll() {
    applyActive(NO_FILTERS);
    setQuery("");
  }

  /** En móvil la barra lleva un control más, así que el campo cede ancho:
   *  sin mínimo propio (`min-w-0`) nunca empuja los botones fuera del pill. */
  const searchField = (compact: boolean) => (
    <>
      <Search className="size-4 shrink-0 text-faint" aria-hidden />
      <input
        ref={compact ? undefined : searchRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={compact ? "Buscar…" : "Buscar estrellas…"}
        aria-label={`Buscar estrellas de ${event.name} por nombre`}
        className={cn(
          "flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint",
          compact ? "min-w-0" : "min-w-28",
        )}
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Limpiar búsqueda"
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </>
  );

  /** La lectura del filtro: cuántas estrellas siguen encendidas. */
  const filterReading = (short: boolean) => (
    <>
      {shown === 0 ? (
        <span className="text-muted-foreground">
          ninguna estrella coincide
        </span>
      ) : (
        <span>
          <span className="text-celeste">{shown}</span>{" "}
          <span className="text-muted-foreground">
            de {nodes.length}
            {short ? "" : " estrellas"}
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
    </>
  );

  /** Los grupos de facetas del evento: mismo contenido arriba en desktop y
   *  en la hoja del pulgar en móvil. */
  const filterGroups = TAG_CATEGORIES.filter((c) => facets[c].length > 0).map(
    (category) => {
      const all = facets[category];
      const list = showAll === category ? all : all.slice(0, TOP);
      return (
        <div key={category} className="flex flex-col gap-2">
          <p className="font-mono text-[10px] tracking-wider text-faint uppercase">
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
                onClick={() => setShowAll(showAll === category ? null : category)}
                className="inline-flex min-h-10 items-center px-2 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {showAll === category ? "menos" : `+${all.length - TOP}`}
              </button>
            )}
          </div>
        </div>
      );
    },
  );

  return (
    <section className="relative h-full min-h-0 w-full">
      {/* La constelación vive EN el cosmos, jamás dentro de una card. */}
      <div className="absolute inset-0">
        <ConstellationGraph
          nodes={nodes}
          edges={edges}
          myId={myId}
          creatorId={creatorId}
          matchedIds={matchedIds}
          tagLabels={tagLabels}
          showTriads={triads}
          showNames={showNames}
          embedded={embedded}
          paleta={paleta}
        />
      </div>

      {/* Desktop: la barra de mando sobre el mapa (búsqueda + chips + triádicos) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden justify-center p-4 lg:flex">
        <div className="pointer-events-auto glass flex h-[54px] w-full max-w-3xl items-center gap-3.5 rounded-full py-0 pr-2 pl-4.5">
          {searchField(false)}
          {quickChips.length > 0 && (
            <>
              <div className="h-5.5 w-px shrink-0 bg-white/10" aria-hidden />
              {/* En laptops la barra no da para todo: los chips ceden ancho y
                  scrollean antes que expulsar del pill a los controles fijos */}
              <div className="flex min-w-0 gap-1.5 overflow-x-auto [scrollbar-width:none]">
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
            aria-label="Cierres triádicos"
            className="chip-triad flex h-10 shrink-0 items-center gap-2 px-3.5 text-xs font-medium"
          >
            <Triangle className="size-3.5" aria-hidden />
            <span className="hidden xl:inline">Cierres triádicos</span>
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

      {/* Desktop: el panel de filtros cuelga de la barra de mando */}
      {open && hasFacets && (
        <div className="glass absolute top-[4.75rem] left-1/2 z-10 hidden max-h-[min(24rem,60%)] w-96 -translate-x-1/2 flex-col gap-4 overflow-y-auto rounded-3xl p-4 lg:flex">
          {filterGroups}
          {filtering && (
            <p className="flex items-center gap-2 font-mono text-xs">
              {filterReading(false)}
            </p>
          )}
        </div>
      )}

      {/* Lectura del filtro en desktop, discreta bajo la barra */}
      {filtering && !open && (
        <div className="pointer-events-none absolute inset-x-0 top-[4.75rem] z-10 hidden justify-center lg:flex">
          <p className="pointer-events-auto glass flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs">
            {filterReading(false)}
          </p>
        </div>
      )}

      {/* Móvil: filtros + chips + búsqueda + tu QR, al alcance del pulgar.
          Todo lo que se abre en móvil crece hacia arriba desde esta columna:
          nada aparece flotando sobre una estrella, donde no hay sitio. */}
      <div className="pointer-events-none absolute inset-x-3 bottom-2 z-10 flex flex-col gap-2.5 lg:hidden">
        {open && hasFacets && (
          <div className="glass animate-rise pointer-events-auto flex max-h-[52svh] flex-col gap-4 overflow-y-auto rounded-3xl p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                [ filtrar estrellas ]
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar filtros"
                className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-celeste/15 hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
            {filterGroups}
            {filtering && (
              <p className="flex items-center gap-2 font-mono text-xs">
                {filterReading(false)}
              </p>
            )}
          </div>
        )}
        {filtering && !open && (
          <div className="flex justify-center">
            <p className="pointer-events-auto glass flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs">
              {filterReading(true)}
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
        <div className="pointer-events-auto glass flex h-14 items-center gap-2 rounded-full py-0 pr-1.5 pl-3.5">
          {searchField(true)}
          <button
            type="button"
            onClick={() => setShowNames(!showNames)}
            aria-pressed={showNames}
            aria-label={
              showNames ? "Ocultar nombres" : "Mostrar nombres"
            }
            className="chip-star grid size-10 shrink-0 place-items-center text-sm font-bold"
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
            className="chip-triad grid size-10 shrink-0 place-items-center"
          >
            <Triangle className="size-4" aria-hidden />
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
          <Link
            href="/qr"
            className="btn-sol grid size-10 shrink-0 place-items-center"
            aria-label="Mostrar mi QR"
          >
            <QrCode className="size-4.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
