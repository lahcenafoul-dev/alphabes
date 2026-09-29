// Usage: node compare.mjs <baselineDir> <currentDir>
// Compares per-route digests made by snapshot.mjs. hreflang lines are ignored
// on both sides (they appear as pages get French twins); the site header is
// already left out of the digests. Everything else must match exactly.
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const [a, b] = process.argv.slice(2);
const IGNORE = [/^<link rel="alternate" hrefLang=/];
const lines = (path) => readFileSync(path, "utf8").split("\n").filter((l) => !IGNORE.some((r) => r.test(l)));

let diffs = 0;
const files = readdirSync(join(a, "digest"));
for (const f of files) {
  const pb = join(b, "digest", f);
  if (!existsSync(pb)) { console.log(`MISSING ${f}`); diffs++; continue; }
  const A = lines(join(a, "digest", f));
  const B = lines(pb);
  const out = [];
  for (let i = 0, j = 0; (i < A.length || j < B.length) && out.length <= 8; ) {
    if (A[i] === B[j]) { i++; j++; continue; }
    out.push(`  - ${A[i] ?? "<eof>"}\n  + ${B[j] ?? "<eof>"}`);
    // Resync on the next line the other side contains nearby.
    const inB = B.indexOf(A[i], j);
    const inA = A.indexOf(B[j], i);
    if (inB !== -1 && inB - j < 200) j = inB;
    else if (inA !== -1 && inA - i < 200) i = inA;
    else { i++; j++; }
  }
  if (out.length) { diffs++; console.log(`DIFF ${f}\n${out.join("\n")}`); }
}
console.log(diffs ? `${diffs} route(s) differ` : `all ${files.length} routes identical`);
