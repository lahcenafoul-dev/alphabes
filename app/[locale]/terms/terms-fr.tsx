import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
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
      <p className="mt-2 text-sm text-chalkboard/50">Dernière mise à jour : 5 octobre 2026</p>

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
          <h2 className="font-display font-bold text-xl">Qui édite AlphaBes</h2>
          <p className="mt-2">
            AlphaBes est édité par Lahcen Afoullousse, au Maroc. Vous pouvez nous écrire à{" "}
            <a href="mailto:hello@alphabes.com" className="font-bold text-crayon-blue">
              hello@alphabes.com
            </a>{" "}
            ou depuis la{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              page de contact
            </Link>
            .
          </p>
          {/* PLACEHOLDER: postal address, to be decided by the owner with a lawyer/accountant (docs/paypal-plan.md). */}
          <p className="mt-2">Adresse postale : [à compléter]</p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">AlphaBes Pro</h2>
          <p className="mt-2">
            AlphaBes Pro ajoute les jeux premium, le téléchargement des packs de fiches en un seul
            PDF et les histoires marquées Pro, comme décrit sur la{" "}
            <Link href="/pricing" className="font-bold text-crayon-blue">
              page Tarifs
            </Link>
            . Tout ce qui est gratuit sur AlphaBes le reste.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Abonnements et paiement</h2>
          <p className="mt-2">
            AlphaBes Pro coûte 7,99 $ US par mois ou 59 $ US par an, en dollars américains, et se
            paie par PayPal (avec un compte PayPal ou, quand PayPal le propose, une carte). Le
            paiement est traité par PayPal : nous ne voyons jamais vos coordonnées bancaires. Si
            PayPal convertit le montant dans votre monnaie, le taux de change et les frais
            éventuels sont fixés par PayPal.
          </p>
          <p className="mt-2">
            L&apos;abonnement se renouvelle automatiquement à la fin de chaque mois ou de chaque
            année, et PayPal prélève le même moyen de paiement, jusqu&apos;à ce que vous résiliiez.
            Vous pouvez résilier à tout moment depuis votre tableau de bord ou dans votre compte
            PayPal : il n&apos;y a plus aucun prélèvement, et vous gardez Pro jusqu&apos;à la fin de
            la période déjà payée.
          </p>
          <p className="mt-2">
            Pour la formule annuelle, nous vous envoyons un e-mail de rappel environ 7 jours avant
            chaque renouvellement, avec la date et le montant.
          </p>
          <p className="mt-2">
            Si un paiement de renouvellement échoue, PayPal réessaie ; s&apos;il échoue encore, Pro
            est suspendu jusqu&apos;à la mise à jour du moyen de paiement dans PayPal ou la
            souscription d&apos;un nouvel abonnement.
          </p>
          <p className="mt-2">
            Vous pouvez demander un remboursement complet dans les 14 jours qui suivent le premier
            paiement d&apos;un abonnement mensuel ou annuel ; les paiements de renouvellement ne
            sont pas remboursés. Tout est détaillé dans notre{" "}
            <Link href="/refunds" className="font-bold text-crayon-blue">
              politique de remboursement
            </Link>
            . Si le prix de Pro change, nous prévenons les abonnés au moins 30 jours avant que le
            nouveau prix ne s&apos;applique à eux, pour qu&apos;ils puissent résilier avant
            s&apos;ils le souhaitent.
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
        <section>
          <h2 className="font-display font-bold text-xl">Vos données personnelles</h2>
          <p className="mt-2">
            La façon dont nous recueillons et utilisons les données personnelles, y compris celles
            de votre enfant, est expliquée dans notre{" "}
            <Link href="/privacy-policy" className="font-bold text-crayon-blue">
              politique de confidentialité
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Fermeture d&apos;un compte</h2>
          <p className="mt-2">
            Vous pouvez cesser d&apos;utiliser AlphaBes à tout moment et nous demander par écrit
            de supprimer votre compte. Si vous avez un abonnement, résiliez-le d&apos;abord pour
            qu&apos;il ne se renouvelle pas.
          </p>
          <p className="mt-2">
            Nous pouvons suspendre ou fermer un compte qui ne respecte pas ces conditions, par
            exemple en cas de redistribution ou de revente de nos contenus, d&apos;usage abusif du
            service ou de paiement frauduleux. Si nous fermons pour une autre raison un compte qui
            a un abonnement en cours, nous résilions l&apos;abonnement et remboursons la partie de
            la période payée et non utilisée.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Limitation de responsabilité</h2>
          <p className="mt-2">
            Nous faisons en sorte qu&apos;AlphaBes soit exact et disponible, mais le service est
            fourni « en l&apos;état » et nous ne pouvons pas garantir qu&apos;il sera toujours
            exempt d&apos;erreurs ou d&apos;interruptions. Dans la mesure permise par la loi, nous
            ne sommes pas responsables des dommages indirects, et notre responsabilité totale
            envers vous est limitée aux sommes que vous nous avez payées dans les 12 mois
            précédant la réclamation. Rien dans ces conditions ne limite une responsabilité que la
            loi interdit de limiter, ni les droits que vous donne le droit de la consommation de
            votre pays.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Droit applicable</h2>
          <p className="mt-2">
            Ces conditions sont régies par le droit marocain, et les litiges relèvent des
            tribunaux du Maroc. Si vous utilisez AlphaBes en tant que consommateur, vous gardez la
            protection des règles impératives du droit de la consommation du pays où vous vivez,
            et vous pouvez saisir les tribunaux de ce pays.
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
