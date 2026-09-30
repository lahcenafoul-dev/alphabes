// The stories, in both languages. Used by prisma/seed-stories.ts (which
// writes them to the database) and scripts/tts-histoires.ts (which makes
// the French audio). Pure data, no imports.
//
// Each story has one picture per page (components/StoryIllustration.tsx,
// by scene name). The French stories are written in French for the same
// pictures, not translated: simple present-tense sentences a child in
// grande section or CP can follow, and read.

export type SeedPage = { pageNumber: number; text: string; scene: string };

export type SeedStory = {
  slug: string;
  locale: "EN" | "FR";
  /** Same tale, same pictures, in the other language. */
  translationGroup: string;
  title: string;
  ageRangeMin: number;
  ageRangeMax: number;
  order: number;
  coverScene: string;
  pages: SeedPage[];
};

const pages = (scene: string, texts: string[]): SeedPage[] =>
  texts.map((text, i) => ({ pageNumber: i + 1, text, scene: `${scene}-${i + 1}` }));

export const englishStories: SeedStory[] = [
  {
    slug: "the-little-apple",
    locale: "EN",
    translationGroup: "apple",
    title: "The Little Apple",
    ageRangeMin: 3,
    ageRangeMax: 5,
    order: 1,
    coverScene: "apple-1",
    pages: pages("apple", [
      "Once upon a time, there was a little red apple.",
      "The apple grew on a tall, tall tree.",
      "One day, the wind blew softly and the apple fell.",
      "A little girl picked it up and smiled.",
      "She said, 'Thank you, apple tree!' The end.",
    ]),
  },
  {
    slug: "brave-little-bear",
    locale: "EN",
    translationGroup: "bear",
    title: "The Brave Little Bear",
    ageRangeMin: 3,
    ageRangeMax: 6,
    order: 2,
    coverScene: "bear-1",
    pages: pages("bear", [
      "In a cozy forest, there lived a small bear named Boo.",
      "Boo was scared of the dark, deep woods.",
      "One night, Boo heard his friend calling for help.",
      "Boo took a deep breath and walked into the dark.",
      "He found his friend and they became best friends forever. The end.",
    ]),
  },
  {
    slug: "the-curious-cat",
    locale: "EN",
    translationGroup: "cat",
    title: "The Curious Cat",
    ageRangeMin: 4,
    ageRangeMax: 7,
    order: 3,
    coverScene: "cat-1",
    pages: pages("cat", [
      "Milo the cat loved to explore new places.",
      "One day, he found a mysterious box in the garden.",
      "Inside the box was a ball of soft, colorful yarn.",
      "Milo played with the yarn all afternoon.",
      "That night, he curled up happy and sleepy. The end.",
    ]),
  },
  {
    slug: "the-little-dog",
    locale: "EN",
    translationGroup: "dog",
    title: "The Little Dog",
    ageRangeMin: 3,
    ageRangeMax: 6,
    order: 4,
    coverScene: "dog-1",
    pages: pages("dog", [
      "Rex the dog loved to play in the park.",
      "One day, his ball rolled far away.",
      "Rex ran fast to find it.",
      "He looked under a big tree.",
      "There it was! Rex was so happy.",
    ]),
  },
  {
    slug: "the-shy-duck",
    locale: "EN",
    translationGroup: "duck",
    title: "The Shy Duck",
    ageRangeMin: 3,
    ageRangeMax: 5,
    order: 5,
    coverScene: "duck-1",
    pages: pages("duck", [
      "Daisy the duck lived by a calm pond.",
      "She was too shy to swim with the others.",
      "A little frog said, 'Come swim with me!'",
      "Daisy took a deep breath and jumped in.",
      "She had so much fun, she wasn't shy anymore.",
    ]),
  },
  {
    slug: "the-happy-fish",
    locale: "EN",
    translationGroup: "fish",
    title: "The Happy Fish",
    ageRangeMin: 3,
    ageRangeMax: 5,
    order: 6,
    coverScene: "fish-1",
    pages: pages("fish", [
      "Finn the fish lived in a coral reef.",
      "He loved to swim in circles all day.",
      "One day he met a new friend, a little crab.",
      "They played hide and seek in the coral.",
      "Finn was happy to have a new best friend.",
    ]),
  },
  {
    slug: "the-wise-owl",
    locale: "EN",
    translationGroup: "owl",
    title: "The Wise Owl",
    ageRangeMin: 4,
    ageRangeMax: 7,
    order: 7,
    coverScene: "owl-1",
    pages: pages("owl", [
      "Ollie the owl lived high in an old tree.",
      "Every night he watched the stars come out.",
      "A little mouse asked Ollie for help finding his way home.",
      "Ollie flew low and showed him the path.",
      "The mouse thanked Ollie, the wisest friend in the forest.",
    ]),
  },
  {
    slug: "the-lions-nap",
    locale: "EN",
    translationGroup: "lion",
    title: "The Lion's Nap",
    ageRangeMin: 3,
    ageRangeMax: 6,
    order: 8,
    coverScene: "lion-1",
    pages: pages("lion", [
      "Leo the lion loved to nap under the sun.",
      "But the little birds were too noisy to sleep.",
      "Leo asked them kindly to sing somewhere else.",
      "The birds found a new tree far away.",
      "Leo finally had a peaceful, happy nap.",
    ]),
  },
];

export const frenchStories: SeedStory[] = [
  {
    slug: "la-petite-pomme",
    locale: "FR",
    translationGroup: "apple",
    title: "La petite pomme",
    ageRangeMin: 3,
    ageRangeMax: 5,
    order: 1,
    coverScene: "apple-1",
    pages: pages("apple", [
      "Il était une fois une petite pomme rouge, toute ronde.",
      "Elle pousse en haut d'un grand, grand pommier.",
      "Un jour, le vent souffle… et hop ! La pomme tombe dans l'herbe.",
      "Lina la ramasse et sourit : « Quelle belle pomme ! »",
      "« Merci, le pommier ! » dit Lina. Et elle croque la pomme.",
    ]),
  },
  {
    slug: "titou-l-ourson-courageux",
    locale: "FR",
    translationGroup: "bear",
    title: "Titou, l'ourson courageux",
    ageRangeMin: 3,
    ageRangeMax: 6,
    order: 2,
    coverScene: "bear-1",
    pages: pages("bear", [
      "Dans une jolie forêt vit un petit ours. Il s'appelle Titou.",
      "Titou a peur du noir. La nuit, les bois sont si sombres !",
      "Un soir, il entend un cri : « Au secours ! » C'est Bruno, son ami.",
      "Titou respire très fort. Puis il part dans la nuit, sans reculer.",
      "Il retrouve Bruno. Depuis ce jour, les deux amis ne se quittent plus.",
    ]),
  },
  {
    slug: "moustache-le-chat-curieux",
    locale: "FR",
    translationGroup: "cat",
    title: "Moustache, le chat curieux",
    ageRangeMin: 4,
    ageRangeMax: 7,
    order: 3,
    coverScene: "cat-1",
    pages: pages("cat", [
      "Moustache est un chat qui adore tout explorer.",
      "Un matin, dans le jardin, il trouve une drôle de boîte.",
      "Dans la boîte, il y a une pelote de laine, douce et colorée.",
      "Moustache joue avec la pelote tout l'après-midi. Elle roule, roule, roule !",
      "Le soir, il se roule en boule, fatigué et content. Bonne nuit, Moustache !",
    ]),
  },
  {
    slug: "filou-et-sa-balle",
    locale: "FR",
    translationGroup: "dog",
    title: "Filou et sa balle",
    ageRangeMin: 3,
    ageRangeMax: 6,
    order: 4,
    coverScene: "dog-1",
    pages: pages("dog", [
      "Filou le chien adore jouer au parc.",
      "Un jour, sa balle roule très loin.",
      "Filou court vite, vite, vite pour la rattraper.",
      "Il regarde sous un grand arbre.",
      "La voilà ! Filou remue la queue : il est si content !",
    ]),
  },
  {
    slug: "coline-la-cane-timide",
    locale: "FR",
    translationGroup: "duck",
    title: "Coline, la cane timide",
    ageRangeMin: 3,
    ageRangeMax: 5,
    order: 5,
    coverScene: "duck-1",
    pages: pages("duck", [
      "Coline la cane vit au bord d'une mare tranquille.",
      "Elle est trop timide pour nager avec les autres.",
      "Une petite grenouille lui dit : « Viens nager avec moi ! »",
      "Coline prend son courage… et plouf ! Elle saute dans l'eau.",
      "Elle s'amuse tellement qu'elle n'est plus timide du tout.",
    ]),
  },
  {
    slug: "pilou-le-poisson",
    locale: "FR",
    translationGroup: "fish",
    title: "Pilou le poisson",
    ageRangeMin: 3,
    ageRangeMax: 5,
    order: 6,
    coverScene: "fish-1",
    pages: pages("fish", [
      "Pilou le poisson habite dans les coraux.",
      "Toute la journée, il nage en rond, en rond, en rond.",
      "Un jour, il rencontre un nouvel ami : un petit crabe.",
      "Ils jouent à cache-cache dans les coraux.",
      "Pilou est heureux : il a un meilleur ami !",
    ]),
  },
  {
    slug: "hugo-le-hibou",
    locale: "FR",
    translationGroup: "owl",
    title: "Hugo le hibou",
    ageRangeMin: 4,
    ageRangeMax: 7,
    order: 7,
    coverScene: "owl-1",
    pages: pages("owl", [
      "Hugo le hibou habite tout en haut d'un vieil arbre.",
      "Chaque nuit, il regarde les étoiles s'allumer.",
      "Une petite souris lui demande : « Hugo, peux-tu m'aider ? Je ne trouve plus ma maison. »",
      "Hugo vole tout bas et lui montre le chemin.",
      "« Merci, Hugo ! » dit la souris. Hugo est le plus sage de la forêt.",
    ]),
  },
  {
    slug: "la-sieste-de-leon",
    locale: "FR",
    translationGroup: "lion",
    title: "La sieste de Léon",
    ageRangeMin: 3,
    ageRangeMax: 6,
    order: 8,
    coverScene: "lion-1",
    pages: pages("lion", [
      "Léon le lion adore faire la sieste au soleil.",
      "Mais les petits oiseaux chantent trop fort. Impossible de dormir !",
      "Léon leur demande gentiment : « Pouvez-vous chanter un peu plus loin ? »",
      "Les oiseaux trouvent un autre arbre, loin, très loin.",
      "Léon peut enfin dormir. Chut… il fait une longue sieste !",
    ]),
  },
];

export const allStories: SeedStory[] = [...englishStories, ...frenchStories];

/** Where a French page's audio file goes (scripts/tts-histoires.ts writes it). */
export const frenchAudioPath = (slug: string, pageNumber: number) => `/audio/histoires/${slug}-${pageNumber}.mp3`;
