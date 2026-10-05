import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";

export const privacyPolicyMetadataFr: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Les données collectées par AlphaBes, leur utilisation et vos droits, en particulier pour les profils enfants.",
  alternates: alternatesFor("fr", "/privacy-policy"),
};

export default function PrivacyPolicyFr() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Dernière mise à jour : 4 octobre 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">En bref</h2>
          <p className="mt-2">
            AlphaBes (« nous ») propose des leçons, des fiches et des jeux pour apprendre
            l&apos;alphabet, les sons et la lecture aux enfants de 3 à 8 ans. Cette politique
            explique quelles informations nous collectons, comment nous les utilisons et quels
            sont vos choix. Les comptes AlphaBes sont créés et gérés par un parent, un tuteur
            légal ou un enseignant, jamais directement par un enfant.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Les informations que nous collectons</h2>
          <p className="mt-2">
            <strong>Informations du compte.</strong> Lorsqu&apos;un parent, un tuteur ou un
            enseignant crée un compte, nous collectons une adresse e-mail, un nom et un mot de
            passe chiffré de façon sécurisée (via NextAuth). Nous ne conservons jamais votre mot
            de passe en clair.
          </p>
          <p className="mt-2">
            <strong>Profil de l&apos;enfant.</strong> Un profil enfant contient uniquement un
            prénom et une tranche d&apos;âge : jamais de photo, d&apos;adresse, de numéro de
            téléphone, d&apos;école ni aucune autre coordonnée de l&apos;enfant. Les progrès dans
            les leçons et les fiches sont rattachés au profil, pour que le parent puisse les
            suivre dans son tableau de bord.
          </p>
          <p className="mt-2">
            <strong>Abonnement et paiement.</strong> Si vous souscrivez à AlphaBes Pro, vous
            payez par PayPal, qui traite le paiement selon sa propre{" "}
            <a href="https://www.paypal.com/myaccount/privacy/privacyhub" className="font-bold text-crayon-blue">
              déclaration de confidentialité
            </a>
            . Nous ne recevons et ne conservons jamais vos coordonnées bancaires ni votre numéro de
            carte. De PayPal, nous gardons seulement ce qu&apos;il faut pour gérer votre
            abonnement : son identifiant PayPal, votre formule, son statut et les dates du dernier
            paiement, du prochain renouvellement et d&apos;une éventuelle résiliation, ainsi
            qu&apos;une trace des notifications de PayPal qui le concernent (un identifiant, leur
            type et leur date). Ces informations servent à vous donner accès à Pro, à afficher
            votre abonnement sur votre tableau de bord et à traiter les résiliations et les
            remboursements.
          </p>
          <p className="mt-2">
            <strong>Informations techniques.</strong> Nos serveurs et notre hébergeur
            enregistrent automatiquement des données techniques courantes, comme l&apos;adresse
            IP et l&apos;heure des requêtes. Elles servent à la sécurité, à la prévention des abus
            (par exemple pour limiter les tentatives de connexion et d&apos;inscription) et au
            diagnostic des problèmes.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Comment nous utilisons ces informations</h2>
          <p className="mt-2">
            Nous utilisons ces informations pour : créer votre compte et vous authentifier ;
            faire fonctionner les leçons, les fiches et les jeux que vous et votre enfant
            utilisez ; afficher les progrès dans le tableau de bord parent ; gérer les
            abonnements ; assurer la sécurité du service et prévenir les abus ; et vous
            contacter au sujet de votre compte (par exemple pour la facturation ou la
            sécurité).
          </p>
          <p className="mt-2">
            Une fois notre demande Google AdSense acceptée, nous prévoyons aussi d&apos;utiliser
            des informations de navigation limitées, sans lien avec votre compte, pour afficher
            de la publicité, comme décrit dans la section sur les cookies ci-dessous.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Cookies et technologies similaires</h2>
          <p className="mt-2">
            <strong>Cookies indispensables.</strong> Un cookie de session vous permet de rester
            connecté en toute sécurité. Il est nécessaire au fonctionnement du site et ne peut
            pas être désactivé.
          </p>
          <p className="mt-2">
            <strong>Préférence de langue.</strong> Si vous choisissez une langue avec les
            boutons EN / FR, ce choix est enregistré dans un cookie pendant un an.
          </p>
          <p className="mt-2">
            <strong>Cookies de mesure d&apos;audience.</strong> Avec votre accord, nous pouvons
            utiliser des outils de mesure d&apos;audience (comme Google Analytics) pour
            comprendre comment le site est utilisé, afin d&apos;améliorer les leçons et de
            corriger les problèmes. Ils ne sont déposés qu&apos;après votre consentement.
          </p>
          <p className="mt-2">
            <strong>Cookies publicitaires.</strong> AlphaBes prévoit d&apos;afficher de la
            publicité via Google AdSense une fois sa demande acceptée. Google et ses partenaires
            pourront alors déposer des cookies pour diffuser des annonces. Vous pouvez en savoir
            plus et refuser la publicité personnalisée sur{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites?hl=fr"
              className="font-bold text-crayon-blue"
            >
              policies.google.com/technologies/partner-sites
            </a>{" "}
            et dans les{" "}
            <a href="https://adssettings.google.com/?hl=fr" className="font-bold text-crayon-blue">
              paramètres des annonces Google
            </a>
            . Comme ce site s&apos;adresse en partie à des enfants, nous prévoyons de configurer
            AdSense pour n&apos;afficher que des annonces contextuelles, non personnalisées, comme
            l&apos;exigent les règles de Google pour les contenus destinés aux enfants.
          </p>
          <p className="mt-2">
            Pour plus de détails, consultez notre{" "}
            <Link href="/cookies" className="font-bold text-crayon-blue">
              politique de cookies
            </Link>
            . Vous pouvez aussi contrôler ou supprimer les cookies à tout moment dans les
            réglages de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Les prestataires que nous utilisons</h2>
          <p className="mt-2">
            Nous faisons appel aux catégories de prestataires suivantes, chacun soumis à sa
            propre politique de confidentialité :
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>
              <strong>Hébergement de la base de données</strong> : notre base de données
              Postgres (Neon), où sont stockés les comptes, les profils enfants et les progrès.
            </li>
            <li>
              <strong>Hébergement du site</strong> : Cloudflare, qui sert le site et traite les
              requêtes.
            </li>
            <li>
              <strong>Authentification</strong> : NextAuth, pour gérer les sessions de connexion
              sécurisées.
            </li>
            <li>
              <strong>Paiement</strong> : PayPal (voir « Abonnement et paiement » ci-dessus),
              uniquement pour les parents qui souscrivent à AlphaBes Pro.
            </li>
            <li>
              <strong>Envoi d&apos;e-mails</strong> : Resend, qui envoie nos e-mails : le message de
              bienvenue au début d&apos;un abonnement Pro, les rappels avant le renouvellement
              d&apos;un abonnement annuel, et les messages envoyés depuis
              notre page de contact, qui nous parviennent par e-mail pour que nous puissions
              répondre.
            </li>
            <li>
              <strong>Publicité</strong> : Google AdSense, une fois notre demande acceptée.
            </li>
            <li>
              <strong>Mesure d&apos;audience</strong> : un outil comme Google Analytics,
              uniquement si vous acceptez les cookies de mesure d&apos;audience.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">La vie privée des enfants</h2>
          <p className="mt-2">
            AlphaBes s&apos;adresse en partie à des enfants de moins de 13 ans. Nous prenons donc
            un soin particulier de leurs données, conformément au RGPD en Europe, à la loi
            marocaine 09-08 relative à la protection des données personnelles et aux règles
            équivalentes dans les autres pays.
          </p>
          <p className="mt-2">
            Seul un parent, un tuteur ou un enseignant peut créer un compte AlphaBes, en
            confirmant qu&apos;il est majeur : un enfant ne peut pas créer son propre compte. La
            création d&apos;un profil enfant dans le compte du parent vaut consentement du parent
            à l&apos;utilisation du service par l&apos;enfant.
          </p>
          <p className="mt-2">
            Pour un profil enfant, nous ne collectons qu&apos;un prénom et une tranche
            d&apos;âge : jamais d&apos;adresse e-mail, de localisation précise, de photo ni
            aucune autre coordonnée directement auprès de l&apos;enfant. Les enfants ne peuvent ni
            créer de compte, ni communiquer avec d&apos;autres utilisateurs, ni faire
            d&apos;achat.
          </p>
          <p className="mt-2">
            Un parent ou un tuteur peut à tout moment consulter, corriger ou demander la
            suppression du profil de son enfant (voir « Vos droits » ci-dessous).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Durée de conservation</h2>
          <p className="mt-2">
            Nous conservons les informations du compte et des profils enfants tant que votre
            compte est actif, pour que les leçons et les progrès restent disponibles. Si vous
            supprimez votre compte, nous supprimons ou anonymisons ces données dans un délai
            raisonnable, sauf les éléments limités que nous devons garder pour respecter nos
            obligations légales, fiscales ou de sécurité (par exemple les données de
            facturation de base).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Vos droits</h2>
          <p className="mt-2">
            Selon votre pays de résidence, vous pouvez disposer d&apos;un droit d&apos;accès, de
            rectification, de portabilité et d&apos;effacement de vos données et de celles du
            profil de votre enfant, ainsi que du droit de retirer à tout moment votre
            consentement aux cookies facultatifs. Vous pouvez :
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Consulter et modifier les informations de votre compte dans ses réglages.</li>
            <li>Demander une copie de vos données, ou la suppression de votre compte et des profils enfants, en nous contactant (voir ci-dessous).</li>
            <li>Gérer ou retirer votre consentement aux cookies dans les réglages de votre navigateur et, lorsqu&apos;ils sont proposés, avec nos outils de gestion des cookies.</li>
          </ul>
          <p className="mt-2">
            Nous répondons aux demandes vérifiées dans un délai raisonnable. Vous pouvez aussi
            introduire une réclamation auprès de l&apos;autorité de protection des données de
            votre pays (la CNIL en France, la CNDP au Maroc).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Sécurité des données</h2>
          <p className="mt-2">
            Nous utilisons des mesures de sécurité reconnues pour protéger vos informations,
            notamment des connexions chiffrées et un chiffrement sécurisé des mots de passe.
            Aucune méthode de stockage ou de transmission n&apos;est parfaitement sûre, mais nous
            veillons à protéger vos informations de façon adaptée aux données que nous
            détenons.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Modifications de cette politique</h2>
          <p className="mt-2">
            Cette politique peut évoluer avec AlphaBes, par exemple lorsque notre demande
            AdSense sera acceptée. Nous mettrons
            alors à jour la date de « dernière mise à jour » ci-dessus ; nous vous invitons à
            consulter cette page de temps en temps.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Nous contacter</h2>
          <p className="mt-2">
            Pour toute question sur cette politique ou toute demande concernant vos données,
            écrivez-nous depuis notre{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              page de contact
            </Link>
            .
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texte provisoire : comme AlphaBes s&apos;adresse à des enfants et traite des paiements,
        cette page doit être relue par un juriste connaissant le RGPD, les recommandations de
        la CNIL sur les mineurs et la loi marocaine 09-08 (CNDP), ainsi que les règles de
        Google AdSense pour les contenus destinés aux enfants, avant le lancement.
      </p>
    </main>
  );
}
