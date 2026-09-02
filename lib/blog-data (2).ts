export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[]; // paragraphs
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-teach-the-alphabet-to-preschoolers",
    title: "How to Teach the Alphabet to Preschoolers",
    excerpt: "Simple, low-pressure ways to introduce letters to a 3-4 year old.",
    body: [
      "Preschoolers learn letters best through repetition, play, and everyday exposure rather than worksheets alone. Pointing out letters on cereal boxes, street signs, and picture books helps a child see that letters are everywhere, not just in lesson time.",
      "Start with the letters in your child's own name — children are naturally more motivated to learn something personally meaningful. From there, move to a few high-frequency letters like A, B, and S before trying to cover the whole alphabet in order.",
      "Multi-sensory practice works well at this age: tracing a letter in sand, forming it with playdough, or drawing it in the air all reinforce the same shape through different senses. Keep sessions short — five to ten minutes is often enough for a 3-4 year old's attention span.",
    ],
  },
  {
    slug: "when-should-kids-learn-letter-sounds",
    title: "When Should Kids Learn Letter Sounds?",
    excerpt: "A general timeline for introducing phonics, and why every child moves at their own pace.",
    body: [
      "Most children begin connecting letters to sounds between ages 4 and 5, shortly after they've become comfortable recognizing and naming letters. This isn't a strict rule — some children show interest earlier, and others need more time, especially with letter recognition first.",
      "A helpful signal that a child is ready is when they start noticing that words begin with certain sounds on their own, like pointing out that 'mommy' and 'milk' both start the same way. That kind of sound awareness is a strong foundation for formal phonics instruction.",
      "There's no need to rush letter sounds before a child is comfortable with letter names and shapes. Building that foundation first tends to make the sound stage go more smoothly.",
    ],
  },
  {
    slug: "alphabet-activities-for-kindergarten",
    title: "Alphabet Activities for Kindergarten",
    excerpt: "Hands-on ideas for reinforcing the alphabet once a child starts kindergarten.",
    body: [
      "By kindergarten, most children are refining letter recognition and starting to blend sounds into simple words. Activities at this stage can move beyond basic recognition into games that combine letters, sounds, and short words.",
      "Letter scavenger hunts — searching a room or a book for a specific letter — keep recognition active without feeling like drilling. Sorting games, where a child groups objects or picture cards by their beginning sound, bridge letter knowledge into early phonics.",
      "Writing practice can be layered in naturally: having a child label a drawing with the first letter of what they've drawn connects the alphabet to something they already care about.",
    ],
  },
  {
    slug: "how-to-practice-phonics-at-home",
    title: "How to Practice Phonics at Home",
    excerpt: "Everyday routines that build phonics skills without extra flashcards.",
    body: [
      "Phonics practice doesn't need a formal lesson every time. Reading aloud together and occasionally pausing to sound out a simple word models the skill in context, which is often more effective than isolated drills.",
      "Rhyming games in the car or at bath time build the sound awareness that phonics depends on, since noticing that 'cat,' 'hat,' and 'bat' share an ending sound is closely related to blending and segmenting words.",
      "Keep an eye on frustration levels. Phonics can be genuinely difficult for young children, and short, low-pressure sessions tend to build more confidence than longer ones that end in tears.",
    ],
  },
  {
    slug: "best-ways-to-teach-letter-recognition",
    title: "Best Ways to Teach Letter Recognition",
    excerpt: "Practical, low-cost methods for helping a child recognize letters reliably.",
    body: [
      "Letter recognition improves fastest with frequent, varied exposure rather than a single method repeated over and over. Mixing flashcards, books, magnetic letters, and letters spotted out in the world all reinforce the same shapes from different angles.",
      "Uppercase letters are usually easier for young children to distinguish first, since their shapes tend to be more visually distinct from one another than lowercase letters. It's common to start there before introducing lowercase forms.",
      "Regularly revisiting a small set of letters, rather than introducing all 26 letters at once, tends to build more lasting recognition than trying to cover the whole alphabet quickly.",
    ],
  },
  {
    slug: "cvc-words-for-beginners",
    title: "CVC Words for Beginners",
    excerpt: "What CVC words are, and why they're usually a child's first readable words.",
    body: [
      "CVC stands for consonant-vowel-consonant, describing short words like 'cat,' 'dog,' and 'sun' where a vowel sound sits between two consonant sounds. Their simple, consistent structure makes them a common starting point for early reading.",
      "Before attempting CVC words, a child typically needs to be comfortable with the individual sounds of the letters involved. Trying to blend words before the underlying sounds are solid often leads to guessing rather than genuine reading.",
      "Practicing CVC words in word families — cat, hat, mat, sat — lets a child focus on changing just one sound at a time, which tends to make blending feel more manageable than jumping between unrelated words.",
    ],
  },
  {
    slug: "fun-abc-games-for-kids",
    title: "Fun ABC Games for Kids",
    excerpt: "Simple games that turn alphabet practice into play.",
    body: [
      "Games give repetitive alphabet practice a reason to happen without feeling like a chore. Simple options like 'I Spy' with letters, matching games with letter cards, or racing to find a called-out letter all work well with minimal setup.",
      "Movement-based games — like hopping to a letter taped on the floor, or forming letter shapes with your whole body — combine physical activity with letter recognition, which can help energetic kids stay engaged longer.",
      "Rotating between a few different games, rather than playing the same one every time, keeps practice feeling fresh and gives a child multiple ways to encounter the same letters and sounds.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | null {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}
