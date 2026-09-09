"use client";

import { useState } from "react";
import { getAllLetterSlugs, getLetterContent } from "@/lib/letters-data";
import { shuffle, pickDistractors } from "@/lib/games/utils";
import WorksheetIcon from "@/components/icons/WorksheetIcon";

const LETTERS = getAllLetterSlugs();
const TOTAL_QUESTIONS = 10;

type Question = {
  prompt: string;
  choices: string[];
  correctChoice: string;
  icon?: string;
};

function neighbor(letter: string, dir: -1 | 1): string {
  const idx = LETTERS.indexOf(letter);
  return LETTERS[(idx + dir + LETTERS.length) % LETTERS.length];
}

function buildSequenceQuestion(letter: string): Question {
  const answerLetter = neighbor(letter, 1);
  const answer = answerLetter.toUpperCase();
  const pool = LETTERS.filter((l) => l !== letter && l !== answerLetter);
  const distractors = shuffle(pool).slice(0, 3).map((l) => l.toUpperCase());
  return {
    prompt: `Which letter comes after ${letter.toUpperCase()}?`,
    choices: shuffle([answer, ...distractors]),
    correctChoice: answer,
  };
}

function buildSoundQuestion(letter: string): Question {
  const content = getLetterContent(letter)!;
  const answer = content.uppercase;
  const distractorLetters = pickDistractors(LETTERS, letter, 3);
  const choices = shuffle([letter, ...distractorLetters].map((l) => l.toUpperCase()));
  return {
    prompt: `Which letter makes this sound: "${content.phonicsSound}"?`,
    choices,
    correctChoice: answer,
  };
}

function buildWordQuestion(letter: string): Question {
  const content = getLetterContent(letter)!;
  const word = content.exampleWords[0].word;
  const answer = content.uppercase;
  const distractorLetters = pickDistractors(LETTERS, letter, 3);
  const choices = shuffle([letter, ...distractorLetters].map((l) => l.toUpperCase()));
  return {
    prompt: `Which letter does this picture start with?`,
    choices,
    correctChoice: answer,
    icon: word,
  };
}

const BUILDERS = [buildSequenceQuestion, buildSoundQuestion, buildWordQuestion];

function buildQuestion(): Question {
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const builder = BUILDERS[Math.floor(Math.random() * BUILDERS.length)];
  return builder(letter);
}

export default function AlphabetQuizGame() {
  const [questionNum, setQuestionNum] = useState(1);
  const [question, setQuestion] = useState<Question>(() => buildQuestion());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);

  function handlePick(choice: string) {
    if (feedback) return;
    const isCorrect = choice === question.correctChoice;
    if (isCorrect) setScore((s) => s + 1);
    setFeedback(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      if (questionNum >= TOTAL_QUESTIONS) {
        setFinished(true);
      } else {
        setQuestionNum((n) => n + 1);
        setQuestion(buildQuestion());
      }
      setFeedback(null);
    }, 700);
  }

  function playAgain() {
    setQuestionNum(1);
    setScore(0);
    setFinished(false);
    setQuestion(buildQuestion());
  }

  if (finished) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl font-display font-bold">🎉 Quiz complete!</p>
        <p className="mt-2 text-chalkboard/70">
          You scored {score} out of {TOTAL_QUESTIONS}.
        </p>
        <button
          onClick={playAgain}
          className="mt-6 rounded-block bg-crayon-blue text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-bold text-chalkboard/70">
        Question {questionNum}/{TOTAL_QUESTIONS} · Score: {score}
      </p>

      <p className="mt-4 text-xl font-display font-bold text-center">{question.prompt}</p>

      {question.icon && (
        <div className="mt-3 flex justify-center">
          <WorksheetIcon word={question.icon} className="h-20 w-20 text-chalkboard/70" />
          <span className="sr-only">{question.icon}</span>
        </div>
      )}

      <p
        aria-live="polite"
        className={`mt-3 h-6 text-center text-sm font-bold ${
          feedback === "correct" ? "text-crayon-green" : feedback === "wrong" ? "text-crayon-red" : "text-transparent"
        }`}
      >
        {feedback === "correct" ? "✓ Correct!" : feedback === "wrong" ? `✗ The answer was ${question.correctChoice}` : "placeholder"}
      </p>

      <div className="mt-2 grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {question.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => handlePick(choice)}
            className="letter-block bg-wood aspect-square text-2xl w-full"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
