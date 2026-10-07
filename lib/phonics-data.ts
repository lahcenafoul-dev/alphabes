export type PhonicsSkillContent = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  examples: string[];
  /** "How to practice at home": short steps for a parent. */
  practice: string[];
  /** "Watch out for": the usual stumbling block. */
  watchOut: string;
};

export const phonicsSkills: PhonicsSkillContent[] = [
  {
    slug: "letter-sounds",
    title: "Letter Sounds",
    summary: "Match every letter to the sound it makes.",
    description:
      "Letter-sound lessons connect each letter of the alphabet to its most common sound, using audio playback and repetition. This is usually the first phonics skill a child practices, right after letter recognition.",
    examples: ["A → /æ/ as in apple", "M → /m/ as in mat", "S → /s/ as in sun"],
    practice: [
      "Pick three letters a day, not the whole alphabet.",
      "Say the sound, not the name: /m/, not \"em\". Keep stop sounds short: /b/, not \"buh\".",
      "Play \"I spy something that starts with /s/\" around the house.",
      "Check with the flashcards: point to a letter, your child says its sound.",
    ],
    watchOut:
      "Letters with two common sounds (c, g) and the vowels. Start with the sound in the example word (c as in cat, g as in goat) and leave the others for later.",
  },
  {
    slug: "beginning-sounds",
    title: "Beginning Sounds",
    summary: "Identify the first sound in a spoken word.",
    description:
      "Beginning-sound activities ask a child to listen to a word and pick the letter or picture that matches its first sound. This builds the listening skills needed for spelling and early reading.",
    examples: ["Which starts with /b/: ball or sun?", "Which starts with /t/: top or dog?"],
    practice: [
      "Say a word slowly and stretch the first sound: \"ssssun\".",
      "Ask \"What's the first sound?\" before asking for the letter.",
      "Sort small toys or pictures into two piles by their first sound.",
      "Once it's easy, ask for the letter that makes that sound.",
    ],
    watchOut:
      "Words that start with a blend (stop, tree): the first sound is still just /s/ or /t/. Children often say the whole blend at first, and that's fine.",
  },
  {
    slug: "cvc-words",
    title: "CVC Words",
    summary: "Sound out simple consonant-vowel-consonant words.",
    description:
      "CVC (consonant-vowel-consonant) words like \"cat,\" \"pig,\" and \"sun\" are usually a child's first readable words. Practicing them builds confidence and introduces the idea that letters blend into words.",
    examples: ["c-a-t → cat", "p-i-g → pig", "s-u-n → sun"],
    practice: [
      "Start with a word family your child knows: cat, hat, mat.",
      "Point under each letter as you say its sound, then sweep your finger to read the word.",
      "Change one letter at a time: cat → cut → cup.",
      "Read the word, then find or draw its picture.",
    ],
    watchOut:
      "Saying each sound with an extra \"uh\" (cuh-a-tuh), which makes blending harder. Keep the sounds short and clean.",
  },
  {
    slug: "blending",
    title: "Blending",
    summary: "Combine individual sounds smoothly into a word.",
    description:
      "Blending is the skill of stringing individual letter sounds together without pausing between them, turning \"c... a... t\" into the spoken word \"cat.\" It's usually practiced after a child is comfortable with individual letter sounds.",
    examples: ["/s/ + /i/ + /t/ → sit", "/h/ + /o/ + /p/ → hop"],
    practice: [
      "Start with two sounds: /a/ + /t/ = at.",
      "Say the sounds slowly without stopping between them, then faster.",
      "Use continuous sounds first (m, s, f, l), which are easier to stretch.",
      "Play \"robot talk\": you say c-a-t, your child says cat.",
    ],
    watchOut:
      "Pausing between sounds. If your child says the sounds but not the word, say them again faster each time until the word \"pops out\".",
  },
  {
    slug: "short-vowels",
    title: "Short Vowels",
    summary: "Practice the short sound of each vowel in simple words.",
    description:
      "Short vowel sounds show up in most early reading words, so getting comfortable with all five of them opens the door to CVC words and beyond. Each vowel's short sound is usually quicker and simpler to say than its long, letter-name sound.",
    examples: ["a → apple", "e → bed", "i → pig", "o → hot", "u → sun"],
    practice: [
      "Teach one vowel at a time with one picture: a as in apple.",
      "Read CVC words that change only the vowel: bat, bet, bit, bot, but.",
      "Make a hand signal for each vowel.",
      "Sort pictures by their middle sound.",
    ],
    watchOut:
      "Short e and short i, which sound alike to many children (pen, pin). Say them side by side and look at your mouth shape in a mirror.",
  },
  {
    slug: "long-vowels",
    title: "Long Vowels",
    summary: "Recognize the long, letter-name sound of each vowel.",
    description:
      "A long vowel sound says the vowel's own name, like the a in cake or the o in boat. Children usually meet long vowels after short vowels feel automatic, often through patterns like a silent e at the end of a word.",
    examples: ["cake → long a", "bike → long i", "boat → long o", "cute → long u"],
    practice: [
      "Start once short vowels are automatic.",
      "Show the silent e: cap → cape, kit → kite.",
      "Say \"the vowel says its name\".",
      "Sort words into short and long vowel piles.",
    ],
    watchOut:
      "Expecting every e at the end to be silent in every word. Keep to simple pairs (cap/cape, hop/hope) at first.",
  },
  {
    slug: "segmenting",
    title: "Segmenting",
    summary: "Break a spoken word into its individual sounds.",
    description:
      "Segmenting is the reverse of blending: instead of combining sounds into a word, a child listens to a whole word and pulls it apart into the sounds that make it up. It's a key skill for spelling, since spelling means writing down each sound in order.",
    examples: ["map → /m/ /a/ /p/", "sit → /s/ /i/ /t/", "dog → /d/ /o/ /g/"],
    practice: [
      "Use three counters or claps for a three-sound word.",
      "Say the word, then slide a counter for each sound: /m/ /a/ /p/.",
      "Go from sounds back to the word to check.",
      "Then write one letter for each counter.",
    ],
    watchOut:
      "Splitting into syllables instead of sounds. \"Sun\" is one syllable but three sounds: /s/ /u/ /n/.",
  },
  {
    slug: "word-families",
    title: "Word Families",
    summary: "Spot common word endings shared by several simple words.",
    description:
      "A word family is a group of words that end the same way, changing only the first sound, like cat, hat, and mat. Once a child recognizes the pattern, sounding out a new word in that family becomes much faster.",
    examples: ["-at: cat, hat, mat", "-ig: pig, big, dig", "-un: sun, bun, run"],
    practice: [
      "Write the ending (-at) and change the first letter: c, h, m, s.",
      "Read the list from top to bottom, faster each time.",
      "Make a flip book or a wheel with the ending fixed.",
      "Find the family in a story or a sign.",
    ],
    watchOut:
      "Nonsense words (zat, jat). They are good practice for blending, as long as your child knows they aren't real words.",
  },
];

export function getPhonicsSkill(slug: string): PhonicsSkillContent | null {
  return phonicsSkills.find((s) => s.slug === slug) ?? null;
}
