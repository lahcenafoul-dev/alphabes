import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { allStories } from "@/prisma/stories-data";
import { storyAudioPath, type StoryAudioLocale } from "@/lib/story-audio";
import { narration } from "@/app/[locale]/stories/[slug]/story-reader";

const fileFor = (url: string) => join(process.cwd(), "public", url);

// MPEG audio frame headers (Layer III only): enough to check the files are
// real mono MP3s and to add up their length without ffprobe.
const BITRATES: Record<number, number[]> = {
  // MPEG-1 Layer III
  3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  // MPEG-2 / 2.5 Layer III
  2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
};
const RATES: Record<number, number[]> = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

function mp3Info(buf: Buffer) {
  let i = 0;
  if (buf.subarray(0, 3).toString("latin1") === "ID3") {
    i = 10 + ((buf[6] << 21) | (buf[7] << 14) | (buf[8] << 7) | buf[9]);
  }
  let seconds = 0;
  let frames = 0;
  const bitrates = new Set<number>();
  let mono = true;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) {
      i++;
      continue;
    }
    const version = (buf[i + 1] >> 3) & 3; // 3 = MPEG-1, 2 = MPEG-2, 0 = MPEG-2.5
    const layer = (buf[i + 1] >> 1) & 3; // 1 = Layer III
    const bitrate = BITRATES[version === 3 ? 3 : 2]?.[buf[i + 2] >> 4];
    const rate = RATES[version]?.[(buf[i + 2] >> 2) & 3];
    if (version === 1 || layer !== 1 || !bitrate || !rate) {
      i++;
      continue;
    }
    const padding = (buf[i + 2] >> 1) & 1;
    const samples = version === 3 ? 1152 : 576;
    const size = Math.floor(((samples / 8) * bitrate * 1000) / rate) + padding;
    if (((buf[i + 3] >> 6) & 3) !== 3) mono = false;
    bitrates.add(bitrate);
    seconds += samples / rate;
    frames++;
    i += size;
  }
  return { seconds, frames, bitrates, mono };
}

const pages = allStories.flatMap((s) => {
  const locale = s.locale.toLowerCase() as StoryAudioLocale;
  return [0, ...s.pages.map((p) => p.pageNumber)].map((page) => ({ locale, slug: s.slug, page }));
});

describe("story narration (public/audio/stories/v2)", () => {
  it("has an MP3 for every cover title and page in every language", () => {
    expect(pages).toHaveLength(768);
    const missing = pages.map((p) => storyAudioPath(p.locale, p.slug, p.page)).filter((url) => !existsSync(fileFor(url)));
    expect(missing).toEqual([]);
  });

  it("has real mono 48 kbit/s audio that lasts long enough for its text", () => {
    for (const s of allStories) {
      const locale = s.locale.toLowerCase() as StoryAudioLocale;
      for (const [page, text] of [[0, s.title] as const, ...s.pages.map((p) => [p.pageNumber, p.text] as const)]) {
        const file = fileFor(storyAudioPath(locale, s.slug, page));
        const info = mp3Info(readFileSync(file));
        expect(info.frames, file).toBeGreaterThan(10);
        expect(info.mono, file).toBe(true);
        expect([...info.bitrates], file).toEqual([48]);
        // About 8 to 25 characters a second when read slowly.
        expect(info.seconds, file).toBeGreaterThan(Math.max(0.5, text.length / 25));
        expect(info.seconds, file).toBeLessThan(2 + text.length / 6);
        expect(statSync(file).size, file).toBeLessThan(200_000);
      }
    }
  });

  it("reads the title before the first page, then one file per page", () => {
    const story = { slug: "the-little-apple", title: "The Little Apple" };
    expect(narration(story, { pageNumber: 1, text: "Here is a little apple." }, "en")).toEqual([
      { url: "/audio/stories/v2/en/the-little-apple/0.mp3", text: "The Little Apple." },
      { url: "/audio/stories/v2/en/the-little-apple/1.mp3", text: "Here is a little apple." },
    ]);
    expect(narration({ slug: "la-petite-pomme", title: "Où est Titou ?" }, { pageNumber: 3, text: "Coucou !" }, "fr")).toEqual([
      { url: "/audio/stories/v2/fr/la-petite-pomme/3.mp3", text: "Coucou !" },
    ]);
  });
});
