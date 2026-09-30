// npm run tts:histoires                 cost estimate only (default, no network)
// npm run tts:histoires -- --list-voices           French voices on the account
// npm run tts:histoires -- --generate [--voice fr-FR-Neural2-A] [--force]
//
// Makes the French story audio with Google Cloud Text-to-Speech: one MP3
// per page in public/audio/histoires/<slug>-<page>.mp3 (the path in
// prisma/stories-data.ts). Existing files are kept unless --force. Then run
// `npm run db:seed` so the pages get their audioUrl; until a page has one,
// the reader uses the browser's French voice.
//
// --generate and --list-voices need GOOGLE_TTS_API_KEY: an API key from the
// Google Cloud project, restricted to the Text-to-Speech API.
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { frenchAudioPath, frenchStories } from "../prisma/stories-data";

// Google Cloud Text-to-Speech prices (cloud.google.com/text-to-speech/pricing,
// checked 2026-09-30): characters include spaces and punctuation; the free
// allowance is per billing account and per month.
const PRICES = [
  { type: "Standard", freeChars: 4_000_000, perMillion: 4 },
  { type: "WaveNet", freeChars: 4_000_000, perMillion: 4 },
  { type: "Neural2", freeChars: 1_000_000, perMillion: 16 },
  { type: "Chirp 3: HD", freeChars: 1_000_000, perMillion: 30 },
  { type: "Studio", freeChars: 1_000_000, perMillion: 160 },
];

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const option = (name: string, fallback: string) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

function estimate() {
  let total = 0;
  console.log("French stories, characters sent to Text-to-Speech:");
  for (const s of frenchStories) {
    const chars = s.pages.reduce((n, p) => n + [...p.text].length, 0);
    total += chars;
    console.log(`  ${s.title.padEnd(30)} ${s.pages.length} pages  ${String(chars).padStart(5)} characters`);
  }
  const pageCount = frenchStories.reduce((n, s) => n + s.pages.length, 0);
  console.log(`  Total: ${pageCount} pages, ${total} characters\n`);
  console.log("Cost for one full run (and for 20 runs, e.g. to try voices):");
  for (const p of PRICES) {
    const cost = (chars: number) => (Math.max(0, chars - p.freeChars) / 1_000_000) * p.perMillion;
    const share = ((total / p.freeChars) * 100).toFixed(2);
    console.log(
      `  ${p.type.padEnd(12)} free up to ${(p.freeChars / 1e6).toFixed(0)}M chars/month, then $${p.perMillion}/1M: ` +
        `one run $${cost(total).toFixed(2)} (${share}% of the free allowance), 20 runs $${cost(total * 20).toFixed(2)}`,
    );
  }
}

async function api(path: string, key: string, body?: unknown) {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/${path}${path.includes("?") ? "&" : "?"}key=${encodeURIComponent(key)}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Text-to-Speech ${res.status}: ${await res.text()}`);
  return res.json();
}

async function listVoices(key: string) {
  const { voices } = (await api("voices?languageCode=fr-FR", key)) as { voices: { name: string; ssmlGender: string }[] };
  for (const v of voices) console.log(`  ${v.name} (${v.ssmlGender.toLowerCase()})`);
}

async function generate(key: string) {
  const voice = option("--voice", "fr-FR-Neural2-A");
  const force = flag("--force");
  let made = 0;
  let chars = 0;
  for (const s of frenchStories) {
    for (const p of s.pages) {
      const file = join(process.cwd(), "public", frenchAudioPath(s.slug, p.pageNumber));
      if (existsSync(file) && !force) continue;
      const { audioContent } = (await api("text:synthesize", key, {
        input: { text: p.text },
        voice: { languageCode: "fr-FR", name: voice },
        audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
      })) as { audioContent: string };
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, Buffer.from(audioContent, "base64"));
      made++;
      chars += [...p.text].length;
      console.log(`  ${frenchAudioPath(s.slug, p.pageNumber)}`);
    }
  }
  console.log(`Made ${made} files (${chars} characters) with ${voice}. Now run: npm run db:seed`);
}

async function main() {
  if (!flag("--generate") && !flag("--list-voices")) {
    estimate();
    console.log("\nNothing was sent to Google. Add --generate (with GOOGLE_TTS_API_KEY) to make the files.");
    return;
  }
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) throw new Error("Set GOOGLE_TTS_API_KEY (a key restricted to the Text-to-Speech API).");
  if (flag("--list-voices")) await listVoices(key);
  else await generate(key);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
