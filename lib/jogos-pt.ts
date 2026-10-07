// The Portuguese games (/pt/jogos): their pages and the rounds they draw.
// Five are twins of the English games (lib/games-data.ts), with "first sound"
// replaced by "sílaba inicial", as Brazilian children learn it; the sixth,
// "Bata palmas", is the twin of the Spanish "Aplaude las sílabas"
// (docs/portuguese-plan.md, P9). The slug groups are also listed in
// TRANSLATED_PARAMS (lib/i18n/routes.ts), checked by tests.
//
// Picture words come from the "sílaba inicial" worksheets
// (FIRST_SYLLABLE_WORDS in lib/atividades-pt.ts): split into syllables
// ("bo|la"), so first letters, first syllables and syllable counts are known.
import { FIRST_SYLLABLE_WORDS, LOOK_ALIKES } from "./atividades-pt-words";
import { alphabetLetters, type PortugueseLetter, type PortugueseWord } from "./letters-pt";

export type PortugueseGame = {
  slug: string;
  /** The English game's slug; none for "Bata palmas". */
  en?: string;
  title: string;
  /** Card text on /pt/jogos and meta description. */
  description: string;
  /** What the child does and what it teaches, for parents (game page). */
  forParents: string;
  emoji: string;
  age: string;
  isPremium: boolean;
};

export const portugueseGames: PortugueseGame[] = [
  {
    slug: "encontre-a-letra",
    en: "find-the-letter",
    title: "Encontre a letra",
    description: "Ouça o nome de uma letra e encontre-a entre outras, em maiúsculas ou em minúsculas.",
    forParents:
      "A criança ouve o nome da letra e procura na grade. As letras parecidas (b, d, p, q; m e n) estão misturadas de propósito: assim ela aprende a diferenciá-las. Comecem pelas maiúsculas, a letra bastão, e depois passem para as minúsculas.",
    emoji: "🔎",
    age: "3 a 5 anos",
    isPremium: false,
  },
  {
    slug: "letra-e-figura",
    en: "match-letter-picture",
    title: "A letra e a figura",
    description: "Uma letra e quatro figuras: toque na figura cujo nome começa com essa letra.",
    forParents:
      "Cada figura é dita em voz alta quando a criança toca nela, para que ela ouça a palavra. Assim ela liga a letra ao começo da palavra, o primeiro passo para ler. Nunca aparecem juntas duas letras que podem começar com o mesmo som (c e s, g e j, e e i), para que o jogo dependa do ouvido e não da ortografia.",
    emoji: "🖼️",
    age: "4 a 6 anos",
    isPremium: false,
  },
  {
    slug: "silaba-inicial",
    en: "beginning-sound",
    title: "Com que sílaba começa?",
    description: "Ouça o nome de uma figura e escolha, entre quatro, a sílaba com que ela começa: pa de pato, lu de lua.",
    forParents:
      "Na alfabetização, a criança lê pelas famílias silábicas, por isso o jogo trabalha o ouvido com a primeira sílaba da palavra. As opções misturam a mesma consoante com outra vogal (pa, pe, po) e outra consoante com a mesma vogal (pa, ma): é preciso ouvir as duas letras. Nunca aparecem duas sílabas com o mesmo som (ce e se, ge e je, xa e cha).",
    emoji: "👂",
    age: "4 a 6 anos",
    isPremium: true,
  },
  {
    slug: "trace-a-letra",
    en: "letter-tracing",
    title: "Trace a letra",
    description: "Traçar as letras com o dedo na tela, em letra de forma ou cursiva, nas linhas de caligrafia.",
    forParents:
      "A criança segue os pontinhos com o dedo ou o mouse. Na cursiva, as linhas são as do caderno de caligrafia, com a letra cursiva da escola. Mostre primeiro onde a letra começa.",
    emoji: "✏️",
    age: "4 a 7 anos",
    isPremium: true,
  },
  {
    slug: "quiz-do-alfabeto",
    en: "alphabet-quiz",
    title: "O quiz do alfabeto",
    description: "Dez perguntas para revisar: a ordem das letras, o nome delas, vogal ou consoante e a primeira letra das palavras.",
    forParents:
      "Uma revisão divertida para o fim da pré-escola ou o 1º ano: que letra vem depois, que letra se ouve, se é vogal ou consoante e com que letra começa uma palavra.",
    emoji: "🏆",
    age: "5 a 7 anos",
    isPremium: true,
  },
  {
    slug: "bata-palmas",
    title: "Bata palmas",
    description: "Ouça uma palavra, bata uma palma para cada sílaba e diga quantas ela tem: bor-bo-le-ta, quatro palmas!",
    forParents:
      "Separar as palavras em sílabas batendo palmas é o exercício clássico de consciência fonológica antes de ler. Batam palmas juntos na primeira vez e digam a palavra devagar. Na dúvida, o botão “Ouvir por sílabas” diz a palavra separada. As palavras vão de uma sílaba (sol) a cinco (hipopótamo).",
    emoji: "👏",
    age: "4 a 6 anos",
    isPremium: false,
  },
];

export function getPortugueseGame(slug: string): PortugueseGame | undefined {
  return portugueseGames.find((g) => g.slug === slug);
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

/** "bor|bo|le|ta" → "borboleta". */
export const plain = (word: string) => word.replace(/\|/g, "");
/** "bor|bo|le|ta" → ["bor", "bo", "le", "ta"]. */
export const syllablesOf = (word: string) => word.split("|");

/** The 26 letters of the alphabet, in order (Ç is not one of them). */
export const ALPHABET: PortugueseLetter[] = alphabetLetters;

function letterOf(slug: string): PortugueseLetter {
  return ALPHABET.find((l) => l.slug === slug)!;
}

/** Letters with pictures: all but K, Q, W and Y (see FIRST_SYLLABLE_WORDS). */
export const PICTURE_LETTERS = Object.keys(FIRST_SYLLABLE_WORDS);

/**
 * Letters that can start the same sound in Brazilian Portuguese, so they're
 * never offered together when the child chooses by ear: c/k/q (casa, kiwi,
 * queijo), c/s (cebola, sapo), g/j (girafa, janela), i/y, w/u/v (kiwi,
 * waffle, Wagner), e/i (estrela is often said "istrela"), x and ch, and the
 * silent h with every vowel (hotel sounds like "otel"). Unlike Spanish, z
 * and s are different sounds.
 */
const SOUND_GROUPS: string[][] = [
  ["c", "k", "q"],
  ["c", "s"],
  ["g", "j"],
  ["i", "y"],
  ["w", "u", "v"],
  ["e", "i"],
  ["x", "ch"],
  ...["a", "e", "i", "o", "u"].map((v) => ["h", v]),
];

/** Can these two letters start the same sound? */
export function soundAlike(a: string, b: string): boolean {
  return a === b || SOUND_GROUPS.some((g) => g.includes(a) && g.includes(b));
}

/**
 * How a syllable sounds, written one way: "ce" and "se" → "se", "ca", "ka"
 * and "qua" → "ka…", "ge" and "je" → "je", "gue" → "ge", "xa" and "cha" →
 * "cha", "ça" → "sa", "ho" → "o".
 */
export function syllableSound(syllable: string): string {
  // ç first: stripping accents (NFD) would also strip its cedilla.
  return strip(syllable.replace(/^ç/i, "s"))
    .replace(/^h/, "")
    .replace(/^qu(?=[ei])/, "k")
    .replace(/^c(?=[ei])/, "s")
    .replace(/^c(?!h)/, "k")
    .replace(/^g(?=[ei])/, "j")
    .replace(/^gu(?=[ei])/, "g")
    .replace(/^x/, "ch");
}

// ---------------------------------------------------------------- rounds

export type LetterRound = { letter: PortugueseLetter; grid: string[] };

/**
 * "Encontre a letra": the target once, its look-alikes, and other letters,
 * as slugs. The page shows them in capitals or lowercase.
 */
export function findLetterRound(size = 16): LetterRound {
  const letter = pickOne(ALPHABET);
  const slugOf = (lower: string) => ALPHABET.find((l) => l.lower === lower)?.slug;
  const near = [...LOOK_ALIKES[letter.lower]].map(slugOf).filter((s): s is string => !!s);
  const rest = shuffle(ALPHABET.map((l) => l.slug).filter((s) => s !== letter.slug && !near.includes(s)));
  const others = [...near, ...rest].slice(0, size - 1);
  return { letter, grid: shuffle([letter.slug, ...others]) };
}

/** The first letter a word is written with ("hotel" → "h"). */
export function firstLetter(word: PortugueseWord): string {
  return strip(plain(word.word)).charAt(0);
}

/** The sound a word starts with, as a letter ("hotel" → "o", "cebola" → "s", "xícara" → "ch"). */
function firstSoundLetter(word: PortugueseWord): string {
  const sound = syllableSound(syllablesOf(word.word)[0]);
  return /^(ch|lh|nh)/.test(sound) ? sound.slice(0, 2) : sound.charAt(0);
}

export type PictureRound = { letter: PortugueseLetter; answer: PortugueseWord; choices: PortugueseWord[] };

/**
 * "A letra e a figura": a letter and four pictures; only the answer starts
 * with the letter, and no other picture starts with a sound that letter
 * could make (no "cebola" when the letter is S).
 */
export function letterPictureRound(): PictureRound {
  const slug = pickOne(PICTURE_LETTERS);
  const answer = pickOne(FIRST_SYLLABLE_WORDS[slug]);
  const chosen: PortugueseWord[] = [];
  for (const s of shuffle(PICTURE_LETTERS)) {
    if (chosen.length === 3) break;
    if (soundAlike(s, slug)) continue;
    const word = pickOne(FIRST_SYLLABLE_WORDS[s]);
    if (soundAlike(firstSoundLetter(word), firstSoundLetter(answer))) continue;
    chosen.push(word);
  }
  return { letter: letterOf(slug), answer, choices: shuffle([answer, ...chosen]) };
}

// "Com que sílaba começa?" asks only words whose first syllable is open and
// heard as written: a consonant (or ch, lh, nh) and a vowel (pa, lu), or a
// vowel alone (o de ovo). Words starting with h, ce/ci, ge/gi or x are left
// out (their spelling doesn't match the sound), and so are syllables with an
// accent or a til (í, xí, tá), closed ones (bor, den) and diphthongs (pei).
const OPEN_SYLLABLE = /^(ch|lh|nh|[bdfjlmnprstvz])?[aeiou]$|^c[aou]$|^g[aou]$/;

export const FIRST_SYLLABLE_POOL: PortugueseWord[] = Object.values(FIRST_SYLLABLE_WORDS)
  .flat()
  .filter((w) => OPEN_SYLLABLE.test(syllablesOf(w.word)[0]));

const VOWELS = ["a", "e", "i", "o", "u"];
// The famílias a child meets first, for the wrong choices.
const DECOY_CONSONANTS = ["p", "b", "t", "d", "m", "n", "l", "f", "v", "s", "r", "j", "ch"];

export type SyllableRound = { word: PortugueseWord; answer: string; choices: string[] };

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
    !chosen.includes(s) && s !== answer && [answer, ...chosen].every((c) => syllableSound(c) !== syllableSound(s));
  for (const list of [sameConsonant, sameVowel, any]) {
    const next = list.find(fits);
    if (next) chosen.push(next);
  }
  while (chosen.length < 3) chosen.push(any.find(fits)!);
  return { word, answer, choices: shuffle([answer, ...chosen]) };
}

// "Bata palmas": the picture words plus a few short and long ones, so every
// count from 1 to 5 comes up.
const w = (word: string, withArticle: string, emoji: string): PortugueseWord => ({ word, withArticle, emoji });
export const CLAP_WORDS: PortugueseWord[] = [
  ...Object.values(FIRST_SYLLABLE_WORDS).flat(),
  w("sol", "o sol", "☀️"),
  w("pão", "um pão", "🍞"),
  w("flor", "uma flor", "🌸"),
  w("trem", "um trem", "🚂"),
  w("mar", "o mar", "🌊"),
  w("mel", "o mel", "🍯"),
  w("bor|bo|le|ta", "uma borboleta", "🦋"),
  w("bi|ci|cle|ta", "uma bicicleta", "🚲"),
  w("te|le|vi|são", "uma televisão", "📺"),
  w("cro|co|di|lo", "um crocodilo", "🐊"),
];

/** Ten words for one game, with at least one of each count from 1 to 5. */
export function clapWords(total = 10): PortugueseWord[] {
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

function letterChoices(answer: PortugueseLetter, avoidSound = false): string[] {
  const others = shuffle(ALPHABET.filter((l) => l !== answer && !(avoidSound && soundAlike(l.lower, answer.lower))));
  const chosen: PortugueseLetter[] = [];
  for (const l of others) {
    if (chosen.length === 3) break;
    if (avoidSound && chosen.some((c) => soundAlike(c.lower, l.lower))) continue;
    chosen.push(l);
  }
  return shuffle([answer, ...chosen]).map((l) => l.upper);
}

/** One of four kinds of question, at random. Letters are masculine: "o B". */
export function quizQuestion(): QuizQuestion {
  const kind = pickOne(["after", "heard", "vowel", "picture"] as const);
  if (kind === "after") {
    const i = Math.floor(Math.random() * (ALPHABET.length - 1));
    const answer = ALPHABET[i + 1];
    return {
      kind,
      prompt: `Que letra vem depois do ${ALPHABET[i].upper}?`,
      spoken: `Que letra vem depois do ${ALPHABET[i].nameSpoken}?`,
      choices: letterChoices(answer),
      answer: answer.upper,
    };
  }
  if (kind === "heard") {
    const answer = pickOne(ALPHABET);
    return {
      kind,
      prompt: "Ouça bem: que letra é esta?",
      spoken: answer.nameSpoken,
      choices: letterChoices(answer),
      answer: answer.upper,
    };
  }
  if (kind === "vowel") {
    const letter = pickOne(ALPHABET);
    return {
      kind,
      prompt: `O ${letter.upper} é vogal ou consoante?`,
      spoken: `O ${letter.nameSpoken} é vogal ou consoante?`,
      choices: ["Vogal", "Consoante"],
      answer: letter.kind === "vogal" ? "Vogal" : "Consoante",
    };
  }
  const slug = pickOne(PICTURE_LETTERS);
  const word = pickOne(FIRST_SYLLABLE_WORDS[slug]);
  const answer = letterOf(slug);
  return {
    kind,
    prompt: "Com que letra começa esta palavra?",
    spoken: plain(word.word),
    choices: letterChoices(answer, true),
    answer: answer.upper,
    emoji: word.emoji,
    label: plain(word.word),
  };
}
