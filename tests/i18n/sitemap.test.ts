import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { AREA_LASTMOD, areaOf } from "@/lib/sitemap-lastmod";
import { STORIES_UPDATED } from "@/lib/stories";

const { sitemapEntries: sitemap, sitemapEntriesFor, sitemapIndexXml, sitemapXml, localeOfUrl } = await import("@/lib/sitemap");

describe("sitemap lastmod", () => {
  it("gives pages in the code their area's fixed date, and stories theirs (never the build time)", async () => {
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(4000);
    for (const e of entries) {
      const area = areaOf(e.url);
      const expected = area === "stories" && /\/(stories|histoires|cuentos|historias)\/./.test(e.url) ? STORIES_UPDATED.slice(0, 10) : AREA_LASTMOD[area ?? "?"];
      expect(e.lastModified, e.url).toBe(expected);
      expect(String(e.lastModified)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(entries.filter((e) => /\/stories\/./.test(e.url))).toHaveLength(24);
  });

  it("writes hreflang links after <priority>, as the sitemap XSD requires", async () => {
    const xml = sitemapXml(await sitemap());
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n')).toBe(true);
    const urls = xml.match(/<url>[\s\S]*?<\/url>/g)!;
    expect(urls.length).toBe((await sitemap()).length);
    const order = /^<url>\n<loc>[^<]+<\/loc>\n(<lastmod>[^<]+<\/lastmod>\n)?(<changefreq>[^<]+<\/changefreq>\n)?(<priority>[^<]+<\/priority>\n)?(<xhtml:link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n)*<\/url>$/;
    for (const u of urls) expect(u).toMatch(order);
    expect(urls.some((u) => u.includes("<xhtml:link"))).toBe(true);
  });

  it("escapes XML special characters", () => {
    const xml = sitemapXml([{ url: "https://alphabes.com/a?b=1&c=<2>", alternates: { languages: { en: "https://alphabes.com/a?b=1&c=2" } } }]);
    expect(xml).toContain("<loc>https://alphabes.com/a?b=1&amp;c=&lt;2&gt;</loc>");
    expect(xml).toContain('href="https://alphabes.com/a?b=1&amp;c=2"');
  });

});

describe("sitemap index", () => {
  it("splits every URL into exactly one language sitemap, keeping hreflang", async () => {
    const all = await sitemap();
    const parts = await Promise.all(routing.locales.map((l) => sitemapEntriesFor(l)));
    expect(parts.reduce((n, p) => n + p.length, 0)).toBe(all.length);
    routing.locales.forEach((l, i) => {
      expect(parts[i].length).toBeGreaterThan(900);
      for (const e of parts[i]) expect(localeOfUrl(e.url)).toBe(l);
    });
    expect(parts[1].find((e) => e.url === "https://alphabes.com/fr/alphabet/a")?.alternates?.languages).toMatchObject({
      en: "https://alphabes.com/alphabet/a",
      fr: "https://alphabes.com/fr/alphabet/a",
    });
  });

  it("lists the 4 language sitemaps", async () => {
    const xml = await sitemapIndexXml();
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')).toBe(true);
    for (const l of routing.locales) {
      expect(xml).toMatch(new RegExp(`<loc>https://alphabes\\.com/sitemap-${l}\\.xml</loc>\\n<lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>`));
    }
    expect(xml.match(/<sitemap>/g)).toHaveLength(4);
  });
});
