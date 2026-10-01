// Which pages exist in which language, and how to turn an internal pathname
// ("/games/[slug]") into a real URL for a locale ("/fr/jeux/find-the-letter").
// Pure and dependency-free so middleware (edge), server components, client
// components, the sitemap and tests all share one source of truth.
import type { Metadata } from "next";
import { routing, type AppPathname, type Locale } from "@/i18n/routing";

export const SITE_URL = "https://alphabes.com";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Set by the middleware on 404 rewrites so app/global-not-found.tsx knows the language.
export const LOCALE_HEADER = "x-alphabes-locale";

// Internal pathnames that have a real French page. This grows phase by
// phase; every other /fr URL answers 404, and only these get hreflang and
// French sitemap entries.
export const FRENCH_PATHNAMES: ReadonlySet<AppPathname> = new Set<AppPathname>([
  "/",
  "/about",
  "/activities",
  "/alphabet",
  "/alphabet/[letter]",
  "/alphabet/[letter]/worksheet",
  "/contact",
  "/cookies",
  "/dashboard",
  "/dashboard/[id]",
  "/flashcards",
  "/games",
  "/games/[slug]",
  "/kindergarten",
  "/kindergarten/[topic]",
  "/login",
  "/phonics",
  "/phonics/[skill]",
  "/preschool",
  "/preschool/[topic]",
  "/pricing",
  "/privacy-policy",
  "/register",
  "/stories",
  "/stories/[slug]",
  "/terms",
  "/worksheets",
  "/worksheets/[category]",
  "/worksheets/bundles",
  "/worksheets/bundles/[bundleSlug]",
]);

// Private or thin pages: never given hreflang or French sitemap entries.
export const NOINDEX_PATHNAMES: ReadonlySet<AppPathname> = new Set<AppPathname>([
  "/login",
  "/register",
  "/dashboard",
  "/dashboard/[id]",
]);

// Pages whose params differ between languages (a French story has its own
// slug; the French sounds and worksheets aren't the English phonics skills
// and worksheets), so an English URL can't be mapped to its French twin by
// path alone.
const PARAMS_DIFFER: ReadonlySet<AppPathname> = new Set<AppPathname>([
  "/stories/[slug]",
  "/phonics/[skill]",
  "/worksheets/[category]",
  "/worksheets/bundles/[bundleSlug]",
]);

export type RouteParams = Record<string, string>;

// Pages whose French params are translations of the English ones: the
// games and the school-level topics. A slug missing from the map has no
// twin (French-only topics such as "graphisme"). Checked against
// lib/games-fr.ts and lib/ecole-fr.ts by tests/i18n.
export const TRANSLATED_PARAMS: Partial<Record<AppPathname, { key: string; enToFr: Record<string, string> }>> = {
  "/games/[slug]": {
    key: "slug",
    enToFr: {
      "find-the-letter": "trouve-la-lettre",
      "match-letter-picture": "lettre-et-image",
      "beginning-sound": "premier-son",
      "letter-tracing": "trace-la-lettre",
      "alphabet-quiz": "quiz-alphabet",
    },
  },
  "/preschool/[topic]": { key: "topic", enToFr: { "letter-tracing": "tracer-les-lettres", coloring: "coloriage" } },
  "/kindergarten/[topic]": { key: "topic", enToFr: { "sight-words": "mots-outils", handwriting: "ecriture-cursive" } },
};

/** The params of a page's twin in another language, or null if it has none. */
function translateParams(pathname: AppPathname, params: RouteParams, from: Locale, to: Locale): RouteParams | null {
  const map = TRANSLATED_PARAMS[pathname];
  if (!map || from === to) return params;
  const value = params[map.key];
  const twin =
    to === "fr"
      ? map.enToFr[value]
      : Object.entries(map.enToFr).find(([, fr]) => fr === value)?.[0];
  return twin ? { ...params, [map.key]: twin } : null;
}

// Pages that exist only in French: the letters with accents and the accents
// page (lib/letters-fr.ts), and every French sound page (lib/sons-fr.ts).
// Both lists are checked against the data by tests/i18n. They get no English
// hreflang, and the switcher can't map them to English.
const FRENCH_ONLY_LETTERS = ["e-accent-aigu", "e-accent-grave", "e-accent-circonflexe", "c-cedille"];
export const FRENCH_SOUND_SLUGS = [
  "voyelles", "premier-son", "syllabes", "ou", "on", "an", "in", "oi", "ch", "gn", "eu", "o-au-eau",
  "e-accent-aigu", "e-accent-grave", "ill", "c-et-g", "s-et-ss", "lettres-muettes", "mots-outils",
];
const FRENCH_ONLY_PARAMS: Partial<Record<AppPathname, { key: string; values: ReadonlySet<string> }>> = {
  "/alphabet/[letter]": { key: "letter", values: new Set([...FRENCH_ONLY_LETTERS, "accents"]) },
  "/alphabet/[letter]/worksheet": { key: "letter", values: new Set(FRENCH_ONLY_LETTERS) },
  "/phonics/[skill]": { key: "skill", values: new Set(FRENCH_SOUND_SLUGS) },
};

// Where the language switcher sends a page that has no twin in the other
// language: its section's index rather than the home page.
const SECTION_INDEX: Partial<Record<AppPathname, AppPathname>> = {
  "/alphabet/[letter]": "/alphabet",
  "/alphabet/[letter]/worksheet": "/alphabet",
  "/games/[slug]": "/games",
  "/kindergarten/[topic]": "/kindergarten",
  "/phonics/[skill]": "/phonics",
  "/preschool/[topic]": "/preschool",
  "/stories/[slug]": "/stories",
  "/worksheets/[category]": "/worksheets",
  "/worksheets/bundles/[bundleSlug]": "/worksheets/bundles",
};

export function isFrenchOnly(pathname: AppPathname, params: RouteParams): boolean {
  const only = FRENCH_ONLY_PARAMS[pathname];
  return !!only && only.values.has(params[only.key]);
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (routing.locales as readonly string[]).includes(value);
}

export function isAvailable(locale: Locale, pathname: AppPathname): boolean {
  return locale === routing.defaultLocale || FRENCH_PATHNAMES.has(pathname);
}

function template(locale: Locale, pathname: AppPathname): string {
  const entry = routing.pathnames[pathname];
  return typeof entry === "string" ? entry : entry[locale];
}

/** "/games/[slug]" + { slug } → "/games/x" (en) or "/fr/jeux/x" (fr). */
export function localizedPath(locale: Locale, pathname: AppPathname, params: RouteParams = {}): string {
  const path = template(locale, pathname).replace(/\[(\w+)\]/g, (_, key: string) => {
    const value = params[key];
    if (value === undefined) throw new Error(`Missing param "${key}" for ${pathname}`);
    return encodeURIComponent(value);
  });
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Absolute URL; the English home page is "https://alphabes.com" with no slash. */
export function absoluteUrl(locale: Locale, pathname: AppPathname, params: RouteParams = {}): string {
  const path = localizedPath(locale, pathname, params);
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * canonical + hreflang for a page. hreflang is only emitted when the page
 * really exists in French; `otherParams` covers pages whose params differ
 * by language (story slugs).
 */
export function alternatesFor(
  locale: Locale,
  pathname: AppPathname,
  params: RouteParams = {},
  otherParams?: Partial<Record<Locale, RouteParams>>,
): NonNullable<Metadata["alternates"]> {
  const canonical = absoluteUrl(locale, pathname, params);
  if (!FRENCH_PATHNAMES.has(pathname) || isFrenchOnly(pathname, params)) return { canonical };
  const paramsFor = (l: Locale) =>
    l === locale
      ? params
      : otherParams?.[l] ?? (PARAMS_DIFFER.has(pathname) ? null : translateParams(pathname, params, locale, l));
  const en = paramsFor("en");
  const fr = paramsFor("fr");
  if (!en || !fr) return { canonical };
  const enUrl = absoluteUrl("en", pathname, en);
  return {
    canonical,
    languages: { en: enUrl, fr: absoluteUrl("fr", pathname, fr), "x-default": enUrl },
  };
}

type CompiledRoute = { pathname: AppPathname; regex: RegExp; keys: string[]; dynamic: number };

const compiled: Record<Locale, CompiledRoute[]> = Object.fromEntries(
  routing.locales.map((locale) => [
    locale,
    (Object.keys(routing.pathnames) as AppPathname[])
      .map((pathname) => {
        const keys: string[] = [];
        const source = template(locale, pathname)
          .split("/")
          .map((seg) => {
            const m = seg.match(/^\[(\w+)\]$/);
            if (!m) return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            keys.push(m[1]);
            return "([^/]+)";
          })
          .join("/");
        return { pathname, regex: new RegExp(`^${source}/?$`), keys, dynamic: keys.length };
      })
      // Static segments win over dynamic ones: /worksheets/bundles before /worksheets/[category].
      .sort((a, b) => a.dynamic - b.dynamic),
  ]),
) as Record<Locale, CompiledRoute[]>;

export type MatchedPath = { locale: Locale; pathname: AppPathname; params: RouteParams };

/** Parses a public URL path. Returns null for unknown paths (they 404). */
export function matchPath(path: string): MatchedPath | null {
  let locale: Locale = routing.defaultLocale;
  let rest = path;
  for (const l of routing.locales) {
    if (l === routing.defaultLocale) continue;
    if (path === `/${l}` || path.startsWith(`/${l}/`)) {
      locale = l;
      rest = path.slice(l.length + 1) || "/";
    }
  }
  for (const route of compiled[locale]) {
    const m = rest.match(route.regex);
    if (!m) continue;
    const params: RouteParams = {};
    route.keys.forEach((key, i) => {
      params[key] = decodeURIComponent(m[i + 1]);
    });
    return { locale, pathname: route.pathname, params };
  }
  return null;
}

/** Where a page lives in another language, or null if it has no twin there. */
export function counterpartPath(match: MatchedPath, target: Locale): string | null {
  if (match.locale === target) return null;
  if (!isAvailable(target, match.pathname) || !isAvailable(match.locale, match.pathname)) return null;
  if (PARAMS_DIFFER.has(match.pathname)) return null;
  if (target !== "fr" && isFrenchOnly(match.pathname, match.params)) return null;
  const params = translateParams(match.pathname, match.params, match.locale, target);
  return params && localizedPath(target, match.pathname, params);
}

/** For a page with no twin in `target`: its section index there, if that exists. */
export function sectionFallbackPath(match: MatchedPath, target: Locale): string | null {
  const index = SECTION_INDEX[match.pathname];
  return index && isAvailable(target, index) ? localizedPath(target, index) : null;
}

/** The ?next= target after login: only same-site paths, never "//host" or a full URL. */
export function safeNextPath(next: string | null): string | null {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : null;
}
