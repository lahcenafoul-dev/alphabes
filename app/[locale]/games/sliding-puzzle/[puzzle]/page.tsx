import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SlidingPuzzleGame from "@/components/games/SlidingPuzzleGame";
import ClientOnly from "@/components/games/ClientOnly";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { alternatesFor } from "@/lib/i18n/routes";
import { initLocale } from "@/lib/i18n/server";
import { PUZZLES, PUZZLE_TEXT, getPuzzle, puzzleImage } from "@/lib/puzzles";
import { withSocialMetadata } from "@/lib/social-metadata";

// One sliding puzzle (lib/puzzles.ts). English only for now (phase 5,
// step A): the listing page, the other languages, the menu and the sitemap
// come with step B.
type Props = { params: Promise<{ locale: string; puzzle: string }> };

const BASE_URL = "https://alphabes.com";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return params.locale === "en" ? PUZZLES.map((p) => ({ puzzle: p.slug.en })) : [];
}

async function pageMetadata(props: Props): Promise<Metadata> {
  const { locale: param, puzzle: slug } = await props.params;
  initLocale(param);
  const puzzle = getPuzzle(slug, "en");
  if (!puzzle) return {};
  return {
    title: puzzle.title.en,
    description: puzzle.description.en,
    alternates: alternatesFor("en", "/games/sliding-puzzle/[puzzle]", { puzzle: puzzle.slug.en }),
  };
}

export default async function SlidingPuzzlePage(props: Props) {
  const { locale: param, puzzle: slug } = await props.params;
  initLocale(param);
  const puzzle = getPuzzle(slug, "en");
  if (!puzzle) notFound();
  const url = `${BASE_URL}/games/sliding-puzzle/${puzzle.slug.en}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Games", url: `${BASE_URL}/games` },
    { name: `${puzzle.name.en} Sliding Puzzle`, url },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/games">Games</Link> /</li>
          <li aria-current="page" className="font-bold">{puzzle.name.en} Sliding Puzzle</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{puzzle.name.en} Sliding Puzzle</h1>
      <p className="mt-2 max-w-2xl text-chalkboard/70">{puzzle.description.en}</p>

      <div className="mt-8 min-h-[560px] rounded-block border border-chalkboard/10 p-4 shadow-block sm:p-6">
        <ClientOnly fallback={<p className="text-chalkboard/50">Loading puzzle…</p>}>
          <SlidingPuzzleGame image={puzzleImage(puzzle)} alt={puzzle.alt.en} size={puzzle.size} text={PUZZLE_TEXT.en} />
        </ClientOnly>
      </div>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-bold">How to play</h2>
          <p className="mt-2 text-chalkboard/80">
            The picture is cut into squares and one is missing. Tap or click a square next to the empty space to slide it there,
            or use the arrow keys. Put the picture back together like the small one beside the board. Stuck? Tap &quot;Show
            numbers&quot;: the squares go in order, 1 at the top left. Start with 3×3, then try 4×4.
          </p>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold">What your child practices</h2>
          <p className="mt-2 text-chalkboard/80">
            Planning a few moves ahead, seeing how the parts of a picture fit together, and sticking with a puzzle until it&apos;s
            solved.
          </p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}

export const generateMetadata = withSocialMetadata(pageMetadata);
