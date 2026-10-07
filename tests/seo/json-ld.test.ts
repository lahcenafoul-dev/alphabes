import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { PRO_PRICES_USD, buildProProductJsonLd, buildShortStoryJsonLd, buildWebSiteJsonLd } from "@/lib/json-ld";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import es from "@/messages/es.json";
import pt from "@/messages/pt.json";

const messages = { en, fr, es, pt };
// "$7.99", "7,99 $", "US$ 59" → 7.99, 59
const amount = (shown: string) => Number(shown.replace(/[^\d,.]/g, "").replace(",", "."));

// docs/seo-audit.md M10.
describe("structured data", () => {
  it("prices the Pro offers exactly as each pricing page shows them", () => {
    for (const locale of routing.locales) {
      const { monthly, annual } = messages[locale].Pricing;
      expect(amount(monthly.price), locale).toBe(Number(PRO_PRICES_USD.monthly));
      expect(amount(annual.price), locale).toBe(Number(PRO_PRICES_USD.yearly));
      const ld = buildProProductJsonLd(locale, { description: "d", monthlyName: monthly.name, yearlyName: annual.name });
      expect(ld.offers.map((o) => [o.name, o.price, o.priceCurrency])).toEqual([
        [monthly.name, "7.99", "USD"],
        [annual.name, "59.00", "USD"],
      ]);
    }
    expect(buildProProductJsonLd("fr", { description: "d", monthlyName: "m", yearlyName: "y" }).url).toBe("https://alphabes.com/fr/tarifs");
  });

  it("describes each language's site with its own home URL and language", () => {
    expect(buildWebSiteJsonLd("en")).toMatchObject({ "@type": "WebSite", url: "https://alphabes.com", inLanguage: "en" });
    expect(buildWebSiteJsonLd("pt")).toMatchObject({ url: "https://alphabes.com/pt", inLanguage: "pt-BR" });
  });

  it("describes a story under its own URL", () => {
    const story = {
      slug: "la-petite-pomme",
      title: "La petite pomme",
      coverUrl: "/stories/pomme.png",
      ageRangeMin: 3,
      ageRangeMax: 6,
      isPremium: false,
      createdAt: new Date("2026-09-01T00:00:00Z"),
      updatedAt: new Date("2026-09-02T00:00:00Z"),
    };
    expect(buildShortStoryJsonLd("fr", story)).toMatchObject({
      "@type": "ShortStory",
      name: "La petite pomme",
      url: "https://alphabes.com/fr/histoires/la-petite-pomme",
      inLanguage: "fr",
      image: "https://alphabes.com/stories/pomme.png",
      audience: { suggestedMinAge: 3, suggestedMaxAge: 6 },
      isAccessibleForFree: true,
    });
    expect(buildShortStoryJsonLd("en", { ...story, coverUrl: null })).not.toHaveProperty("image");
  });
});
