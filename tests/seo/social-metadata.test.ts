import { describe, expect, it } from "vitest";
import type { Metadata } from "next";
import { completeSocial, withSocialMetadata } from "@/lib/social-metadata";

const siteImage = [{ url: new URL("https://alphabes.com/opengraph-image?abc"), width: 1200, height: 630 }];

// docs/seo-audit.md I5, I6, M3, M4.
describe("completeSocial", () => {
  it("fills a page that sets no openGraph from its own title, description and canonical", () => {
    const m = completeSocial(
      "fr",
      { title: "Tarifs", description: "Les formules.", alternates: { canonical: "https://alphabes.com/fr/tarifs" } },
      siteImage,
    );
    expect(m.openGraph).toMatchObject({
      type: "website",
      siteName: "AlphaBes",
      locale: "fr_FR",
      url: "https://alphabes.com/fr/tarifs",
      title: "AlphaBes Pro : formules et tarifs",
      images: siteImage,
    });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", title: "AlphaBes Pro : formules et tarifs", images: siteImage });
    // The rewritten title (lib/seo/meta-overrides.ts), fitted with the brand.
    expect(m.title).toEqual({ absolute: "AlphaBes Pro : formules et tarifs | AlphaBes" });
  });

  it("keeps what the page sets itself, but always uses the canonical as og:url", () => {
    const page: Metadata = {
      title: { absolute: "Post | AlphaBes Blog" },
      alternates: { canonical: "https://alphabes.com/blog/x" },
      openGraph: { title: "Post", url: "https://alphabes.com", type: "article", images: ["https://alphabes.com/p.jpg"] },
    };
    const m = completeSocial("en", page, siteImage);
    expect(m.openGraph).toMatchObject({ type: "article", title: "Post", url: "https://alphabes.com/blog/x", images: [{ url: "https://alphabes.com/p.jpg", alt: "Post" }], locale: "en_US" });
    expect(m.twitter).toMatchObject({ title: "Post", images: [{ url: "https://alphabes.com/p.jpg", alt: "Post" }] });
  });

  it("gives every image an alt: its own, or else the page's share title", () => {
    const own = completeSocial("fr", { title: "Tarifs", openGraph: { images: [{ url: "https://alphabes.com/a.jpg", alt: "Une fiche" }] } });
    expect(own.openGraph?.images).toEqual([{ url: "https://alphabes.com/a.jpg", alt: "Une fiche" }]);
    const site = completeSocial("fr", { title: "Tarifs", alternates: { canonical: "https://alphabes.com/fr/tarifs" } }, siteImage);
    expect(site.openGraph?.images).toEqual([{ ...siteImage[0], alt: "AlphaBes Pro : formules et tarifs" }]);
    expect(site.twitter?.images).toEqual([{ ...siteImage[0], alt: "AlphaBes Pro : formules et tarifs" }]);
    // The inherited site image's English alt is replaced by the page's title.
    const inherited = completeSocial("fr", { title: "Jeux", alternates: { canonical: "https://alphabes.com/fr/jeux" } }, [{ ...siteImage[0], alt: "AlphaBes: free alphabet games" }]);
    expect((inherited.openGraph?.images as { alt: string }[])[0].alt).not.toBe("AlphaBes: free alphabet games");
  });

  it("lists the page's other languages as og:locale:alternate", () => {
    const languages = { en: "https://alphabes.com/alphabet", fr: "https://alphabes.com/fr/alphabet", es: "https://alphabes.com/es/abecedario", pt: "https://alphabes.com/pt/alfabeto", "x-default": "https://alphabes.com/alphabet" };
    const m = completeSocial("fr", { alternates: { canonical: languages.fr, languages } });
    expect((m.openGraph as { alternateLocale: string[] }).alternateLocale).toEqual(["en_US", "es_LA", "pt_BR"]);
    // A page with no twin has none.
    expect(completeSocial("fr", { alternates: { canonical: languages.fr } }).openGraph).not.toHaveProperty("alternateLocale");
  });

  it("uses each language's Open Graph locale", () => {
    const og = (l: "en" | "fr" | "es" | "pt") => (completeSocial(l, {}).openGraph as { locale: string }).locale;
    expect([og("en"), og("fr"), og("es"), og("pt")]).toEqual(["en_US", "fr_FR", "es_LA", "pt_BR"]);
  });
});

describe("withSocialMetadata", () => {
  it("passes the inherited site image and the page's language", async () => {
    const generate = withSocialMetadata(async () => ({ title: "Precios", alternates: { canonical: "https://alphabes.com/es/precios" } }));
    const parent = Promise.resolve({ openGraph: { images: siteImage } }) as never;
    const m = await generate({ params: Promise.resolve({ locale: "es" }) }, parent);
    expect(m.openGraph).toMatchObject({ locale: "es_LA", url: "https://alphabes.com/es/precios", images: siteImage });
  });
});
