import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SlidingPuzzleGame from "@/components/games/SlidingPuzzleGame";
import ClientOnly from "@/components/games/ClientOnly";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { initLocale } from "@/lib/i18n/server";
import { PUZZLES, PUZZLE_TEXT, getPuzzle, puzzleImage } from "@/lib/puzzles";
import { PUZZLE_PAGES } from "@/lib/puzzle-pages";
import { routing } from "@/i18n/routing";
import { withSocialMetadata } from "@/lib/social-metadata";

// One sliding puzzle (lib/puzzles.ts), in every language. The listing is
// ../page.tsx.
type Props = { params: Promise<{ locale: string; puzzle: string }> };

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = routing.locales.find((l) => l === params.locale) ?? "en";
  return PUZZLES.map((p) => ({ puzzle: p.slug[locale] }));
}

async function load(props: Props) {
  const { locale: param, puzzle: slug } = await props.params;
  const locale = initLocale(param);
  const puzzle = getPuzzle(slug, locale);
  return { locale, puzzle };
}

async function pageMetadata(props: Props): Promise<Metadata> {
  const { locale, puzzle } = await load(props);
  if (!puzzle) return {};
  const params = { puzzle: puzzle.slug[locale] };
  return {
    title: puzzle.title[locale],
    description: puzzle.description[locale],
    alternates: alternatesFor(locale, "/games/sliding-puzzle/[puzzle]", params),
    openGraph: {
      title: puzzle.title[locale],
      description: puzzle.description[locale],
      url: absoluteUrl(locale, "/games/sliding-puzzle/[puzzle]", params),
      images: [{ url: puzzleImage(puzzle), width: 960, height: 960, alt: puzzle.alt[locale] }],
    },
  };
}

export default async function SlidingPuzzlePage(props: Props) {
  const { locale, puzzle } = await load(props);
  if (!puzzle) notFound();
  const t = PUZZLE_PAGES[locale];
  const heading = t.heading.replace("{name}", puzzle.name[locale]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: t.home, url: absoluteUrl(locale, "/") },
    { name: t.games, url: absoluteUrl(locale, "/games") },
    { name: t.section, url: absoluteUrl(locale, "/games/sliding-puzzle") },
    { name: heading, url: absoluteUrl(locale, "/games/sliding-puzzle/[puzzle]", { puzzle: puzzle.slug[locale] }) },
  ]);
  // A few other puzzles to play next.
  const i = PUZZLES.indexOf(puzzle);
  const next = [1, 2, 3].map((k) => PUZZLES[(i + k) % PUZZLES.length]);

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label={t.breadcrumb} className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href={localizedPath(locale, "/")}>{t.home}</Link> /</li>
          <li><Link href={localizedPath(locale, "/games")}>{t.games}</Link> /</li>
          <li><Link href={localizedPath(locale, "/games/sliding-puzzle")}>{t.section}</Link> /</li>
          <li aria-current="page" className="font-bold">{puzzle.name[locale]}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{heading}</h1>
      <p className="mt-2 max-w-2xl text-chalkboard/70">{puzzle.description[locale]}</p>

      <div className="mt-8 min-h-[560px] rounded-block border border-chalkboard/10 p-4 shadow-block sm:p-6">
        <ClientOnly fallback={<p className="text-chalkboard/50">{t.loading}</p>}>
          <SlidingPuzzleGame image={puzzleImage(puzzle)} alt={puzzle.alt[locale]} size={puzzle.size} text={PUZZLE_TEXT[locale]} />
        </ClientOnly>
      </div>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-bold">{t.howTitle}</h2>
          <p className="mt-2 text-chalkboard/80">{t.how}</p>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold">{t.skillsTitle}</h2>
          <p className="mt-2 text-chalkboard/80">{t.skills}</p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="more-puzzles">
        <h2 id="more-puzzles" className="font-display text-lg font-bold">
          <Link href={localizedPath(locale, "/games/sliding-puzzle")} className="underline">{t.more}</Link>
        </h2>
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:gap-5">
          {next.map((p) => (
            <li key={p.id}>
              <Link href={localizedPath(locale, "/games/sliding-puzzle/[puzzle]", { puzzle: p.slug[locale] })} className="block rounded-block border border-chalkboard/10 p-2 shadow-block transition hover:shadow-blockHover">
                {/* eslint-disable-next-line @next/next/no-img-element -- a small static picture */}
                <img src={puzzleImage(p)} alt="" width={240} height={240} loading="lazy" className="aspect-square w-full rounded-lg" />
                <span className="mt-2 block text-center text-sm font-bold">{p.name[locale]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}

export const generateMetadata = withSocialMetadata(pageMetadata);
