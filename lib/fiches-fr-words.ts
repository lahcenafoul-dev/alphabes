// The pictured words of the French "son" worksheets (lib/fiches-fr.ts),
// also used by the French games (lib/games-fr.ts). Pure data, kept apart from
// the worksheet catalogue so the games' browser code stays small.
import type { FrenchWord } from "./letters-fr";

const w = (word: string, withArticle: string, emoji: string): FrenchWord => ({ word, withArticle, emoji });

/** Words for the "son" worksheet: pictures whose name starts with the letter's sound. */
export type LetterImages = {
  question: string;
  /** Sound family, so distractors never start with the same sound. */
  key: string;
  yes: FrenchWord[];
};

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
