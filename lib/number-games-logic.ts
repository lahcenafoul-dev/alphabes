// The rounds of the five number games (components/number-games/), pure so
// tests/games/number-games.test.ts can check them. Every builder takes an
// optional random source (Math.random by default) to make the tests repeatable.

export type Rng = () => number;

/** A whole number from min to max, both included. */
export function randomInt(min: number, max: number, rng: Rng = Math.random): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function shuffleWith<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * `count` distinct numbers from min to max, none equal to `answer` or in
 * `avoid`, the closest ones to the answer first (a 3-year-old learns more
 * from 4 vs 5 than from 4 vs 10), in random order among equals.
 */
export function nearDistractors(
  answer: number,
  count: number,
  min: number,
  max: number,
  rng: Rng = Math.random,
  avoid: readonly number[] = [],
): number[] {
  const pool = [];
  for (let n = min; n <= max; n++) if (n !== answer && !avoid.includes(n)) pool.push(n);
  // Shuffle first so equal distances come out in random order, then sort by distance.
  const ranked = shuffleWith(pool, rng).sort((a, b) => Math.abs(a - answer) - Math.abs(b - answer));
  // Pick among the 4 closest, so the wrong answers vary from round to round.
  return shuffleWith(ranked.slice(0, Math.max(count, 4)), rng).slice(0, count);
}

/** The answer and the distractors, shuffled. */
function choicesFor(answer: number, distractors: number[], rng: Rng): number[] {
  return shuffleWith([answer, ...distractors], rng);
}

// ------------------------------------------------------------ the pictures

/** The cartoons that are counted: the counting animals, then a few public/words/ pictures. */
export const COUNT_PICTURES: readonly string[] = [
  "/counting/count-1-panda.webp",
  "/counting/count-2-penguin.webp",
  "/counting/count-3-frog.webp",
  "/counting/count-4-owl.webp",
  "/counting/count-5-fox.webp",
  "/counting/count-6-hedgehog.webp",
  "/counting/count-7-bunny.webp",
  "/counting/count-8-bee.webp",
  "/counting/count-9-snail.webp",
  "/counting/count-10-turtle.webp",
  "/words/apple.webp",
  "/words/star.webp",
  "/words/strawberry.webp",
  "/words/cookie.webp",
  "/words/flower.webp",
  "/words/fish.webp",
  "/words/duck.webp",
  "/words/ladybug.webp",
  "/words/butterfly.webp",
  "/words/carrot.webp",
];

export function randomPicture(rng: Rng = Math.random, not?: string): string {
  const pool = not ? COUNT_PICTURES.filter((p) => p !== not) : COUNT_PICTURES;
  return pool[Math.floor(rng() * pool.length)];
}

// ------------------------------------------------------------ 1. count and tap

export type CountRound = { answer: number; picture: string; choices: number[] };

/** 1 to 10 pictures; three numbers to choose from. */
export function countRound(rng: Rng = Math.random, previous?: number): CountRound {
  let answer = randomInt(1, 10, rng);
  if (answer === previous) answer = (answer % 10) + 1;
  return { answer, picture: randomPicture(rng), choices: choicesFor(answer, nearDistractors(answer, 2, 1, 10, rng), rng) };
}

// ------------------------------------------------------------ 2. missing number

export type MissingRound = {
  /** Five numbers in a row; `null` is the gap. */
  sequence: (number | null)[];
  answer: number;
  choices: number[];
};

export const SEQUENCE_LENGTH = 5;

/** Five numbers in order between 1 and 20 with one gap; the distractors are never on show. */
export function missingRound(rng: Rng = Math.random): MissingRound {
  const start = randomInt(1, 20 - SEQUENCE_LENGTH + 1, rng);
  const gap = randomInt(0, SEQUENCE_LENGTH - 1, rng);
  const full = Array.from({ length: SEQUENCE_LENGTH }, (_, i) => start + i);
  const answer = full[gap];
  const shown = full.filter((n) => n !== answer);
  return {
    sequence: full.map((n, i) => (i === gap ? null : n)),
    answer,
    choices: choicesFor(answer, nearDistractors(answer, 2, 1, 20, rng, shown), rng),
  };
}

/** True when the number fills the gap so the row counts up by one. */
export function fillsGap(sequence: readonly (number | null)[], n: number): boolean {
  const filled = sequence.map((x) => x ?? n);
  return filled.every((x, i) => i === 0 || x === filled[i - 1] + 1);
}

// ------------------------------------------------------------ 3. number match

export type MatchStyle = "dots" | "fingers";
export type MatchRound = { answer: number; style: MatchStyle; choices: number[] };

/** A number from 1 to 10 and three groups of dots, or of raised fingers, to choose from. */
export function matchRound(rng: Rng = Math.random, previous?: number): MatchRound {
  let answer = randomInt(1, 10, rng);
  if (answer === previous) answer = (answer % 10) + 1;
  const style: MatchStyle = rng() < 0.5 ? "dots" : "fingers";
  return { answer, style, choices: choicesFor(answer, nearDistractors(answer, 2, 1, 10, rng), rng) };
}

// ------------------------------------------------------------ 4. bigger or smaller

export type CompareAsk = "bigger" | "smaller";
export type CompareRound = { left: number; right: number; ask: CompareAsk; pictures: [string, string] };

/** Two different numbers from 1 to 10, each shown as a group; tap the bigger or the smaller. */
export function compareRound(rng: Rng = Math.random): CompareRound {
  const left = randomInt(1, 10, rng);
  // At most 5 apart at first sight is still easy; any different number will do.
  let right = randomInt(1, 9, rng);
  if (right >= left) right += 1;
  const ask: CompareAsk = rng() < 0.5 ? "bigger" : "smaller";
  const a = randomPicture(rng);
  return { left, right, ask, pictures: [a, randomPicture(rng, a)] };
}

export function compareAnswer(round: Pick<CompareRound, "left" | "right" | "ask">): number {
  return round.ask === "bigger" ? Math.max(round.left, round.right) : Math.min(round.left, round.right);
}

// ------------------------------------------------------------ 5. balloons

export const BALLOON_COUNT = 10;

export type Balloon = { n: number; color: string; /** A small sideways shift, in % of its cell. */ dx: number; /** Up or down, in px. */ dy: number };

const BALLOON_COLORS = ["#6A4CFF", "#FF5C93", "#FFB020", "#18A97F", "#3B82F6", "#F97316"];

/** The numbers 1 to 10 on balloons, in a random order. */
export function balloonRound(rng: Rng = Math.random): Balloon[] {
  return shuffleWith(
    Array.from({ length: BALLOON_COUNT }, (_, i) => i + 1),
    rng,
  ).map((n, i) => ({
    n,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    dx: Math.round((rng() - 0.5) * 16),
    dy: Math.round((rng() - 0.5) * 16),
  }));
}

/** The balloon to pop next: popped holds the numbers already popped, always 1, 2, 3… in order. */
export function nextBalloon(popped: readonly number[]): number | null {
  return popped.length >= BALLOON_COUNT ? null : popped.length + 1;
}

// ------------------------------------------------------------ dots

/**
 * Dot positions for 1 to 10, like dice and a ten-frame: up to 5 in one row
 * of a 5-wide frame, 6 to 10 as a full top row and the rest below. Returns
 * [column, row] pairs in a 5 × 2 grid; 1 to 3 are centred in one row.
 */
export function dotLayout(n: number): [number, number][] {
  if (n <= 5) {
    const offset = (5 - n) / 2;
    return Array.from({ length: n }, (_, i) => [offset + i, 0.5]);
  }
  const bottom = n - 5;
  return [
    ...Array.from({ length: 5 }, (_, i): [number, number] => [i, 0]),
    ...Array.from({ length: bottom }, (_, i): [number, number] => [i, 1]),
  ];
}
