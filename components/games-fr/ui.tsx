"use client";

// Pieces shared by the French games (components/games-fr): the feedback
// line, the end screen and the button styles.

export type Feedback = { ok: boolean; text: string } | null;

export const choiceClass =
  "letter-block bg-wood aspect-square w-full text-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

export const listenClass =
  "inline-flex items-center gap-2 rounded-block bg-crayon-blue text-white px-5 py-2.5 font-display font-bold shadow-block hover:shadow-blockHover transition";

export function FeedbackLine({ feedback, className = "" }: { feedback: Feedback; className?: string }) {
  return (
    <p
      aria-live="polite"
      className={`min-h-6 text-sm font-bold ${feedback ? (feedback.ok ? "text-crayon-green" : "text-crayon-red") : ""} ${className}`}
    >
      {feedback ? `${feedback.ok ? "✓" : "✗"} ${feedback.text}` : ""}
    </p>
  );
}

export function ScoreBar({ round, total, score }: { round: number; total: number; score: number }) {
  return (
    <p className="text-sm font-bold text-chalkboard/70">
      Manche {round}/{total} · Score : {score}
    </p>
  );
}

/** Kind words whatever the score: the point is to come back and play again. */
export function EndScreen({ score, total, onAgain }: { score: number; total: number; onAgain: () => void }) {
  const cheer = score === total ? "Parfait !" : score >= total * 0.7 ? "Bravo !" : "Bien joué !";
  return (
    <div className="text-center py-8">
      <p className="text-5xl" aria-hidden="true">
        🎉
      </p>
      <p className="mt-3 text-2xl font-display font-bold">{cheer}</p>
      <p className="mt-2 text-chalkboard/70">
        {score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""} sur {total}.
      </p>
      <button
        type="button"
        onClick={onAgain}
        className="mt-6 rounded-block bg-crayon-blue text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
      >
        Rejouer
      </button>
    </div>
  );
}
