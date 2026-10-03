import { existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { allStories, frenchAudioPath } from "./stories-data";

const prisma = new PrismaClient();

// French pages get an audioUrl once their MP3 exists (scripts/tts-histoires.ts);
// until then the reader falls back to the browser's French voice. Spanish
// and Portuguese pages are read by the browser's voice (no recorded audio). English
// audio is found by scene name (components/AudioButton.tsx), as before.
function audioUrlFor(locale: "EN" | "FR" | "ES" | "PT", slug: string, pageNumber: number): string | null {
  if (locale !== "FR") return null;
  const path = frenchAudioPath(slug, pageNumber);
  return existsSync(join(process.cwd(), "public", path)) ? path : null;
}

async function main() {
  for (const story of allStories) {
    const fields = {
      title: story.title,
      ageRangeMin: story.ageRangeMin,
      ageRangeMax: story.ageRangeMax,
      order: story.order,
      coverUrl: story.coverScene,
      locale: story.locale,
      translationGroup: story.translationGroup,
    };
    const created = await prisma.story.upsert({
      where: { slug: story.slug },
      update: fields,
      create: { slug: story.slug, ...fields },
    });

    for (const page of story.pages) {
      // English pages keep whatever audioUrl they have.
      const audio = story.locale !== "EN" ? { audioUrl: audioUrlFor(story.locale, story.slug, page.pageNumber) } : {};
      await prisma.storyPage.upsert({
        where: {
          storyId_pageNumber: {
            storyId: created.id,
            pageNumber: page.pageNumber,
          },
        },
        update: { text: page.text, imageUrl: page.scene, ...audio },
        create: {
          storyId: created.id,
          pageNumber: page.pageNumber,
          text: page.text,
          imageUrl: page.scene,
          ...audio,
        },
      });
    }

    console.log(`Seeded: ${story.title} (${story.locale})`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
