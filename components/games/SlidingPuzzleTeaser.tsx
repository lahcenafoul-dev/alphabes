import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n/routes";
import { PUZZLES, puzzleImage } from "@/lib/puzzles";
import { PUZZLE_PAGES } from "@/lib/puzzle-pages";

/** On the games page: the sliding puzzles, with four of their pictures. */
export default function SlidingPuzzleTeaser({ locale }: { locale: Locale }) {
  const t = PUZZLE_PAGES[locale];
  const list = localizedPath(locale, "/games/sliding-puzzle");
  return (
    <section className="mt-12 rounded-block border border-chalkboard/10 p-6 shadow-block" aria-labelledby="sliding-puzzles">
      <h2 id="sliding-puzzles" className="font-display text-2xl font-bold">{t.teaserTitle}</h2>
      <p className="mt-2 max-w-2xl text-chalkboard/70">{t.teaserText}</p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
        {PUZZLES.slice(0, 4).map((p) => (
          <li key={p.id}>
            <Link href={localizedPath(locale, "/games/sliding-puzzle/[puzzle]", { puzzle: p.slug[locale] })} className="block rounded-block border border-chalkboard/10 p-2 transition hover:shadow-blockHover">
              {/* eslint-disable-next-line @next/next/no-img-element -- small static pictures */}
              <img src={puzzleImage(p)} alt="" width={240} height={240} loading="lazy" className="aspect-square w-full rounded-lg" />
              <span className="mt-2 block text-center text-sm font-bold">{p.name[locale]}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={list} className="mt-5 inline-block rounded-block bg-chalkboard px-4 py-2 font-display text-sm font-bold text-paper shadow-block transition hover:shadow-blockHover">
        {t.teaserLink}
      </Link>
    </section>
  );
}
