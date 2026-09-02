import type { MetadataRoute } from "next";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { phonicsSkills } from "@/lib/phonics-data";
import { worksheetCategories } from "@/lib/worksheet-categories";
import { blogPosts } from "@/lib/blog-data";

const baseUrl = "https://alphabes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/alphabet",
    "/phonics",
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

  const blogRoutes = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // NEXT STEP: once Worksheet rows exist in Prisma, add per-worksheet detail
  // page routes here the same way, querying published/public rows only.

  return [...staticRoutes, ...letterRoutes, ...phonicsRoutes, ...worksheetCategoryRoutes, ...blogRoutes];
}
