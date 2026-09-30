import { neon } from "@neondatabase/serverless";
import type { Locale } from "@/i18n/routing";

// Used by the middleware so /stories/<unknown slug> gets Next's real 404 page:
// letting the story page call notFound() leaves an empty error shell in the
// server HTML with this Next.js version. Uses Neon's HTTP driver (one query,
// no connection to keep), which works in the middleware runtime.

const TTL_MS = 60_000;
// Plain values only, so sharing across requests is safe on Workers. A new
// story is found at most a minute after it's added.
const cache = new Map<string, { exists: boolean; expiresAt: number }>();

/**
 * true/false when known; null if the database couldn't be asked (let the
 * page decide). A story only exists in its own language: a French story
 * under an English URL is a 404, and the other way round.
 */
export async function storyExists(slug: string, locale: Locale): Promise<boolean | null> {
  const now = Date.now();
  const key = `${locale}:${slug}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) return cached.exists;

  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = await sql`SELECT 1 FROM "Story" WHERE slug = ${slug} AND locale = ${locale.toUpperCase()}::"Locale" LIMIT 1`;
    const exists = rows.length > 0;
    if (cache.size > 500) cache.clear();
    cache.set(key, { exists, expiresAt: now + TTL_MS });
    return exists;
  } catch (err) {
    console.error("storyExists: lookup failed", err);
    return null;
  }
}
