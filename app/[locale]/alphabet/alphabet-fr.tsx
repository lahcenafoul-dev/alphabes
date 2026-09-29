import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { ACCENTS_SLUG, frenchLetters, isAccentLetter } from "@/lib/letters-fr";

const title = "L'alphabet de A à Z : lettres, sons et mots pour enfants";
const description =
  "Apprendre l'alphabet français de A à Z : le nom et le son de chaque lettre, des mots illustrés à écouter, les accents (é, è, ê, ç) et des fiches de tracé en script et en cursive.";

export const alphabetMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/alphabet"),
  openGraph: { title, description, url: absoluteUrl("fr", "/alphabet") },
};

const blockColors = ["bg-crayon-red", "bg-crayon-blue", "bg-crayon-green", "bg-crayon-yellow", "bg-crayon-purple"];

const cardClass =
  "group block h-full rounded-block border-2 border-chalkboard/10 bg-paper p-4 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

const faqItems = [
  {
    question: "Faut-il apprendre le nom ou le son des lettres ?",
    answer:
      "Les deux, mais pas en même temps au début. En maternelle, l'enfant apprend surtout à reconnaître les lettres et à dire leur nom. Le son vient ensuite, et c'est lui qui permet de lire : pour lire « ba », il faut savoir que B fait [b], et non « bé ».",
  },
  {
    question: "À quel âge apprendre l'alphabet ?",
    answer:
      "Vers 3 ou 4 ans, beaucoup d'enfants reconnaissent les lettres de leur prénom. En moyenne et grande section (4 à 6 ans), ils apprennent l'ensemble de l'alphabet et le lien entre les lettres et les sons. La lecture proprement dite commence au CP.",
  },
  {
    question: "Dans quel ordre apprendre les lettres ?",
    answer:
      "Il n'est pas nécessaire de suivre l'ordre de l'alphabet. On commence souvent par les lettres du prénom, puis par les voyelles et des consonnes qui se prononcent facilement, comme L, M, S ou F, dont le son se tient longtemps. La comptine de l'alphabet reste utile pour retenir l'ordre.",
  },
  {
    question: "Script, cursive, capitales : par quoi commencer ?",
    answer:
      "En petite et moyenne section, les enfants écrivent d'abord en capitales d'imprimerie, plus simples à tracer. Ils reconnaissent le script dans les livres, et apprennent la cursive, l'écriture attachée, à partir de la grande section.",
  },
  {
    question: "Combien de lettres compte l'alphabet français ?",
    answer:
      "26 lettres, dont 6 voyelles (a, e, i, o, u, y) et 20 consonnes. Les accents ne créent pas de nouvelles lettres, mais é, è, ê et ç changent le son : c'est pourquoi ils ont chacun leur leçon ici.",
  },
];

export default function AlphabetFr() {
  const url = absoluteUrl("fr", "/alphabet");
  const letters = frenchLetters.filter((l) => !isAccentLetter(l));
  const accentLetters = frenchLetters.filter(isAccentLetter);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Alphabet", url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "L'alphabet de A à Z",
    description,
    url,
    inLanguage: "fr",
    educationalLevel: "Maternelle",
    learningResourceType: "Lesson",
    teaches: "Reconnaître les lettres, leur nom et leur son, les accents et le tracé des lettres",
    typicalAgeRange: "3-6",
    isAccessibleForFree: true,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li aria-current="page" className="font-bold">Alphabet</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          L&apos;alphabet de A à Z : les lettres, leurs sons et des mots à écouter
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          Une leçon pour chaque lettre : sa capitale, sa minuscule et sa forme en cursive, son nom et
          le son qu&apos;elle fait, des mots illustrés à écouter et une fiche de tracé. Pour les
          enfants de 3 à 6 ans, de la petite section à la grande section.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href={{ pathname: "/alphabet/[letter]", params: { letter: "a" } }}
            className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Commencer par la lettre A
          </Link>
          <Link
            href="/flashcards"
            className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
          >
            Ouvrir l&apos;imagier
          </Link>
        </div>
      </header>

      <section className="mt-16" aria-labelledby="az-heading">
        <h2 id="az-heading" className="text-3xl font-bold">Les 26 lettres</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Touchez une lettre pour ouvrir sa leçon. Le petit mot sous chaque lettre donne son nom,
          tel qu&apos;on le dit en français.
        </p>
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {letters.map((l, i) => {
            const [w1, w2] = l.words;
            return (
              <li key={l.slug}>
                <Link
                  href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
                  aria-label={`La lettre ${l.upper} : ${l.upper} comme ${w1.word} et ${w2.word}`}
                  className={cardClass}
                >
                  <span
                    className={`letter-block ${blockColors[i % blockColors.length]} mx-auto flex aspect-square w-16 items-center justify-center text-2xl`}
                    aria-hidden="true"
                  >
                    {l.upper}{l.lower}
                  </span>
                  <span className="mt-1 block text-xs text-chalkboard/60">« {l.name} »</span>
                  <span className="mt-2 block text-2xl" aria-hidden="true">
                    {w1.emoji}
                  </span>
                  <span className="mt-2 block font-display font-bold text-sm">
                    {l.upper} comme {w1.word}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-16 bg-crayon-purple/10 rounded-block p-8" aria-labelledby="accents-heading">
        <h2 id="accents-heading" className="text-3xl font-bold">Les lettres avec accent</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          En français, un accent peut changer le son d&apos;une lettre : é ne se lit pas comme e,
          et ç ne se lit pas comme c devant a, o et u. Ces quatre lettres ont donc leur propre leçon.
        </p>
        <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {accentLetters.map((l) => (
            <li key={l.slug}>
              <Link
                href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
                aria-label={`La lettre ${l.upper}, ${l.name} : ${l.upper} comme ${l.words[0].word}`}
                className={cardClass}
              >
                <span className="letter-block bg-crayon-purple mx-auto flex aspect-square w-16 items-center justify-center text-2xl" aria-hidden="true">
                  {l.upper}{l.lower}
                </span>
                <span className="mt-2 block text-2xl" aria-hidden="true">{l.words[0].emoji}</span>
                <span className="mt-2 block font-display font-bold text-sm">{l.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href={{ pathname: "/alphabet/[letter]", params: { letter: ACCENTS_SLUG } }} className={cardClass}>
              <span className="letter-block bg-paper mx-auto flex aspect-square w-16 items-center justify-center text-xl" aria-hidden="true">
                à ô
              </span>
              <span className="mt-2 block text-2xl" aria-hidden="true">🏰</span>
              <span className="mt-2 block font-display font-bold text-sm">Tous les accents</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="name-sound-heading">
        <h2 id="name-sound-heading" className="text-3xl font-bold">Le nom et le son d&apos;une lettre</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <p className="text-chalkboard/80">
            Chaque lettre a un <strong>nom</strong> (B se dit « bé ») et fait un <strong>son</strong>{" "}
            ([b], celui qu&apos;on entend au début de ballon). Pour lire, c&apos;est le son qui compte :
            B et A ensemble se lisent « ba », pas « bé-a ». Sur chaque page, deux boutons font
            entendre le nom et le son de la lettre.
          </p>
          <p className="text-chalkboard/80">
            Certaines lettres ont plusieurs sons : le C de canard et celui de citron, le G de gâteau
            et celui de girafe. D&apos;autres ne font aucun bruit, comme le H de hibou. Les voyelles
            sont a, e, i, o, u et y ; les 20 autres lettres sont des consonnes.
          </p>
        </div>
      </section>

      <section className="mt-16 bg-crayon-green/10 rounded-block p-8" aria-labelledby="writing-heading">
        <h2 id="writing-heading" className="text-3xl font-bold">Capitales, script et cursive</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          À l&apos;école, les enfants rencontrent trois écritures : les capitales d&apos;imprimerie
          (les premières qu&apos;ils tracent), le script des livres, et la cursive, l&apos;écriture
          attachée qu&apos;ils apprennent à partir de la grande section. Chaque lettre a une fiche de
          tracé à l&apos;écran, en script ou en cursive, et une fiche PDF à imprimer.
        </p>
        <Link
          href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: "a" } }}
          className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Essayer avec la lettre A
        </Link>
      </section>

      <section className="mt-16" aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-3xl font-bold">Aider son enfant à apprendre les lettres</h2>
        <ol className="mt-6 space-y-3 list-decimal list-inside text-chalkboard/80">
          <li>Commencez par les lettres de son prénom : ce sont celles qu&apos;il a le plus envie de connaître.</li>
          <li>Quelques lettres à la fois suffisent. Cinq minutes par jour valent mieux qu&apos;une longue séance.</li>
          <li>Dites le son de la lettre en montrant un mot qui commence par ce son : S comme soleil, ssss.</li>
          <li>Cherchez les lettres partout : sur les panneaux, les paquets, les livres du soir.</li>
          <li>Faites tracer la lettre avec le doigt, dans le sable, en pâte à modeler, puis au crayon.</li>
          <li>
            Revenez souvent aux lettres déjà vues, par exemple en feuilletant{" "}
            <Link href="/flashcards" className="font-bold underline">l&apos;imagier</Link> ensemble.
          </li>
        </ol>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">Questions fréquentes sur l&apos;alphabet</h2>
        <dl className="mt-6 space-y-6">
          {faqItems.map((item) => (
            <div key={item.question}>
              <dt className="font-display font-bold text-lg">{item.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 bg-chalkboard text-paper rounded-block p-10 text-center">
        <h2 className="text-3xl font-bold">Prêts à commencer ?</h2>
        <p className="mt-2 text-paper/70 max-w-xl mx-auto">
          Choisissez une lettre, ou feuilletez l&apos;imagier pour découvrir tous les mots.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href={{ pathname: "/alphabet/[letter]", params: { letter: "a" } }}
            className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Commencer par le A
          </Link>
          <Link
            href="/flashcards"
            className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition-colors"
          >
            L&apos;imagier
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
