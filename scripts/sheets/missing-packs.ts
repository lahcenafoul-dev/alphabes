// Prints the ids of the packs of one type whose PDFs (every part) aren't all
// built and in the manifest yet, for one language and paper; for the Mega
// pack, the numbers of its missing parts:
//   npx tsx scripts/sheets/missing-packs.ts <kind|mega> <locale> <paper>
// Used to resume a full build (docs/pro-packs.md).
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { PACKS, packFiles, packKey, type PackPaper } from "../../lib/sheets/packs";
import type { SheetLocale } from "../../lib/sheets/types";

const [kind, locale, paper] = process.argv.slice(2) as [string, SheetLocale, PackPaper];
const manifest = JSON.parse(readFileSync(join("lib", "sheets", "pack-manifest.json"), "utf8")) as Record<string, unknown>;
const missing = PACKS.filter((p) => p.kind === kind).filter((p) =>
  packFiles(p).some(({ part }) => {
    const key = packKey(locale, p, paper, part);
    return !manifest[key] || !existsSync(join("pro-files", key));
  }),
);
if (kind === "mega") {
  const mega = PACKS.find((p) => p.kind === "mega")!;
  const parts = packFiles(mega).filter(({ part }) => !manifest[packKey(locale, mega, paper, part)] || !existsSync(join("pro-files", packKey(locale, mega, paper, part))));
  console.log(parts.map(({ part }) => part).join(" "));
} else console.log(missing.map((p) => p.id).join(","));
