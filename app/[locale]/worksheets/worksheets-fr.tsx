import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FichePreview } from "@/components/fiches/FicheParts";
import { FICHE_CATEGORIES, fiches, fichesInCategory, getFiche } from "@/lib/fiches-fr";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { frenchLetters } from "@/lib/letters-fr";

const title = "Fiches gratuites à imprimer : alphabet, écriture cursive et sons";
const description = `${fiches.length} fiches gratuites en PDF pour la maternelle et le CP : tracé des lettres, écriture cursive sur lignes Seyès, reconnaissance, sons, syllabes, nombres, formes et couleurs.`;

export const worksheetsMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/worksheets"),
  openGraph: { title, description, url: absoluteUrl("fr", "/worksheets") },
};

const faq = [
  {
    question: "Les fiches sont-elles vraiment gratuites ?",
    answer: "Oui. Toutes les fiches et tous les packs de cette page se téléchargent et s'impriment gratuitement, sans créer de compte.",
  },
  {
    question: "Quel format d'impression ?",
    answer:
      "Chaque fiche est un PDF au format A4, prêt à imprimer en noir et blanc. Imprimez à 100 % (taille réelle) pour que les lignes Seyès gardent leurs vraies dimensions.",
  },
  {
    question: "Quelle écriture cursive utilisez-vous ?",
    answer:
      "Une cursive scolaire française, avec les boucles et les liaisons apprises à l'école, posée sur de grands carreaux Seyès : les petites lettres occupent un interligne, les lettres à boucle en montent trois.",
  },
  {
    question: "Pour quel âge ?",
    answer:
      "De la petite section au CP (3 à 7 ans). Le niveau conseillé est indiqué sur chaque fiche : coloriage et formes pour les plus petits, cursive, syllabes et sons pour la grande section et le CP.",
  },
];

function CategoryCard({ slug }: { slug: string }) {
  const c = FICHE_CATEGORIES.find((x) => x.slug === slug)!;
  const sample = fichesInCategory(slug)[0];
  const count = fichesInCategory(slug).length;
  return (
    <li>
      <Link
        href={{ pathname: "/worksheets/[category]", params: { category: c.slug } }}
        className="flex h-full gap-4 rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
      >
        <div className="w-24 shrink-0">
          <FichePreview fiche={sample} />
        </div>
        <div>
          <p className="font-display font-bold text-lg">{c.name}</p>
          <p className="mt-1 text-sm text-chalkboard/70">{c.description}</p>
          <p className="mt-2 text-xs font-bold text-chalkboard/60">
            {count} fiches · {c.level}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default function WorksheetsFr() {
  const url = absoluteUrl("fr", "/worksheets");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Fiches", url },
  ]);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  const hero = getFiche("lettre-a-cursive")!;

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li aria-current="page" className="font-bold">Fiches</li>
        </ol>
      </nav>

      <header className="mt-6 grid gap-8 md:grid-cols-[1fr_220px] md:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Fiches à imprimer pour la maternelle et le CP</h1>
          <p className="mt-4 text-lg text-chalkboard/70 max-w-2xl">
            {fiches.length} fiches gratuites en PDF, pensées pour l&apos;école française : les lettres en capitale,
            en script et en cursive sur lignes Seyès, les syllabes, les sons, les nombres, les formes et les
            couleurs. Imprimez une fiche, ou tout un pack d&apos;un coup.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={{ pathname: "/worksheets/[category]", params: { category: "ecriture-cursive" } }}
              className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
            >
              Écriture cursive
            </Link>
            <Link
              href="/worksheets/bundles"
              className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
            >
              Les packs PDF
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <FichePreview fiche={hero} eager />
        </div>
      </header>

      <section className="mt-16" aria-labelledby="letters-heading">
        <h2 id="letters-heading" className="text-3xl font-bold">
          Les fiches des lettres
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Six fiches pour chacune des 26 lettres et pour é, è, ê et ç : du coloriage en petite section jusqu&apos;à
          l&apos;écriture de mots en cursive au CP.
        </p>
        <ul className="mt-6 grid md:grid-cols-2 gap-4">
          {FICHE_CATEGORIES.filter((c) => c.group === "lettres").map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} />
          ))}
        </ul>
        <h3 className="mt-10 font-display font-bold text-xl">Toutes les fiches d&apos;une lettre</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {frenchLetters.map((l) => (
            <li key={l.slug}>
              <Link
                href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: `pack-lettre-${l.slug}` } }}
                aria-label={`Les fiches de la lettre ${l.upper}`}
                className="letter-block bg-crayon-blue h-11 w-11 text-xl"
              >
                {l.upper}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="themes-heading">
        <h2 id="themes-heading" className="text-3xl font-bold">
          Nombres, formes, couleurs, sons et syllabes
        </h2>
        <ul className="mt-6 grid md:grid-cols-2 gap-4">
          {FICHE_CATEGORIES.filter((c) => c.group === "themes").map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} />
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-block bg-crayon-purple/10 p-8" aria-labelledby="packs-heading">
        <h2 id="packs-heading" className="text-3xl font-bold">
          Tout imprimer d&apos;un coup
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Les packs réunissent plusieurs fiches dans un seul PDF : toutes les fiches d&apos;une lettre, tout
          l&apos;alphabet en cursive, ou le pack alphabet complet pour la classe.
        </p>
        <Link
          href="/worksheets/bundles"
          className="mt-6 inline-block rounded-block bg-crayon-purple text-white font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Voir les packs
        </Link>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
