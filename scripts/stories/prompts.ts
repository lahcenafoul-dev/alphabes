// Writes the Canva prompts for the story pictures and the list of pictures
// still missing, both into ../owl-design/stories/ (outside the repo):
//
//   npm run stories:prompts            prompts.md and images/MISSING.txt
//   npm run stories:prompts -- --missing   only images/MISSING.txt
//
// Every prompt starts with the shared style line and the fixed descriptions of
// the characters the scene names (scripts/stories/characters.ts), then the
// scene from prisma/stories-v2.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { storiesV2 } from "../../prisma/stories-v2";
import { CHILDREN, SUPPORTING, charactersIn, type Character } from "./characters";

const OUT = path.resolve(__dirname, "../../../owl-design/stories");
const IMAGES = path.join(OUT, "images");

export const STYLE =
  "Glossy cute cartoon illustration for a young children's picture book, soft 3D shading with gentle shiny highlights, smooth rounded shapes, clean dark-brown outlines, bright friendly colours, warm and cosy mood, never scary, no text, no letters, no words.";
const SHEET_END = "Full body, standing, facing the viewer at a slight three-quarter angle, happy friendly expression. Plain pure white background, no shadow, no scenery. Square 1:1.";
const SHEET_END_SWIM = SHEET_END.replace("standing, facing the viewer at a slight three-quarter angle", "swimming, side view");
const PAGE_END =
  "Landscape 4:3, full background scene. Keep the bottom fifth of the picture calm and simple, with no important details there, because the story text goes below the picture. No text, no letters, no words anywhere in the picture.";
const COVER_END =
  "Book cover picture: the main characters large and clear in the centre. Landscape 4:3, full background scene. No text, no title, no letters, no words anywhere in the picture.";

const sheetPrompt = (c: Character) => `${STYLE} Character sheet. ${c.description}. ${c.swims ? SHEET_END_SWIM : SHEET_END}`;
const scenePrompt = (scene: string, end: string) => {
  const cast = charactersIn(scene).map((c) => `${c.description}.`).join(" ");
  return [STYLE, cast, scene, end].filter(Boolean).join(" ");
};

type Picture = { file: string; prompt: string };

function pictures(): { sheets: Picture[]; stories: { title: string; group: string; level: number; pics: Picture[] }[] } {
  const sheets = [...CHILDREN, ...SUPPORTING].map((c) => ({ file: `characters/${c.id}.png`, prompt: sheetPrompt(c) }));
  const stories = storiesV2.map((s) => ({
    title: s.text.EN.title,
    group: s.group,
    level: s.level,
    pics: [
      { file: `${s.group}/cover.png`, prompt: scenePrompt(s.cover, COVER_END) },
      ...s.scenes.map((scene, i) => ({ file: `${s.group}/p${i + 1}.png`, prompt: scenePrompt(scene, PAGE_END) })),
    ],
  }));
  return { sheets, stories };
}

function writeMissing(all: Picture[]): number {
  const missing = all.filter((p) => !existsSync(path.join(IMAGES, p.file))).map((p) => p.file);
  mkdirSync(IMAGES, { recursive: true });
  const head = [
    `Story pictures still missing: ${missing.length} of ${all.length}.`,
    `Paths are relative to this folder (owl-design/stories/images/). Regenerate this list with: npm run stories:prompts -- --missing`,
    "",
  ];
  writeFileSync(path.join(IMAGES, "MISSING.txt"), [...head, ...missing, ""].join("\n"));
  return missing.length;
}

function writePrompts({ sheets, stories }: ReturnType<typeof pictures>) {
  const lines: string[] = [
    "# Story illustrations: Canva prompts",
    "",
    "Made by `npm run stories:prompts` from `prisma/stories-v2` and `scripts/stories/characters.ts` in the lphbes repo. Don't edit this file by hand: change the scene or the character there and run the script again.",
    "",
    "## How to make them",
    "",
    "1. **Make the character sheets first** (square 1:1, plain white background). Generate again until each one looks right; use it as the reference picture for that character's pages if Canva allows it.",
    "2. **Then make each story's cover and pages** (landscape 4:3). Every prompt already contains the style line and the word-for-word description of each character in the picture.",
    "3. **Save each picture as PNG under the exact name given**, inside `owl-design/stories/images/`. The same picture is used in English, French, Spanish and Portuguese.",
    "4. **`images/MISSING.txt`** lists what is still to make. Ask for it to be regenerated, or run `npm run stories:prompts -- --missing`.",
    "",
    "Sizes next to each other: Pepper is the smallest, then Finn, Daisy, Hazel, Juno, Milo, Bibi (without ears), Tess, Rex, Ollie, Leo, and Boo is the biggest of the children. The grown-ups are about twice the size of their child.",
    "",
    "Shared style line (already in every prompt):",
    "",
    `> ${STYLE}`,
    "",
    `## Character sheets (${sheets.length})`,
    "",
  ];
  for (const p of sheets) lines.push(`**→ \`images/${p.file}\`**`, "", "```text", p.prompt, "```", "");
  for (const [i, s] of stories.entries()) {
    lines.push(`## ${i + 1}. ${s.title} · level ${s.level} · \`${s.group}\` (${s.pics.length} pictures)`, "");
    for (const p of s.pics) lines.push(`**→ \`images/${p.file}\`**`, "", "```text", p.prompt, "```", "");
  }
  writeFileSync(path.join(OUT, "prompts.md"), lines.join("\n"));
}

const all = pictures();
const flat = [...all.sheets, ...all.stories.flatMap((s) => s.pics)];
if (!process.argv.includes("--missing")) writePrompts(all);
const missing = writeMissing(flat);
console.log(`${flat.length} pictures (${all.sheets.length} character sheets, ${flat.length - all.sheets.length} covers and pages); ${missing} missing.`);
