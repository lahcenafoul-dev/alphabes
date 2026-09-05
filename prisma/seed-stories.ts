import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const stories = [
    {
      slug: "the-little-apple",
      title: "The Little Apple",
      ageRangeMin: 3,
      ageRangeMax: 5,
      order: 1,
      coverScene: "apple-1",
      pages: [
        { pageNumber: 1, text: "Once upon a time, there was a little red apple.", scene: "apple-1" },
        { pageNumber: 2, text: "The apple grew on a tall, tall tree.", scene: "apple-2" },
        { pageNumber: 3, text: "One day, the wind blew softly and the apple fell.", scene: "apple-3" },
        { pageNumber: 4, text: "A little girl picked it up and smiled.", scene: "apple-4" },
        { pageNumber: 5, text: "She said, 'Thank you, apple tree!' The end.", scene: "apple-5" },
      ],
    },
    {
      slug: "brave-little-bear",
      title: "The Brave Little Bear",
      ageRangeMin: 3,
      ageRangeMax: 6,
      order: 2,
      coverScene: "bear-1",
      pages: [
        { pageNumber: 1, text: "In a cozy forest, there lived a small bear named Boo.", scene: "bear-1" },
        { pageNumber: 2, text: "Boo was scared of the dark, deep woods.", scene: "bear-2" },
        { pageNumber: 3, text: "One night, Boo heard his friend calling for help.", scene: "bear-3" },
        { pageNumber: 4, text: "Boo took a deep breath and walked into the dark.", scene: "bear-4" },
        { pageNumber: 5, text: "He found his friend and they became best friends forever. The end.", scene: "bear-5" },
      ],
    },
    {
      slug: "the-curious-cat",
      title: "The Curious Cat",
      ageRangeMin: 4,
      ageRangeMax: 7,
      order: 3,
      coverScene: "cat-1",
      pages: [
        { pageNumber: 1, text: "Milo the cat loved to explore new places.", scene: "cat-1" },
        { pageNumber: 2, text: "One day, he found a mysterious box in the garden.", scene: "cat-2" },
        { pageNumber: 3, text: "Inside the box was a ball of soft, colorful yarn.", scene: "cat-3" },
        { pageNumber: 4, text: "Milo played with the yarn all afternoon.", scene: "cat-4" },
        { pageNumber: 5, text: "That night, he curled up happy and sleepy. The end.", scene: "cat-5" },
      ],
    },
    {
    slug: "the-little-dog",
    title: "The Little Dog",
    ageRangeMin: 3,
    ageRangeMax: 6,
    order: 4,
    coverScene: "dog-1",
    pages: [
      { pageNumber: 1, text: "Rex the dog loved to play in the park.", scene: "dog-1" },
      { pageNumber: 2, text: "One day, his ball rolled far away.", scene: "dog-2" },
      { pageNumber: 3, text: "Rex ran fast to find it.", scene: "dog-3" },
      { pageNumber: 4, text: "He looked under a big tree.", scene: "dog-4" },
      { pageNumber: 5, text: "There it was! Rex was so happy.", scene: "dog-5" },
    ],
  },
  {
    slug: "the-shy-duck",
    title: "The Shy Duck",
    ageRangeMin: 3,
    ageRangeMax: 5,
    order: 5,
    coverScene: "duck-1",
    pages: [
      { pageNumber: 1, text: "Daisy the duck lived by a calm pond.", scene: "duck-1" },
      { pageNumber: 2, text: "She was too shy to swim with the others.", scene: "duck-2" },
      { pageNumber: 3, text: "A little frog said, 'Come swim with me!'", scene: "duck-3" },
      { pageNumber: 4, text: "Daisy took a deep breath and jumped in.", scene: "duck-4" },
      { pageNumber: 5, text: "She had so much fun, she wasn't shy anymore.", scene: "duck-5" },
    ],
  },
  {
    slug: "the-happy-fish",
    title: "The Happy Fish",
    ageRangeMin: 3,
    ageRangeMax: 5,
    order: 6,
    coverScene: "fish-1",
    pages: [
      { pageNumber: 1, text: "Finn the fish lived in a coral reef.", scene: "fish-1" },
      { pageNumber: 2, text: "He loved to swim in circles all day.", scene: "fish-2" },
      { pageNumber: 3, text: "One day he met a new friend, a little crab.", scene: "fish-3" },
      { pageNumber: 4, text: "They played hide and seek in the coral.", scene: "fish-4" },
      { pageNumber: 5, text: "Finn was happy to have a new best friend.", scene: "fish-5" },
    ],
  },
  {
    slug: "the-wise-owl",
    title: "The Wise Owl",
    ageRangeMin: 4,
    ageRangeMax: 7,
    order: 7,
    coverScene: "owl-1",
    pages: [
      { pageNumber: 1, text: "Ollie the owl lived high in an old tree.", scene: "owl-1" },
      { pageNumber: 2, text: "Every night he watched the stars come out.", scene: "owl-2" },
      { pageNumber: 3, text: "A little mouse asked Ollie for help finding his way home.", scene: "owl-3" },
      { pageNumber: 4, text: "Ollie flew low and showed him the path.", scene: "owl-4" },
      { pageNumber: 5, text: "The mouse thanked Ollie, the wisest friend in the forest.", scene: "owl-5" },
    ],
  },
  {
    slug: "the-lions-nap",
    title: "The Lion's Nap",
    ageRangeMin: 3,
    ageRangeMax: 6,
    order: 8,
    coverScene: "lion-1",
    pages: [
      { pageNumber: 1, text: "Leo the lion loved to nap under the sun.", scene: "lion-1" },
      { pageNumber: 2, text: "But the little birds were too noisy to sleep.", scene: "lion-2" },
      { pageNumber: 3, text: "Leo asked them kindly to sing somewhere else.", scene: "lion-3" },
      { pageNumber: 4, text: "The birds found a new tree far away.", scene: "lion-4" },
      { pageNumber: 5, text: "Leo finally had a peaceful, happy nap.", scene: "lion-5" },
    ],
  },
  ];

  for (const story of stories) {
    const created = await prisma.story.upsert({
      where: { slug: story.slug },
      update: { coverUrl: story.coverScene },
      create: {
        slug: story.slug,
        title: story.title,
        ageRangeMin: story.ageRangeMin,
        ageRangeMax: story.ageRangeMax,
        order: story.order,
        coverUrl: story.coverScene,
      },
    });

    for (const page of story.pages) {
      await prisma.storyPage.upsert({
        where: {
          storyId_pageNumber: {
            storyId: created.id,
            pageNumber: page.pageNumber,
          },
        },
        update: { text: page.text, imageUrl: page.scene },
        create: {
          storyId: created.id,
          pageNumber: page.pageNumber,
          text: page.text,
          imageUrl: page.scene,
        },
      });
    }

    console.log(`Seeded: ${story.title}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });