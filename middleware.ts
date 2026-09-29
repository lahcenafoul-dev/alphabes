import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { routing, type Locale } from "@/i18n/routing";
import {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  counterpartPath,
  isAvailable,
  isLocale,
  localizedPath,
  matchPath,
} from "@/lib/i18n/routes";
import { paramsExist } from "@/lib/i18n/known-params";
import { storyExists } from "@/lib/story-exists";

const handleI18nRouting = createIntlMiddleware(routing);

// In-memory sliding window; swap for Upstash/Redis in a multi-instance
// deployment so limits are shared across serverless instances.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 10;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

// Serve Next's built-in 404 route (app/global-not-found.tsx) with a 404
// status, telling it which language to use.
function notFound(req: NextRequest, locale: Locale) {
  const headers = new Headers(req.headers);
  headers.set(LOCALE_HEADER, locale);
  return NextResponse.rewrite(new URL("/_not-found", req.url), { request: { headers } });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    if (
      pathname.startsWith("/api/auth/callback/credentials") ||
      pathname === "/api/register" ||
      pathname === "/api/contact"
    ) {
      const ip =
        req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "unknown";
      const bucket =
        pathname === "/api/register" ? "register" : pathname === "/api/contact" ? "contact" : "login";
      if (isRateLimited(`${bucket}:${ip}`)) {
        return NextResponse.json(
          { error: "Too many attempts. Try again shortly.", code: "rate_limited" },
          { status: 429 },
        );
      }
    }
    return NextResponse.next();
  }

  const match = matchPath(pathname);

  // Unknown URLs, unknown letters/games/worksheets, and French pages that
  // haven't been written yet get the 404 page in the right language (never
  // English content under a French URL). "/en/..." is left to next-intl,
  // which redirects it to the unprefixed URL.
  if (
    !match
      ? !/^\/en(\/|$)/.test(pathname)
      : !isAvailable(match.locale, match.pathname) || !paramsExist(match.pathname, match.params, match.locale)
  ) {
    return notFound(req, match?.locale ?? (/^\/fr(\/|$)/.test(pathname) ? "fr" : routing.defaultLocale));
  }
  // Stories live in the database, so they're checked with a (cached) query.
  if (match?.pathname === "/stories/[slug]" && (await storyExists(match.params.slug)) === false) {
    return notFound(req, match.locale);
  }

  // Remembered language: the switcher stores an explicit choice in a cookie.
  // Crawlers never send it, so they always get the URL they asked for.
  const preferred = req.cookies.get(LOCALE_COOKIE)?.value;
  if (match && isLocale(preferred) && preferred !== match.locale) {
    const target = counterpartPath(match, preferred);
    if (target) {
      const url = req.nextUrl.clone();
      url.pathname = target;
      return NextResponse.redirect(url, 307);
    }
  }

  const isAdmin = pathname.startsWith("/admin");
  if (match?.pathname.startsWith("/dashboard") || isAdmin) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const locale = match?.locale ?? routing.defaultLocale;
    if (!token) {
      const loginUrl = new URL(localizedPath(locale, "/login"), req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdmin && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL(localizedPath(locale, "/dashboard"), req.url));
    }
  }

  return handleI18nRouting(req);
}

export const config = {
  matcher: [
    // Every page, but not API routes, Next internals, generated metadata
    // images, or files with an extension (robots.txt, sitemap.xml, PDFs, MP3s).
    "/((?!api|_next|_vercel|icon|opengraph-image|.*\\..*).*)",
    "/api/auth/callback/credentials",
    "/api/register",
    "/api/contact",
  ],
};
