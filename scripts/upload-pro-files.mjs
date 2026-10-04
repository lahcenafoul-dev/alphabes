// Uploads pro-files/<lang>/<slug>.pdf to the private R2 bucket
// alphabes-pro-files with the same keys (<lang>/<slug>.pdf), which is where
// /api/bundles/... reads them (lib/billing/bundles.ts, docs/paypal-plan.md).
//
//   node scripts/upload-pro-files.mjs [--dry-run] [--lang=fr] [--force] [--no-verify]
//
// Uses wrangler with --remote (wrangler 4 writes to a local emulator
// otherwise). Log in first with `npx wrangler login`, or set
// CLOUDFLARE_API_TOKEN (an R2 edit token) in the environment; nothing here
// prints it. This only writes objects to the bucket: it never deploys.
//
// R2 uploads from this connection can time out, so each file is retried
// (5 attempts, growing pauses), then read back and compared (sha256) unless
// --no-verify. Files already uploaded with the same content are skipped,
// using .pro-files-uploaded.json (git-ignored), so a stopped run resumes and
// a later run only sends changed files. --force uploads everything again.
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BUCKET = "alphabes-pro-files";
const DIR = "pro-files";
const LOG = ".pro-files-uploaded.json";
const LANGS = ["en", "fr", "es", "pt"];
const ATTEMPTS = 5;
const ATTEMPT_TIMEOUT_MS = 180_000;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const verify = !args.includes("--no-verify");
const onlyLang = args.find((a) => a.startsWith("--lang="))?.slice(7);
if (onlyLang && !LANGS.includes(onlyLang)) {
  console.error(`--lang must be one of ${LANGS.join(", ")}`);
  process.exit(1);
}

const wranglerJs = join("node_modules", "wrangler", "bin", "wrangler.js");
const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Runs wrangler; resolves with its exit code and the end of its output
// (wrangler's own messages; it never prints credentials).
function wrangler(argv) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [wranglerJs, ...argv], { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    const timer = setTimeout(() => {
      out += `\n(timed out after ${ATTEMPT_TIMEOUT_MS / 1000}s)`;
      child.kill();
    }, ATTEMPT_TIMEOUT_MS);
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, tail: out.trim().split(/\r?\n/).slice(-3).join(" | ") });
    });
  });
}

async function withRetries(label, fn) {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const r = await fn();
    if (r.ok) return true;
    console.log(`    ${label}: attempt ${attempt}/${ATTEMPTS} failed (${r.why})`);
    if (attempt < ATTEMPTS) await sleep(5_000 * 2 ** (attempt - 1)); // 5, 10, 20, 40 s
  }
  return false;
}

const files = (onlyLang ? [onlyLang] : LANGS).flatMap((lang) =>
  readdirSync(join(DIR, lang))
    .filter((f) => f.endsWith(".pdf"))
    .sort()
    .map((f) => ({ key: `${lang}/${f}`, path: join(DIR, lang, f) })),
);
const done = existsSync(LOG) ? JSON.parse(readFileSync(LOG, "utf8")) : {};
const todo = files
  .map((f) => ({ ...f, hash: sha256(readFileSync(f.path)) }))
  .filter((f) => force || done[f.key] !== f.hash);

console.log(`${files.length} files in ${DIR}/${onlyLang ? `${onlyLang}/` : ""}; ${todo.length} to upload to ${BUCKET}${verify ? " (each one read back and checked)" : ""}.`);
if (dryRun) {
  for (const f of todo) console.log(`  would upload ${f.key}`);
  process.exit(0);
}

let failed = 0;
for (const [i, f] of todo.entries()) {
  console.log(`  [${i + 1}/${todo.length}] ${f.key}`);
  const uploaded = await withRetries("upload", async () => {
    const r = await wrangler(["r2", "object", "put", `${BUCKET}/${f.key}`, "--file", f.path, "--content-type", "application/pdf", "--remote"]);
    return { ok: r.code === 0, why: r.tail };
  });
  let ok = uploaded;
  if (ok && verify) {
    const tmp = join(tmpdir(), `alphabes-verify-${process.pid}.pdf`);
    ok = await withRetries("check", async () => {
      rmSync(tmp, { force: true });
      const r = await wrangler(["r2", "object", "get", `${BUCKET}/${f.key}`, "--file", tmp, "--remote"]);
      if (r.code !== 0) return { ok: false, why: r.tail };
      const same = existsSync(tmp) && sha256(readFileSync(tmp)) === f.hash;
      return { ok: same, why: "content differs from the local file" };
    });
    rmSync(tmp, { force: true });
  }
  if (ok) {
    done[f.key] = f.hash;
    writeFileSync(LOG, JSON.stringify(done, null, 2) + "\n");
  } else {
    failed++;
    console.log(`    FAILED: ${f.key}`);
  }
}

console.log(failed ? `\n${failed} file(s) failed; run the script again to retry them.` : `\nAll ${todo.length} file(s) uploaded${verify ? " and checked" : ""}.`);
process.exit(failed ? 1 : 0);
