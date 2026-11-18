import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import {
  ORG_ID,
  PRO_PRICES_USD,
  buildAboutOrContactPageJsonLd,
  buildCollectionPageJsonLd,
  buildLocaleBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildProProductJsonLd,
  buildShortStoryJsonLd,
  buildStoriesBreadcrumbJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/json-ld";
import { gamesHubItems, sheetKindItems } from "@/lib/hub-json-ld";
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
    // A scene drawn by components/StoryIllustration.tsx is not a file.
    expect(buildShortStoryJsonLd("en", { ...story, coverUrl: "apple-1" })).not.toHaveProperty("image");
  });

  it("declares one organization, with the same @id, URL and logo in every language", () => {
    const org = buildOrganizationJsonLd("x");
    expect(org).toMatchObject({ "@type": "EducationalOrganization", "@id": "https://alphabes.com/#org", url: "https://alphabes.com", logo: { url: "https://alphabes.com/icon3" } });
    expect(org.sameAs).toEqual([]);
    expect(org.areaServed).toEqual(expect.arrayContaining(["US", "FR", "MX", "BR"]));
    // Other nodes point to it.
    expect(buildWebSiteJsonLd("fr").publisher["@id"]).toBe(ORG_ID);
  });

  it("builds breadcrumbs from each language's home", () => {
    expect(buildLocaleBreadcrumbJsonLd("es", [{ name: "Precios", url: "https://alphabes.com/es/precios" }]).itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://alphabes.com/es" },
      { "@type": "ListItem", position: 2, name: "Precios", item: "https://alphabes.com/es/precios" },
    ]);
    const story = buildStoriesBreadcrumbJsonLd("fr", { title: "Filou", slug: "filou-et-sa-balle" }).itemListElement;
    expect(story.map((c) => c.item)).toEqual(["https://alphabes.com/fr", "https://alphabes.com/fr/histoires", "https://alphabes.com/fr/histoires/filou-et-sa-balle"]);
  });

  it("lists a hub's pages in a CollectionPage, in the hub's language", () => {
    const items = gamesHubItems("pt", [{ title: "Encontre a letra", slug: "encontre-a-letra" }]);
    expect(items[0]).toEqual({ name: "Encontre a letra", url: "https://alphabes.com/pt/jogos/encontre-a-letra" });
    expect(items.at(-1)?.url).toBe("https://alphabes.com/pt/jogos/quebra-cabeca-deslizante");
    const page = buildCollectionPageJsonLd("pt", { name: "Jogos", description: "d", url: "https://alphabes.com/pt/jogos", items });
    expect(page).toMatchObject({ "@type": "CollectionPage", inLanguage: "pt-BR", mainEntity: { "@type": "ItemList", numberOfItems: items.length } });
    expect(sheetKindItems("fr").every((i) => i.url.startsWith("https://alphabes.com/fr/fiches/"))).toBe(true);
    // An item with no page of its own has no url.
    expect(buildCollectionPageJsonLd("en", { name: "n", description: "d", url: "u", items: [{ name: "a" }] }).mainEntity.itemListElement[0]).not.toHaveProperty("url");
    expect(buildAboutOrContactPageJsonLd("fr", "ContactPage", { name: "n", description: "d", url: "u" }).about["@id"]).toBe(ORG_ID);
  });
});
