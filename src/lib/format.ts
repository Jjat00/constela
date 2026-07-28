const TIME_ZONE = "America/Bogota";

/** «12 de agosto» — para listas y tarjetas. */
export function eventDate(startsAt: string | null) {
  if (!startsAt) return null;
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    timeZone: TIME_ZONE,
  }).format(new Date(startsAt));
}

/** «miércoles, 12 de agosto de 2026, 9:00 a. m.» — para la ficha del evento. */
export function eventDateLong(startsAt: string | null) {
  if (!startsAt) return null;
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: TIME_ZONE,
  }).format(new Date(startsAt));
}
