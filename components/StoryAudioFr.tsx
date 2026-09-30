"use client";

import { useFrenchSpeech } from "@/components/ListenButton";

// "Écouter" on a French story page: plays the page's recorded MP3 when it
// has one (scripts/tts-histoires.ts), otherwise reads the text with the
// browser's French voice. A missing or broken file also falls back to it.
export default function StoryAudioFr({ text, audioUrl }: { text: string; audioUrl: string | null }) {
  const { say, notice } = useFrenchSpeech();

  function play() {
    if (!audioUrl) {
      void say(text, 0.85);
      return;
    }
    const audio = new Audio(audioUrl);
    audio.play().catch(() => void say(text, 0.85));
  }

  return (
    <>
      <button
        type="button"
        onClick={play}
        aria-label="Écouter la page"
        className="rounded-block bg-crayon-blue text-white px-4 py-2 font-bold flex items-center gap-2"
      >
        🔊 Écouter
      </button>
      {notice}
    </>
  );
}
