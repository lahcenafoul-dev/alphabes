import Link from "next/link";
import type { Metadata } from "next";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import { PUZZLES, puzzleImage } from "@/lib/puzzles";
import { PUZZLE_PAGES } from "@/lib/puzzle-pages";
import { withSocialMetadata } from "@/lib/social-metadata";

// The sliding puzzles (lib/puzzles.ts): a picture and a name for each, in
// every language.
async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const t = PUZZLE_PAGES[locale];
  return {
    title: t.listTitle,
    description: t.listDescription,
    alternates: alternatesFor(locale, "/games/sliding-puzzle"),
    openGraph: { title: t.listTitle, description: t.listDescription, url: absoluteUrl(locale, "/games/sliding-puzzle") },
  };
}

export default async function SlidingPuzzlesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const t = PUZZLE_PAGES[locale];
  const url = absoluteUrl(locale, "/games/sliding-puzzle");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: t.home, url: absoluteUrl(locale, "/") },
    { name: t.games, url: absoluteUrl(locale, "/games") },
    { name: t.section, url },
  ]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.listHeading,
    itemListElement: PUZZLES.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name[locale],
      url: absoluteUrl(locale, "/games/sliding-puzzle/[puzzle]", { puzzle: p.slug[locale] }),
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label={t.breadcrumb} className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href={localizedPath(locale, "/")}>{t.home}</Link> /</li>
          <li><Link href={localizedPath(locale, "/games")}>{t.games}</Link> /</li>
          <li aria-current="page" className="font-bold">{t.section}</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">{t.listHeading}</h1>
      <p className="mt-2 max-w-2xl text-chalkboard/70">{t.listIntro}</p>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {PUZZLES.map((p, i) => (
          <li key={p.id}>
            <Link
              href={localizedPath(locale, "/games/sliding-puzzle/[puzzle]", { puzzle: p.slug[locale] })}
              className="block rounded-block border border-chalkboard/10 p-3 shadow-block transition hover:shadow-blockHover"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- small static pictures */}
              <img src={puzzleImage(p)} alt="" width={240} height={240} loading={i < 8 ? "eager" : "lazy"} className="aspect-square w-full rounded-lg" />
              <span className="mt-2 block text-center font-display font-bold">{p.name[locale]}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-bold">{t.howTitle}</h2>
          <p className="mt-2 text-chalkboard/80">{t.how}</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold">{t.skillsTitle}</h2>
          <p className="mt-2 text-chalkboard/80">{t.skills}</p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </main>
  );
}

export const generateMetadata = withSocialMetadata(pageMetadata);
