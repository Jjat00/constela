"use client";

import { useMemo, useState } from "react";
import {
  ConstellationGraph,
  type GraphEdge,
  type GraphNode,
} from "@/components/constellation-graph";
import { TAG_CATEGORIES, type TagCategory, type TagFacet } from "@/lib/tags";
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

export function ConstellationPanel({
  nodes,
  edges,
  myId,
  facets,
  eventName,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  myId: string;
  facets: Record<TagCategory, TagFacet[]>;
  eventName: string;
}) {
  const [active, setActive] = useState<Active>(NOTHING);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState<TagCategory | null>(null);

  const activeCount = TAG_CATEGORIES.reduce(
    (total, category) => total + active[category].length,
    0,
  );

  const matchedIds = useMemo(() => {
    if (activeCount === 0) return null;
    const matches = (node: GraphNode) => {
      // Dentro de una categoría basta con una coincidencia; entre categorías
      // se exigen todas: "founders" + "llms" = founders a los que les mueve
      // la ia, no la suma de ambos grupos.
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
  }, [nodes, active, activeCount]);

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

  return (
    <section className="flex min-h-0 flex-col gap-2 rounded-2xl border border-border bg-card p-2 lg:flex-1">
      {hasFacets && (
        <div className="flex flex-col gap-3 px-2 pt-2">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors",
                activeCount > 0
                  ? "border-primary/60 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {open ? "ocultar filtros" : "filtrar estrellas"}
              {activeCount > 0 && ` · ${activeCount}`}
            </button>

            {activeCount > 0 && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  <span className="text-primary">{shown}</span> de {nodes.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActive(NOTHING)}
                  className="font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  limpiar
                </button>
              </div>
            )}
          </div>

          {open && (
            <div className="flex flex-col gap-4 pb-1">
              {TAG_CATEGORIES.filter((c) => facets[c].length > 0).map(
                (category) => {
                  const all = facets[category];
                  const list =
                    showAll === category ? all : all.slice(0, TOP);
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
                                "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                                on
                                  ? "border-primary bg-primary/15 text-primary"
                                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
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
                            className="inline-flex min-h-9 items-center px-2 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                          >
                            {showAll === category
                              ? "menos"
                              : `+${all.length - TOP}`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      )}

      <div className="h-[52vh] min-h-64 lg:h-auto lg:min-h-0 lg:flex-1">
        <ConstellationGraph
          nodes={nodes}
          edges={edges}
          myId={myId}
          matchedIds={matchedIds}
        />
      </div>

      <p className="px-2 pb-2 text-center font-mono text-[10px] leading-4 text-muted-foreground sm:text-xs">
        {activeCount > 0 && shown === 0
          ? "ninguna estrella coincide ✦ prueba con menos filtros"
          : `la constelación de ${eventName} ✦ toca una estrella para verla`}
      </p>
    </section>
  );
}
