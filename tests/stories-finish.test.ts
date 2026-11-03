import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { FinishedScreen, finishStory, saveProgress } from "@/app/[locale]/stories/[slug]/story-reader";

// The Finish button used to show "Great job!" only after a child's progress
// was saved, so signed-out visitors and parents with no child profile clicked
// Finish and nothing happened.
describe("story Finish", () => {
  it("shows the finished screen without saving when no child is selected", () => {
    const showFinished = vi.fn();
    const save = vi.fn();
    finishStory({ slug: "the-red-kite", childId: "", pageCount: 6, showFinished, save });
    expect(showFinished).toHaveBeenCalledOnce();
    expect(save).not.toHaveBeenCalled();
  });

  it("shows the finished screen first, then saves for the selected child", () => {
    const calls: string[] = [];
    const save = vi.fn(async () => void calls.push("save"));
    finishStory({ slug: "the-red-kite", childId: "c1", pageCount: 6, showFinished: () => calls.push("show"), save });
    expect(calls[0]).toBe("show");
    expect(save).toHaveBeenCalledWith({ slug: "the-red-kite", childId: "c1", lastPageRead: 6, completed: true });
  });

  it("still shows the finished screen when the save fails", async () => {
    const showFinished = vi.fn();
    const failing = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    finishStory({
      slug: "the-red-kite",
      childId: "c1",
      pageCount: 6,
      showFinished,
      save: (s) => saveProgress(s, failing),
    });
    expect(showFinished).toHaveBeenCalledOnce();
    await expect(saveProgress({ slug: "x", childId: "c1", lastPageRead: 1, completed: true }, failing)).resolves.toBe(false);
    errors.mockRestore();
  });

  it("offers More Stories and Sign Up to signed-out visitors", () => {
    const html = renderToStaticMarkup(createElement(FinishedScreen, { title: "The Red Kite", locale: "en", loggedIn: false }));
    expect(html).toContain("Great job!");
    expect(html).toContain('href="/stories"');
    expect(html).toContain('href="/register"');
    expect(html).toContain("Sign Up");
    expect(html).not.toContain("/dashboard");
  });

  it("offers the dashboard to signed-in parents", () => {
    const html = renderToStaticMarkup(createElement(FinishedScreen, { title: "The Red Kite", locale: "en", loggedIn: true }));
    expect(html).toContain('href="/dashboard"');
    expect(html).not.toContain("/register");
  });

  it("uses each language's paths and words", () => {
    const fr = renderToStaticMarkup(createElement(FinishedScreen, { title: "Le cerf-volant", locale: "fr", loggedIn: false }));
    expect(fr).toContain("Créer un compte");
    expect(fr).toContain('href="/fr/histoires"');
  });
});
