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
  d: {
    slug: "d", order: 4, uppercase: "D", lowercase: "d",
    phonicsSound: "D sound", ipa: "/d/",
    exampleWords: [
      { word: "Dog", imageAlt: "A brown dog" },
      { word: "Duck", imageAlt: "A yellow duck" },
      { word: "Drum", imageAlt: "A small drum" },
      { word: "Door", imageAlt: "A wooden door" },
    ],
    faq: [
      { question: "What sound does the letter D make?", answer: "The letter D makes the D sound, as in words like Dog and Duck." },
      { question: "How can I help my child practice the letter D?", answer: "Have your child trace the letter D while saying its sound, then look for objects that start with D around the house, like a door or a drum." },
    ],
  },
  e: {
    slug: "e", order: 5, uppercase: "E", lowercase: "e",
    phonicsSound: "Short E", ipa: "/ɛ/",
    exampleWords: [
      { word: "Elephant", imageAlt: "A gray elephant" },
      { word: "Egg", imageAlt: "A white egg" },
      { word: "Eagle", imageAlt: "A flying eagle" },
      { word: "Ear", imageAlt: "A human ear" },
    ],
    faq: [
      { question: "What sound does the letter E make?", answer: "The letter E most often makes the short E sound, as in Elephant and Egg." },
      { question: "How can I help my child practice the letter E?", answer: "Have your child trace the letter E while saying its sound, then look for objects that start with E around the house, like an egg." },
    ],
  },
  f: {
    slug: "f", order: 6, uppercase: "F", lowercase: "f",
    phonicsSound: "F sound", ipa: "/f/",
    exampleWords: [
      { word: "Fish", imageAlt: "An orange fish" },
      { word: "Frog", imageAlt: "A green frog" },
      { word: "Flower", imageAlt: "A pink flower" },
      { word: "Fire", imageAlt: "A campfire" },
    ],
    faq: [
      { question: "What sound does the letter F make?", answer: "The letter F makes the F sound, as in Fish and Frog." },
      { question: "How can I help my child practice the letter F?", answer: "Have your child trace the letter F while saying its sound, then look for objects that start with F around the house, like a flower." },
    ],
  },
  g: {
    slug: "g", order: 7, uppercase: "G", lowercase: "g",
    phonicsSound: "Hard G", ipa: "/ɡ/",
    exampleWords: [
      { word: "Goat", imageAlt: "A white goat" },
      { word: "Grapes", imageAlt: "A bunch of grapes" },
      { word: "Guitar", imageAlt: "A brown guitar" },
      { word: "Gift", imageAlt: "A wrapped gift" },
    ],
    faq: [
      { question: "What sound does the letter G make?", answer: "The letter G most often makes the hard G sound, as in Goat and Guitar." },
      { question: "How can I help my child practice the letter G?", answer: "Have your child trace the letter G while saying its sound, then look for objects that start with G around the house, like a gift." },
    ],
  },
  h: {
    slug: "h", order: 8, uppercase: "H", lowercase: "h",
    phonicsSound: "H sound", ipa: "/h/",
    exampleWords: [
      { word: "Horse", imageAlt: "A brown horse" },
      { word: "House", imageAlt: "A small house" },
      { word: "Hat", imageAlt: "A red hat" },
      { word: "Hen", imageAlt: "A brown hen" },
    ],
    faq: [
      { question: "What sound does the letter H make?", answer: "The letter H makes a breathy H sound, as in House and Hat." },
      { question: "How can I help my child practice the letter H?", answer: "Have your child trace the letter H while saying its sound, then look for objects that start with H around the house, like a hat." },
    ],
  },
  i: {
    slug: "i", order: 9, uppercase: "I", lowercase: "i",
    phonicsSound: "Short I", ipa: "/ɪ/",
    exampleWords: [
      { word: "Igloo", imageAlt: "A snow igloo" },
      { word: "Insect", imageAlt: "A small insect" },
      { word: "Iguana", imageAlt: "A green iguana" },
      { word: "Island", imageAlt: "A tropical island" },
    ],
    faq: [
      { question: "What sound does the letter I make?", answer: "The letter I most often makes the short I sound, as in Igloo and Insect." },
      { question: "How can I help my child practice the letter I?", answer: "Have your child trace the letter I while saying its sound, then look for pictures that start with I, like an igloo." },
    ],
  },
  j: {
    slug: "j", order: 10, uppercase: "J", lowercase: "j",
    phonicsSound: "J sound", ipa: "/dʒ/",
    exampleWords: [
      { word: "Jelly", imageAlt: "A jar of jelly" },
      { word: "Jacket", imageAlt: "A blue jacket" },
      { word: "Jar", imageAlt: "A glass jar" },
      { word: "Juice", imageAlt: "A glass of juice" },
    ],
    faq: [
      { question: "What sound does the letter J make?", answer: "The letter J makes the J sound, as in Jacket and Juice." },
      { question: "How can I help my child practice the letter J?", answer: "Have your child trace the letter J while saying its sound, then look for objects that start with J, like juice." },
    ],
  },
  k: {
    slug: "k", order: 11, uppercase: "K", lowercase: "k",
    phonicsSound: "K sound", ipa: "/k/",
    exampleWords: [
      { word: "Kite", imageAlt: "A colorful kite" },
      { word: "King", imageAlt: "A crowned king" },
      { word: "Kangaroo", imageAlt: "A jumping kangaroo" },
      { word: "Key", imageAlt: "A metal key" },
    ],
    faq: [
      { question: "What sound does the letter K make?", answer: "The letter K makes the K sound, as in Kite and Key." },
      { question: "How can I help my child practice the letter K?", answer: "Have your child trace the letter K while saying its sound, then look for objects that start with K, like a key." },
    ],
  },
  l: {
    slug: "l", order: 12, uppercase: "L", lowercase: "l",
    phonicsSound: "L sound", ipa: "/l/",
    exampleWords: [
      { word: "Lion", imageAlt: "A golden lion" },
      { word: "Leaf", imageAlt: "A green leaf" },
      { word: "Lamp", imageAlt: "A desk lamp" },
      { word: "Lemon", imageAlt: "A yellow lemon" },
    ],
    faq: [
      { question: "What sound does the letter L make?", answer: "The letter L makes the L sound, as in Lion and Lemon." },
      { question: "How can I help my child practice the letter L?", answer: "Have your child trace the letter L while saying its sound, then look for objects that start with L, like a leaf." },
    ],
  },
  m: {
    slug: "m", order: 13, uppercase: "M", lowercase: "m",
    phonicsSound: "M sound", ipa: "/m/",
    exampleWords: [
      { word: "Monkey", imageAlt: "A playful monkey" },
      { word: "Moon", imageAlt: "A crescent moon" },
      { word: "Mouse", imageAlt: "A small mouse" },
      { word: "Milk", imageAlt: "A glass of milk" },
    ],
    faq: [
      { question: "What sound does the letter M make?", answer: "The letter M makes the M sound, as in Monkey and Milk." },
      { question: "How can I help my child practice the letter M?", answer: "Have your child trace the letter M while saying its sound, then look for objects that start with M, like milk." },
    ],
  },
  n: {
    slug: "n", order: 14, uppercase: "N", lowercase: "n",
    phonicsSound: "N sound", ipa: "/n/",
    exampleWords: [
      { word: "Nest", imageAlt: "A bird's nest" },
      { word: "Nose", imageAlt: "A person's nose" },
      { word: "Nut", imageAlt: "A brown nut" },
      { word: "Net", imageAlt: "A fishing net" },
    ],
    faq: [
      { question: "What sound does the letter N make?", answer: "The letter N makes the N sound, as in Nest and Nut." },
      { question: "How can I help my child practice the letter N?", answer: "Have your child trace the letter N while saying its sound, then look for objects that start with N, like a nest." },
    ],
  },
  o: {
    slug: "o", order: 15, uppercase: "O", lowercase: "o",
    phonicsSound: "Short O", ipa: "/ɒ/",
    exampleWords: [
      { word: "Orange", imageAlt: "An orange fruit" },
      { word: "Owl", imageAlt: "A brown owl" },
      { word: "Octopus", imageAlt: "A purple octopus" },
      { word: "Onion", imageAlt: "A yellow onion" },
    ],
    faq: [
      { question: "What sound does the letter O make?", answer: "The letter O most often makes the short O sound, as in Octopus and Onion." },
      { question: "How can I help my child practice the letter O?", answer: "Have your child trace the letter O while saying its sound, then look for objects that start with O, like an orange." },
    ],
  },
  p: {
    slug: "p", order: 16, uppercase: "P", lowercase: "p",
    phonicsSound: "P sound", ipa: "/p/",
    exampleWords: [
      { word: "Pig", imageAlt: "A pink pig" },
      { word: "Penguin", imageAlt: "A waddling penguin" },
      { word: "Pizza", imageAlt: "A slice of pizza" },
      { word: "Parrot", imageAlt: "A colorful parrot" },
    ],
    faq: [
      { question: "What sound does the letter P make?", answer: "The letter P makes the P sound, as in Pig and Pizza." },
      { question: "How can I help my child practice the letter P?", answer: "Have your child trace the letter P while saying its sound, then look for objects that start with P, like a pig." },
    ],
  },
  q: {
    slug: "q", order: 17, uppercase: "Q", lowercase: "q",
    phonicsSound: "Qu sound", ipa: "/kw/",
    exampleWords: [
      { word: "Queen", imageAlt: "A crowned queen" },
      { word: "Quilt", imageAlt: "A patterned quilt" },
      { word: "Question", imageAlt: "A question mark" },
      { word: "Quail", imageAlt: "A small quail bird" },
    ],
    faq: [
      { question: "What sound does the letter Q make?", answer: "The letter Q is almost always followed by U and makes the 'kw' sound, as in Queen." },
      { question: "How can I help my child practice the letter Q?", answer: "Have your child trace the letter Q while saying 'kw', then look for a picture of a queen or a quilt." },
    ],
  },
  r: {
    slug: "r", order: 18, uppercase: "R", lowercase: "r",
    phonicsSound: "R sound", ipa: "/r/",
    exampleWords: [
      { word: "Rabbit", imageAlt: "A white rabbit" },
      { word: "Rainbow", imageAlt: "A colorful rainbow" },
      { word: "Rain", imageAlt: "Falling rain" },
      { word: "Rocket", imageAlt: "A flying rocket" },
    ],
    faq: [
      { question: "What sound does the letter R make?", answer: "The letter R makes the R sound, as in Rabbit and Rocket." },
      { question: "How can I help my child practice the letter R?", answer: "Have your child trace the letter R while saying its sound, then look for objects that start with R, like a rabbit." },
    ],
  },
  s: {
    slug: "s", order: 19, uppercase: "S", lowercase: "s",
    phonicsSound: "S sound", ipa: "/s/",
    exampleWords: [
      { word: "Sun", imageAlt: "A bright yellow sun" },
      { word: "Star", imageAlt: "A shining star" },
      { word: "Snake", imageAlt: "A green snake" },
      { word: "Ship", imageAlt: "A sailing ship" },
    ],
    faq: [
      { question: "What sound does the letter S make?", answer: "The letter S makes a hissing S sound, as in Sun and Snake." },
      { question: "How can I help my child practice the letter S?", answer: "Have your child trace the letter S while saying its sound, then look for objects that start with S, like the sun." },
    ],
  },
  t: {
    slug: "t", order: 20, uppercase: "T", lowercase: "t",
    phonicsSound: "T sound", ipa: "/t/",
    exampleWords: [
      { word: "Tiger", imageAlt: "An orange tiger" },
      { word: "Tree", imageAlt: "A green tree" },
      { word: "Train", imageAlt: "A moving train" },
      { word: "Turtle", imageAlt: "A slow turtle" },
    ],
    faq: [
      { question: "What sound does the letter T make?", answer: "The letter T makes the T sound, as in Tiger and Train." },
      { question: "How can I help my child practice the letter T?", answer: "Have your child trace the letter T while saying its sound, then look for objects that start with T, like a tree." },
    ],
  },
  u: {
    slug: "u", order: 21, uppercase: "U", lowercase: "u",
    phonicsSound: "Short U", ipa: "/ʌ/",
    exampleWords: [
      { word: "Umbrella", imageAlt: "An open umbrella" },
      { word: "Unicorn", imageAlt: "A white unicorn" },
      { word: "Ukulele", imageAlt: "A small ukulele" },
      { word: "Up", imageAlt: "An arrow pointing up" },
    ],
    faq: [
      { question: "What sound does the letter U make?", answer: "The letter U most often makes the short U sound, as in Umbrella." },
      { question: "How can I help my child practice the letter U?", answer: "Have your child trace the letter U while saying its sound, then look for a picture of an umbrella or a unicorn." },
    ],
  },
  v: {
    slug: "v", order: 22, uppercase: "V", lowercase: "v",
    phonicsSound: "V sound", ipa: "/v/",
    exampleWords: [
      { word: "Van", imageAlt: "A delivery van" },
      { word: "Violin", imageAlt: "A wooden violin" },
      { word: "Vegetable", imageAlt: "Fresh vegetables" },
      { word: "Volcano", imageAlt: "An erupting volcano" },
    ],
    faq: [
      { question: "What sound does the letter V make?", answer: "The letter V makes the V sound, as in Van and Violin." },
      { question: "How can I help my child practice the letter V?", answer: "Have your child trace the letter V while saying its sound, then look for a picture of a van or a volcano." },
    ],
  },
  w: {
    slug: "w", order: 23, uppercase: "W", lowercase: "w",
    phonicsSound: "W sound", ipa: "/w/",
    exampleWords: [
      { word: "Whale", imageAlt: "A blue whale" },
      { word: "Watch", imageAlt: "A wrist watch" },
      { word: "Watermelon", imageAlt: "A slice of watermelon" },
      { word: "Wolf", imageAlt: "A gray wolf" },
    ],
    faq: [
      { question: "What sound does the letter W make?", answer: "The letter W makes the W sound, as in Whale and Watch." },
      { question: "How can I help my child practice the letter W?", answer: "Have your child trace the letter W while saying its sound, then look for a picture of a whale." },
    ],
  },
  x: {
    slug: "x", order: 24, uppercase: "X", lowercase: "x",
    phonicsSound: "X sound", ipa: "/ks/",
    exampleWords: [
      { word: "Xylophone", imageAlt: "A colorful xylophone" },
      { word: "X-ray", imageAlt: "An X-ray image" },
      { word: "Fox", imageAlt: "An orange fox" },
      { word: "Ax", imageAlt: "A wooden axe" },
    ],
    faq: [
      { question: "What sound does the letter X make?", answer: "The letter X usually makes the 'ks' sound at the end of words, as in Fox and Ax." },
      { question: "How can I help my child practice the letter X?", answer: "Have your child trace the letter X while saying 'ks', then look for words that end in X, like fox." },
    ],
  },
  y: {
    slug: "y", order: 25, uppercase: "Y", lowercase: "y",
    phonicsSound: "Y sound", ipa: "/j/",
    exampleWords: [
      { word: "Yak", imageAlt: "A shaggy yak" },
      { word: "Yarn", imageAlt: "A ball of yarn" },
      { word: "Yo-yo", imageAlt: "A red yo-yo" },
      { word: "Yogurt", imageAlt: "A cup of yogurt" },
    ],
    faq: [
      { question: "What sound does the letter Y make?", answer: "The letter Y makes the Y sound at the start of words, as in Yak and Yogurt." },
      { question: "How can I help my child practice the letter Y?", answer: "Have your child trace the letter Y while saying its sound, then look for a picture of yarn or a yo-yo." },
    ],
  },
  z: {
    slug: "z", order: 26, uppercase: "Z", lowercase: "z",
    phonicsSound: "Z sound", ipa: "/z/",
    exampleWords: [
      { word: "Zebra", imageAlt: "A striped zebra" },
      { word: "Zipper", imageAlt: "A metal zipper" },
      { word: "Zoo", imageAlt: "A zoo entrance" },
      { word: "Zigzag", imageAlt: "A zigzag pattern" },
    ],
    faq: [
      { question: "What sound does the letter Z make?", answer: "The letter Z makes a buzzing Z sound, as in Zebra and Zipper." },
      { question: "How can I help my child practice the letter Z?", answer: "Have your child trace the letter Z while saying its sound, then look for a picture of a zebra at the zoo." },
    ],
  },
}
