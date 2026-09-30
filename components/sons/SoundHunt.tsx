"use client";

import { useState } from "react";
import { useFrenchSpeech } from "@/components/ListenButton";
import type { SoundHunt as Hunt } from "@/lib/sons-fr";

// "Où est le son ?": the child taps the pictures whose word has the sound.
// Each tap reads the word aloud and turns the card green (right) or grey
// (no sound), with a short sentence explaining why.
export default function SoundHunt({ hunt }: { hunt: Hunt }) {
  const { say, notice } = useFrenchSpeech();
  const [tapped, setTapped] = useState<ReadonlySet<number>>(new Set());
  const total = hunt.items.filter((i) => i.answer).length;
  const found = hunt.items.filter((item, i) => item.answer && tapped.has(i)).length;
  const done = found === total;

  function tap(i: number) {
    void say(hunt.items[i].withArticle);
    setTapped((prev) => new Set(prev).add(i));
  }

  return (
    <div>
      <p className="font-display font-bold text-lg">{hunt.question}</p>
      <p className="mt-1 text-sm text-chalkboard/70">Touche une image pour écouter le mot.</p>
      <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {hunt.items.map((item, i) => {
          const shown = tapped.has(i);
          const tone = !shown
            ? "border-chalkboard/15 bg-paper hover:border-crayon-blue"
            : item.answer
              ? "border-crayon-green bg-crayon-green/15"
              : "border-chalkboard/20 bg-chalkboard/5";
          return (
            <li key={item.word}>
              <button
                type="button"
                onClick={() => tap(i)}
                aria-label={`Écouter : ${item.withArticle}`}
                className={`w-full h-full rounded-block border-2 p-3 text-center shadow-block transition ${tone} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue`}
              >
                <span className="block text-4xl" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="mt-1 block font-display font-bold">{item.word}</span>
                {shown && (
                  <span className="mt-1 block text-xs text-chalkboard/80" aria-live="polite">
                    <span aria-hidden="true">{item.answer ? "✅ " : "✖️ "}</span>
                    {(item.answer ? hunt.yes : hunt.no).replace("{mot}", item.word)}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <p className="font-display font-bold" aria-live="polite">
          {done ? `Bravo, tu as trouvé les ${total} mots !` : `Trouvés : ${found} sur ${total}`}
        </p>
        {tapped.size > 0 && (
          <button
            type="button"
            onClick={() => setTapped(new Set())}
            className="rounded-block border-2 border-chalkboard/20 px-3 py-1 text-sm font-display font-bold hover:border-crayon-blue transition"
          >
            Recommencer
          </button>
        )}
      </div>
      {notice}
    </div>
  );
}
