/*
 * La hoja de estilo de v6 «Observatorio».
 *
 * DE DÓNDE SALE: vivía como una constante dentro de la portada, donde
 * bastaba mientras la portada era la única página que hablaba este idioma. Al
 * añadir las páginas de contenido (`/app-de-networking-para-eventos`,
 * `/networking-en-eventos`) había dos salidas: duplicar el bloque —y que las
 * hairlines de una página empezaran a divergir de las de la otra al primer
 * retoque— o extraerlo. Se extrajo.
 *
 * POR QUÉ NO ESTÁ EN `globals.css`: esto no son tokens, son las clases de una
 * plantilla concreta (`.obs-hero`, `.obs-glosario`). Los tokens —papel,
 * filete, radio, tipografía— sí están en `globals.css` y son de quien los
 * quiera; esto es la composición que se monta con ellos, y solo la usan las
 * páginas de documento. Servirlo inline por página es además lo que evita que
 * pese en el CSS de la app con sesión, que no lo necesita.
 */

/** El bloque original de la portada, íntegro. */
const OBS_BASE = `
.obs{overflow-x:clip;min-height:100svh}
.obs a:focus-visible,.obs button:focus-visible{outline:2px solid var(--celeste);outline-offset:3px;border-radius:2px}

.obs-carril{width:100%;max-width:88rem;margin:0 auto;padding-inline:clamp(1.25rem,4vw,4.5rem)}
.obs-regla{height:1px;background:var(--border);width:100%}
.obs-mono{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}

/* — chrome — */
.obs-top{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:4.5rem}
.obs-entrar{font-size:.8125rem;font-weight:500;color:var(--muted-foreground);text-decoration:none;padding:.55rem .1rem;transition:color .18s ease}
.obs-entrar:hover{color:var(--foreground)}
/* El lado derecho de la cabecera: el idioma y la puerta, en ese orden. El
   idioma va en mono y en el gris más apagado —es una utilidad, no una
   acción— y aun así se toca cómodo: el padding le da los 44px de alto que
   pide un pulgar aunque el texto mida diez píxeles y medio. */
.obs-top-fin{display:flex;align-items:center;gap:clamp(1rem,2.5vw,1.75rem)}
.obs-idioma{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);text-decoration:none;padding:.9rem .2rem;transition:color .18s ease}
.obs-idioma:hover{color:var(--foreground)}

/* — hero — */
/* En móvil el hero es una banda más y se lee de arriba abajo. A partir de
   900px se le da la altura del viewport MENOS la cabecera y su contenido se
   centra con align-content: es lo que pidió el usuario —«en el laptop, el
   hero centrado verticalmente»— y lo que evita que el titular caiga bajo el
   pliegue en portátiles de 1440×780. Si el contenido creciera más que el
   viewport, min-height cede y la página scrollea; nada se recorta. */
.obs-hero{display:grid;grid-template-columns:1fr;gap:clamp(2.5rem,5vw,3rem);padding-block:clamp(3.5rem,9vw,7rem) clamp(3rem,7vw,6rem);align-items:center}
.obs-h1{font-size:clamp(2.9rem,9.2vw,6.4rem);line-height:.95;font-weight:600;letter-spacing:-.05em;margin:0;overflow-wrap:anywhere;min-width:0}
.obs-h1 em{font-style:normal;color:var(--muted-foreground)}
.obs-lede{margin:clamp(1.5rem,3vw,2rem) 0 0;max-width:34rem;font-size:clamp(1rem,1.5vw,1.1875rem);line-height:1.55;color:var(--muted-foreground)}
.obs-lede b{color:var(--foreground);font-weight:500}
.obs-acciones{display:flex;flex-wrap:wrap;align-items:center;gap:1.25rem;margin-top:clamp(2rem,4vw,2.75rem)}
/* La puerta de verdad: el botón de Google es un componente de cliente que se
   comparte con /login, así que se le da el ancho desde fuera en vez de
   re-vestirlo aquí. Su alto (3.5rem) es el que replica .obs-cta. */
.obs-puerta{width:100%;max-width:21rem}
.obs-cta{display:inline-flex;align-items:center;height:3.5rem;padding-inline:1.75rem;background:var(--foreground);color:var(--background);font-size:.9375rem;font-weight:500;letter-spacing:-.01em;text-decoration:none;border-radius:var(--radius);transition:background-color .18s ease,transform .18s ease}
.obs-cta:hover{background:#fff;transform:translateY(-1px)}
.obs-cta:active{transform:translateY(0)}
.obs-red{position:relative;aspect-ratio:1;min-width:0;margin-inline:calc(clamp(1.25rem,4vw,4.5rem)*-1)}
.obs-red svg{position:absolute;inset:0;width:100%;height:100%;
  -webkit-mask-image:radial-gradient(62% 62% at 50% 50%,#000 35%,transparent 100%);
  mask-image:radial-gradient(62% 62% at 50% 50%,#000 35%,transparent 100%)}
@media (min-width:900px){
  .obs-hero{grid-template-columns:7fr 5fr;gap:clamp(2rem,4vw,4rem);
    min-height:calc(100svh - 4.5rem - 1px);align-content:center;
    padding-block:clamp(2rem,4vw,4rem)}
  .obs-red{margin-inline:0;margin-right:calc(clamp(1.25rem,4vw,4.5rem)*-1)}
}

/* — bandas — */
.obs-banda{padding-block:clamp(3rem,6vw,5.5rem)}
.obs-titulo{font-size:clamp(1.5rem,3vw,2.25rem);line-height:1.12;font-weight:600;letter-spacing:-.04em;margin:.9rem 0 0;max-width:26ch;overflow-wrap:anywhere}
.obs-rejilla3{display:grid;grid-template-columns:1fr;gap:0;margin-top:clamp(2rem,4vw,3rem)}
.obs-celda{padding:1.75rem 0;border-top:1px solid var(--border)}
.obs-celda h3{margin:.75rem 0 .5rem;font-size:1.0625rem;font-weight:600;letter-spacing:-.03em}
.obs-celda p{margin:0;font-size:.9375rem;line-height:1.62;color:var(--muted-foreground);max-width:38ch}
@media (min-width:820px){
  .obs-rejilla3{grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
  .obs-celda{padding:2rem 2.25rem 0 0;border-top:1px solid var(--border)}
  .obs-celda+.obs-celda{padding-left:2.25rem;border-left:1px solid var(--border)}
}

.obs-parrafo{margin:1.25rem 0 0;max-width:56ch;font-size:.9375rem;line-height:1.62;color:var(--muted-foreground)}
.obs-parrafo+.obs-parrafo{margin-top:.9rem}

/* Banda a sangre: el titular y los párrafos sueltan su medida y ocupan el
   carril entero. Es una excepción pedida a mano por el usuario para la banda
   del mapa, donde la medida corta dejaba media página vacía y el bloque se
   leía como una columna huérfana. Es a propósito, no un descuido: la línea
   pasa de 56 a ~140 caracteres, así que NO se aplique a bandas nuevas sin
   volver a decidirlo. */
.obs-banda-ancha .obs-titulo,.obs-banda-ancha .obs-parrafo{max-width:none}

/* — la figura: una lámina entre reglas — */
/* Aquí no hay cajas: el marco de una figura es la misma hairline que separa
   las celdas del resto de la página, y sus datos van en una fila mono, no en
   una cabecera con fondo. El video ya viene renderizado en esta tinta
   (composición Constela-obs-* en video/), así que el fotograma no necesita
   passe-partout: lo que enseña es del mismo cielo que la página. */
.obs-figura{margin:clamp(2rem,4vw,3rem) 0 0}
.obs-figura-cab{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem 1.5rem;padding-block:.9rem;border-top:1px solid var(--border)}
.obs-cab-fin{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1.25rem}
.obs-ctrl{display:inline-flex;align-items:center;height:1.9rem;padding-inline:.75rem;border:1px solid var(--border);border-radius:var(--radius);background:transparent;cursor:pointer;
  font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted-foreground);
  transition:border-color .18s ease,color .18s ease}
.obs-ctrl:hover{border-color:var(--foreground);color:var(--foreground)}
.obs-fotograma{position:relative;aspect-ratio:9/16;border:1px solid var(--border);background:var(--background) url("/video/poster-obs-9x16.webp") center/cover no-repeat}
.obs-fotograma video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.obs-toque{position:absolute;inset:0;background:transparent;border:0;cursor:pointer}
@media (min-width:900px){.obs-fotograma{aspect-ratio:16/9;background-image:url("/video/poster-obs-16x9.webp")}}

/* — el mapa jugable — */
/* Solo el marco. Todo el chrome del panel —cristal, chips, esquinas, tinta—
   ya se resuelve en esta escuela desde globals.css, y eso es lo que permite
   que la sección prometa que ninguna pantalla está maquetada. */
.obs-app{position:relative;height:76svh;max-height:44rem;min-height:28rem;border:1px solid var(--border);overflow:hidden;background:var(--background)}
.obs-app-espera{display:grid;height:100%;place-items:center}

/* — la ficha del formulario: la misma lámina entre filetes que las figuras —
   El botón apagado no es un botón gris: es el mismo rectángulo con filete y
   tinta tenue, para que el salto a tinta plena al elegir el primer rol se lea
   como que algo se encendió. */
.obs-ficha{margin:clamp(2rem,4vw,3rem) 0 0;border:1px solid var(--border);padding:clamp(1.25rem,3vw,2rem)}
.obs-campos{display:grid;gap:1.75rem}
@media (min-width:900px){.obs-campos{grid-template-columns:repeat(3,minmax(0,1fr));gap:2.25rem}}
.obs-ficha-pie{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.5rem;margin-top:1.75rem;padding-top:1.5rem;border-top:1px solid var(--border)}
.obs-cta-apagado{display:inline-flex;align-items:center;height:3.5rem;padding-inline:1.75rem;border:1px solid var(--border);background:transparent;color:var(--faint);font-size:.9375rem;font-weight:500;border-radius:var(--radius);cursor:not-allowed}
.obs-nota{margin:.9rem 0 0}
/* — el aviso —
   Una anotación al margen, no una alerta: mono en caja baja (el .obs-mono de
   versalitas es ilegible pasadas seis palabras) contra la misma hairline de
   1px que separa todas las bandas. Sin fondo, sin icono y sin ámbar: en esta
   escuela nada se pinta de un color para pedir atención. */
.obs-aviso{margin:clamp(2.5rem,6vw,4rem) 0 0;max-width:56ch;padding-left:1.1rem;border-left:1px solid var(--border);font-family:var(--font-mono);font-size:11.5px;line-height:1.8;color:var(--faint)}

/* — glosario — */
.obs-glosario{margin:clamp(2rem,4vw,3rem) 0 0;display:grid;grid-template-columns:1fr;gap:0}
.obs-def{display:grid;grid-template-columns:1fr;gap:.35rem;padding:1.5rem 0;border-top:1px solid var(--border)}
.obs-def dt{font-size:1.125rem;font-weight:600;letter-spacing:-.035em}
.obs-def dd{margin:0;font-size:.9375rem;line-height:1.6;color:var(--muted-foreground);max-width:52ch}
.obs-def .obs-mono{color:var(--celeste)}
@media (min-width:820px){
  .obs-def{grid-template-columns:14rem 12rem minmax(0,1fr);align-items:baseline;gap:2rem}
}

/* — negativo — */
.obs-no{display:flex;flex-wrap:wrap;gap:.5rem 2rem;margin-top:1.5rem;padding:0;list-style:none}
.obs-no li{font-size:.9375rem;color:var(--muted-foreground);display:flex;align-items:center;gap:.6rem}
.obs-no li::before{content:"";width:14px;height:1px;background:var(--celeste);flex:none}

/* — preguntas — */
.obs-preg{margin-top:clamp(2rem,4vw,3rem);display:grid;gap:0}
.obs-preg>div{padding:1.5rem 0;border-top:1px solid var(--border);display:grid;gap:.5rem}
.obs-preg h3{margin:0;font-size:1rem;font-weight:600;letter-spacing:-.03em}
.obs-preg p{margin:0;font-size:.9375rem;line-height:1.6;color:var(--muted-foreground);max-width:60ch}
@media (min-width:820px){.obs-preg>div{grid-template-columns:26rem minmax(0,1fr);gap:2rem;align-items:baseline}}

/* — cierre — */
.obs-cierre{padding-block:clamp(4rem,9vw,8rem);text-align:left}
.obs-cierre h2{font-size:clamp(2rem,6vw,4rem);line-height:1;font-weight:600;letter-spacing:-.05em;margin:0;overflow-wrap:anywhere}
.obs-pie{padding-block:2.5rem 6rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;border-top:1px solid var(--border)}
.obs-pie nav{display:flex;gap:1.5rem}
.obs-pie a{font-size:.8125rem;color:var(--faint);text-decoration:none;transition:color .18s ease}
.obs-pie a:hover{color:var(--foreground)}
`;

/**
 * Lo que las páginas de documento añaden y la portada no necesita: prosa
 * larga, una tabla que se lee como una tabla de observatorio y las migas.
 *
 * La medida es deliberadamente corta (68ch) porque estas páginas sí se leen
 * de corrido, al contrario que la portada. El titular de sección va precedido
 * de su hairline: es la misma regla que separa las bandas, aquí haciendo de
 * índice visual mientras se baja.
 */
const OBS_DOC = `
/* — migas — */
.obs-migas{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;padding-block:1.25rem;list-style:none;margin:0}
.obs-migas li{display:flex;align-items:center;gap:.5rem}
.obs-migas li+li::before{content:"/";color:var(--faint);font-family:var(--font-mono);font-size:10.5px}
.obs-migas a{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);text-decoration:none;transition:color .18s ease}
.obs-migas a:hover{color:var(--foreground)}
.obs-migas span{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted-foreground)}

/* — el titular de una página de documento —
   No es el de la portada. Aquel es un lema de tres palabras y puede crecer a
   6,4rem; estos son frases enteras que a ese tamaño ocuparían la pantalla
   completa antes del primer punto. Mismo peso, mismo tracking cerrado, la
   mitad de cuerpo. */
.obs-h1-doc{font-size:clamp(2rem,4.4vw,3.4rem);line-height:1.06;font-weight:600;letter-spacing:-.045em;margin:.9rem 0 0;max-width:20ch;overflow-wrap:anywhere}

/* — la respuesta directa —
   El primer párrafo de cada página responde la pregunta del título en dos
   frases y sin rodeos. Va en tinta plena y a cuerpo mayor porque es lo que se
   lee de pie en un pasillo, y —de paso— lo que un motor de respuestas extrae
   cuando alguien le pregunta qué es esto. */
.obs-clave{margin:clamp(1.5rem,3vw,2rem) 0 0;max-width:44rem;font-size:clamp(1.0625rem,1.6vw,1.25rem);line-height:1.5;color:var(--foreground);font-weight:400}

/* — prosa — */
.obs-prosa{margin-top:clamp(1.5rem,3vw,2rem);max-width:68ch}
.obs-prosa h3{margin:2.25rem 0 0;font-size:1.125rem;font-weight:600;letter-spacing:-.035em;color:var(--foreground)}
.obs-prosa h3:first-child{margin-top:0}
.obs-prosa p{margin:.9rem 0 0;font-size:.9375rem;line-height:1.68;color:var(--muted-foreground)}
.obs-prosa strong{color:var(--foreground);font-weight:500}
.obs-prosa a{color:var(--celeste);text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgb(110 155 255 / 45%);transition:text-decoration-color .18s ease}
.obs-prosa a:hover{text-decoration-color:var(--celeste)}
.obs-prosa ul{margin:1rem 0 0;padding:0;list-style:none;display:grid;gap:.65rem}
.obs-prosa li{position:relative;padding-left:1.4rem;font-size:.9375rem;line-height:1.62;color:var(--muted-foreground)}
.obs-prosa li::before{content:"";position:absolute;left:0;top:.72em;width:14px;height:1px;background:var(--celeste)}

/* — tabla — */
/* Sin bordes verticales ni zebra: una tabla de esta escuela es una pila de
   filas separadas por la misma hairline de 1px que todo lo demás. En móvil no
   se reflow-ea a cards: se desplaza en horizontal dentro de su propio marco,
   que es lo único que conserva la comparación legible. */
.obs-tabla-marco{margin:clamp(2rem,4vw,3rem) 0 0;overflow-x:auto}
.obs-tabla{width:100%;min-width:34rem;border-collapse:collapse;text-align:left}
.obs-tabla th,.obs-tabla td{padding:1.15rem 1.25rem 1.15rem 0;border-top:1px solid var(--border);vertical-align:top;font-size:.9375rem;line-height:1.55}
.obs-tabla thead th{padding-top:.9rem;padding-bottom:.9rem;border-top:0;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);font-weight:400}
.obs-tabla th[scope="row"]{font-weight:500;color:var(--foreground);letter-spacing:-.02em;width:14rem}
.obs-tabla td{color:var(--muted-foreground)}
.obs-tabla tbody tr:last-child td,.obs-tabla tbody tr:last-child th{border-bottom:1px solid var(--border)}
.obs-tabla .obs-si{color:var(--celeste)}

/* — enlaces al final de una página de documento — */
.obs-siguiente{display:grid;gap:0;margin-top:clamp(2rem,4vw,3rem)}
.obs-siguiente a{display:grid;gap:.4rem;padding:1.5rem 0;border-top:1px solid var(--border);text-decoration:none;transition:opacity .18s ease}
.obs-siguiente a:hover{opacity:.75}
.obs-siguiente strong{font-size:1.0625rem;font-weight:600;letter-spacing:-.03em;color:var(--foreground)}
.obs-siguiente span{font-size:.9375rem;line-height:1.55;color:var(--muted-foreground);max-width:56ch}
`;

/**
 * La hoja, servida inline en el `<head>` de la página que la monta.
 *
 * @param doc añade las clases de página de documento (prosa, tabla, migas).
 *   La portada no las necesita y no las carga.
 */
export function ObsCSS({ doc = false }: { doc?: boolean }) {
  return (
    <style
      dangerouslySetInnerHTML={{ __html: doc ? OBS_BASE + OBS_DOC : OBS_BASE }}
    />
  );
}
