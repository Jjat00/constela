# Constela

Red de networking para eventos presenciales: cada asistente es una estrella, cada encuentro una conexión, y la red del evento se dibuja en vivo como una constelación.

## Language

> **El glosario se publica, y en dos idiomas.** Desde 2026-08-04 los cuatro términos centrales viven además en el sitio público —en español y en inglés— y se declaran a Google como `DefinedTermSet` en JSON-LD. La traducción canónica es: estrella → **star**, constelación → **constellation**, galaxia → **galaxy**, cierre triádico → **triadic closure**. El copy inglés vive en `src/lib/copy/en.ts` y no se inventa términos nuevos: si un concepto de aquí cambia de nombre, cambia en los dos.
>
> Lo que **no** se traduce: la interfaz de la aplicación con sesión (sigue solo en español) ni los valores del catálogo vivo, que son datos reales de la migración 0007.


**Estrella**:
El perfil de una persona dentro de Constela: nombre y foto (de Google) más titular y tags opcionales.
_Avoid_: Usuario, cuenta, perfil (en UI)

**Evento**:
Un encuentro presencial con nombre, fecha y slug propio. Cualquier persona logueada puede crear uno; no existen roles de organizador ni moderación en el MVP.
_Avoid_: Sala, espacio, comunidad

**Asistente**:
Una estrella que está dentro de un evento. Se es asistente por escanear el QR clavado de alguien que ya está dentro (membresía contagiosa) o por crear el evento — nunca por invitación, aprobación ni por abrir un link. (ADR 0005)
_Avoid_: Miembro, participante registrado

**Membresía contagiosa**:
Escanear el QR clavado de alguien que ya está en un evento te une a ESA galaxia (la escrita en su QR) y la deja como tu galaxia activa, y así sucesivamente de persona en persona. El creador es la única estrella que puede estar sola.
_Avoid_: Invitación implícita, auto-registro

**Conexión**:
La arista entre dos asistentes, creada automáticamente cuando uno abre el QR clavado del otro — sin botón ni confirmación. Puede llevar una nota opcional (editable después). Es simétrica y única por par y por evento.
_Avoid_: Amistad, follow, match, solicitud

**QR clavado** (o QR personal):
El único QR que existe (ADR 0005): tu estrella clavada a una galaxia — `/u/{slug}?e={evento}`. Que te lo escaneen une al escaneador a ESA galaxia y crea la conexión entre ustedes, todo en el mismo gesto. No existe un QR que no lleve a ningún evento: `/u/{slug}` pelado es solo ficha pública y no une ni conecta.
_Avoid_: QR de evento (murió con el ADR 0005), QR a secas en código/docs

**Ficha de la galaxia**:
`/e/{slug}`, solo para asistentes (extraños → 404): creador con avatar, fecha y ciudad, stats y acceso a la proyección en vivo. Ya no es una puerta — a una galaxia se entra por una persona.
_Avoid_: Página del evento, puerta, link de registro

**Constelación**:
El grafo completo de un evento: todas las estrellas asistentes (con o sin conexiones) y todas las conexiones entre ellas, sin límite de profundidad, visible para cualquier asistente. Estando tú solo, ya es una constelación de una estrella. Es el **dibujo** que vive dentro de una galaxia.
_Avoid_: Red, grafo (en UI), dashboard, "mi red hasta 2º grado"

**Galaxia**:
El evento visto en el cosmos: el **lugar**. En UI, «galaxia» nombra al evento como sitio al que entras o exploras («estás en», «explora galaxias») y «constelación» nombra al dibujo de estrellas y conexiones que ocurre dentro de ella. Nunca se usan como sinónimos.
_Avoid_: Usar galaxia para el grafo, o constelación para el evento

**Universo**:
Todo lo tuyo en Constela: tus galaxias (eventos) y las constelaciones dentro de ellas. La pantalla principal se llama «Universo» y muestra tu galaxia activa.
_Avoid_: Dashboard, inicio, feed

**Rol**:
Lo que haces, una sola etiqueta del catálogo ("backend", "founder", "ui design"). Es la etiqueta con la que otros deciden acercarse.
_Avoid_: Cargo, puesto, profesión

**Interés**:
Los temas de los que quieres hablar; los que quieras, sin límite. Son el eje principal para filtrar la constelación.
_Avoid_: Skill, habilidad, especialidad

**Intención**:
A qué viniste al evento ("estoy contratando", "busco cofundador"). Opcional y el filtro más potente para un encuentro presencial.
_Avoid_: Objetivo, meta, estado

**Catálogo vivo**:
La lista compartida de roles, intereses e intenciones. Arranca curada y crece: lo que alguien escribe queda disponible para los demás, y los sinónimos ("sre", "pm", "ux/ui") se resuelven al mismo tag en vez de crear gemelos.
_Avoid_: Taxonomía, lista fija, tags libres

**Cierre triádico**:
El triángulo que se forma cuando dos de tus conexiones también se conectan entre sí. Constela lo resalta y sugiere el siguiente triángulo por cerrar.
_Avoid_: Triángulo cerrado, mutual
