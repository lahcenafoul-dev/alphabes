import type { Locale } from "@/i18n/routing";
import { getGame } from "@/lib/games-data";
import { getFrenchGame } from "@/lib/games-fr";
import { getSpanishGame } from "@/lib/juegos-es";
import { getPortugueseGame } from "@/lib/jogos-pt";

// Which content is Pro (docs/paypal-plan.md, B4). The games' isPremium flags
// live with the game data of each language.
export function isPremiumGame(locale: Locale, slug: string): boolean {
  const game =
    locale === "fr"
      ? getFrenchGame(slug)
      : locale === "es"
        ? getSpanishGame(slug)
        : locale === "pt"
          ? getPortugueseGame(slug)
          : getGame(slug);
  return !!game?.isPremium;
}

// Every premium game as "locale:slug". app/[locale]/games/[slug]/play/premium-game.tsx
// renders exactly these; tests/billing/premium.test.ts checks this list
// against the isPremium flags.
export const PREMIUM_GAME_KEYS = [
  "en:beginning-sound",
  "en:letter-tracing",
  "en:alphabet-quiz",
  "fr:premier-son",
  "fr:trace-la-lettre",
  "fr:quiz-alphabet",
  "es:primera-silaba",
  "es:traza-la-letra",
  "es:quiz-del-abecedario",
  "pt:silaba-inicial",
  "pt:trace-a-letra",
  "pt:quiz-do-alfabeto",
] as const;
