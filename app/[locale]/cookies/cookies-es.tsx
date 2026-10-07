import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n/routes";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const cookiesMetadataEs: Metadata = {
  title: "Política de cookies",
  description: "Las cookies que usa AlphaBes y cómo administrar tus preferencias.",
  alternates: alternatesFor("es", "/cookies"),
};

export default function CookiesEs() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Política de cookies</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Última actualización: 7 de octubre de 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Cookies necesarias</h2>
          <p className="mt-2">
            Usamos una cookie de sesión para que las familias sigan conectadas de forma segura. Esta
            cookie es necesaria para que el sitio funcione y no se puede desactivar.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Cookies de medición de audiencia</h2>
          <p className="mt-2">
            Si lo aceptas, usamos Google Analytics para entender cómo se usa el sitio, mejorar las
            lecciones y corregir problemas. Estas cookies son opcionales y solo se instalan después
            de tu consentimiento, de acuerdo con el RGPD y las normas equivalentes de otros países.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Preferencia de idioma</h2>
          <p className="mt-2">
            Si cambias de idioma con los botones EN / FR / ES / PT, guardamos tu elección en una cookie
            (NEXT_LOCALE) durante un año, para que el sitio se abra en tu idioma la próxima vez. Solo
            se instala cuando haces esa elección y solo contiene el código del idioma.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Administrar las cookies</h2>
          <p className="mt-2">
            Puedes controlar o borrar las cookies en cualquier momento desde los ajustes de tu
            navegador. Si bloqueas las cookies necesarias, es posible que no puedas mantener tu
            sesión iniciada. Si ya elegiste una opción para las cookies de medición de audiencia,
            puedes cambiarla aquí abajo.
          </p>
          <CookiePreferencesButton />
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texto provisional: recomendamos que lo revise un abogado antes del lanzamiento, en
        especial según la ley mexicana de protección de datos (LFPDPPP), la ley argentina 25.326,
        el RGPD y la LOPDGDD españolas y la ley marroquí 09-08.
      </p>
    </main>
  );
}
