import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import ClientMessages from "@/components/ClientMessages";
import ClientOnly from "@/components/games/ClientOnly";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { HTML_LANG, absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { getNumberGame, numberGamePage, numberGames, type NumberGame as Game } from "@/lib/number-games";
import NumberGame from "./NumberGame";

export function numberGameMetadata(locale: Locale, slug: string): Metadata {
  const g = getNumberGame(locale, slug);
  if (!g) return {};
  const url = absoluteUrl(locale, "/games/[slug]", { slug: g.slug });
  return {
    title: g.seoTitle,
    description: g.description,
    alternates: alternatesFor(locale, "/games/[slug]", { slug: g.slug }),
    openGraph: { title: g.seoTitle, description: g.description, url },
  };
}

const TINTS = ["bg-white", "bg-owl-lilac", "bg-owl-cream", "bg-owl-mint"];

/** The cards of the number games, for the games pages, /numbers and each game's "more games". */
export function NumberGameCards({ locale, games, headingLevel = "h3" }: { locale: Locale; games: Game[]; headingLevel?: "h2" | "h3" }) {
  const page = numberGamePage(locale);
  const Heading = headingLevel;
  return (
    <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((g, i) => (
        <li key={g.slug}>
          <Link
            href={localizedPath(locale, "/games/[slug]", { slug: g.slug })}
            className={`owl-card flex h-full flex-col ${TINTS[i % TINTS.length]}`}
          >
            <Heading className="text-xl">{g.title}</Heading>
            <span className="mt-1 block font-body text-base font-normal text-owl-muted">{g.card}</span>
            <span className="mt-auto flex items-center justify-between gap-2 pt-4">
              <span className="flex flex-wrap gap-2">
                <span className="rounded-full bg-owl-green/15 px-3 py-1 text-xs font-bold text-owl-green-dark">{page.free}</span>
                <span className="rounded-full bg-owl-sun/40 px-3 py-1 text-xs font-bold">{page.age}</span>
              </span>
              <span className="rounded-full bg-owl-purple px-4 py-1.5 text-sm text-white">{page.play}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The "Number games" section of the games pages and /numbers. */
export function NumberGamesSection({ locale, className = "mt-12 bg-owl-bg" }: { locale: Locale; className?: string }) {
  const page = numberGamePage(locale);
  return (
    <section aria-labelledby="number-games-heading" className={`rounded-3xl p-5 text-owl-ink sm:p-8 ${className}`}>
      <h2 id="number-games-heading" className="font-display text-2xl font-extrabold sm:text-3xl">
        {page.sectionHeading}
      </h2>
      <p className="mt-2 max-w-3xl text-lg text-owl-muted">{page.sectionIntro}</p>
      <NumberGameCards locale={locale} games={numberGames(locale)} />
    </section>
  );
}

// A number game page (/games/count-and-tap, /fr/jeux/compte-et-touche…), in
// the owl style of /numbers: the game, how to play, a word for parents and
// the other number games.
export default function NumberGamePage({ locale, slug }: { locale: Locale; slug: string }) {
  // The page only renders slugs listed in lib/number-games.ts.
  const g = getNumberGame(locale, slug)!;
  const page = numberGamePage(locale);
  const url = absoluteUrl(locale, "/games/[slug]", { slug: g.slug });
  const others = numberGames(locale).filter((o) => o.key !== g.key);

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: page.home, url: absoluteUrl(locale, "/") },
      { name: page.games, url: absoluteUrl(locale, "/games") },
      { name: g.title, url },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: g.title,
      description: g.description,
      url,
      inLanguage: HTML_LANG[locale],
      learningResourceType: "Game",
      educationalLevel: page.level,
      typicalAgeRange: "3-6",
      isAccessibleForFree: true,
    },
  ];

  return (
    <div className="bg-owl-bg text-owl-ink">
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <nav aria-label="Breadcrumb" className="text-sm text-owl-muted">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href={localizedPath(locale, "/")} className="hover:text-owl-purple">
                {page.home}
              </Link>{" "}
              /
            </li>
            <li>
              <Link href={localizedPath(locale, "/games")} className="hover:text-owl-purple">
                {page.games}
              </Link>{" "}
              /
            </li>
            <li aria-current="page" className="font-bold text-owl-ink">
              {g.title}
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{g.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-owl-muted">{g.description}</p>

        <div className="mt-6 min-h-[600px] sm:mt-8 sm:min-h-[640px]">
          <ClientOnly fallback={<p className="pt-24 text-center font-display font-bold text-owl-muted">{page.loading}</p>}>
            <ClientMessages locale={locale} namespaces={["NumberGames"]}>
              <NumberGame game={g.key} />
            </ClientMessages>
          </ClientOnly>
        </div>

        <section className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-owl-ink/5">
            <h2 className="font-display text-xl font-extrabold">{page.howToPlay}</h2>
            <p className="mt-2 text-lg">{g.howToPlay}</p>
          </div>
          <div className="rounded-3xl bg-owl-mint p-6">
            <h2 className="font-display text-xl font-extrabold">{page.forParents}</h2>
            <p className="mt-2 text-lg">{g.forParents}</p>
            <p className="mt-3 text-sm font-bold text-owl-muted">{page.age}</p>
          </div>
        </section>

        <section aria-labelledby="more-games-heading" className="mt-12">
          <h2 id="more-games-heading" className="font-display text-2xl font-extrabold sm:text-3xl">
            {page.otherGames}
          </h2>
          <NumberGameCards locale={locale} games={others} />
          <p className="mt-6">
            <Link href={localizedPath(locale, "/numbers")} className="owl-btn owl-btn-outline">
              {page.moreNumbers}
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
