# Modelo abierto de eventos: cualquiera crea, el link auto-une

Para el MVP no existen roles de organizador, invitaciones ni moderación: cualquier usuario logueado crea eventos desde la app, y abrir el link/QR de un evento te convierte en asistente automáticamente, sin confirmación. La membresía además es contagiosa: escanear el QR personal de alguien que ya está en un evento te une a su evento más reciente (RPC `join_event_via_profile`), en cadena. Y la conexión también es automática (decisión 2026-07-24): abrir el QR de alguien crea la arista sin botón ni formulario — la nota "¿de qué hablaron?" se añade después, desde la lista de conexiones. Se decidió así (2026-07-24) porque la prioridad absoluta es cero fricción en la puerta del evento; el costo aceptado es que se pueden crear eventos basura y entrar a un evento por abrir un link compartido — reversible con moderación ligera si algún día duele.

## Considered Options

- Solo el organizador crea eventos (rechazada: más control, pero exige panel de admin y bloquea el caso "cualquier comunidad monta su evento").
- Botón "Unirme" explícito antes de entrar (rechazada: un tap más de fricción en la fila del evento sin beneficio real en el MVP).
