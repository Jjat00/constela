"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { GoogleButton } from "@/app/login/google-button";
import type { ActiveFilters } from "@/components/constellation-panel";
import { OnboardingFields } from "@/components/onboarding-fields";
import {
  DEMO_CATALOG,
  DEMO_EDGES,
  DEMO_EVENT,
  DEMO_FACETS,
  DEMO_ME_ID,
  DEMO_NODES,
} from "@/lib/demo-universe";
import { CARRIL } from "@/lib/layout";
import { slugifyTag, type TagChoice } from "@/lib/tags";
import { cn } from "@/lib/utils";

/*
 * CONTRATO DE DIRECCIÓN — las dos secciones bajo el hero (v5 «Observatorio»)
 *
 * THESIS: la landing ya no cabe en un viewport porque la promesa no se
 * explica: se toca. Bajo el hero no hay un folleto de features — está la app
 * misma, con sus componentes reales, corriendo sobre un evento de ejemplo.
 * Rechaza la sección de tres cards con icono y el vídeo de producto.
 * OWN-WORLD: el mismo cielo silencioso del shell con sesión (CosmicSky), la
 * bienvenida en su card de cristal a la derecha, y el mapa a sangre dentro
 * de un marco de 1px — el mismo encuadre que `/home` en desktop. Mono de
 * observatorio para las anotaciones, celeste para la palabra que remata.
 * STORY: «me describo en un minuto» → «lo que elegí filtra el evento entero»
 * → entrar con Google.
 * FIRST VIEWPORT (de la sección): titular a la izquierda y la bienvenida real
 * a la derecha; el botón que lleva tus señales al mapa cierra la card.
 * FORM: extensión de una superficie existente — hereda mundo y composición
 * de `/bienvenida` (dos columnas) y de `/home` (mapa enmarcado).
 */

/** El filtro vacío: se define aquí para no cargar el panel antes de tiempo. */
const SIN_FILTRO: ActiveFilters = { rol: [], interes: [], intencion: [] };

function MapaDurmiendo() {
  return (
    <div className="grid h-full w-full place-items-center">
      <p className="font-mono text-[11px] tracking-wider text-faint">
        [ ENCENDIENDO LA CONSTELACIÓN… ]
      </p>
    </div>
  );
}

/**
 * El panel real de `/home`, cargado aparte: arrastra el motor de canvas del
 * grafo, y quien solo mira el hero no debería descargarlo. Entra en escena
 * cuando el mapa se acerca al viewport.
 */
const ConstellationPanel = dynamic(
  () =>
    import("@/components/constellation-panel").then((m) => m.ConstellationPanel),
  { ssr: false, loading: () => <MapaDurmiendo /> },
);

export function LandingDemo({ conSesion }: { conSesion: boolean }) {
  const [rol, setRol] = useState<TagChoice[]>([]);
  const [intereses, setIntereses] = useState<TagChoice[]>([]);
  const [intenciones, setIntenciones] = useState<TagChoice[]>([]);
  const [filtro, setFiltro] = useState<ActiveFilters>(SIN_FILTRO);
  const [armado, setArmado] = useState(false);
  const mapaRef = useRef<HTMLDivElement>(null);

  const elegidas = rol.length + intereses.length + intenciones.length;

  // El grafo no se enciende hasta que el mapa está a punto de verse: en el
  // hero nadie ha pedido todavía una simulación de fuerzas corriendo.
  useEffect(() => {
    const marco = mapaRef.current;
    if (!marco) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setArmado(true);
        observador.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observador.observe(marco);
    return () => observador.disconnect();
  }, []);

  /** Lo que elegiste arriba, hecho filtro abajo: el mismo vocabulario. */
  function llevarSenalesAlMapa() {
    const slugDe = (eleccion: TagChoice) =>
      eleccion.slug ?? slugifyTag(eleccion.label);
    setFiltro({
      rol: rol.map(slugDe),
      interes: intereses.map(slugDe),
      intencion: intenciones.map(slugDe),
    });
    setArmado(true);
    mapaRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  }

  return (
    <>
      {/* 1 — Tu estrella: la bienvenida real, con el catálogo del evento.
          Las tres preguntas van en fila —una columna cada una— porque
          apiladas hacían una torre de chips contra un párrafo corto. */}
      <section
        aria-labelledby="titulo-senales"
        className={cn(
          CARRIL,
          "relative z-10 w-full pt-24 pb-20 lg:pt-36 lg:pb-28",
        )}
      >
        <p className="font-mono text-[11px] tracking-wider text-faint">
          [ PRIMERO ]
        </p>
        <h2
          id="titulo-senales"
          className="mt-5 text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-medium tracking-tight text-balance"
        >
          Entras con Google y dices{" "}
          <span className="text-celeste">quién eres.</span>
        </h2>
        <div className="mt-5 flex max-w-2xl flex-col gap-4 lg:mt-7">
          <p className="text-[15px] leading-relaxed text-muted-foreground lg:text-lg">
            Tu rol, los temas de los que quieres hablar y a qué viniste al
            evento. Una pantalla, menos de un minuto, una sola vez: eso es toda
            tu estrella.
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground lg:text-lg">
            No es un perfil para adornar. Esas tres señales son el idioma con el
            que el resto del evento decide acercarse a ti — y con el que tú
            decides a quién buscar.
          </p>
        </div>

        <div className="mt-9 flex flex-col gap-3 lg:mt-12">
          <div className="glass flex flex-col gap-7 rounded-4xl p-6 sm:p-7 lg:p-8">
            <div className="grid gap-7 lg:grid-cols-3 lg:gap-x-9">
              <OnboardingFields
                roleOptions={DEMO_CATALOG.rol}
                interestOptions={DEMO_CATALOG.interes}
                intentOptions={DEMO_CATALOG.intencion}
                role={rol}
                interests={intereses}
                intents={intenciones}
                onRoleChange={setRol}
                onInterestsChange={setIntereses}
                onIntentsChange={setIntenciones}
                preview={9}
              />
            </div>

            <div className="flex flex-col gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:gap-6">
              <button
                type="button"
                onClick={llevarSenalesAlMapa}
                disabled={elegidas === 0}
                className={
                  elegidas > 0
                    ? "btn-cosmic h-12 w-full cursor-pointer px-6.5 text-[15px] font-medium sm:w-auto"
                    : "h-12 w-full rounded-full border border-white/10 bg-white/[0.03] px-6.5 text-[15px] text-faint sm:w-auto"
                }
              >
                {elegidas > 0
                  ? "Filtrar la constelación con esto ↓"
                  : "Elige tu rol"}
              </button>
              <p className="font-mono text-[11px] leading-5 tracking-wider text-faint">
                {elegidas > 0
                  ? `[ ${elegidas} ${elegidas === 1 ? "SEÑAL ELEGIDA" : "SEÑALES ELEGIDAS"} · ABAJO SE APAGA LO QUE NO COINCIDA ]`
                  : "[ ELIGE AL MENOS TU ROL PARA VER QUÉ HACE ]"}
              </p>
            </div>
          </div>
          <p className="px-1 font-mono text-[10px] leading-5 tracking-wider text-faint">
            [ ES LA PANTALLA DE BIENVENIDA REAL · LOS TAGS SON LOS DEL EVENTO DE
            EJEMPLO ]
          </p>
        </div>
      </section>

      {/* 2 — La constelación: el mapa de /home, sobre datos de ejemplo */}
      <section
        aria-labelledby="titulo-constelacion"
        className={cn(CARRIL, "relative z-10 w-full pb-4")}
      >
        <p className="font-mono text-[11px] tracking-wider text-faint">
          [ DESPUÉS ]
        </p>
        <h2
          id="titulo-constelacion"
          className="mt-5 text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02] font-medium tracking-tight text-balance"
        >
          Y el evento entero{" "}
          <span className="text-celeste">se vuelve legible.</span>
        </h2>
        <div className="mt-5 flex max-w-2xl flex-col gap-4 lg:mt-7">
          <p className="text-[15px] leading-relaxed text-muted-foreground lg:text-lg">
            Cada asistente es una estrella; cada QR que escaneas, una línea
            entre dos. Filtra por rol, interés o intención y lo que no coincide
            se apaga: el mapa nunca se reordena, así que nunca pierdes de vista
            dónde estaba quién.
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground lg:text-lg">
            Ahí se ve lo que un salón lleno esconde: quién está contratando,
            quién habla de lo mismo que tú, y los triángulos rosados de gente
            que ya se conoce entre sí — por donde se pide una presentación.
          </p>
        </div>

        <div className="mt-8 w-full lg:mt-11">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
            <p className="font-mono text-[10px] tracking-wider text-faint">
              [ CONSTELACIÓN DE EJEMPLO · {DEMO_NODES.length} ESTRELLAS ·{" "}
              {DEMO_EDGES.length} CONEXIONES ]
            </p>
            <p className="font-mono text-[10px] tracking-wider text-faint">
              [ TOCA UN CHIP, BUSCA UN NOMBRE, ABRE UNA ESTRELLA ]
            </p>
          </div>

          <div
            ref={mapaRef}
            className="relative h-[76svh] max-h-[46rem] min-h-[30rem] w-full overflow-hidden rounded-4xl border border-white/8 shadow-[0_40px_120px_-40px_rgba(2,3,10,0.95)]"
          >
            {armado ? (
              <ConstellationPanel
                nodes={DEMO_NODES}
                edges={DEMO_EDGES}
                myId={DEMO_ME_ID}
                facets={DEMO_FACETS}
                event={{
                  name: DEMO_EVENT.name,
                  dateLabel: DEMO_EVENT.dateLabel,
                  galaxySeed: DEMO_EVENT.galaxySeed,
                  switchHref: "/eventos",
                  switchLabel: "tus eventos",
                }}
                active={filtro}
                onActiveChange={setFiltro}
                embedded
              />
            ) : (
              <MapaDurmiendo />
            )}
          </div>
        </div>
      </section>

      {/* El cierre: la misma puerta del hero, después de haberla entendido */}
      <div
        className={cn(
          CARRIL,
          "relative z-10 w-full pt-16 pb-14 lg:pt-24 lg:pb-24",
        )}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <p className="max-w-xl text-[clamp(1.5rem,3.2vw,2.25rem)] leading-[1.08] font-medium tracking-tight text-balance">
            Tu próximo evento ya es{" "}
            <span className="text-celeste">una constelación.</span> Solo falta
            que la enciendas.
          </p>
          <div className="w-full shrink-0 lg:w-72">
            {conSesion ? (
              <Link
                href="/home"
                className="btn-cosmic flex h-14 items-center justify-center px-7 text-base font-medium"
              >
                Entrar a tu constelación
              </Link>
            ) : (
              <GoogleButton next="/home" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
