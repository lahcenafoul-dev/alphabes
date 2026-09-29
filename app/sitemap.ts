import type { MetadataRoute } from "next";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { phonicsSkills } from "@/lib/phonics-data";
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
  counterpartPath,
  matchPath,
} from "@/lib/i18n/routes";

const baseUrl = SITE_URL;

// Stories live in the database, so build the sitemap per request: new
// stories appear without a rebuild and the build never needs the database.
export const dynamic = "force-dynamic";

async function getStoryRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const stories = await getPrisma().story.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { order: "asc" },
    });
    return stories.map((s) => ({
      url: `${baseUrl}/stories/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
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
    ...(await getStoryRoutes()),
  ];

  return withFrench(englishEntries);
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
