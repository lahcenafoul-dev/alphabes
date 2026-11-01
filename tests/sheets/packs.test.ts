// The Pro packs (lib/sheets/packs.ts): 39 packs in 4 languages, slugs that
// don't clash with the existing bundles, every sheet of a type in its
// complete pack, the Mega pack made of every type, and pattern answer keys
// that pick one of the printed choices.
import { describe, expect, it } from "vitest";
import { PACKS, PACK_KINDS, completePack, getPack, packFiles, packItemCount, packKey } from "@/lib/sheets/packs";
import { SHEET_LOCALES } from "@/lib/sheets/types";
import { sheetsOfKind } from "@/lib/sheets/catalog";
import { PUZZLES } from "@/lib/puzzles";
import { bundles } from "@/lib/worksheet-bundles";
import { fichePacks } from "@/lib/fiches-fr";
import { fichaPacks } from "@/lib/fichas-es";
import { atividadePacks } from "@/lib/atividades-pt";
import type { PatternsSheet } from "@/data/worksheets/patterns";

const EXISTING = { en: bundles, fr: fichePacks, es: fichaPacks, pt: atividadePacks };

describe("Pro packs", () => {
  it("has 39 packs: 13 complete, 25 smaller and the Mega pack", () => {
    expect(PACKS).toHaveLength(39);
    expect(PACKS.filter((p) => p.scope === "complete")).toHaveLength(13);
    expect(PACKS.filter((p) => p.scope === "level")).toHaveLength(25);
    expect(PACKS.filter((p) => p.scope === "mega")).toHaveLength(1);
  });

  it("has unique slugs in every language, clear of the existing bundles", () => {
    for (const l of SHEET_LOCALES) {
      const slugs = PACKS.map((p) => p.slug[l]);
      expect(new Set(slugs).size, l).toBe(PACKS.length);
      for (const s of slugs) {
        expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(s.length).toBeLessThanOrEqual(80);
        expect(EXISTING[l].some((b) => b.slug === s), `${l} ${s}`).toBe(false);
      }
      for (const p of PACKS) expect(getPack(l, p.slug[l])).toBe(p);
    }
  });

  it("puts every sheet of a type in its complete pack, once", () => {
    for (const kind of PACK_KINDS) {
      const items = completePack(kind).sections.flatMap((s) => s.items);
      const all = kind === "sliding-puzzles" ? PUZZLES.map((p) => p.id) : sheetsOfKind(kind).map((s) => s.id);
      expect(new Set(items).size, kind).toBe(items.length);
      expect([...items].sort(), kind).toEqual([...all].sort());
    }
  });

  it("makes the Mega pack of every type, each in one part", () => {
    const mega = PACKS.find((p) => p.scope === "mega")!;
    const kinds = mega.parts!.flatMap((p) => p.kinds);
    expect([...kinds].sort()).toEqual([...PACK_KINDS].sort());
    expect(packItemCount(mega)).toBe(PACK_KINDS.reduce((n, k) => n + packItemCount(completePack(k)), 0));
    expect(packFiles(mega)).toHaveLength(5);
    expect(packKey("fr", mega, "a4", 2)).toBe("fr/packs/pack-mega-part-2-a4.pdf");
    expect(packKey("en", completePack("missing-numbers"), "letter")).toBe("en/packs/missing-numbers-complete-pack-letter.pdf");
  });

  it("finds each pattern row's answer among its three choices", () => {
    // The same rule as the answer keys (scripts/sheets/patterns-layout.ts).
    const unit = { ab: 2, aab: 3, abb: 3, abc: 3, aabb: 4 };
    for (const sheet of sheetsOfKind("patterns") as PatternsSheet[]) {
      const { type, rows } = sheet.params;
      for (const row of rows) {
        if (!row.choices) continue;
        const i = row.cells.length - 1;
        const answer =
          type === "growing"
            ? { item: row.cells[i - 1]!.item, count: 2 * row.cells[i - 1]!.count - row.cells[i - 2]!.count }
            : row.cells[i % unit[type]]!;
        expect(row.choices.filter((c) => c.item === answer.item && c.count === answer.count), sheet.id).toHaveLength(1);
      }
    }
  });
});
