import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { alternatesFor } from "@/lib/i18n/routes";

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
  "bg-crayon-red",
  "bg-crayon-blue",
  "bg-crayon-yellow",
  "bg-crayon-green",
  "bg-crayon-purple",
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
    <main id="main-content">
      {/* Hero */}
      <section className="bg-chalkboard text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Apprendre l&apos;alphabet en s&apos;amusant
            </h1>
            <p className="mt-5 text-lg md:text-xl text-paper/80 max-w-md">
              Les lettres de A à Z, leurs sons et leur tracé, avec des fiches gratuites à
              imprimer, des syllabes à lire et des jeux interactifs, de la maternelle au CP.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/worksheets"
                className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition"
              >
                Voir les fiches
              </Link>
            </div>
          </div>

          {/* Signature element: shelf of wooden alphabet blocks */}
          <div
            className="grid grid-cols-6 gap-2 md:gap-3"
            role="img"
            aria-label="Étagère de cubes en bois, de A à Z"
          >
            {letters.map((l) => (
              <div key={l} className="letter-block aspect-square text-xl md:text-2xl">
                {l.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. L'alphabet */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Découvrir l&apos;alphabet</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Chaque lettre a sa propre leçon : la majuscule et la minuscule, son nom et le son
          qu&apos;elle fait, à écouter, et des mots d&apos;exemple choisis pour les petits.
        </p>
        <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
          {letters.map((l, i) => (
            <Link
              key={l}
              href={{ pathname: "/alphabet/[letter]", params: { letter: l } }}
              className={`letter-block aspect-square text-lg ${blockColors[i % blockColors.length]}`}
              aria-label={`Leçon sur la lettre ${l.toUpperCase()}`}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Les sons */}
      <section className="bg-crayon-blue/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Apprendre les sons</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Pas à pas vers la lecture : les voyelles, les syllabes, puis les sons qui
            s&apos;écrivent avec plusieurs lettres, comme ou, on, an ou ch.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["Les voyelles", "La syllabe", "Le son ou", "Le son ch"].map((item) => (
              <Link
                key={item}
                href="/phonics"
                className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Fiches gratuites */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Des fiches alphabet gratuites</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          AlphaBes propose plus de 300 fiches gratuites à imprimer pour toutes les lettres de
          l&apos;alphabet, accents compris : tracé, coloriage, écriture, reconnaissance des
          lettres et premiers sons. Elles sont pensées pour les parents, l&apos;instruction en
          famille et les enseignants de maternelle et de CP qui veulent une fiche prête à
          l&apos;emploi, sans préparation.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/worksheets"
            className="inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
          >
            Parcourir les fiches
          </Link>
        </div>
      </section>

      {/* 3b. Tracé et cursive */}
      <section className="bg-crayon-green/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Le tracé des lettres</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Pour chaque lettre, une fiche de tracé en script, en majuscule et en minuscule,
            avec des pointillés à suivre avant d&apos;écrire seul. Et pour aller plus loin, des
            fiches d&apos;écriture cursive sur lignes Seyès, comme dans le cahier de
            l&apos;école.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/worksheets"
              className="inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
            >
              Fiches de tracé et de cursive
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Jeux */}
      <section className="bg-crayon-yellow/15">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Des jeux pour apprendre</h2>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[
              "Trouve la lettre",
              "Associe la lettre et l'image",
              "Le premier son",
              "Trace la lettre",
              "Quiz de l'alphabet",
            ].map((name) => (
              <div
                key={name}
                className="rounded-block bg-paper p-5 shadow-block font-display font-bold text-center"
              >
                {name}
              </div>
            ))}
          </div>
          <Link
            href="/games"
            className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
          >
            Jouer
          </Link>
        </div>
      </section>

      {/* 4b. PDF */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Des fiches PDF prêtes à imprimer</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Chaque fiche est un PDF prêt à imprimer : on la regarde à l&apos;écran, puis on
          l&apos;imprime ou on la télécharge en un clic. Pas besoin de compte pour les fiches
          gratuites : l&apos;enseignant prépare les photocopies de la classe la veille au soir,
          le parent en imprime une juste avant de partir.
        </p>
      </section>

      {/* 4c. Maternelle */}
      <section className="bg-crayon-purple/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Activités pour la maternelle</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            En plus des fiches, AlphaBes propose des activités, un imagier et des jeux adaptés
            à l&apos;attention des petits, de la petite à la grande section.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 md:grid-cols-5 gap-4">
            <Link href="/preschool" className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold">
              Petite et moyenne section
            </Link>
            <Link href="/kindergarten" className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold">
              Grande section
            </Link>
            <Link href="/activities" className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold">
              Activités
            </Link>
            <Link href="/flashcards" className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold">
              Imagier
            </Link>
            <Link href="/worksheets" className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold">
              Fiches de coloriage
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Espace parents */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold">Espace parents</h2>
          <p className="mt-2 text-chalkboard/70">
            Suivez les progrès de votre enfant sur l&apos;alphabet, les sons et le vocabulaire,
            voyez les leçons terminées et découvrez l&apos;étape suivante conseillée.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
          >
            Voir le tableau de bord
          </Link>
        </div>
        <div className="rounded-block bg-chalkboard text-paper p-6 shadow-block">
          <p className="font-display font-bold text-lg">Cette semaine</p>
          <ul className="mt-3 space-y-2 text-paper/80 text-sm">
            <li>12 leçons terminées</li>
            <li>Alphabet : 18 lettres sur 26</li>
            <li>À suivre : la lettre S et son premier son</li>
          </ul>
        </div>
      </section>

      {/* 6. Pro */}
      <section className="bg-chalkboard text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">AlphaBes Pro</h2>
          <p className="mt-2 text-paper/70 max-w-xl mx-auto">
            Débloquez toutes les fiches, tous les jeux et toutes les leçons de sons, avec le
            suivi des progrès et des packs de fiches à imprimer.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="rounded-block bg-paper text-chalkboard p-6 w-64 shadow-block">
              <p className="font-display font-bold text-xl">Mensuel</p>
              <p className="mt-2 text-3xl font-extrabold">7,99 $<span className="text-base font-normal">/mois</span></p>
            </div>
            <div className="rounded-block bg-crayon-yellow text-chalkboard p-6 w-64 shadow-block">
              <p className="font-display font-bold text-xl">Annuel</p>
              <p className="mt-2 text-3xl font-extrabold">59 $<span className="text-base font-normal">/an</span></p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="mt-8 inline-block rounded-block bg-crayon-green px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
          >
            Voir tous les tarifs
          </Link>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-3xl font-bold">Questions fréquentes</h2>
        <dl className="mt-8 space-y-6">
          {faq.map((item) => (
            <div key={item.question}>
              <dt className="font-display font-bold text-lg">{item.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
