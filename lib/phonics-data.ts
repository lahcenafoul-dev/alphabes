export type PhonicsSkillContent = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  examples: string[];
};

export const phonicsSkills: PhonicsSkillContent[] = [
  {
    slug: "letter-sounds",
    title: "Letter Sounds",
    summary: "Match every letter to the sound it makes.",
    description:
      "Letter-sound lessons connect each letter of the alphabet to its most common sound, using audio playback and repetition. This is usually the first phonics skill a child practices, right after letter recognition.",
    examples: ["A → /æ/ as in apple", "M → /m/ as in mat", "S → /s/ as in sun"],
  },
  {
    slug: "beginning-sounds",
    title: "Beginning Sounds",
    summary: "Identify the first sound in a spoken word.",
    description:
      "Beginning-sound activities ask a child to listen to a word and pick the letter or picture that matches its first sound. This builds the listening skills needed for spelling and early reading.",
    examples: ["Which starts with /b/: ball or sun?", "Which starts with /t/: top or dog?"],
  },
  {
    slug: "cvc-words",
    title: "CVC Words",
    summary: "Sound out simple consonant-vowel-consonant words.",
    description:
      "CVC (consonant-vowel-consonant) words like \"cat,\" \"pig,\" and \"sun\" are usually a child's first readable words. Practicing them builds confidence and introduces the idea that letters blend into words.",
    examples: ["c-a-t → cat", "p-i-g → pig", "s-u-n → sun"],
  },
  {
    slug: "blending",
    title: "Blending",
    summary: "Combine individual sounds smoothly into a word.",
    description:
      "Blending is the skill of stringing individual letter sounds together without pausing between them, turning \"c... a... t\" into the spoken word \"cat.\" It's usually practiced after a child is comfortable with individual letter sounds.",
    examples: ["/s/ + /i/ + /t/ → sit", "/h/ + /o/ + /p/ → hop"],
  },
  {
    slug: "short-vowels",
    title: "Short Vowels",
    summary: "Practice the short sound of each vowel in simple words.",
    description:
      "Short vowel sounds show up in most early reading words, so getting comfortable with all five of them opens the door to CVC words and beyond. Each vowel's short sound is usually quicker and simpler to say than its long, letter-name sound.",
    examples: ["a → apple", "e → bed", "i → pig", "o → hot", "u → sun"],
  },
  {
    slug: "long-vowels",
    title: "Long Vowels",
    summary: "Recognize the long, letter-name sound of each vowel.",
    description:
      "A long vowel sound says the vowel's own name, like the a in cake or the o in boat. Children usually meet long vowels after short vowels feel automatic, often through patterns like a silent e at the end of a word.",
    examples: ["cake → long a", "bike → long i", "boat → long o", "cute → long u"],
  },
  {
    slug: "segmenting",
    title: "Segmenting",
    summary: "Break a spoken word into its individual sounds.",
    description:
      "Segmenting is the reverse of blending: instead of combining sounds into a word, a child listens to a whole word and pulls it apart into the sounds that make it up. It's a key skill for spelling, since spelling means writing down each sound in order.",
    examples: ["map → /m/ /a/ /p/", "sit → /s/ /i/ /t/", "dog → /d/ /o/ /g/"],
  },
  {
    slug: "word-families",
    title: "Word Families",
    summary: "Spot common word endings shared by several simple words.",
    description:
      "A word family is a group of words that end the same way, changing only the first sound, like cat, hat, and mat. Once a child recognizes the pattern, sounding out a new word in that family becomes much faster.",
    examples: ["-at: cat, hat, mat", "-ig: pig, big, dig", "-un: sun, bun, run"],
  },
];

export function getPhonicsSkill(slug: string): PhonicsSkillContent | null {
  return phonicsSkills.find((s) => s.slug === slug) ?? null;
}
