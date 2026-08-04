"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * La proyección respira sola: refresca los datos del servidor cada 30 s
 * mientras la pestaña está visible. (Realtime de verdad vendrá después;
 * para una pantalla proyectada, esto ya es «en vivo».)
 */
export function LiveRefresh() {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) router.refresh();
    }, 30_000);
    return () => clearInterval(id);
  }, [router]);
  return null;
}
