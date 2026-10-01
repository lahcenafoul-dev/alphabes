"use client";

import { useEffect, useRef, useState } from "react";
import { useFrenchSpeech } from "@/components/ListenButton";
import { stopSpeaking } from "@/lib/speech";

// "Écouter" on a French story page: plays the page's recorded MP3 when it
// has one (scripts/tts-histoires.ts), otherwise reads the text with the
// browser's French voice. A missing or broken file also falls back to it.
// While reading, the button becomes "Arrêter"; turning the page or leaving
// the story stops the reading.
export default function StoryAudioFr({ text, audioUrl }: { text: string; audioUrl: string | null }) {
  const { say, notice } = useFrenchSpeech();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function stop() {
    audioRef.current?.pause();
    audioRef.current = null;
    stopSpeaking();
    setPlaying(false);
  }

  // New page or story closed: stop reading the old text.
  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
      stopSpeaking();
      setPlaying(false);
    },
    [text],
  );

  // "Playing" first: the reading can end (or fail) before say() resolves.
  async function speak() {
    setPlaying(true);
    if (!(await say(text, 0.85, () => setPlaying(false)))) setPlaying(false);
  }

  function play() {
    if (playing) {
      stop();
      return;
    }
    if (!audioUrl) {
      void speak();
      return;
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.onended = () => setPlaying(false);
    setPlaying(true);
    audio.play().catch(() => {
      if (audioRef.current === audio) void speak();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={play}
        aria-label={playing ? "Arrêter la lecture" : "Écouter la page"}
        className="rounded-block bg-crayon-blue text-white px-4 py-2 font-bold flex items-center gap-2"
      >
        {playing ? "⏹ Arrêter" : "🔊 Écouter"}
      </button>
      {notice}
    </>
  );
}
