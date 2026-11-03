"use client";

import type { NumberGameKey } from "@/lib/number-games";
import BalloonGame from "./BalloonGame";
import { CompareGame, CountGame, MissingNumberGame, NumberMatchGame } from "./ChoiceGames";

/** One of the five number games, by its language-independent key. */
export default function NumberGame({ game }: { game: NumberGameKey }) {
  switch (game) {
    case "count":
      return <CountGame />;
    case "missing":
      return <MissingNumberGame />;
    case "match":
      return <NumberMatchGame />;
    case "compare":
      return <CompareGame />;
    case "balloons":
      return <BalloonGame />;
  }
}
