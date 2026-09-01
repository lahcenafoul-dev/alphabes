import type { MetadataRoute } from "next";
import { getAllLetterSlugs } from "@/lib/letters-data";

const baseUrl = "https://alphabes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/alphabet",
    "/phonics",
    "/phonics/letter-sounds",
    "/phonics/beginning-sounds",
    "/phonics/cvc-words",
    "/phonics/blending",
    "/worksheets",
    "/worksheets/alphabet",
    "/worksheets/tracing",
    "/worksheets/phonics",
    "/worksheets/coloring",
    "/worksheets/handwriting",
    "/games",
    "/flashcards",
    "/activities",
    "/pricing",
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

  // NOTE: in production, add BlogPost and Worksheet routes here by querying
  // Prisma for published/public rows, e.g.:
  // const posts = await prisma.blogPost.findMany({ where: { publishedAt: { not: null } } });

  return [...staticRoutes, ...letterRoutes];
}
