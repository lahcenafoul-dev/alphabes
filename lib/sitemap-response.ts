import type { Locale } from "@/i18n/routing";
import { sitemapEntriesFor, sitemapXml } from "@/lib/sitemap";

/** One language's sitemap (app/sitemap-<locale>.xml/route.ts). */
export async function sitemapResponse(locale: Locale): Promise<Response> {
  return new Response(sitemapXml(await sitemapEntriesFor(locale)), {
    headers: { "Content-Type": "application/xml" },
  });
}
