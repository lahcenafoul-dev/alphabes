import { sitemapResponse } from "@/lib/sitemap-response";

// The es pages of the sitemap index (app/sitemap.xml), built at build time.
export const dynamic = "force-static";

export function GET() {
  return sitemapResponse("es");
}
