"use client";

import { useEffect, useRef, useState } from "react";
import { useSpeech } from "@/components/ListenButton";
import { stopSpeaking } from "@/lib/speech";
import { InlineIcon } from "@/components/UiIcon";

const LABELS = {
  en: { listen: "Listen", stop: "Stop", listenAria: "Listen to the page", stopAria: "Stop reading" },
  fr: { listen: "Écouter", stop: "Arrêter", listenAria: "Écouter la page", stopAria: "Arrêter la lecture" },
  es: { listen: "Escuchar", stop: "Detener", listenAria: "Escuchar la página", stopAria: "Detener la lectura" },
  pt: { listen: "Ouvir", stop: "Parar", listenAria: "Ouvir a página", stopAria: "Parar a leitura" },
};

/** One piece of narration: its MP3, and the text the browser reads if the MP3 can't play. */
export type NarrationPart = { url: string; text: string };

// "Listen" / "Écouter" / "Escuchar" / "Ouvir" on a story page: plays the
// recorded narration (scripts/stories/audio.ts, lib/story-audio.ts), one MP3
// after another (on the first page: the title, then the page). If a file is
// missing or can't play, the browser's voice in the story's language reads
// the rest. While reading, the button becomes "Stop" / "Arrêter" / "Detener" /
// "Parar"; turning the page or leaving the story stops the reading.
export default function StoryAudio({ parts, locale }: { parts: NarrationPart[]; locale: keyof typeof LABELS }) {
  const t = LABELS[locale];
  const { say, notice } = useSpeech(locale);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Bumped on every start and stop, so a late event from an old reading is ignored.
  const runRef = useRef(0);
  const key = parts.map((p) => p.url).join("|");

  function stop() {
    runRef.current++;
    audioRef.current?.pause();
    audioRef.current = null;
    stopSpeaking();
    setPlaying(false);
  }

  // New page or story closed: stop reading the old text.
  useEffect(
    () => () => {
      runRef.current++;
      audioRef.current?.pause();
      audioRef.current = null;
      stopSpeaking();
      setPlaying(false);
    },
    [key],
  );

  // "Playing" first: the reading can end (or fail) before say() resolves.
  async function speak(run: number, text: string) {
    audioRef.current = null;
    if (!(await say(text, 0.85, () => runRef.current === run && setPlaying(false))) && runRef.current === run) setPlaying(false);
  }

  function playFrom(run: number, index: number) {
    if (runRef.current !== run) return;
    if (index >= parts.length) {
      audioRef.current = null;
      setPlaying(false);
      return;
    }
    const audio = new Audio(parts[index].url);
    audioRef.current = audio;
    let failed = false;
    const fallBack = () => {
      if (failed || runRef.current !== run || audioRef.current !== audio) return;
      failed = true;
      audio.pause();
      void speak(
        run,
        parts
          .slice(index)
          .map((p) => p.text)
          .join(" "),
      );
    };
    audio.onended = () => {
      if (!failed && audioRef.current === audio) playFrom(run, index + 1);
    };
    audio.onerror = fallBack;
    audio.play().catch(fallBack);
  }

  function play() {
    if (playing) {
      stop();
      return;
    }
    const run = ++runRef.current;
    setPlaying(true);
    playFrom(run, 0);
  }

  return (
    <>
      <button
        type="button"
        onClick={play}
        aria-label={playing ? t.stopAria : t.listenAria}
        className="rounded-block bg-crayon-blue text-white px-4 py-2 font-bold flex items-center gap-2"
      >
        <InlineIcon name={playing ? "stop" : "listen"} />
        {playing ? t.stop : t.listen}
      </button>
      {notice}
    </>
  );
}
