// The Spanish games (/es/juegos): their pages and the rounds they draw.
// Five are twins of the English games (lib/games-data.ts), with "first
// sound" replaced by "first syllable", as Spanish children learn it; the
// sixth, "Aplaude las sílabas", is Spanish-only (docs/spanish-plan.md, D10).
// The slug pairs are also listed in TRANSLATED_PARAMS (lib/i18n/routes.ts),
// checked by tests.
//
// Picture words come from the "primera sílaba" worksheets
// (FIRST_SYLLABLE_WORDS in lib/fichas-es.ts): split into syllables
// ("ma|no"), so first letters, first syllables and syllable counts are known.
import { FIRST_SYLLABLE_WORDS, LOOK_ALIKES } from "./fichas-es";
import { spanishLetters, type SpanishLetter, type SpanishWord } from "./letters-es";

export type SpanishGame = {
  slug: string;
  /** The English game's slug; none for the Spanish-only game. */
  en?: string;
  title: string;
  /** Card text on /es/juegos and meta description. */
  description: string;
  /** What the child does and what it teaches, for parents (game page). */
  forParents: string;
  emoji: string;
  age: string;
  isPremium: boolean;
};

export const spanishGames: SpanishGame[] = [
  {
    slug: "encuentra-la-letra",
    en: "find-the-letter",
    title: "Encuentra la letra",
    description: "Se escucha el nombre de una letra y hay que encontrarla entre otras, en mayúsculas o en minúsculas.",
    forParents:
      "Tu hijo o hija escucha el nombre de la letra y la busca en la cuadrícula. Las letras que se parecen (b, d, p, q; n y ñ) están mezcladas a propósito: así se aprende a distinguirlas. Empiecen con las mayúsculas y pasen después a las minúsculas.",
    emoji: "🔎",
    age: "3 a 5 años",
    isPremium: false,
  },
  {
    slug: "letra-y-dibujo",
    en: "match-letter-picture",
    title: "La letra y el dibujo",
    description: "Una letra y cuatro dibujos: hay que tocar el dibujo cuyo nombre empieza con esa letra.",
    forParents:
      "Cada dibujo se nombra en voz alta al tocarlo, para que se escuche la palabra. Así se une la letra con el principio de la palabra, el primer paso para leer. Nunca aparecen juntas dos letras que suenan igual al principio (b y v, c y s, g y j), para que el juego dependa del oído y no de la ortografía.",
    emoji: "🖼️",
    age: "4 a 6 años",
    isPremium: false,
  },
  {
    slug: "primera-silaba",
    en: "beginning-sound",
    title: "¿Con qué sílaba empieza?",
    description: "Se escucha el nombre de un dibujo y se elige, entre cuatro, la sílaba con la que empieza: pa de pato, lu de luna.",
    forParents:
      "En español se lee por sílabas, así que el juego trabaja el oído con la primera sílaba de la palabra. Las opciones mezclan la misma consonante con otra vocal (pa, pe, po) y otra consonante con la misma vocal (pa, ma): hay que escuchar las dos letras. Nunca se ofrecen dos sílabas que suenan igual (ba y va, ca y ka).",
    emoji: "👂",
    age: "4 a 6 años",
    isPremium: true,
  },
  {
    slug: "traza-la-letra",
    en: "letter-tracing",
    title: "Traza la letra",
    description: "Trazar las letras con el dedo en la pantalla, en letra script o cursiva, sobre doble raya como en el cuaderno.",
    forParents:
      "Tu hijo o hija sigue los puntos con el dedo o el ratón. En cursiva, las líneas son las del cuaderno de doble raya, con la letra ligada que se enseña en muchas escuelas. Muéstrale primero dónde empieza la letra.",
    emoji: "✏️",
    age: "4 a 7 años",
    isPremium: true,
  },
  {
    slug: "quiz-del-abecedario",
    en: "alphabet-quiz",
    title: "El quiz del abecedario",
    description: "Diez preguntas para repasar: el orden de las letras, su nombre, vocal o consonante y la primera letra de las palabras.",
    forParents:
      "Un pequeño repaso divertido para el final del kínder o el primer grado: qué letra va después (¡después de la ene viene la eñe!), qué letra se escucha, si es vocal o consonante y con qué letra empieza una palabra.",
    emoji: "🏆",
    age: "5 a 7 años",
    isPremium: true,
  },
  {
    slug: "aplaude-las-silabas",
    title: "Aplaude las sílabas",
    description: "Se escucha una palabra, se aplaude una vez por cada sílaba y se dice cuántas tiene: ma-ri-po-sa, ¡cuatro palmadas!",
    forParents:
      "Separar las palabras en sílabas, aplaudiendo, es el ejercicio clásico antes de leer en español. Aplaudan juntos la primera vez y digan la palabra despacio. Si duda, el botón «Escuchar por sílabas» la dice separada. Las palabras van de una sílaba (sol) a cinco (hipopótamo).",
    emoji: "👏",
    age: "4 a 6 años",
    isPremium: false,
  },
];

export function getSpanishGame(slug: string): SpanishGame | undefined {
  return spanishGames.find((g) => g.slug === slug);
}

// ---------------------------------------------------------------- helpers

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

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** "ma|ri|po|sa" → "mariposa". */
export const plain = (word: string) => word.replace(/\|/g, "");
/** "ma|ri|po|sa" → ["ma", "ri", "po", "sa"]. */
export const syllablesOf = (word: string) => word.split("|");

/** The 27 letters, in order a…n, ñ, o…z. */
export const ALPHABET: SpanishLetter[] = spanishLetters;

function letterOf(slug: string): SpanishLetter {
  return ALPHABET.find((l) => l.slug === slug)!;
}

/** Letters with pictures: all but ñ, q, w and x (see FIRST_SYLLABLE_WORDS). */
export const PICTURE_LETTERS = Object.keys(FIRST_SYLLABLE_WORDS);

/**
 * Letters that can start the same sound, so they're never offered together
 * when the child chooses by ear: b/v, c/k/q (ca, ka, que), c/s/z/x (ce, se,
 * ze, xilófono), g/j (ge, je), y/i, w/u/g (kiwi, wafle), and the silent h
 * with every vowel (helado sounds like "elado").
 */
const SOUND_GROUPS: string[][] = [
  ["b", "v"],
  ["c", "k", "q"],
  ["c", "s", "z", "x"],
  ["g", "j"],
  ["y", "i", "ll"],
  ["w", "u", "g"],
  ...["a", "e", "i", "o", "u"].map((v) => ["h", v]),
];

/** Can these two letters start the same sound? */
export function soundAlike(a: string, b: string): boolean {
  return a === b || SOUND_GROUPS.some((g) => g.includes(a) && g.includes(b));
}

/**
 * How a syllable sounds, written one way: "va" and "ba" → "ba", "ca", "ka"
 * and "qua" → "ka", "ce", "se" and "ze" → "se", "ge" and "je" → "je",
 * "gue" → "ge", "ya" → "lla", "he" → "e". Latin American pronunciation
 * (seseo, yeísmo), as on the rest of the Spanish site.
 */
export function syllableSound(syllable: string): string {
  return strip(syllable)
    .replace(/^h/, "")
    .replace(/^v/, "b")
    .replace(/^qu(?=[ei])/, "k")
    .replace(/^c(?=[ei])/, "s")
    .replace(/^c/, "k")
    .replace(/^z/, "s")
    .replace(/^g(?=[ei])/, "j")
    .replace(/^gu(?=[ei])/, "g")
    .replace(/^y(?=[aeiou])/, "ll");
}

// ---------------------------------------------------------------- rounds

export type LetterRound = { letter: SpanishLetter; grid: string[] };

/**
 * "Encuentra la letra": the target once, its look-alikes, and other letters,
 * as slugs ("b", "enie"). The page shows them in capitals or lowercase.
 */
export function findLetterRound(size = 16): LetterRound {
  const letter = pickOne(ALPHABET);
  const slugOf = (lower: string) => ALPHABET.find((l) => l.lower === lower)!.slug;
  const near = [...LOOK_ALIKES[letter.lower]].map(slugOf);
  const rest = shuffle(ALPHABET.map((l) => l.slug).filter((s) => s !== letter.slug && !near.includes(s)));
  const others = [...near, ...rest].slice(0, size - 1);
  return { letter, grid: shuffle([letter.slug, ...others]) };
}

/** The first letter a word is written with ("helado" → "h"). */
export function firstLetter(word: SpanishWord): string {
  return strip(plain(word.word)).charAt(0);
}

/** The sound a word starts with, as a letter ("helado" → "e", "cereza" → "s", "yate" → "ll"). */
function firstSoundLetter(word: SpanishWord): string {
  const sound = syllableSound(syllablesOf(word.word)[0]);
  return /^(ll|ch)/.test(sound) ? sound.slice(0, 2) : sound.charAt(0);
}

export type PictureRound = { letter: SpanishLetter; answer: SpanishWord; choices: SpanishWord[] };

/**
 * "La letra y el dibujo": a letter and four pictures; only the answer starts
 * with the letter, and no other picture starts with a sound that letter
 * could make (no "vaca" when the letter is B).
 */
export function letterPictureRound(): PictureRound {
  const slug = pickOne(PICTURE_LETTERS);
  const answer = pickOne(FIRST_SYLLABLE_WORDS[slug]);
  const chosen: SpanishWord[] = [];
  for (const s of shuffle(PICTURE_LETTERS)) {
    if (chosen.length === 3) break;
    if (soundAlike(s, slug)) continue;
    const word = pickOne(FIRST_SYLLABLE_WORDS[s]);
    if (soundAlike(firstSoundLetter(word), firstSoundLetter(answer))) continue;
    chosen.push(word);
  }
  return { letter: letterOf(slug), answer, choices: shuffle([answer, ...chosen]) };
}

// "¿Con qué sílaba empieza?" asks only words whose first syllable is open
// and heard as written: a consonant and a vowel (pa, lu) or a vowel alone
// (o de oso). Words starting with h, k, ce/ci or ge/gi are left out (their
// spelling doesn't match the sound), and so are syllables with a tilde.
const OPEN_SYLLABLE = /^(ch|ll|[bdfjlmnñprstvyz])?[aeiou]$|^c[aou]$|^g[aou]$/;

export const FIRST_SYLLABLE_POOL: SpanishWord[] = Object.values(FIRST_SYLLABLE_WORDS)
  .flat()
  .filter((w) => OPEN_SYLLABLE.test(syllablesOf(w.word)[0]));

const VOWELS = ["a", "e", "i", "o", "u"];
// The direct syllables a child meets first, for the wrong choices.
const DECOY_CONSONANTS = ["m", "p", "s", "l", "t", "d", "n", "f", "b", "r", "j", "ch"];
// Spellings a beginner almost never sees, never offered as wrong choices.
const RARE_SYLLABLES = ["yi", "ze", "zi"];

export type SyllableRound = { word: SpanishWord; answer: string; choices: string[] };

/**
 * A picture and four written syllables: the answer, the same consonant with
 * another vowel, another consonant with the same vowel, and one more; never
 * two syllables that sound the same.
 */
export function firstSyllableRound(): SyllableRound {
  const word = pickOne(FIRST_SYLLABLE_POOL);
  const answer = syllablesOf(word.word)[0];
  const vowel = answer.slice(-1);
  const consonant = answer.slice(0, -1);

  const sameConsonant = shuffle(VOWELS.filter((v) => v !== vowel)).map((v) => consonant + v);
  const sameVowel = shuffle(DECOY_CONSONANTS).map((c) => c + vowel);
  const any = shuffle(DECOY_CONSONANTS.flatMap((c) => VOWELS.map((v) => c + v)));

  const chosen: string[] = [];
  const fits = (s: string) =>
    !RARE_SYLLABLES.includes(s) &&
    !chosen.includes(s) &&
    s !== answer && [answer, ...chosen].every((c) => syllableSound(c) !== syllableSound(s));
  for (const list of [sameConsonant, sameVowel, any]) {
    const next = list.find(fits);
    if (next) chosen.push(next);
  }
  while (chosen.length < 3) chosen.push(any.find(fits)!);
  return { word, answer, choices: shuffle([answer, ...chosen]) };
}

// "Aplaude las sílabas": the picture words plus a few short and long ones,
// so every count from 1 to 5 comes up.
const w = (word: string, withArticle: string, emoji: string): SpanishWord => ({ word, withArticle, emoji });
export const CLAP_WORDS: SpanishWord[] = [
  ...Object.values(FIRST_SYLLABLE_WORDS).flat(),
  w("sol", "el sol", "☀️"),
  w("pan", "un pan", "🍞"),
  w("flor", "una flor", "🌸"),
  w("tren", "un tren", "🚂"),
  w("pez", "un pez", "🐟"),
  w("mar", "el mar", "🌊"),
  w("hi|po|pó|ta|mo", "un hipopótamo", "🦛"),
  w("co|co|dri|lo", "un cocodrilo", "🐊"),
  w("bi|ci|cle|ta", "una bicicleta", "🚲"),
  w("te|le|vi|sión", "una televisión", "📺"),
];

/** Ten words for one game, with at least one of each count from 1 to 4 and a 5 when one exists. */
export function clapWords(total = 10): SpanishWord[] {
  const byCount = (n: number) => shuffle(CLAP_WORDS.filter((x) => syllablesOf(x.word).length === n));
  const picked = [1, 2, 3, 4, 5].flatMap((n) => byCount(n).slice(0, 1));
  const rest = shuffle(CLAP_WORDS.filter((x) => !picked.includes(x))).slice(0, total - picked.length);
  return shuffle([...picked, ...rest]);
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

function letterChoices(answer: SpanishLetter, avoidSound = false): string[] {
  const others = shuffle(ALPHABET.filter((l) => l !== answer && !(avoidSound && soundAlike(l.lower, answer.lower))));
  const chosen: SpanishLetter[] = [];
  for (const l of others) {
    if (chosen.length === 3) break;
    if (avoidSound && chosen.some((c) => soundAlike(c.lower, l.lower))) continue;
    chosen.push(l);
  }
  return shuffle([answer, ...chosen]).map((l) => l.upper);
}

/** One of four kinds of question, at random. */
export function quizQuestion(): QuizQuestion {
  const kind = pickOne(["after", "heard", "vowel", "picture"] as const);
  if (kind === "after") {
    const i = Math.floor(Math.random() * (ALPHABET.length - 1));
    const answer = ALPHABET[i + 1];
    return {
      kind,
      prompt: `¿Qué letra va después de la ${ALPHABET[i].upper}?`,
      spoken: `¿Qué letra va después de la ${ALPHABET[i].nameSpoken}?`,
      choices: letterChoices(answer),
      answer: answer.upper,
    };
  }
  if (kind === "heard") {
    const answer = pickOne(ALPHABET);
    return {
      kind,
      prompt: "Escucha bien: ¿qué letra es?",
      spoken: answer.nameSpoken,
      choices: letterChoices(answer),
      answer: answer.upper,
    };
  }
  if (kind === "vowel") {
    const letter = pickOne(ALPHABET);
    return {
      kind,
      prompt: `La ${letter.upper}, ¿es vocal o consonante?`,
      spoken: `La ${letter.nameSpoken}, ¿es vocal o consonante?`,
      choices: ["Vocal", "Consonante"],
      answer: letter.kind === "vocal" ? "Vocal" : "Consonante",
    };
  }
  const slug = pickOne(PICTURE_LETTERS);
  const word = pickOne(FIRST_SYLLABLE_WORDS[slug]);
  const answer = letterOf(slug);
  return {
    kind,
    prompt: "¿Con qué letra empieza esta palabra?",
    spoken: plain(word.word),
    choices: letterChoices(answer, true),
    answer: answer.upper,
    emoji: word.emoji,
    label: plain(word.word),
  };
}
