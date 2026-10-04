import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
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
import { frenchSounds } from "@/lib/sons-fr";
import { FICHE_CATEGORIES, fichePacks, fiches } from "@/lib/fiches-fr";
import { frenchGames } from "@/lib/games-fr";
import { schoolTopics } from "@/lib/ecole-fr";
import { spanishGames } from "@/lib/juegos-es";
import { schoolTopicsEs } from "@/lib/escuela-es";
import { worksheetCategories } from "@/lib/worksheet-categories";
import { WORKSHEET_TYPES } from "@/lib/worksheet-types";
import { worksheets } from "@/lib/worksheets-data";
import { bundles } from "@/lib/worksheet-bundles";
import { blogPosts, blogCategories } from "@/lib/blog-data";
import { staticWorksheetCategories } from "@/lib/static-worksheet-categories";
import { staticWorksheets } from "@/lib/static-worksheets-data";
import { preschoolTopics } from "@/lib/preschool-data";
import { kindergartenTopics } from "@/lib/kindergarten-data";
import { getPrisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";
import { fromDbLocale } from "@/lib/i18n/db-locale";
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

// Stories live in the database, so the sitemap is built per request (the
// build never needs the database), but the story list is cached for an hour
// (R2 incremental cache on Workers): Googlebot gets a fast answer that
// doesn't wait for the database, and a new story appears within the hour.
export const dynamic = "force-dynamic";

const SITEMAP_REVALIDATE_SECONDS = 3600;

// Throws when the database is unreachable, so a failure is never cached.
// Dates come back from the cache as strings.
const getCachedStories = unstable_cache(
  async () =>
    getPrisma().story.findMany({
      select: { slug: true, updatedAt: true, locale: true, translationGroup: true },
      orderBy: [{ locale: "asc" }, { order: "asc" }],
    }),
  ["sitemap-stories"],
  { revalidate: SITEMAP_REVALIDATE_SECONDS },
);

// Each story under its own language's URL; stories with twins in other
// languages (same translationGroup) list each other as alternates.
async function getStoryRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const stories = await getCachedStories();
    const urlOf = (s: (typeof stories)[number]) => absoluteUrl(fromDbLocale(s.locale), "/stories/[slug]", { slug: s.slug });
    return stories.map((s) => {
      const group = s.translationGroup ? stories.filter((o) => o.translationGroup === s.translationGroup) : [s];
      const languages: Record<string, string> = {};
      for (const l of routing.locales) {
        const twin = group.find((o) => fromDbLocale(o.locale) === l);
        if (twin) languages[l] = urlOf(twin);
      }
      if (languages.en) languages["x-default"] = languages.en;
      return {
        url: urlOf(s),
        lastModified: new Date(s.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        ...(Object.keys(languages).length > 2 && { alternates: { languages } }),
      };
    });
  } catch (err) {
    // Still serve every static route if the database is unreachable.
    console.error("sitemap: could not load stories", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/alphabet",
    "/phonics",
    "/preschool",
    "/kindergarten",
    "/worksheets",
    "/games",
    "/stories",
    "/flashcards",
    "/activities",
    "/pricing",
    "/login",
    "/register",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/privacy-policy",
    "/refunds",
    "/terms",
    "/cookies",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const letterRoutes = getAllLetterSlugs().map((letter) => ({
    url: `${baseUrl}/alphabet/${letter}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const phonicsRoutes = phonicsSkills.map((s) => ({
    url: `${baseUrl}/phonics/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const worksheetCategoryRoutes = worksheetCategories.map((c) => ({
    url: `${baseUrl}/worksheets/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const worksheetTypeCategoryRoutes = WORKSHEET_TYPES.map((t) => ({
    url: `${baseUrl}/worksheets/${t.categorySlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const worksheetDetailRoutes = worksheets.map((w) => ({
    url: `${baseUrl}/worksheets/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const bundleRoutes = [
    { url: `${baseUrl}/worksheets/bundles`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    ...bundles.map((b) => ({
      url: `${baseUrl}/worksheets/bundles/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const blogRoutes = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogCategoryRoutes = blogCategories.map((c) => ({
    url: `${baseUrl}/blog/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const staticWorksheetCategoryRoutes = staticWorksheetCategories.map((c) => ({
    url: `${baseUrl}/worksheets/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticWorksheetDetailRoutes = staticWorksheets.map((w) => ({
    url: `${baseUrl}/worksheets/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const preschoolRoutes = preschoolTopics.map((t) => ({
    url: `${baseUrl}/preschool/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const kindergartenRoutes = kindergartenTopics.map((t) => ({
    url: `${baseUrl}/kindergarten/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const englishEntries: MetadataRoute.Sitemap = [
    ...staticRoutes,
    ...letterRoutes,
    ...phonicsRoutes,
    ...worksheetCategoryRoutes,
    ...worksheetTypeCategoryRoutes,
    ...worksheetDetailRoutes,
    ...bundleRoutes,
    ...blogRoutes,
    ...blogCategoryRoutes,
    ...staticWorksheetCategoryRoutes,
    ...staticWorksheetDetailRoutes,
    ...preschoolRoutes,
    ...kindergartenRoutes,
  ];

  // The French, Spanish and Portuguese games. Their English twins aren't in the sitemap,
  // but the pages exist, so they are given as alternates.
  const gameEntries = (locale: "fr" | "es" | "pt", slugs: string[]): MetadataRoute.Sitemap =>
    slugs.map((slug) => {
      const { canonical, languages } = alternatesFor(locale, "/games/[slug]", { slug });
      return {
        url: canonical as string,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        ...(languages && { alternates: { languages: languages as Record<string, string> } }),
      };
    });
  const frenchGameEntries = gameEntries("fr", frenchGames.map((g) => g.slug));
  const spanishGameEntries = gameEntries("es", spanishGames.map((g) => g.slug));
  const portugueseGameEntries = gameEntries("pt", portugueseGames.map((g) => g.slug));

  // Pages with no English twin: the letters with accents, the accents page,
  // the French sound pages, the French worksheets and packs, and the school
  // topics written only in French.
  const frenchOnlyEntries: MetadataRoute.Sitemap = [
    ...[...frenchLetters.filter(isAccentLetter).map((l) => l.slug), ACCENTS_SLUG].map((letter) => ({
      url: absoluteUrl("fr", "/alphabet/[letter]", { letter }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...frenchSounds.map((s) => ({
      url: absoluteUrl("fr", "/phonics/[skill]", { skill: s.slug }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...[...FICHE_CATEGORIES.map((c) => c.slug), ...fiches.map((f) => f.slug)].map((category) => ({
      url: absoluteUrl("fr", "/worksheets/[category]", { category }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...fichePacks.map((p) => ({
      url: absoluteUrl("fr", "/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...schoolTopics
      .filter((t) => !t.en)
      .map((t) => ({
        url: absoluteUrl("fr", t.level === "maternelle" ? "/preschool/[topic]" : "/kindergarten/[topic]", { topic: t.slug }),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];

  // Spanish pages with no twin: the ñ, the tilde page, the syllable pages,
  // the Spanish worksheets and packs, and the school topics written only in
  // Spanish.
  const spanishOnlyEntries: MetadataRoute.Sitemap = [
    ...["enie", TILDE_SLUG].map((letter) => ({
      url: absoluteUrl("es", "/alphabet/[letter]", { letter }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...spanishSyllablePages.map((p) => ({
      url: absoluteUrl("es", "/phonics/[skill]", { skill: p.slug }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...fichaCategoryParams().map((category) => ({
      url: absoluteUrl("es", "/worksheets/[category]", { category }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...fichaPacks.map((p) => ({
      url: absoluteUrl("es", "/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...schoolTopicsEs
      .filter((t) => !t.en)
      .map((t) => ({
        url: absoluteUrl("es", t.level === "preescolar" ? "/preschool/[topic]" : "/kindergarten/[topic]", { topic: t.slug }),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];

  // Portuguese pages with no twin: the Ç, the accents page, the syllable
  // pages, the worksheets and packs, and the school topics written only in
  // Portuguese.
  const portugueseOnlyEntries: MetadataRoute.Sitemap = [
    ...[CEDILHA_SLUG, PT_ACENTOS_SLUG].map((letter) => ({
      url: absoluteUrl("pt", "/alphabet/[letter]", { letter }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...portugueseSyllablePages.map((p) => ({
      url: absoluteUrl("pt", "/phonics/[skill]", { skill: p.slug }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...atividadeCategoryParams().map((category) => ({
      url: absoluteUrl("pt", "/worksheets/[category]", { category }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...atividadePacks.map((p) => ({
      url: absoluteUrl("pt", "/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug }),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...schoolTopicsPt
      .filter((t) => !t.en)
      .map((t) => ({
        url: absoluteUrl("pt", t.level === "educacao-infantil" ? "/preschool/[topic]" : "/kindergarten/[topic]", { topic: t.slug }),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];

  return [
    ...withTwins(englishEntries),
    ...frenchGameEntries,
    ...spanishGameEntries,
    ...portugueseGameEntries,
    ...frenchOnlyEntries,
    ...spanishOnlyEntries,
    ...portugueseOnlyEntries,
    ...(await getStoryRoutes()),
  ];
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
