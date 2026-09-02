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
];

export function getPhonicsSkill(slug: string): PhonicsSkillContent | null {
  return phonicsSkills.find((s) => s.slug === slug) ?? null;
}
