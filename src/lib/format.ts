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

/** «hace 2 h» — para la actividad reciente del universo. */
export function timeAgo(iso: string, now = Date.now()) {
  const seconds = Math.max(0, Math.floor((now - Date.parse(iso)) / 1000));
  if (seconds < 60) return "ahora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} d`;
  const months = Math.floor(days / 30);
  return `hace ${months} mes${months === 1 ? "" : "es"}`;
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
