import Image from "next/image";
import logo from "@/assets/logo-constela.png";
import { cn } from "@/lib/utils";

/*
 * El logo de marca: la constelación y la palabra, en un solo lockup.
 *
 * Sustituye al wordmark tipográfico `constela✦`. Se usa el lockup completo y
 * no el isotipo suelto porque a tamaño de chrome (~28 px) los filamentos del
 * isotipo se deshacen y solo quedan cuatro puntos sin lectura; la palabra es
 * lo que sostiene el reconocimiento. El isotipo vive donde sí manda el cuadro:
 * el icono de pestaña (`src/app/icon.png`).
 *
 * El PNG viene recortado a su caja útil — el original traía el dibujo en el
 * 10% del lienzo y ~90% de vacío, que a esta escala se comía la altura.
 */
export function Logo({
  className,
  priority = false,
}: {
  /** Controla el tamaño con `h-*`; el ancho se deduce solo. */
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt="Constela"
      priority={priority}
      // Nunca pasa de ~110 px de ancho en pantalla: sin esto Next serviría la
      // fuente entera de 605 px al doble de peso por nada.
      sizes="110px"
      className={cn("w-auto select-none", className)}
    />
  );
}
