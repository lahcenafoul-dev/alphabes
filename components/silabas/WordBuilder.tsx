"use client";

import { useState } from "react";
import { useSpeech } from "@/components/ListenButton";
import type { BuildWord } from "@/lib/silabas-es";

const LABELS = {
  es: {
    intro: "Mira el dibujo y toca las sílabas en orden para armar la palabra.",
    picture: "Dibujo",
    yourWord: "Tu palabra",
    syllables: "Sílabas",
    done: (parts: string, word: string) => `¡Muy bien! ${parts} = ${word}`,
    miss: (s: string) => `«${s}» no va aquí. Escucha la palabra y busca la sílaba que sigue.`,
    listen: "🔊 Escuchar la palabra",
    next: "Otra palabra →",
  },
  pt: {
    intro: "Olhe a figura e toque nas sílabas na ordem para montar a palavra.",
    picture: "Figura",
    yourWord: "Sua palavra",
    syllables: "Sílabas",
    done: (parts: string, word: string) => `Muito bem! ${parts} = ${word}`,
    miss: (s: string) => `“${s}” não vai aqui. Ouça a palavra e procure a próxima sílaba.`,
    listen: "🔊 Ouvir a palavra",
    next: "Outra palavra →",
  },
};

const tile =
  "min-w-16 rounded-block border-2 px-4 py-2 font-display font-bold text-2xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

/** Stable order (no Math.random), so the server and browser render the same tiles. */
function tilesFor(w: BuildWord): string[] {
  const all = [...w.syllables, ...w.extra];
  const score = (s: string, i: number) => (s.charCodeAt(0) * 31 + s.length * 7 + i * 13) % 17;
  return all.map((s, i) => ({ s, k: score(s, i) })).sort((a, b) => a.k - b.k).map((x) => x.s);
}

// "Arma la palabra" / "Monte a palavra": the picture shows a word; the child
// taps its syllables in order (ma + no = mano). A wrong syllable is refused
// with a hint; the finished word is read aloud.
export default function WordBuilder({ words, locale = "es" }: { words: BuildWord[]; locale?: "es" | "pt" }) {
  const { say, notice } = useSpeech(locale);
  const t = LABELS[locale];
  const [index, setIndex] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const w = words[index];
  const done = built.length === w.syllables.length;

  function tap(s: string) {
    if (done) return;
    const expected = w.syllables[built.length];
    if (s !== expected) {
      setMiss(s);
      void say(s, 0.7);
      return;
    }
    const next = [...built, s];
    setBuilt(next);
    setMiss(null);
    void say(next.length === w.syllables.length ? `${w.syllables.join(", ")}. ${w.word}` : s, 0.7);
  }

  function nextWord() {
    setIndex((index + 1) % words.length);
    setBuilt([]);
    setMiss(null);
  }

  return (
    <div>
      <p className="text-sm text-chalkboard/70">{t.intro}</p>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div className="text-6xl" role="img" aria-label={`${t.picture}: ${w.word}`}>
          {w.emoji}
        </div>
        <ol className="flex gap-2" aria-label={t.yourWord}>
          {w.syllables.map((s, i) => (
            <li
              key={i}
              className={`flex h-14 min-w-16 items-center justify-center rounded-block border-2 border-dashed px-3 font-display font-extrabold text-2xl ${
                built[i] ? "border-crayon-green bg-crayon-green/15" : "border-chalkboard/20"
              }`}
            >
              <span className={i % 2 ? "text-[#C8323A]" : "text-[#1D6FC2]"}>{built[i] ?? ""}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t.syllables}>
        {tilesFor(w).map((s, i) => (
          <button
            key={`${s}-${i}`}
            type="button"
            onClick={() => tap(s)}
            disabled={done}
            className={`${tile} ${miss === s ? "border-crayon-red bg-crayon-red/10" : "border-chalkboard/15 bg-paper hover:border-crayon-blue"} disabled:opacity-50`}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="mt-3 min-h-6 font-display font-bold" aria-live="polite">
        {done
          ? t.done(w.syllables.join(" + "), w.word)
          : miss
            ? t.miss(miss)
            : ""}
      </p>
      <div className="mt-2 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void say(w.withArticle, 0.75)}
          className="rounded-block border-2 border-chalkboard/20 px-4 py-2 font-display font-bold hover:border-crayon-blue transition"
        >
          {t.listen}
        </button>
        <button
          type="button"
          onClick={nextWord}
          className="rounded-block bg-crayon-blue text-paper px-4 py-2 font-display font-bold shadow-block hover:shadow-blockHover transition"
        >
          {t.next}
        </button>
      </div>
      {notice}
    </div>
  );
}
