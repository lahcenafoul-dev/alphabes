import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";

export const refundsMetadataEs: Metadata = {
  title: "Política de reembolsos",
  description: "Cómo funcionan la cancelación y los reembolsos de AlphaBes Pro, que se paga con PayPal.",
  alternates: alternatesFor("es", "/refunds"),
};

export default function RefundsEs() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Política de reembolsos</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Última actualización: 4 de octubre de 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Cancelar</h2>
          <p className="mt-2">
            Puedes cancelar AlphaBes Pro cuando quieras, desde{" "}
            <Link href="/dashboard" className="font-bold text-crayon-blue">
              tu cuenta
            </Link>{" "}
            («Cancelar la suscripción») o en tu cuenta de PayPal, en la sección de pagos
            automáticos. No se te volverá a cobrar, y conservas Pro hasta el final del mes o del
            año que ya pagaste.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Plan mensual</h2>
          <p className="mt-2">
            Los pagos mensuales (US$7.99) no se reembolsan, ni siquiera por un mes que usaste solo
            en parte. Para evitar el próximo cobro, cancela antes de la fecha de renovación que
            aparece en tu cuenta.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Plan anual</h2>
          <p className="mt-2">
            Te devolvemos el importe completo de un pago anual (US$59) si lo pides dentro de los
            14 días siguientes, ya sea tu primer pago anual o una renovación. Unos 7 días antes de
            cada renovación anual te enviamos un correo de aviso con la fecha y el importe, para
            que puedas cancelar antes si lo prefieres. Después de 14 días, el pago no se reembolsa,
            pero siempre puedes cancelar para que el plan no se renueve.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Cómo pedir un reembolso</h2>
          <p className="mt-2">
            Escríbenos desde la{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              página de contacto
            </Link>{" "}
            con el correo electrónico de tu cuenta de AlphaBes. Hacemos el reembolso por PayPal, a
            la cuenta o la tarjeta con la que pagaste; PayPal suele mostrarlo en unos pocos días
            hábiles. Cuando se reembolsa un pago, la suscripción se cancela y Pro termina en ese
            momento.
          </p>
          <p className="mt-2">
            Si hubo un problema con un pago, escríbenos antes de abrir una disputa en PayPal: por lo
            general lo resolvemos más rápido.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Tus derechos</h2>
          <p className="mt-2">
            Esta política no limita ninguno de los derechos que te da la ley de protección al
            consumidor de tu país. Los precios están en dólares estadounidenses; si PayPal convierte
            el importe a tu moneda, el tipo de cambio y las comisiones los fija PayPal.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texto provisional: recomendamos una revisión legal antes del lanzamiento, en especial de
        las normas de cancelación y desistimiento en México, los demás países de Latinoamérica,
        España y la Unión Europea.
      </p>
    </main>
  );
}
