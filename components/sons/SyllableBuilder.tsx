"use client";

import { useState } from "react";
import { useFrenchSpeech } from "@/components/ListenButton";
import { BUILDER_CONSONANTS, BUILDER_VOWELS } from "@/lib/sons-fr";

const pick =
  "h-12 w-12 rounded-block border-2 font-display font-bold text-2xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

// Pick a consonant, then a vowel: the syllable appears and is read aloud.
export default function SyllableBuilder() {
  const { say, notice } = useFrenchSpeech();
  const [consonant, setConsonant] = useState("m");
  const [vowel, setVowel] = useState("a");
  const syllable = consonant + vowel;

  function choose(c: string, v: string) {
    setConsonant(c);
    setVowel(v);
    void say(c + v, 0.7);
  }

  return (
    <div>
      <p className="text-sm text-chalkboard/70">Choisis une consonne, puis une voyelle : écoute la syllabe.</p>
      <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <fieldset>
            <legend className="font-display font-bold">Consonne</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUILDER_CONSONANTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={c === consonant}
                  onClick={() => choose(c, vowel)}
                  className={`${pick} ${c === consonant ? "border-crayon-blue bg-crayon-blue text-paper" : "border-chalkboard/15 bg-paper hover:border-crayon-blue"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-display font-bold">Voyelle</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUILDER_VOWELS.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={v === vowel}
                  onClick={() => choose(consonant, v)}
                  className={`${pick} ${v === vowel ? "border-crayon-red bg-crayon-red text-paper" : "border-chalkboard/15 bg-paper hover:border-crayon-red"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <button
          type="button"
          onClick={() => void say(syllable, 0.7)}
          aria-label={`Écouter la syllabe ${syllable}`}
          className="self-center justify-self-center rounded-block border-2 border-chalkboard/10 bg-paper px-8 py-4 text-center shadow-block hover:shadow-blockHover transition"
        >
          <span className="block text-sm text-chalkboard/70" aria-hidden="true">
            {consonant} + {vowel} =
          </span>
          <span className="block font-display font-extrabold text-6xl" aria-live="polite">
            <span className="text-[#1D6FC2]">{consonant}</span>
            <span className="text-[#C8323A]">{vowel}</span>
          </span>
          <span className="mt-1 block text-sm font-bold text-[#1D6FC2]">🔊 Écouter</span>
        </button>
      </div>
      {notice}
    </div>
  );
}
