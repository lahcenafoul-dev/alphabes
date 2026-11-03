// npm run stories:audio                 make the missing narration MP3s
// npm run stories:audio -- --force      remake every file
// npm run stories:audio -- --only fr    one language (en, fr, es, pt)
// npm run stories:audio -- --dry-run    list what would be made
//
// Narration for Stories v2 (docs/stories-plan.md): one MP3 per page, plus
// page 0 = the title for the cover, in public/audio/stories/v2/<locale>/<slug>/
// (lib/story-audio.ts). The texts come from prisma/stories-v2, never from a
// database.
//
// Made with edge-tts (Microsoft Edge "Read aloud" neural voices; free, no key):
//   py -m pip install --user edge-tts
// Its output is already mono 24 kHz 48 kbit/s MP3, so no re-encoding is needed.
// One voice per language, slightly slow for young children. Existing files are
// kept (unless --force), so the script can be stopped and run again; each file
// is written to a .part file first and renamed when complete. Network errors
// are retried. Each line of the log names the voice used.
import { spawn } from "child_process";
import { existsSync, mkdirSync, renameSync, rmSync, statSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { allStories } from "../../prisma/stories-data";
import { storyAudioPath, type StoryAudioLocale } from "../../lib/story-audio";

export const VOICES: Record<StoryAudioLocale, string> = {
  en: "en-US-AvaNeural",
  fr: "fr-FR-DeniseNeural",
  es: "es-MX-DaliaNeural",
  pt: "pt-BR-FranciscaNeural",
};
const RATE = "-10%";
const CONCURRENCY = 4;
const RETRIES = 4;
const PYTHON = process.env.PYTHON ?? (process.platform === "win32" ? "py" : "python3");

const args = process.argv.slice(2);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const onlyIndex = args.indexOf("--only");
const only = onlyIndex >= 0 ? (args[onlyIndex + 1] as StoryAudioLocale) : null;

type Job = { locale: StoryAudioLocale; slug: string; page: number; text: string; file: string };

function jobs(): Job[] {
  const list: Job[] = [];
  for (const s of allStories) {
    const locale = s.locale.toLowerCase() as StoryAudioLocale;
    if (only && locale !== only) continue;
    const items = [{ page: 0, text: s.title }, ...s.pages.map((p) => ({ page: p.pageNumber, text: p.text }))];
    for (const { page, text } of items) {
      const file = join(process.cwd(), "public", storyAudioPath(locale, s.slug, page));
      list.push({ locale, slug: s.slug, page, text, file });
    }
  }
  return list;
}

function run(cmd: string, argv: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, argv, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => (err += d));
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}: ${err.trim().slice(-400)}`))));
  });
}

async function synthesize(job: Job) {
  mkdirSync(dirname(job.file), { recursive: true });
  // The text goes through a file: no quoting problems with « » ¿ ¡ or quotes.
  const textFile = join(tmpdir(), `story-audio-${process.pid}-${job.locale}-${job.slug}-${job.page}.txt`);
  writeFileSync(textFile, job.text, "utf8");
  const part = `${job.file}.part`;
  try {
    for (let attempt = 1; ; attempt++) {
      try {
        await run(PYTHON, [
          "-m",
          "edge_tts",
          "--voice",
          VOICES[job.locale],
          `--rate=${RATE}`,
          "--file",
          textFile,
          "--write-media",
          part,
        ]);
        if (!existsSync(part) || statSync(part).size < 1000) throw new Error("empty audio");
        renameSync(part, job.file);
        return;
      } catch (e) {
        rmSync(part, { force: true });
        if (attempt >= RETRIES) throw e;
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  } finally {
    rmSync(textFile, { force: true });
  }
}

async function main() {
  const all = jobs();
  const todo = all.filter((j) => force || !existsSync(j.file));
  console.log(`${all.length} files in all, ${todo.length} to make (${CONCURRENCY} at a time).`);
  if (dryRun) {
    for (const j of todo) console.log(`  ${storyAudioPath(j.locale, j.slug, j.page)}`);
    return;
  }
  let next = 0;
  let made = 0;
  const failed: string[] = [];
  async function worker() {
    while (next < todo.length) {
      const job = todo[next++];
      const name = storyAudioPath(job.locale, job.slug, job.page);
      try {
        await synthesize(job);
        made++;
        console.log(`  [${made}/${todo.length}] ${name}  (${VOICES[job.locale]})`);
      } catch (e) {
        failed.push(name);
        console.error(`  FAILED ${name}: ${e instanceof Error ? e.message : e}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`Made ${made} files.${failed.length ? ` ${failed.length} failed; run again to retry them.` : ""}`);
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
