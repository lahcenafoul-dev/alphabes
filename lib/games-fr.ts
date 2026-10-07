// The five French games (/fr/jeux): their pages and the rounds they draw.
// Each game has an English twin (lib/games-data.ts); the slug pairs are
// also listed in TRANSLATED_PARAMS (lib/i18n/routes.ts), checked by tests.
//
// Words come from the "son" worksheets (LETTER_IMAGES in lib/fiches-fr.ts):
// pictures a child can name, whose first letter and first sound are known.
import { CLOSE_KEYS, LETTER_IMAGES } from "./fiches-fr-words";
import { frenchLetters, isAccentLetter, type FrenchLetter, type FrenchWord } from "./letters-fr";

export type FrenchGame = {
  slug: string;
  /** The English game's slug. */
  en: string;
  title: string;
  /** Card text on /fr/jeux and meta description. */
  description: string;
  /** What the child does and what it teaches, for parents (game page). */
  forParents: string;
  emoji: string;
  age: string;
  isPremium: boolean;
};

export const frenchGames: FrenchGame[] = [
  {
    slug: "trouve-la-lettre",
    en: "find-the-letter",
    title: "Trouve la lettre",
    description: "Une lettre est demandée : l'enfant la retrouve parmi d'autres lettres, en capitales ou en minuscules.",
    forParents:
      "L'enfant entend le nom de la lettre et la cherche dans la grille. Les lettres qui se ressemblent (b, d, p, q) sont mêlées exprès : c'est là que se fait l'apprentissage. Commencez en capitales, puis passez aux minuscules.",
    emoji: "🔎",
    age: "3-5 ans",
    isPremium: false,
  },
  {
    slug: "lettre-et-image",
    en: "match-letter-picture",
    title: "Associe la lettre et l'image",
    description: "Une lettre, quatre images : l'enfant touche l'image dont le nom commence par cette lettre.",
    forParents:
      "Chaque image est nommée à voix haute quand on la touche, pour que l'enfant entende le mot. Il relie ainsi la lettre au début du mot, première étape avant de lire.",
    emoji: "🖼️",
    age: "4-6 ans",
    isPremium: false,
  },
  {
    slug: "premier-son",
    en: "beginning-sound",
    title: "Le premier son",
    description: "On écoute le nom d'une image, puis on choisit la lettre du son qu'on entend au début.",
    forParents:
      "Ici, on travaille l'oreille : entendre le premier son d'un mot (le « a » d'avion, le « mmm » de moto). Les mots choisis commencent par un son clair, et deux sons trop proches ne sont jamais proposés ensemble.",
    emoji: "👂",
    age: "4-6 ans",
    isPremium: true,
  },
  {
    slug: "trace-la-lettre",
    en: "letter-tracing",
    title: "Trace la lettre",
    description: "Tracer les lettres du doigt sur l'écran, en script ou en cursive sur les lignes du cahier.",
    forParents:
      "L'enfant suit les pointillés avec le doigt ou la souris. En cursive, les lignes sont celles du cahier (réglure Seyès) : la même écriture qu'à l'école. Montrez-lui d'abord où commence la lettre.",
    emoji: "✏️",
    age: "4-7 ans",
    isPremium: true,
  },
  {
    slug: "quiz-alphabet",
    en: "alphabet-quiz",
    title: "Le quiz de l'alphabet",
    description: "Dix questions pour réviser : l'ordre des lettres, leur nom, voyelle ou consonne, et le début des mots.",
    forParents:
      "Un petit bilan amusant pour la fin de la grande section ou le CP : quelle lettre vient après, quelle lettre entends-tu, voyelle ou consonne, par quelle lettre commence ce mot.",
    emoji: "🏆",
    age: "5-7 ans",
    isPremium: true,
  },
];

export function getFrenchGame(slug: string): FrenchGame | undefined {
  return frenchGames.find((g) => g.slug === slug);
}

// ---------------------------------------------------------------- rounds

/** The 26 letters, in order (no é è ê ç: the games work on the alphabet). */
export const ALPHABET: FrenchLetter[] = frenchLetters.filter((l) => !isAccentLetter(l));

export function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function letterOf(slug: string): FrenchLetter {
  return ALPHABET.find((l) => l.slug === slug)!;
}

/** Letters with pictures: every letter but h, w and x (see LETTER_IMAGES). */
const PICTURE_LETTERS = Object.keys(LETTER_IMAGES).filter((slug) => slug.length === 1);

// Letters whose first sound is clear by ear. c, k and q all start with [k]
// (canard, koala, quille), e is heard è (escargot) and y is heard i (yoyo),
// so they're left out of the listening game.
const SOUND_LETTERS = PICTURE_LETTERS.filter((slug) => !["c", "k", "q", "e", "y"].includes(slug));

/** Can `a` and `b` both be offered for the same picture without being confusing? */
function soundsApart(a: string, b: string): boolean {
  const ka = LETTER_IMAGES[a].key;
  const kb = LETTER_IMAGES[b].key;
  return ka !== kb && !(CLOSE_KEYS[ka] ?? []).includes(kb);
}

export type LetterRound = { letter: FrenchLetter; grid: string[] };

/**
 * "Trouve la lettre": the target once, its look-alikes, and other letters,
 * lowercase slugs ("b"). The page shows them in capitals or minuscules.
 */
export function findLetterRound(size = 16): LetterRound {
  const letter = pickOne(ALPHABET);
  const lookAlikes: Record<string, string> = {
    a: "odq", b: "dpqh", c: "eo", d: "bpq", e: "co", f: "tl", g: "qp", h: "nk", i: "lj", j: "ig", k: "hx", l: "it",
    m: "nw", n: "mu", o: "ac", p: "qbd", q: "pgd", r: "nv", s: "zc", t: "fl", u: "nv", v: "wy", w: "vm", x: "kz",
    y: "vj", z: "sx",
  };
  const near = [...lookAlikes[letter.slug]];
  const rest = shuffle(ALPHABET.map((l) => l.slug).filter((s) => s !== letter.slug && !near.includes(s)));
  const others = [...near, ...rest].slice(0, size - 1);
  return { letter, grid: shuffle([letter.slug, ...others]) };
}

export type PictureRound = { letter: FrenchLetter; answer: FrenchWord; choices: FrenchWord[] };

/** "Associe la lettre et l'image": a letter and four pictures, one starting with it. */
export function letterPictureRound(): PictureRound {
  const slug = pickOne(PICTURE_LETTERS);
  const answer = pickOne(LETTER_IMAGES[slug].yes);
  const others = shuffle(PICTURE_LETTERS.filter((s) => s !== slug))
    .slice(0, 3)
    .map((s) => pickOne(LETTER_IMAGES[s].yes));
  return { letter: letterOf(slug), answer, choices: shuffle([answer, ...others]) };
}

export type SoundRound = { word: FrenchWord; answer: FrenchLetter; choices: FrenchLetter[] };

/**
 * "Le premier son": a picture and four letters. `byLetter` (the quiz) also
 * allows c, k, q, e and y, since the question is then about the letter.
 */
export function firstSoundRound(byLetter = false): SoundRound {
  const pool = byLetter ? PICTURE_LETTERS : SOUND_LETTERS;
  const slug = pickOne(pool);
  const others = shuffle(pool.filter((s) => s !== slug && soundsApart(s, slug)));
  const chosen: string[] = [];
  for (const s of others) {
    if (chosen.length === 3) break;
    if (chosen.every((c) => soundsApart(c, s))) chosen.push(s);
  }
  return {
    word: pickOne(LETTER_IMAGES[slug].yes),
    answer: letterOf(slug),
    choices: shuffle([slug, ...chosen]).map(letterOf),
  };
}

export type QuizQuestion = {
  kind: "after" | "heard" | "vowel" | "picture";
  prompt: string;
  /** Read aloud by the 🔊 button. */
  spoken: string;
  choices: string[];
  answer: string;
  emoji?: string;
  /** The picture's name, for screen readers. */
  label?: string;
};

function letterChoices(answer: FrenchLetter): string[] {
  const others = shuffle(ALPHABET.filter((l) => l !== answer)).slice(0, 3);
  return shuffle([answer, ...others]).map((l) => l.upper);
}

/** One of four kinds of question, at random. */
export function quizQuestion(): QuizQuestion {
  const kind = pickOne(["after", "heard", "vowel", "picture"] as const);
  if (kind === "after") {
    const i = Math.floor(Math.random() * (ALPHABET.length - 1));
    const answer = ALPHABET[i + 1];
    return {
      kind,
      prompt: `Quelle lettre vient après le ${ALPHABET[i].upper} ?`,
      spoken: `Quelle lettre vient après le ${ALPHABET[i].nameSpoken} ?`,
      choices: letterChoices(answer),
      answer: answer.upper,
    };
  }
  if (kind === "heard") {
    const answer = pickOne(ALPHABET);
    return {
      kind,
      prompt: "Écoute bien : quelle lettre entends-tu ?",
      spoken: answer.nameSpoken,
      choices: letterChoices(answer),
      answer: answer.upper,
    };
  }
  if (kind === "vowel") {
    const letter = pickOne(ALPHABET);
    return {
      kind,
      prompt: `Le ${letter.upper}, c'est une voyelle ou une consonne ?`,
      spoken: `Le ${letter.nameSpoken}, c'est une voyelle ou une consonne ?`,
      choices: ["Voyelle", "Consonne"],
      answer: letter.kind === "voyelle" ? "Voyelle" : "Consonne",
    };
  }
  const round = firstSoundRound(true);
  return {
    kind,
    prompt: "Par quelle lettre commence ce mot ?",
    spoken: round.word.word,
    choices: round.choices.map((l) => l.upper),
    answer: round.answer.upper,
    emoji: round.word.emoji,
    label: round.word.word,
  };
}
