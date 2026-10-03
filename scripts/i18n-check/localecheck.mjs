// Usage: node localecheck.mjs <fr|es|pt> [baseUrl] -- checks one language's pages
// against a running server: status, lang, titles, canonical/hreflang, English
// left in the text, every internal link, and the routing rules.
const lang = process.argv[2];
const base = process.argv[3] ?? "http://localhost:3100";

// French phase 2: the alphabet (26 letters + é è ê ç), the accents page and the imagier.
const frLetters = [..."abcdefghijklmnopqrstuvwxyz", "e-accent-aigu", "e-accent-grave", "e-accent-circonflexe", "c-cedille"];
// French phase 3: the sounds (lib/sons-fr.ts).
const frSounds = [
  "voyelles", "premier-son", "syllabes", "ou", "on", "an", "in", "oi", "ch", "gn", "eu", "o-au-eau",
  "e-accent-aigu", "e-accent-grave", "ill", "c-et-g", "s-et-ss", "lettres-muettes", "mots-outils",
];

// [path, fetch options, expected status, expected redirect (path + query) or null, label]
const RULES_FR = [
  ["/fr/blog", {}, 404, null, "French page not written yet"],
  ["/fr/xyz", {}, 404, null, "unknown French URL"],
  ["/does-not-exist", {}, 404, null, "unknown English URL"],
  ["/en/pricing", {}, 307, "/pricing", "/en prefix removed"],
  ["/fr/pricing", {}, 404, null, "English word under /fr"],
  ["/fr/tableau-de-bord", {}, 307, "/fr/connexion?next=%2Ffr%2Ftableau-de-bord", "French dashboard needs login"],
  ["/dashboard", {}, 307, "/login?next=%2Fdashboard", "English dashboard needs login"],
  ["/pricing", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/tarifs", "remembered French choice"],
  ["/blog", { headers: { cookie: "NEXT_LOCALE=fr" } }, 200, null, "no French twin: stay"],
  ["/games", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/jeux", "games index has a French twin"],
  ["/games/find-the-letter", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/jeux/trouve-la-lettre", "game twin with a French slug"],
  ["/fr/jeux/find-the-letter", {}, 404, null, "English game slug under /fr/jeux"],
  ["/games/trouve-la-lettre", {}, 404, null, "French game slug under an English URL"],
  ["/kindergarten/sight-words", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/grande-section/mots-outils", "topic twin with a French slug"],
  ["/fr/maternelle/graphisme", { headers: { cookie: "NEXT_LOCALE=en" } }, 200, null, "French-only topic, English chosen: stay"],
  ["/preschool/graphisme", {}, 404, null, "French topic under an English URL"],
  ["/activities", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/activites", "activities have a French twin"],
  ["/alphabet/c-cedille", {}, 404, null, "French-only letter under an English URL"],
  ["/fr/alphabet/c-cedille", { headers: { cookie: "NEXT_LOCALE=en" } }, 200, null, "French-only letter, English chosen: stay"],
  ["/fr/sons/blending", {}, 404, null, "English phonics skill under /fr/sons"],
  ["/phonics/ou", {}, 404, null, "French sound under an English URL"],
  ["/phonics", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/sons", "phonics index has a French twin"],
  ["/phonics/blending", { headers: { cookie: "NEXT_LOCALE=fr" } }, 200, null, "English-only skill, French chosen: stay"],
  ["/fr/fiches/letter-a-tracing", {}, 404, null, "English worksheet under /fr/fiches"],
  ["/worksheets/lettre-a-cursive", {}, 404, null, "French worksheet under an English URL"],
  ["/fr/fiches/packs/complete-bundle", {}, 404, null, "English bundle under /fr/fiches/packs"],
  ["/worksheets", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/fiches", "worksheet index has a French twin"],
  ["/worksheets/letter-a-tracing", { headers: { cookie: "NEXT_LOCALE=fr" } }, 200, null, "English-only worksheet, French chosen: stay"],
  ["/fr/histoires/the-little-apple", {}, 404, null, "English story under /fr/histoires"],
  ["/stories/la-petite-pomme", {}, 404, null, "French story under an English URL"],
  ["/stories", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/histoires", "story list has a French twin"],
  ["/fr/tarifs", { headers: { cookie: "NEXT_LOCALE=en" } }, 307, "/pricing", "remembered English choice"],
  ["/pricing", { headers: { "accept-language": "fr-FR,fr;q=0.9" } }, 200, null, "no Accept-Language redirect"],
];

const esLetters = [..."abcdefghijklmn", "enie", ..."opqrstuvwxyz"];
const esSyllables = [
  "vocales", "silabas-directas", "silabas-inversas", "silabas-mixtas", "contar-silabas", "trabadas-con-l",
  "trabadas-con-r", "ch", "ll-y-y", "r-y-rr", "ca-co-cu-que-qui", "ce-ci-y-z", "ga-go-gu-gue-gui", "ge-gi-y-j",
  "dieresis", "h-muda", "b-y-v", "enie", "x", "palabras-frecuentes",
];
// prisma/stories-data.ts (the database must be seeded).
const esStories = [
  "la-manzanita-roja", "bruno-el-osito-valiente", "mia-la-gatita-curiosa", "canelo-y-su-pelota",
  "lupita-la-patita-timida", "burbujas-el-pececito", "tito-el-buho-sabio", "la-siesta-de-leo",
];

const RULES_ES = [
  ["/es/xyz", {}, 404, null, "unknown Spanish URL"],
  ["/es/pricing", {}, 404, null, "English word under /es"],
  ["/es/tarifs", {}, 404, null, "French word under /es"],
  ["/es/blog", {}, 404, null, "page with no Spanish version"],
  ["/es/mi-cuenta", {}, 307, "/es/iniciar-sesion?next=%2Fes%2Fmi-cuenta", "Spanish dashboard needs login"],
  ["/pricing", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/precios", "remembered Spanish choice"],
  ["/fr/a-propos", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/quienes-somos", "French page, Spanish chosen"],
  ["/es/precios", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/tarifs", "Spanish page, French chosen"],
  ["/es/precios", { headers: { cookie: "NEXT_LOCALE=en" } }, 307, "/pricing", "Spanish page, English chosen"],
  ["/blog", { headers: { cookie: "NEXT_LOCALE=es" } }, 200, null, "no Spanish twin: stay"],
  ["/pricing", { headers: { "accept-language": "es-MX,es;q=0.9" } }, 200, null, "no Accept-Language redirect"],
  // Spanish phase 2: the alphabet.
  ["/es/abecedario/c-cedille", {}, 404, null, "French-only letter under /es"],
  ["/es/abecedario/accents", {}, 404, null, "French accents page under /es"],
  ["/es/abecedario/ñ", {}, 404, null, "ñ is /es/abecedario/enie"],
  ["/es/abecedario/tilde/ficha", {}, 404, null, "no ficha for the tilde page"],
  ["/alphabet/enie", {}, 404, null, "Spanish-only letter under an English URL"],
  ["/fr/alphabet/tilde", {}, 404, null, "Spanish tilde page under /fr"],
  ["/alphabet/b", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/abecedario/b", "letter twin in Spanish"],
  ["/fr/imagier", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/tarjetas", "cards twin in Spanish"],
  ["/es/abecedario/enie", { headers: { cookie: "NEXT_LOCALE=en" } }, 200, null, "Spanish-only letter, English chosen: stay"],
  ["/fr/alphabet/c-cedille", { headers: { cookie: "NEXT_LOCALE=es" } }, 200, null, "French-only letter, Spanish chosen: stay"],
  // Spanish phase 3: the syllables.
  ["/es/silabas/ou", {}, 404, null, "French sound under /es/silabas"],
  ["/es/silabas/blending", {}, 404, null, "English skill under /es/silabas"],
  ["/phonics/vocales", {}, 404, null, "Spanish syllable page under an English URL"],
  ["/fr/sons/silabas-directas", {}, 404, null, "Spanish syllable page under /fr/sons"],
  ["/phonics", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/silabas", "phonics index twin in Spanish"],
  ["/fr/sons", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/silabas", "French sounds index, Spanish chosen"],
  ["/es/silabas/ch", { headers: { cookie: "NEXT_LOCALE=fr" } }, 200, null, "Spanish-only page, French chosen: stay"],
  // Spanish phase 4: worksheets.
  ["/es/fichas/lettre-a-cursive", {}, 404, null, "French worksheet under /es/fichas"],
  ["/es/fichas/letter-a-tracing", {}, 404, null, "English worksheet under /es/fichas"],
  ["/fr/fiches/letra-a-cursiva", {}, 404, null, "Spanish worksheet under /fr/fiches"],
  ["/worksheets/silabas-m", {}, 404, null, "Spanish worksheet under an English URL"],
  ["/es/fichas/paquetes/pack-lettre-a", {}, 404, null, "French pack under /es/fichas/paquetes"],
  ["/worksheets", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/fichas", "worksheet index twin in Spanish"],
  ["/fr/fiches/packs", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/fichas/paquetes", "pack index twin in Spanish"],
  ["/es/fichas/silabas-m", { headers: { cookie: "NEXT_LOCALE=en" } }, 200, null, "Spanish-only worksheet, English chosen: stay"],
  // Spanish phase 6: games, school levels and activities.
  ["/es/juegos/find-the-letter", {}, 404, null, "English game slug under /es/juegos"],
  ["/es/juegos/trouve-la-lettre", {}, 404, null, "French game slug under /es/juegos"],
  ["/games/aplaude-las-silabas", {}, 404, null, "Spanish-only game under an English URL"],
  ["/fr/jeux/aplaude-las-silabas", {}, 404, null, "Spanish-only game under /fr/jeux"],
  ["/es/preescolar/graphisme", {}, 404, null, "French-only topic under /es/preescolar"],
  ["/es/kinder/sight-words", {}, 404, null, "English topic under /es/kinder"],
  ["/preschool/trazos", {}, 404, null, "Spanish-only topic under an English URL"],
  ["/games/find-the-letter", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/juegos/encuentra-la-letra", "game twin with a Spanish slug"],
  ["/fr/jeux/premier-son", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/juegos/primera-silaba", "French game, Spanish chosen"],
  ["/fr/maternelle/coloriage", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/preescolar/colorear", "topic twin in Spanish"],
  ["/kindergarten/handwriting", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/kinder/letra-cursiva", "kindergarten twin in Spanish"],
  ["/activities", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/actividades", "activities twin in Spanish"],
  ["/es/juegos/aplaude-las-silabas", { headers: { cookie: "NEXT_LOCALE=fr" } }, 200, null, "Spanish-only game, French chosen: stay"],
  ["/fr/grande-section/syllabes", { headers: { cookie: "NEXT_LOCALE=es" } }, 200, null, "French-only topic, Spanish chosen: stay"],
  // Stories (phase 5): never another language's story under /es.
  ["/es/cuentos/the-little-apple", {}, 404, null, "English story under /es/cuentos"],
  ["/es/cuentos/la-petite-pomme", {}, 404, null, "French story under /es/cuentos"],
  ["/stories/la-manzanita-roja", {}, 404, null, "Spanish story under an English URL"],
  ["/fr/histoires/la-manzanita-roja", {}, 404, null, "Spanish story under /fr/histoires"],
  ["/es/cuentos/no-existe", {}, 404, null, "unknown Spanish story"],
  ["/stories", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/cuentos", "story list twin in Spanish"],
  ["/fr/histoires", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/cuentos", "French story list, Spanish chosen"],
];

const ptLetters = [..."abc", "c-cedilha", ..."defghijklmnopqrstuvwxyz"];
const ptSyllables = [
  "vogais", "encontros-vocalicos", "familias-silabicas", "contar-silabas", "ch", "lh", "nh", "rr", "ss", "qu", "gu",
  "til", "an-en-in-on-un", "am-em-im-om-um", "encontros-com-r", "encontros-com-l", "ar-er-ir-or-ur", "as-es-is-os-us",
  "al-el-il-ol-ul", "c-e-cedilha", "g-e-j", "x", "h-inicial", "palavras-frequentes",
];

// Portuguese (docs/portuguese-plan.md): every /pt URL answers 404 until its
// page is written.
const RULES_PT = [
  ["/pt/historias", {}, 404, null, "Portuguese page not written yet (phase 5)"],
  // Portuguese phase 2: the alphabet.
  ["/pt/alfabeto/ç", {}, 404, null, "ç is /pt/alfabeto/c-cedilha"],
  ["/pt/alfabeto/enie", {}, 404, null, "Spanish ñ under /pt"],
  ["/pt/alfabeto/c-cedille", {}, 404, null, "French ç slug under /pt"],
  ["/pt/alfabeto/tilde", {}, 404, null, "Spanish tilde page under /pt"],
  ["/pt/alfabeto/acentos/atividade", {}, 404, null, "no activity for the accents page"],
  ["/alphabet/c-cedilha", {}, 404, null, "Portuguese-only Ç under an English URL"],
  ["/es/abecedario/acentos", {}, 404, null, "Portuguese accents page under /es"],
  ["/alphabet/b", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/alfabeto/b", "letter twin in Portuguese"],
  ["/es/tarjetas", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/cartoes", "cards twin in Portuguese"],
  ["/fr/alphabet/b/fiche", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/alfabeto/b/atividade", "tracing twin in Portuguese"],
  ["/pt/alfabeto/c-cedilha", { headers: { cookie: "NEXT_LOCALE=en" } }, 200, null, "Portuguese-only Ç, English chosen: stay"],
  ["/es/abecedario/enie", { headers: { cookie: "NEXT_LOCALE=pt" } }, 200, null, "Spanish-only ñ, Portuguese chosen: stay"],
  ["/pt/xyz", {}, 404, null, "unknown Portuguese URL"],
  ["/pt/pricing", {}, 404, null, "English word under /pt"],
  ["/pt/precios", {}, 404, null, "Spanish word under /pt"],
  ["/pt/tarifs", {}, 404, null, "French word under /pt"],
  ["/pt/blog", {}, 404, null, "page with no Portuguese version"],
  ["/pt/privacidade", {}, 404, null, "legacy privacy page has no Portuguese version"],
  ["/pt/minha-conta", {}, 307, "/pt/entrar?next=%2Fpt%2Fminha-conta", "Portuguese dashboard needs login"],
  ["/pricing", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/precos", "remembered Portuguese choice"],
  ["/es/quienes-somos", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/quem-somos", "Spanish page, Portuguese chosen"],
  ["/fr/conditions-utilisation", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/termos-de-uso", "French page, Portuguese chosen"],
  ["/pt/precos", { headers: { cookie: "NEXT_LOCALE=en" } }, 307, "/pricing", "Portuguese page, English chosen"],
  ["/pt/precos", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/tarifs", "Portuguese page, French chosen"],
  ["/pt/precos", { headers: { cookie: "NEXT_LOCALE=es" } }, 307, "/es/precios", "Portuguese page, Spanish chosen"],
  ["/blog", { headers: { cookie: "NEXT_LOCALE=pt" } }, 200, null, "no Portuguese twin: stay"],
  ["/stories", { headers: { cookie: "NEXT_LOCALE=pt" } }, 200, null, "Portuguese stories not written yet: stay"],
  // Portuguese phase 4: worksheets.
  ["/pt/atividades/letra-a-trazo", {}, 404, null, "Spanish worksheet under /pt/atividades"],
  ["/pt/atividades/lettre-a-cursive", {}, 404, null, "French worksheet under /pt/atividades"],
  ["/pt/atividades/letter-a-tracing", {}, 404, null, "English worksheet under /pt/atividades"],
  ["/pt/atividades/pacotes/paquete-letra-a", {}, 404, null, "Spanish pack under /pt/atividades/pacotes"],
  ["/worksheets/familia-b", {}, 404, null, "Portuguese worksheet under an English URL"],
  ["/es/fichas/familia-b", {}, 404, null, "Portuguese worksheet under /es/fichas"],
  ["/worksheets", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/atividades", "worksheet index twin in Portuguese"],
  ["/es/fichas/paquetes", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/atividades/pacotes", "pack index twin in Portuguese"],
  ["/pt/atividades/familia-b", { headers: { cookie: "NEXT_LOCALE=es" } }, 200, null, "Portuguese-only worksheet, Spanish chosen: stay"],
  ["/es/fichas/letra-a-cursiva", { headers: { cookie: "NEXT_LOCALE=pt" } }, 200, null, "same slug in Spanish, but no twin: stay"],
  // Portuguese phase 3: the syllables.
  ["/pt/silabas/vocales", {}, 404, null, "Spanish syllable page under /pt/silabas"],
  ["/pt/silabas/ou", {}, 404, null, "French sound under /pt/silabas"],
  ["/pt/silabas/blending", {}, 404, null, "English skill under /pt/silabas"],
  ["/es/silabas/familias-silabicas", {}, 404, null, "Portuguese syllable page under /es/silabas"],
  ["/phonics/lh", {}, 404, null, "Portuguese syllable page under an English URL"],
  ["/phonics", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/silabas", "phonics index twin in Portuguese"],
  ["/es/silabas", { headers: { cookie: "NEXT_LOCALE=pt" } }, 307, "/pt/silabas", "Spanish syllables index, Portuguese chosen"],
  ["/pt/silabas/ch", { headers: { cookie: "NEXT_LOCALE=es" } }, 200, null, "Portuguese-only page, Spanish chosen: stay"],
  ["/es/silabas/ch", { headers: { cookie: "NEXT_LOCALE=pt" } }, 200, null, "Spanish-only page, Portuguese chosen: stay"],
  ["/pricing", { headers: { "accept-language": "pt-BR,pt;q=0.9" } }, 200, null, "no Accept-Language redirect"],
  ["/es/precios", { headers: { "accept-language": "pt-BR,pt;q=0.9" } }, 200, null, "no Accept-Language redirect (Spanish page)"],
];

const LANGS = {
  fr: {
    // Where a signed-out visitor is redirected (307) instead of a 200.
    loginRedirect: "tableau-de-bord",
    // English words that are also French words.
    sameWords: ["parent", "parents", "sons", "session"],
    pages: [
      "/fr", "/fr/tarifs", "/fr/a-propos", "/fr/contact", "/fr/confidentialite", "/fr/conditions-utilisation", "/fr/cookies", "/fr/connexion", "/fr/inscription",
      "/fr/alphabet", "/fr/alphabet/accents", "/fr/imagier",
      ...frLetters.flatMap((l) => [`/fr/alphabet/${l}`, `/fr/alphabet/${l}/fiche`]),
      "/fr/sons",
      ...frSounds.map((s) => `/fr/sons/${s}`),
      // French phase 4: worksheets (a sample; the tests check every catalogue entry).
      "/fr/fiches", "/fr/fiches/packs", "/fr/fiches/ecriture-cursive", "/fr/fiches/nombres", "/fr/fiches/sons",
      "/fr/fiches/lettre-a-cursive", "/fr/fiches/lettre-e-accent-aigu-son", "/fr/fiches/syllabes-m", "/fr/fiches/son-ou",
      "/fr/fiches/couleur-rouge", "/fr/fiches/packs/pack-alphabet-complet", "/fr/fiches/packs/pack-lettre-c-cedille",
      // French phase 5: stories (from the database).
      "/fr/histoires", "/fr/histoires/la-petite-pomme", "/fr/histoires/la-sieste-de-leon",
      // French phase 6: games, school levels and activities.
      "/fr/jeux", "/fr/jeux/trouve-la-lettre", "/fr/jeux/lettre-et-image", "/fr/jeux/premier-son", "/fr/jeux/trace-la-lettre", "/fr/jeux/quiz-alphabet",
      "/fr/maternelle", "/fr/maternelle/graphisme", "/fr/maternelle/tracer-les-lettres", "/fr/maternelle/coloriage",
      "/fr/grande-section", "/fr/grande-section/syllabes", "/fr/grande-section/mots-outils", "/fr/grande-section/ecriture-cursive",
      "/fr/activites",
    ],
    rules: RULES_FR,
  },
  // Filled phase by phase, as Spanish pages are written (docs/spanish-plan.md).
  es: {
    loginRedirect: "mi-cuenta",
    sameWords: [],
    pages: [
      // Spanish phase 1: home, UI pages, legal pages.
      "/es", "/es/precios", "/es/quienes-somos", "/es/contacto", "/es/politica-de-privacidad", "/es/terminos-de-uso",
      "/es/cookies", "/es/iniciar-sesion", "/es/registro",
      // Spanish phase 2: the alphabet (27 letters with ñ), the tilde page and the cards.
      "/es/abecedario", "/es/abecedario/tilde", "/es/tarjetas",
      ...esLetters.flatMap((l) => [`/es/abecedario/${l}`, `/es/abecedario/${l}/ficha`]),
      // Spanish phase 3: the syllables (lib/silabas-es.ts).
      "/es/silabas",
      ...esSyllables.map((s) => `/es/silabas/${s}`),
      // Spanish phase 4: worksheets (a sample; the tests check every catalogue entry).
      "/es/fichas", "/es/fichas/paquetes", "/es/fichas/letra-cursiva", "/es/fichas/numeros", "/es/fichas/silabas",
      "/es/fichas/silabas-trabadas", "/es/fichas/letra-a-cursiva", "/es/fichas/letra-enie-trazo", "/es/fichas/letra-m-silaba",
      "/es/fichas/silabas-m", "/es/fichas/silabas-que-qui", "/es/fichas/trabadas-tr", "/es/fichas/numero-15",
      "/es/fichas/color-rojo", "/es/fichas/paquetes/paquete-abecedario-completo", "/es/fichas/paquetes/paquete-letra-enie",
      // Spanish phase 5: stories (from the database).
      "/es/cuentos", ...esStories.map((s) => `/es/cuentos/${s}`),
      // Spanish phase 6: games, school levels and activities.
      "/es/juegos", "/es/juegos/encuentra-la-letra", "/es/juegos/letra-y-dibujo", "/es/juegos/primera-silaba",
      "/es/juegos/traza-la-letra", "/es/juegos/quiz-del-abecedario", "/es/juegos/aplaude-las-silabas",
      "/es/preescolar", "/es/preescolar/trazos", "/es/preescolar/traza-las-letras", "/es/preescolar/colorear",
      "/es/kinder", "/es/kinder/silabas", "/es/kinder/palabras-frecuentes", "/es/kinder/letra-cursiva",
      "/es/actividades",
    ],
    rules: RULES_ES,
  },
  // Filled phase by phase, as Portuguese pages are written.
  pt: {
    loginRedirect: "minha-conta",
    sameWords: [],
    pages: [
      // Portuguese phase 1: home, UI pages, legal pages.
      "/pt", "/pt/precos", "/pt/quem-somos", "/pt/contato", "/pt/politica-de-privacidade", "/pt/termos-de-uso",
      "/pt/cookies", "/pt/entrar", "/pt/cadastro",
      // Portuguese phase 2: the alphabet (26 letters and Ç), the accents page and the cards.
      "/pt/alfabeto", "/pt/alfabeto/acentos", "/pt/cartoes",
      ...ptLetters.flatMap((l) => [`/pt/alfabeto/${l}`, `/pt/alfabeto/${l}/atividade`]),
      // Portuguese phase 3: the syllables (lib/silabas-pt.ts).
      "/pt/silabas",
      ...ptSyllables.map((s) => `/pt/silabas/${s}`),
      // Portuguese phase 4: worksheets (a sample; the tests check every catalogue entry).
      "/pt/atividades", "/pt/atividades/pacotes", "/pt/atividades/letra-bastao", "/pt/atividades/letra-cursiva",
      "/pt/atividades/familias-silabicas", "/pt/atividades/digrafos", "/pt/atividades/sons-nasais", "/pt/atividades/silabas-complexas",
      "/pt/atividades/numeros", "/pt/atividades/letra-a-bastao", "/pt/atividades/letra-c-cedilha-forma", "/pt/atividades/letra-m-silaba",
      "/pt/atividades/familia-b", "/pt/atividades/digrafo-rr", "/pt/atividades/nasal-til", "/pt/atividades/encontro-tr",
      "/pt/atividades/numero-14", "/pt/atividades/cor-marrom", "/pt/atividades/pacotes/pacote-alfabeto-completo",
      "/pt/atividades/pacotes/pacote-letra-c-cedilha",
    ],
    rules: RULES_PT,
  },
};

const config = LANGS[lang];
if (!config) {
  console.log("Usage: node localecheck.mjs <fr|es|pt> [baseUrl]");
  process.exit(1);
}
const { pages, rules, loginRedirect, sameWords } = config;
const NAME = { fr: "French", es: "Spanish", pt: "Portuguese" }[lang];
// The <html lang> each language's pages must have (Portuguese is Brazilian, P1).
const HTML_LANG = { pt: "pt-BR" }[lang] ?? lang;

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
// English words that shouldn't appear in the page text. Word boundaries are
// letter-aware, so "préparent" doesn't contain "parent".
const ENGLISH_WORDS = /(?<!\p{L})(the|and|your|with|free|worksheets?|letters?|sounds?|children|parents?|sign up|log in|learn|games?|stories|about us|privacy|terms|cookie policy)(?!\p{L})/giu;
const looksEnglish = (t) => [...t.matchAll(ENGLISH_WORDS)].some((m) => !sameWords.includes(m[1].toLowerCase()));
const ALLOWED_EN = [/^EN$/, /^English$/, /AlphaBes/, /^Pro$/, /Google|AdSense|Analytics|NextAuth|Neon|Postgres|Cloudflare|Stripe|NEXT_LOCALE|EN \/ FR/];

let problems = 0;
const fail = (msg) => { problems++; console.log("  ✗ " + msg); };
const links = new Set();

async function get(path, opts = {}) {
  const res = await fetch(base + path, { redirect: "manual", ...opts });
  return { res, html: await res.text() };
}

for (const p of pages) {
  const { res, html } = await get(p);
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const htmlLang = html.match(/<html lang="([a-zA-Z-]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const hreflang = [...html.matchAll(/hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => `${m[1]}=${m[2].replace("https://alphabes.com", "")}`);
  console.log(`${p} ${res.status} lang=${htmlLang} title="${title}"`);
  console.log(`    canonical=${canonical ?? "-"} hreflang=[${hreflang.join(" ")}]`);
  if (res.status !== 200) fail(`${p} status ${res.status}`);
  if (htmlLang !== HTML_LANG) fail(`${p} lang ${htmlLang}`);
  const body = (html.split("<body")[1] ?? "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<template[\s\S]*?<\/template>/g, "");
  for (const m of body.matchAll(/<a [^>]*href="([^"#]*)"/g)) if (m[1].startsWith("/")) links.add(m[1]);
  const text = decode(body.replace(/<[^>]+>/g, "\n")).split("\n").map((l) => l.trim()).filter(Boolean);
  const english = text.filter((t) => looksEnglish(t) && !ALLOWED_EN.some((r) => r.test(t)));
  if (english.length) fail(`${p} English-looking text: ${JSON.stringify(english.slice(0, 5))}`);
}

console.log(`\nChecking ${links.size} internal links found on ${NAME} pages…`);
for (const l of [...links].sort()) {
  const { res } = await get(l);
  const where = res.headers.get("location");
  const ok = res.status === 200 || (res.status === 307 && l.includes(loginRedirect));
  console.log(`  ${ok ? "✓" : "✗"} ${res.status} ${l}${where ? " -> " + where : ""}`);
  if (!ok) problems++;
}

console.log("\nRouting rules:");

for (const [path, opts, status, location, label] of rules) {
  const { res, html } = await get(path, opts);
  const loc = res.headers.get("location");
  const locPath = loc ? new URL(loc, base).pathname + new URL(loc, base).search : null;
  const ok = res.status === status && (location === null || locPath === location);
  const extra = res.status === 404 ? ` lang=${html.match(/<html lang="([a-zA-Z-]+)"/)?.[1]} h1="${decode(html.match(/<h1[^>]*>([^<]*)/)?.[1] ?? "")}"` : "";
  console.log(`  ${ok ? "✓" : "✗"} ${label}: ${path} -> ${res.status}${locPath ? " " + locPath : ""}${extra}`);
  if (!ok) problems++;
}

console.log(problems ? `\n${problems} problem(s)` : `\nall ${NAME} checks passed`);
