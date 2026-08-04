import type { Metadata } from "next";
import Link from "next/link";

// El sufijo «— Constela» ya lo pone el `title.template` del layout raíz:
// escribirlo aquí otra vez daría «Política de privacidad — Constela — Constela».
export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Qué datos trata Constela, para qué, quién los ve y cómo pedir que se borren.",
  alternates: { canonical: "/privacidad" },
};

const CONTACTO = "userjjat00@gmail.com";

export default function PrivacidadPage() {
  return (
    <article>
      <p className="font-mono text-[11px] tracking-wider text-faint uppercase">
        [ privacidad ]
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        Tus datos, <span className="text-celeste">en claro</span>
      </h1>
      <p className="mt-3.5 font-mono text-[11px] tracking-wide text-faint">
        VIGENTE DESDE EL 30 DE JULIO DE 2026
      </p>

      <div className="prosa-legal glass mt-8 rounded-4xl p-6 sm:p-8">
        <h2>1. Quién responde por tus datos</h2>
        <p>
          Constela es un proyecto personal operado por{" "}
          <strong>Jaime Aza</strong>, persona natural domiciliada en Colombia,
          que actúa como responsable del tratamiento. Para cualquier asunto
          relacionado con tus datos escribe a{" "}
          <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>.
        </p>
        <p>
          Esta política se rige por la Ley 1581 de 2012 y el Decreto 1074 de
          2015 de Colombia. Al entrar a Constela autorizas el tratamiento de tus
          datos personales en los términos que siguen.
        </p>

        <h2>2. Qué datos tratamos</h2>
        <h3>Lo que llega de Google cuando entras</h3>
        <p>
          Constela solo permite entrar con una cuenta de Google. Al hacerlo
          recibimos tu <strong>nombre</strong>, tu{" "}
          <strong>correo electrónico</strong>, tu{" "}
          <strong>foto de perfil</strong> y el identificador que Google usa para
          reconocerte. Nada más: no pedimos acceso a tu Gmail, tu Drive, tus
          contactos ni tu calendario, y no tenemos ni guardamos tu contraseña.
        </p>
        <h3>Lo que escribes tú</h3>
        <p>
          Tu titular, tu rol, tus intereses, tu intención y —si decides
          ponerlos— tus enlaces de contacto: sitio web, Instagram, LinkedIn,
          GitHub y número de WhatsApp. Todo esto es opcional y lo puedes editar
          o vaciar cuando quieras desde tu perfil.
        </p>
        <h3>Lo que ocurre al usar Constela</h3>
        <p>
          Los eventos en los que entras, las conexiones que se crean al escanear
          el código de otra persona (con quién, en qué evento y cuándo) y las
          notas que escribas sobre una conexión.
        </p>
        <h3>Datos técnicos</h3>
        <p>
          Cookies estrictamente necesarias para mantener tu sesión iniciada, y
          los registros normales de servidor de nuestros proveedores de
          infraestructura. <strong>No usamos analítica ni rastreo</strong> de
          terceros, no hay publicidad y no construimos perfiles publicitarios.
        </p>

        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Identificarte y mantener tu sesión abierta.</li>
          <li>
            Mostrar tu estrella a los demás asistentes del evento y dibujar la
            constelación de conexiones.
          </li>
          <li>
            Permitir que otras personas te encuentren por rol, intereses o
            intención dentro de un evento.
          </li>
          <li>
            Responder a lo que nos escribas y mantener el servicio funcionando y
            seguro.
          </li>
        </ul>
        <p>
          No vendemos tus datos, no los cedemos a terceros con fines
          comerciales, y no los usamos para nada distinto de operar Constela.
        </p>

        <h2>4. Qué ven las demás personas</h2>
        <p>
          Constela es un producto social: parte de tu información es visible
          para otros por diseño. Conviene que lo sepas antes de escribir nada.
        </p>
        <ul>
          <li>
            <strong>Visible para los asistentes de un evento en el que estás</strong>
            : tu nombre, tu foto, tu titular, tu rol, tus intereses, tu
            intención y tus conexiones dentro de ese evento.
          </li>
          <li>
            <strong>Visible para cualquiera con el enlace</strong>: tu ficha
            pública, en la dirección personal que se abre al escanear tu código.
            Trátala como una tarjeta de presentación: quien tenga el enlace
            puede abrirla.
          </li>
          <li>
            <strong>Nunca visible para otros usuarios</strong>: tu correo
            electrónico. Se usa solo para identificar tu cuenta.
          </li>
        </ul>
        <p>
          Las notas que escribas sobre una conexión son privadas: solo las ve
          quien las escribió.
        </p>

        <h2>5. Con quién los compartimos</h2>
        <p>
          Solo con los proveedores que hacen falta para que Constela exista, y
          únicamente para eso:
        </p>
        <ul>
          <li>
            <strong>Google</strong> — autenticación (el botón «Continuar con
            Google»).
          </li>
          <li>
            <strong>Supabase</strong> — base de datos y gestión de sesiones.
          </li>
          <li>
            <strong>Vercel</strong> — alojamiento de la aplicación.
          </li>
        </ul>
        <p>
          Sus servidores están fuera de Colombia, principalmente en Estados
          Unidos, de modo que usar Constela implica una transferencia
          internacional de tus datos a esos proveedores. También podríamos
          entregar información si una autoridad competente lo exige legalmente.
        </p>

        <h2>6. Cuánto los guardamos</h2>
        <p>
          Mientras tu cuenta exista. Si pides que la borremos, eliminamos tu
          cuenta, tu perfil, tus asistencias a eventos y tus conexiones. Puede
          quedar rastro de una conexión en la vista de la otra persona hasta que
          el borrado se complete, y las copias de seguridad de nuestros
          proveedores pueden conservar datos unos días más antes de rotar.
        </p>

        <h2>7. Tus derechos</h2>
        <p>
          Como titular de tus datos puedes conocer, actualizar y rectificar lo
          que tenemos sobre ti; pedir prueba de la autorización que diste;
          solicitar que suprimamos tus datos o revocar tu autorización; y
          presentar quejas ante la Superintendencia de Industria y Comercio.
        </p>
        <p>
          Lo más común lo haces tú directamente: editar o vaciar tu perfil desde
          la propia aplicación. Para{" "}
          <strong>borrar tu cuenta y todo lo asociado</strong> escríbenos a{" "}
          <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a> desde el correo con el
          que entras —hoy no hay un botón para hacerlo dentro de la app— y lo
          resolveremos en un plazo razonable, a más tardar en 15 días hábiles.
        </p>

        <h2>8. Cookies</h2>
        <p>
          Solo las estrictamente necesarias para mantener tu sesión. No hay
          cookies de publicidad, de analítica ni de terceros, y por eso Constela
          no te muestra un banner de consentimiento de cookies.
        </p>

        <h2>9. Seguridad</h2>
        <p>
          El tráfico viaja cifrado y la base de datos aplica reglas de acceso
          por fila, de modo que cada quien solo alcanza lo que le corresponde.
          Aun así, Constela es un proyecto joven en desarrollo activo: ningún
          sistema es infalible y no podemos prometer seguridad absoluta. No
          escribas en tu perfil nada que no estarías dispuesto a decirle en voz
          alta a una sala llena de gente.
        </p>

        <h2>10. Menores de edad</h2>
        <p>
          Constela no está dirigida a menores de 14 años y no tratamos sus datos
          a sabiendas. Si detectamos una cuenta de un menor de esa edad, la
          eliminaremos.
        </p>

        <h2>11. Datos de las APIs de Google</h2>
        <p>
          El uso que Constela hace de la información recibida de las APIs de
          Google se ajusta a la{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Datos de Usuario de los Servicios de la API de Google
          </a>
          , incluidos sus requisitos de uso limitado.
        </p>

        <h2>12. Cambios en esta política</h2>
        <p>
          Si cambia, actualizaremos la fecha de vigencia del encabezado. Si el
          cambio es de fondo, te lo avisaremos dentro de la aplicación antes de
          que aplique.
        </p>

        <h2>13. Contacto</h2>
        <p>
          Escribe a <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>. También
          puedes leer los{" "}
          <Link href="/terminos">términos y condiciones del servicio</Link>.
        </p>
      </div>
    </article>
  );
}
