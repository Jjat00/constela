/**
 * El grafo del evento, como dato reutilizable.
 *
 * Es el mismo universo determinista que dibuja el hero de la portada
 * (`src/app/page.tsx`): ángulo áureo para repartir las estrellas, vecino más
 * cercano para las aristas y cierre triádico explícito. Vive extraído porque
 * la forma de la red es la marca: nació para que diez propuestas de rediseño
 * compartieran los MISMOS datos y solo cambiaran de lenguaje visual, y sigue
 * aquí por la misma razón — ninguna pantalla puede inventarse una red más
 * bonita que la que sale de los datos.
 *
 * Determinista a propósito: idéntico en servidor y cliente (cero hydration
 * mismatch) e idéntico en cada visita.
 */

/** mulberry32 — la misma familia de PRNG que el resto del cosmos. */
function prng(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type EstrellaDecor = {
  x: number;
  y: number;
  /** Índice de clase espectral (0…4). La opción decide con qué tinta pintarlo. */
  clase: number;
  sol: boolean;
  /** Magnitud: crece con el número de conexiones. */
  mag: number;
};

export type AristaDecor = { a: number; b: number };

export type RedDecor = {
  estrellas: EstrellaDecor[];
  aristas: AristaDecor[];
  /** Cierres triádicos como polígonos listos para `points` de un `<polygon>`. */
  triadas: string[];
};

/**
 * Construye la red en un lienzo de 1000×1000.
 *
 * @param seed  semilla del PRNG — cambiarla da otra red igual de creíble
 * @param n     número de estrellas (la primera es el sol: tú)
 * @param radio radio máximo en unidades del lienzo
 */
export function construirRed(seed = 11, n = 36, radio = 410): RedDecor {
  const rand = prng(seed);
  const estrellas: EstrellaDecor[] = [];

  for (let i = 0; i < n; i++) {
    const a = i * 2.39996 + (rand() - 0.5) * 0.5;
    const r =
      i === 0 ? 0 : (0.16 + 0.84 * Math.sqrt(i / n)) * (0.86 + rand() * 0.28);
    const clase = i === 0 ? -1 : Math.floor(rand() * 5);
    estrellas.push({
      x: 500 + Math.cos(a) * r * radio,
      y: 500 + Math.sin(a) * r * (radio - 10),
      clase: clase < 0 ? 0 : clase,
      sol: i === 0,
      mag: 0,
    });
    // Mismo consumo de rand() que el universo original: los descartes
    // mantienen la secuencia y con ella las posiciones exactas.
    if (i > 0) rand();
    rand();
    rand();
    rand();
    rand();
  }

  const adj = estrellas.map(() => new Set<number>());
  const aristas: AristaDecor[] = [];
  const unir = (a: number, b: number) => {
    if (a === b || adj[a].has(b)) return;
    adj[a].add(b);
    adj[b].add(a);
    aristas.push({ a, b });
  };

  for (let i = 1; i < n; i++) {
    const cerca = estrellas
      .slice(0, i)
      .map((s, j) => ({
        id: j,
        d: (s.x - estrellas[i].x) ** 2 + (s.y - estrellas[i].y) ** 2,
      }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 5);
    const primero = cerca[Math.floor(rand() * Math.min(2, cerca.length))].id;
    unir(i, primero);
    const vecinos = [...adj[primero]].filter((x) => x !== i);
    if (vecinos.length && rand() < 0.72) {
      unir(i, vecinos[Math.floor(rand() * vecinos.length)]);
    }
    if (rand() < 0.3 && cerca[2]) unir(i, cerca[2].id);
    if (i < 7) unir(i, 0);
  }

  for (let i = 0; i < n; i++) {
    estrellas[i].mag = estrellas[i].sol ? 5.4 : 1 + Math.min(adj[i].size, 7) * 0.34;
  }

  // Cierres triádicos que tocan al sol: el momento visual de la marca.
  const triadas: string[] = [];
  for (const e of aristas) {
    const comunes = [...adj[e.a]].filter((x) => x > e.b && adj[e.b].has(x));
    for (const c of comunes) {
      if (e.a !== 0 && e.b !== 0 && c !== 0) continue;
      triadas.push(
        [estrellas[e.a], estrellas[e.b], estrellas[c]]
          .map((s) => `${s.x.toFixed(1)},${s.y.toFixed(1)}`)
          .join(" "),
      );
    }
  }

  return { estrellas, aristas, triadas };
}
