import type { Metadata } from "next";
import OwlHome, { type HomeCopy } from "@/components/home/OwlHome";
import { Link } from "@/i18n/navigation";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { alternatesFor } from "@/lib/i18n/routes";
import { FicheCard } from "@/components/fiches/FicheParts";
import { getFiche } from "@/lib/fiches-fr";
import { frenchGames } from "@/lib/games-fr";
import { frenchLetters, isAccentLetter } from "@/lib/letters-fr";
import { IconTile } from "@/components/UiIcon";

const title = "Apprendre l'alphabet : fiches et jeux gratuits | AlphaBes";
const description =
  "Fiches gratuites à imprimer, tracé des lettres, sons et syllabes pour la maternelle et le CP. Des leçons et des jeux interactifs pour les enfants de 3 à 8 ans.";

export const homeMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/"),
  openGraph: { title, description, url: "https://alphabes.com/fr", locale: "fr_FR" },
};

const letters = getAllLetterSlugs();

const blockColors = [
  "text-owl-purple",
  "text-[#C2185B]",
  "text-owl-green-dark",
  "text-[#B9520E]",
  "text-owl-ink",
];

const faq = [
  {
    question: "À quel âge s'adresse AlphaBes ?",
    answer:
      "AlphaBes s'adresse aux enfants de 3 à 8 ans, de la petite section de maternelle jusqu'au CE1 : de la reconnaissance des lettres jusqu'aux premiers sons et aux premières syllabes.",
  },
  {
    question: "AlphaBes est-il gratuit ?",
    answer:
      "Oui. La formule gratuite comprend les premières leçons sur l'alphabet, une sélection de fiches et quelques jeux. La formule Pro donne accès à tout le contenu.",
  },
  {
    question: "Faut-il imprimer les fiches en couleur ?",
    answer:
      "Non. Toutes les fiches s'impriment très bien en noir et blanc, sur l'imprimante de la maison comme sur la photocopieuse de l'école.",
  },
  {
    question: "Pourquoi apprendre les syllabes ?",
    answer:
      "En français, on apprend à lire en assemblant une consonne et une voyelle : m et a font « ma ». Ces syllabes simples (ma, pa, li, to…) sont les premiers morceaux de mots qu'un enfant sait lire, une fois les sons des lettres bien connus.",
  },
];

// Les textes du design « Owl Quiz » (components/home/OwlHome.tsx).
const copy: HomeCopy = {
  nav: { games: "Jeux", worksheets: "Fiches", stories: "Histoires", parents: "Parents", join: "Inscription gratuite" },
  headline: { seo: "Apprendre l'alphabet : fiches et jeux gratuits", line1: "Petits curieux,", big: "grand", after: "." },
  intro:
    "Notre petit hibou accompagne les enfants de 3 à 8 ans dans les lettres, les sons et les premiers mots, une question ludique à la fois.",
  play: "Jouer gratuitement",
  howItWorks: "Voir comment ça marche",
  speaks: "Parle",
  quiz: {
    label: "Le quiz du hibou",
    question: "Quelle image commence par",
    roundLabel: "Question {n} sur {total}",
    allDone: "Terminé",
    stars: "Étoiles : {score}",
    hearLetter: "Écouter la lettre {letter}",
    hint: "Touche la lettre pour l'entendre, puis choisis une image.",
    right: "Oui ! {word} commence par {letter}.",
    next: "Suivant",
    wrong: "Presque ! Écoute encore et essaie une autre image.",
    tryAgainSpoken: "Essaie encore",
    finalTitle: "Hou hou ! Tu es une star des lettres.",
    playAgain: "Rejouer",
  },
  features: {
    title: "Tout ce qu'il faut aux petits lecteurs",
    intro: "Des jeux sur l'écran, des fiches sur papier, des histoires le soir.",
    letters: ["Lettres et sons", "Le nom et le son de chaque lettre, dits bien clairement."],
    tracing: ["Le tracé", "Tracer chaque lettre du bout du doigt, trait après trait."],
    worksheets: ["Les fiches", "Des fiches de tracé, de coloriage et de chiffres à imprimer."],
    stories: ["Les histoires", "De courtes histoires illustrées à lire ensemble."],
  },
  path: {
    title: "Un chemin clair, de A à Z",
    steps: [
      ["Découvrir la lettre", "Son nom, son son et un mot en image."],
      ["Jouer à un petit jeu", "Des questions pour vérifier que c'est acquis."],
      ["Tracer et imprimer", "S'entraîner à écrire, à l'écran et sur papier."],
      ["Lire une histoire", "Utiliser les lettres qu'on vient d'apprendre."],
    ],
  },
  parents: {
    title: "Pensé aussi pour les parents",
    text: "Un profil pour chaque enfant, des progrès visibles d'un coup d'œil et la prochaine fiche prête à imprimer.",
    cta: "Créer un compte gratuit",
  },
  footer: { ages: "© AlphaBes · De 3 à 8 ans", languages: "Langues", legal: "À propos d'AlphaBes" },
};

export default function HomeFr() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "fr",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <OwlHome locale="fr" copy={copy}>
      {/* Intro: the text of the former hero */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Apprendre l&apos;alphabet en s&apos;amusant</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Les lettres de A à Z, leurs sons et leur tracé, avec des fiches gratuites à
          imprimer, des syllabes à lire et des jeux interactifs, de la maternelle au CP.
        </p>
        <Link href="/worksheets" className="mt-6 owl-btn owl-btn-purple">
          Voir les fiches
        </Link>
      </section>

      {/* 1. L'alphabet */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Découvrir l&apos;alphabet</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Chaque lettre a sa propre leçon : la majuscule et la minuscule, son nom et le son
          qu&apos;elle fait, à écouter, et des mots d&apos;exemple choisis pour les petits.
        </p>
        <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
          {letters.map((l, i) => (
            <Link
              key={l}
              href={{ pathname: "/alphabet/[letter]", params: { letter: l } }}
              className={`owl-letter aspect-square text-3xl md:text-4xl ${blockColors[i % blockColors.length]}`}
              aria-label={`Leçon sur la lettre ${l.toUpperCase()}`}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-owl-muted">Et les lettres avec un accent, qui changent le son :</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {frenchLetters.filter(isAccentLetter).map((l) => (
            <Link
              key={l.slug}
              href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
              className="owl-letter text-owl-purple h-14 w-14 text-2xl"
              aria-label={`Leçon sur la lettre ${l.upper}`}
            >
              {l.upper}
            </Link>
          ))}
          <Link
            href={{ pathname: "/alphabet/[letter]", params: { letter: "accents" } }}
            className="self-center font-display font-bold text-owl-purple hover:underline"
          >
            Tous les accents →
          </Link>
        </div>
      </section>

      {/* 2. Les sons */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Apprendre les sons</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
            Pas à pas vers la lecture : les voyelles, les syllabes, puis les sons qui
            s&apos;écrivent avec plusieurs lettres, comme ou, on, an ou ch.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Les voyelles", skill: "voyelles" },
              { label: "La syllabe", skill: "syllabes" },
              { label: "Le son ou", skill: "ou" },
              { label: "Le son ch", skill: "ch" },
            ].map((item) => (
              <Link
                key={item.skill}
                href={{ pathname: "/phonics/[skill]", params: { skill: item.skill } }}
                className="owl-card"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Fiches gratuites */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Des fiches alphabet gratuites</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          AlphaBes propose plus de 230 fiches gratuites à imprimer pour toutes les lettres de
          l&apos;alphabet, accents compris : tracé, cursive, coloriage, reconnaissance des
          lettres, sons et syllabes. Elles sont pensées pour les parents, l&apos;instruction en
          famille et les enseignants de maternelle et de CP qui veulent une fiche prête à
          l&apos;emploi, sans préparation.
        </p>
        <h3 className="mt-8 font-display font-bold text-xl">Fiches populaires</h3>
        <ul className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["lettre-a-cursive", "lettre-b-son", "syllabes-m", "son-ou"].map((slug) => (
            <FicheCard key={slug} fiche={getFiche(slug)!} />
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/worksheets"
            className="owl-btn owl-btn-purple"
          >
            Parcourir les fiches
          </Link>
          <Link href="/worksheets/bundles" className="font-display font-bold text-owl-purple hover:underline">
            Les packs PDF →
          </Link>
        </div>
      </section>

      {/* 3b. Tracé et cursive */}
      <section className="bg-owl-mint">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Le tracé des lettres</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
            Pour chaque lettre, une fiche de tracé en script, en majuscule et en minuscule,
            avec des pointillés à suivre avant d&apos;écrire seul. Et pour aller plus loin, des
            fiches d&apos;écriture cursive sur lignes Seyès, comme dans le cahier de
            l&apos;école.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={{ pathname: "/worksheets/[category]", params: { category: "trace-des-lettres" } }}
              className="owl-btn owl-btn-ink"
            >
              Fiches de tracé
            </Link>
            <Link
              href={{ pathname: "/worksheets/[category]", params: { category: "ecriture-cursive" } }}
              className="owl-btn owl-btn-outline"
            >
              Fiches d&apos;écriture cursive
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Jeux */}
      <section className="bg-owl-cream">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Des jeux pour apprendre</h2>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 gap-4">
            {frenchGames.map((g) => (
              <Link
                key={g.slug}
                href={{ pathname: "/games/[slug]", params: { slug: g.slug } }}
                className="owl-card text-center"
              >
                <IconTile name={g.icon} className="mx-auto mb-2 h-12 w-12" />
                {g.title}
              </Link>
            ))}
          </div>
          <Link
            href="/games"
            className="mt-6 owl-btn owl-btn-ink"
          >
            Jouer
          </Link>
        </div>
      </section>

      {/* 4b. PDF */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Des fiches PDF prêtes à imprimer</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Chaque fiche est un PDF prêt à imprimer : on la regarde à l&apos;écran, puis on
          l&apos;imprime ou on la télécharge en un clic. Pas besoin de compte pour les fiches
          gratuites : l&apos;enseignant prépare les photocopies de la classe la veille au soir,
          le parent en imprime une juste avant de partir.
        </p>
      </section>

      {/* 4c. Maternelle */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Activités pour la maternelle</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
            En plus des fiches, AlphaBes propose des activités, un imagier et des jeux adaptés
            à l&apos;attention des petits, de la petite à la grande section.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 md:grid-cols-5 gap-4">
            <Link href="/preschool" className="owl-card">
              Petite et moyenne section
            </Link>
            <Link href="/kindergarten" className="owl-card">
              Grande section
            </Link>
            <Link href="/activities" className="owl-card">
              Activités
            </Link>
            <Link href="/flashcards" className="owl-card">
              Imagier
            </Link>
            <Link href="/worksheets" className="owl-card">
              Fiches de coloriage
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Espace parents */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Espace parents</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted">
            Suivez les progrès de votre enfant sur l&apos;alphabet, les sons et le vocabulaire,
            voyez les leçons terminées et découvrez l&apos;étape suivante conseillée.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 owl-btn owl-btn-purple"
          >
            Voir le tableau de bord
          </Link>
        </div>
        <div className="rounded-3xl bg-owl-ink text-white p-6">
          <p className="font-display font-bold text-lg">Cette semaine</p>
          <ul className="mt-3 space-y-2 text-[#C9C3EE] text-sm">
            <li>12 leçons terminées</li>
            <li>Alphabet : 18 lettres sur 26</li>
            <li>À suivre : la lettre S et son premier son</li>
          </ul>
        </div>
      </section>

      {/* 6. Pro */}
      <section className="bg-owl-ink text-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">AlphaBes Pro</h2>
          <p className="mt-3 text-lg text-[#C9C3EE] max-w-xl mx-auto">
            Débloquez toutes les fiches, tous les jeux et toutes les leçons de sons, avec le
            suivi des progrès et des packs de fiches à imprimer.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="rounded-3xl bg-white text-owl-ink p-6 w-64">
              <p className="font-display font-bold text-xl">Mensuel</p>
              <p className="mt-2 text-3xl font-extrabold">7,99 $<span className="text-base font-normal">/mois</span></p>
            </div>
            <div className="rounded-3xl bg-owl-sun text-owl-ink p-6 w-64">
              <p className="font-display font-bold text-xl">Annuel</p>
              <p className="mt-2 text-3xl font-extrabold">59 $<span className="text-base font-normal">/an</span></p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="mt-8 owl-btn owl-btn-sun"
          >
            Voir tous les tarifs
          </Link>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Questions fréquentes</h2>
        <dl className="mt-8 space-y-6">
          {faq.map((item) => (
            <div key={item.question}>
              <dt className="font-display font-bold text-lg">{item.question}</dt>
              <dd className="mt-1 leading-relaxed text-owl-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </OwlHome>
  );
}
