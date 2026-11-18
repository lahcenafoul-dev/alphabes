import { sitemapIndexXml } from "@/lib/sitemap";

// The sitemap index: one sitemap per language (app/sitemap-<locale>.xml).
// Built at build time from the code (no database), so it is prerendered and
// cached like the pages; the cache header is in next.config.js.
export const dynamic = "force-static";

export async function GET() {
  return new Response(await sitemapIndexXml(), {
    headers: { "Content-Type": "application/xml" },
  });
}
