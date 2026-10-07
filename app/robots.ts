import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n/routes";

// The dashboard in every language (/dashboard, /fr/tableau-de-bord…): private, never crawled.
const dashboards = routing.locales.map((locale) => localizedPath(locale, "/dashboard"));

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...dashboards, "/admin", "/api/"],
      },
    ],
    sitemap: "https://alphabes.com/sitemap.xml",
    host: "https://alphabes.com",
  };
}
