import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n/routes";
import { frenchLetterParams } from "@/lib/letters-fr";
import { spanishLetterParams } from "@/lib/letters-es";
import { portugueseLetterParams } from "@/lib/letters-pt";
import { storyImageSrcSet } from "@/lib/story-images";
import type { StoryPageData } from "@/lib/stories";

// Under the page-by-page reader: the whole story as plain, visible text (in a
// <details> block, so the reader stays the main thing on the page; search
// engines and screen readers get every page, not only the first), then the
// "For parents" section. Server components: they are in the static HTML.

const LABELS = {
  en: {
    whole: "Read the whole story",
    page: "Page",
    parents: "For parents",
    teaches: "What this story teaches",
    questions: "Questions to talk about",
    words: "Words to practice",
    letter: (l: string) => `The letter ${l}`,
  },
  fr: {
    whole: "Lire toute l'histoire",
    page: "Page",
    parents: "Pour les parents",
    teaches: "Ce que cette histoire apprend",
    questions: "Des questions pour en parler",
    words: "Des mots à travailler",
    letter: (l: string) => `La lettre ${l}`,
  },
  es: {
    whole: "Leer todo el cuento",
    page: "Página",
    parents: "Para las familias",
    teaches: "Lo que enseña este cuento",
    questions: "Preguntas para conversar",
    words: "Palabras para practicar",
    letter: (l: string) => `La letra ${l}`,
  },
  pt: {
    whole: "Ler a história inteira",
    page: "Página",
    parents: "Para as famílias",
    teaches: "O que esta história ensina",
    questions: "Perguntas para conversar",
    words: "Palavras para praticar",
    letter: (l: string) => `A letra ${l}`,
  },
} satisfies Record<Locale, unknown>;

const SPECIAL: Partial<Record<Locale, Record<string, string>>> = {
  fr: { é: "e-accent-aigu", è: "e-accent-grave", ê: "e-accent-circonflexe", ç: "c-cedille" },
  es: { ñ: "enie" },
  pt: { ç: "c-cedilha" },
};

const LETTER_PAGES: Record<Locale, () => string[]> = {
  en: () => "abcdefghijklmnopqrstuvwxyz".split(""),
  fr: frenchLetterParams,
  es: spanishLetterParams,
  pt: portugueseLetterParams,
};

/**
 * The alphabet page for a word's first letter, when that page exists: é has
 * its own page in French and ñ in Spanish; other accented letters (á, ó…) go
 * to their plain letter.
 */
export function letterPageFor(locale: Locale, word: string): { href: string; letter: string } | null {
  const first = word.trim().charAt(0).toLowerCase();
  if (!first) return null;
  const slug = SPECIAL[locale]?.[first] ?? first.normalize("NFD").replace(/\p{M}/gu, "");
  if (!LETTER_PAGES[locale]().includes(slug)) return null;
  return { href: localizedPath(locale, "/alphabet/[letter]", { letter: slug }), letter: first.toUpperCase() };
}

export function WholeStory({ locale, pages, alt }: { locale: Locale; pages: StoryPageData[]; alt: string[] }) {
  const t = LABELS[locale];
  return (
    <details className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-owl-ink/5 sm:p-8">
      <summary className="cursor-pointer font-display text-xl font-extrabold">{t.whole}</summary>
      <ol className="mt-4 space-y-5">
        {pages.map((p) => (
          <li key={p.pageNumber} className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- static WebP files in two sizes, no image optimizer on Workers */}
            <img
              src={p.imageUrl.replace(/-1200\.webp$/, "-640.webp")}
              srcSet={storyImageSrcSet(p.imageUrl)}
              sizes="112px"
              width={640}
              height={480}
              alt={alt[p.pageNumber] ?? ""}
              loading="lazy"
              decoding="async"
              className="w-28 shrink-0 rounded-xl"
            />
            <p className="text-lg">
              <span className="block text-sm font-bold text-chalkboard/60">
                {t.page} {p.pageNumber}
              </span>
              {p.text}
            </p>
          </li>
        ))}
      </ol>
    </details>
  );
}

export function ForParents({ locale, teaches, questions, words }: { locale: Locale; teaches: string; questions: string[]; words: string[] }) {
  const t = LABELS[locale];
  if (!teaches && questions.length === 0 && words.length === 0) return null;
  return (
    <section aria-labelledby="for-parents" className="mt-8 rounded-3xl bg-owl-cream p-6 sm:p-8">
      <h2 id="for-parents" className="font-display text-2xl font-extrabold">
        {t.parents}
      </h2>
      {teaches && (
        <>
          <h3 className="mt-4 text-lg font-extrabold">{t.teaches}</h3>
          <p className="mt-1 text-lg">{teaches}</p>
        </>
      )}
      {questions.length > 0 && (
        <>
          <h3 className="mt-5 text-lg font-extrabold">{t.questions}</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-lg">
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </>
      )}
      {words.length > 0 && (
        <>
          <h3 className="mt-5 text-lg font-extrabold">{t.words}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {words.map((w) => {
              const page = letterPageFor(locale, w);
              return (
                <li key={w}>
                  {page ? (
                    <Link
                      href={page.href}
                      title={t.letter(page.letter)}
                      className="inline-block rounded-full bg-white px-4 py-1.5 text-lg font-bold ring-1 ring-owl-ink/10 hover:text-owl-purple"
                    >
                      {w}
                    </Link>
                  ) : (
                    <span className="inline-block rounded-full bg-white px-4 py-1.5 text-lg font-bold ring-1 ring-owl-ink/10">{w}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
