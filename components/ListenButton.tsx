"use client";

import { useEffect, useState } from "react";
import { speakIn, warmUpVoices, type SpeakResult } from "@/lib/speech";

// Read-aloud button for the French pages. Speaks with a French voice only;
// when the device has none, it shows how to install one instead of letting
// an English voice mangle the words.
export default function ListenButton({
  text,
  children,
  className,
  ariaLabel,
  rate,
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  rate?: number;
}) {
  const { say, notice } = useFrenchSpeech();

  return (
    <>
      <button type="button" onClick={() => say(text, rate)} className={className} aria-label={ariaLabel}>
        {children}
      </button>
      {notice}
    </>
  );
}

/**
 * French speech for interactive components: `say(text)` reads it with a
 * French voice, and `notice` (render it) explains how to install one when
 * the device has none.
 */
export function useFrenchSpeech() {
  const [problem, setProblem] = useState<Exclude<SpeakResult, "ok"> | null>(null);

  useEffect(warmUpVoices, []);

  /** Resolves true when the text is being read; `onEnd` runs when it stops. */
  async function say(text: string, rate?: number, onEnd?: () => void) {
    const result = await speakIn("fr", text, rate, onEnd);
    setProblem(result === "ok" ? null : result);
    return result === "ok";
  }

  const notice = problem ? <NoVoiceNotice kind={problem} onClose={() => setProblem(null)} /> : null;
  return { say, notice };
}

function NoVoiceNotice({ kind, onClose }: { kind: Exclude<SpeakResult, "ok">; onClose: () => void }) {
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md rounded-block border-2 border-crayon-yellow bg-paper p-4 text-left text-sm text-chalkboard shadow-blockHover sm:inset-x-auto sm:right-4"
    >
      {kind === "unsupported" ? (
        <p className="font-display font-bold">
          Ce navigateur ne sait pas lire à voix haute. Essayez avec Chrome, Edge, Safari ou Firefox.
        </p>
      ) : (
        <>
          <p className="font-display font-bold">Aucune voix française n&apos;est installée sur cet appareil.</p>
          <p className="mt-1 text-chalkboard/80">Pour entendre les lettres et les mots, ajoutez-en une :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-chalkboard/80">
            <li>
              <strong>Android</strong> : Paramètres › Accessibilité › Synthèse vocale, puis choisissez le français
              (moteur Google).
            </li>
            <li>
              <strong>iPhone, iPad</strong> : Réglages › Accessibilité › Contenu énoncé › Voix › Français.
            </li>
            <li>
              <strong>Windows</strong> : Paramètres › Heure et langue › Langue et région, ajoutez le français avec la
              synthèse vocale.
            </li>
          </ul>
          <p className="mt-2 text-chalkboard/60">Rechargez ensuite la page.</p>
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-3 rounded-block bg-chalkboard px-4 py-1.5 font-display font-bold text-paper"
      >
        Fermer
      </button>
    </div>
  );
}
