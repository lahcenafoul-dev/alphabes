import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StoryIllustration from "@/components/StoryIllustration";
export const metadata = {
  title: "Story Time",
};

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <nav className="text-sm text-chalkboard/60">
        <Link href="/">Home</Link>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">Story Time</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Pick a story to read together. Each one comes with pictures and fun words to learn.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/stories/${story.slug}`}
            className="rounded-block border border-chalkboard/10 shadow-block overflow-hidden hover:shadow-lg transition"
          >
           <StoryIllustration scene={story.coverUrl} />
            <div className="p-4">
              <h2 className="font-display font-bold text-lg">{story.title}</h2>
              <p className="mt-1 text-sm text-chalkboard/60">
                Ages {story.ageRangeMin}-{story.ageRangeMax}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}