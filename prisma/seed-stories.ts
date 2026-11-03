import { existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { allStories } from "./stories-data";
import { storyAudioPath, type StoryAudioLocale } from "../lib/story-audio";

const prisma = new PrismaClient();

// Writes the stories (prisma/stories-data.ts) to the database: stories and
// pages are upserted by slug and page number, so ids stay the same and
// children's progress (StoryProgress) is never touched. Pages past a story's
// last page are removed; nothing else is deleted.
//
// A picture is used once its file exists in public/ (npm run stories:images);
// until then the page shows its old drawn scene, or the open book.
const inPublic = (path: string) => existsSync(join(process.cwd(), "public", path));
const picture = (path: string, fallback: string | null) => (inPublic(path) ? path : fallback);

// A page's audioUrl records its narration MP3 once the file exists
// (npm run stories:audio). The reader finds the file from lib/story-audio.ts
// itself and falls back to the browser's voice, so this is informational.
function audioUrlFor(locale: "EN" | "FR" | "ES" | "PT", slug: string, pageNumber: number): string | null {
  const path = storyAudioPath(locale.toLowerCase() as StoryAudioLocale, slug, pageNumber);
  return inPublic(path) ? path : null;
}

async function main() {
  let missing = 0;
  for (const story of allStories) {
    const fields = {
      title: story.title,
      ageRangeMin: story.ageRangeMin,
      ageRangeMax: story.ageRangeMax,
      order: story.order,
      coverUrl: picture(story.cover, story.coverFallbackScene),
      locale: story.locale,
      translationGroup: story.translationGroup,
    };
    const created = await prisma.story.upsert({
      where: { slug: story.slug },
      update: fields,
      create: { slug: story.slug, ...fields },
    });

    for (const page of story.pages) {
      if (!inPublic(page.image)) missing++;
      const data = {
        text: page.text,
        imageUrl: picture(page.image, page.fallbackScene),
        audioUrl: audioUrlFor(story.locale, story.slug, page.pageNumber),
      };
      await prisma.storyPage.upsert({
        where: { storyId_pageNumber: { storyId: created.id, pageNumber: page.pageNumber } },
        update: data,
        create: { storyId: created.id, pageNumber: page.pageNumber, ...data },
      });
    }
    await prisma.storyPage.deleteMany({ where: { storyId: created.id, pageNumber: { gt: story.pages.length } } });

    console.log(`Seeded: ${story.title} (${story.locale}, ${story.pages.length} pages)`);
  }
  console.log(`${allStories.length} stories seeded; ${missing} page pictures missing (shown as drawn scenes).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
