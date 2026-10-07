// "How to use this worksheet" on the English worksheet pages
// (docs/seo-batch2-proposals.md, I7, approved 2026-10-07): one short text per
// worksheet family, with the item filled in. Checked against the printed
// sheets: they're in color and have dotted letters without start dots or
// arrows, so the texts don't mention any.
import { getLetterContent } from "./letters-data";

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

// Everyday things with each shape, to look for before tracing.
const SHAPE_EXAMPLES: Record<string, string> = {
  circle: "a plate, a clock, a button",
  diamond: "a kite, a road sign",
  heart: "a card, a sticker",
  hexagon: "a honeycomb, a nut from the toolbox",
  oval: "an egg, a mirror",
  pentagon: "the patches on a soccer ball",
  rectangle: "a door, a book, a phone",
  square: "a window pane, a cracker, a napkin",
  star: "a sticker, a cookie cutter",
  triangle: "a slice of pizza, a roof",
};

// A one-letter change that makes a new word, then another.
const CVC_CHAINS: Record<string, string> = {
  bag: "bag → big → pig",
  bed: "bed → red → rod",
  cat: "cat → hat → hot",
  cup: "cup → pup → pop",
  dog: "dog → log → leg",
  hat: "hat → cat → cut",
  pen: "pen → ten → tan",
  pig: "pig → big → bag",
  pot: "pot → hot → hit",
  sun: "sun → bun → bin",
};

/** For a letter worksheet (any of the 10 types, and the cursive ones). */
export function letterHowTo(letter: string): string | null {
  const content = getLetterContent(letter);
  if (!content) return null;
  const U = content.uppercase;
  // X's first word (xylophone) doesn't start with its usual sound.
  const word = letter === "x" ? "box" : content.exampleWords[0].word.toLowerCase();
  return (
    `Print it at home or at school, in color or in black and white. Say the letter's name and its sound together before you start: "${U}, ${content.ipa}, like ${word}." ` +
    `Start with a finger on the page, then use a pencil or crayon. A few lines done well are better than a whole page done in a hurry. ` +
    `Then look for the letter ${U} in a book or on a cereal box.`
  );
}

/** For the number, shape, color, sight word and CVC word worksheets, by slug. */
export function staticHowTo(slug: string): string | null {
  let m = slug.match(/^letter-([a-z])-cursive$/);
  if (m) return letterHowTo(m[1]);
  m = slug.match(/^number-(\d)-(tracing|cursive)$/);
  if (m) {
    const n = Number(m[1]);
    const intro =
      n === 0
        ? "Show an empty hand or an empty plate before tracing the number 0: zero means none."
        : `Count out ${n} small object${n > 1 ? "s" : ""} before tracing the number ${n}, so the number means something.`;
    return `${intro} Trace the big number with a finger, then with a pencil. Say the word "${NUMBER_WORDS[n]}" as you trace it. When the row is done, ask your child to circle their best one.`;
  }
  m = slug.match(/^([a-z]+)-tracing$/);
  if (m && SHAPE_EXAMPLES[m[1]]) {
    const s = m[1];
    return `Look for a ${s} around you before you start: ${SHAPE_EXAMPLES[s]}. Trace the ${s} slowly, keeping the pencil on the line, then draw one on your own. Name the shape out loud each time. Tracing shapes builds the same hand control that letters need.`;
  }
  m = slug.match(/^([a-z]+)-color$/);
  if (m) {
    const c = m[1];
    return `Have the ${c} crayon ready and name the color together. Color the shapes, then find three ${c} things around you. Read the word "${c}" with your finger under it. One color a day is plenty for a three-year-old.`;
  }
  m = slug.match(/^sight-word-([a-z]+)$/);
  if (m) {
    const w = m[1] === "i" ? "I" : m[1];
    return `Sight words like "${w}" come up in almost every book, so children learn to know them at a glance. Read the word together, trace it, then write it. Then hunt for "${w}" on a page of a picture book. Five minutes a day works better than one long session.`;
  }
  m = slug.match(/^cvc-word-([a-z]+)$/);
  if (m && CVC_CHAINS[m[1]]) {
    const w = m[1];
    return `Say each sound of "${w}" slowly, ${w.split("").join("… ")}…, then blend them into the word. Trace the word, then write it on your own. Change one letter to make a new word: ${CVC_CHAINS[w]}.`;
  }
  return null;
}
