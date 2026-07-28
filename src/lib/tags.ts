import type { SupabaseClient } from "@supabase/supabase-js";

export const TAG_CATEGORIES = ["rol", "interes", "intencion"] as const;
export type TagCategory = (typeof TAG_CATEGORIES)[number];

export type CatalogTag = {
  category: TagCategory;
  slug: string;
  label: string;
  /** Otras formas de decir lo mismo: "sre" → devops. Solo para buscar. */
  aliases: string[];
  isCurated: boolean;
  uses: number;
};

/** Un tag elegido: `slug` cuando ya vive en el catálogo, `null` si es nuevo. */
export type TagChoice = { slug: string | null; label: string };

export type TagCatalog = Record<TagCategory, CatalogTag[]>;

export const EMPTY_CATALOG: TagCatalog = { rol: [], interes: [], intencion: [] };

export const CATEGORY_COPY: Record<
  TagCategory,
  { title: string; question: string; hint: string }
> = {
  rol: {
    title: "tu rol",
    question: "¿Qué haces?",
    hint: "elige uno · si el tuyo no está, escríbelo",
  },
  interes: {
    title: "tus intereses",
    question: "¿De qué quieres hablar?",
    hint: "los que quieras · esto filtra la constelación",
  },
  intencion: {
    title: "qué buscas",
    question: "¿A qué viniste?",
    hint: "opcional · ayuda a que te encuentren",
  },
};

/**
 * Espejo en cliente de `public.tag_slugify`: sirve para detectar que lo que
 * estás escribiendo ya existe en el catálogo. La autoridad sigue siendo
 * Postgres — aquí solo evitamos ofrecer "crear" algo que ya está.
 */
export function slugifyTag(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normaliza para buscar: sin acentos, sin mayúsculas, sin separadores. */
export function foldForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function labelFor(
  catalog: TagCatalog,
  category: TagCategory,
  slug: string,
): string {
  return catalog[category].find((t) => t.slug === slug)?.label ?? slug;
}

export function serializeChoices(choices: TagChoice[]): string {
  return JSON.stringify(choices);
}

/** Lee lo que mandó el formulario sin confiar en su forma. */
export function parseChoices(raw: FormDataEntryValue | null): TagChoice[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item): TagChoice[] => {
      if (typeof item !== "object" || item === null) return [];
      const { slug, label } = item as Record<string, unknown>;
      if (typeof label !== "string" || !label.trim()) return [];
      return [
        {
          slug: typeof slug === "string" && slug ? slug : null,
          label: label.trim().slice(0, 40),
        },
      ];
    });
  } catch {
    return [];
  }
}

/**
 * Convierte lo elegido en slugs canónicos: los del catálogo se validan contra
 * la tabla (nunca se confía en el slug que llega del cliente) y los nuevos
 * entran al catálogo vía `ensure_tags`, quedando disponibles para los demás.
 */
export async function resolveTagChoices(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  category: TagCategory,
  choices: TagChoice[],
): Promise<string[]> {
  if (choices.length === 0) return [];

  const known = choices.filter((c) => c.slug !== null).map((c) => c.slug!);
  const created = choices.filter((c) => c.slug === null).map((c) => c.label);

  const [existing, fresh] = await Promise.all([
    known.length > 0
      ? supabase
          .from("tags")
          .select("slug")
          .eq("category", category)
          .in("slug", known)
          .then(({ data }) => (data ?? []).map((t: { slug: string }) => t.slug))
      : Promise.resolve<string[]>([]),
    created.length > 0
      ? supabase
          .rpc("ensure_tags", { p_category: category, p_labels: created })
          .then(({ data }) => (data as string[] | null) ?? [])
      : Promise.resolve<string[]>([]),
  ]);

  // Orden de elección preservado; sin duplicados
  const valid = new Set([...existing, ...fresh]);
  const ordered: string[] = [];
  for (const choice of choices) {
    const slug = choice.slug ?? slugifyTag(choice.label);
    if (valid.has(slug) && !ordered.includes(slug)) ordered.push(slug);
  }
  return ordered;
}

/** Un tag tal como aparece EN ESTE evento, con cuánta gente lo lleva. */
export type TagFacet = {
  category: TagCategory;
  slug: string;
  label: string;
  count: number;
};

/**
 * Las facetas del filtro salen de la gente que está en el evento, no del
 * catálogo entero: no tiene sentido ofrecer "healthtech" si nadie aquí lo
 * eligió. El catálogo solo aporta el nombre bonito de cada slug.
 */
export function buildFacets(
  people: Array<{
    role?: string | null;
    tags?: string[] | null;
    intents?: string[] | null;
  }>,
  catalog: TagCatalog,
): Record<TagCategory, TagFacet[]> {
  const counters: Record<TagCategory, Map<string, number>> = {
    rol: new Map(),
    interes: new Map(),
    intencion: new Map(),
  };

  const bump = (category: TagCategory, slug: string) =>
    counters[category].set(slug, (counters[category].get(slug) ?? 0) + 1);

  for (const person of people) {
    if (person.role) bump("rol", person.role);
    for (const tag of person.tags ?? []) bump("interes", tag);
    for (const intent of person.intents ?? []) bump("intencion", intent);
  }

  const facets = {} as Record<TagCategory, TagFacet[]>;
  for (const category of TAG_CATEGORIES) {
    facets[category] = [...counters[category].entries()]
      .map(([slug, count]) => ({
        category,
        slug,
        label: labelFor(catalog, category, slug),
        count,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }
  return facets;
}

/** El catálogo completo agrupado por categoría, ordenado por popularidad. */
export async function fetchTagCatalog(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
): Promise<TagCatalog> {
  const { data } = await supabase.rpc("list_tags");
  const catalog: TagCatalog = { rol: [], interes: [], intencion: [] };
  for (const row of (data ?? []) as Array<{
    category: TagCategory;
    slug: string;
    label: string;
    aliases: string[] | null;
    is_curated: boolean;
    uses: number;
  }>) {
    if (!catalog[row.category]) continue;
    catalog[row.category].push({
      category: row.category,
      slug: row.slug,
      label: row.label,
      aliases: row.aliases ?? [],
      isCurated: row.is_curated,
      uses: Number(row.uses ?? 0),
    });
  }
  return catalog;
}
