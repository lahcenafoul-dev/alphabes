import type { MetadataRoute } from "next";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { ACCENTS_SLUG, frenchLetters, isAccentLetter } from "@/lib/letters-fr";
import { TILDE_SLUG } from "@/lib/letters-es";
import { ACENTOS_SLUG as PT_ACENTOS_SLUG, CEDILHA_SLUG } from "@/lib/letters-pt";
import { portugueseSyllablePages } from "@/lib/silabas-pt";
import { atividadeCategoryParams, atividadePacks } from "@/lib/atividades-pt";
import { portugueseGames } from "@/lib/jogos-pt";
import { schoolTopicsPt } from "@/lib/escola-pt";
import { spanishSyllablePages } from "@/lib/silabas-es";
import { fichaCategoryParams, fichaPacks } from "@/lib/fichas-es";
import { phonicsSkills } from "@/lib/phonics-data";
import { games } from "@/lib/games-data";
import { numberGames } from "@/lib/number-games";
import { frenchSounds } from "@/lib/sons-fr";
import { FICHE_CATEGORIES, fichePacks, fiches } from "@/lib/fiches-fr";
import { frenchGames } from "@/lib/games-fr";
import { schoolTopics } from "@/lib/ecole-fr";
import { spanishGames } from "@/lib/juegos-es";
import { SHEETS, SHEET_KINDS } from "@/lib/sheets/catalog";
import { PUZZLES } from "@/lib/puzzles";
import { schoolTopicsEs } from "@/lib/escuela-es";
import { worksheetCategories } from "@/lib/worksheet-categories";
import { WORKSHEET_TYPES } from "@/lib/worksheet-types";
import { worksheets } from "@/lib/worksheets-data";
import { bundles } from "@/lib/worksheet-bundles";
// The blog category pages are noindex (app/[locale]/blog/[slug]/page.tsx).
import { blogPosts } from "@/lib/blog-data";
import { staticWorksheetCategories } from "@/lib/static-worksheet-categories";
import { staticWorksheets } from "@/lib/static-worksheets-data";
import { preschoolTopics } from "@/lib/preschool-data";
import { kindergartenTopics } from "@/lib/kindergarten-data";
import { STORIES_UPDATED, storiesFor } from "@/lib/stories";
import { lastmodFor } from "@/lib/sitemap-lastmod";
import { PACKS } from "@/lib/sheets/packs";
import { routing } from "@/i18n/routing";
import {
  NOINDEX_PATHNAMES,
  SITE_URL,
  absoluteUrl,
  alternatesFor,
  counterpartPath,
  isAvailable,
  matchPath,
} from "@/lib/i18n/routes";

const baseUrl = SITE_URL;

// Each story under its own language's URL, from prisma/stories-v2 (no
// database, so the whole sitemap is built at build time); stories with twins
// in other languages list each other as alternates.
function getStoryRoutes(): MetadataRoute.Sitemap {
  const all = routing.locales.flatMap((locale) => storiesFor(locale));
  const urlOf = (s: (typeof all)[number]) => absoluteUrl(s.locale, "/stories/[slug]", { slug: s.slug });
  return all.map((s) => {
    const group = all.filter((o) => o.translationGroup === s.translationGroup);
    const languages: Record<string, string> = {};
    for (const l of routing.locales) {
      const twin = group.find((o) => o.locale === l);
      if (twin) languages[l] = urlOf(twin);
    }
    if (languages.en) languages["x-default"] = languages.en;
    return {
      url: urlOf(s),
      lastModified: STORIES_UPDATED.slice(0, 10),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...(Object.keys(languages).length > 2 && { alternates: { languages } }),
      images: [new URL(s.coverUrl, SITE_URL).href],
    };
  });
}

export async function sitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/alphabet",
    "/numbers",
    "/phonics",
    "/preschool",
    "/kindergarten",
    "/worksheets",
    "/games",
    "/stories",
    "/flashcards",
    "/activities",
    "/pricing",
    "/blog",
    "/about",
    "/contact",
    "/privacy-policy",
    "/refunds",
    "/terms",
    "/cookies",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const letterRoutes = getAllLetterSlugs().map((letter) => ({
    url: `${baseUrl}/alphabet/${letter}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // One printable page per letter; withTwins adds the French, Spanish and
  // Portuguese ones.
  const letterWorksheetRoutes = getAllLetterSlugs().map((letter) => ({
    url: `${baseUrl}/alphabet/${letter}/worksheet`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const gameRoutes = games.map((g) => ({
    url: `${baseUrl}/games/${g.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // The number games; withTwins adds the other languages.
  const numberGameRoutes = numberGames("en").map((g) => ({
    url: `${baseUrl}/games/${g.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // The sliding puzzles and their listing; withTwins adds the other languages.
  const puzzleRoutes = ["", ...PUZZLES.map((p) => `/${p.slug.en}`)].map((path) => ({
    url: `${baseUrl}/games/sliding-puzzle${path}`,
    changeFrequency: "monthly" as const,
    priority: path ? 0.6 : 0.7,
  }));

  const phonicsRoutes = phonicsSkills.map((s) => ({
    url: `${baseUrl}/phonics/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const worksheetCategoryRoutes = worksheetCategories.map((c) => ({
    url: `${baseUrl}/worksheets/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const worksheetTypeCategoryRoutes = WORKSHEET_TYPES.map((t) => ({
    url: `${baseUrl}/worksheets/${t.categorySlug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const worksheetDetailRoutes = worksheets.map((w) => ({
    url: `${baseUrl}/worksheets/${w.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // The worksheet types of lib/sheets/catalog.ts; withTwins adds the French,
  // Spanish and Portuguese pages.
  const sheetRoutes = [
    ...SHEET_KINDS.map((k) => ({ slug: k.slug.en, priority: 0.7 })),
    ...SHEETS.map((s) => ({ slug: s.slug.en, priority: 0.6 })),
  ].map(({ slug, priority }) => ({
    url: `${baseUrl}/worksheets/${slug}`,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const bundleRoutes = [
    { url: `${baseUrl}/worksheets/bundles`, changeFrequency: "weekly" as const, priority: 0.6 },
    ...bundles.map((b) => ({
      url: `${baseUrl}/worksheets/bundles/${b.slug}`,
        changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const blogRoutes = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const staticWorksheetCategoryRoutes = staticWorksheetCategories.map((c) => ({
    url: `${baseUrl}/worksheets/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticWorksheetDetailRoutes = staticWorksheets.map((w) => ({
    url: `${baseUrl}/worksheets/${w.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const preschoolRoutes = preschoolTopics.map((t) => ({
    url: `${baseUrl}/preschool/${t.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const kindergartenRoutes = kindergartenTopics.map((t) => ({
    url: `${baseUrl}/kindergarten/${t.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const englishEntries: MetadataRoute.Sitemap = [
    ...staticRoutes,
    ...letterRoutes,
    ...letterWorksheetRoutes,
    ...gameRoutes,
    ...numberGameRoutes,
    ...puzzleRoutes,
    ...phonicsRoutes,
    ...worksheetCategoryRoutes,
    ...worksheetTypeCategoryRoutes,
    ...worksheetDetailRoutes,
    ...sheetRoutes,
    ...bundleRoutes,
    ...blogRoutes,
    ...staticWorksheetCategoryRoutes,
    ...staticWorksheetDetailRoutes,
    ...preschoolRoutes,
    ...kindergartenRoutes,
  ];

  // Games with no English twin (the clapping game exists only in Spanish and
  // Portuguese); the others come with their English twin through withTwins.
  const gameEntries = (locale: "fr" | "es" | "pt", slugs: string[]): MetadataRoute.Sitemap =>
    slugs.flatMap((slug) => {
      const { canonical, languages } = alternatesFor(locale, "/games/[slug]", { slug });
      if (languages && "en" in languages) return [];
      return [
        {
          url: canonical as string,
                changeFrequency: "monthly" as const,
          priority: 0.6,
          ...(languages && { alternates: { languages: languages as Record<string, string> } }),
        },
      ];
    });
  const frenchGameEntries = gameEntries("fr", frenchGames.map((g) => g.slug));
  const spanishGameEntries = gameEntries("es", spanishGames.map((g) => g.slug));
  const portugueseGameEntries = gameEntries("pt", portugueseGames.map((g) => g.slug));

  // Pages with no English twin: the letters with accents and their worksheets, the accents page,
  // the French sound pages, the French worksheets and packs, and the school
  // topics written only in French.
  const frenchOnlyEntries: MetadataRoute.Sitemap = [
    ...[...frenchLetters.filter(isAccentLetter).map((l) => l.slug), ACCENTS_SLUG].map((letter) => ({
      url: absoluteUrl("fr", "/alphabet/[letter]", { letter }),
        changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...frenchLetters.filter(isAccentLetter).map((l) => l.slug).map((letter) => ({
      url: absoluteUrl("fr", "/alphabet/[letter]/worksheet", { letter }),
        changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...frenchSounds.map((s) => ({
      url: absoluteUrl("fr", "/phonics/[skill]", { skill: s.slug }),
        changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...[...FICHE_CATEGORIES.map((c) => c.slug), ...fiches.map((f) => f.slug)].map((category) => ({
      url: absoluteUrl("fr", "/worksheets/[category]", { category }),
        changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...fichePacks.map((p) => ({
      url: absoluteUrl("fr", "/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug }),
        changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...schoolTopics
      .filter((t) => !t.en)
      .map((t) => ({
        url: absoluteUrl("fr", t.level === "maternelle" ? "/preschool/[topic]" : "/kindergarten/[topic]", { topic: t.slug }),
            changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];

  // Spanish pages with no twin: the ñ and its worksheet, the tilde page, the syllable pages,
  // the Spanish worksheets and packs, and the school topics written only in
  // Spanish.
  const spanishOnlyEntries: MetadataRoute.Sitemap = [
    ...["enie", TILDE_SLUG].map((letter) => ({
      url: absoluteUrl("es", "/alphabet/[letter]", { letter }),
        changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...["enie"].map((letter) => ({
      url: absoluteUrl("es", "/alphabet/[letter]/worksheet", { letter }),
        changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...spanishSyllablePages.map((p) => ({
      url: absoluteUrl("es", "/phonics/[skill]", { skill: p.slug }),
        changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...fichaCategoryParams().map((category) => ({
      url: absoluteUrl("es", "/worksheets/[category]", { category }),
        changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...fichaPacks.map((p) => ({
      url: absoluteUrl("es", "/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug }),
        changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...schoolTopicsEs
      .filter((t) => !t.en)
      .map((t) => ({
        url: absoluteUrl("es", t.level === "preescolar" ? "/preschool/[topic]" : "/kindergarten/[topic]", { topic: t.slug }),
            changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];

  // Portuguese pages with no twin: the Ç and its worksheet, the accents page, the syllable
  // pages, the worksheets and packs, and the school topics written only in
  // Portuguese.
  const portugueseOnlyEntries: MetadataRoute.Sitemap = [
    ...[CEDILHA_SLUG, PT_ACENTOS_SLUG].map((letter) => ({
      url: absoluteUrl("pt", "/alphabet/[letter]", { letter }),
        changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...[CEDILHA_SLUG].map((letter) => ({
      url: absoluteUrl("pt", "/alphabet/[letter]/worksheet", { letter }),
        changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...portugueseSyllablePages.map((p) => ({
      url: absoluteUrl("pt", "/phonics/[skill]", { skill: p.slug }),
        changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...atividadeCategoryParams().map((category) => ({
      url: absoluteUrl("pt", "/worksheets/[category]", { category }),
        changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...atividadePacks.map((p) => ({
      url: absoluteUrl("pt", "/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug }),
        changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...schoolTopicsPt
      .filter((t) => !t.en)
      .map((t) => ({
        url: absoluteUrl("pt", t.level === "educacao-infantil" ? "/preschool/[topic]" : "/kindergarten/[topic]", { topic: t.slug }),
            changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];

  // The Pro packs' pages, in every language (their slugs differ by language).
  const packEntries = routing.locales.flatMap((locale) =>
    PACKS.map((p) => ({
      url: absoluteUrl(locale, "/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug[locale] }),
        changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  const codeEntries = [
    ...withTwins(englishEntries),
    ...frenchGameEntries,
    ...spanishGameEntries,
    ...portugueseGameEntries,
    ...frenchOnlyEntries,
    ...spanishOnlyEntries,
    ...portugueseOnlyEntries,
    ...packEntries,
  ].map((e) => ({ ...e, lastModified: lastmodFor(e.url) }));

  return [...codeEntries, ...getStoryRoutes()];
}

/** The language of a site URL, from its prefix. */
export function localeOfUrl(url: string): (typeof routing.locales)[number] {
  const first = url.slice(SITE_URL.length).split("/")[1];
  return routing.locales.find((l) => l !== "en" && l === first) ?? "en";
}

/** One language's entries (each keeps its hreflang alternates). */
export async function sitemapEntriesFor(locale: (typeof routing.locales)[number]): Promise<MetadataRoute.Sitemap> {
  return (await sitemapEntries()).filter((e) => localeOfUrl(e.url) === locale);
}

/** The sitemap index: one child sitemap per language. */
export async function sitemapIndexXml(): Promise<string> {
  const entries = await sitemapEntries();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const locale of routing.locales) {
    // The newest page of that language.
    const latest = entries
      .filter((e) => localeOfUrl(e.url) === locale)
      .map((e) => String(e.lastModified))
      .sort()
      .at(-1);
    xml += `<sitemap>\n<loc>${SITE_URL}/sitemap-${locale}.xml</loc>\n${latest ? `<lastmod>${latest}</lastmod>\n` : ""}</sitemap>\n`;
  }
  return xml + "</sitemapindex>\n";
}

// Every English page that also exists in other languages gets hreflang
// alternates, and each twin URL is listed as an entry of its own.
function withTwins(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const entry of entries) {
    const path = entry.url.slice(SITE_URL.length) || "/";
    const match = matchPath(path);
    const twins: Record<string, string> = {};
    if (match && !NOINDEX_PATHNAMES.has(match.pathname)) {
      for (const l of routing.locales) {
        if (l === "en" || !isAvailable(l, match.pathname)) continue;
        const twinPath = counterpartPath(match, l);
        if (twinPath) twins[l] = `${SITE_URL}${twinPath}`;
      }
    }
    if (!Object.keys(twins).length) {
      out.push(entry);
      continue;
    }
    const languages = { en: entry.url, ...twins, "x-default": entry.url };
    out.push({ ...entry, alternates: { languages } });
    for (const url of Object.values(twins)) out.push({ ...entry, url, alternates: { languages } });
  }
  return out;
}

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

// The same XML as Next's built-in sitemap, except that the hreflang
// <xhtml:link> elements come after <priority>: the sitemap 0.9 XSD only
// allows other namespaces at the end of <url>, and Next writes them right
// after <loc>.
export function sitemapXml(entries: MetadataRoute.Sitemap): string {
  const hasAlternates = entries.some((e) => Object.keys(e.alternates?.languages ?? {}).length > 0);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${hasAlternates ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : ""}>\n`;
  for (const e of entries) {
    xml += `<url>\n<loc>${escapeXml(e.url)}</loc>\n`;
    if (e.lastModified) {
      xml += `<lastmod>${e.lastModified instanceof Date ? e.lastModified.toISOString() : e.lastModified}</lastmod>\n`;
    }
    if (e.changeFrequency) xml += `<changefreq>${e.changeFrequency}</changefreq>\n`;
    if (typeof e.priority === "number") xml += `<priority>${e.priority}</priority>\n`;
    for (const [hreflang, href] of Object.entries(e.alternates?.languages ?? {})) {
      if (href) xml += `<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />\n`;
    }
    xml += "</url>\n";
  }
  return xml + "</urlset>\n";
}
