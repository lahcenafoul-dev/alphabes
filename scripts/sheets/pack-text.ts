// The words of the Pro packs' own pages (scripts/sheets/packs.ts): cover,
// contents, "How to use this pack", answer keys, certificate and the
// printable sliding puzzles. Written for each language, not translated word
// for word. English first (step A); French, Spanish and Portuguese come
// with step B.
import type { PackKind } from "../../lib/sheets/packs";
import type { SheetLocale } from "../../lib/sheets/types";

export type PackText = {
  pro: string;
  /** Footer, left: the site, for Pro members. */
  site: string;
  /** Footer, right. */
  page: (n: number) => string;
  /** "80 worksheets", "24 puzzles". */
  count: (n: number, kind: PackKind | "mega") => string;
  keys: string;
  certificate: string;
  /** "Part 2 of 3: Art and drawing". */
  part: (n: number, of: number, name: string) => string;
  contents: string;
  contentsIntro: string;
  answerKeys: string;
  howTitle: string;
  howIntro: string;
  /** Tips for every pack, after the type's own. */
  howGeneral: string[];
  /** Each type's tips, and a one-line summary for the Mega pack. */
  howKind: Record<PackKind, { line: string; tips: string[] }>;
  keyTitle: (kindName: string) => string;
  keyInstruction: string;
  /** Under each small answer key: the sheet's title and page. */
  keyCaption: (title: string, page: number) => string;
  certTitle: string;
  certGreat: string;
  /** "Missing Numbers pack", "Missing Numbers pack (Numbers 1 to 20)". */
  packName: (name: string, sub?: string) => string;
  certFinished: (pack: string) => string;
  certDate: string;
  certSigned: string;
  puzzle: {
    cut: (name: string, size: number) => string;
    cutInstruction: string;
    board: (name: string) => string;
    boardInstruction: string;
    model: string;
  };
};

export const PACK_TEXT: Partial<Record<SheetLocale, PackText>> = {
  en: {
    pro: "AlphaBes Pro",
    site: "alphabes.com · AlphaBes Pro",
    page: (n) => `Page ${n}`,
    count: (n, kind) => `${n} ${kind === "sliding-puzzles" ? "picture puzzles" : kind === "flash-cards" ? "card sets" : kind === "origami" ? "models to fold" : "worksheets"}`,
    keys: "Answer keys",
    certificate: "Certificate",
    part: (n, of, name) => `Part ${n} of ${of}: ${name}`,
    contents: "What's inside",
    contentsIntro: "Print the whole pack, or just the pages you need today.",
    answerKeys: "Answer keys",
    howTitle: "How to use this pack",
    howIntro: "These worksheets go from easier to harder. Short, happy sessions work better than long ones: one or two pages a day is plenty.",
    howGeneral: [
      "Print at 100% (\"Actual size\"), not \"Fit to page\", so boxes and lines keep their size.",
      "Let your child write their name and the date on each sheet: it's a small habit that builds pride.",
      "Check the work together with the answer keys at the end, and praise the effort, not only the right answers.",
      "When the pack is done, fill in the certificate on the last page and put it on the fridge!",
    ],
    howKind: {
      "missing-numbers": {
        line: "Missing numbers: count along and write the number that's missing, from 10 up to 100.",
        tips: [
          "Start with the numbers to 10 and say each number out loud while pointing at it.",
          "If a gap is hard, count from the number before it, using fingers or small objects.",
          "The hundred charts and skip counting at the end are for children who count to 100 confidently.",
        ],
      },
      patterns: {
        line: "Patterns: find what repeats and what comes next, from AB to growing patterns.",
        tips: [
          "Read each row aloud together (\"apple, banana, apple, banana…\"): hearing the rhythm helps.",
          "Each pattern type has \"circle\" sheets first, then \"draw\" sheets with empty boxes to fill.",
          "Growing patterns add one picture each time: count the pictures in each box.",
        ],
      },
      stickers: {
        line: "Sticker sheets: print on sticker paper or plain paper, cut out, and use as rewards.",
        tips: [
          "Print on full-sheet sticker paper (A4 or Letter) for real stickers, or on plain paper with a glue stick.",
          "Let your child choose a sticker after each finished worksheet.",
          "The letter and number stickers are great for labelling boxes and drawings.",
        ],
      },
      "dot-to-dot": {
        line: "Dot to dot: join the dots in order to reveal a picture, then color it.",
        tips: [
          "Start at the star and say each number as you reach it.",
          "Easy pictures go to 10, medium to 20, hard to 50, and the last ones follow the alphabet.",
          "The small picture in the corner shows what will appear: use it to color.",
        ],
      },
      colouring: {
        line: "Coloring: color by number with a color key, then free coloring pages.",
        tips: [
          "On color-by-number pages, find number 1 in the key, color every 1, then go on to 2.",
          "Colored pencils work best for small areas; crayons are fine for the big ones.",
          "Free coloring pages have no right answer: any color is a good color!",
        ],
      },
      "how-to-draw": {
        line: "How to draw: copy a picture step by step, one new line at a time.",
        tips: [
          "The new line of each step is in pink: draw only that line, then go to the next box.",
          "Use a pencil first, so mistakes are easy to rub out, then go over it with a felt pen.",
          "There's a big box at the bottom for drawing the whole picture again.",
        ],
      },
      "body-parts": {
        line: "Body parts: name the parts of a body, a face, a hand, animals and a plant.",
        tips: [
          "Point to each part on the picture, then on your own body (\"Where's your elbow?\").",
          "On \"label\" sheets, copy the words from the word bank; on \"match\" sheets, draw a line.",
          "Talk about what each part does: we see with our eyes, a fish swims with its fins.",
        ],
      },
      "flash-cards": {
        line: "Flash cards: picture cards to cut out for games and new words.",
        tips: [
          "Print on card stock if you can, and cut along the dashed lines.",
          "Play memory with two copies, or hide a card and guess which one is missing.",
          "Keep each set in an envelope with its name on it.",
        ],
      },
      "telling-time": {
        line: "Telling time: read clocks and draw the hands, from o'clock to any minute.",
        tips: [
          "Begin with o'clock and half past, and use a real clock at home to show the same times.",
          "The short hand shows the hour, the long hand the minutes: say it every time.",
          "The daily routine sheets connect times to your child's own day.",
        ],
      },
      mazes: {
        line: "Mazes: find the way from start to finish, from easy to hard.",
        tips: [
          "Trace the path with a finger first, then with a pencil.",
          "Dead ends are part of the fun: go back and try another way.",
          "Easy mazes have wide paths for young hands; hard mazes have more turns.",
        ],
      },
      "tracing-lines": {
        line: "Tracing lines: follow the dashed lines to train the hand for writing.",
        tips: [
          "Start at the green dot and follow the arrow, without lifting the pencil if possible.",
          "Hold the pencil near the tip, with the paper turned a little for comfort.",
          "Lines and shapes come first; picture tracing comes after, with a model to color.",
        ],
      },
      origami: {
        line: "Origami: fold a square of paper step by step into animals and other models.",
        tips: [
          "Use a square of paper, colored on one side (15 cm or 6 inches is a good size).",
          "Fold together at first: show the step on your own paper, then let your child copy it.",
          "Press each crease flat with a fingernail, and compare with the next picture.",
        ],
      },
      "sliding-puzzles": {
        line: "Sliding puzzles: cut a picture into squares, take one out, and slide the others back.",
        tips: [
          "Cut along the dashed lines (a grown-up can help) and lay the pieces on the board.",
          "Take out the last piece, mix up the others, then slide them one at a time into place.",
          "Start with 3 × 3; the 4 × 4 puzzle has smaller pieces and is much harder.",
        ],
      },
    },
    keyTitle: (kind) => `Answer key: ${kind}`,
    keyInstruction: "Answers in red. Each key shows the page of its worksheet.",
    keyCaption: (title, page) => `${title} · page ${page}`,
    certTitle: "Certificate",
    certGreat: "Great job,",
    packName: (name, sub) => (name.endsWith("pack") ? name : `${name} pack`) + (sub ? ` (${sub})` : ""),
    certFinished: (pack) => `You finished the ${pack}!`,
    certDate: "Date",
    certSigned: "Signed",
    puzzle: {
      cut: (name, size) => `${name}: ${size} × ${size} Puzzle`,
      cutInstruction: "Cut along the dashed lines. Put the pieces on the board, take out the last one, mix them up, and slide them back.",
      board: (name) => `${name}: Puzzle Board`,
      boardInstruction: "Lay your pieces here. Slide a piece into the empty space, one at a time, until the picture is back.",
      model: "Your picture",
    },
  },
};

export function packText(locale: SheetLocale): PackText {
  const t = PACK_TEXT[locale];
  if (!t) throw new Error(`No Pro pack words in ${locale} yet (scripts/sheets/pack-text.ts)`);
  return t;
}
