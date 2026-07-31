import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";

/**
 * El universo del video: las MISMAS 24 estrellas y 45 conexiones que la demo
 * de la landing (`src/lib/demo-universe.ts` en la app), para que quien vea el
 * video y luego entre a constela.com.co reconozca el mismo cielo.
 *
 * El trazado se resuelve aquí, a nivel de módulo, con d3-force —las mismas
 * fuerzas que usa el grafo en vivo—. Es CRÍTICO que sea determinista: Remotion
 * renderiza los fotogramas en varias pestañas a la vez y cada una vuelve a
 * cargar este módulo; si el layout saliera distinto, la constelación saltaría
 * a mitad del video. Por eso las posiciones iniciales van sembradas por hash
 * del id (igual que en la app) y `Math.random` queda temporalmente sustituido
 * por un PRNG con semilla, para que ni un jiggle interno de d3 pueda colar
 * azar real.
 */

type Persona = {
  id: string;
  nombre: string;
  rol: string[];
  intereses: string[];
  intenciones: string[];
};

const ROSTER: Persona[] = [
  { id: "tu", nombre: "tú", rol: [], intereses: [], intenciones: [] },
  { id: "ana-mora", nombre: "Ana", rol: ["ui-design"], intereses: ["diseno", "ia"], intenciones: ["conocer-gente"] },
  { id: "luis-cabal", nombre: "Luis", rol: ["backend"], intereses: ["backend", "ia"], intenciones: ["busco-trabajo"] },
  { id: "sara-quintero", nombre: "Sara", rol: ["ai-engineer"], intereses: ["ia", "open-source"], intenciones: ["ofrezco-mentoria"] },
  { id: "david-rincon", nombre: "David", rol: ["frontend"], intereses: ["frontend", "diseno"], intenciones: ["vine-a-aprender"] },
  { id: "mariana-lopez", nombre: "Mariana", rol: ["product-manager"], intereses: ["producto", "ia"], intenciones: ["contratando"] },
  { id: "julian-vega", nombre: "Julián", rol: ["devops"], intereses: ["infraestructura", "open-source"], intenciones: ["conocer-gente"] },
  { id: "carolina-diaz", nombre: "Carolina", rol: ["data-scientist", "ai-engineer"], intereses: ["datos", "ia"], intenciones: ["busco-trabajo"] },
  { id: "tomas-herrera", nombre: "Tomás", rol: ["founder"], intereses: ["startups", "ia"], intenciones: ["busco-inversion"] },
  { id: "valentina-ruiz", nombre: "Valentina", rol: ["ux-research", "product-design"], intereses: ["diseno", "producto"], intenciones: ["vine-a-aprender"] },
  { id: "andres-pineda", nombre: "Andrés", rol: ["ml-engineer", "ai-engineer"], intereses: ["ia", "datos"], intenciones: ["contratando"] },
  { id: "laura-benitez", nombre: "Laura", rol: ["recruiter"], intereses: ["carrera", "ia"], intenciones: ["contratando"] },
  { id: "sebastian-cano", nombre: "Sebastián", rol: ["estudiante", "frontend"], intereses: ["ia", "frontend"], intenciones: ["vine-a-aprender"] },
  { id: "daniela-osorio", nombre: "Daniela", rol: ["product-design", "ui-design"], intereses: ["diseno", "producto"], intenciones: ["conocer-gente"] },
  { id: "felipe-arango", nombre: "Felipe", rol: ["full-stack", "frontend"], intereses: ["frontend", "backend"], intenciones: ["busco-trabajo"] },
  { id: "camila-torres", nombre: "Camila", rol: ["devrel", "comunidad"], intereses: ["comunidad", "open-source"], intenciones: ["conocer-gente"] },
  { id: "mateo-salazar", nombre: "Mateo", rol: ["data-engineer"], intereses: ["datos", "infraestructura"], intenciones: ["vine-a-aprender"] },
  { id: "paula-guzman", nombre: "Paula", rol: ["marketing"], intereses: ["marketing", "startups"], intenciones: ["busco-clientes"] },
  { id: "nicolas-mejia", nombre: "Nicolás", rol: ["seguridad", "devops"], intereses: ["seguridad", "infraestructura"], intenciones: ["conocer-gente"] },
  { id: "isabela-rojas", nombre: "Isabela", rol: ["cto", "ai-engineer"], intereses: ["ia", "startups"], intenciones: ["contratando"] },
  { id: "juan-prieto", nombre: "Juan", rol: ["movil", "frontend"], intereses: ["movil", "frontend"], intenciones: ["busco-trabajo"] },
  { id: "natalia-cardenas", nombre: "Natalia", rol: ["diseno", "ui-design"], intereses: ["diseno", "comunidad"], intenciones: ["ofrezco-mentoria"] },
  { id: "santiago-lara", nombre: "Santiago", rol: ["inversionista"], intereses: ["startups", "inversion"], intenciones: ["conocer-gente"] },
  { id: "gabriela-nino", nombre: "Gabriela", rol: ["ai-engineer", "founder"], intereses: ["ia", "producto"], intenciones: ["busco-cofundador"] },
];

/** Quién se cruzó con quién. Cada trío consecutivo cierra un triángulo. */
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

/** mulberry32 — el mismo PRNG que siembra el cielo de la app. */
export function prng(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashDe(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

/** Clases espectrales de DESIGN.md: el color vive en el halo, el núcleo es blanco. */
const ESPECTROS = [
  { halo: "#9DB4FF", nucleo: "#EEF2FF" }, // B
  { halo: "#CDD8FF", nucleo: "#F8FAFF" }, // A
  { halo: "#F4F2EE", nucleo: "#FFFFFF" }, // F/G
  { halo: "#FFD9A8", nucleo: "#FFF8EC" }, // K
  { halo: "#FFB380", nucleo: "#FFF3E6" }, // M
];

type Nodo = SimulationNodeDatum & { id: string };

const nodos: Nodo[] = ROSTER.map((persona) => {
  if (persona.id === "tu") return { id: persona.id, x: 0, y: 0, fx: 0, fy: 0 };
  // Anillo sembrado por hash: idéntico al de la app, y así ninguna estrella
  // nace encima de otra (que es cuando d3 recurre al azar).
  const h = hashDe(persona.id);
  const angulo = ((h >>> 0) % 360) * (Math.PI / 180);
  const radio = 110 + ((h >>> 8) % 70);
  return {
    id: persona.id,
    x: Math.cos(angulo) * radio,
    y: Math.sin(angulo) * radio,
  };
});

const enlaces: Array<SimulationLinkDatum<Nodo>> = ENCUENTROS.map(([a, b]) => ({
  source: a,
  target: b,
}));

const azarReal = Math.random;
Math.random = prng(11);
forceSimulation(nodos)
  .force(
    "link",
    forceLink<Nodo, SimulationLinkDatum<Nodo>>(enlaces)
      .id((nodo) => nodo.id)
      .distance(104)
      .strength(0.55),
  )
  .force("carga", forceManyBody().strength(-980))
  .force("centro", forceCenter(0, 0))
  .force("choque", forceCollide(52))
  .stop()
  .tick(500);
Math.random = azarReal;

/**
 * Encuadre: se centra la CAJA de la constelación, no el sol. La simulación
 * deja el sol clavado en (0,0) pero la masa deriva, así que normalizar contra
 * el origen dejaba el dibujo pegado a una esquina del cuadro.
 */
const xs = nodos.map((n) => n.x ?? 0);
const ys = nodos.map((n) => n.y ?? 0);
const centro = {
  x: (Math.min(...xs) + Math.max(...xs)) / 2,
  y: (Math.min(...ys) + Math.max(...ys)) / 2,
};
const alcance =
  Math.max(
    (Math.max(...xs) - Math.min(...xs)) / 2,
    (Math.max(...ys) - Math.min(...ys)) / 2,
  ) || 1;

const grados = new Map<string, number>();
for (const [a, b] of ENCUENTROS) {
  grados.set(a, (grados.get(a) ?? 0) + 1);
  grados.set(b, (grados.get(b) ?? 0) + 1);
}

export type Estrella = {
  id: string;
  nombre: string;
  /** Normalizadas a [-1, 1]; la escena las lleva a píxeles. */
  x: number;
  y: number;
  halo: string;
  nucleo: string;
  /** La misma magnitud que el grafo real: 1 + 0.34 × conexiones (tope 7). */
  magnitud: number;
  esSol: boolean;
  rol: string[];
  intereses: string[];
  intenciones: string[];
};

export const ESTRELLAS: Estrella[] = ROSTER.map((persona, i) => {
  const nodo = nodos[i];
  const espectro = ESPECTROS[Math.abs(hashDe(persona.id)) % ESPECTROS.length];
  const grado = grados.get(persona.id) ?? 0;
  const esSol = persona.id === "tu";
  return {
    id: persona.id,
    nombre: persona.nombre,
    x: ((nodo.x ?? 0) - centro.x) / alcance,
    y: ((nodo.y ?? 0) - centro.y) / alcance,
    halo: esSol ? "#FFD97A" : espectro.halo,
    nucleo: esSol ? "#FFF6E3" : espectro.nucleo,
    magnitud: esSol ? 5.4 : 1 + Math.min(grado, 7) * 0.34,
    esSol,
    rol: persona.rol,
    intereses: persona.intereses,
    intenciones: persona.intenciones,
  };
});

const indicePorId = new Map(ESTRELLAS.map((e, i) => [e.id, i]));

export const LINEAS = ENCUENTROS.map(([a, b]) => ({
  a: indicePorId.get(a)!,
  b: indicePorId.get(b)!,
}));

/** Los cierres triádicos: el momento visual de la marca, en H-alfa. */
export const TRIANGULOS: Array<[number, number, number]> = (() => {
  const vecinos = new Map<number, Set<number>>();
  for (const { a, b } of LINEAS) {
    if (!vecinos.has(a)) vecinos.set(a, new Set());
    if (!vecinos.has(b)) vecinos.set(b, new Set());
    vecinos.get(a)!.add(b);
    vecinos.get(b)!.add(a);
  }
  const encontrados: Array<[number, number, number]> = [];
  for (const { a, b } of LINEAS) {
    const menor = Math.min(a, b);
    const mayor = Math.max(a, b);
    for (const c of vecinos.get(menor) ?? []) {
      if (c > mayor && vecinos.get(mayor)?.has(c)) encontrados.push([menor, mayor, c]);
    }
  }
  return encontrados;
})();

/** El índice de «tú»: el sol, siempre encendido. */
export const SOL = indicePorId.get("tu")!;

export type Filtro = { categoria: "rol" | "interes" | "intencion"; slug: string } | null;

/** La misma regla del panel: tu estrella nunca se apaga. */
export function encendida(estrella: Estrella, filtro: Filtro) {
  if (!filtro) return true;
  if (estrella.esSol) return true;
  if (filtro.categoria === "rol") return estrella.rol.includes(filtro.slug);
  if (filtro.categoria === "interes") return estrella.intereses.includes(filtro.slug);
  return estrella.intenciones.includes(filtro.slug);
}

export function cuantasEncendidas(filtro: Filtro) {
  return ESTRELLAS.filter((e) => encendida(e, filtro)).length;
}
