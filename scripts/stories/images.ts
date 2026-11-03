// Converts the story pictures (../owl-design/stories/images/<group>/cover.png,
// p1.png…, 1280×960) into the WebP files the site serves:
//
//   public/stories/<group>/<name>-1200.webp   reader and large cards
//   public/stories/<group>/<name>-640.webp    phones and listing cards
//   public/stories/<group>/og.jpg             1200×630 social image from the cover
//
//   npm run stories:images -- apple        one story (saves memory)
//   npm run stories:images -- --all        every story, one after the other
//   add --force to redo files that already exist
//
// One picture at a time, with sharp's cache off, so it runs in little memory.
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { storiesV2 } from "../../prisma/stories-v2";

const SRC = path.resolve(__dirname, "../../../owl-design/stories/images");
const OUT = path.resolve(__dirname, "../../public/stories");
export const STORY_IMAGE_WIDTHS = [1200, 640] as const;

sharp.cache(false);
sharp.concurrency(1);

const args = process.argv.slice(2);
const force = args.includes("--force");
const groups = args.includes("--all") ? storiesV2.map((s) => s.group) : args.filter((a) => !a.startsWith("--"));
if (groups.length === 0) {
  console.error("Name a story group (e.g. apple) or pass --all.");
  process.exit(1);
}

const fresh = (out: string, src: string) => !force && existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;

async function convertStory(group: string) {
  const story = storiesV2.find((s) => s.group === group);
  if (!story) throw new Error(`Unknown story group: ${group}`);
  const dir = path.join(OUT, group);
  mkdirSync(dir, { recursive: true });
  const names = ["cover", ...story.scenes.map((_, i) => `p${i + 1}`)];
  let made = 0;
  for (const name of names) {
    const src = path.join(SRC, group, `${name}.png`);
    if (!existsSync(src)) throw new Error(`Missing picture: ${group}/${name}.png`);
    for (const width of STORY_IMAGE_WIDTHS) {
      const out = path.join(dir, `${name}-${width}.webp`);
      if (fresh(out, src)) continue;
      await sharp(src).resize({ width }).webp({ quality: width > 1000 ? 78 : 74, effort: 5 }).toFile(out);
      made++;
    }
  }
  const cover = path.join(SRC, group, "cover.png");
  const og = path.join(dir, "og.jpg");
  if (!fresh(og, cover)) {
    await sharp(cover).resize({ width: 1200, height: 630, fit: "cover", position: "attention" }).jpeg({ quality: 80, mozjpeg: true }).toFile(og);
    made++;
  }
  console.log(`${group}: ${made} files written (${names.length} pictures)`);
}

(async () => {
  for (const group of groups) await convertStory(group);
})().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
