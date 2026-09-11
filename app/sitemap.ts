import type { MetadataRoute } from "next";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { phonicsSkills } from "@/lib/phonics-data";
import { worksheetCategories } from "@/lib/worksheet-categories";
import { WORKSHEET_TYPES } from "@/lib/worksheet-types";
import { worksheets } from "@/lib/worksheets-data";
import { bundles } from "@/lib/worksheet-bundles";
import { blogPosts } from "@/lib/blog-data";
import { staticWorksheetCategories } from "@/lib/static-worksheet-categories";
import { staticWorksheets } from "@/lib/static-worksheets-data";
import { preschoolTopics } from "@/lib/preschool-data";
import { kindergartenTopics } from "@/lib/kindergarten-data";

const baseUrl = "https://alphabes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/alphabet",
    "/phonics",
    "/preschool",
    "/kindergarten",
    "/worksheets",
    "/games",
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

  return [
    ...staticRoutes,
    ...letterRoutes,
    ...phonicsRoutes,
    ...worksheetCategoryRoutes,
    ...worksheetTypeCategoryRoutes,
    ...worksheetDetailRoutes,
    ...bundleRoutes,
    ...blogRoutes,
    ...staticWorksheetCategoryRoutes,
    ...staticWorksheetDetailRoutes,
    ...preschoolRoutes,
    ...kindergartenRoutes,
  ];
}
