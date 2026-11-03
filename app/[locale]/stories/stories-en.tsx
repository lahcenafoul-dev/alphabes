import type { Metadata } from "next";
import Link from "next/link";
import StoryShelf from "@/components/stories/StoryShelf";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";

const description =
  "24 short illustrated stories for children aged 3 to 8, in three reading levels, to read together or listen to: friends, feelings, counting, letters and bedtime.";

export const storiesMetadataEn: Metadata = {
  title: "Story Time",
  description,
  alternates: alternatesFor("en", "/stories"),
  openGraph: { title: "Story Time", description, url: absoluteUrl("en", "/stories") },
};

export default function StoriesEn() {
  return (
    <div className="bg-owl-bg text-owl-ink">
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-owl-muted">
          <ol className="flex gap-2">
            <li><Link href="/" className="hover:text-owl-purple">Home</Link> /</li>
            <li aria-current="page" className="font-bold text-owl-ink">Story Time</li>
          </ol>
        </nav>

        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Short Stories for Kids</h1>
        <p className="mt-4 max-w-3xl text-lg text-owl-muted">
          Pick a story to read together. Every page has its own picture and can be read aloud. Level 1 is for the
          youngest listeners, and level 3 has longer stories for children who are starting to read on their own.
        </p>

        <StoryShelf locale="en" />
      </main>
    </div>
  );
}
