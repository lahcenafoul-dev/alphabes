// Blog content system. Like every other content type on this site
// (letters, phonics, worksheets, preschool/kindergarten topics), blog
// content is a typed, in-repo data array, not markdown/MDX or a CMS --
// see the ADMIN NOTE at the bottom for how to add a new article.

export type RelatedLink = { label: string; href: string };

export type BlogFaqItem = { question: string; answer: string };

export type BlogSection = { heading: string; paragraphs: string[] };

export type BlogCategory = {
  slug: string;
  name: string;
  description: string;
};

export const blogCategories: BlogCategory[] = [
  { slug: "alphabet", name: "Alphabet", description: "Guides on teaching letter names, shapes, and recognition." },
  { slug: "phonics", name: "Phonics", description: "Letter sounds, blending, and early reading skills." },
  { slug: "worksheets", name: "Worksheets", description: "How to pick and use printable practice pages." },
  { slug: "preschool-activities", name: "Preschool Activities", description: "Hands-on ideas for preschool-aged learners." },
  { slug: "kindergarten", name: "Kindergarten", description: "Guides for kindergarten letter, phonics, and writing skills." },
  { slug: "learning-activities", name: "Learning Activities", description: "Games and general activity ideas for early learners." },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  sections: BlogSection[];
  faq: BlogFaqItem[];
  relatedArticleSlugs: string[];
  relatedLinks: RelatedLink[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-teach-the-alphabet-to-preschoolers",
    title: "How to Teach the Alphabet to Preschoolers",
    excerpt: "Simple, low-pressure ways to introduce letters to a 3-4 year old.",
    categorySlug: "preschool-activities",
    author: "AlphaBes Team",
    publishedAt: "2026-01-12",
    sections: [
      {
        heading: "Make Letters Part of Everyday Life",
        paragraphs: [
          "Preschoolers learn letters best through repetition, play, and everyday exposure rather than worksheets alone. Pointing out letters on cereal boxes, street signs, and picture books helps a child see that letters are everywhere, not just in lesson time.",
        ],
      },
      {
        heading: "Start With Meaningful Letters",
        paragraphs: [
          "Start with the letters in your child's own name — children are naturally more motivated to learn something personally meaningful. From there, move to a few high-frequency letters like A, B, and S before trying to cover the whole alphabet in order.",
        ],
      },
      {
        heading: "Use Multi-Sensory Practice",
        paragraphs: [
          "Multi-sensory practice works well at this age: tracing a letter in sand, forming it with playdough, or drawing it in the air all reinforce the same shape through different senses. Keep sessions short — five to ten minutes is often enough for a 3-4 year old's attention span.",
        ],
      },
    ],
    faq: [],
    relatedArticleSlugs: ["best-ways-to-teach-letter-recognition", "fun-abc-games-for-kids"],
    relatedLinks: [
      { label: "Letter A lesson page", href: "/alphabet/a" },
      { label: "Letter A tracing worksheet", href: "/worksheets/letter-a-tracing" },
      { label: "Find the Letter game", href: "/games/find-the-letter" },
      { label: "Preschool Learning Hub", href: "/preschool" },
    ],
  },
  {
    slug: "when-should-kids-learn-letter-sounds",
    title: "When Should Kids Learn Letter Sounds?",
    excerpt: "A general timeline for introducing phonics, and why every child moves at their own pace.",
    categorySlug: "phonics",
    author: "AlphaBes Team",
    publishedAt: "2026-01-19",
    sections: [
      {
        heading: "A General Timeline",
        paragraphs: [
          "Most children begin connecting letters to sounds between ages 4 and 5, shortly after they've become comfortable recognizing and naming letters. This isn't a strict rule — some children show interest earlier, and others need more time, especially with letter recognition first.",
        ],
      },
      {
        heading: "Signs of Readiness",
        paragraphs: [
          "A helpful signal that a child is ready is when they start noticing that words begin with certain sounds on their own, like pointing out that \"mommy\" and \"milk\" both start the same way. That kind of sound awareness is a strong foundation for formal phonics instruction.",
        ],
      },
      {
        heading: "There's No Need to Rush",
        paragraphs: [
          "There's no need to rush letter sounds before a child is comfortable with letter names and shapes. Building that foundation first tends to make the sound stage go more smoothly.",
        ],
      },
    ],
    faq: [
      {
        question: "What age do most kids start learning letter sounds?",
        answer: "Most children start around age 4 to 5, after they're already comfortable recognizing letter names and shapes.",
      },
    ],
    relatedArticleSlugs: ["how-to-practice-phonics-at-home", "cvc-words-for-beginners"],
    relatedLinks: [
      { label: "Letter Sounds phonics lessons", href: "/phonics/letter-sounds" },
      { label: "Beginning Sounds practice", href: "/phonics/beginning-sounds" },
      { label: "Beginning Sound game", href: "/games/beginning-sound" },
    ],
  },
  {
    slug: "alphabet-activities-for-kindergarten",
    title: "Alphabet Activities for Kindergarten",
    excerpt: "Hands-on ideas for reinforcing the alphabet once a child starts kindergarten.",
    categorySlug: "kindergarten",
    author: "AlphaBes Team",
    publishedAt: "2026-01-26",
    sections: [
      {
        heading: "Where Kindergartners Are Starting From",
        paragraphs: [
          "By kindergarten, most children are refining letter recognition and starting to blend sounds into simple words. Activities at this stage can move beyond basic recognition into games that combine letters, sounds, and short words.",
        ],
      },
      {
        heading: "Scavenger Hunts and Sorting Games",
        paragraphs: [
          "Letter scavenger hunts — searching a room or a book for a specific letter — keep recognition active without feeling like drilling. Sorting games, where a child groups objects or picture cards by their beginning sound, bridge letter knowledge into early phonics.",
        ],
      },
      {
        heading: "Layer In Writing Naturally",
        paragraphs: [
          "Writing practice can be layered in naturally: having a child label a drawing with the first letter of what they've drawn connects the alphabet to something they already care about.",
        ],
      },
    ],
    faq: [],
    relatedArticleSlugs: ["how-to-choose-the-right-alphabet-worksheets", "fun-abc-games-for-kids"],
    relatedLinks: [
      { label: "Browse all worksheets", href: "/worksheets" },
      { label: "Letter recognition worksheets", href: "/worksheets/letter-recognition" },
      { label: "Alphabet writing practice worksheets", href: "/worksheets/alphabet-writing-practice" },
      { label: "Kindergarten Learning Hub", href: "/kindergarten" },
    ],
  },
  {
    slug: "how-to-practice-phonics-at-home",
    title: "How to Practice Phonics at Home",
    excerpt: "Everyday routines that build phonics skills without extra flashcards.",
    categorySlug: "phonics",
    author: "AlphaBes Team",
    publishedAt: "2026-02-02",
    sections: [
      {
        heading: "Skip the Formal Lesson",
        paragraphs: [
          "Phonics practice doesn't need a formal lesson every time. Reading aloud together and occasionally pausing to sound out a simple word models the skill in context, which is often more effective than isolated drills.",
        ],
      },
      {
        heading: "Everyday Rhyming Games",
        paragraphs: [
          "Rhyming games in the car or at bath time build the sound awareness that phonics depends on, since noticing that \"cat,\" \"hat,\" and \"bat\" share an ending sound is closely related to blending and segmenting words.",
        ],
      },
      {
        heading: "Watch for Frustration",
        paragraphs: [
          "Keep an eye on frustration levels. Phonics can be genuinely difficult for young children, and short, low-pressure sessions tend to build more confidence than longer ones that end in tears.",
        ],
      },
    ],
    faq: [],
    relatedArticleSlugs: ["when-should-kids-learn-letter-sounds", "cvc-words-for-beginners"],
    relatedLinks: [
      { label: "Beginning Sounds practice", href: "/phonics/beginning-sounds" },
      { label: "Blending lessons", href: "/phonics/blending" },
      { label: "Beginning sounds worksheets", href: "/worksheets/beginning-sounds-practice" },
    ],
  },
  {
    slug: "best-ways-to-teach-letter-recognition",
    title: "Best Ways to Teach Letter Recognition",
    excerpt: "Practical, low-cost methods for helping a child recognize letters reliably.",
    categorySlug: "alphabet",
    author: "AlphaBes Team",
    publishedAt: "2026-02-09",
    sections: [
      {
        heading: "Mix Up How Letters Are Practiced",
        paragraphs: [
          "Letter recognition improves fastest with frequent, varied exposure rather than a single method repeated over and over. Mixing flashcards, books, magnetic letters, and letters spotted out in the world all reinforce the same shapes from different angles.",
        ],
      },
      {
        heading: "Start With Uppercase",
        paragraphs: [
          "Uppercase letters are usually easier for young children to distinguish first, since their shapes tend to be more visually distinct from one another than lowercase letters. It's common to start there before introducing lowercase forms.",
        ],
      },
      {
        heading: "Revisit a Small Set of Letters",
        paragraphs: [
          "Regularly revisiting a small set of letters, rather than introducing all 26 letters at once, tends to build more lasting recognition than trying to cover the whole alphabet quickly.",
        ],
      },
    ],
    faq: [],
    relatedArticleSlugs: ["how-to-teach-the-alphabet-to-preschoolers", "how-to-choose-the-right-alphabet-worksheets"],
    relatedLinks: [
      { label: "Find the Letter game", href: "/games/find-the-letter" },
      { label: "Letter recognition worksheets", href: "/worksheets/letter-recognition" },
      { label: "Uppercase letter worksheets", href: "/worksheets/uppercase-letters" },
    ],
  },
  {
    slug: "cvc-words-for-beginners",
    title: "CVC Words for Beginners",
    excerpt: "What CVC words are, and why they're usually a child's first readable words.",
    categorySlug: "phonics",
    author: "AlphaBes Team",
    publishedAt: "2026-02-16",
    sections: [
      {
        heading: "What CVC Words Are",
        paragraphs: [
          "CVC stands for consonant-vowel-consonant, describing short words like \"cat,\" \"dog,\" and \"sun\" where a vowel sound sits between two consonant sounds. Their simple, consistent structure makes them a common starting point for early reading.",
        ],
      },
      {
        heading: "What Comes Before CVC Words",
        paragraphs: [
          "Before attempting CVC words, a child typically needs to be comfortable with the individual sounds of the letters involved. Trying to blend words before the underlying sounds are solid often leads to guessing rather than genuine reading.",
        ],
      },
      {
        heading: "Practice in Word Families",
        paragraphs: [
          "Practicing CVC words in word families — cat, hat, mat, sat — lets a child focus on changing just one sound at a time, which tends to make blending feel more manageable than jumping between unrelated words.",
        ],
      },
    ],
    faq: [
      {
        question: "What does CVC stand for?",
        answer: "Consonant-vowel-consonant — a short word pattern like cat or sun where one vowel sound sits between two consonant sounds.",
      },
      {
        question: "What should a child know before starting CVC words?",
        answer: "The individual letter sounds involved should already feel comfortable, since CVC words depend on blending sounds a child already knows.",
      },
    ],
    relatedArticleSlugs: ["when-should-kids-learn-letter-sounds", "how-to-practice-phonics-at-home"],
    relatedLinks: [
      { label: "CVC Words phonics lessons", href: "/phonics/cvc-words" },
      { label: "Blending lessons", href: "/phonics/blending" },
      { label: "Letter Sounds lessons", href: "/phonics/letter-sounds" },
      { label: "CVC word worksheets", href: "/worksheets/cvc-words" },
    ],
  },
  {
    slug: "fun-abc-games-for-kids",
    title: "Fun ABC Games for Kids",
    excerpt: "Simple games that turn alphabet practice into play.",
    categorySlug: "learning-activities",
    author: "AlphaBes Team",
    publishedAt: "2026-02-23",
    sections: [
      {
        heading: "Give Practice a Reason to Happen",
        paragraphs: [
          "Games give repetitive alphabet practice a reason to happen without feeling like a chore. Simple options like \"I Spy\" with letters, matching games with letter cards, or racing to find a called-out letter all work well with minimal setup.",
        ],
      },
      {
        heading: "Add Movement",
        paragraphs: [
          "Movement-based games — like hopping to a letter taped on the floor, or forming letter shapes with your whole body — combine physical activity with letter recognition, which can help energetic kids stay engaged longer.",
        ],
      },
      {
        heading: "Keep It Fresh",
        paragraphs: [
          "Rotating between a few different games, rather than playing the same one every time, keeps practice feeling fresh and gives a child multiple ways to encounter the same letters and sounds.",
        ],
      },
    ],
    faq: [],
    relatedArticleSlugs: ["alphabet-activities-for-kindergarten", "how-to-teach-the-alphabet-to-preschoolers"],
    relatedLinks: [
      { label: "Browse all games", href: "/games" },
      { label: "Match Letter and Picture game", href: "/games/match-letter-picture" },
      { label: "Alphabet Quiz game", href: "/games/alphabet-quiz" },
    ],
  },
  {
    slug: "how-to-choose-the-right-alphabet-worksheets",
    title: "How to Choose the Right Alphabet Worksheets",
    excerpt: "A practical guide to picking tracing, recognition, or phonics worksheets that match where your child actually is.",
    categorySlug: "worksheets",
    author: "AlphaBes Team",
    publishedAt: "2026-09-11",
    sections: [
      {
        heading: "Start With the Skill, Not the Grade Level",
        paragraphs: [
          "Worksheets are usually organized by activity type — tracing, coloring, matching, beginning sounds — rather than by age, since two children the same age can be at very different stages. Picking a worksheet that matches the specific skill a child is working on matters more than matching it to a grade label.",
        ],
      },
      {
        heading: "Match the Worksheet to Where a Child Struggles",
        paragraphs: [
          "If a child can already recognize a letter but struggles to write it, a tracing or handwriting worksheet is more useful than another recognition page. If the reverse is true, recognition or matching worksheets close that gap faster than jumping straight to writing.",
        ],
      },
      {
        heading: "Rotate Instead of Repeating One Type",
        paragraphs: [
          "Working through every worksheet of one type before trying another can get repetitive fast. Mixing tracing, coloring, and matching pages for the same letter keeps a session more engaging while still reinforcing the same letter from a few angles.",
        ],
      },
    ],
    faq: [
      {
        question: "Are AlphaBes worksheets free?",
        answer: "Yes — the full library of 260+ letter worksheets, plus dozens of number, shape, and word worksheets, are free to preview, print, and download. A Pro plan adds printable bundles and progress tracking.",
      },
      {
        question: "What worksheet type should a child start with?",
        answer: "Letter recognition and tracing are usually the first two types most children use, since neither requires writing independently yet.",
      },
    ],
    relatedArticleSlugs: ["best-ways-to-teach-letter-recognition", "alphabet-activities-for-kindergarten"],
    relatedLinks: [
      { label: "Browse All Worksheets", href: "/worksheets" },
      { label: "Letter Tracing Worksheets", href: "/worksheets/letter-tracing" },
      { label: "Letter Recognition Worksheets", href: "/worksheets/letter-recognition" },
    ],
  },
  {
    // Demonstrates the standard "activity article" section pattern used by
    // most of the 30-article editorial plan: Introduction, What Children
    // Learn, Materials Needed, Step-by-Step Activity, Variations, Tips,
    // Common Mistakes, Conclusion -- see the ADMIN NOTE below.
    slug: "letter-a-activities-for-preschoolers",
    title: "Letter A Activities for Preschoolers",
    excerpt: "Five simple, no-prep activities for practicing the letter A at home or in the classroom.",
    categorySlug: "preschool-activities",
    author: "AlphaBes Team",
    publishedAt: "2026-09-11",
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Letter A is often the very first letter children practice, both because it starts the alphabet and because so many familiar words — apple, ant, airplane — begin with it. These five simple activities give a child several different ways to work with the letter A in one sitting, without needing any special materials.",
        ],
      },
      {
        heading: "What Children Learn",
        paragraphs: [
          "These activities build three skills at once: recognizing the shape of uppercase A and lowercase a, connecting the letter to its short \"a\" sound, and practicing the fine motor control needed to eventually write it.",
        ],
      },
      {
        heading: "Materials Needed",
        paragraphs: [
          "A pencil or crayon, a printed Letter A tracing worksheet, and a few small household objects that start with A (an apple, an action figure, anything on hand) — no special supplies required.",
        ],
      },
      {
        heading: "Step-by-Step Activity",
        paragraphs: [
          "Say the letter name and its sound together: \"A, /æ/, like apple.\" Trace the uppercase A and lowercase a on a tracing worksheet, saying the sound out loud with each stroke. Go on a 30-second \"A hunt\" around the room, collecting or pointing at anything that starts with A. Sort what was found into \"starts with A\" and \"doesn't start with A\" if the child collected a mix. Finish by writing the letter A independently, without the dotted guide, to check how much stuck.",
        ],
      },
      {
        heading: "Variations",
        paragraphs: [
          "For a child who already knows the letter well, skip straight to independent writing and add a simple phrase like \"A is for apple\" to copy. For a child who's just starting out, skip the independent-writing step and repeat the tracing and hunting steps instead.",
        ],
      },
      {
        heading: "Tips for Parents and Teachers",
        paragraphs: [
          "Keep the whole activity under ten minutes — preschool attention spans are short, and a shorter, positive session beats a longer one that ends in frustration. It's fine to spread the five steps across a few days instead of doing them all at once.",
        ],
      },
      {
        heading: "Common Mistakes",
        paragraphs: [
          "A common misstep is correcting every wobbly line during tracing. At this stage, the goal is practicing the motion and the sound, not producing a perfect letter — accuracy improves with repetition, not correction.",
        ],
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "Letter A is a natural starting point precisely because it's the first letter most children encounter formally, but the same five steps — say it, trace it, hunt for it, sort it, write it — work for any letter once a child is ready to move on.",
        ],
      },
    ],
    faq: [
      {
        question: "How long should a Letter A activity session take?",
        answer: "About five to ten minutes is plenty for most preschoolers. Shorter, more frequent sessions build skills better than one long session.",
      },
      {
        question: "What if my child already knows the letter A?",
        answer: "Move straight to the independent-writing step and add a simple word or short phrase to copy, so the activity still offers a challenge.",
      },
    ],
    relatedArticleSlugs: ["how-to-teach-the-alphabet-to-preschoolers", "best-ways-to-teach-letter-recognition"],
    relatedLinks: [
      { label: "Letter A lesson page", href: "/alphabet/a" },
      { label: "Letter A Tracing Worksheet", href: "/worksheets/letter-a-tracing" },
      { label: "Preschool Learning Hub", href: "/preschool" },
    ],
  },
];

// Fails fast at build/dev time if a future article or category slug
// collides with the other set, since both live under /blog/{slug}.
const categorySlugSet = new Set(blogCategories.map((c) => c.slug));
blogPosts.forEach((p) => {
  if (categorySlugSet.has(p.slug)) {
    throw new Error(`Blog article slug "${p.slug}" collides with a blog category slug.`);
  }
});

export function getBlogCategory(slug: string): BlogCategory | null {
  return blogCategories.find((c) => c.slug === slug) ?? null;
}

export function getBlogPost(slug: string): BlogPost | null {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return blogPosts.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const manual = post.relatedArticleSlugs
    .map((slug) => getBlogPost(slug))
    .filter((p): p is BlogPost => p !== null && p.slug !== post.slug);

  if (manual.length >= limit) return manual.slice(0, limit);

  const sameCategory = getPostsByCategory(post.categorySlug).filter(
    (p) => p.slug !== post.slug && !manual.some((m) => m.slug === p.slug)
  );

  return [...manual, ...sameCategory].slice(0, limit);
}

// ADMIN NOTE -- how to add a new article:
// 1. Pick an existing categorySlug from `blogCategories` above (or add a
//    new category object first if it's genuinely a new topic bucket).
// 2. Add a new object to `blogPosts` with a unique `slug`. `sections` is an
//    array of { heading, paragraphs }: each heading becomes an H2 and an
//    entry in the article's auto-generated table of contents.
// 3. `faq` is optional -- leave it as `[]` unless there's a genuine,
//    non-redundant Q&A worth surfacing (it renders visibly and feeds
//    FAQPage schema only when non-empty).
// 4. `relatedArticleSlugs` lets you hand-pick related reading; if you leave
//    it short, `getRelatedPosts` backfills with other articles in the same
//    category automatically.
// 5. `relatedLinks` should point at real, already-existing AlphaBes routes
//    (a letter page, a worksheet category, a phonics skill, etc).
// 6. That's it -- no route file, sitemap entry, or component needs to
//    change. `/blog/{slug}` and the sitemap pick up the new article
//    automatically because they're all derived from this array.
//
// Two recommended `sections` patterns (both use the same generic shape --
// pick whichever fits the article, and skip headings that don't apply):
//   - Guide/advice articles (e.g. "when-should-kids-learn-letter-sounds"):
//     a few sections, each just a short original explanation.
//   - Activity articles (e.g. "letter-a-activities-for-preschoolers"):
//     Introduction, What Children Learn, Materials Needed, Step-by-Step
//     Activity, Variations, Tips for Parents and Teachers, Common
//     Mistakes, Conclusion. This is the pattern most of the 30-article
//     editorial plan should follow, since most of those titles are
//     activity-shaped ("Letter B Activities for Preschoolers", "Beginning
//     Sounds Activities", etc).
