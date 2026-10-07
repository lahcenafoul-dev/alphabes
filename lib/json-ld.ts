import type { Locale } from "@/i18n/routing";
import { HTML_LANG, SITE_URL, absoluteUrl } from "@/lib/i18n/routes";

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildLearningResourceJsonLd(worksheet: {
  title: string;
  description: string;
  url: string;
  skills: string[];
  ageLevelLabel: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: worksheet.title,
    description: worksheet.description,
    url: worksheet.url,
    learningResourceType: "Worksheet",
    educationalLevel: worksheet.ageLevelLabel,
    teaches: worksheet.skills.join(", "),
    isAccessibleForFree: true,
  };
}

export function buildArticleJsonLd(article: {
  headline: string;
  description: string;
  url: string;
  author: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: article.url,
    mainEntityOfPage: article.url,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "AlphaBes" },
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
  };
}

const ORGANIZATION = { "@type": "EducationalOrganization", name: "AlphaBes", url: SITE_URL };

/** The site itself, on each language's home page (lets Google show the site name). */
export function buildWebSiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AlphaBes",
    url: absoluteUrl(locale, "/"),
    inLanguage: HTML_LANG[locale],
    publisher: ORGANIZATION,
  };
}

// The Pro prices in US dollars, as PayPal bills them. The pricing page shows
// them from messages/*.json; tests/seo/json-ld.test.ts keeps the two in step.
export const PRO_PRICES_USD = { monthly: "7.99", yearly: "59.00" } as const;

/** AlphaBes Pro and its two plans, on the pricing page. */
export function buildProProductJsonLd(locale: Locale, plans: { description: string; monthlyName: string; yearlyName: string }) {
  const url = absoluteUrl(locale, "/pricing");
  const offer = (name: string, price: string, billingDuration: "P1M" | "P1Y", unitCode: "MON" | "ANN") => ({
    "@type": "Offer",
    name,
    price,
    priceCurrency: "USD",
    url,
    availability: "https://schema.org/InStock",
    priceSpecification: { "@type": "UnitPriceSpecification", price, priceCurrency: "USD", billingDuration, unitCode },
  });
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AlphaBes Pro",
    description: plans.description,
    brand: { "@type": "Brand", name: "AlphaBes" },
    image: `${SITE_URL}/opengraph-image`,
    url,
    offers: [
      offer(plans.monthlyName, PRO_PRICES_USD.monthly, "P1M", "MON"),
      offer(plans.yearlyName, PRO_PRICES_USD.yearly, "P1Y", "ANN"),
    ],
  };
}

/** A picture story, on its own page. */
export function buildShortStoryJsonLd(
  locale: Locale,
  story: {
    slug: string;
    title: string;
    coverUrl: string | null;
    ageRangeMin: number;
    ageRangeMax: number;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "ShortStory",
    name: story.title,
    url: absoluteUrl(locale, "/stories/[slug]", { slug: story.slug }),
    inLanguage: HTML_LANG[locale],
    ...(story.coverUrl && { image: new URL(story.coverUrl, SITE_URL).href }),
    audience: { "@type": "PeopleAudience", suggestedMinAge: story.ageRangeMin, suggestedMaxAge: story.ageRangeMax },
    isAccessibleForFree: !story.isPremium,
    publisher: ORGANIZATION,
    datePublished: story.createdAt.toISOString(),
    dateModified: story.updatedAt.toISOString(),
  };
}
