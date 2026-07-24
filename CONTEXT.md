# Constela

Red de networking para eventos presenciales: cada asistente es una estrella, cada encuentro una conexión, y la red del evento se dibuja en vivo como una constelación.

## Language

**Estrella**:
El perfil de una persona dentro de Constela: nombre y foto (de Google) más titular y tags opcionales.
_Avoid_: Usuario, cuenta, perfil (en UI)

**Evento**:
Un encuentro presencial con nombre, fecha y slug propio. Cualquier persona logueada puede crear uno; no existen roles de organizador ni moderación en el MVP.
_Avoid_: Sala, espacio, comunidad

**Asistente**:
Una estrella que está dentro de un evento. Se es asistente por abrir el link/QR del evento o por escanear el QR personal de un asistente (membresía contagiosa), nunca por invitación ni aprobación.
_Avoid_: Miembro, participante registrado

**Membresía contagiosa**:
Escanear el QR personal de alguien que ya está en un evento te une a su evento más reciente automáticamente, y así sucesivamente de persona en persona.
_Avoid_: Invitación implícita, auto-registro

**Conexión**:
La arista entre dos asistentes, creada cuando uno escanea el QR personal del otro. Puede llevar una nota opcional del momento. Es simétrica y única por par.
_Avoid_: Amistad, follow, match

**QR personal**:
El código propio de cada estrella (`/u/{slug}`); que te lo escaneen crea una conexión.
_Avoid_: QR a secas (ambiguo con el QR de evento)

**QR de evento**:
El código del evento (`/e/{slug}`); abrirlo te hace asistente automáticamente (tras login si hace falta).
_Avoid_: Código de invitación, link de registro

**Constelación**:
El grafo completo de un evento: todas las estrellas asistentes (con o sin conexiones) y todas las conexiones entre ellas, sin límite de profundidad, visible para cualquier asistente. Estando tú solo, ya es una constelación de una estrella.
_Avoid_: Red, grafo (en UI), dashboard, "mi red hasta 2º grado"

**Cierre triádico**:
El triángulo que se forma cuando dos de tus conexiones también se conectan entre sí. Constela lo resalta y sugiere el siguiente triángulo por cerrar.
_Avoid_: Triángulo cerrado, mutual
