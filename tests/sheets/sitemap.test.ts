// Every page of the worksheet types (lib/sheets/catalog.ts) is in the
// sitemap in the four languages, with its hreflang twins.
import { describe, expect, it, vi } from "vitest";
import { absoluteUrl } from "@/lib/i18n/routes";
import { sheetCategoryParams } from "@/lib/sheets/catalog";
import { SHEET_LOCALES } from "@/lib/sheets/types";

vi.stubEnv("RELEASE_DATE", "2026-10-07T12:00:00.000Z");
vi.mock("next/cache", () => ({ unstable_cache: (fn: () => unknown) => fn }));
vi.mock("@/lib/prisma", () => ({ getPrisma: () => ({ story: { findMany: async () => [] } }) }));

const { sitemapEntries } = await import("@/lib/sitemap");
const entries = await sitemapEntries();
const byUrl = new Map(entries.map((e) => [e.url, e]));

describe("worksheet types in the sitemap", () => {
  it("lists every listing page and sheet in every language, with hreflang", () => {
    for (const l of SHEET_LOCALES) {
      for (const category of sheetCategoryParams(l)) {
        const url = absoluteUrl(l, "/worksheets/[category]", { category });
        const entry = byUrl.get(url);
        expect(entry, url).toBeDefined();
        expect(Object.keys(entry!.alternates?.languages ?? {}).sort(), url).toEqual(["en", "es", "fr", "pt", "x-default"]);
      }
    }
  });
});
