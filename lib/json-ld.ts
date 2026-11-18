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
  image?: string;
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
    ...(worksheet.image && { image: worksheet.image }),
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
    publisher: ORGANIZATION,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
  };
}

// One organization for the whole site, the same @id in every language: the
// full description is in every page's <body> (components/LocaleDocument.tsx),
// and other nodes (WebSite, Article, ShortStory…) point to it by @id.
export const ORG_ID = `${SITE_URL}/#org`;
// The owl at 512 px (app/icon3.tsx); Google wants a square logo of at least 112 px.
export const ORG_LOGO = { url: `${SITE_URL}/icon3`, width: 512, height: 512 };
// The site's social profiles. None yet: add their URLs here when they exist.
export const ORG_SAME_AS: string[] = [];
// Where the families of each language live.
const AREA_SERVED: Record<Locale, string[]> = {
  en: ["US", "CA", "GB"],
  fr: ["FR", "MA", "BE", "CH", "CA"],
  es: ["MX", "US", "CO", "AR", "PE", "CL", "VE", "EC", "GT", "ES"],
  pt: ["BR", "PT", "AO", "MZ"],
};

/** A reference to the organization, for publisher/author fields. */
const ORGANIZATION = { "@type": "EducationalOrganization", "@id": ORG_ID, name: "AlphaBes", url: SITE_URL };

/**
 * The organization itself, on every page. Everything but the description is
 * the same in all four languages (same @id, URL, logo, countries), so search
 * engines see one organization, not four.
 */
export function buildOrganizationJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: "AlphaBes",
    url: SITE_URL,
    logo: { "@type": "ImageObject", ...ORG_LOGO },
    description,
    areaServed: [...new Set(Object.values(AREA_SERVED).flat())],
    sameAs: ORG_SAME_AS,
  };
}

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
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "ShortStory",
    name: story.title,
    url: absoluteUrl(locale, "/stories/[slug]", { slug: story.slug }),
    ...(story.description && { description: story.description }),
    inLanguage: HTML_LANG[locale],
    // Covers drawn by components/StoryIllustration.tsx are scene names
    // ("apple-1"), not files: only a real path or URL is an image.
    ...(story.coverUrl && /^(\/|https?:\/\/)/.test(story.coverUrl) && { image: new URL(story.coverUrl, SITE_URL).href }),
    audience: { "@type": "PeopleAudience", suggestedMinAge: story.ageRangeMin, suggestedMaxAge: story.ageRangeMax },
    isAccessibleForFree: !story.isPremium,
    publisher: ORGANIZATION,
    datePublished: story.createdAt.toISOString(),
    dateModified: story.updatedAt.toISOString(),
  };
}

type Crumb = { name: string; url: string };

/**
 * A hub page listing other pages (worksheets, games, flashcards, blog…):
 * CollectionPage whose mainEntity is the ItemList of what it links to.
 */
export function buildCollectionPageJsonLd(
  locale: Locale,
  page: { name: string; description: string; url: string; items: { name: string; url?: string }[] },
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.name,
    description: page.description,
    url: page.url,
    inLanguage: HTML_LANG[locale],
    isPartOf: { "@type": "WebSite", url: absoluteUrl(locale, "/") },
    publisher: ORGANIZATION,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: page.items.length,
      itemListElement: page.items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, ...(item.url && { url: item.url }) })),
    },
  };
}

/** The about page (AboutPage) or the contact page (ContactPage), about the organization. */
export function buildAboutOrContactPageJsonLd(
  locale: Locale,
  type: "AboutPage" | "ContactPage",
  page: { name: string; description: string; url: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: page.name,
    description: page.description,
    url: page.url,
    inLanguage: HTML_LANG[locale],
    isPartOf: { "@type": "WebSite", url: absoluteUrl(locale, "/") },
    about: ORGANIZATION,
  };
}

// The home's name in breadcrumbs, as the visible breadcrumbs write it.
const HOME_CRUMB: Record<Locale, string> = { en: "Home", fr: "Accueil", es: "Inicio", pt: "Início" };

/** Home > … > this page, with the home in the page's language. */
export function buildLocaleBreadcrumbJsonLd(locale: Locale, trail: Crumb[]) {
  return buildBreadcrumbJsonLd([{ name: HOME_CRUMB[locale], url: absoluteUrl(locale, "/") }, ...trail]);
}

// The stories hub's name, as its visible breadcrumbs write it.
const STORIES_CRUMB: Record<Locale, string> = { en: "Story Time", fr: "Histoires", es: "Cuentos", pt: "Histórias" };

/** Home > Stories, and > the story itself on a story's page. */
export function buildStoriesBreadcrumbJsonLd(locale: Locale, story?: { title: string; slug: string }) {
  return buildLocaleBreadcrumbJsonLd(locale, [
    { name: STORIES_CRUMB[locale], url: absoluteUrl(locale, "/stories") },
    ...(story ? [{ name: story.title, url: absoluteUrl(locale, "/stories/[slug]", { slug: story.slug }) }] : []),
  ]);
}
