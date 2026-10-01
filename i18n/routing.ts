import { defineRouting } from "next-intl/routing";

// English is the default locale and keeps its existing, unprefixed URLs
// (/alphabet/a). French lives under /fr with French path words
// (/fr/jeux, /fr/histoires), Spanish under /es with Spanish ones
// (/es/juegos, /es/cuentos). Keys are the internal pathnames, which match
// the folders under app/[locale]/.
export const routing = defineRouting({
  locales: ["en", "fr", "es"],
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
    "/about": { en: "/about", fr: "/a-propos", es: "/quienes-somos" },
    "/activities": { en: "/activities", fr: "/activites", es: "/actividades" },
    "/alphabet": { en: "/alphabet", fr: "/alphabet", es: "/abecedario" },
    "/alphabet/[letter]": { en: "/alphabet/[letter]", fr: "/alphabet/[letter]", es: "/abecedario/[letter]" },
    "/alphabet/[letter]/worksheet": {
      en: "/alphabet/[letter]/worksheet",
      fr: "/alphabet/[letter]/fiche",
      es: "/abecedario/[letter]/ficha",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": { en: "/contact", fr: "/contact", es: "/contacto" },
    "/cookies": "/cookies",
    "/dashboard": { en: "/dashboard", fr: "/tableau-de-bord", es: "/mi-cuenta" },
    "/dashboard/[id]": { en: "/dashboard/[id]", fr: "/tableau-de-bord/[id]", es: "/mi-cuenta/[id]" },
    "/flashcards": { en: "/flashcards", fr: "/imagier", es: "/tarjetas" },
    "/games": { en: "/games", fr: "/jeux", es: "/juegos" },
    "/games/[slug]": { en: "/games/[slug]", fr: "/jeux/[slug]", es: "/juegos/[slug]" },
    "/kindergarten": { en: "/kindergarten", fr: "/grande-section", es: "/kinder" },
    "/kindergarten/[topic]": { en: "/kindergarten/[topic]", fr: "/grande-section/[topic]", es: "/kinder/[topic]" },
    "/login": { en: "/login", fr: "/connexion", es: "/iniciar-sesion" },
    "/phonics": { en: "/phonics", fr: "/sons", es: "/silabas" },
    "/phonics/[skill]": { en: "/phonics/[skill]", fr: "/sons/[skill]", es: "/silabas/[skill]" },
    "/preschool": { en: "/preschool", fr: "/maternelle", es: "/preescolar" },
    "/preschool/[topic]": { en: "/preschool/[topic]", fr: "/maternelle/[topic]", es: "/preescolar/[topic]" },
    "/pricing": { en: "/pricing", fr: "/tarifs", es: "/precios" },
    "/privacy": { en: "/privacy", fr: "/vie-privee", es: "/privacidad" },
    "/privacy-policy": { en: "/privacy-policy", fr: "/confidentialite", es: "/politica-de-privacidad" },
    "/register": { en: "/register", fr: "/inscription", es: "/registro" },
    "/stories": { en: "/stories", fr: "/histoires", es: "/cuentos" },
    "/stories/[slug]": { en: "/stories/[slug]", fr: "/histoires/[slug]", es: "/cuentos/[slug]" },
    "/terms": { en: "/terms", fr: "/conditions-utilisation", es: "/terminos-de-uso" },
    "/worksheets": { en: "/worksheets", fr: "/fiches", es: "/fichas" },
    "/worksheets/[category]": { en: "/worksheets/[category]", fr: "/fiches/[category]", es: "/fichas/[category]" },
    "/worksheets/bundles": { en: "/worksheets/bundles", fr: "/fiches/packs", es: "/fichas/paquetes" },
    "/worksheets/bundles/[bundleSlug]": {
      en: "/worksheets/bundles/[bundleSlug]",
      fr: "/fiches/packs/[bundleSlug]",
      es: "/fichas/paquetes/[bundleSlug]",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
