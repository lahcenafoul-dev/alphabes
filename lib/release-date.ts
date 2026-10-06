// When this release was built: next.config.js sets RELEASE_DATE at build
// time and Next inlines it, so it stays the same on every request until the
// next deploy. The sitemap uses it as <lastmod> for pages that live in the
// code (stories use their own updatedAt). Outside a build (tests, a dev
// server started without it) it falls back to when the module loaded.
export const RELEASE_DATE = new Date(process.env.RELEASE_DATE || Date.now());
