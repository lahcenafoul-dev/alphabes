// npm run assets:versions (also run by npm run build)
// Writes lib/asset-versions.json: a short content hash of every worksheet PDF
// and preview in public/, which lib/asset-versions.ts adds to their URLs
// ("?v=<hash>"). The files keep their names when they are regenerated and are
// cached for a day (public/_headers), so a new hash makes browsers fetch the
// new file at once. tests/seo/asset-versions.test.ts fails while it is stale.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const ASSET_DIRS = ["worksheets-pdf", "fiches-pdf", "fichas-pdf", "atividades-pdf"];
export const MANIFEST = join("lib", "asset-versions.json");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
}

/** { "/fiches-pdf/apercus/lettre-a-trace.jpg": "1a2b3c4d", … }, sorted by URL. */
export function computeVersions(root = process.cwd()) {
  const pub = join(root, "public");
  const files = ASSET_DIRS.flatMap((d) => walk(join(pub, d))).filter((f) => /\.(pdf|jpg)$/.test(f));
  const entries = files.map((f) => ["/" + relative(pub, f).split(sep).join("/"), createHash("sha256").update(readFileSync(f)).digest("hex").slice(0, 8)]);
  return Object.fromEntries(entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const versions = computeVersions();
  const lines = Object.entries(versions).map(([url, v]) => `  ${JSON.stringify(url)}: "${v}"`);
  writeFileSync(MANIFEST, `{\n${lines.join(",\n")}\n}\n`);
  console.log(`${MANIFEST}: ${Object.keys(versions).length} files`);
}
