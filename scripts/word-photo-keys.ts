// Every word-picture key the site shows: the `picture` keys of the French,
// Spanish and Portuguese data, plus the English example words and alphabet
// chart words (lib/picture-key.ts). Used by tests/word-pictures.test.ts and,
// through `npx tsx scripts/word-photo-keys.ts` (prints JSON), by
// scripts/fetch-word-photos.mjs.
import { readFileSync, readdirSync } from "fs";
import path from "path";
import { alphabetData } from "../lib/alphabet-data";
import { getAllLetterSlugs, getLetterContent } from "../lib/letters-data";
import { pictureKey } from "../lib/picture-key";

/** `picture: "apple"` fields and the third argument of the w()/yes()/no() word helpers. */
export function dataPictureKeys() {
  const lib = path.resolve(__dirname, "../lib");
  const keys = new Set<string>();
  for (const file of readdirSync(lib).filter((f) => f.endsWith(".ts"))) {
    const source = readFileSync(path.join(lib, file), "utf8");
    for (const m of source.matchAll(/\bpicture: "([^"]+)"/g)) keys.add(m[1]);
    for (const m of source.matchAll(/\b(?:w|yes|no)\(\s*"[^"]*",\s*"[^"]*",\s*"([^"]+)"\)/g)) keys.add(m[1]);
  }
  return [...keys];
}

export function englishWords() {
  return [
    ...getAllLetterSlugs().flatMap((l) => getLetterContent(l)!.exampleWords.map((w) => w.word)),
    ...alphabetData.map((l) => l.word),
  ];
}

export function allPictureKeys() {
  return [...new Set([...dataPictureKeys(), ...englishWords().map(pictureKey)])].sort();
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  process.stdout.write(JSON.stringify(allPictureKeys()));
}
