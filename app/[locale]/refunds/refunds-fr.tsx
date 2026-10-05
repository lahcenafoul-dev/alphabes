import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";

export const refundsMetadataFr: Metadata = {
  title: "Politique de remboursement",
  description: "Comment fonctionnent la résiliation et les remboursements d'AlphaBes Pro, payé par PayPal.",
  alternates: alternatesFor("fr", "/refunds"),
};

export default function RefundsFr() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Politique de remboursement</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Dernière mise à jour : 5 octobre 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Résilier</h2>
          <p className="mt-2">
            Vous pouvez résilier AlphaBes Pro à tout moment, depuis votre{" "}
            <Link href="/dashboard" className="font-bold text-crayon-blue">
              tableau de bord
            </Link>{" "}
            (« Résilier l&apos;abonnement ») ou dans votre compte PayPal, rubrique des paiements
            automatiques. Il n&apos;y a plus aucun prélèvement, et vous gardez Pro jusqu&apos;à
            la fin du mois ou de l&apos;année déjà payés.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Votre premier paiement</h2>
          <p className="mt-2">
            Nous remboursons intégralement le premier paiement d&apos;un abonnement si vous le
            demandez dans les 14 jours qui le suivent, pour la formule mensuelle (7,99 $ US) comme
            pour la formule annuelle (59 $ US). Au-delà de 14 jours, le premier paiement n&apos;est
            pas remboursé, mais vous pouvez toujours résilier pour que la formule ne se renouvelle
            pas.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Renouvellements</h2>
          <p className="mt-2">
            Renouvellements annuels : nous remboursons aussi intégralement chaque paiement de
            renouvellement annuel (59 $ US) si vous le demandez dans les 14 jours qui le suivent.
            Environ 7 jours avant chaque renouvellement annuel, nous vous envoyons un e-mail de
            rappel avec la date et le montant, pour que vous puissiez résilier avant si vous le
            souhaitez.
          </p>
          <p className="mt-2">
            Renouvellements mensuels : les paiements de renouvellement mensuels (7,99 $ US) ne
            sont pas remboursés, même pour un mois utilisé en partie. Pour éviter le prochain
            prélèvement, résiliez avant la date de renouvellement indiquée sur votre tableau de
            bord.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Demander un remboursement</h2>
          <p className="mt-2">
            Écrivez-nous depuis la{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              page de contact
            </Link>{" "}
            en indiquant l&apos;adresse e-mail de votre compte AlphaBes. Nous remboursons par
            PayPal, sur le compte ou la carte qui a servi au paiement ; PayPal l&apos;affiche
            en général sous quelques jours ouvrés. Dès qu&apos;un paiement est remboursé,
            l&apos;abonnement est résilié et Pro prend fin immédiatement.
          </p>
          <p className="mt-2">
            En cas de problème avec un paiement, contactez-nous avant d&apos;ouvrir un litige
            auprès de PayPal : c&apos;est en général plus rapide à régler.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Vos droits</h2>
          <p className="mt-2">
            Cette politique ne limite aucun des droits que vous donne le droit de la
            consommation de votre pays. Les prix sont en dollars américains ; si PayPal convertit
            le montant dans votre monnaie, le taux de change et les frais éventuels sont fixés par
            PayPal.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texte provisoire : nous recommandons une relecture juridique avant le lancement,
        notamment pour le droit de rétractation et les règles de résiliation en France, dans
        l&apos;Union européenne et au Maroc.
      </p>
    </main>
  );
}
