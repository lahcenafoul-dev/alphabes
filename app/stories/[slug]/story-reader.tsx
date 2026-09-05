"use client";

import { useState } from "react";

type Page = {
  id: string;
  pageNumber: number;
  text: string;
  imageUrl: string | null;
  audioUrl: string | null;
};

type Story = {
  id: string;
  slug: string;
  title: string;
  pages: Page[];
};

type Child = { id: string; firstName: string };

type Props = {
  story: Story;
  children: Child[];
};

export default function StoryReader({ story, children }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedChild, setSelectedChild] = useState(children[0]?.id ?? "");

  const page = story.pages[pageIndex];
  const isLast = pageIndex === story.pages.length - 1;
  const isFirst = pageIndex === 0;

  async function saveProgress(newIndex: number, completed: boolean) {
    if (!selectedChild) return;
    await fetch(`/api/stories/${story.slug}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: selectedChild,
        lastPageRead: newIndex + 1,
        completed,
      }),
    }).catch(() => {});
  }

  function goNext() {
    if (isLast) {
      saveProgress(pageIndex, true);
      return;
    }
    const next = pageIndex + 1;
    setPageIndex(next);
    saveProgress(next, false);
  }

  function goPrev() {
    if (isFirst) return;
    setPageIndex(pageIndex - 1);
  }

  return (
    <div className="mt-6">
      {children.length > 0 && (
        <div className="mb-4">
          <label htmlFor="child" className="text-sm font-bold">
            Reading as
          </label>
          <select
            id="child"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="ml-2 rounded-block border border-chalkboard/20 px-3 py-1"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="rounded-block border border-chalkboard/10 shadow-block overflow-hidden">
        {page.imageUrl && (
          <img
            src={page.imageUrl}
            alt=""
            className="w-full aspect-video object-cover"
          />
        )}
        <div className="p-8 text-center">
          <p className="text-2xl font-display">{page.text}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="rounded-block bg-crayon-blue text-white px-6 py-3 font-bold disabled:opacity-30"
        >
          ← Back
        </button>

        <span className="text-sm text-chalkboard/60">
          Page {pageIndex + 1} of {story.pages.length}
        </span>

        {isLast ? (
          <button
            onClick={() => saveProgress(pageIndex, true)}
            className="rounded-block bg-crayon-green text-white px-6 py-3 font-bold"
          >
            Finish 🎉
          </button>
        ) : (
          <button
            onClick={goNext}
            className="rounded-block bg-crayon-green text-white px-6 py-3 font-bold"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}