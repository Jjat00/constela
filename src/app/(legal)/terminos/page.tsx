import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones — Constela",
  description:
    "Las reglas de Constela: qué es, qué esperamos de ti y qué puedes esperar de nosotros.",
};

const CONTACTO = "userjjat00@gmail.com";

export default function TerminosPage() {
  return (
    <article>
      <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
        [ términos ]
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-balance sm:text-4xl">
        Las reglas del <span className="text-celeste">universo</span>
      </h1>
      <p className="mt-3.5 font-mono text-[11px] tracking-[0.14em] text-faint">
        VIGENTE DESDE EL 30 DE JULIO DE 2026
      </p>

      <div className="prosa-legal glass mt-8 rounded-4xl p-6 sm:p-8">
        <h2>1. Qué es esto</h2>
        <p>
          Constela es una aplicación web de networking para eventos
          presenciales: cada asistente es una estrella, cada encuentro una
          conexión, y la red del evento se dibuja en vivo como una constelación.
          La opera <strong>Jaime Aza</strong>, persona natural domiciliada en
          Colombia. Al usarla aceptas estos términos; si no estás de acuerdo con
          alguno, no la uses.
        </p>

        <h2>2. Tu cuenta</h2>
        <p>
          Se entra únicamente con una cuenta de Google. Debes tener al menos 14
          años y usar tu identidad real: Constela sirve para reconocerse en
          persona, así que hacerse pasar por otro rompe lo único que la hace
          útil. Eres responsable de lo que ocurra desde tu cuenta.
        </p>

        <h2>3. Cómo se entra a un evento y cómo se conecta</h2>
        <p>
          Conviene tenerlo claro porque no funciona como otras aplicaciones:
        </p>
        <ul>
          <li>
            A un evento se entra <strong>por una persona</strong>: al escanear
            el código personal de alguien que ya está dentro, quedas dentro de
            ese mismo evento.
          </li>
          <li>
            En ese mismo gesto <strong>se crea la conexión</strong> entre
            ustedes dos. No hay botón de aceptar, ni solicitudes, ni
            confirmación posterior: escanear es conectar.
          </li>
          <li>
            Esa conexión es visible para los demás asistentes de ese evento
            —forma parte del dibujo de la constelación—, y quien escanea decide
            cuándo hacerlo.
          </li>
        </ul>
        <p>
          Comparte tu código con quien de verdad quieras conectar. Cualquier
          persona logueada puede crear un evento; no existen organizadores,
          invitaciones ni moderación previa.
        </p>

        <h2>4. Lo que publicas</h2>
        <p>
          Tu titular, tus tags y tus enlaces de contacto son tuyos y sigues
          siendo su dueño. Al ponerlos nos das permiso para mostrarlos dentro de
          Constela a quien corresponda según la{" "}
          <Link href="/privacidad">política de privacidad</Link>. No publiques
          datos personales de terceros sin su permiso, ni información sensible,
          ni nada sobre lo que no tengas derechos.
        </p>

        <h2>5. Cómo comportarse</h2>
        <p>Dentro de Constela no está permitido:</p>
        <ul>
          <li>
            Acosar, amenazar, discriminar o incomodar deliberadamente a otras
            personas.
          </li>
          <li>Suplantar a alguien o crear estrellas falsas.</li>
          <li>
            Usar los datos de otros asistentes para spam, venta de listas,
            reclutamiento masivo no solicitado o cualquier fin ajeno al evento.
          </li>
          <li>
            Extraer datos de forma automatizada, intentar saltarse las reglas de
            acceso, o sobrecargar el servicio a propósito.
          </li>
          <li>Usar Constela para algo ilegal.</li>
        </ul>
        <p>
          Lo que veas dentro de un evento es para ese evento. Trata los datos de
          los demás con el mismo cuidado con el que querrías que traten los
          tuyos.
        </p>

        <h2>6. Propiedad</h2>
        <p>
          El nombre Constela, su diseño, su código y su identidad visual son de
          quien opera el servicio. Estos términos no te dan ningún derecho sobre
          ellos más allá de usar la aplicación tal como se ofrece.
        </p>

        <h2>7. El servicio se ofrece «tal cual»</h2>
        <p>
          Constela está en desarrollo activo y se ofrece{" "}
          <strong>sin garantías de ningún tipo</strong>: puede fallar, cambiar,
          interrumpirse o dejar de existir. En una versión temprana{" "}
          <strong>los datos podrían perderse</strong>. No prometemos
          disponibilidad continua ni que sirva para un propósito concreto, y no
          respondemos por lo que otras personas escriban, hagan o dejen de hacer
          —dentro o fuera del evento—. Los encuentros ocurren en el mundo real y
          la prudencia allí es tuya.
        </p>

        <h2>8. Responsabilidad</h2>
        <p>
          En la medida en que la ley lo permita, no respondemos por daños
          indirectos, lucro cesante, pérdida de datos ni de oportunidades
          derivados del uso de Constela. Nada de esto limita las
          responsabilidades que la ley colombiana no permite excluir.
        </p>

        <h2>9. Suspensión y cierre</h2>
        <p>
          Podemos suspender o cerrar una cuenta que incumpla estos términos o
          que ponga en riesgo a otras personas, si hace falta sin aviso previo.
          Tú puedes irte cuando quieras: escribe a{" "}
          <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a> para pedir el borrado de
          tu cuenta y todo lo asociado.
        </p>

        <h2>10. Cambios</h2>
        <p>
          Podemos modificar el servicio y estos términos. Si el cambio es de
          fondo, lo avisaremos dentro de la aplicación y actualizaremos la fecha
          de vigencia. Seguir usando Constela después de un cambio significa que
          lo aceptas.
        </p>

        <h2>11. Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de la República de Colombia.
          Cualquier controversia se someterá a los jueces competentes de
          Colombia.
        </p>

        <h2>12. Contacto</h2>
        <p>
          Escribe a <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>. Si buscabas
          cómo tratamos tus datos, está en la{" "}
          <Link href="/privacidad">política de privacidad</Link>.
        </p>
      </div>
    </article>
  );
}
