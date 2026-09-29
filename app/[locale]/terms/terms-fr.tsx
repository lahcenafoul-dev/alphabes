import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n/routes";

export const termsMetadataFr: Metadata = {
  title: "Conditions d'utilisation",
  description: "Les conditions d'utilisation d'AlphaBes : comptes, abonnements et utilisation des fiches.",
  alternates: alternatesFor("fr", "/terms"),
};

export default function TermsFr() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Conditions d&apos;utilisation</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Dernière mise à jour : 29 septembre 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Qui peut créer un compte</h2>
          <p className="mt-2">
            Les comptes AlphaBes sont créés et gérés par un parent, un tuteur légal ou un
            enseignant, jamais directement par un enfant. En créant un compte, vous confirmez
            avoir au moins 18 ans ou l&apos;âge de la majorité dans votre pays.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Abonnements et paiement</h2>
          <p className="mt-2">
            AlphaBes Pro est facturé chaque mois (7,99 $ US) ou chaque année (59 $ US). Les
            abonnements se renouvellent automatiquement jusqu&apos;à leur résiliation depuis les
            réglages de votre compte.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Utilisation autorisée</h2>
          <p className="mt-2">
            Les fiches et documents à imprimer sont destinés à un usage personnel, familial ou
            en classe. Il est interdit de redistribuer ou de revendre le contenu d&apos;AlphaBes.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Évolution du service</h2>
          <p className="mt-2">
            Les leçons, les fiches et les fonctionnalités peuvent évoluer avec le temps. Nous
            nous efforcerons de vous prévenir dans un délai raisonnable de tout changement qui
            affecterait de façon importante un abonnement payant.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texte provisoire : nous recommandons une relecture juridique avant le lancement,
        notamment pour les conditions d&apos;abonnement et les règles de protection des
        consommateurs en France, dans l&apos;Union européenne et au Maroc.
      </p>
    </main>
  );
}
