import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n/routes";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const cookiesMetadataFr: Metadata = {
  title: "Politique de cookies",
  description: "Les cookies utilisés par AlphaBes et comment gérer vos choix.",
  alternates: alternatesFor("fr", "/cookies"),
};

export default function CookiesFr() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Politique de cookies</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Dernière mise à jour : 29 septembre 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Cookies indispensables</h2>
          <p className="mt-2">
            Nous utilisons un cookie de session pour que les parents restent connectés en toute
            sécurité. Ce cookie est nécessaire au fonctionnement du site et ne peut pas être
            désactivé.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Cookies de mesure d&apos;audience</h2>
          <p className="mt-2">
            Avec votre accord, nous utilisons Google Analytics pour comprendre comment le site
            est utilisé, afin d&apos;améliorer les leçons et de corriger les problèmes. Ces cookies
            sont facultatifs et ne sont déposés qu&apos;après votre consentement, conformément au
            RGPD et aux règles équivalentes dans les autres pays.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Préférence de langue</h2>
          <p className="mt-2">
            Si vous passez de l&apos;anglais au français avec les boutons EN / FR, nous retenons
            votre choix dans un cookie (NEXT_LOCALE) pendant un an, pour que le site s&apos;ouvre
            dans votre langue la prochaine fois. Il n&apos;est déposé que lorsque vous faites ce
            choix et ne contient que le code de la langue.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Gérer les cookies</h2>
          <p className="mt-2">
            Vous pouvez contrôler ou supprimer les cookies à tout moment dans les réglages de
            votre navigateur. Bloquer les cookies indispensables peut vous empêcher de rester
            connecté. Si vous avez déjà fait un choix pour les cookies de mesure
            d&apos;audience, vous pouvez le modifier ci-dessous.
          </p>
          <CookiePreferencesButton />
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texte provisoire : nous recommandons de le faire relire par un juriste avant le
        lancement, notamment au regard du RGPD, des recommandations de la CNIL et de la loi
        marocaine 09-08.
      </p>
    </main>
  );
}
