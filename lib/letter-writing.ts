// Per-letter teaching texts for the English letter worksheet pages (SEO phase 4,
// B4, table approved by the owner on 2026-11-19 after a check against the
// printed sheets).
//
// The letters on the sheets come in two fonts, and the texts follow them:
// - tracing, beginning sounds, matching, recognition, writing practice and
//   missing letter (static PDFs, scripts/worksheets-en): Andika, a font made
//   for early readers. Single-storey a and g, I with a bar at the top and the
//   bottom, J with no top bar, q and y with no flick, t crossed on the middle
//   line, M coming down to the bottom line in the middle;
// - uppercase, lowercase, coloring and review (jsPDF, lib/pdf/templates):
//   Helvetica Bold outlines. The same shapes, except a double-storey a and a
//   plain I with no bars, so those two pages get their own sentence.
// The cursive sheets use a cursive font, so this print table isn't shown there.
// None of the sheets has start dots or arrows.

/** How to write each letter, uppercase then lowercase, in the sheets' print style. */
export const HOW_TO_WRITE: Record<string, { upper: string; lower: string }> = {
  a: {
    upper: "Start at the top point, slide down to the left, go back to the top and slide down to the right, then draw a line across the middle.",
    lower: "Make a small circle, starting at the top and going round to the left, then pull a short line straight down on its right side.",
  },
  b: {
    upper: "Pull a tall line down, go back to the top, and make two bumps to the right: a smaller one to the middle, a bigger one to the bottom.",
    lower: "Pull a tall line down, then, without lifting the pencil, go back up halfway and make a round bump on the right.",
  },
  c: {
    upper: "Start near the top on the right and curve up, round to the left and down, leaving the right side open.",
    lower: "Start just below the middle line on the right and curve up, round to the left and down to the bottom line, leaving the right side open.",
  },
  d: {
    upper: "Pull a tall line down, go back to the top, and make one big curve to the right that ends at the bottom.",
    lower: "Make a small circle going round to the left, then, without lifting the pencil, go up to the top and pull a tall line down on its right.",
  },
  e: {
    upper: "Pull a tall line down, then add three lines to the right: one at the top, one in the middle and one at the bottom.",
    lower: "Draw a short line across the middle from left to right, then curve up, round to the left and down, leaving a little opening at the bottom right.",
  },
  f: {
    upper: "Pull a tall line down, then add two lines to the right: one at the top and a shorter one in the middle.",
    lower: "Start with a small hook at the top, curve to the left and pull straight down, then cross it with a short line on the middle line.",
  },
  g: {
    upper: "Start like a C, curving round from the top right, then, at the bottom, come back up and draw a short line in toward the middle.",
    lower: "Make a small circle going round to the left, then pull a line down below the bottom line and finish with a hook to the left.",
  },
  h: {
    upper: "Pull two tall lines down, side by side, then join them with a line across the middle.",
    lower: "Pull a tall line down, go back up halfway, and make one hump to the right that comes down to the bottom line.",
  },
  i: {
    upper: "Pull a tall line straight down, then add a short line across the top and another across the bottom.",
    lower: "Pull a short line down from the middle to the bottom line, then add a dot above it.",
  },
  j: {
    upper: "Pull a line down from the top, then curve it round to the left at the bottom, like a hook.",
    lower: "Pull a line down from the middle to below the bottom line, curve it to the left like a hook, then add a dot above it.",
  },
  k: {
    upper: "Pull a tall line down, then, from the top right, slant in to the middle of the line and slant back out to the bottom.",
    lower: "Pull a tall line down, then, from the middle line on the right, slant in to the line and slant back out to the bottom.",
  },
  l: {
    upper: "Pull a tall line down, then draw a line to the right along the bottom.",
    lower: "Pull one tall line straight down.",
  },
  m: {
    upper: "Pull a tall line down, go back to the top, slant down to the bottom line in the middle, slant back up to the top, and pull another tall line down.",
    lower: "Pull a short line down, go back up and make two humps to the right, one after the other.",
  },
  n: {
    upper: "Pull a tall line down, go back to the top, slant down to the bottom on the right, then pull a line straight up.",
    lower: "Pull a short line down, go back up and make one hump to the right.",
  },
  o: {
    upper: "Start at the top and go round to the left in a big circle, all the way back to the start.",
    lower: "Start at the middle line and go round to the left in a small circle, back to the start.",
  },
  p: {
    upper: "Pull a tall line down, go back to the top, and make one bump to the right that ends at the middle.",
    lower: "Pull a line down from the middle line to below the bottom line, go back up and make a round bump on the right.",
  },
  q: {
    upper: "Make a big O, going round to the left from the top, then add a short slanted tail at the bottom right.",
    lower: "Make a small circle going round to the left, then pull a straight line down on its right, to below the bottom line.",
  },
  r: {
    upper: "Pull a tall line down, go back to the top, make a bump to the right that ends at the middle, then slant a leg down to the bottom right.",
    lower: "Pull a short line down, go back up and make a small curve to the right at the top, like a little arm reaching out.",
  },
  s: {
    upper: "Start near the top on the right, curve to the left, then swing back to the right and curve round to the bottom left, like a snake.",
    lower: "Make the same snake, small, between the middle line and the bottom line.",
  },
  t: {
    upper: "Pull a tall line down, then draw a line across the top.",
    lower: "Pull a line down from halfway between the top line and the middle line, curving a little to the right at the bottom, then cross it with a short line on the middle line.",
  },
  u: {
    upper: "Pull a line down, curve round at the bottom, and go back up to the top.",
    lower: "Pull a short line down, curve round at the bottom, go back up to the middle line, then pull a short line straight down on the right.",
  },
  v: {
    upper: "Slant down from the top left to a point at the bottom, then slant back up to the top right.",
    lower: "Make the same small V between the middle line and the bottom line.",
  },
  w: {
    upper: "Slant down, slant up, slant down and slant up again, like two V's side by side.",
    lower: "Make the same small W between the middle line and the bottom line.",
  },
  x: {
    upper: "Slant a line down from the top left to the bottom right, then cross it with a line from the top right to the bottom left.",
    lower: "Make the same small X between the middle line and the bottom line.",
  },
  y: {
    upper: "Slant down from the top left to the middle, slant down from the top right to meet it, then pull a line straight down to the bottom.",
    lower:
      "Slant a short line down from the middle line to the bottom line, then draw a longer line from the middle line on the right, through that point, down to below the bottom line, ending with a little curve to the left.",
  },
  z: {
    upper: "Draw a line across the top, slant down to the bottom left, then draw a line across the bottom.",
    lower: "Make the same small Z between the middle line and the bottom line.",
  },
};

/**
 * The uppercase and lowercase sheets draw their letters in Helvetica, which
 * differs from the table for these two (checked on the rendered PDFs).
 */
export const HELVETICA_NOTES: { upper: Record<string, string>; lower: Record<string, string> } = {
  upper: {
    i: "Pull a tall line straight down. On this sheet the I is one plain line; on the tracing and handwriting sheets it also has a short bar across the top and the bottom, which helps tell it apart from lowercase l.",
  },
  lower: {
    a: "Make a small circle, starting at the top and going round to the left, then pull a short line straight down on its right side. The big a on this sheet is the printed a, with a little hook over the top; children write the round a, and both are correct.",
  },
};

export type LookAlikeGroup = { id: string; title: string; members: string; tip: string };

/**
 * Letters children mix up, one tip per group. Members are the letters whose
 * pages show the tip: lowercase letters for lowercase, capitals for capitals.
 * A letter in two groups gets the first one. Built from the look-alike map in
 * lib/games-fr.ts, merged into teaching groups.
 */
export const LOOK_ALIKES: LookAlikeGroup[] = [
  {
    id: "bdpq",
    title: "b, d, p and q",
    members: "bdpq",
    tip: 'These four are the same shapes turned around, so mix-ups are normal until about age 7. For b, say "first the bat, then the ball": the tall line comes first. For d, say "d starts like c": the round part comes first. p and q hang below the line: p is "line down, then the ball", and q is "ball, then a straight line down".',
  },
  {
    id: "mnuw",
    title: "m, n, u and w",
    members: "mnuw",
    tip: "n is a door with one hump; m has two humps; u is a cup that holds water; w has two valleys. Ask your child to count the humps or valleys out loud before writing.",
  },
  {
    id: "hn",
    title: "h and n",
    members: "h",
    tip: 'Both have one hump, but h has a tall back, like a chair. If your child writes n for h, ask "Does it go all the way up to the top line?"',
  },
  {
    id: "ijl",
    title: "i, j and l",
    members: "ijlI",
    tip: "i has a short line and a dot; j has a dot and a hook that goes below the line; l is one tall line with no dot. Uppercase I, lowercase l and the number 1 can look alike: on the tracing and handwriting sheets, I has a short bar at the top and the bottom, which is how to tell it from l.",
  },
  {
    id: "ft",
    title: "f and t",
    members: "ft",
    tip: 'Both are crossed on the middle line. f starts with a hook at the top; t starts lower, with no hook at the top, and curves a little to the right at the bottom. Say "f has a hat, t has no hat".',
  },
  {
    id: "EF",
    title: "E and F",
    members: "EF",
    tip: 'F is an E that lost its bottom line. Ask "Does it have a line along the floor?"',
  },
  {
    id: "CGOQ",
    title: "C, G, O and Q",
    members: "CGOQ",
    tip: "These all start with the same round curve. G adds a little shelf, O closes the circle, and Q adds a tail. Trace the C shape first, then add the extra part.",
  },
  {
    id: "aodgq",
    title: "a, o, d, g and q",
    members: "aog",
    tip: "All start with a small circle going round to the left. What comes after it changes the letter: a short line down (a), nothing (o), a tall line (d), a hook below the line (g), or a straight line below the line (q). Books often print a with a little hook over the top; children write the round a.",
  },
  {
    id: "ce",
    title: "c and e",
    members: "ce",
    tip: "e is a c with a line across its middle. Draw the line first, then the curve.",
  },
  {
    id: "vwy",
    title: "v, w and y",
    members: "vy",
    tip: "w is two v's joined. y is a v with a long leg that goes below the line.",
  },
  {
    id: "kx",
    title: "k and x",
    members: "kx",
    tip: "Both have slanted lines. x is two lines crossing; k has a tall straight back with the slanted lines touching it.",
  },
  {
    id: "sz",
    title: "s and z",
    members: "szS",
    tip: "Children often write them backwards, and S and Z can look like 5 and 2. S starts at the top right and curves left first; Z goes right first, then slants down to the left. The sheets don't mark where to start, so put a small dot there before your child begins.",
  },
  {
    id: "MWNZ",
    title: "M and W, N and Z",
    members: "MWNZ",
    tip: "These are each other turned or flipped. Point out where each one starts: M and N start with a tall line going down; W starts with a slant; Z starts with a line across.",
  },
];

/** The look-alike group shown for a letter in one case ("b" or "B"), if any. */
export function lookAlikeFor(ch: string): LookAlikeGroup | null {
  return LOOK_ALIKES.find((g) => g.members.includes(ch)) ?? null;
}

/**
 * The sound line: words from lib/letters-data.ts that really start with the
 * letter's usual sound (airplane, eagle, island and the u words say the
 * vowel's name, ship starts with sh, xylophone with a z sound).
 */
export const SOUND_WORDS: Record<string, { words: string[]; name?: string[]; note?: string }> = {
  a: { words: ["apple", "ant", "alligator"], name: ["airplane"] },
  b: { words: ["ball", "bear", "banana", "butterfly"] },
  c: { words: ["cat", "car", "cookie", "cloud"], note: "C can also sound like s, as in city; that one comes later." },
  d: { words: ["dog", "duck", "drum", "door"] },
  e: { words: ["elephant", "egg"], name: ["eagle"] },
  f: { words: ["fish", "frog", "flower", "fire"] },
  g: { words: ["goat", "grapes", "guitar", "gift"], note: "G can also sound like j, as in giraffe; that one comes later." },
  h: { words: ["horse", "house", "hat", "hen"] },
  i: { words: ["igloo", "insect", "iguana"], name: ["island"] },
  j: { words: ["jellyfish", "jacket", "jar", "juice"] },
  k: { words: ["kite", "king", "kangaroo", "key"] },
  l: { words: ["lion", "leaf", "lamp", "lemon"] },
  m: { words: ["monkey", "moon", "mouse", "milk"] },
  n: { words: ["nest", "nose", "nut", "net"] },
  o: { words: ["octopus"] },
  p: { words: ["pig", "penguin", "pizza", "parrot"] },
  q: { words: ["queen", "quilt", "question", "quail"], note: "Q almost always comes with u, and together they make that sound." },
  r: { words: ["rabbit", "rainbow", "rain", "rocket"] },
  s: { words: ["sun", "star", "snake"], note: "Ship starts with sh, which is a different sound." },
  t: { words: ["tiger", "tree", "train", "turtle"] },
  u: { words: ["umbrella", "up"], name: ["unicorn", "ukulele"] },
  v: { words: ["van", "violin", "vegetable", "volcano"] },
  w: { words: ["whale", "watch", "watermelon", "wolf"] },
  x: { words: ["fox", "ax"] },
  y: { words: ["yak", "yarn", "yo-yo", "yogurt"] },
  z: { words: ["zebra", "zipper", "zoo", "zigzag"] },
};

export const VOWELS = "aeiou";
