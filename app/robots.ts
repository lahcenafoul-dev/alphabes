import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/api/"],
      },
    ],
    sitemap: "https://alphabes.com/sitemap.xml",
    host: "https://alphabes.com",
  };
}
