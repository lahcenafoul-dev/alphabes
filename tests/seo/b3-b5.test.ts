// SEO phase 4, B3 + B5: the text on the 114 letter bundle/pack pages, the 46
// game pages and the 96 sliding puzzle picture pages.
import { describe, expect, it, vi } from "vitest";
import type { AppPathname, Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n/routes";
import { paramsExist } from "@/lib/i18n/known-params";
import { blocksText, faqJsonLd, type Block, type Inline } from "@/lib/guide-blocks";
import { bundleGuide } from "@/lib/bundle-guide";
import { letterGameGuide, numberGameGuide, puzzleHubGuide } from "@/lib/game-guide";
import { puzzleGuide, hiddenDrawing, sceneRows } from "@/lib/puzzle-guide";
import { getAllBundleSlugs } from "@/lib/worksheet-bundles";
import { fichePacks } from "@/lib/fiches-fr";
import { fichaPacks } from "@/lib/fichas-es";
import { atividadePacks } from "@/lib/atividades-pt";
import { games } from "@/lib/games-data";
import { frenchGames } from "@/lib/games-fr";
import { spanishGames } from "@/lib/juegos-es";
import { portugueseGames } from "@/lib/jogos-pt";
import { numberGames } from "@/lib/number-games";
import { PUZZLES, SCENE_DRAWINGS } from "@/lib/puzzles";

vi.mock("next/font/google", () => {
  const font = () => ({ className: "", variable: "", style: {} });
  return { Baloo_2: font, Nunito: font, Playwrite_BR: font, Playwrite_FR_Trad: font, Playwrite_MX: font };
});

const LOCALES: Locale[] = ["en", "fr", "es", "pt"];
const words = (b: Block[]) => blocksText(b).split(/\s+/).filter(Boolean).length;
const links = (b: Block[]) =>
  b
    .flatMap((x) => [...(x.paragraphs ?? []).flat(), ...(x.list ?? []).flat(), ...(x.faq ?? []).flatMap((f) => f.a)])
    .filter((i): i is Extract<Inline, { href: string }> => typeof i !== "string" && "href" in i);

const ROUTES: AppPathname[] = [
  "/worksheets/[category]",
  "/worksheets/bundles/[bundleSlug]",
  "/games/[slug]",
  "/games/sliding-puzzle/[puzzle]",
  "/alphabet/[letter]",
];
const STATIC: AppPathname[] = ["/alphabet", "/numbers", "/games", "/games/sliding-puzzle"];

/** True when href is a page that exists in that language. */
function exists(locale: Locale, href: string): boolean {
  if (STATIC.some((p) => localizedPath(locale, p) === href)) return true;
  for (const p of ROUTES) {
    const key = p.match(/\[(\w+)\]/)![1];
    const [a, z] = localizedPath(locale, p, { [key]: "QQQ" } as never).split("QQQ");
    if (!href.startsWith(a) || !href.endsWith(z)) continue;
    const value = decodeURIComponent(href.slice(a.length, href.length - z.length));
    if (value.includes("/")) continue;
    return paramsExist(p, { [key]: value } as never, locale);
  }
  return false;
}

const BUNDLES: Record<Locale, string[]> = {
  en: getAllBundleSlugs().filter((s) => /^letter-[a-z]-bundle$/.test(s)),
  fr: fichePacks.map((p) => p.slug).filter((s) => s.startsWith("pack-lettre-")),
  es: fichaPacks.map((p) => p.slug).filter((s) => s.startsWith("paquete-letra-")),
  pt: atividadePacks.map((p) => p.slug).filter((s) => s.startsWith("pacote-letra-")),
};
const LETTER_GAMES: Record<Locale, string[]> = {
  en: games.map((g) => g.slug),
  fr: frenchGames.map((g) => g.slug),
  es: spanishGames.map((g) => g.slug),
  pt: portugueseGames.map((g) => g.slug),
};

describe("B3: letter bundle and pack pages", () => {
  it("covers the 114 pages", () => {
    expect(LOCALES.map((l) => BUNDLES[l].length)).toEqual([26, 30, 28, 30]);
  });

  it("gives every page what's inside, who it's for and a 5-day plan, with links that exist", () => {
    for (const l of LOCALES)
      for (const slug of BUNDLES[l]) {
        const b = bundleGuide(l, slug);
        const ids = b.map((x) => x.id);
        expect(ids.slice(0, 3), `${l} ${slug}`).toEqual(["inside", "who", "plan"]);
        expect(words(b), `${l} ${slug}`).toBeGreaterThanOrEqual(110);
        expect(words(b), `${l} ${slug}`).toBeLessThanOrEqual(320);
        for (const { href } of links(b)) expect(exists(l, href), `${l} ${slug} → ${href}`).toBe(true);
      }
  });

  it("describes each language's own sheets, not the English list", () => {
    const inside = (l: Locale, slug: string) => blocksText(bundleGuide(l, slug).filter((x) => x.id === "inside"));
    const en = inside("en", "letter-b-bundle");
    for (const [l, slug] of [["fr", "pack-lettre-b"], ["es", "paquete-letra-b"], ["pt", "pacote-letra-b"]] as const) {
      const t = inside(l, slug);
      expect(t).not.toBe(en);
      expect(links(bundleGuide(l, slug)).length).toBeGreaterThan(3);
    }
    // One text per letter.
    for (const l of LOCALES) expect(new Set(BUNDLES[l].map((s) => blocksText(bundleGuide(l, s)))).size).toBe(BUNDLES[l].length);
  });
});

describe("B5: game pages", () => {
  const pages = LOCALES.flatMap((l) => [
    ...LETTER_GAMES[l].map((slug) => ({ l, name: slug, blocks: letterGameGuide(l, slug), full: true })),
    ...numberGames(l).map((g) => ({ l, name: g.slug, blocks: numberGameGuide(l, g.key), full: false })),
    { l, name: "sliding-puzzle", blocks: puzzleHubGuide(l), full: true },
  ]);

  it("covers the 46 pages", () => {
    expect(LOCALES.map((l) => pages.filter((p) => p.l === l).length)).toEqual([11, 11, 12, 12]);
  });

  it("follows the template, with 3 questions in FAQPage JSON-LD and links that exist", () => {
    for (const p of pages) {
      const ids = p.blocks.map((b) => b.id);
      // Number games keep their own How to play / For parents cards above.
      expect(ids, `${p.l} ${p.name}`).toEqual(p.full ? ["how", "learns", "age", "faq", "more"] : ["age", "faq", "more"]);
      const faq = p.blocks.find((b) => b.id === "faq")!.faq!;
      expect(faq, `${p.l} ${p.name}`).toHaveLength(3);
      const ld = faqJsonLd(p.blocks) as { "@type": string; mainEntity: unknown[] };
      expect(ld["@type"]).toBe("FAQPage");
      expect(ld.mainEntity).toHaveLength(3);
      for (const { href } of links(p.blocks)) expect(exists(p.l, href), `${p.l} ${p.name} → ${href}`).toBe(true);
      if (p.full) {
        expect(words(p.blocks), `${p.l} ${p.name}`).toBeGreaterThanOrEqual(200);
        expect(words(p.blocks), `${p.l} ${p.name}`).toBeLessThanOrEqual(300);
      }
    }
  });

  it("never promises French sound on every device", () => {
    for (const p of pages.filter((x) => x.l === "fr")) {
      const t = blocksText(p.blocks);
      expect(t, p.name).not.toMatch(/sur tous les appareils\s*[.!]|toujours le son|fonctionne partout/);
      const voice = p.blocks.find((b) => b.id === "faq")!.faq!.find((f) => /son marche/.test(f.q));
      if (voice) expect(voice.a.join(""), p.name).toMatch(/S'il n'(en )?a pas/);
    }
  });

  it("gives each game its own text", () => {
    for (const l of LOCALES) {
      const texts = pages.filter((p) => p.l === l).map((p) => blocksText(p.blocks));
      expect(new Set(texts).size).toBe(texts.length);
    }
  });
});

describe("B5: sliding puzzle picture pages", () => {
  it("gives the 96 pages 60 to 100 words of their own", () => {
    for (const l of LOCALES) {
      const texts = PUZZLES.map((p) => {
        const b = puzzleGuide(l, p.slug[l]);
        expect(words(b), `${l} ${p.id}`).toBeGreaterThanOrEqual(60);
        expect(words(b), `${l} ${p.id}`).toBeLessThanOrEqual(100);
        return blocksText(b);
      });
      expect(new Set(texts).size).toBe(PUZZLES.length);
    }
  });

  it("names the rows and the hidden square from the scene itself", () => {
    for (const p of PUZZLES) {
      const grid = SCENE_DRAWINGS[p.id].grid;
      expect(sceneRows(p).flat().sort(), p.id).toEqual([...grid].sort());
      expect(hiddenDrawing(p), p.id).toBe(grid[8]);
    }
    expect(blocksText(puzzleGuide("en", "sunny-garden"))).toContain("Top row: the sun, the bird and the kite.");
    expect(blocksText(puzzleGuide("fr", PUZZLES[0].slug.fr))).toContain("donc l'escargot ne revient");
  });
});
