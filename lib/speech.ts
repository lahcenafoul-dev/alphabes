import type { Locale } from "@/i18n/routing";

/** English text read aloud with the browser's default en-US voice. */
export function speak(text: string, rate = 0.8) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

/** "no-voice": the device has voices, but none for the language. */
export type SpeakResult = "ok" | "unsupported" | "no-voice";

const LANG_TAG: Record<Locale, string> = { en: "en-US", fr: "fr-FR" };

// Chrome loads its voice list asynchronously: getVoices() is empty until
// "voiceschanged" fires. Wait for it, but not forever (some browsers never
// fire it).
function loadVoices(synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const now = synth.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      synth.removeEventListener("voiceschanged", done);
      resolve(synth.getVoices());
    };
    const timer = setTimeout(done, 1500);
    synth.addEventListener("voiceschanged", done);
  });
}

/** Starts loading the voice list early, so the first tap speaks at once. */
export function warmUpVoices() {
  if (typeof window !== "undefined" && window.speechSynthesis) void loadVoices(window.speechSynthesis);
}

/** Best voice for a language: exact region first (fr-FR), then any (fr-CA, fr-BE…). */
export function pickVoice(voices: SpeechSynthesisVoice[], locale: Locale): SpeechSynthesisVoice | null {
  const tag = LANG_TAG[locale].toLowerCase();
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
  const exact = voices.filter((v) => norm(v) === tag);
  const any = voices.filter((v) => norm(v).split("-")[0] === locale);
  const pool = exact.length ? exact : any;
  // Prefer the higher-quality voices some systems ship next to basic ones.
  return pool.find((v) => /natural|neural|premium|enhanced|google/i.test(v.name)) ?? pool[0] ?? null;
}

function utter(synth: SpeechSynthesis, text: string, locale: Locale, rate: number, voice: SpeechSynthesisVoice | null) {
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang ?? LANG_TAG[locale];
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  synth.speak(utterance);
}

/**
 * Reads text aloud in a language with a matching voice. Never lets an
 * English voice read French: if the device lists voices but none in the
 * language, nothing is said and "no-voice" is returned so the page can
 * explain how to install one.
 */
export async function speakIn(locale: Locale, text: string, rate = 0.85): Promise<SpeakResult> {
  if (typeof window === "undefined" || !window.speechSynthesis) return "unsupported";
  const synth = window.speechSynthesis;
  // When the voices are already known, speak synchronously: iOS only allows
  // speech started directly from the tap.
  const known = synth.getVoices();
  const voices = known.length ? known : await loadVoices(synth);
  const voice = pickVoice(voices, locale);
  if (!voice && voices.length) return "no-voice";
  // No voice list at all (some browsers never expose one): try the language tag.
  utter(synth, text, locale, rate, voice);
  return "ok";
}
