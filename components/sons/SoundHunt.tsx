"use client";

import { useState } from "react";
import { useSpeech } from "@/components/ListenButton";
import type { SoundHunt as Hunt } from "@/lib/sons-fr";

const LABELS = {
  fr: {
    tapToListen: "Touche une image pour écouter le mot.",
    listen: "Écouter :",
    done: (total: number) => `Bravo, tu as trouvé les ${total} mots !`,
    progress: (found: number, total: number) => `Trouvés : ${found} sur ${total}`,
    again: "Recommencer",
  },
  es: {
    tapToListen: "Toca un dibujo para escuchar la palabra.",
    listen: "Escuchar:",
    done: (total: number) => `¡Muy bien, encontraste las ${total} palabras!`,
    progress: (found: number, total: number) => `Encontradas: ${found} de ${total}`,
    again: "Volver a empezar",
  },
};

// "Où est le son ?" / "¿Dónde está?": the child taps the pictures whose word
// has the sound. Each tap reads the word aloud and turns the card green
// (right) or grey (no sound), with a short sentence explaining why.
export default function SoundHunt({ hunt, locale = "fr" }: { hunt: Hunt; locale?: "fr" | "es" }) {
  const { say, notice } = useSpeech(locale);
  const t = LABELS[locale];
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
      <p className="mt-1 text-sm text-chalkboard/70">{t.tapToListen}</p>
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
                aria-label={`${t.listen} ${item.withArticle}`}
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
          {done ? t.done(total) : t.progress(found, total)}
        </p>
        {tapped.size > 0 && (
          <button
            type="button"
            onClick={() => setTapped(new Set())}
            className="rounded-block border-2 border-chalkboard/20 px-3 py-1 text-sm font-display font-bold hover:border-crayon-blue transition"
          >
            {t.again}
          </button>
        )}
      </div>
      {notice}
    </div>
  );
}
