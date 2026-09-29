import { neon } from "@neondatabase/serverless";

// Used by the middleware so /stories/<unknown slug> gets Next's real 404 page:
// letting the story page call notFound() leaves an empty error shell in the
// server HTML with this Next.js version. Uses Neon's HTTP driver (one query,
// no connection to keep), which works in the middleware runtime.

const TTL_MS = 60_000;
// Plain values only, so sharing across requests is safe on Workers. A new
// story is found at most a minute after it's added.
const cache = new Map<string, { exists: boolean; expiresAt: number }>();

/** true/false when known; null if the database couldn't be asked (let the page decide). */
export async function storyExists(slug: string): Promise<boolean | null> {
  const now = Date.now();
  const cached = cache.get(slug);
  if (cached && cached.expiresAt > now) return cached.exists;

  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = await sql`SELECT 1 FROM "Story" WHERE slug = ${slug} LIMIT 1`;
    const exists = rows.length > 0;
    if (cache.size > 500) cache.clear();
    cache.set(slug, { exists, expiresAt: now + TTL_MS });
    return exists;
  } catch (err) {
    console.error("storyExists: lookup failed", err);
    return null;
  }
}
