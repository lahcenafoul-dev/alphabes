import type { Locale } from "@/i18n/routing";
import BeginningSoundGame from "@/components/games/BeginningSoundGame";
import LetterTracingGame from "@/components/games/LetterTracingGame";
import AlphabetQuizGame from "@/components/games/AlphabetQuizGame";
import PremierSon from "@/components/games-fr/PremierSon";
import TraceLaLettre from "@/components/games-fr/TraceLaLettre";
import QuizAlphabet from "@/components/games-fr/QuizAlphabet";
import PrimeraSilaba from "@/components/juegos-es/PrimeraSilaba";
import TrazaLaLetra from "@/components/juegos-es/TrazaLaLetra";
import QuizAbecedario from "@/components/juegos-es/QuizAbecedario";
import SilabaInicial from "@/components/jogos-pt/SilabaInicial";
import TraceALetra from "@/components/jogos-pt/TraceALetra";
import QuizDoAlfabeto from "@/components/jogos-pt/QuizDoAlfabeto";
import { cursiveFont } from "@/lib/fonts/cursive";
import { cursivaFont as cursivaEs } from "@/lib/fonts/cursive-es";
import { cursivaFont as cursivaPt } from "@/lib/fonts/cursive-pt";

// The premium games (PREMIUM_GAME_KEYS in lib/billing/premium.ts). Only the
// play page imports this file, so the static game pages (and their
// JavaScript) never include these games.
export default function PremiumGame({ locale, slug }: { locale: Locale; slug: string }) {
  switch (`${locale}:${slug}`) {
    case "en:beginning-sound":
      return <BeginningSoundGame />;
    case "en:letter-tracing":
      return <LetterTracingGame />;
    case "en:alphabet-quiz":
      return <AlphabetQuizGame />;
    case "fr:premier-son":
      return <PremierSon />;
    case "fr:trace-la-lettre":
      return <TraceLaLettre cursiveFont={cursiveFont.style.fontFamily} />;
    case "fr:quiz-alphabet":
      return <QuizAlphabet />;
    case "es:primera-silaba":
      return <PrimeraSilaba />;
    case "es:traza-la-letra":
      return <TrazaLaLetra cursiveFont={cursivaEs.style.fontFamily} />;
    case "es:quiz-del-abecedario":
      return <QuizAbecedario />;
    case "pt:silaba-inicial":
      return <SilabaInicial />;
    case "pt:trace-a-letra":
      return <TraceALetra cursiveFont={cursivaPt.style.fontFamily} />;
    case "pt:quiz-do-alfabeto":
      return <QuizDoAlfabeto />;
    default:
      return null;
  }
}

