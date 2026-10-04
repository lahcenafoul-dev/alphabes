import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";

export const privacyPolicyMetadataEs: Metadata = {
  title: "Política de privacidad",
  description:
    "Los datos que recopila AlphaBes, cómo los usamos y tus derechos, en especial sobre los perfiles de los niños.",
  alternates: alternatesFor("es", "/privacy-policy"),
};

export default function PrivacyPolicyEs() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Política de privacidad</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Última actualización: 4 de octubre de 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">En resumen</h2>
          <p className="mt-2">
            AlphaBes («nosotros») ofrece lecciones, fichas y juegos para que niños de 3 a 8 años
            aprendan el abecedario, las sílabas y la lectura. Esta política explica qué información
            recopilamos, cómo la usamos y qué opciones tienes. Las cuentas de AlphaBes las crea y
            las administra una madre, un padre, un tutor legal o un maestro, nunca directamente un
            niño.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">La información que recopilamos</h2>
          <p className="mt-2">
            <strong>Datos de la cuenta.</strong> Cuando una madre, un padre, un tutor o un maestro
            crea una cuenta, recopilamos un correo electrónico, un nombre y una contraseña cifrada de
            forma segura (con NextAuth). Nunca guardamos tu contraseña en texto legible.
          </p>
          <p className="mt-2">
            <strong>Perfil del niño.</strong> Un perfil de niño solo contiene un nombre y un rango
            de edad: nunca una foto, una dirección, un número de teléfono, una escuela ni ningún
            otro dato de contacto del niño. El progreso en las lecciones y las fichas se guarda en
            el perfil, para que la familia pueda seguirlo desde su cuenta.
          </p>
          <p className="mt-2">
            <strong>Suscripción y pago.</strong> Si te suscribes a AlphaBes Pro, pagas con PayPal,
            que procesa el pago según su propia{" "}
            <a href="https://www.paypal.com/myaccount/privacy/privacyhub" className="font-bold text-crayon-blue">
              declaración de privacidad
            </a>
            . Nunca recibimos ni guardamos los datos de tu tarjeta ni de tu banco. De PayPal solo
            guardamos lo necesario para administrar tu suscripción: su identificador de PayPal, tu
            plan, su estado y las fechas del último pago, de la próxima renovación y de una posible
            cancelación, además de un registro de los avisos de PayPal sobre ella (un
            identificador, su tipo y su fecha). Los usamos para darte acceso a Pro, mostrar tu
            suscripción en tu cuenta y atender cancelaciones y reembolsos.
          </p>
          <p className="mt-2">
            <strong>Datos técnicos.</strong> Nuestros servidores y nuestro proveedor de hospedaje
            registran automáticamente datos técnicos habituales, como la dirección IP y la hora de
            las solicitudes. Los usamos para la seguridad, para prevenir abusos (por ejemplo, para
            limitar los intentos de inicio de sesión y de registro) y para diagnosticar problemas.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Cómo usamos la información</h2>
          <p className="mt-2">
            Usamos esta información para: crear tu cuenta y verificar tu identidad; hacer funcionar
            las lecciones, las fichas y los juegos que usan tú y tu hijo o hija; mostrar el progreso
            en tu cuenta; administrar las suscripciones; mantener el servicio seguro y prevenir
            abusos; y contactarte sobre tu cuenta (por ejemplo, por la facturación o la seguridad).
          </p>
          <p className="mt-2">
            Cuando Google AdSense apruebe nuestra solicitud, también planeamos usar información de
            navegación limitada, no vinculada a tu cuenta, para mostrar publicidad, como se explica
            en la sección de cookies más abajo.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Cookies y tecnologías similares</h2>
          <p className="mt-2">
            <strong>Cookies necesarias.</strong> Una cookie de sesión te permite mantener tu sesión
            iniciada de forma segura. Es necesaria para que el sitio funcione y no se puede
            desactivar.
          </p>
          <p className="mt-2">
            <strong>Preferencia de idioma.</strong> Si eliges un idioma con los botones EN / FR /
            ES, guardamos esa elección en una cookie durante un año.
          </p>
          <p className="mt-2">
            <strong>Cookies de medición de audiencia.</strong> Si lo aceptas, podemos usar
            herramientas de medición (como Google Analytics) para entender cómo se usa el sitio,
            mejorar las lecciones y corregir problemas. Solo se instalan después de tu
            consentimiento.
          </p>
          <p className="mt-2">
            <strong>Cookies publicitarias.</strong> AlphaBes planea mostrar publicidad con Google
            AdSense cuando se apruebe su solicitud. Google y sus socios podrán entonces instalar
            cookies para mostrar anuncios. Puedes saber más y rechazar la publicidad personalizada
            en{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites?hl=es-419"
              className="font-bold text-crayon-blue"
            >
              policies.google.com/technologies/partner-sites
            </a>{" "}
            y en la{" "}
            <a href="https://adssettings.google.com/?hl=es-419" className="font-bold text-crayon-blue">
              configuración de anuncios de Google
            </a>
            . Como este sitio está dirigido en parte a niños, planeamos configurar AdSense para
            mostrar solo anuncios contextuales, no personalizados, como exigen las reglas de Google
            para el contenido dirigido a niños.
          </p>
          <p className="mt-2">
            Para más detalles, consulta nuestra{" "}
            <Link href="/cookies" className="font-bold text-crayon-blue">
              política de cookies
            </Link>
            . También puedes controlar o borrar las cookies en cualquier momento desde los ajustes
            de tu navegador.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Los proveedores que usamos</h2>
          <p className="mt-2">
            Trabajamos con los siguientes tipos de proveedores, cada uno sujeto a su propia política
            de privacidad:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>
              <strong>Base de datos</strong>: nuestra base de datos Postgres (Neon), donde se
              guardan las cuentas, los perfiles de los niños y el progreso.
            </li>
            <li>
              <strong>Hospedaje del sitio</strong>: Cloudflare, que sirve el sitio y procesa las
              solicitudes.
            </li>
            <li>
              <strong>Autenticación</strong>: NextAuth, para administrar las sesiones de forma
              segura.
            </li>
            <li>
              <strong>Pagos</strong>: PayPal (ver «Suscripción y pago» más arriba), solo para las
              familias que se suscriben a AlphaBes Pro.
            </li>
            <li>
              <strong>Envío de correos</strong>: Resend, que envía nuestros correos: los avisos antes
              de la renovación de un plan anual y los mensajes que nos mandas desde la página de
              contacto, que nos llegan por correo para poder responderte.
            </li>
            <li>
              <strong>Publicidad</strong>: Google AdSense, cuando se apruebe nuestra solicitud.
            </li>
            <li>
              <strong>Medición de audiencia</strong>: una herramienta como Google Analytics, solo si
              aceptas las cookies de medición.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">La privacidad de los niños</h2>
          <p className="mt-2">
            AlphaBes está dirigido en parte a niños menores de 13 años. Por eso cuidamos
            especialmente sus datos, de acuerdo con la ley mexicana de protección de datos personales
            (LFPDPPP), las leyes de los demás países de Latinoamérica, el RGPD y la LOPDGDD en
            España, la ley marroquí 09-08 y las normas equivalentes de otros países.
          </p>
          <p className="mt-2">
            Solo una madre, un padre, un tutor o un maestro puede crear una cuenta de AlphaBes,
            confirmando que es mayor de edad: un niño no puede crear su propia cuenta. Crear un
            perfil de niño en la cuenta de la familia equivale al consentimiento de la madre, el
            padre o el tutor para que el niño use el servicio.
          </p>
          <p className="mt-2">
            Para un perfil de niño solo recopilamos un nombre y un rango de edad: nunca un correo
            electrónico, una ubicación precisa, una foto ni ningún otro dato de contacto directamente
            del niño. Los niños no pueden crear cuentas, comunicarse con otros usuarios ni hacer
            compras.
          </p>
          <p className="mt-2">
            Una madre, un padre o un tutor puede consultar, corregir o pedir que se elimine el
            perfil de su hijo o hija en cualquier momento (ver «Tus derechos» más abajo).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Cuánto tiempo guardamos los datos</h2>
          <p className="mt-2">
            Guardamos los datos de la cuenta y de los perfiles de los niños mientras tu cuenta esté
            activa, para que las lecciones y el progreso sigan disponibles. Si eliminas tu cuenta,
            borramos o anonimizamos esos datos en un plazo razonable, salvo los datos limitados que
            debamos conservar para cumplir obligaciones legales, fiscales o de seguridad (por
            ejemplo, los datos básicos de facturación).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Tus derechos</h2>
          <p className="mt-2">
            Según tu país de residencia, puedes tener derecho a acceder a tus datos y a los del
            perfil de tu hijo o hija, a rectificarlos, a cancelarlos u oponerte a su uso (los
            derechos ARCO en México), a la portabilidad, y a retirar en cualquier momento tu
            consentimiento a las cookies opcionales. Puedes:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Consultar y modificar los datos de tu cuenta en sus ajustes.</li>
            <li>Pedir una copia de tus datos, o que eliminemos tu cuenta y los perfiles de los niños, escribiéndonos (ver más abajo).</li>
            <li>Administrar o retirar tu consentimiento a las cookies desde los ajustes de tu navegador y, cuando estén disponibles, con nuestras herramientas de cookies.</li>
          </ul>
          <p className="mt-2">
            Respondemos a las solicitudes verificadas en un plazo razonable. También puedes
            presentar una queja ante la autoridad de protección de datos de tu país (por ejemplo,
            el organismo competente en México, la AAIP en Argentina, la AEPD en España o la CNDP en
            Marruecos).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Seguridad de los datos</h2>
          <p className="mt-2">
            Usamos medidas de seguridad reconocidas para proteger tu información, como conexiones
            cifradas y un cifrado seguro de las contraseñas. Ningún método de almacenamiento o de
            transmisión es perfectamente seguro, pero cuidamos tu información de forma adecuada a
            los datos que guardamos.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Cambios en esta política</h2>
          <p className="mt-2">
            Esta política puede cambiar junto con AlphaBes, por ejemplo cuando se apruebe nuestra
            solicitud de AdSense. Entonces actualizaremos la
            fecha de «última actualización» de arriba; te invitamos a revisar esta página de vez en
            cuando.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Contacto</h2>
          <p className="mt-2">
            Si tienes alguna pregunta sobre esta política o alguna solicitud sobre tus datos,
            escríbenos desde nuestra{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              página de contacto
            </Link>
            .
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texto provisional: como AlphaBes está dirigido a niños y procesa pagos, un abogado que
        conozca la LFPDPPP mexicana (y la autoridad que hoy la aplica), la ley argentina 25.326,
        el RGPD y la LOPDGDD españolas, la ley marroquí 09-08 y las reglas de Google AdSense para
        contenido dirigido a niños debe revisar esta página antes del lanzamiento.
      </p>
    </main>
  );
}
