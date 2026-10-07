import { sitemapEntries, sitemapXml } from "@/lib/sitemap";

// Written by hand instead of app/sitemap.ts so the XML follows the sitemap
// XSD (lib/sitemap.ts). Built per request; the cache header is in
// next.config.js.
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(sitemapXml(await sitemapEntries()), {
    headers: { "Content-Type": "application/xml" },
  });
}
