// SEO phase 4: no duplicate descriptions, titles within 60 characters and
// descriptions within 155, for every page built from the sheet and pack data
// (the families that had them), in the four languages.
import { describe, expect, it, vi } from "vitest";
import type { Metadata } from "next";
import { SHEETS, SHEET_KINDS } from "@/lib/sheets/catalog";
import { PACKS } from "@/lib/sheets/packs";
import { MAX_DESCRIPTION, MAX_TITLE, completeSocial, fitDescription, fitTitle } from "@/lib/social-metadata";
import { META_OVERRIDES } from "@/lib/seo/meta-overrides";

vi.mock("next/font/google", () => {
  const font = () => ({ className: "", variable: "", style: {} });
  return { Baloo_2: font, Nunito: font, Playwrite_BR: font, Playwrite_FR_Trad: font, Playwrite_MX: font };
});

const LOCALES = ["en", "fr", "es", "pt"] as const;
const shown = (m: Metadata) => ({ title: (m.title as { absolute: string }).absolute, description: String(m.description) });

describe("fitDescription", () => {
  it("leaves a description of 155 characters or less alone", () => {
    const d = "x".repeat(155);
    expect(fitDescription(d)).toBe(d);
  });

  it("drops whole sentences from the end until it fits, keeping the first", () => {
    const first = "Free telling time worksheet (half past), sheet 2: draw the hands for 3:30, 7:30 and 11:30.";
    expect(fitDescription(`${first} Answer key on page 2. ${"Another sentence. ".repeat(5)}`)).toBe(`${first} Answer key on page 2. Another sentence. Another sentence.`);
    expect(fitDescription(`${first} Y${"y".repeat(80)}.`)).toBe(first);
    // French, Spanish and Portuguese sentences start with accented capitals or ¿.
    expect(fitDescription(`${"a".repeat(100)}. ¿Qué hora es? B${"b".repeat(60)}.`)).toBe(`${"a".repeat(100)}. ¿Qué hora es?`);
  });

  it("is applied through completeSocial to the description and the social tags", () => {
    const long = `${"a".repeat(120)}. B${"b".repeat(60)}.`;
    const m = completeSocial("en", { title: "T", description: long, alternates: { canonical: "https://alphabes.com/x" } });
    expect(m.description).toBe(`${"a".repeat(120)}.`);
    expect(m.openGraph?.description).toBe(`${"a".repeat(120)}.`);
    expect(m.twitter?.description).toBe(`${"a".repeat(120)}.`);
  });
});

describe("fitTitle for Pro packs", () => {
  it("shortens, then drops, the (AlphaBes Pro) suffix", () => {
    expect(fitTitle("Mazes Pack: Easy | Printable PDF (AlphaBes Pro)")).toBe("Mazes Pack: Easy | Printable PDF (AlphaBes Pro) | AlphaBes");
    expect(fitTitle("Body Parts Pack: Animals and a plant | Printable PDF (AlphaBes Pro)")).toBe("Body Parts Pack: Animals and a plant (Pro PDF) | AlphaBes");
    expect(fitTitle("Pack Apprendre à dessiner : Aliments et nature | PDF à imprimer (AlphaBes Pro)")).toBe(
      "Pack Apprendre à dessiner : Aliments et nature (PDF Pro)",
    );
  });
});

describe("worksheet pages (lib/sheets)", async () => {
  const { sheetMetadata } = await import("@/components/sheets/SheetPages");

  for (const locale of LOCALES) {
    it(`${locale}: titles ≤ 60, descriptions ≤ 155, no two sheets share a description`, () => {
      const seen = new Map<string, string>();
      for (const sheet of SHEETS) {
        const slug = sheet.slug[locale];
        const m = shown(completeSocial(locale, sheetMetadata(locale, slug)));
        expect(m.title.length, `${slug}: ${m.title}`).toBeLessThanOrEqual(MAX_TITLE);
        expect(m.description.length, `${slug}: ${m.description}`).toBeLessThanOrEqual(MAX_DESCRIPTION);
        expect(seen.get(m.description), `${slug} and ${seen.get(m.description)}: ${m.description}`).toBeUndefined();
        seen.set(m.description, slug);
      }
    });
  }

  it("keeps the worksheet type listing pages within 60 / 155 characters", () => {
    for (const locale of LOCALES) {
      for (const kind of SHEET_KINDS) {
        const slug = kind.slug[locale];
        const base = sheetMetadata(locale, slug);
        const m = shown(completeSocial(locale, { ...base, alternates: { ...base.alternates, canonical: String(base.openGraph?.url) } }));
        expect(m.title.length, `${locale} ${slug}: ${m.title}`).toBeLessThanOrEqual(MAX_TITLE);
        expect(m.description.length, `${locale} ${slug}: ${m.description}`).toBeLessThanOrEqual(MAX_DESCRIPTION);
      }
    }
  });

  it("names the sheet's own times in each telling time description", () => {
    const sheet = SHEETS.find((s) => s.id === "time-draw-half-2")!;
    const m = shown(completeSocial("en", sheetMetadata("en", sheet.slug.en)));
    const times = (sheet.params as { times: [number, number][] }).times.map(([h, mm]) => `${h}:${String(mm).padStart(2, "0")}`);
    for (const t of times) expect(m.description).toContain(t);
    expect(m.description).toContain("sheet 2");
  });

  it("keeps the H1 whole when only the SEO title is shortened", () => {
    const sheet = SHEETS.find((s) => s.id === "aabb-seasons-circle")!;
    expect(sheet.title.fr).toBe("Suite logique AABB avec la météo et les saisons : qu'est-ce qui vient après ?");
    expect(sheet.metaTitle?.fr).toBe("Suite logique AABB avec les saisons : que vient-il après ?");
  });
});

describe("Pro pack pages", async () => {
  const { packMetadata } = await import("@/components/sheets/ProPacks");
  const { absoluteUrl } = await import("@/lib/i18n/routes");

  for (const locale of LOCALES) {
    it(`${locale}: titles ≤ 60, descriptions ≤ 155, all different`, () => {
      const descriptions = new Set<string>();
      for (const pack of PACKS) {
        const base = packMetadata(locale, pack.slug[locale]);
        const m = shown(completeSocial(locale, { ...base, alternates: { ...base.alternates, canonical: absoluteUrl(locale, "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug[locale] }) } }));
        expect(m.title.length, `${pack.slug[locale]}: ${m.title}`).toBeLessThanOrEqual(MAX_TITLE);
        expect(m.description.length, `${pack.slug[locale]}: ${m.description}`).toBeLessThanOrEqual(MAX_DESCRIPTION);
        descriptions.add(m.description);
      }
      expect(descriptions.size).toBe(PACKS.length);
    });
  }
});

describe("META_OVERRIDES after fitting", () => {
  it("shows every override description within 155 characters", () => {
    for (const [path, { description }] of Object.entries(META_OVERRIDES)) {
      if (description) expect(fitDescription(description).length, `${path}: ${description}`).toBeLessThanOrEqual(MAX_DESCRIPTION);
    }
  });

  it("gives the 8 short titles a real title", () => {
    for (const path of ["/contact", "/es/contacto", "/pt/contato", "/es/quienes-somos", "/pt/quem-somos", "/refunds", "/cookies", "/pt/termos-de-uso"]) {
      expect(META_OVERRIDES[path]?.title?.length ?? 0, path).toBeGreaterThanOrEqual(30);
    }
  });
});
