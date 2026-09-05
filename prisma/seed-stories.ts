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