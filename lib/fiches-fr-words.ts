// The pictured words of the French "son" worksheets (lib/fiches-fr.ts),
// also used by the French games (lib/games-fr.ts). Pure data, kept apart from
// the worksheet catalogue so the games' browser code stays small.
import type { FrenchWord } from "./letters-fr";

const w = (word: string, withArticle: string, picture: string): FrenchWord => ({ word, withArticle, picture });

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
  a: { key: "a", question: "Entoure les images dont le nom commence par le son [a], comme avion.", yes: [w("avion", "un avion", "airplane"), w("abeille", "une abeille", "bee"), w("ananas", "un ananas", "pineapple")] },
  b: { key: "b", question: "Entoure les images dont le nom commence par le son [b], comme ballon.", yes: [w("ballon", "un ballon", "balloon"), w("banane", "une banane", "banana"), w("bébé", "un bébé", "baby")] },
  c: { key: "k", question: "Entoure les images dont le nom commence par le son [k], comme canard.", yes: [w("canard", "un canard", "duck"), w("cadeau", "un cadeau", "gift"), w("coq", "un coq", "rooster")] },
  d: { key: "d", question: "Entoure les images dont le nom commence par le son [d], comme dauphin.", yes: [w("dauphin", "un dauphin", "dolphin"), w("dinosaure", "un dinosaure", "dinosaur"), w("dé", "un dé", "dice")] },
  e: { key: "è", question: "Entoure les images dont le nom commence par la lettre e, comme escargot.", yes: [w("escargot", "un escargot", "snail"), w("elfe", "un elfe", "elf")] },
  f: { key: "f", question: "Entoure les images dont le nom commence par le son [f], comme fraise.", yes: [w("fraise", "une fraise", "strawberry"), w("fleur", "une fleur", "flower"), w("fusée", "une fusée", "rocket")] },
  g: { key: "g", question: "Entoure les images dont le nom commence par le son [g], comme gâteau.", yes: [w("gâteau", "un gâteau", "cake"), w("gorille", "un gorille", "gorilla"), w("guitare", "une guitare", "guitar")] },
  i: { key: "i", question: "Entoure les images dont le nom commence par le son [i], comme iguane.", yes: [w("iguane", "un iguane", "lizard"), w("île", "une île", "island")] },
  j: { key: "j", question: "Entoure les images dont le nom commence par le son [ʒ], comme jus.", yes: [w("jus", "du jus", "juice"), w("jouet", "un jouet", "teddy-bear"), w("jupe", "une jupe", "dress")] },
  k: { key: "k", question: "Entoure les images dont le nom commence par la lettre k, comme koala.", yes: [w("koala", "un koala", "koala"), w("kangourou", "un kangourou", "kangaroo"), w("kiwi", "un kiwi", "kiwi")] },
  l: { key: "l", question: "Entoure les images dont le nom commence par le son [l], comme lion.", yes: [w("lion", "un lion", "lion"), w("lune", "la lune", "moon"), w("lapin", "un lapin", "rabbit")] },
  m: { key: "m", question: "Entoure les images dont le nom commence par le son [m], comme moto.", yes: [w("moto", "une moto", "motorbike"), w("maison", "une maison", "house"), w("mouton", "un mouton", "sheep")] },
  n: { key: "n", question: "Entoure les images dont le nom commence par le son [n], comme nuage.", yes: [w("nuage", "un nuage", "cloud"), w("nez", "un nez", "nose")] },
  o: { key: "o", question: "Entoure les images dont le nom commence par le son [o], comme orange.", yes: [w("orange", "une orange", "orange"), w("os", "un os", "bone")] },
  p: { key: "p", question: "Entoure les images dont le nom commence par le son [p], comme pomme.", yes: [w("pomme", "une pomme", "apple"), w("papillon", "un papillon", "butterfly"), w("poisson", "un poisson", "fish")] },
  q: { key: "k", question: "Entoure les images dont le nom commence par les lettres qu, comme quille.", yes: [w("quille", "une quille", "bowling"), w("quatre", "quatre", "number-4")] },
  r: { key: "r", question: "Entoure les images dont le nom commence par le son [ʁ], comme robot.", yes: [w("robot", "un robot", "robot"), w("renard", "un renard", "fox"), w("raisin", "du raisin", "grapes")] },
  s: { key: "s", question: "Entoure les images dont le nom commence par le son [s], comme soleil.", yes: [w("soleil", "le soleil", "sun"), w("serpent", "un serpent", "snake"), w("sapin", "un sapin", "fir-tree")] },
  t: { key: "t", question: "Entoure les images dont le nom commence par le son [t], comme tortue.", yes: [w("tortue", "une tortue", "turtle"), w("tomate", "une tomate", "tomato"), w("train", "un train", "fast-train")] },
  u: { key: "u", question: "Entoure les images dont le nom commence par le son [y], comme usine.", yes: [w("usine", "une usine", "factory"), w("univers", "l'univers", "galaxy")] },
  v: { key: "v", question: "Entoure les images dont le nom commence par le son [v], comme vache.", yes: [w("vache", "une vache", "cow"), w("vélo", "un vélo", "bicycle"), w("violon", "un violon", "violin")] },
  y: { key: "y", question: "Entoure les images dont le nom commence par la lettre y, comme yoyo.", yes: [w("yoyo", "un yoyo", "yo-yo"), w("yeux", "des yeux", "eyes")] },
  z: { key: "z", question: "Entoure les images dont le nom commence par le son [z], comme zèbre.", yes: [w("zèbre", "un zèbre", "zebra"), w("zéro", "zéro", "number-0")] },
  "e-accent-aigu": { key: "é", question: "Entoure les images dont le nom commence par le son [e], comme éléphant.", yes: [w("éléphant", "un éléphant", "elephant"), w("étoile", "une étoile", "star"), w("école", "une école", "school")] },
};

// Sounds too close to tell apart for a young child: never distractors for each other.
export const CLOSE_KEYS: Record<string, string[]> = { "è": ["é"], "é": ["è"], k: ["g"], g: ["k"], s: ["z"], z: ["s"], i: ["y"], y: ["i"] };
