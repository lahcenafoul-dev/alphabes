import type { Metadata } from "next";
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
      <p className="mt-2 text-sm text-chalkboard/50">Última actualización: 1 de octubre de 2026</p>

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
          <h2 className="font-display font-bold text-xl">Suscripciones y pagos</h2>
          <p className="mt-2">
            AlphaBes Pro se cobra cada mes (US$7.99) o cada año (US$59). Las suscripciones se
            renuevan automáticamente hasta que las canceles desde los ajustes de tu cuenta.
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
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texto provisional: recomendamos una revisión legal antes del lanzamiento, en especial de
        las condiciones de suscripción y de las normas de protección al consumidor en México, los
        demás países de Latinoamérica, España y la Unión Europea.
      </p>
    </main>
  );
}
