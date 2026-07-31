import type { GraphEdge, GraphNode } from "@/components/constellation-graph";
import { eventDate } from "@/lib/format";
import { buildFacets, type CatalogTag, type TagCatalog, type TagCategory } from "@/lib/tags";

/**
 * El universo de ejemplo de la landing: una constelación completa —
 * asistentes, señales y conexiones— para que quien llega pueda tocar la app
 * real antes de entrar. No es una maqueta: estos datos alimentan los MISMOS
 * componentes que `/home` (`ConstellationPanel` → `ConstellationGraph`) y el
 * mismo `TagPicker` de `/bienvenida`.
 *
 * Reglas que respeta, para que no enseñe nada falso:
 * - El vocabulario sale del catálogo curado real (migración 0007); los slugs
 *   son los que produce `tag_slugify`.
 * - Nadie nace como estrella suelta: cada persona entra conectándose a gente
 *   que ya se conoce entre sí, así que la constelación tiene cierres triádicos
 *   de verdad (el momento visual de la marca), no un grafo aleatorio.
 * - Las conexiones no llevan nota: escribir notas todavía no existe en la app,
 *   y la landing no muestra funciones que no puedes usar.
 * - Nada de fechas relativas al reloj: el universo es idéntico en servidor y
 *   en cliente (cero hydration mismatch) y en cada visita.
 */

type Persona = Pick<GraphNode, "id" | "name" | "role" | "tags" | "intents">;

/** Las 23 personas del evento de ejemplo. Tú eres la estrella 24. */
const ROSTER: Persona[] = [
  { id: "ana-mora", name: "Ana Mora", role: ["ui-design"], tags: ["diseno", "ia"], intents: ["conocer-gente"] },
  { id: "luis-cabal", name: "Luis Cabal", role: ["backend"], tags: ["backend", "ia"], intents: ["busco-trabajo"] },
  { id: "sara-quintero", name: "Sara Quintero", role: ["ai-engineer"], tags: ["ia", "open-source"], intents: ["ofrezco-mentoria"] },
  { id: "david-rincon", name: "David Rincón", role: ["frontend"], tags: ["frontend", "diseno"], intents: ["vine-a-aprender"] },
  { id: "mariana-lopez", name: "Mariana López", role: ["product-manager"], tags: ["producto", "ia"], intents: ["contratando"] },
  { id: "julian-vega", name: "Julián Vega", role: ["devops"], tags: ["infraestructura", "open-source"], intents: ["conocer-gente"] },
  { id: "carolina-diaz", name: "Carolina Díaz", role: ["data-scientist", "ai-engineer"], tags: ["datos", "ia"], intents: ["busco-trabajo"] },
  { id: "tomas-herrera", name: "Tomás Herrera", role: ["founder"], tags: ["startups", "ia"], intents: ["busco-inversion"] },
  { id: "valentina-ruiz", name: "Valentina Ruiz", role: ["ux-research", "product-design"], tags: ["diseno", "producto"], intents: ["vine-a-aprender"] },
  { id: "andres-pineda", name: "Andrés Pineda", role: ["ml-engineer", "ai-engineer"], tags: ["ia", "datos"], intents: ["contratando"] },
  { id: "laura-benitez", name: "Laura Benítez", role: ["recruiter"], tags: ["carrera", "ia"], intents: ["contratando"] },
  { id: "sebastian-cano", name: "Sebastián Cano", role: ["estudiante", "frontend"], tags: ["ia", "frontend"], intents: ["vine-a-aprender"] },
  { id: "daniela-osorio", name: "Daniela Osorio", role: ["product-design", "ui-design"], tags: ["diseno", "producto"], intents: ["conocer-gente"] },
  { id: "felipe-arango", name: "Felipe Arango", role: ["full-stack", "frontend"], tags: ["frontend", "backend"], intents: ["busco-trabajo"] },
  { id: "camila-torres", name: "Camila Torres", role: ["devrel", "comunidad"], tags: ["comunidad", "open-source"], intents: ["conocer-gente"] },
  { id: "mateo-salazar", name: "Mateo Salazar", role: ["data-engineer"], tags: ["datos", "infraestructura"], intents: ["vine-a-aprender"] },
  { id: "paula-guzman", name: "Paula Guzmán", role: ["marketing"], tags: ["marketing", "startups"], intents: ["busco-clientes"] },
  { id: "nicolas-mejia", name: "Nicolás Mejía", role: ["seguridad", "devops"], tags: ["seguridad", "infraestructura"], intents: ["conocer-gente"] },
  { id: "isabela-rojas", name: "Isabela Rojas", role: ["cto", "ai-engineer"], tags: ["ia", "startups"], intents: ["contratando"] },
  { id: "juan-prieto", name: "Juan Prieto", role: ["movil", "frontend"], tags: ["movil", "frontend"], intents: ["busco-trabajo"] },
  { id: "natalia-cardenas", name: "Natalia Cárdenas", role: ["diseno", "ui-design"], tags: ["diseno", "comunidad"], intents: ["ofrezco-mentoria"] },
  { id: "santiago-lara", name: "Santiago Lara", role: ["inversionista"], tags: ["startups", "inversion"], intents: ["conocer-gente"] },
  { id: "gabriela-nino", name: "Gabriela Niño", role: ["ai-engineer", "founder"], tags: ["ia", "producto"], intents: ["busco-cofundador"] },
];

/** Etiquetas y alias tal como viven en el catálogo curado (migración 0007). */
const VOCABULARIO: Record<
  TagCategory,
  Array<{ slug: string; label: string; aliases?: string[] }>
> = {
  rol: [
    { slug: "ai-engineer", label: "ai engineer", aliases: ["ai", "ia", "agentes"] },
    { slug: "frontend", label: "frontend", aliases: ["front-end", "front", "web"] },
    { slug: "backend", label: "backend", aliases: ["back-end", "servidor"] },
    { slug: "full-stack", label: "full stack", aliases: ["fullstack"] },
    { slug: "movil", label: "móvil", aliases: ["mobile", "android", "ios"] },
    { slug: "ml-engineer", label: "ml engineer", aliases: ["machine-learning", "ml"] },
    { slug: "data-scientist", label: "data scientist", aliases: ["ds"] },
    { slug: "data-engineer", label: "data engineer", aliases: ["datos"] },
    { slug: "devops", label: "devops", aliases: ["sre", "platform"] },
    { slug: "seguridad", label: "seguridad", aliases: ["security", "appsec"] },
    { slug: "ui-design", label: "ui design", aliases: ["ui", "ux-ui"] },
    { slug: "product-design", label: "product design", aliases: ["product-designer"] },
    { slug: "ux-research", label: "ux research", aliases: ["ux", "investigacion"] },
    { slug: "diseno", label: "diseño", aliases: ["design", "grafico"] },
    { slug: "product-manager", label: "product manager", aliases: ["pm", "producto"] },
    { slug: "devrel", label: "devrel", aliases: ["developer-relations"] },
    { slug: "comunidad", label: "comunidad", aliases: ["community-manager"] },
    { slug: "marketing", label: "marketing", aliases: ["growth"] },
    { slug: "founder", label: "founder", aliases: ["fundador", "cofundador"] },
    { slug: "cto", label: "cto", aliases: ["director-de-tecnologia"] },
    { slug: "inversionista", label: "inversionista", aliases: ["investor", "vc"] },
    { slug: "recruiter", label: "recruiter", aliases: ["reclutador", "talento"] },
    { slug: "estudiante", label: "estudiante", aliases: ["student"] },
  ],
  interes: [
    { slug: "ia", label: "ia", aliases: ["inteligencia-artificial", "llms", "agentes", "rag"] },
    { slug: "diseno", label: "diseño", aliases: ["design", "ux", "ui", "figma"] },
    { slug: "frontend", label: "frontend", aliases: ["react", "nextjs", "typescript"] },
    { slug: "producto", label: "producto", aliases: ["product", "discovery"] },
    { slug: "startups", label: "startups", aliases: ["emprendimiento"] },
    { slug: "datos", label: "datos", aliases: ["data", "sql", "analitica"] },
    { slug: "infraestructura", label: "infraestructura", aliases: ["devops", "cloud", "kubernetes"] },
    { slug: "open-source", label: "open source", aliases: ["oss", "codigo-abierto"] },
    { slug: "backend", label: "backend", aliases: ["apis", "go", "python"] },
    { slug: "comunidad", label: "comunidad", aliases: ["community", "meetups"] },
    { slug: "seguridad", label: "seguridad", aliases: ["ciberseguridad", "hacking"] },
    { slug: "movil", label: "móvil", aliases: ["mobile", "flutter", "swift"] },
    { slug: "marketing", label: "marketing", aliases: ["growth", "contenido"] },
    { slug: "carrera", label: "carrera", aliases: ["career", "trabajo-remoto"] },
    { slug: "inversion", label: "inversión", aliases: ["fundraising", "vc"] },
  ],
  intencion: [
    { slug: "conocer-gente", label: "conocer gente", aliases: ["networking"] },
    { slug: "contratando", label: "contratando", aliases: ["hiring", "vacantes"] },
    { slug: "busco-trabajo", label: "busco trabajo", aliases: ["empleo"] },
    { slug: "vine-a-aprender", label: "vine a aprender", aliases: ["aprender"] },
    { slug: "ofrezco-mentoria", label: "ofrezco mentoría", aliases: ["mentorear"] },
    { slug: "busco-cofundador", label: "busco cofundador", aliases: ["socio"] },
    { slug: "busco-inversion", label: "busco inversión", aliases: ["fundraising"] },
    { slug: "busco-clientes", label: "busco clientes", aliases: ["vender"] },
  ],
};

/** Cuánta gente del evento lleva ese tag: el `uses` que muestra el picker. */
function usosDe(category: TagCategory, slug: string): number {
  return ROSTER.filter((persona) => {
    if (category === "rol") return persona.role.includes(slug);
    if (category === "interes") return persona.tags.includes(slug);
    return persona.intents.includes(slug);
  }).length;
}

function catalogoDe(category: TagCategory): CatalogTag[] {
  return VOCABULARIO[category]
    .map((tag) => ({
      category,
      slug: tag.slug,
      label: tag.label,
      aliases: tag.aliases ?? [],
      isCurated: true,
      uses: usosDe(category, tag.slug),
    }))
    .sort((a, b) => b.uses - a.uses || a.label.localeCompare(b.label));
}

export const DEMO_CATALOG: TagCatalog = {
  rol: catalogoDe("rol"),
  interes: catalogoDe("interes"),
  intencion: catalogoDe("intencion"),
};

/** Tu estrella en el ejemplo: el sol del mapa, como en tu propia galaxia. */
export const DEMO_ME_ID = "tu";

export const DEMO_NODES: GraphNode[] = [
  {
    id: DEMO_ME_ID,
    name: "Tú",
    headline: null,
    role: [],
    tags: [],
    intents: [],
    avatarUrl: null,
    qrSlug: DEMO_ME_ID,
  },
  ...ROSTER.map((persona) => ({
    ...persona,
    headline: null,
    avatarUrl: null,
    qrSlug: persona.id,
  })),
];

/**
 * Quién se cruzó con quién. Cada trío consecutivo cierra un triángulo: es la
 * misma regla del seed de QA — nadie llega a un evento sin que alguien lo
 * presente a un grupo que ya se conoce.
 */
const ENCUENTROS: Array<[string, string]> = [
  ["tu", "ana-mora"],
  ["tu", "david-rincon"],
  ["ana-mora", "david-rincon"],
  ["tu", "sara-quintero"],
  ["tu", "mariana-lopez"],
  ["sara-quintero", "mariana-lopez"],
  ["tu", "sebastian-cano"],
  ["tu", "camila-torres"],
  ["camila-torres", "sebastian-cano"],
  ["ana-mora", "daniela-osorio"],
  ["ana-mora", "natalia-cardenas"],
  ["daniela-osorio", "natalia-cardenas"],
  ["daniela-osorio", "valentina-ruiz"],
  ["valentina-ruiz", "ana-mora"],
  ["david-rincon", "felipe-arango"],
  ["david-rincon", "juan-prieto"],
  ["felipe-arango", "juan-prieto"],
  ["sara-quintero", "andres-pineda"],
  ["sara-quintero", "carolina-diaz"],
  ["andres-pineda", "carolina-diaz"],
  ["andres-pineda", "mateo-salazar"],
  ["carolina-diaz", "mateo-salazar"],
  ["gabriela-nino", "sara-quintero"],
  ["gabriela-nino", "isabela-rojas"],
  ["isabela-rojas", "sara-quintero"],
  ["isabela-rojas", "tomas-herrera"],
  ["tomas-herrera", "santiago-lara"],
  ["santiago-lara", "isabela-rojas"],
  ["tomas-herrera", "paula-guzman"],
  ["paula-guzman", "santiago-lara"],
  ["julian-vega", "mateo-salazar"],
  ["julian-vega", "nicolas-mejia"],
  ["nicolas-mejia", "mateo-salazar"],
  ["luis-cabal", "felipe-arango"],
  ["luis-cabal", "sebastian-cano"],
  ["felipe-arango", "sebastian-cano"],
  ["laura-benitez", "luis-cabal"],
  ["laura-benitez", "carolina-diaz"],
  ["laura-benitez", "mariana-lopez"],
  ["mariana-lopez", "gabriela-nino"],
  ["camila-torres", "natalia-cardenas"],
  ["camila-torres", "julian-vega"],
  ["valentina-ruiz", "mariana-lopez"],
  ["juan-prieto", "sebastian-cano"],
  ["nicolas-mejia", "luis-cabal"],
];

/** La noche del evento, fija: el orden de las aristas marca el trazado. */
const ULTIMO_ESCANEO = Date.parse("2026-08-14T02:15:00.000Z");

export const DEMO_EDGES: GraphEdge[] = ENCUENTROS.map(([source, target], i) => ({
  id: `demo-${i}`,
  source,
  target,
  note: null,
  createdAt: new Date(ULTIMO_ESCANEO - i * 420_000).toISOString(),
}));

export const DEMO_FACETS = buildFacets(DEMO_NODES, DEMO_CATALOG);

/** La galaxia de ejemplo, con la misma forma que espera el panel real. */
export const DEMO_EVENT = {
  name: "Noche de IA · Bogotá",
  dateLabel: eventDate("2026-08-14T23:00:00.000Z"),
  galaxySeed: "noche-de-ia".charCodeAt(0),
};
