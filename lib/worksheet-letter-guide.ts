// The per-letter text blocks under "How to use this worksheet" on the English
// letter worksheet pages (SEO phase 4, B4): what is on that sheet, how to write
// the letter, the letters it gets mixed up with, its sound, a story with a word
// that starts with it, and what to do next. Every fact comes from the sheet's
// own generator (lib/letter-sheet-content.ts, lib/pdf/templates) or from
// lib/letters-data.ts, lib/letter-writing.ts and the stories, so each page says
// something true about its own sheet. English only; the French, Spanish and
// Portuguese sheets are different and keep their own texts.
import { getLetterContent, getAllLetterSlugs, type LetterContent } from "./letters-data";
import { firstWord, missingWords, otherLetters } from "./letter-sheet-content";
import { HELVETICA_NOTES, HOW_TO_WRITE, SOUND_WORDS, VOWELS, lookAlikeFor } from "./letter-writing";
import { pictureKey } from "./picture-key";
import { distractorsFor as upperDistractors } from "./pdf/templates/uppercase";
import { distractorsFor as lowerDistractors } from "./pdf/templates/lowercase";
import { reviewDistractors } from "./pdf/templates/review";
import { getWorksheetBySlug, type WorksheetRecord } from "./worksheets-data";
import { WORKSHEET_TYPES, type WorksheetTypeId } from "./worksheet-types";
import { storiesV2, LEVEL_AGES } from "@/prisma/stories-v2";
import { STORY_PARENTS } from "@/prisma/stories-v2/parents";

export type Inline = string | { strong: string } | { href: string; text: string };
export type GuideBlock = { id: "sheet" | "write" | "watch" | "sound" | "story" | "next"; heading: string; paragraphs: Inline[][] };

/** The 10 generated types plus the cursive sheets (lib/static-worksheets-data.ts). */
export type GuideType = WorksheetTypeId | "cursive";

const SLUGS = getAllLetterSlugs();

// ---------------------------------------------------------------- words

const an = (noun: string) => (/^[aeiou]/.test(noun) ? `an ${noun}` : `a ${noun}`);
/** What a word's picture shows: "ball", "jellyfish" (Jelly), "crown" (Queen). */
const noun = (word: string) => pictureKey(word).replace(/-/g, " ");
const list = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);
const quote = (s: string) => `“${s}”`;

// ---------------------------------------------------------------- links

const sheetLink = (letter: string, type: WorksheetTypeId): Inline => {
  const frag = WORKSHEET_TYPES.find((t) => t.id === type)!.slugFragment;
  const w = getWorksheetBySlug(`letter-${letter}-${frag}`)!;
  return { href: `/worksheets/${w.slug}`, text: w.title };
};
const cursiveLink = (c: LetterContent): Inline => ({ href: `/worksheets/letter-${c.slug}-cursive`, text: `Letter ${c.uppercase} Cursive Writing Worksheet` });

// ---------------------------------------------------------------- stories

type StoryHit = { word: string; slug: string; title: string; ages: [number, number] };

/** English stories with a "For parents" word starting with each letter, easiest level first. */
const STORY_HITS: Record<string, StoryHit[]> = Object.fromEntries(
  SLUGS.map((l) => [
    l,
    storiesV2.flatMap((s) =>
      (STORY_PARENTS[s.group]?.EN.words ?? [])
        .filter((w) => w.toLowerCase().startsWith(l))
        .map((w) => ({ word: w, slug: s.text.EN.slug, title: s.text.EN.title, ages: LEVEL_AGES[s.level] })),
    ),
  ]),
);

const TYPE_ORDER: GuideType[] = [...WORKSHEET_TYPES.map((t) => t.id), "cursive"];

/** The story shown on a sheet: a different one per type when the letter has several. */
export function storyFor(letter: string, type: GuideType): StoryHit | null {
  const hits = STORY_HITS[letter] ?? [];
  return hits.length ? hits[TYPE_ORDER.indexOf(type) % hits.length] : null;
}

// ---------------------------------------------------------------- blocks

function onThisSheet(type: GuideType, c: LetterContent): Inline[][] {
  const { uppercase: U, lowercase: l, slug } = c;
  const word = c.exampleWords[0].word;
  const top = `At the top: a big ${U}${l} and ${an(noun(word))}, with ${quote(`${U} is for ${word}`)}.`;
  const traceU = `a row of ${U} to trace (the first one is solid, to look at), then an empty line to write it alone`;
  switch (type) {
    case "tracing":
      return [
        [
          `${top} Below come three guide lines, a top line, a dashed middle line and a bottom line, with a row of uppercase ${U} and a row of lowercase ${l} to trace. The first letter of each row is solid, as a model. Then the word ${word} to trace, and an empty line to write it alone.`,
        ],
      ];
    case "writing":
      return [
        [
          `${top} Then four lines of ${U}${l} pairs to trace on the guide lines, each starting with one solid pair to copy, and the word ${word} to trace at the bottom. Three stars at the end let your child color in ${quote("How did I do?")}.`,
        ],
      ];
    case "uppercase": {
      const d = upperDistractors(U, 17).sort();
      return [
        [
          `A big outline ${U} at the top, with the word ${word} under the title. Then a search row of 20 letters: ${U} is hidden three times among the 17 letters closest to it in the alphabet, from ${d[0]} to ${d[d.length - 1]}. Then six more outline letters to trace on a dotted line, and a line to write it alone.`,
        ],
      ];
    }
    case "lowercase": {
      const d = lowerDistractors(l, 17).sort();
      return [
        [
          `A big green outline ${l} at the top, with the word ${word} under the title. Then a search row of 20 lowercase letters: ${l} is hidden three times among the 17 letters closest to it, from ${d[0]} to ${d[d.length - 1]}. Then six more outline letters to trace on a dotted line, and a line to write it alone.`,
        ],
      ];
    }
    case "recognition": {
      const pairs = otherLetters(slug);
      return [
        [
          `${top} Then 10 letter tiles: ${U} three times and ${l} twice, mixed with five other letters. Your child circles them, counts them and fills in ${quote(`I found __ letters ${U}`)}. Last, a matching game: join ${list([U, ...pairs.map((p) => p.toUpperCase())])} to ${list([l, ...pairs])}.`,
        ],
      ];
    }
    case "beginning-sounds": {
      const [a, b, d] = otherLetters(slug).map((s) => noun(firstWord(s)));
      return [
        [
          `${top} Then five pictures: the ${noun(word)} twice, ${an(a)}, ${an(b)} and ${an(d)}. Your child says each name out loud and circles the two that start with ${U}. Then ${traceU}, and three stars for ${quote("How did I do?")}.`,
        ],
      ];
    }
    case "matching": {
      const pairs = [slug, ...otherLetters(slug)];
      const choices = [slug, ...otherLetters(slug, [3, 8, 20])].map((s) => an(noun(firstWord(s))));
      return [
        [
          `${top} First, four letters to join to their pictures: ${list(pairs.map((s) => `${s.toUpperCase()} to the ${noun(firstWord(s))}`))}. Then four small pictures, ${list(choices)}, to find the one that starts with ${U}. Then ${traceU}.`,
        ],
      ];
    }
    case "missing-letter": {
      const words = missingWords(c).map(({ word: w, at }) => `${w.slice(0, at)}_${w.slice(at + 1)}`);
      const what =
        words.length === 1
          ? `one word to complete, ${words[0]}, next to its picture (no other picture word on these sheets has a ${l})`
          : `${words.length} words to complete, each next to its picture: ${list(words)}`;
      return [[`${top} Then ${what}. Then ${traceU}.`]];
    }
    case "coloring":
      return [
        [
          `A big outline ${U}${l} to color, and next to it a simple line drawing of ${an(noun(word))} to color too, with the words ${quote(`${word} starts with ${U}`)}. It's black outlines on white, so it works with crayons, markers or colored pencils.`,
        ],
      ];
    case "review": {
      const d = reviewDistractors(l);
      return [
        [
          `Four short parts, like a little check-up: trace five ${U}${l} pairs; circle every ${U} and ${l} in a grid of 12 letters (${U} three times, ${l} four times, mixed with ${list(d)}); say the word ${word} next to its picture and decide if it starts with ${U}; then write the letter alone on the last line.`,
        ],
      ];
    }
    case "cursive":
      return [
        [
          `At the top: ${U}${l} in cursive and ${an(noun(word))}, with ${quote(`${U} is for ${word}`)}. Then a row of cursive ${U} and a row of cursive ${l} to trace, each starting with a solid letter, the word ${word} to trace in joined-up cursive, and an empty line to write it alone. The letters follow a traditional US school cursive.`,
        ],
      ];
  }
}

function howToWrite(type: GuideType, c: LetterContent): GuideBlock | null {
  const { uppercase: U, lowercase: l, slug } = c;
  const t = HOW_TO_WRITE[slug];
  if (type === "tracing" || type === "writing")
    return {
      id: "write",
      heading: `How to write ${U} and ${l}`,
      paragraphs: [
        [{ strong: `Uppercase ${U}:` }, ` ${t.upper}`],
        [{ strong: `Lowercase ${l}:` }, ` ${t.lower}`],
      ],
    };
  if (type === "uppercase") return { id: "write", heading: `How to write uppercase ${U}`, paragraphs: [[HELVETICA_NOTES.upper[slug] ?? t.upper]] };
  if (type === "lowercase") return { id: "write", heading: `How to write lowercase ${l}`, paragraphs: [[HELVETICA_NOTES.lower[slug] ?? t.lower]] };
  return null;
}

function watchOut(type: GuideType, c: LetterContent): GuideBlock | null {
  const g = type === "uppercase" ? lookAlikeFor(c.uppercase) : type === "lowercase" ? lookAlikeFor(c.lowercase) : (lookAlikeFor(c.lowercase) ?? lookAlikeFor(c.uppercase));
  return g ? { id: "watch", heading: `Watch out for ${g.title}`, paragraphs: [[g.tip]] } : null;
}

/** "B says /b/, as in ball, bear, banana and butterfly." */
export function soundSentence(c: LetterContent): string {
  const { uppercase: U, slug, ipa } = c;
  const s = SOUND_WORDS[slug];
  if (slug === "x")
    return `X usually says ${ipa} at the end of a word, as in fox and ax. At the start of a word it's rare: in xylophone it sounds like z, and in X-ray it says its own name.`;
  if (VOWELS.includes(slug))
    return `${U} is a vowel. Its short sound is ${ipa}, as in ${list(s.words)}.${s.name ? ` It can also say its own name, as in ${list(s.name)}.` : ""}`;
  return `${U} says ${ipa}, as in ${list(s.words)}.${s.note ? ` ${s.note}` : ""}`;
}

const SOUND_TIPS: Partial<Record<GuideType, (c: LetterContent) => string | null>> = {
  "beginning-sounds": () => "Before circling, say each picture's name slowly together and listen for the very first sound.",
  matching: () => "If a picture is hard, say its name, then its first sound on its own, and ask which letter makes it.",
  // As many words as that letter's sheet has (Q, X and Z have one).
  "missing-letter": (c) =>
    missingWords(c).length === 1
      ? "Read the word out loud, stopping at the gap, and ask which sound is missing."
      : `Read each of the ${missingWords(c).length} words out loud, stopping at the gap, and ask which sound is missing.`,
  coloring: (c) =>
    c.slug === "x" ? "While your child colors, take turns naming things that end with that sound, like box, six and fox." : `While your child colors, take turns naming things at home that start with ${c.ipa}.`,
  // Not for x (xylophone starts with a z sound) or o (orange has a different o in American English).
  review: (c) => (c.slug === "x" || c.slug === "o" ? null : `For the picture question, say ${c.exampleWords[0].word.toLowerCase()} slowly, then its first sound alone, and compare it with ${c.ipa}.`),
};

function sound(type: GuideType, c: LetterContent): GuideBlock {
  const tip = SOUND_TIPS[type]?.(c);
  return { id: "sound", heading: `The ${c.uppercase} sound`, paragraphs: [[`${soundSentence(c)}${tip ? ` ${tip}` : ""}`]] };
}

function story(type: GuideType, c: LetterContent): GuideBlock | null {
  const hit = storyFor(c.slug, type);
  if (!hit) return null;
  return {
    id: "story",
    heading: "Read it in a story",
    paragraphs: [
      [
        `The word ${quote(hit.word)} is in `,
        { href: `/stories/${hit.slug}`, text: hit.title },
        `, a free picture story for ages ${hit.ages[0]} to ${hit.ages[1]}. Read it together, and each time you meet ${quote(hit.word)}, ask your child which letter it starts with.`,
      ],
    ],
  };
}

const NEXT: Record<GuideType, GuideType[]> = {
  tracing: ["uppercase", "lowercase"],
  uppercase: ["lowercase", "recognition"],
  lowercase: ["recognition", "writing"],
  recognition: ["beginning-sounds", "matching"],
  "beginning-sounds": ["matching", "coloring"],
  coloring: ["beginning-sounds", "missing-letter"],
  matching: ["missing-letter", "writing"],
  "missing-letter": ["writing", "review"],
  writing: ["review", "cursive"],
  review: [],
  cursive: ["writing", "review"],
};

const GAME: Record<GuideType, { slug: string; title: string; text: (U: string) => string }> = (() => {
  const tracingGame = { slug: "letter-tracing", title: "Letter Tracing", text: (U: string) => ` game lets your child trace ${U} with a finger.` };
  const findGame = { slug: "find-the-letter", title: "Find the Letter", text: () => ", a free game, practices spotting letters quickly." };
  const pictureGame = { slug: "match-letter-picture", title: "Match Letter and Picture", text: () => " is a free game on the same idea: a letter and four pictures." };
  return {
    tracing: tracingGame,
    uppercase: tracingGame,
    lowercase: tracingGame,
    writing: tracingGame,
    cursive: tracingGame,
    recognition: findGame,
    review: findGame,
    "beginning-sounds": pictureGame,
    coloring: pictureGame,
    matching: pictureGame,
    "missing-letter": pictureGame,
  };
})();

function nextStep(type: GuideType, c: LetterContent): GuideBlock {
  const { uppercase: U, lowercase: l, slug } = c;
  const link = (t: GuideType): Inline => (t === "cursive" ? cursiveLink(c) : sheetLink(slug, t));
  const first: Inline[] = [];
  if (type === "review") {
    const i = SLUGS.indexOf(slug);
    if (i < SLUGS.length - 1) {
      const n = getLetterContent(SLUGS[i + 1])!;
      first.push(`That's every letter ${U} sheet. Next letter: the `, sheetLink(n.slug, "tracing"), ".");
    } else first.push("That's the last letter of the alphabet. To go over them all, the ", { href: "/worksheets/letter-review", text: "26 review sheets" }, " are on one page.");
  } else {
    const [a, b] = NEXT[type];
    first.push(type === "cursive" ? `If cursive ${U} is still hard, go back to print with the ` : "Next, try the ", link(a), ", then the ", link(b), ".");
  }
  if (type === "missing-letter") {
    const i = SLUGS.indexOf(slug);
    const at = (k: number) => SLUGS[k].toUpperCase();
    // Two letters of context at either end of the alphabet: "…, B, C" and "X, Y, …".
    const seq = i === 0 ? `…, ${at(1)}, ${at(2)}` : i === SLUGS.length - 1 ? `${at(i - 2)}, ${at(i - 1)}, …` : `${at(i - 1)}, …, ${at(i + 1)}`;
    first.push(` Then play ${quote("What's missing?")} with the alphabet: say ${quote(seq)} and let your child say ${U}.`);
  }
  const g = GAME[type];
  const game: Inline[] = [" On a screen, ", ...(g.slug === "letter-tracing" ? ["the "] : []), { href: `/games/${g.slug}`, text: g.title }, g.text(U)];
  const all: Inline[] =
    type === "cursive"
      ? [" Every letter's cursive sheet is on the ", { href: "/worksheets/letter-cursive", text: "Cursive Writing" }, " page."]
      : [" All ten letter ", U, " sheets come as one PDF in the ", { href: `/worksheets/bundles/letter-${l}-bundle`, text: `Letter ${U} Worksheets Bundle` }, "."];
  return { id: "next", heading: "Next step", paragraphs: [[...first, ...game, ...all]] };
}

/** Which blocks each sheet gets, in page order. */
const BLOCKS: Record<GuideType, GuideBlock["id"][]> = {
  tracing: ["sheet", "write", "watch", "sound", "next"],
  uppercase: ["sheet", "write", "watch", "next"],
  lowercase: ["sheet", "write", "watch", "next"],
  recognition: ["sheet", "watch", "story", "next"],
  "beginning-sounds": ["sheet", "sound", "story", "next"],
  coloring: ["sheet", "sound", "story", "next"],
  matching: ["sheet", "sound", "next"],
  "missing-letter": ["sheet", "sound", "story", "next"],
  writing: ["sheet", "write", "watch", "next"],
  review: ["sheet", "watch", "sound", "story", "next"],
  cursive: ["sheet", "story", "next"],
};

export function letterGuide(type: GuideType, letter: string): GuideBlock[] {
  const c = getLetterContent(letter);
  if (!c) return [];
  const make: Record<GuideBlock["id"], () => GuideBlock | null> = {
    sheet: () => ({ id: "sheet", heading: "On this sheet", paragraphs: onThisSheet(type, c) }),
    write: () => howToWrite(type, c),
    watch: () => watchOut(type, c),
    sound: () => sound(type, c),
    story: () => story(type, c),
    next: () => nextStep(type, c),
  };
  return BLOCKS[type].map((id) => make[id]()).filter((b): b is GuideBlock => b !== null);
}

export const worksheetGuide = (w: WorksheetRecord) => letterGuide(w.worksheetType, w.letter);
