// The sliding puzzles (lib/puzzles.ts): 24 scenes in 4 languages, each with
// its picture, unique slugs and titles, a page in every language, sitemap
// entries, and shuffles that can always be solved.
import { existsSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { PUZZLES, SCENE_DRAWINGS, getPuzzle, puzzleImage } from "@/lib/puzzles";
import { PUZZLE_PAGES } from "@/lib/puzzle-pages";
import { DRAWINGS } from "@/data/worksheets/drawings";
import { shuffled } from "@/components/games/SlidingPuzzleGame";
import { counterpartPath, localizedPath, matchPath } from "@/lib/i18n/routes";
import { paramsExist } from "@/lib/i18n/known-params";
import { sitemapEntries } from "@/lib/sitemap";
import { routing } from "@/i18n/routing";

const LOCALES = routing.locales;

/** Solvable when the tiles' parity matches the gap's distance from its corner. */
function solvable(tiles: number[], n: number): boolean {
  let swaps = 0;
  const t = [...tiles];
  for (let i = 0; i < t.length; i++) {
    while (t[i] !== i) {
      const j = t[i];
      [t[i], t[j]] = [t[j], t[i]];
      swaps++;
    }
  }
  const gap = tiles.indexOf(n * n - 1);
  const distance = n - 1 - Math.floor(gap / n) + (n - 1 - (gap % n));
  return swaps % 2 === distance % 2;
}

describe("sliding puzzles", () => {
  it("has 24 puzzles with a picture each", () => {
    expect(PUZZLES).toHaveLength(24);
    for (const p of PUZZLES) expect(existsSync(path.join("public", puzzleImage(p))), p.id).toBe(true);
  });

  it("uses nine different drawings that exist, one per tile", () => {
    const ids = new Set(DRAWINGS.map((d) => d.id));
    for (const [id, { grid, main }] of Object.entries(SCENE_DRAWINGS)) {
      expect(new Set(grid).size, id).toBe(9);
      for (const d of grid) expect(ids.has(d), `${id}: ${d}`).toBe(true);
      for (const d of main) expect(grid, `${id}: ${d}`).toContain(d);
    }
  });

  it("has unique slugs, names and titles in every language, and short SEO text", () => {
    for (const l of LOCALES) {
      for (const key of ["slug", "name", "title", "description"] as const) {
        expect(new Set(PUZZLES.map((p) => p[key][l])).size, `${key} ${l}`).toBe(PUZZLES.length);
      }
      for (const p of PUZZLES) {
        expect(p.slug[l]).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(p.title[l].length, p.title[l]).toBeLessThanOrEqual(65);
        expect(p.description[l].length, p.description[l]).toBeLessThanOrEqual(170);
        expect(getPuzzle(p.slug[l], l)).toBe(p);
        expect(p.size).toBe(3);
      }
      expect(PUZZLE_PAGES[l].listTitle.length).toBeLessThanOrEqual(65);
      expect(PUZZLE_PAGES[l].listDescription.length).toBeLessThanOrEqual(170);
    }
  });

  it("has a page for every puzzle in every language, linked to its twins", () => {
    for (const l of LOCALES) {
      const list = localizedPath(l, "/games/sliding-puzzle");
      expect(matchPath(list)?.pathname).toBe("/games/sliding-puzzle");
      for (const p of PUZZLES) {
        const url = localizedPath(l, "/games/sliding-puzzle/[puzzle]", { puzzle: p.slug[l] });
        const match = matchPath(url)!;
        expect(match.pathname, url).toBe("/games/sliding-puzzle/[puzzle]");
        expect(paramsExist(match.pathname, match.params, l), url).toBe(true);
        for (const other of LOCALES.filter((o) => o !== l)) {
          expect(counterpartPath(match, other)).toBe(localizedPath(other, "/games/sliding-puzzle/[puzzle]", { puzzle: p.slug[other] }));
        }
      }
      expect(paramsExist("/games/sliding-puzzle/[puzzle]", { puzzle: "no-such-puzzle" }, l)).toBe(false);
    }
    expect(localizedPath("fr", "/games/sliding-puzzle/[puzzle]", { puzzle: "jardin-ensoleille" })).toBe("/fr/jeux/taquin/jardin-ensoleille");
  });

  it("lists the listing and every puzzle in the sitemap, in every language", async () => {
    const urls = new Set((await sitemapEntries()).map((e) => e.url));
    for (const l of LOCALES) {
      expect(urls).toContain(`https://alphabes.com${localizedPath(l, "/games/sliding-puzzle")}`);
      for (const p of PUZZLES) expect(urls).toContain(`https://alphabes.com${localizedPath(l, "/games/sliding-puzzle/[puzzle]", { puzzle: p.slug[l] })}`);
    }
  });

  it("shuffles into a board that can be solved and isn't solved yet", () => {
    for (const n of [3, 4]) {
      for (let k = 0; k < 200; k++) {
        const tiles = shuffled(n);
        expect([...tiles].sort((a, b) => a - b)).toEqual(Array.from({ length: n * n }, (_, i) => i));
        expect(tiles.every((t, i) => t === i)).toBe(false);
        expect(solvable(tiles, n)).toBe(true);
      }
    }
  });
});
