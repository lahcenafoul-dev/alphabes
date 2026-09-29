import { defineRouting } from "next-intl/routing";

// English is the default locale and keeps its existing, unprefixed URLs
// (/alphabet/a). French lives under /fr with French path words
// (/fr/jeux, /fr/histoires). Keys are the internal pathnames, which match
// the folders under app/[locale]/.
export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Never redirect based on Accept-Language: English URLs must always serve
  // English to crawlers and visitors alike. A remembered choice is handled
  // in middleware.ts from our own NEXT_LOCALE cookie, set by the switcher.
  localeDetection: false,
  localeCookie: false,
  // hreflang is emitted in page metadata and the sitemap, only for pages
  // that really exist in both languages (see lib/i18n/routes.ts).
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/about": { en: "/about", fr: "/a-propos" },
    "/activities": { en: "/activities", fr: "/activites" },
    "/alphabet": "/alphabet",
    "/alphabet/[letter]": "/alphabet/[letter]",
    "/alphabet/[letter]/worksheet": { en: "/alphabet/[letter]/worksheet", fr: "/alphabet/[letter]/fiche" },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": "/contact",
    "/cookies": "/cookies",
    "/dashboard": { en: "/dashboard", fr: "/tableau-de-bord" },
    "/dashboard/[id]": { en: "/dashboard/[id]", fr: "/tableau-de-bord/[id]" },
    "/flashcards": { en: "/flashcards", fr: "/imagier" },
    "/games": { en: "/games", fr: "/jeux" },
    "/games/[slug]": { en: "/games/[slug]", fr: "/jeux/[slug]" },
    "/kindergarten": { en: "/kindergarten", fr: "/grande-section" },
    "/kindergarten/[topic]": { en: "/kindergarten/[topic]", fr: "/grande-section/[topic]" },
    "/login": { en: "/login", fr: "/connexion" },
    "/phonics": { en: "/phonics", fr: "/sons" },
    "/phonics/[skill]": { en: "/phonics/[skill]", fr: "/sons/[skill]" },
    "/preschool": { en: "/preschool", fr: "/maternelle" },
    "/preschool/[topic]": { en: "/preschool/[topic]", fr: "/maternelle/[topic]" },
    "/pricing": { en: "/pricing", fr: "/tarifs" },
    "/privacy": { en: "/privacy", fr: "/vie-privee" },
    "/privacy-policy": { en: "/privacy-policy", fr: "/confidentialite" },
    "/register": { en: "/register", fr: "/inscription" },
    "/stories": { en: "/stories", fr: "/histoires" },
    "/stories/[slug]": { en: "/stories/[slug]", fr: "/histoires/[slug]" },
    "/terms": { en: "/terms", fr: "/conditions-utilisation" },
    "/worksheets": { en: "/worksheets", fr: "/fiches" },
    "/worksheets/[category]": { en: "/worksheets/[category]", fr: "/fiches/[category]" },
    "/worksheets/bundles": { en: "/worksheets/bundles", fr: "/fiches/packs" },
    "/worksheets/bundles/[bundleSlug]": {
      en: "/worksheets/bundles/[bundleSlug]",
      fr: "/fiches/packs/[bundleSlug]",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
