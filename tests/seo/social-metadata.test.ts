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
      title: "Tarifs",
      description: "Les formules.",
      images: siteImage,
    });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", title: "Tarifs", description: "Les formules.", images: siteImage });
    expect(m.title).toBe("Tarifs");
  });

  it("keeps what the page sets itself, but always uses the canonical as og:url", () => {
    const page: Metadata = {
      title: { absolute: "Post | AlphaBes Blog" },
      alternates: { canonical: "https://alphabes.com/blog/x" },
      openGraph: { title: "Post", url: "https://alphabes.com", type: "article", images: ["https://alphabes.com/p.jpg"] },
    };
    const m = completeSocial("en", page, siteImage);
    expect(m.openGraph).toMatchObject({ type: "article", title: "Post", url: "https://alphabes.com/blog/x", images: ["https://alphabes.com/p.jpg"], locale: "en_US" });
    expect(m.twitter).toMatchObject({ title: "Post", images: ["https://alphabes.com/p.jpg"] });
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
