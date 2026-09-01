// In production this is read from Prisma (Letter model). This file exists so
// the app renders real content end-to-end without a live database, and so
// the admin-editable shape of a "letter" is explicit and typed.

export type ExampleWord = {
  word: string;
  imageAlt: string;
};

export type LetterContent = {
  slug: string;
  order: number;
  uppercase: string;
  lowercase: string;
  phonicsSound: string;
  ipa: string;
  exampleWords: ExampleWord[];
  faq: { question: string; answer: string }[];
};

const alphabetOrder = "abcdefghijklmnopqrstuvwxyz".split("");

// Fully authored sample entries. The remaining 23 letters follow the exact
// same shape -- see ADMIN NOTE at the bottom for how content is added.
const authored: Record<string, LetterContent> = {
  a: {
    slug: "a",
    order: 1,
    uppercase: "A",
    lowercase: "a",
    phonicsSound: "Short A",
    ipa: "/æ/",
    exampleWords: [
      { word: "Apple", imageAlt: "A red apple" },
      { word: "Ant", imageAlt: "A small black ant" },
      { word: "Alligator", imageAlt: "A green alligator" },
      { word: "Airplane", imageAlt: "A blue toy airplane" },
    ],
    faq: [
      {
        question: "What sound does the letter A make?",
        answer:
          'The letter A most often makes the short "a" sound, as in "apple" and "ant." Children usually learn this sound before the long A sound in words like "cake."',
      },
      {
        question: "What age should a child learn the letter A?",
        answer:
          "Most children begin recognizing letters like A between ages 3 and 4, and start connecting the letter to its sound around age 4 to 5.",
      },
    ],
  },
  b: {
    slug: "b",
    order: 2,
    uppercase: "B",
    lowercase: "b",
    phonicsSound: "B sound",
    ipa: "/b/",
    exampleWords: [
      { word: "Ball", imageAlt: "A round red ball" },
      { word: "Bear", imageAlt: "A brown teddy bear" },
      { word: "Banana", imageAlt: "A yellow banana" },
      { word: "Butterfly", imageAlt: "A colorful butterfly" },
    ],
    faq: [
      {
        question: "What sound does the letter B make?",
        answer:
          'The letter B makes a short, punchy "buh" sound, made by pressing the lips together and releasing them, as in "ball" and "bear."',
      },
      {
        question: "How can I help my child practice the letter B?",
        answer:
          "Have your child trace the letter while saying its sound out loud, then find objects around the house that start with B, like a book or a banana.",
      },
    ],
  },
  c: {
    slug: "c",
    order: 3,
    uppercase: "C",
    lowercase: "c",
    phonicsSound: "Hard C",
    ipa: "/k/",
    exampleWords: [
      { word: "Cat", imageAlt: "An orange cat" },
      { word: "Car", imageAlt: "A red toy car" },
      { word: "Cookie", imageAlt: "A chocolate chip cookie" },
      { word: "Cloud", imageAlt: "A white fluffy cloud" },
    ],
    faq: [
      {
        question: "What sound does the letter C make?",
        answer:
          'The letter C most commonly makes a hard "kuh" sound, as in "cat" and "car." It can also make a soft "s" sound in words like "city," which is usually introduced later.',
      },
      {
        question: "Is C easy for beginners to learn?",
        answer:
          "Yes. Starting with the hard C sound in common words like cat and car gives children an easy, consistent pattern before introducing the soft C sound.",
      },
    ],
  },
};

export function getAllLetterSlugs(): string[] {
  return alphabetOrder;
}

export function getLetterContent(slug: string): LetterContent | null {
  const s = slug.toLowerCase();
  if (!alphabetOrder.includes(s)) return null;
  if (authored[s]) return authored[s];

  // ADMIN NOTE: Letters D-Z are provisioned here with a minimal correct
  // structure (real letterforms and sound, placeholder vocabulary) so the
  // site never renders fake statistics or invented educational claims.
  // Content team fills in exampleWords + faq per the `authored` shape above
  // (or, in production, via the admin panel writing to the Letter table).
  const order = alphabetOrder.indexOf(s) + 1;
  return {
    slug: s,
    order,
    uppercase: s.toUpperCase(),
    lowercase: s,
    phonicsSound: `${s.toUpperCase()} sound`,
    ipa: "",
    exampleWords: [],
    faq: [],
  };
}
