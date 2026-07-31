/**
 * El carril de la landing: header, hero y secciones respiran EXACTAMENTE lo
 * mismo por los lados, así que el margen izquierdo es una sola línea vertical
 * de arriba abajo de la página. Va aquí y no repetido en cada bloque porque
 * en cuanto son dos valores parecidos (`px-14` en el header, `px-22` en el
 * hero) el ojo lo lee como error, no como ritmo.
 *
 * A sangre completa a propósito, sin `max-w`: el cosmos ocupa el viewport
 * entero (DESIGN §4) y el hero pineado nunca tuvo carril centrado — meterle
 * uno movería el titular que el usuario ya validó.
 */
export const CARRIL = "px-7 lg:px-22";
