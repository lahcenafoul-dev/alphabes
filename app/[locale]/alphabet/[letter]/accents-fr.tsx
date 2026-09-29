import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { ACCENTS_SLUG, frenchLetters, isAccentLetter, otherAccents } from "@/lib/letters-fr";

const title = "Les accents en français : é, è, ê, ç, à, â, ë, œ…";
const description =
  "Les accents expliqués aux enfants et aux parents : ceux qui changent le son (é, è, ê, ç) et ceux qui ne le changent pas (à, ù, â, î, ô, û), le tréma et le e dans l'o.";

export const accentsMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/alphabet/[letter]", { letter: ACCENTS_SLUG }),
  openGraph: { title, description, url: absoluteUrl("fr", "/alphabet/[letter]", { letter: ACCENTS_SLUG }) },
};

const faq = [
  {
    question: "À quel âge apprendre les accents ?",
    answer:
      "En maternelle, l'enfant les remarque en recopiant son prénom ou des mots simples. On les étudie vraiment au CP, en commençant par le é, le plus fréquent, puis le è et le ê.",
  },
  {
    question: "Faut-il mettre les accents sur les majuscules ?",
    answer:
      "Oui. L'Académie française recommande de garder les accents sur les capitales : ÉCOLE, À BIENTÔT. Ils aident à lire correctement le mot.",
  },
  {
    question: "Comment aider mon enfant à ne pas oublier les accents ?",
    answer:
      "Faites-lui dire le mot à voix haute en écoutant le son : s'il entend [e] comme dans bébé, il faut sans doute un accent aigu. Pour les accents qui ne changent pas le son, comme dans château, il faut surtout lire et écrire souvent le même mot.",
  },
];

export default function AccentsFr() {
  const url = absoluteUrl("fr", "/alphabet/[letter]", { letter: ACCENTS_SLUG });
  const accentLetters = frenchLetters.filter(isAccentLetter);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Alphabet", url: absoluteUrl("fr", "/alphabet") },
    { name: "Les accents", url },
  ]);
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
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li><Link href="/alphabet">Alphabet</Link> /</li>
          <li aria-current="page" className="font-bold">Les accents</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">Les accents en français</h1>
      <p className="mt-4 text-lg text-chalkboard/80 max-w-2xl">
        Un accent est un petit signe posé sur une lettre. Certains changent le son de la lettre,
        d&apos;autres non : ils servent surtout à distinguer deux mots ou gardent la trace de
        l&apos;histoire de la langue.
      </p>

      <section className="mt-10" aria-labelledby="change-heading">
        <h2 id="change-heading" className="text-2xl font-bold">
          Les accents qui changent le son
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Ces quatre lettres se lisent autrement que la lettre sans accent. Chacune a sa leçon,
          avec des mots à écouter et une fiche de tracé.
        </p>
        <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {accentLetters.map((l) => (
            <li key={l.slug}>
              <Link
                href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
                className="block h-full rounded-block border-2 border-chalkboard/10 bg-paper p-4 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors"
              >
                <span className="letter-block bg-crayon-purple mx-auto flex aspect-square w-16 items-center justify-center text-2xl" aria-hidden="true">
                  {l.upper}{l.lower}
                </span>
                <span className="mt-2 block font-display font-bold">{l.name}</span>
                <span className="block text-sm text-chalkboard/70">
                  {l.ipa}, comme dans {l.words[0].word.toLowerCase()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="same-heading">
        <h2 id="same-heading" className="text-2xl font-bold">
          Les autres accents
        </h2>
        <div className="mt-6 space-y-6">
          {otherAccents.map((group) => (
            <article key={group.id} className="rounded-block border border-chalkboard/10 bg-paper p-6 shadow-block">
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="font-display text-4xl font-extrabold text-crayon-blue" aria-hidden="true">
                  {group.marks}
                </span>
                <h3 className="font-display text-xl font-bold">{group.title}</h3>
              </div>
              <p className="mt-2 text-chalkboard/80">{group.explanation}</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {group.examples.map((ex) => (
                  <li key={ex.text}>
                    <ListenButton
                      text={ex.text}
                      ariaLabel={`Écouter : ${ex.text}`}
                      className="inline-flex items-center gap-2 rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold hover:border-crayon-blue transition-colors"
                    >
                      <span aria-hidden="true">{ex.emoji}</span> {ex.text} <span aria-hidden="true">🔊</span>
                    </ListenButton>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold">
          Questions fréquentes
        </h2>
        <dl className="mt-4 space-y-5">
          {faq.map((f) => (
            <div key={f.question}>
              <dt className="font-display font-bold">{f.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-12">
        <Link href="/alphabet" className="font-display font-bold text-crayon-blue hover:underline">
          ← Retour à l&apos;alphabet
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
