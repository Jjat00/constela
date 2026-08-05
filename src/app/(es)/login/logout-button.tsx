"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Salir, en dos presentaciones.
 *
 * `pildora` es la de la portada, donde convive con «entrar a tu constelación»
 * y tiene sitio para su etiqueta. `icono` es la de la app con sesión: vive
 * pegada a tu identidad —en la sidebar en desktop, en la cabecera en móvil— y
 * ahí una etiqueta de texto competiría con el nombre que tiene al lado.
 *
 * POR QUÉ EXISTE LA SEGUNDA: hasta hoy cerrar sesión solo se podía desde
 * `/ajustes`, es decir, a tres pasos del mapa. Es la única acción de cuenta
 * que alguien necesita ejecutar **rápido** —el teléfono se presta, se comparte
 * el evento, se acaba la jornada— y era la que estaba más lejos.
 *
 * `window.location.href` y no `router.push`: cerrar sesión tiene que tirar
 * también la caché del router, que guarda pantallas renderizadas con la sesión
 * anterior. Una navegación blanda dejaría tu nombre en la sidebar de la
 * siguiente pantalla.
 */
export function LogoutButton({
  variante = "pildora",
  className,
}: {
  variante?: "pildora" | "icono";
  className?: string;
}) {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (variante === "icono") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        // El texto va en `aria-label` y en `title`: el nombre que tiene al
        // lado ya ocupa la línea, y un botón de icono sin nombre accesible es
        // un botón que un lector de pantalla anuncia como «botón».
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className={cn(
          "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground",
          className,
        )}
      >
        <LogOut className="size-4" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        "glass flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:border-faint/50",
        className,
      )}
    >
      <LogOut className="size-4" aria-hidden />
      <span className="text-xs">salir</span>
    </button>
  );
}
