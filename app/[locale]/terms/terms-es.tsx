import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";

export const termsMetadataEs: Metadata = {
  title: "Términos de uso",
  description: "Los términos de uso de AlphaBes: cuentas, suscripciones y uso de las fichas.",
  alternates: alternatesFor("es", "/terms"),
};

export default function TermsEs() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Términos de uso</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Última actualización: 5 de octubre de 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Quién puede crear una cuenta</h2>
          <p className="mt-2">
            Las cuentas de AlphaBes las crea y las administra una madre, un padre, un tutor legal o
            un maestro, nunca directamente un niño. Al crear una cuenta, confirmas que tienes al
            menos 18 años o la mayoría de edad de tu país.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Quién está detrás de AlphaBes</h2>
          <p className="mt-2">
            AlphaBes es operado por Lahcen Afoullousse, en Marruecos. Puedes escribirnos a{" "}
            <a href="mailto:hello@alphabes.com" className="font-bold text-crayon-blue">
              hello@alphabes.com
            </a>{" "}
            o desde la{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              página de contacto
            </Link>
            .
          </p>
          {/* PLACEHOLDER: postal address, to be decided by the owner with a lawyer/accountant (docs/paypal-plan.md). */}
          <p className="mt-2">Dirección postal: [por completar]</p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">AlphaBes Pro</h2>
          <p className="mt-2">
            AlphaBes Pro suma los juegos premium, la descarga de los paquetes de fichas en un solo
            PDF y los cuentos marcados como Pro, como se describe en la{" "}
            <Link href="/pricing" className="font-bold text-crayon-blue">
              página de precios
            </Link>
            . Todo lo que es gratis en AlphaBes sigue siendo gratis.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Suscripciones y pagos</h2>
          <p className="mt-2">
            AlphaBes Pro cuesta US$7.99 al mes o US$59 al año, en dólares estadounidenses, y se paga
            con PayPal (con una cuenta de PayPal o, donde PayPal lo ofrece, con tarjeta). El pago lo
            procesa PayPal: nunca vemos los datos de tu tarjeta ni de tu banco. Si PayPal convierte
            el importe a tu moneda, el tipo de cambio y las comisiones los fija PayPal.
          </p>
          <p className="mt-2">
            La suscripción se renueva automáticamente al final de cada mes o de cada año, y PayPal
            cobra al mismo medio de pago, hasta que la canceles. Puedes cancelar cuando quieras
            desde tu cuenta de AlphaBes o en tu cuenta de PayPal: no se te volverá a cobrar, y
            conservas Pro hasta el final del periodo que ya pagaste.
          </p>
          <p className="mt-2">
            En el plan anual, te enviamos un correo de aviso unos 7 días antes de cada renovación,
            con la fecha y el importe.
          </p>
          <p className="mt-2">
            Si falla un pago de renovación, PayPal vuelve a intentarlo; si sigue fallando, Pro queda
            en pausa hasta que actualices el medio de pago en PayPal o empieces una nueva
            suscripción.
          </p>
          <p className="mt-2">
            Puedes pedir el reembolso completo dentro de los 14 días siguientes al primer pago de
            una suscripción mensual o anual, y dentro de los 14 días siguientes a cada pago de
            renovación anual; los pagos de renovación mensual no se reembolsan. Todos los detalles
            están en nuestra{" "}
            <Link href="/refunds" className="font-bold text-crayon-blue">
              política de reembolsos
            </Link>
            . Si cambiamos el precio de Pro, avisaremos a las personas suscritas al menos 30 días
            antes de que el nuevo precio se les aplique, para que puedan cancelar antes si lo
            prefieren.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Uso permitido</h2>
          <p className="mt-2">
            Las fichas y los materiales para imprimir son para uso personal, familiar o en el
            salón de clases. No está permitido redistribuir ni revender el contenido de AlphaBes.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Cambios en el servicio</h2>
          <p className="mt-2">
            Las lecciones, las fichas y las funciones pueden cambiar con el tiempo. Haremos lo
            posible por avisarte con anticipación razonable de cualquier cambio que afecte de
            forma importante a una suscripción de pago.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Tu privacidad</h2>
          <p className="mt-2">
            Cómo recopilamos y usamos los datos personales, incluidos los de tu hijo o hija, se
            explica en nuestra{" "}
            <Link href="/privacy-policy" className="font-bold text-crayon-blue">
              política de privacidad
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Cierre de una cuenta</h2>
          <p className="mt-2">
            Puedes dejar de usar AlphaBes cuando quieras y pedirnos por escrito que eliminemos tu
            cuenta. Si tienes una suscripción, cancélala antes para que no se renueve.
          </p>
          <p className="mt-2">
            Podemos suspender o cerrar una cuenta que no respete estos términos, por ejemplo si
            redistribuye o revende nuestro contenido, hace un uso abusivo del servicio o realiza
            pagos fraudulentos. Si cerramos por otro motivo una cuenta con una suscripción activa,
            cancelamos la suscripción y te devolvemos la parte del periodo que pagaste y no usaste.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Limitación de responsabilidad</h2>
          <p className="mt-2">
            Trabajamos para que AlphaBes sea correcto y esté disponible, pero se ofrece «tal cual»
            y no podemos garantizar que siempre funcione sin errores ni interrupciones. En la
            medida en que la ley lo permita, no respondemos por daños indirectos, y nuestra
            responsabilidad total ante ti se limita a lo que nos pagaste en los 12 meses anteriores
            al reclamo. Nada en estos términos limita una responsabilidad que la ley no permite
            limitar, ni los derechos que te da la ley de protección al consumidor de tu país.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Ley aplicable</h2>
          <p className="mt-2">
            Estos términos se rigen por la ley de Marruecos, y las controversias corresponden a los
            tribunales de Marruecos. Si usas AlphaBes como consumidor, conservas la protección de
            las normas obligatorias de protección al consumidor del país donde vives, y puedes
            presentar un reclamo ante sus tribunales.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texto provisional: recomendamos una revisión legal antes del lanzamiento, en especial de
        las condiciones de suscripción y de las normas de protección al consumidor en México, los
        demás países de Latinoamérica, España y la Unión Europea.
      </p>
    </main>
  );
}
