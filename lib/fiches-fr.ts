// French printable worksheets ("fiches"), the pages under /fr/fiches. They
// are written for French schools (maternelle, CP): script and cursive on
// Seyès ruling, French words, syllables and sounds. They don't mirror the
// English worksheets (lib/worksheets-data.ts): every slug is French-only.
//
// The PDFs are pre-rendered by `npm run fiches:fr` (scripts/fiches-fr/) with
// Chromium, because jsPDF can't join cursive letters. They live in
// public/fiches-pdf/ with a JPEG preview of each page. This file is the
// catalogue both the script and the pages read.
//
// Pure data (plus the letter and sound data it builds on), no other imports.
import { frenchLetters, type FrenchLetter, type FrenchWord } from "./letters-fr";
import { orderedSounds } from "./sons-fr";

export const FICHES_PDF_DIR = "/fiches-pdf";

export type FicheCategoryGroup = "lettres" | "themes";

export type FicheCategory = {
  slug: string;
  group: FicheCategoryGroup;
  /** "Tracé des lettres". */
  name: string;
  /** Card blurb and meta description. */
  description: string;
  /** Paragraph at the top of the category page. */
  intro: string;
  level: string;
  skills: string[];
};

/** The six worksheet types made for every letter, in page order. */
export type LetterFicheType = "trace" | "cursive" | "reconnaissance" | "son" | "coloriage" | "mots";

export type Fiche = {
  slug: string;
  category: string;
  title: string;
  /** Short name used in lists ("Lettre B", "Le nombre 3"). */
  label: string;
  /** What's drawn on the preview tile ("Bb", "3", "ou"). */
  tile: string;
  description: string;
  /** The instruction printed on the sheet. */
  consigne: string;
  level: string;
  skills: string[];
  /** Letter slug, for letter worksheets. */
  letter?: string;
  /** Sound slug, for sound worksheets. */
  sound?: string;
  pdf: string;
  preview: string;
};

export type FichePack = {
  slug: string;
  title: string;
  description: string;
  fiches: string[];
  pdf: string;
};

// ---------------------------------------------------------------- content

/** Words for the "son" worksheet: pictures whose name starts with the letter's sound. */
export type LetterImages = {
  question: string;
  /** Sound family, so distractors never start with the same sound. */
  key: string;
  yes: FrenchWord[];
};

const w = (word: string, withArticle: string, emoji: string): FrenchWord => ({ word, withArticle, emoji });

// Letters whose sound can't be found at the start of a word by ear (h is
// silent, w and x are rare, è ê ç are never first) get no "son" worksheet.
export const LETTER_IMAGES: Record<string, LetterImages> = {
  a: { key: "a", question: "Entoure les images dont le nom commence par le son [a], comme avion.", yes: [w("avion", "un avion", "✈️"), w("abeille", "une abeille", "🐝"), w("ananas", "un ananas", "🍍")] },
  b: { key: "b", question: "Entoure les images dont le nom commence par le son [b], comme ballon.", yes: [w("ballon", "un ballon", "🎈"), w("banane", "une banane", "🍌"), w("bébé", "un bébé", "👶")] },
  c: { key: "k", question: "Entoure les images dont le nom commence par le son [k], comme canard.", yes: [w("canard", "un canard", "🦆"), w("cadeau", "un cadeau", "🎁"), w("coq", "un coq", "🐓")] },
  d: { key: "d", question: "Entoure les images dont le nom commence par le son [d], comme dauphin.", yes: [w("dauphin", "un dauphin", "🐬"), w("dinosaure", "un dinosaure", "🦕"), w("dé", "un dé", "🎲")] },
  e: { key: "è", question: "Entoure les images dont le nom commence par la lettre e, comme escargot.", yes: [w("escargot", "un escargot", "🐌"), w("elfe", "un elfe", "🧝")] },
  f: { key: "f", question: "Entoure les images dont le nom commence par le son [f], comme fraise.", yes: [w("fraise", "une fraise", "🍓"), w("fleur", "une fleur", "🌸"), w("fusée", "une fusée", "🚀")] },
  g: { key: "g", question: "Entoure les images dont le nom commence par le son [g], comme gâteau.", yes: [w("gâteau", "un gâteau", "🎂"), w("gorille", "un gorille", "🦍"), w("guitare", "une guitare", "🎸")] },
  i: { key: "i", question: "Entoure les images dont le nom commence par le son [i], comme iguane.", yes: [w("iguane", "un iguane", "🦎"), w("île", "une île", "🏝️")] },
  j: { key: "j", question: "Entoure les images dont le nom commence par le son [ʒ], comme jus.", yes: [w("jus", "du jus", "🧃"), w("jouet", "un jouet", "🧸"), w("jupe", "une jupe", "👗")] },
  k: { key: "k", question: "Entoure les images dont le nom commence par la lettre k, comme koala.", yes: [w("koala", "un koala", "🐨"), w("kangourou", "un kangourou", "🦘"), w("kiwi", "un kiwi", "🥝")] },
  l: { key: "l", question: "Entoure les images dont le nom commence par le son [l], comme lion.", yes: [w("lion", "un lion", "🦁"), w("lune", "la lune", "🌙"), w("lapin", "un lapin", "🐰")] },
  m: { key: "m", question: "Entoure les images dont le nom commence par le son [m], comme moto.", yes: [w("moto", "une moto", "🏍️"), w("maison", "une maison", "🏠"), w("mouton", "un mouton", "🐑")] },
  n: { key: "n", question: "Entoure les images dont le nom commence par le son [n], comme nuage.", yes: [w("nuage", "un nuage", "☁️"), w("nez", "un nez", "👃")] },
  o: { key: "o", question: "Entoure les images dont le nom commence par le son [o], comme orange.", yes: [w("orange", "une orange", "🍊"), w("os", "un os", "🦴")] },
  p: { key: "p", question: "Entoure les images dont le nom commence par le son [p], comme pomme.", yes: [w("pomme", "une pomme", "🍎"), w("papillon", "un papillon", "🦋"), w("poisson", "un poisson", "🐟")] },
  q: { key: "k", question: "Entoure les images dont le nom commence par les lettres qu, comme quille.", yes: [w("quille", "une quille", "🎳"), w("quatre", "quatre", "4️⃣")] },
  r: { key: "r", question: "Entoure les images dont le nom commence par le son [ʁ], comme robot.", yes: [w("robot", "un robot", "🤖"), w("renard", "un renard", "🦊"), w("raisin", "du raisin", "🍇")] },
  s: { key: "s", question: "Entoure les images dont le nom commence par le son [s], comme soleil.", yes: [w("soleil", "le soleil", "☀️"), w("serpent", "un serpent", "🐍"), w("sapin", "un sapin", "🌲")] },
  t: { key: "t", question: "Entoure les images dont le nom commence par le son [t], comme tortue.", yes: [w("tortue", "une tortue", "🐢"), w("tomate", "une tomate", "🍅"), w("train", "un train", "🚆")] },
  u: { key: "u", question: "Entoure les images dont le nom commence par le son [y], comme usine.", yes: [w("usine", "une usine", "🏭"), w("univers", "l'univers", "🌌")] },
  v: { key: "v", question: "Entoure les images dont le nom commence par le son [v], comme vache.", yes: [w("vache", "une vache", "🐄"), w("vélo", "un vélo", "🚲"), w("violon", "un violon", "🎻")] },
  y: { key: "y", question: "Entoure les images dont le nom commence par la lettre y, comme yoyo.", yes: [w("yoyo", "un yoyo", "🪀"), w("yeux", "des yeux", "👀")] },
  z: { key: "z", question: "Entoure les images dont le nom commence par le son [z], comme zèbre.", yes: [w("zèbre", "un zèbre", "🦓"), w("zéro", "zéro", "0️⃣")] },
  "e-accent-aigu": { key: "é", question: "Entoure les images dont le nom commence par le son [e], comme éléphant.", yes: [w("éléphant", "un éléphant", "🐘"), w("étoile", "une étoile", "⭐"), w("école", "une école", "🏫")] },
};

// Sounds too close to tell apart for a young child: never distractors for each other.
export const CLOSE_KEYS: Record<string, string[]> = { "è": ["é"], "é": ["è"], k: ["g"], g: ["k"], s: ["z"], z: ["s"], i: ["y"], y: ["i"] };

/** Six other pictures for a "son" worksheet, the same on every run. */
export function imageDistractors(letter: string, count = 6): FrenchWord[] {
  const target = LETTER_IMAGES[letter];
  const banned = new Set([target.key, ...(CLOSE_KEYS[target.key] ?? [])]);
  const pool = Object.entries(LETTER_IMAGES)
    .filter(([slug, li]) => slug !== letter && !banned.has(li.key))
    .flatMap(([, li]) => li.yes);
  // Deterministic spread through the pool from a letter-dependent start. The
  // seed stays a 32-bit integer (a long slug would overflow a plain number),
  // and the step shares no factor with the pool size, so every word is reached.
  const seed = [...letter].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  let step = 7;
  while (gcd(step, pool.length) !== 1) step++;
  const out: FrenchWord[] = [];
  for (let i = 0; out.length < count && i < pool.length; i++) out.push(pool[(seed + i * step) % pool.length]);
  return out;
}

/** Look-alike letters mixed into the recognition grid. */
export const LOOK_ALIKES: Record<string, string> = {
  a: "odeq", b: "dpqh", c: "eoç", d: "bpqa", e: "céoa", f: "tlj", g: "qpy", h: "nbk", i: "ljt", j: "igy",
  k: "hxl", l: "itf", m: "nwu", n: "muh", o: "ace", p: "qbd", q: "pgd", r: "nvt", s: "zc", t: "fli",
  u: "nvy", v: "wuy", w: "vmu", x: "kzy", y: "vgj", z: "sx", "é": "eèê", "è": "éeê", "ê": "éèe", "ç": "ce",
};

export const NUMBERS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"];

export type Shape = { slug: string; name: string; withArticle: string };
export const SHAPES: Shape[] = [
  { slug: "rond", name: "rond", withArticle: "le rond" },
  { slug: "carre", name: "carré", withArticle: "le carré" },
  { slug: "triangle", name: "triangle", withArticle: "le triangle" },
  { slug: "rectangle", name: "rectangle", withArticle: "le rectangle" },
  { slug: "losange", name: "losange", withArticle: "le losange" },
  { slug: "ovale", name: "ovale", withArticle: "l'ovale" },
  { slug: "etoile", name: "étoile", withArticle: "l'étoile" },
  { slug: "coeur", name: "cœur", withArticle: "le cœur" },
];

export type Colour = { slug: string; name: string; hex: string; thing: FrenchWord };
export const COLOURS: Colour[] = [
  { slug: "rouge", name: "rouge", hex: "#E53935", thing: w("fraise", "la fraise", "🍓") },
  { slug: "bleu", name: "bleu", hex: "#1E88E5", thing: w("baleine", "la baleine", "🐳") },
  { slug: "jaune", name: "jaune", hex: "#FDD835", thing: w("soleil", "le soleil", "☀️") },
  { slug: "vert", name: "vert", hex: "#43A047", thing: w("grenouille", "la grenouille", "🐸") },
  { slug: "orange", name: "orange", hex: "#FB8C00", thing: w("carotte", "la carotte", "🥕") },
  { slug: "violet", name: "violet", hex: "#8E24AA", thing: w("raisin", "le raisin", "🍇") },
  { slug: "rose", name: "rose", hex: "#F48FB1", thing: w("cochon", "le cochon", "🐷") },
  { slug: "marron", name: "marron", hex: "#795548", thing: w("ours", "l'ours", "🐻") },
  { slug: "gris", name: "gris", hex: "#9E9E9E", thing: w("éléphant", "l'éléphant", "🐘") },
  { slug: "noir", name: "noir", hex: "#212121", thing: w("chapeau", "le chapeau", "🎩") },
];

/** Mots-outils, four per sheet, with a sentence that uses them. */
export const MOTS_OUTILS_GROUPS: { words: string[]; sentence: string }[] = [
  { words: ["le", "la", "les", "un"], sentence: "Le chat et la souris jouent avec les billes." },
  { words: ["une", "et", "est", "il"], sentence: "Il a une pomme et une poire. La pomme est rouge." },
  { words: ["elle", "je", "tu", "on"], sentence: "Je lis, tu dessines, elle chante : on est bien !" },
  { words: ["dans", "sur", "avec", "pour"], sentence: "Le chat dort sur le lit, avec Léo, dans sa chambre." },
  { words: ["mais", "qui", "c'est", "il y a"], sentence: "Il y a un gâteau. C'est pour qui ? Pour Lina, mais pas pour le chat !" },
];

/** Syllable sheets: consonant + vowels, then words cut into syllables ("vé|lo"). */
export const SYLLABLE_SHEETS: { consonant: string; words: FrenchWord[] }[] = [
  { consonant: "l", words: [w("lu|ne", "la lune", "🌙"), w("vé|lo", "un vélo", "🚲"), w("sa|la|de", "une salade", "🥗"), w("la|ma", "un lama", "🦙")] },
  { consonant: "m", words: [w("mo|to", "une moto", "🏍️"), w("to|ma|te", "une tomate", "🍅"), w("pom|me", "une pomme", "🍎"), w("la|ma", "un lama", "🦙")] },
  { consonant: "r", words: [w("ro|bot", "un robot", "🤖"), w("ro|be", "une robe", "👗"), w("pi|ra|te", "un pirate", "🏴‍☠️"), w("ca|rot|te", "une carotte", "🥕")] },
  { consonant: "s", words: [w("sa|la|de", "une salade", "🥗"), w("so|da", "un soda", "🥤"), w("si|rè|ne", "une sirène", "🧜"), w("su|cet|te", "une sucette", "🍭")] },
  { consonant: "f", words: [w("fée", "une fée", "🧚"), w("ca|fé", "un café", "☕"), w("gi|ra|fe", "une girafe", "🦒")] },
  { consonant: "v", words: [w("vé|lo", "un vélo", "🚲"), w("va|li|se", "une valise", "🧳"), w("vi|pè|re", "une vipère", "🐍")] },
  { consonant: "n", words: [w("ba|na|ne", "une banane", "🍌"), w("ca|na|pé", "un canapé", "🛋️"), w("a|na|nas", "un ananas", "🍍"), w("lu|ne", "la lune", "🌙")] },
  { consonant: "p", words: [w("pi|ra|te", "un pirate", "🏴‍☠️"), w("pa|ta|te", "une patate", "🥔"), w("pi|a|no", "un piano", "🎹"), w("pom|me", "une pomme", "🍎")] },
  { consonant: "t", words: [w("to|ma|te", "une tomate", "🍅"), w("tu|li|pe", "une tulipe", "🌷"), w("mo|to", "une moto", "🏍️"), w("tas|se", "une tasse", "☕")] },
  { consonant: "d", words: [w("dé", "un dé", "🎲"), w("sa|la|de", "une salade", "🥗"), w("ju|do", "le judo", "🥋")] },
  { consonant: "b", words: [w("ba|na|ne", "une banane", "🍌"), w("bé|bé", "un bébé", "👶"), w("ro|be", "une robe", "👗")] },
  { consonant: "c", words: [w("ca|na|pé", "un canapé", "🛋️"), w("co|co", "une noix de coco", "🥥"), w("ca|deau", "un cadeau", "🎁")] },
  { consonant: "j", words: [w("ju|do", "le judo", "🥋"), w("ju|pe", "une jupe", "👗"), w("jus", "du jus", "🧃")] },
];
export const SYLLABLE_VOWELS = ["a", "e", "i", "o", "u", "é"];

// ---------------------------------------------------------------- catalogue

const LETTER_TYPES: { type: LetterFicheType; category: FicheCategory }[] = [
  {
    type: "trace",
    category: {
      slug: "trace-des-lettres",
      group: "lettres",
      name: "Tracé des lettres",
      description: "Repasser la lettre en capitale et en script, puis l'écrire seul, lettre par lettre.",
      intro:
        "Une fiche par lettre : la capitale et la minuscule script à repasser en suivant le contour, puis à écrire seul sur des lignes simples. Pour la moyenne et la grande section, avant la cursive.",
      level: "Moyenne et grande section",
      skills: ["Geste graphique", "Capitales", "Script"],
    },
  },
  {
    type: "cursive",
    category: {
      slug: "ecriture-cursive",
      group: "lettres",
      name: "Écriture cursive",
      description: "La lettre en cursive sur lignes Seyès : un modèle, des lettres à repasser, puis des lignes à remplir.",
      intro:
        "Chaque fiche présente la lettre en écriture cursive sur de grands carreaux Seyès, comme dans le cahier de l'école : un modèle, des lettres grises à repasser, puis la ligne à écrire seul. La minuscule d'abord, la majuscule ensuite, puis un mot.",
      level: "Grande section et CP",
      skills: ["Écriture cursive", "Lignage Seyès", "Geste graphique"],
    },
  },
  {
    type: "reconnaissance",
    category: {
      slug: "reconnaissance-des-lettres",
      group: "lettres",
      name: "Reconnaître les lettres",
      description: "Retrouver la lettre dans ses trois écritures (capitale, script, cursive) parmi des lettres qui lui ressemblent.",
      intro:
        "Une grille de lettres dans les trois écritures de l'école (capitale, script et cursive), avec des lettres qui se ressemblent (b, d, p, q…). L'enfant entoure toutes celles qu'il reconnaît.",
      level: "Moyenne et grande section",
      skills: ["Reconnaissance des lettres", "Trois écritures", "Discrimination visuelle"],
    },
  },
  {
    type: "son",
    category: {
      slug: "son-des-lettres",
      group: "lettres",
      name: "Le son de la lettre",
      description: "Dire le nom de chaque image et entourer celles qui commencent par le son de la lettre.",
      intro:
        "Neuf images à nommer à voix haute : l'enfant entoure celles dont le nom commence par le son de la lettre. Un exercice d'écoute, avant de savoir lire.",
      level: "Grande section",
      skills: ["Conscience phonologique", "Premier son", "Vocabulaire"],
    },
  },
  {
    type: "coloriage",
    category: {
      slug: "coloriage-des-lettres",
      group: "lettres",
      name: "Coloriage des lettres",
      description: "Une grande lettre et un dessin à colorier, pour associer la lettre à un mot.",
      intro:
        "Une grande lettre à colorier et un dessin dont le nom commence par cette lettre (ou la contient). Parfait pour les plus petits, dès la petite section.",
      level: "Petite et moyenne section",
      skills: ["Motricité fine", "Reconnaissance des lettres", "Vocabulaire"],
    },
  },
  {
    type: "mots",
    category: {
      slug: "ecrire-des-mots",
      group: "lettres",
      name: "Écrire des mots",
      description: "Des mots illustrés à recopier en cursive sur lignes Seyès : un modèle, à repasser, puis seul.",
      intro:
        "Deux ou trois mots illustrés par lettre, à écrire en cursive sur lignes Seyès : on lit le modèle, on repasse le mot en gris, puis on l'écrit seul.",
      level: "CP",
      skills: ["Écriture cursive", "Copie de mots", "Vocabulaire"],
    },
  },
];

const THEME_CATEGORIES: FicheCategory[] = [
  {
    slug: "nombres",
    group: "themes",
    name: "Les nombres",
    description: "Les nombres de 0 à 10 : écrire le chiffre, colorier la quantité, écrire le mot en cursive.",
    intro:
      "Une fiche par nombre, de zéro à dix : le chiffre à repasser, la quantité à colorier, et le nombre écrit en lettres à recopier en cursive.",
    level: "Moyenne section à CP",
    skills: ["Écrire les chiffres", "Quantités", "Écriture cursive"],
  },
  {
    slug: "formes",
    group: "themes",
    name: "Les formes",
    description: "Rond, carré, triangle… repasser les formes et écrire leur nom.",
    intro:
      "Huit formes à repasser en suivant les pointillés : une grande, puis des petites, et leur nom à écrire. De quoi préparer le geste d'écriture.",
    level: "Petite et moyenne section",
    skills: ["Geste graphique", "Formes géométriques", "Vocabulaire"],
  },
  {
    slug: "couleurs",
    group: "themes",
    name: "Les couleurs",
    description: "Dix couleurs : colorier le dessin de la bonne couleur et écrire le nom de la couleur.",
    intro:
      "Rouge comme la fraise, jaune comme le soleil… Chaque fiche associe une couleur à un dessin à colorier, avec le nom de la couleur à lire et à écrire.",
    level: "Petite et moyenne section",
    skills: ["Couleurs", "Coloriage", "Lecture de mots"],
  },
  {
    slug: "mots-outils",
    group: "themes",
    name: "Les mots-outils",
    description: "Les petits mots les plus fréquents (le, la, et, est, dans…) à lire, repasser et écrire.",
    intro:
      "Quatre mots-outils par fiche : on les lit en script, on les repasse en cursive, on les écrit seul, puis on les retrouve dans une phrase.",
    level: "CP",
    skills: ["Mots-outils", "Lecture", "Écriture cursive"],
  },
  {
    slug: "syllabes",
    group: "themes",
    name: "Les syllabes",
    description: "Lire les syllabes d'une consonne (ma, me, mi…), puis des mots découpés en syllabes.",
    intro:
      "Une fiche par consonne : le tableau des syllabes à lire (ma, me, mi, mo, mu, mé), des mots illustrés découpés en syllabes, et des syllabes à écrire en cursive.",
    level: "Grande section et CP",
    skills: ["Syllabes", "Déchiffrage", "Écriture cursive"],
  },
  {
    slug: "sons",
    group: "themes",
    name: "Les sons",
    description: "Une fiche par son (ou, on, an, ch…) : entourer le son dans les mots, lire une phrase, écrire.",
    intro:
      "Une fiche pour chaque son étudié au CP, à utiliser avec sa page de sons : des mots illustrés où entourer le son, une phrase à lire, et des mots à écrire en cursive.",
    level: "CP",
    skills: ["Sons complexes", "Lecture", "Écriture cursive"],
  },
];

export const FICHE_CATEGORIES: FicheCategory[] = [...LETTER_TYPES.map((t) => t.category), ...THEME_CATEGORIES];

const pdfPath = (category: string, slug: string) => `${FICHES_PDF_DIR}/${category}/${slug}.pdf`;
const previewPath = (slug: string) => `${FICHES_PDF_DIR}/apercus/${slug}.jpg`;

/** "La lettre É" for accents, "La lettre B" otherwise. */
function letterName(l: FrenchLetter): string {
  return `la lettre ${l.upper}`;
}

function letterFiche(l: FrenchLetter, type: LetterFicheType, category: FicheCategory): Fiche | null {
  const slug = `lettre-${l.slug}-${type}`;
  const name = letterName(l);
  const base = { slug, category: category.slug, level: category.level, skills: category.skills, letter: l.slug, pdf: pdfPath(category.slug, slug), preview: previewPath(slug), label: `Lettre ${l.upper}`, tile: `${l.upper}${l.lower}` };
  const words = [...l.words, ...(l.wordsInside ?? [])].map((x) => x.word.toLowerCase());
  switch (type) {
    case "trace":
      return { ...base, title: `Tracer ${name} en capitale et en script`, description: `Fiche gratuite à imprimer pour tracer ${name} en capitale (${l.upper}) et en script (${l.lower}), avec le mot ${words[0]}.`, consigne: `Repasse les lettres ${l.upper} et ${l.lower} en suivant le contour, puis écris-les seul sur la ligne.` };
    case "cursive":
      return { ...base, title: `Écrire ${name} en cursive (lignes Seyès)`, description: `Fiche d'écriture cursive de ${name} sur grands carreaux Seyès : un modèle, des lettres à repasser, la majuscule et le mot ${words[0]}.`, consigne: `Repasse les lettres grises, puis écris la lettre seul jusqu'au bout de la ligne.` };
    case "reconnaissance":
      return { ...base, title: `Reconnaître ${name} dans ses trois écritures`, description: `Fiche gratuite : retrouver ${name} en capitale, en script et en cursive parmi des lettres qui lui ressemblent.`, consigne: `Entoure toutes les lettres ${l.upper} ${l.lower} que tu trouves : en capitale, en script et en cursive.` };
    case "son": {
      const images = LETTER_IMAGES[l.slug];
      if (!images) return null;
      return { ...base, title: `Le son de ${name} : entoure les images`, description: `Fiche d'écoute pour ${name} : nommer neuf images et entourer celles qui commencent par son son, comme ${images.yes[0].word}.`, consigne: images.question };
    }
    case "coloriage":
      return { ...base, title: `Coloriage de ${name}`, description: `Coloriage gratuit à imprimer : une grande lettre ${l.upper} et le dessin ${l.words[0].withArticle}, pour associer la lettre et le mot.`, consigne: `Colorie la grande lettre ${l.upper}, la petite lettre ${l.lower} et le dessin : c'est ${l.words[0].withArticle}. Dis le mot à voix haute.` };
    case "mots":
      return { ...base, title: `Écrire des mots avec ${name}`, description: `Fiche d'écriture cursive sur lignes Seyès : les mots ${words.slice(0, 3).join(", ")} à lire, repasser et écrire seul.`, consigne: `Lis le mot, repasse-le en gris, puis écris-le seul sur la ligne.` };
  }
}

function buildFiches(): Fiche[] {
  const out: Fiche[] = [];
  for (const { type, category } of LETTER_TYPES) {
    for (const l of frenchLetters) {
      const f = letterFiche(l, type, category);
      if (f) out.push(f);
    }
  }
  const theme = (slug: string) => THEME_CATEGORIES.find((c) => c.slug === slug)!;
  const common = (c: FicheCategory, slug: string) => ({ slug, category: c.slug, level: c.level, skills: c.skills, pdf: pdfPath(c.slug, slug), preview: previewPath(slug) });

  const nombres = theme("nombres");
  NUMBERS.forEach((word, n) => {
    out.push({ ...common(nombres, `nombre-${n}`), label: `Le nombre ${n}`, tile: String(n), title: `Le nombre ${n} (${word}) : écrire et colorier`, description: `Fiche gratuite sur le nombre ${n} : le chiffre à repasser, ${n === 0 ? "rien à colorier (zéro !)" : `${n} dessin${n > 1 ? "s" : ""} à colorier`} et le mot « ${word} » à écrire en cursive.`, consigne: n === 0 ? `Repasse le chiffre 0. Zéro, c'est rien du tout : ne colorie aucun ballon !` : `Repasse le chiffre ${n}, puis colorie ${n} ballon${n > 1 ? "s" : ""}.` });
  });
  const formes = theme("formes");
  for (const s of SHAPES) {
    out.push({ ...common(formes, `forme-${s.slug}`), label: cap(s.withArticle), tile: s.name, title: `${cap(s.withArticle)} : forme à repasser`, description: `Fiche gratuite : repasser ${s.withArticle} en suivant les pointillés, en grand puis en petit, et écrire le mot « ${s.name} ».`, consigne: `Repasse ${s.withArticle} en suivant les pointillés, puis dessine-en un seul.` });
  }
  const couleurs = theme("couleurs");
  for (const c of COLOURS) {
    out.push({ ...common(couleurs, `couleur-${c.slug}`), label: cap(c.name), tile: c.name, title: `La couleur ${c.name} : colorie ${c.thing.withArticle}`, description: `Fiche gratuite sur la couleur ${c.name} : colorier ${c.thing.withArticle} en ${c.name} et écrire le mot « ${c.name} ».`, consigne: `Colorie ${c.thing.withArticle} en ${c.name}, puis écris le mot ${c.name}.` });
  }
  const mo = theme("mots-outils");
  MOTS_OUTILS_GROUPS.forEach((g, i) => {
    const list = g.words.join(", ");
    out.push({ ...common(mo, `mots-outils-${i + 1}`), label: `Mots-outils ${i + 1}`, tile: g.words[0], title: `Mots-outils ${i + 1} : ${list}`, description: `Fiche gratuite de mots-outils du CP : lire, repasser et écrire ${list}, puis les retrouver dans une phrase.`, consigne: `Lis chaque mot, repasse-le en cursive, puis écris-le seul. Entoure ces mots dans la phrase.` });
  });
  const syl = theme("syllabes");
  for (const s of SYLLABLE_SHEETS) {
    const row = SYLLABLE_VOWELS.map((v) => s.consonant + v).join(", ");
    out.push({ ...common(syl, `syllabes-${s.consonant}`), label: `Syllabes avec ${s.consonant}`, tile: `${s.consonant}a`, title: `Lire les syllabes avec ${s.consonant} (${row})`, description: `Fiche de lecture : les syllabes ${row}, des mots illustrés découpés en syllabes et des syllabes à écrire en cursive.`, consigne: `Lis les syllabes, puis les mots en suivant les arcs. Écris les syllabes en cursive.` });
  }
  const sons = theme("sons");
  for (const s of orderedSounds()) {
    if (!s.words || s.slug === "syllabes") continue;
    out.push({ ...common(sons, `son-${s.slug}`), sound: s.slug, label: s.title, tile: s.short, title: `${s.title} : fiche à imprimer`, description: `Fiche gratuite pour ${s.title.charAt(0).toLowerCase()}${s.title.slice(1)} : ${s.summary.charAt(0).toLowerCase()}${s.summary.slice(1)}`, consigne: s.marks === "silent" ? "Lis les mots et barre les lettres muettes. Lis la phrase, puis écris les mots en cursive." : `Lis les mots et entoure les lettres qui font le son. Lis la phrase, puis écris les mots en cursive.` });
  }
  return out;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const fiches: Fiche[] = buildFiches();

function buildPacks(): FichePack[] {
  const packPdf = (slug: string) => `${FICHES_PDF_DIR}/packs/${slug}.pdf`;
  const inCategory = (c: string) => fiches.filter((f) => f.category === c).map((f) => f.slug);
  const packs: FichePack[] = [
    {
      slug: "pack-alphabet-complet",
      title: "Le pack alphabet complet",
      description: "Toutes les fiches des lettres de A à Z, accents compris : tracé, cursive, reconnaissance, son, coloriage et mots, en un seul PDF.",
      fiches: fiches.filter((f) => f.letter).map((f) => f.slug),
      pdf: packPdf("pack-alphabet-complet"),
    },
  ];
  for (const c of FICHE_CATEGORIES) {
    packs.push({ slug: `pack-${c.slug}`, title: `Pack ${c.name.charAt(0).toLowerCase()}${c.name.slice(1)}`, description: `${c.description} Toutes les fiches en un seul PDF.`, fiches: inCategory(c.slug), pdf: packPdf(`pack-${c.slug}`) });
  }
  for (const l of frenchLetters) {
    packs.push({
      slug: `pack-lettre-${l.slug}`,
      title: `Pack de la lettre ${l.upper}`,
      description: `Toutes les fiches de la lettre ${l.upper} ${l.lower} en un seul PDF : tracé, cursive, reconnaissance${LETTER_IMAGES[l.slug] ? ", son" : ""}, coloriage et mots.`,
      fiches: fiches.filter((f) => f.letter === l.slug).map((f) => f.slug),
      pdf: packPdf(`pack-lettre-${l.slug}`),
    });
  }
  return packs;
}

export const fichePacks: FichePack[] = buildPacks();

export function getFicheCategory(slug: string): FicheCategory | undefined {
  return FICHE_CATEGORIES.find((c) => c.slug === slug);
}

export function getFiche(slug: string): Fiche | undefined {
  return fiches.find((f) => f.slug === slug);
}

export function getFichePack(slug: string): FichePack | undefined {
  return fichePacks.find((p) => p.slug === slug);
}

export function fichesInCategory(category: string): Fiche[] {
  return fiches.filter((f) => f.category === category);
}

export function fichesForLetter(letter: string): Fiche[] {
  return fiches.filter((f) => f.letter === letter);
}

export function ficheForSound(sound: string): Fiche | undefined {
  return fiches.find((f) => f.sound === sound);
}

/** Previous and next worksheet in the same category (no wrap-around). */
export function ficheNeighbors(slug: string): { prev?: Fiche; next?: Fiche } {
  const f = getFiche(slug)!;
  const list = fichesInCategory(f.category);
  const i = list.findIndex((x) => x.slug === slug);
  return { prev: list[i - 1], next: list[i + 1] };
}

/** Every French /fiches/[category] param: categories and worksheets. */
export function ficheCategoryParams(): string[] {
  return [...FICHE_CATEGORIES.map((c) => c.slug), ...fiches.map((f) => f.slug)];
}
