import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { eventDate } from "@/lib/format";
import { NO_INDEXAR } from "@/lib/seo";
import type { GraphEdge, GraphNode } from "@/components/constellation-graph";
import { ConstellationPanel } from "@/components/constellation-panel";
import {
  buildFacets,
  fetchTagCatalog,
  type TagCategory,
  type TagFacet,
} from "@/lib/tags";
import { LiveRefresh } from "./refresh";

/**
 * Proyección en vivo (diseño 2f mejorado): constelación interactiva del evento
 * en tiempo real. Datos actualizados cada 30s, pan/zoom/filtros habilitados.
 */

/** Gente real de un evento real, proyectada en una pared: no se archiva. */
export const metadata: Metadata = { title: "Proyección en vivo", ...NO_INDEXAR };


export default async function LivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/e/${slug}/live`)}`);

  // Solo-asistentes igual que la ficha: para extraños, cero filas → 404
  const { data } = await supabase.rpc("get_event_by_slug", { p_slug: slug });
  const event = data?.[0];
  if (!event) notFound();

  const { data: graph } = await supabase.rpc("get_event_graph", {
    p_event_id: event.id,
  });
  const nodes: GraphNode[] = graph?.nodes ?? [];
  const edges: GraphEdge[] = graph?.edges ?? [];

  const catalog = await fetchTagCatalog(supabase);
  const facets: Record<TagCategory, TagFacet[]> = buildFacets(nodes, catalog);

  return (
    <main className="relative z-10 flex flex-1 flex-col xl:h-svh xl:flex-row xl:overflow-hidden">
      <LiveRefresh />
      <h1 className="sr-only">Proyección en vivo — {event.name}</h1>

      {/* Botón de vuelta */}
      <Link
        href={`/e/${slug}`}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-accent lg:top-8 lg:left-8"
      >
        <ChevronLeft className="size-5" aria-hidden />
        <span className="text-sm font-medium">volver</span>
      </Link>

      {/* El grafo: interactivo, pan/zoom/filtros habilitados */}
      <div className="relative h-[70vh] min-h-80 shrink-0 sm:h-[72vh] lg:h-screen xl:h-auto xl:min-h-0 xl:flex-1 xl:shrink xl:overflow-hidden">
        <ConstellationPanel
          nodes={nodes}
          edges={edges}
          myId={user.id}
          creatorId={graph?.createdBy ?? null}
          facets={facets}
          event={{
            name: event.name,
            dateLabel: eventDate(event.starts_at),
            galaxySeed: event.slug.charCodeAt(0),
            switchHref: "/eventos",
            switchLabel: "volver a eventos",
          }}
        />
      </div>
    </main>
  );
}
