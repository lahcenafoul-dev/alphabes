import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { SOUND_GROUPS, frenchSounds } from "@/lib/sons-fr";

const title = "Les sons du français : apprendre à lire en maternelle et au CP";
const description =
  "Les voyelles, la syllabe, puis les sons ou, on, an, in, oi, ch… Des pages à écouter, avec des mots illustrés, une phrase à lire et un petit jeu, pour apprendre à lire pas à pas.";

export const phonicsMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/phonics"),
  openGraph: { title, description, url: absoluteUrl("fr", "/phonics") },
};

const steps = [
  { n: 1, title: "Entendre les sons", blurb: "Trouver le son qu'on entend au début d'un mot, à l'oral.", slug: "premier-son" },
  { n: 2, title: "Connaître les lettres", blurb: "Le nom et le son de chaque lettre, de A à Z.", href: "/alphabet" as const },
  { n: 3, title: "Lire des syllabes", blurb: "Coller une consonne et une voyelle : m et a, ma.", slug: "syllabes" },
  { n: 4, title: "Les sons à plusieurs lettres", blurb: "ou, on, an, ch… deux lettres pour un seul son.", slug: "ou" },
  { n: 5, title: "Lire des phrases", blurb: "Avec les mots-outils, on lit d'une traite.", slug: "mots-outils" },
];

const faq = [
  {
    question: "Dans quel ordre apprendre les sons ?",
    answer:
      "Chaque méthode de lecture a son ordre, mais on commence toujours par les voyelles et les syllabes simples (ma, li, to), puis on découvre les sons à deux lettres, en général en commençant par ou, on, ch et an. Suivez l'ordre de la classe de votre enfant si vous le connaissez.",
  },
  {
    question: "À quel âge apprendre les sons ?",
    answer:
      "L'écoute des sons commence en moyenne et grande section (4 à 6 ans). La lecture des syllabes et des sons à plusieurs lettres se fait surtout au CP, vers 6 ans.",
  },
  {
    question: "Pourquoi ne pas simplement apprendre les mots par cœur ?",
    answer:
      "Parce qu'un enfant qui sait assembler les sons peut lire n'importe quel mot, même un mot qu'il n'a jamais vu. Seuls quelques petits mots très fréquents, les mots-outils, s'apprennent aussi par cœur.",
  },
  {
    question: "Comment faire lire les sons à la maison ?",
    answer:
      "Dix minutes par jour suffisent. Revoyez le son de la semaine avec une page de ce site : écoutez les mots, lisez la phrase, jouez au petit jeu. Puis cherchez le son dans un livre ou sur les affiches dans la rue.",
  },
];

export default function PhonicsFr() {
  const url = absoluteUrl("fr", "/phonics");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Les sons", url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Les sons du français",
    description,
    url,
    inLanguage: "fr",
    educationalLevel: "Maternelle et CP",
    learningResourceType: "Lesson",
    teaches: "Les voyelles, la syllabe et les sons du français (ou, on, an, in, oi, ch…)",
    typicalAgeRange: "4-7",
    isAccessibleForFree: true,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li aria-current="page" className="font-bold">Les sons</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Les sons du français : apprendre à lire pas à pas
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          En français, on apprend à lire en assemblant les sons : les voyelles, puis les syllabes,
          puis les sons qui s&apos;écrivent avec plusieurs lettres, comme ou, on ou ch. Chaque page se
          lit à voix haute, avec des mots illustrés, une phrase à lire et un petit jeu d&apos;écoute.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href={{ pathname: "/phonics/[skill]", params: { skill: "voyelles" } }}
            className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Commencer par les voyelles
          </Link>
          <Link
            href={{ pathname: "/phonics/[skill]", params: { skill: "syllabes" } }}
            className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
          >
            Fabriquer des syllabes
          </Link>
        </div>
      </header>

      <section className="mt-16" aria-labelledby="path-heading">
        <h2 id="path-heading" className="text-3xl font-bold">
          Le chemin de la lecture
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Les étapes se suivent à peu près dans cet ordre, de la moyenne section au CP. Chaque
          enfant avance à son rythme.
        </p>
        <ol className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {steps.map((step) => (
            <li key={step.n}>
              <Link
                href={step.href ?? { pathname: "/phonics/[skill]", params: { skill: step.slug! } }}
                className="block h-full rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors"
              >
                <span className="letter-block bg-crayon-purple flex h-10 w-10 items-center justify-center text-base" aria-hidden="true">
                  {step.n}
                </span>
                <p className="mt-3 font-display font-bold text-sm">{step.title}</p>
                <p className="mt-1 text-xs text-chalkboard/70">{step.blurb}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {SOUND_GROUPS.map((group) => (
        <section key={group.id} className="mt-16" aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`} className="text-3xl font-bold">
            {group.title}
          </h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">{group.blurb}</p>
          <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {frenchSounds
              .filter((s) => s.group === group.id)
              .map((s) => (
                <li key={s.slug}>
                  <Link
                    href={{ pathname: "/phonics/[skill]", params: { skill: s.slug } }}
                    className="flex h-full gap-4 rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors"
                  >
                    <span
                      className="letter-block bg-crayon-blue h-14 min-w-14 px-2 text-2xl shrink-0"
                      aria-hidden="true"
                    >
                      {s.short}
                    </span>
                    <span>
                      <span className="block font-display font-bold">{s.title}</span>
                      <span className="mt-1 block text-sm text-chalkboard/70">{s.summary}</span>
                      <span className="mt-2 inline-block rounded-full bg-crayon-yellow/25 px-2 py-0.5 text-xs font-bold">
                        {s.level}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="text-3xl font-bold">
          Conseils pour les parents
        </h2>
        <ol className="mt-6 space-y-3 list-decimal list-inside text-chalkboard/80 max-w-3xl">
          <li>Un son à la fois : restez plusieurs jours sur le même avant de passer au suivant.</li>
          <li>Dites le son, pas le nom de la lettre : « mmm » et pas « emme ».</li>
          <li>Faites taper les syllabes dans les mains : to-ma-te, trois tapes.</li>
          <li>Revenez souvent sur les sons déjà vus, surtout ceux qui se ressemblent (ou et u, on et an).</li>
          <li>Gardez des séances courtes et joyeuses : dix minutes, c&apos;est très bien.</li>
          <li>
            Si le nom ou le son d&apos;une lettre hésite encore, revoyez-la sur sa page de{" "}
            <Link href="/alphabet" className="font-bold underline">
              l&apos;alphabet
            </Link>
            .
          </li>
        </ol>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">
          Questions fréquentes
        </h2>
        <dl className="mt-6 space-y-6">
          {faq.map((f) => (
            <div key={f.question}>
              <dt className="font-display font-bold text-lg">{f.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 bg-chalkboard text-paper rounded-block p-10 text-center">
        <h2 className="text-3xl font-bold">Prêt à lire ?</h2>
        <p className="mt-2 text-paper/70 max-w-xl mx-auto">
          Commencez par les voyelles, ou revoyez d&apos;abord les lettres de l&apos;alphabet.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href={{ pathname: "/phonics/[skill]", params: { skill: "voyelles" } }}
            className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Les voyelles
          </Link>
          <Link
            href="/alphabet"
            className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition-colors"
          >
            L&apos;alphabet
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
