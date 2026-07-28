# Modelo abierto de eventos: cualquiera crea, el link auto-une

Para el MVP no existen roles de organizador, invitaciones ni moderación: cualquier usuario logueado crea eventos desde la app, y abrir el link/QR de un evento te convierte en asistente automáticamente, sin confirmación. La membresía además es contagiosa: escanear el QR personal de alguien que ya está en un evento te une a su evento más reciente (RPC `join_event_via_profile`), en cadena. Y la conexión también es automática (decisión 2026-07-24): abrir el QR de alguien crea la arista sin botón ni formulario — la nota "¿de qué hablaron?" se añade después, desde la lista de conexiones. Con dos límites añadidos el 2026-07-27: la arista se crea en una server action invocada desde el cliente y no en el render, para que un prefetch o una recarga no puedan fabricar encuentros; y **tocar una estrella en la constelación abre su mini-perfil, nunca conecta** — de lo contrario se "conocería" gente desde el sofá y la arista dejaría de significar un encuentro presencial. Se decidió así (2026-07-24) porque la prioridad absoluta es cero fricción en la puerta del evento; el costo aceptado es que se pueden crear eventos basura y entrar a un evento por abrir un link compartido — reversible con moderación ligera si algún día duele.

## Considered Options

- Solo el organizador crea eventos (rechazada: más control, pero exige panel de admin y bloquea el caso "cualquier comunidad monta su evento").
- Botón "Unirme" explícito antes de entrar (rechazada: un tap más de fricción en la fila del evento sin beneficio real en el MVP).
