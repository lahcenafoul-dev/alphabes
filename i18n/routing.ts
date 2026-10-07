import { defineRouting } from "next-intl/routing";

// English is the default locale and keeps its existing, unprefixed URLs
// (/alphabet/a). French lives under /fr with French path words
// (/fr/jeux, /fr/histoires), Spanish under /es with Spanish ones
// (/es/juegos, /es/cuentos), Brazilian Portuguese under /pt with Portuguese
// ones (/pt/jogos, /pt/historias). Keys are the internal pathnames, which
// match the folders under app/[locale]/.
export const routing = defineRouting({
  locales: ["en", "fr", "es", "pt"],
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
    "/about": { en: "/about", fr: "/a-propos", es: "/quienes-somos", pt: "/quem-somos" },
    "/activities": { en: "/activities", fr: "/activites", es: "/actividades", pt: "/brincadeiras" },
    "/alphabet": { en: "/alphabet", fr: "/alphabet", es: "/abecedario", pt: "/alfabeto" },
    "/alphabet/[letter]": { en: "/alphabet/[letter]", fr: "/alphabet/[letter]", es: "/abecedario/[letter]", pt: "/alfabeto/[letter]" },
    "/alphabet/[letter]/worksheet": {
      en: "/alphabet/[letter]/worksheet",
      fr: "/alphabet/[letter]/fiche",
      es: "/abecedario/[letter]/ficha",
      pt: "/alfabeto/[letter]/atividade",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": { en: "/contact", fr: "/contact", es: "/contacto", pt: "/contato" },
    "/cookies": "/cookies",
    "/dashboard": { en: "/dashboard", fr: "/tableau-de-bord", es: "/mi-cuenta", pt: "/minha-conta" },
    "/dashboard/[id]": { en: "/dashboard/[id]", fr: "/tableau-de-bord/[id]", es: "/mi-cuenta/[id]", pt: "/minha-conta/[id]" },
    "/flashcards": { en: "/flashcards", fr: "/imagier", es: "/tarjetas", pt: "/cartoes" },
    "/games": { en: "/games", fr: "/jeux", es: "/juegos", pt: "/jogos" },
    "/games/[slug]": { en: "/games/[slug]", fr: "/jeux/[slug]", es: "/juegos/[slug]", pt: "/jogos/[slug]" },
    // Premium games are played here, per request, after a Pro check (docs/paypal-plan.md).
    "/games/[slug]/play": {
      en: "/games/[slug]/play",
      fr: "/jeux/[slug]/jouer",
      es: "/juegos/[slug]/jugar",
      pt: "/jogos/[slug]/jogar",
    },
    "/kindergarten": { en: "/kindergarten", fr: "/grande-section", es: "/kinder", pt: "/primeiro-ano" },
    "/kindergarten/[topic]": {
      en: "/kindergarten/[topic]",
      fr: "/grande-section/[topic]",
      es: "/kinder/[topic]",
      pt: "/primeiro-ano/[topic]",
    },
    "/login": { en: "/login", fr: "/connexion", es: "/iniciar-sesion", pt: "/entrar" },
    "/phonics": { en: "/phonics", fr: "/sons", es: "/silabas", pt: "/silabas" },
    "/phonics/[skill]": { en: "/phonics/[skill]", fr: "/sons/[skill]", es: "/silabas/[skill]", pt: "/silabas/[skill]" },
    "/preschool": { en: "/preschool", fr: "/maternelle", es: "/preescolar", pt: "/educacao-infantil" },
    "/preschool/[topic]": {
      en: "/preschool/[topic]",
      fr: "/maternelle/[topic]",
      es: "/preescolar/[topic]",
      pt: "/educacao-infantil/[topic]",
    },
    "/pricing": { en: "/pricing", fr: "/tarifs", es: "/precios", pt: "/precos" },
    "/privacy-policy": {
      en: "/privacy-policy",
      fr: "/confidentialite",
      es: "/politica-de-privacidad",
      pt: "/politica-de-privacidade",
    },
    "/refunds": { en: "/refunds", fr: "/remboursements", es: "/reembolsos", pt: "/reembolsos" },
    "/register": { en: "/register", fr: "/inscription", es: "/registro", pt: "/cadastro" },
    "/stories": { en: "/stories", fr: "/histoires", es: "/cuentos", pt: "/historias" },
    "/stories/[slug]": { en: "/stories/[slug]", fr: "/histoires/[slug]", es: "/cuentos/[slug]", pt: "/historias/[slug]" },
    "/terms": { en: "/terms", fr: "/conditions-utilisation", es: "/terminos-de-uso", pt: "/termos-de-uso" },
    "/worksheets": { en: "/worksheets", fr: "/fiches", es: "/fichas", pt: "/atividades" },
    "/worksheets/[category]": {
      en: "/worksheets/[category]",
      fr: "/fiches/[category]",
      es: "/fichas/[category]",
      pt: "/atividades/[category]",
    },
    "/worksheets/bundles": { en: "/worksheets/bundles", fr: "/fiches/packs", es: "/fichas/paquetes", pt: "/atividades/pacotes" },
    "/worksheets/bundles/[bundleSlug]": {
      en: "/worksheets/bundles/[bundleSlug]",
      fr: "/fiches/packs/[bundleSlug]",
      es: "/fichas/paquetes/[bundleSlug]",
      pt: "/atividades/pacotes/[bundleSlug]",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
