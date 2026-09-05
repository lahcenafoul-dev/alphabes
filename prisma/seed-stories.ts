import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function placeholderImg(text: string, color: string) {
  return `https://placehold.co/600x400/${color}/white?text=${encodeURIComponent(text)}`;
}

async function main() {
  const stories = [
    {
      slug: "the-little-apple",
      title: "The Little Apple",
      ageRangeMin: 3,
      ageRangeMax: 5,
      order: 1,
      coverUrl: placeholderImg("The Little Apple", "ef4444"),
      pages: [
        { pageNumber: 1, text: "Once upon a time, there was a little red apple.", imageUrl: placeholderImg("Little Apple", "ef4444") },
        { pageNumber: 2, text: "The apple grew on a tall, tall tree.", imageUrl: placeholderImg("Tall Tree", "22c55e") },
        { pageNumber: 3, text: "One day, the wind blew softly and the apple fell.", imageUrl: placeholderImg("Windy Day", "60a5fa") },
        { pageNumber: 4, text: "A little girl picked it up and smiled.", imageUrl: placeholderImg("Happy Girl", "fbbf24") },
        { pageNumber: 5, text: "She said, 'Thank you, apple tree!' The end.", imageUrl: placeholderImg("The End", "a855f7") },
      ],
    },
    {
      slug: "brave-little-bear",
      title: "The Brave Little Bear",
      ageRangeMin: 3,
      ageRangeMax: 6,
      order: 2,
      coverUrl: placeholderImg("Brave Little Bear", "92400e"),
      pages: [
        { pageNumber: 1, text: "In a cozy forest, there lived a small bear named Boo.", imageUrl: placeholderImg("Bear Boo", "92400e") },
        { pageNumber: 2, text: "Boo was scared of the dark, deep woods.", imageUrl: placeholderImg("Dark Woods", "1f2937") },
        { pageNumber: 3, text: "One night, Boo heard his friend calling for help.", imageUrl: placeholderImg("Calling for Help", "6366f1") },
        { pageNumber: 4, text: "Boo took a deep breath and walked into the dark.", imageUrl: placeholderImg("Being Brave", "0ea5e9") },
        { pageNumber: 5, text: "He found his friend and they became best friends forever. The end.", imageUrl: placeholderImg("Best Friends", "ec4899") },
      ],
    },
    {
      slug: "the-curious-cat",
      title: "The Curious Cat",
      ageRangeMin: 4,
      ageRangeMax: 7,
      order: 3,
      coverUrl: placeholderImg("The Curious Cat", "f97316"),
      pages: [
        { pageNumber: 1, text: "Milo the cat loved to explore new places.", imageUrl: placeholderImg("Milo the Cat", "f97316") },
        { pageNumber: 2, text: "One day, he found a mysterious box in the garden.", imageUrl: placeholderImg("Mystery Box", "84cc16") },
        { pageNumber: 3, text: "Inside the box was a ball of soft, colorful yarn.", imageUrl: placeholderImg("Yarn Ball", "d946ef") },
        { pageNumber: 4, text: "Milo played with the yarn all afternoon.", imageUrl: placeholderImg("Playtime", "14b8a6") },
        { pageNumber: 5, text: "That night, he curled up happy and sleepy. The end.", imageUrl: placeholderImg("Sleepy Time", "6366f1") },
      ],
    },
  ];

  for (const story of stories) {
    const created = await prisma.story.upsert({
      where: { slug: story.slug },
      update: { coverUrl: story.coverUrl },
      create: {
        slug: story.slug,
        title: story.title,
        ageRangeMin: story.ageRangeMin,
        ageRangeMax: story.ageRangeMax,
        order: story.order,
        coverUrl: story.coverUrl,
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
        update: { text: page.text, imageUrl: page.imageUrl },
        create: {
          storyId: created.id,
          pageNumber: page.pageNumber,
          text: page.text,
          imageUrl: page.imageUrl,
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