"use client";

import { useState } from "react";
import { useFrenchSpeech } from "@/components/ListenButton";
import { quizQuestion } from "@/lib/games-fr";
import { EndScreen, FeedbackLine, ScoreBar, choiceClass, listenClass, type Feedback } from "./ui";

const TOTAL = 10;

// One try per question, like a real quiz: a wrong answer shows the right one.
export default function QuizAlphabet() {
  const { say, notice } = useFrenchSpeech();
  const [question, setQuestion] = useState(() => quizQuestion());
  const [num, setNum] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [finished, setFinished] = useState(false);

  function pick(choice: string) {
    if (feedback) return;
    const ok = choice === question.answer;
    if (ok) setScore((s) => s + 1);
    setFeedback(ok ? { ok, text: "Bonne réponse !" } : { ok, text: `La bonne réponse était : ${question.answer}.` });
    void say(ok ? "Bonne réponse !" : "Oh non !", 0.9);
    setTimeout(() => {
      setFeedback(null);
      if (num >= TOTAL) {
        setFinished(true);
        return;
      }
      setQuestion(quizQuestion());
      setNum((n) => n + 1);
    }, ok ? 1200 : 2200);
  }

  function again() {
    setQuestion(quizQuestion());
    setNum(1);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  }

  if (finished) return <EndScreen score={score} total={TOTAL} onAgain={again} />;

  const wide = question.kind === "vowel";

  return (
    <div>
      <ScoreBar round={num} total={TOTAL} score={score} />

      <div className="mt-6 text-center">
        <p className="text-xl font-display font-bold">{question.prompt}</p>
        {question.emoji && (
          <div
            className="mx-auto mt-4 flex h-28 w-28 items-center justify-center rounded-full bg-crayon-yellow/25 text-6xl"
            role="img"
            aria-label={question.label}
          >
            {question.emoji}
          </div>
        )}
        <button
          type="button"
          onClick={() => void say(question.spoken, 0.8)}
          className={`${listenClass} mt-4`}
          aria-label={question.kind === "heard" ? "Écouter la lettre" : "Écouter la question"}
        >
          🔊 Écouter
        </button>
      </div>

      <FeedbackLine feedback={feedback} className="mt-3 text-center" />

      <div className={`mt-2 grid gap-4 mx-auto ${wide ? "grid-cols-2 max-w-sm" : "grid-cols-2 sm:grid-cols-4 max-w-md"}`}>
        {question.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => pick(choice)}
            className={wide ? "letter-block bg-wood py-5 w-full text-xl" : choiceClass}
          >
            {choice}
          </button>
        ))}
      </div>
      {notice}
    </div>
  );
}
