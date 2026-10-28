// Loads the photos a PDF worksheet shows (public/words/<key>.webp) in the
// browser, as JPEG data URLs for jsPDF. Await it before drawing: a photo that
// fails to load is left out and the template draws the line art instead.
import { pictureKey } from "../picture-key";
import { WORD_PHOTOS } from "../word-photos";
import type { WordPhotos } from "./icons";

async function jpeg(src: string): Promise<string> {
  const img = new Image();
  img.src = src;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export async function loadWordPhotos(words: string[]): Promise<WordPhotos> {
  const keys = [...new Set(words.map(pictureKey))].filter((k) => WORD_PHOTOS.has(k));
  const loaded = await Promise.all(keys.map((k) => jpeg(`/words/${k}.webp`).then((url) => [k, url] as const, () => null)));
  return Object.fromEntries(loaded.filter((e) => e !== null));
}
