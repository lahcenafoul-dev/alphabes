import type { MetadataRoute } from "next";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { ACCENTS_SLUG, frenchLetters, isAccentLetter } from "@/lib/letters-fr";
import { phonicsSkills } from "@/lib/phonics-data";
import { frenchSounds } from "@/lib/sons-fr";
import { FICHE_CATEGORIES, fichePacks, fiches } from "@/lib/fiches-fr";
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
import {
  FRENCH_PATHNAMES,
  NOINDEX_PATHNAMES,
  SITE_URL,
  absoluteUrl,
  counterpartPath,
  matchPath,
} from "@/lib/i18n/routes";

const baseUrl = SITE_URL;

// Stories live in the database, so build the sitemap per request: new
// stories appear without a rebuild and the build never needs the database.
export const dynamic = "force-dynamic";

// Each story under its own language's URL; stories with a twin in the
// other language (same translationGroup) list each other as alternates.
async function getStoryRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const stories = await getPrisma().story.findMany({
      select: { slug: true, updatedAt: true, locale: true, translationGroup: true },
      orderBy: [{ locale: "asc" }, { order: "asc" }],
    });
    const urlOf = (s: (typeof stories)[number]) => absoluteUrl(s.locale === "FR" ? "fr" : "en", "/stories/[slug]", { slug: s.slug });
    return stories.map((s) => {
      const twin = s.translationGroup ? stories.find((o) => o.translationGroup === s.translationGroup && o.locale !== s.locale) : undefined;
      const en = s.locale === "EN" ? s : twin;
      const fr = s.locale === "FR" ? s : twin;
      return {
        url: urlOf(s),
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        ...(en && fr && { alternates: { languages: { en: urlOf(en), fr: urlOf(fr), "x-default": urlOf(en) } } }),
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

  // Pages with no English twin: the letters with accents, the accents page,
  // the French sound pages and the French worksheets and packs.
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
  ];

  return [...withFrench(englishEntries), ...frenchOnlyEntries, ...(await getStoryRoutes())];
}

// Every English page that also exists in French gets hreflang alternates,
// and its French URL is listed as an entry of its own.
function withFrench(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const entry of entries) {
    const path = entry.url.slice(SITE_URL.length) || "/";
    const match = matchPath(path);
    const frPath =
      match && FRENCH_PATHNAMES.has(match.pathname) && !NOINDEX_PATHNAMES.has(match.pathname)
        ? counterpartPath(match, "fr")
        : null;
    if (!frPath) {
      out.push(entry);
      continue;
    }
    const languages = { en: entry.url, fr: `${SITE_URL}${frPath}`, "x-default": entry.url };
    out.push({ ...entry, alternates: { languages } });
    out.push({ ...entry, url: languages.fr, alternates: { languages } });
  }
  return out;
}
