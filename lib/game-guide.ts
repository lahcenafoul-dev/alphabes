// The text under each game (SEO phase 4, B5): how to play, what the child
// learns, age and tips, three questions parents ask (with FAQPage JSON-LD) and
// where to keep practicing. Written per game and per language from what that
// game's code does (components/games, games-fr, juegos-es, jogos-pt,
// number-games, SlidingPuzzleGame): the English and the French "same" game are
// often different games. Change the text when the game changes.
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "./i18n/routes";
import type { Block, Inline } from "./guide-blocks";
import { games as enGames } from "./games-data";
import { frenchGames } from "./games-fr";
import { spanishGames } from "./juegos-es";
import { portugueseGames } from "./jogos-pt";
import { numberGames, type NumberGameKey } from "./number-games";
import { PUZZLES } from "./puzzles";

type Link = { href: string; text: string };
type GameText = { how: string; learns: string; age: string; faq: [string, string][]; more: Link[] };

type LetterKey = "find" | "match" | "sound" | "trace" | "quiz" | "clap";
const EN_KEY: Record<string, LetterKey> = {
  "find-the-letter": "find",
  "match-letter-picture": "match",
  "beginning-sound": "sound",
  "letter-tracing": "trace",
  "alphabet-quiz": "quiz",
};

const HEADINGS: Record<Locale, [string, string, string, string, string]> = {
  en: ["How to play", "What your child learns", "Age and tips", "Questions parents ask", "Keep practicing"],
  fr: ["Comment jouer", "Ce que l'enfant apprend", "Âge et conseils", "Questions des parents", "Pour continuer"],
  es: ["Cómo se juega", "Qué aprende tu hijo", "Edad y consejos", "Preguntas de los padres", "Para seguir practicando"],
  pt: ["Como jogar", "O que a criança aprende", "Idade e dicas", "Perguntas dos pais", "Para continuar praticando"],
};

// ---------------------------------------------------------------- links

function letterGames(locale: Locale): { slug: string; title: string; key: LetterKey }[] {
  const list: { slug: string; title: string; en?: string }[] =
    locale === "fr" ? frenchGames : locale === "es" ? spanishGames : locale === "pt" ? portugueseGames : enGames.map((g) => ({ ...g, en: g.slug }));
  return list.map((g) => ({ slug: g.slug, title: g.title, key: g.en ? EN_KEY[g.en] : "clap" }));
}

function gameLink(locale: Locale, key: LetterKey): Link {
  const g = letterGames(locale).find((x) => x.key === key)!;
  return { href: localizedPath(locale, "/games/[slug]", { slug: g.slug }), text: g.title };
}

function numberLink(locale: Locale, key: NumberGameKey): Link {
  const g = numberGames(locale).find((x) => x.key === key)!;
  return { href: localizedPath(locale, "/games/[slug]", { slug: g.slug }), text: g.title };
}

const sheets = (locale: Locale, category: string, text: string): Link => ({ href: localizedPath(locale, "/worksheets/[category]", { category }), text });
const alphabet = (locale: Locale, text: string): Link => ({ href: localizedPath(locale, "/alphabet"), text });
const numbers = (locale: Locale, text: string): Link => ({ href: localizedPath(locale, "/numbers"), text });
const puzzles = (locale: Locale, text: string): Link => ({ href: localizedPath(locale, "/games/sliding-puzzle"), text });
const puzzle = (locale: Locale, i: number): Link => ({ href: localizedPath(locale, "/games/sliding-puzzle/[puzzle]", { puzzle: PUZZLES[i].slug[locale] }), text: PUZZLES[i].name[locale] });

// ================================================================ English

function english(key: LetterKey | NumberGameKey | "puzzles"): GameText | null {
  const L = "en" as const;
  switch (key) {
    case "find":
      return {
        how: "A letter appears at the top, like “Find: K”. Below it are 24 capital letters in a grid, and the K is one of them. Tap it to score a point and get a new letter straight away. A wrong tap just says “Try again”. A timer counts the minutes and seconds, and the game goes on for as long as you like: there's no last round.",
        learns:
          "Quick recognition of capital letters. With 24 of the 26 letters on screen in every round, your child has to look past the letters that look like the one they want, which is the same skill reading needs. Saying the letter's name out loud while tapping links the name to the shape.",
        age: "Ages 3 to 5. To make it easier, forget the timer and say the letter's name together before searching. To make it harder, play five letters and try to beat your time.",
        faq: [
          ["Does the game say the letters out loud?", "No, Find the Letter is silent: the letter to find is written at the top. Say its name for your child, or ask them to say it."],
          ["Are the letters uppercase or lowercase?", "Uppercase only, in this game. For lowercase letters, the free lowercase worksheets have the same kind of search row."],
          ["Is it free? Does it need an account?", "Yes, it's free and plays right on this page, with no account and nothing to install, on a phone, a tablet or a computer."],
        ],
        more: [gameLink(L, "match"), gameLink(L, "quiz"), sheets(L, "letter-recognition", "Letter recognition worksheets"), sheets(L, "lowercase-letters", "Lowercase letter worksheets"), alphabet(L, "The alphabet, letter by letter")],
      };
    case "match":
      return {
        how: "Each round shows a capital letter, like “Match: B”, and four pictures with no words under them. Tap the picture whose name starts with that letter: the ball for B. A wrong tap says “Try again” and you can choose again; the right one moves on to the next round. After 10 rounds an end screen comes up, with a Play Again button.",
        learns:
          "Linking a letter to the first sound of a word. The names aren't written, so your child names each picture and listens to how it starts. Every letter always comes with the same picture (Apple, Ball, Cat, Dog…), so after a few games the pairs become familiar.",
        age: "Ages 4 to 6. To make it easier, name the four pictures together before choosing. To make it harder, after each round ask for another word that starts with the same letter.",
        faq: [
          ["Does the game say the picture names?", "No, it's silent. Naming the pictures together is part of the game: hearing “ball” and “bear” is how children notice they both start with B."],
          ["Which words does it use?", "One picture per letter: apple, ball, cat, dog, elephant, fish, goat, horse, igloo, jelly, kite, lion, monkey, nest, orange, pig, queen, rabbit, sun, tiger, umbrella, van, whale, xylophone, yak and zebra."],
          ["Is it free? Does it need an account?", "Yes, it's free and plays right on this page, with no account and nothing to install, on a phone, a tablet or a computer."],
        ],
        more: [gameLink(L, "sound"), gameLink(L, "find"), sheets(L, "letter-picture-matching", "Letter and picture matching worksheets"), sheets(L, "beginning-sounds-practice", "Beginning sounds worksheets"), alphabet(L, "The alphabet, letter by letter")],
      };
    case "sound":
      return {
        how: "A word is written in big letters, with a Listen button that reads it out loud. Below are four capital letters: tap the one the word starts with. A wrong tap says “Try again”; the right one moves on. There are 10 rounds, then an end screen and a Play Again button.",
        learns:
          "Hearing the first sound of a word and matching it to its letter, the step just before reading. It uses the same 26 words as Match Letter and Picture, the other way around: there the letter is given and the child finds the picture; here the word is given and the child finds the letter.",
        age: "Ages 4 to 6. For a real listening game, cover the written word and use the Listen button only. To make it harder, ask for the sound before the letter's name.",
        faq: [
          ["Does it need sound?", "The Listen button uses your device's own voice. If nothing plays, read the word out loud yourself: it's written on screen, and the game works the same."],
          ["Is it free?", "It's one of the AlphaBes Pro games: the page shows a Play button that opens it for Pro members. Find the Letter and Match Letter and Picture are free for everyone."],
          ["How is it different from Match Letter and Picture?", "Same skill, other direction: Match Letter and Picture shows a letter and asks for a picture; Beginning Sound shows a word and asks for its first letter."],
        ],
        more: [gameLink(L, "match"), gameLink(L, "quiz"), sheets(L, "beginning-sounds-practice", "Beginning sounds worksheets"), alphabet(L, "The alphabet, letter by letter")],
      };
    case "trace":
      return {
        how: "A big letter is drawn in light outline on a white board. Trace over it with a finger, a stylus or the mouse; “Clear & Retry” wipes the lines. Tap “Done, Next Letter” to go on. The 26 letters come in a mixed-up order, and the Uppercase and Lowercase buttons switch the letter at any time. After the last one: “You traced the whole alphabet!”",
        learns:
          "The shapes of capital and small letters, and the hand control to draw them: going over a curve without lifting, stopping at a corner. On a screen, a mistake is gone in one tap, which helps children who don't like to make marks on paper.",
        age: "Ages 4 to 7. The outline has no start dots or arrows, so show where the letter starts and trace it once together first. Then move on to paper with the free tracing worksheets.",
        faq: [
          ["Does the game check the tracing?", "No, there's no score and nothing is checked: your child traces, you look together, then go to the next letter. You can clear and try again as often as you like."],
          ["Is there cursive?", "Not in this game: it shows print letters. The free cursive worksheets have every letter in cursive to trace on paper."],
          ["Is it free?", "It's one of the AlphaBes Pro games: the page shows a Play button that opens it for Pro members. Find the Letter and Match Letter and Picture are free for everyone."],
        ],
        more: [gameLink(L, "find"), gameLink(L, "quiz"), sheets(L, "letter-tracing", "Letter tracing worksheets"), sheets(L, "letter-cursive", "Cursive letter worksheets")],
      };
    case "quiz":
      return {
        how: "Ten questions, each with four capital letters to choose from, in three kinds mixed at random: which letter comes after a given letter, which letter makes a sound (named in words, like “Short A” or “Hard G”), and which letter a picture's name starts with. One try per question: a wrong answer shows the right one and the quiz moves on. Your score out of 10 comes at the end.",
        learns: "It's a little check-up of what your child already knows: the order of the alphabet, the sounds of the letters and the first letter of words. The score shows which kind of question still needs practice.",
        age: "Ages 5 to 7. The questions are written, not read aloud, so read them to a child who can't read yet. Play again later and compare scores.",
        faq: [
          ["Is the quiz read aloud?", "No, it's silent: read each question to your child. The picture questions only need the picture's name."],
          ["Does a wrong answer cost a point?", "No: each right answer scores one point, and a wrong one just shows the right answer before the next question."],
          ["Is it free?", "It's one of the AlphaBes Pro games: the page shows a Play button that opens it for Pro members. Find the Letter and Match Letter and Picture are free for everyone."],
        ],
        more: [gameLink(L, "find"), gameLink(L, "sound"), sheets(L, "letter-review", "Letter review worksheets"), alphabet(L, "The alphabet, letter by letter")],
      };
    case "count":
      return {
        how: "",
        learns: "",
        age: "Ages 3 to 6. Start with small groups by pointing at each picture as you count; when 1 to 5 is easy, let your child count alone up to 10.",
        faq: [
          ["Is everything read aloud?", "The question is read with your device's own voice and written on screen too. If a device has no English voice, a message explains how to add one; the game still works without sound."],
          ["What happens after a wrong answer?", "The game says “try again”, that number is set aside, and your child picks again. A point is scored only for a right answer on the first try."],
          ["Is it free? Does it need an account?", "Yes, all the number games are free and play on the page, with no account, no timer and nothing to install."],
        ],
        more: [numberLink(L, "match"), numberLink(L, "compare"), numbers(L, "Numbers 0 to 20: printables and activities")],
      };
    case "missing":
      return {
        how: "",
        learns: "",
        age: "Ages 3 to 6. The rows go up to 20, so start by counting each row from its first number; later, try saying just the number before and after the gap.",
        faq: [
          ["Do the numbers always go up?", "Yes: five numbers in a row, counting up by one, somewhere between 1 and 20. Only the hidden number changes place."],
          ["What happens after a wrong answer?", "The game says “try again”, that number is set aside, and your child picks again. A point is scored only for a right answer on the first try."],
          ["Is it free? Does it need an account?", "Yes, all the number games are free and play on the page, with no account, no timer and nothing to install."],
        ],
        more: [numberLink(L, "balloons"), numberLink(L, "count"), numbers(L, "Numbers 0 to 20: printables and activities")],
      };
    case "compare":
      return {
        how: "",
        learns: "",
        age: "Ages 3 to 6. The question changes between “bigger” and “smaller”, so listen to it together each time; that's often the hard part, more than the counting.",
        faq: [
          ["Can the two numbers be the same?", "No, the two groups always have different numbers, from 1 to 10, so there's always one bigger and one smaller."],
          ["Is everything read aloud?", "The question is read with your device's own voice and written on screen too. If a device has no English voice, a message explains how to add one."],
          ["Is it free? Does it need an account?", "Yes, all the number games are free and play on the page, with no account, no timer and nothing to install."],
        ],
        more: [numberLink(L, "count"), numberLink(L, "match"), numbers(L, "Numbers 0 to 20: printables and activities")],
      };
    case "balloons":
      return {
        how: "",
        learns: "",
        age: "Ages 3 to 6. Say each number together before tapping it; children who know 1 to 10 well can try to pop them all without a wobble.",
        faq: [
          ["What if my child taps the wrong balloon?", "It just wobbles and the game says which number to find; nothing is lost. The order is always 1, 2, 3… up to 10."],
          ["Do the balloons move?", "They float gently in place; their places change at every new game, so the order has to be found again."],
          ["Is it free? Does it need an account?", "Yes, all the number games are free and play on the page, with no account, no timer and nothing to install."],
        ],
        more: [numberLink(L, "missing"), numberLink(L, "count"), numbers(L, "Numbers 0 to 20: printables and activities")],
      };
    case "puzzles":
      return {
        how: "Pick one of the 24 pictures. It's cut into squares, with one missing. Tap or click a square next to the empty space to slide it there, or use the arrow keys, until the picture matches the small one beside the board. The move counter shows how many slides it took. Stuck? “Show numbers” puts a number on each square: they go in order, 1 at the top left.",
        learns: "Planning a few moves ahead, seeing how the parts of a picture fit together, and sticking with a puzzle until it's done. Talking about the picture while solving it adds new words: every scene has nine things to name.",
        age: "Ages 4 and up. Every puzzle starts at 3×3; switch to 4×4 when 3×3 feels easy. Solve the top row first, then the next one: the last two rows are the trickiest.",
        faq: [
          ["Can a puzzle be impossible?", "No. Each puzzle is shuffled by sliding the squares from the finished picture, so it can always be put back."],
          ["Does it work on a phone?", "Yes, on a phone, a tablet or a computer: tap, click or use the arrow keys."],
          ["Is it free? Does it need an account?", "Yes, the 24 puzzles are free, with no account and nothing to install."],
        ],
        more: [puzzle(L, 0), puzzle(L, 1), puzzle(L, 2), { href: localizedPath(L, "/games"), text: "All the games" }],
      };
    default:
      return null;
  }
}

// ================================================================ French

function french(key: LetterKey | NumberGameKey | "puzzles"): GameText | null {
  const L = "fr" as const;
  const free = "Oui : il est gratuit et se joue directement sur cette page, sans compte et sans rien installer, sur téléphone, tablette ou ordinateur.";
  const pro = "C'est un des jeux d'AlphaBes Pro : la page affiche un bouton pour jouer, qui l'ouvre aux abonnés Pro. Trouve la lettre et Associe la lettre et l'image sont gratuits pour tous.";
  const voice = "Le jeu utilise la voix française de l'appareil. S'il n'en a pas, un message explique comment en ajouter une ; tout reste écrit à l'écran, et on peut lire à voix haute pour l'enfant.";
  const numbersFree = "Oui, les jeux des nombres sont tous gratuits et se jouent sur la page, sans compte, sans chrono et sans rien installer.";
  switch (key) {
    case "find":
      return {
        how: "La lettre à trouver s'affiche en haut, et le bouton Écouter dit « Trouve la lettre… ». En dessous, une grille de 16 lettres, dont la bonne. On la touche : « Bravo ! », et la lettre suivante est demandée à voix haute. Une erreur ? Le jeu dit le nom de la lettre touchée (« Ça, c'est le d ») et on cherche encore. Le bouton CAPITALES / minuscules change l'écriture à tout moment. Dix lettres, puis le score.",
        learns:
          "Reconnaître une lettre à son nom, parmi celles qui lui ressemblent : la grille mêle exprès b, d, p et q, ou m, n et u. Le nom dit à chaque erreur aide l'enfant à se corriger seul.",
        age: "De 3 à 5 ans. Commencez en capitales, plus faciles à distinguer, puis passez aux minuscules. Un point n'est compté que si la lettre est trouvée du premier coup : visez dix sur dix.",
        faq: [
          ["Le son marche-t-il sur tous les appareils ?", voice],
          ["Pourquoi tant de lettres qui se ressemblent ?", "Parce que ce sont elles qui posent problème en lecture : pour le b, la grille contient d, p, q et h."],
          ["Le jeu est-il gratuit ? Faut-il un compte ?", free],
        ],
        more: [gameLink(L, "match"), gameLink(L, "quiz"), sheets(L, "reconnaissance-des-lettres", "Fiches pour reconnaître les lettres"), alphabet(L, "L'alphabet, lettre par lettre")],
      };
    case "match":
      return {
        how: "Une lettre s'affiche en capitale et en minuscule, avec la question « Quelle image commence par la lettre… ? », que le bouton Écouter lit à voix haute. En dessous, quatre images sans leur nom. On touche une image : si c'est la bonne, le jeu dit son nom (« Oui ! un avion ») ; sinon, il dit ce que c'est (« Ça, c'est une tomate ») et on essaie encore. Dix manches, puis le score.",
        learns:
          "Relier une lettre au début d'un mot, la première étape avant de lire. Chaque image touchée est nommée, l'enfant entend donc le mot et son premier son. Les images changent d'une partie à l'autre : chaque lettre a plusieurs mots possibles.",
        age: "De 4 à 6 ans. Nommez les quatre images avant de choisir. Pour corser, demandez un autre mot qui commence par la même lettre.",
        faq: [
          ["Le son marche-t-il sur tous les appareils ?", voice],
          ["Comment le score est-il compté ?", "Un point par image trouvée du premier coup. Après une erreur, l'enfant peut réessayer, mais la manche ne rapporte plus de point."],
          ["Le jeu est-il gratuit ? Faut-il un compte ?", free],
        ],
        more: [gameLink(L, "sound"), gameLink(L, "find"), sheets(L, "son-des-lettres", "Fiches : le son de la lettre"), alphabet(L, "L'alphabet, lettre par lettre")],
      };
    case "sound":
      return {
        how: "Une image s'affiche, sans son nom écrit : l'enfant doit écouter, pas lire. Le bouton « Écouter le mot » le dit à voix haute. On choisit parmi quatre lettres en minuscule celle du son entendu au début du mot. Après une erreur, le jeu redit le mot pour bien écouter son début. Dix manches, puis le score.",
        learns:
          "L'oreille : entendre le premier son d'un mot (le « a » d'avion, le « mmm » de moto) et le relier à sa lettre. Les mots commencent par un son clair, sans c, k, q, e ni y, et deux lettres aux sons trop proches ne sont jamais proposées ensemble.",
        age: "De 4 à 6 ans. Faites durer le premier son en disant le mot (« mmmoto ») : c'est le meilleur coup de pouce.",
        faq: [
          ["Le son marche-t-il sur tous les appareils ?", "Le jeu utilise la voix française de l'appareil. S'il n'en a pas, un message explique comment en ajouter une. Ici, le nom de l'image n'est pas écrit : sans voix, dites le mot vous-même."],
          ["Le jeu est-il gratuit ?", pro],
          ["Quelle différence avec Associe la lettre et l'image ?", "Là, la lettre est donnée et l'enfant cherche l'image. Ici, c'est l'inverse : il entend le mot et cherche la lettre de son premier son."],
        ],
        more: [gameLink(L, "match"), gameLink(L, "quiz"), sheets(L, "son-des-lettres", "Fiches : le son de la lettre"), alphabet(L, "L'alphabet, lettre par lettre")],
      };
    case "trace":
      return {
        how: "La lettre s'affiche en pointillés, et on la repasse du doigt, au stylet ou à la souris. Deux boutons changent la lettre : capitale ou minuscule, et script ou cursive (sur les lignes Seyès du cahier). Écouter dit son nom. Les lettres suivent l'ordre de l'alphabet, puis é, è, ê et ç : 30 en tout, avec Lettre précédente et Lettre suivante. Effacer et recommencer efface le tracé.",
        learns: "La forme des lettres et le geste pour les écrire, en script comme en cursive : la même écriture qu'à l'école. À l'écran, une erreur s'efface d'un geste, ce qui rassure les enfants qui n'aiment pas se tromper sur le papier.",
        age: "De 4 à 7 ans. Montrez d'abord où commence la lettre et tracez-la une fois ensemble. Puis passez au papier avec les fiches de tracé et de cursive.",
        faq: [
          ["Le jeu vérifie-t-il le tracé ?", "Non : il n'y a pas de score. L'enfant trace, vous regardez ensemble, puis vous passez à la lettre suivante."],
          ["Peut-on s'entraîner aux accents ?", "Oui : après le z viennent é, è, ê et ç, en capitale et en minuscule, en script ou en cursive."],
          ["Le jeu est-il gratuit ?", pro],
        ],
        more: [gameLink(L, "find"), gameLink(L, "quiz"), sheets(L, "trace-des-lettres", "Fiches de tracé des lettres"), sheets(L, "ecriture-cursive", "Fiches d'écriture cursive")],
      };
    case "quiz":
      return {
        how: "Dix questions, de quatre sortes tirées au hasard : quelle lettre vient après une autre, quelle lettre on entend (le bouton Écouter dit son nom), voyelle ou consonne, et par quelle lettre commence le mot d'une image. Une seule réponse par question : en cas d'erreur, la bonne réponse s'affiche, puis on passe à la suivante. Le score sur dix s'affiche à la fin.",
        learns: "Un petit bilan de ce que l'enfant sait déjà : l'ordre de l'alphabet, le nom des lettres, voyelles et consonnes, et le début des mots. Le score montre quelle sorte de question demande encore un peu d'entraînement.",
        age: "De 5 à 7 ans, en fin de grande section ou au CP. Lisez les questions à l'enfant s'il ne lit pas encore.",
        faq: [
          ["Le son marche-t-il sur tous les appareils ?", "Le jeu utilise la voix française de l'appareil. S'il n'en a pas, un message explique comment en ajouter une. Les questions « Quelle lettre entends-tu ? » ont besoin du son ; les autres sont écrites."],
          ["Une erreur fait-elle perdre des points ?", "Non : chaque bonne réponse rapporte un point, une erreur montre simplement la bonne réponse."],
          ["Le jeu est-il gratuit ?", pro],
        ],
        more: [gameLink(L, "find"), gameLink(L, "sound"), sheets(L, "reconnaissance-des-lettres", "Fiches pour reconnaître les lettres"), alphabet(L, "L'alphabet, lettre par lettre")],
      };
    case "count":
      return {
        how: "",
        learns: "",
        age: "De 3 à 6 ans. Comptez d'abord ensemble en montrant chaque dessin du doigt ; quand 1 à 5 est facile, laissez l'enfant compter seul jusqu'à 10.",
        faq: [
          ["Le son marche-t-il sur tous les appareils ?", "La consigne est lue avec la voix française de l'appareil et reste écrite à l'écran. S'il n'a pas de voix française, un message explique comment en ajouter une ; le jeu marche aussi sans le son."],
          ["Que se passe-t-il après une erreur ?", "Le jeu dit « essaie encore », le nombre touché est mis de côté et l'enfant choisit de nouveau. Un point n'est compté que pour une bonne réponse du premier coup."],
          ["Le jeu est-il gratuit ? Faut-il un compte ?", numbersFree],
        ],
        more: [numberLink(L, "match"), numberLink(L, "compare"), sheets(L, "nombres", "Fiches des nombres de 0 à 10"), numbers(L, "Les nombres de 0 à 20 : fiches et activités")],
      };
    case "missing":
      return {
        how: "",
        learns: "",
        age: "De 3 à 6 ans. Les suites vont jusqu'à 20 : récitez d'abord chaque suite depuis son premier nombre, puis essayez de dire seulement le nombre d'avant et celui d'après.",
        faq: [
          ["Les nombres vont-ils toujours dans l'ordre ?", "Oui : cinq nombres qui se suivent, de un en un, entre 1 et 20. Seule la place du nombre caché change."],
          ["Que se passe-t-il après une erreur ?", "Le jeu dit « essaie encore », le nombre touché est mis de côté et l'enfant choisit de nouveau. Un point n'est compté que pour une bonne réponse du premier coup."],
          ["Le jeu est-il gratuit ? Faut-il un compte ?", numbersFree],
        ],
        more: [numberLink(L, "balloons"), numberLink(L, "count"), numbers(L, "Les nombres de 0 à 20 : fiches et activités")],
      };
    case "compare":
      return {
        how: "",
        learns: "",
        age: "De 3 à 6 ans. La question change entre « plus grand » et « plus petit » : écoutez-la ensemble à chaque manche, c'est souvent là que se trouve la difficulté, plus que dans le comptage.",
        faq: [
          ["Les deux nombres peuvent-ils être égaux ?", "Non, les deux groupes ont toujours des nombres différents, de 1 à 10 : il y a toujours un plus grand et un plus petit."],
          ["Le son marche-t-il sur tous les appareils ?", "La question est lue avec la voix française de l'appareil et reste écrite à l'écran. S'il n'a pas de voix française, un message explique comment en ajouter une."],
          ["Le jeu est-il gratuit ? Faut-il un compte ?", numbersFree],
        ],
        more: [numberLink(L, "count"), numberLink(L, "match"), numbers(L, "Les nombres de 0 à 20 : fiches et activités")],
      };
    case "balloons":
      return {
        how: "",
        learns: "",
        age: "De 3 à 6 ans. Dites chaque nombre ensemble avant de toucher le ballon ; ceux qui connaissent bien 1 à 10 peuvent essayer de tout éclater sans qu'aucun ballon ne se balance.",
        faq: [
          ["Et si l'enfant touche le mauvais ballon ?", "Il se balance et le jeu redit quel nombre chercher ; rien n'est perdu. L'ordre est toujours 1, 2, 3… jusqu'à 10."],
          ["Les ballons changent-ils de place ?", "Oui, à chaque nouvelle partie : il faut retrouver l'ordre parmi des places nouvelles."],
          ["Le jeu est-il gratuit ? Faut-il un compte ?", numbersFree],
        ],
        more: [numberLink(L, "missing"), numberLink(L, "count"), sheets(L, "nombres", "Fiches des nombres de 0 à 10"), numbers(L, "Les nombres de 0 à 20 : fiches et activités")],
      };
    case "puzzles":
      return {
        how: "On choisit une des 24 images. Elle est découpée en carrés, et il en manque un. On touche ou on clique un carré à côté de la case vide pour l'y faire glisser, ou on utilise les flèches du clavier, jusqu'à retrouver la petite image à côté du plateau. Le compteur affiche le nombre de coups. Bloqué ? « Afficher les numéros » numérote les carrés dans l'ordre, le 1 en haut à gauche.",
        learns: "Prévoir quelques coups à l'avance, voir comment les morceaux d'une image s'assemblent, et persévérer jusqu'au bout. Parler de l'image pendant la partie apporte du vocabulaire : chaque scène a neuf choses à nommer.",
        age: "Dès 4 ans. Chaque taquin commence en 3×3 ; passez au 4×4 quand le 3×3 devient facile. Remettez d'abord la ligne du haut, puis la suivante : les deux dernières lignes sont les plus délicates.",
        faq: [
          ["Un taquin peut-il être impossible ?", "Non : chaque taquin est mélangé en faisant glisser les carrés depuis l'image terminée, il peut donc toujours être reconstitué."],
          ["Est-ce que ça marche sur téléphone ?", "Oui, sur téléphone, tablette ou ordinateur : au doigt, à la souris ou avec les flèches."],
          ["Est-ce gratuit ? Faut-il un compte ?", "Oui, les 24 taquins sont gratuits, sans compte et sans rien installer."],
        ],
        more: [puzzle(L, 0), puzzle(L, 1), puzzle(L, 2), { href: localizedPath(L, "/games"), text: "Tous les jeux" }],
      };
    default:
      return null;
  }
}

// ================================================================ Spanish

function spanish(key: LetterKey | NumberGameKey | "puzzles"): GameText | null {
  const L = "es" as const;
  const free = "Sí: es gratis y se juega en esta misma página, sin cuenta y sin instalar nada, en el celular, la tableta o la computadora.";
  const pro = "Es uno de los juegos de AlphaBes Pro: la página muestra un botón para jugar, que lo abre a los suscriptores Pro. Encuentra la letra, La letra y el dibujo y Aplaude las sílabas son gratis para todos.";
  const voice = "El juego usa la voz en español del dispositivo. Si no tiene ninguna, aparece un mensaje que explica cómo agregarla; todo sigue escrito en la pantalla y puedes leerlo en voz alta.";
  const numbersFree = "Sí, todos los juegos de números son gratis y se juegan en la página, sin cuenta, sin reloj y sin instalar nada.";
  switch (key) {
    case "find":
      return {
        how: "Arriba aparece la letra que hay que encontrar, y el botón Escuchar dice «Encuentra la letra…». Debajo hay una cuadrícula de 16 letras, entre ellas la correcta. Al tocarla, el juego dice «¡Muy bien!» y pide la siguiente en voz alta. Si se toca otra, dice su nombre («Esa es la d») y se sigue buscando. El botón MAYÚSCULAS / minúsculas cambia la letra en cualquier momento. Son diez letras y luego el resultado.",
        learns: "Reconocer una letra por su nombre entre las que se le parecen: la cuadrícula mezcla a propósito b, d, p y q, o n, m y ñ. Escuchar el nombre de la letra equivocada ayuda a corregir sin ayuda.",
        age: "De 3 a 5 años. Empiecen con mayúsculas, que se distinguen mejor, y pasen después a minúsculas. Solo cuenta el punto si la letra se encuentra al primer intento: el reto es llegar a diez de diez.",
        faq: [
          ["¿El sonido funciona en todos los dispositivos?", voice],
          ["¿Por qué hay tantas letras parecidas?", "Porque son las que más se confunden al leer: para la n, la cuadrícula trae m, u, h y ñ."],
          ["¿Es gratis? ¿Hace falta una cuenta?", free],
        ],
        more: [gameLink(L, "match"), gameLink(L, "quiz"), sheets(L, "reconocer-letras", "Fichas para reconocer letras"), alphabet(L, "El abecedario, letra por letra")],
      };
    case "match":
      return {
        how: "Aparece una letra en mayúscula y minúscula, con la pregunta «¿Qué dibujo empieza con la letra…?», que el botón Escuchar lee en voz alta. Debajo hay cuatro dibujos sin su nombre. Al tocar el correcto, el juego lo nombra («¡Sí! una ballena»); si no, dice qué es («Eso es un gato») y se intenta otra vez. Son diez rondas y luego el resultado.",
        learns: "Unir una letra con el principio de una palabra, el primer paso para leer. Nunca aparecen juntos dos dibujos que empiezan con el mismo sonido aunque se escriban distinto (b y v, c y s, g y j), así el juego depende del oído y no de la ortografía.",
        age: "De 4 a 6 años. Nombren los cuatro dibujos antes de elegir. Para hacerlo más difícil, pidan otra palabra que empiece con la misma letra.",
        faq: [
          ["¿El sonido funciona en todos los dispositivos?", voice],
          ["¿Cómo se cuentan los puntos?", "Un punto por cada dibujo encontrado al primer intento. Después de un error se puede volver a probar, pero esa ronda ya no suma."],
          ["¿Es gratis? ¿Hace falta una cuenta?", free],
        ],
        more: [gameLink(L, "sound"), gameLink(L, "find"), sheets(L, "primera-silaba", "Fichas de primera sílaba"), alphabet(L, "El abecedario, letra por letra")],
      };
    case "sound":
      return {
        how: "Aparece un dibujo y el botón Escuchar dice su nombre. Hay que elegir, entre cuatro sílabas, la que suena al principio de la palabra: pa de pato. Si se falla, dice la sílaba tocada y repite la palabra. Son diez rondas y luego el resultado.",
        learns: "En español se lee por sílabas, y este juego entrena el oído con la primera. Las opciones mezclan la misma consonante con otra vocal (pa, pe, po) y otra consonante con la misma vocal (pa, ma), así que hay que escuchar las dos letras. Nunca aparecen dos sílabas que suenan igual (ba y va).",
        age: "De 4 a 6 años. Digan la palabra despacio, alargando el principio («paaato»). Si cuesta, jueguen antes a Aplaude las sílabas.",
        faq: [
          ["¿El sonido funciona en todos los dispositivos?", "El juego usa la voz en español del dispositivo. Si no tiene ninguna, aparece un mensaje que explica cómo agregarla. Aquí el nombre del dibujo no está escrito: sin voz, dilo tú en voz alta."],
          ["¿Es gratis?", pro],
          ["¿Qué palabras usa?", "Palabras cuya primera sílaba se escribe como suena, de consonante y vocal (pa, lu) o de una sola vocal (o de oso). Se dejan fuera las que empiezan con h, k, ce, ci, ge o gi."],
        ],
        more: [gameLink(L, "clap"), gameLink(L, "match"), sheets(L, "primera-silaba", "Fichas de primera sílaba"), sheets(L, "silabas", "Fichas de sílabas")],
      };
    case "trace":
      return {
        how: "La letra aparece punteada y se repasa con el dedo, un lápiz táctil o el ratón. Dos botones la cambian: mayúscula o minúscula, y script o cursiva (sobre la doble raya del cuaderno). Escuchar dice su nombre. Las letras van en orden, con la ñ después de la n: 27 en total, con botones para la anterior y la siguiente. Otro botón borra el trazo para volver a empezar.",
        learns: "La forma de las letras y el movimiento para escribirlas, en script y en la letra ligada que se enseña en muchas escuelas. En la pantalla, un error se borra con un toque, lo que da confianza a quien no quiere equivocarse en papel.",
        age: "De 4 a 7 años. Muéstrale primero dónde empieza la letra y trácenla juntos una vez. Después, pasen al papel con las fichas de trazo y de cursiva.",
        faq: [
          ["¿El juego revisa el trazo?", "No, no hay puntaje: tu hijo traza, lo miran juntos y pasan a la siguiente letra."],
          ["¿Está la ñ?", "Sí, después de la n, en mayúscula y minúscula, en script y en cursiva."],
          ["¿Es gratis?", pro],
        ],
        more: [gameLink(L, "find"), gameLink(L, "quiz"), sheets(L, "trazo-de-letras", "Fichas de trazo de letras"), sheets(L, "letra-cursiva", "Fichas de letra cursiva")],
      };
    case "quiz":
      return {
        how: "Diez preguntas de cuatro tipos, al azar: qué letra va después de otra, qué letra se escucha (el botón Escuchar dice su nombre), si es vocal o consonante y con qué letra empieza la palabra de un dibujo. Hay una sola respuesta por pregunta: si falla, aparece la correcta y se pasa a la siguiente. Al final, el resultado sobre diez.",
        learns: "Un repaso de lo que ya sabe: el orden del abecedario (¡después de la n viene la ñ!), el nombre de las letras, vocales y consonantes, y el principio de las palabras. En las preguntas de dibujo, las letras que suenan igual (b y v, c y s) no se ofrecen juntas.",
        age: "De 5 a 7 años, al final del kínder o en primero. Lee las preguntas en voz alta si todavía no lee.",
        faq: [
          ["¿El sonido funciona en todos los dispositivos?", "El juego usa la voz en español del dispositivo. Si no tiene ninguna, aparece un mensaje que explica cómo agregarla. Las preguntas «¿qué letra es?» necesitan el sonido; las demás están escritas."],
          ["¿Un error resta puntos?", "No: cada respuesta correcta suma un punto y un error solo muestra la respuesta correcta."],
          ["¿Es gratis?", pro],
        ],
        more: [gameLink(L, "find"), gameLink(L, "sound"), sheets(L, "reconocer-letras", "Fichas para reconocer letras"), alphabet(L, "El abecedario, letra por letra")],
      };
    case "clap":
      return {
        how: "Aparece una palabra con dos botones: Escuchar la dice entera y «Escuchar por sílabas» la dice separada. Se aplaude una vez por sílaba y se toca el número de palmadas, de 1 a 5. Si se acierta, la palabra aparece en sílabas de colores y el juego las lee; si no, dice «Casi» y la repite por sílabas. «Otra palabra» pasa a la siguiente. Son diez palabras y luego el resultado.",
        learns: "Separar las palabras en sílabas, el ejercicio clásico antes de leer en español. En cada partida salen palabras de una a cinco sílabas, de sol a hipopótamo, así que hay que escuchar de verdad y no adivinar.",
        age: "De 4 a 6 años. Aplaudan juntos la primera vez, diciendo la palabra despacio. Solo suma el punto si se acierta al primer intento.",
        faq: [
          ["¿El sonido funciona en todos los dispositivos?", voice],
          ["¿Por qué la palabra está escrita?", "Para quien ya empieza a leer; pero la respuesta se encuentra escuchando y aplaudiendo, no leyendo. Las sílabas de colores solo aparecen al acertar."],
          ["¿Es gratis? ¿Hace falta una cuenta?", free],
        ],
        more: [gameLink(L, "sound"), gameLink(L, "match"), sheets(L, "silabas", "Fichas de sílabas"), alphabet(L, "El abecedario, letra por letra")],
      };
    case "count":
      return {
        how: "",
        learns: "",
        age: "De 3 a 6 años. Al principio cuenten juntos señalando cada dibujo; cuando del 1 al 5 sea fácil, déjalo contar solo hasta el 10.",
        faq: [
          ["¿El sonido funciona en todos los dispositivos?", "La pregunta se lee con la voz en español del dispositivo y queda escrita en la pantalla. Si no tiene voz en español, un mensaje explica cómo agregarla; el juego funciona igual sin sonido."],
          ["¿Qué pasa después de un error?", "El juego dice «inténtalo otra vez», ese número queda descartado y se elige de nuevo. Solo suma el punto una respuesta correcta al primer intento."],
          ["¿Es gratis? ¿Hace falta una cuenta?", numbersFree],
        ],
        more: [numberLink(L, "match"), numberLink(L, "compare"), sheets(L, "numeros", "Fichas de números"), numbers(L, "Los números del 0 al 20: fichas y actividades")],
      };
    case "missing":
      return {
        how: "",
        learns: "",
        age: "De 3 a 6 años. Las series llegan al 20: primero digan la serie desde el primer número y, más adelante, prueben a decir solo el número de antes y el de después.",
        faq: [
          ["¿Los números siempre van en orden?", "Sí: cinco números seguidos, de uno en uno, entre el 1 y el 20. Solo cambia el lugar del número escondido."],
          ["¿Qué pasa después de un error?", "El juego dice «inténtalo otra vez», ese número queda descartado y se elige de nuevo. Solo suma el punto una respuesta correcta al primer intento."],
          ["¿Es gratis? ¿Hace falta una cuenta?", numbersFree],
        ],
        more: [numberLink(L, "balloons"), numberLink(L, "count"), numbers(L, "Los números del 0 al 20: fichas y actividades")],
      };
    case "compare":
      return {
        how: "",
        learns: "",
        age: "De 3 a 6 años. La pregunta cambia entre «mayor» y «menor»: escúchenla juntos en cada ronda, que muchas veces ahí está la dificultad, más que en contar.",
        faq: [
          ["¿Los dos números pueden ser iguales?", "No, los dos grupos siempre tienen números distintos, del 1 al 10: siempre hay uno mayor y uno menor."],
          ["¿El sonido funciona en todos los dispositivos?", "La pregunta se lee con la voz en español del dispositivo y queda escrita en la pantalla. Si no tiene voz en español, un mensaje explica cómo agregarla."],
          ["¿Es gratis? ¿Hace falta una cuenta?", numbersFree],
        ],
        more: [numberLink(L, "count"), numberLink(L, "match"), numbers(L, "Los números del 0 al 20: fichas y actividades")],
      };
    case "balloons":
      return {
        how: "",
        learns: "",
        age: "De 3 a 6 años. Digan cada número juntos antes de tocar el globo; quien ya domina del 1 al 10 puede intentar reventarlos todos sin que ninguno se tambalee.",
        faq: [
          ["¿Y si toca el globo equivocado?", "Solo se tambalea y el juego repite qué número buscar; no se pierde nada. El orden siempre es 1, 2, 3… hasta el 10."],
          ["¿Los globos cambian de lugar?", "Sí, en cada partida nueva: hay que volver a encontrar el orden entre lugares nuevos."],
          ["¿Es gratis? ¿Hace falta una cuenta?", numbersFree],
        ],
        more: [numberLink(L, "missing"), numberLink(L, "count"), sheets(L, "numeros", "Fichas de números"), numbers(L, "Los números del 0 al 20: fichas y actividades")],
      };
    case "puzzles":
      return {
        how: "Se elige una de las 24 imágenes. Está cortada en cuadros y falta uno. Se toca o se hace clic en un cuadro junto al hueco para deslizarlo, o se usan las flechas del teclado, hasta que la imagen quede como la pequeña que está al lado del tablero. El contador muestra cuántos movimientos se hicieron. ¿Atorado? «Mostrar números» numera los cuadros en orden, el 1 arriba a la izquierda.",
        learns: "Planear algunos movimientos por adelantado, ver cómo encajan las partes de una imagen y no rendirse hasta terminar. Hablar de la imagen mientras se arma suma vocabulario: cada escena tiene nueve cosas que nombrar.",
        age: "Desde los 4 años. Todos empiezan en 3×3; pasen a 4×4 cuando el 3×3 sea fácil. Armen primero la fila de arriba y luego la siguiente: las dos últimas filas son las más difíciles.",
        faq: [
          ["¿Un rompecabezas puede quedar imposible?", "No: cada uno se mezcla deslizando los cuadros desde la imagen terminada, así que siempre se puede armar."],
          ["¿Funciona en el celular?", "Sí, en el celular, la tableta o la computadora: con el dedo, el ratón o las flechas."],
          ["¿Es gratis? ¿Hace falta una cuenta?", "Sí, los 24 rompecabezas son gratis, sin cuenta y sin instalar nada."],
        ],
        more: [puzzle(L, 0), puzzle(L, 1), puzzle(L, 2), { href: localizedPath(L, "/games"), text: "Todos los juegos" }],
      };
    default:
      return null;
  }
}

// ================================================================ Portuguese

function portuguese(key: LetterKey | NumberGameKey | "puzzles"): GameText | null {
  const L = "pt" as const;
  const free = "Sim: é grátis e se joga nesta mesma página, sem conta e sem instalar nada, no celular, no tablet ou no computador.";
  const pro = "É um dos jogos do AlphaBes Pro: a página mostra um botão para jogar, que abre o jogo para assinantes Pro. Encontre a letra, A letra e a figura e Bata palmas são grátis para todos.";
  const voice = "O jogo usa a voz em português do aparelho. Se ele não tiver nenhuma, aparece uma mensagem explicando como adicionar; tudo continua escrito na tela, e você pode ler em voz alta.";
  const numbersFree = "Sim, todos os jogos de números são grátis e se jogam na página, sem conta, sem cronômetro e sem instalar nada.";
  switch (key) {
    case "find":
      return {
        how: "A letra a encontrar aparece no alto, e o botão Ouvir diz “Encontre a letra…”. Embaixo há uma grade de 16 letras, com a certa no meio. Ao tocar nela, o jogo comemora e pede a próxima em voz alta. Se a criança tocar em outra, o jogo diz o nome dela e a busca continua. O botão MAIÚSCULAS / minúsculas troca o tipo de letra a qualquer momento. São dez letras e depois o resultado.",
        learns: "Reconhecer uma letra pelo nome entre as parecidas: a grade mistura de propósito b, d, p e q, ou m, n e u. Ouvir o nome da letra errada ajuda a criança a se corrigir sozinha.",
        age: "De 3 a 5 anos. Comecem pelas maiúsculas, a letra bastão, e depois passem para as minúsculas. O ponto só conta se a letra for achada na primeira tentativa: o desafio é fazer dez de dez.",
        faq: [
          ["O som funciona em todos os aparelhos?", voice],
          ["Por que tantas letras parecidas?", "Porque são as que mais se confundem na leitura: para o b, a grade traz d, p, q e h."],
          ["É grátis? Precisa de conta?", free],
        ],
        more: [gameLink(L, "match"), gameLink(L, "quiz"), sheets(L, "reconhecer-letras", "Atividades para reconhecer letras"), alphabet(L, "O alfabeto, letra por letra")],
      };
    case "match":
      return {
        how: "Aparece uma letra em maiúscula e minúscula, com a pergunta “Que figura começa com a letra…?”, que o botão Ouvir lê em voz alta. Embaixo há quatro figuras sem o nome. Ao tocar na certa, o jogo diz o nome dela; se for outra, diz o que é e a criança tenta de novo. São dez rodadas e depois o resultado.",
        learns: "Ligar uma letra ao começo de uma palavra, o primeiro passo para ler. Nunca aparecem juntas figuras que podem começar com o mesmo som escritas com letras diferentes (c e s, g e j, e e i): o jogo depende do ouvido, não da ortografia.",
        age: "De 4 a 6 anos. Digam o nome das quatro figuras antes de escolher. Para ficar mais difícil, peça outra palavra que comece com a mesma letra.",
        faq: [
          ["O som funciona em todos os aparelhos?", voice],
          ["Como os pontos são contados?", "Um ponto por figura achada na primeira tentativa. Depois de um erro dá para tentar de novo, mas essa rodada não vale mais ponto."],
          ["É grátis? Precisa de conta?", free],
        ],
        more: [gameLink(L, "sound"), gameLink(L, "find"), sheets(L, "silaba-inicial", "Atividades de sílaba inicial"), alphabet(L, "O alfabeto, letra por letra")],
      };
    case "sound":
      return {
        how: "Aparece uma figura e o botão Ouvir diz o nome dela. A criança escolhe, entre quatro sílabas, a que soa no começo da palavra: pa de pato. Se errar, o jogo diz a sílaba tocada e repete a palavra. São dez rodadas e depois o resultado.",
        learns: "Na alfabetização a criança lê pelas famílias silábicas, e o jogo treina o ouvido com a primeira sílaba. As opções misturam a mesma consoante com outra vogal (pa, pe, po) e outra consoante com a mesma vogal (pa, ma): é preciso ouvir as duas letras. Nunca aparecem duas sílabas com o mesmo som (ce e se).",
        age: "De 4 a 6 anos. Digam a palavra devagar, esticando o começo (“paaato”). Se estiver difícil, joguem antes o Bata palmas.",
        faq: [
          ["O som funciona em todos os aparelhos?", "O jogo usa a voz em português do aparelho. Se ele não tiver nenhuma, aparece uma mensagem explicando como adicionar. Aqui o nome da figura não está escrito: sem voz, diga a palavra você mesmo."],
          ["É grátis?", pro],
          ["Que palavras o jogo usa?", "Palavras cuja primeira sílaba se escreve como se fala: consoante e vogal (pa, lu, nha) ou só uma vogal. Ficam de fora as que começam com h, k, ce, ci, ge ou gi."],
        ],
        more: [gameLink(L, "clap"), gameLink(L, "match"), sheets(L, "silaba-inicial", "Atividades de sílaba inicial"), sheets(L, "familias-silabicas", "Atividades de famílias silábicas")],
      };
    case "trace":
      return {
        how: "A letra aparece pontilhada e a criança cobre com o dedo, uma caneta de toque ou o mouse. Dois botões trocam a letra: maiúscula ou minúscula, e de forma ou cursiva (nas linhas de caligrafia do caderno). Ouvir diz o nome dela. As letras vêm em ordem, com o Ç depois do C: 27 no total, com botões para a anterior e a próxima. Outro botão apaga o traço para começar de novo.",
        learns: "A forma das letras e o movimento para escrevê-las, em letra de forma e na cursiva da escola. Na tela, um erro se apaga com um toque, o que dá segurança a quem não gosta de errar no papel.",
        age: "De 4 a 7 anos. Mostre primeiro onde a letra começa e tracem juntos uma vez. Depois passem para o papel com as atividades de letra bastão e de cursiva.",
        faq: [
          ["O jogo confere o traço?", "Não, não há pontuação: a criança traça, vocês olham juntos e passam para a próxima letra."],
          ["Tem o Ç?", "Sim, logo depois do C, em maiúscula e minúscula, em letra de forma e em cursiva."],
          ["É grátis?", pro],
        ],
        more: [gameLink(L, "find"), gameLink(L, "quiz"), sheets(L, "letra-bastao", "Atividades de letra bastão"), sheets(L, "letra-cursiva", "Atividades de letra cursiva")],
      };
    case "quiz":
      return {
        how: "Dez perguntas de quatro tipos, sorteadas: que letra vem depois de outra, que letra se ouve (o botão Ouvir diz o nome dela), se é vogal ou consoante e com que letra começa a palavra de uma figura. Só vale uma resposta por pergunta: se errar, a certa aparece e o quiz segue. No fim, o resultado de zero a dez.",
        learns: "Uma revisão do que a criança já sabe: a ordem do alfabeto, o nome das letras, vogais e consoantes e o começo das palavras. Nas perguntas de figura, letras que podem ter o mesmo som (c e s, g e j) não aparecem juntas.",
        age: "De 5 a 7 anos, no fim da pré-escola ou no 1º ano. Leia as perguntas em voz alta se a criança ainda não lê.",
        faq: [
          ["O som funciona em todos os aparelhos?", "O jogo usa a voz em português do aparelho. Se ele não tiver nenhuma, aparece uma mensagem explicando como adicionar. As perguntas “que letra é esta?” precisam do som; as outras estão escritas."],
          ["Errar tira pontos?", "Não: cada resposta certa vale um ponto, e um erro só mostra a resposta certa."],
          ["É grátis?", pro],
        ],
        more: [gameLink(L, "find"), gameLink(L, "sound"), sheets(L, "reconhecer-letras", "Atividades para reconhecer letras"), alphabet(L, "O alfabeto, letra por letra")],
      };
    case "clap":
      return {
        how: "Aparece uma palavra com dois botões: Ouvir diz a palavra inteira e “Ouvir por sílabas” diz separada. A criança bate uma palma para cada sílaba e toca no número de palmas, de 1 a 5. Se acertar, a palavra aparece em sílabas coloridas e o jogo lê cada uma; se errar, o jogo repete a palavra por sílabas. “Outra palavra” passa para a próxima. São dez palavras e depois o resultado.",
        learns: "Separar as palavras em sílabas, o exercício clássico de consciência fonológica antes de ler. Em cada partida aparecem palavras de uma a cinco sílabas, de sol a hipopótamo: é preciso ouvir de verdade, não adivinhar.",
        age: "De 4 a 6 anos. Batam palmas juntos na primeira vez, dizendo a palavra devagar. O ponto só conta se acertar na primeira tentativa.",
        faq: [
          ["O som funciona em todos os aparelhos?", voice],
          ["Por que a palavra está escrita?", "Para quem já começa a ler; mas a resposta se encontra ouvindo e batendo palmas, não lendo. As sílabas coloridas só aparecem quando a criança acerta."],
          ["É grátis? Precisa de conta?", free],
        ],
        more: [gameLink(L, "sound"), gameLink(L, "match"), sheets(L, "familias-silabicas", "Atividades de famílias silábicas"), alphabet(L, "O alfabeto, letra por letra")],
      };
    case "count":
      return {
        how: "",
        learns: "",
        age: "De 3 a 6 anos. No começo contem juntos, apontando cada desenho; quando de 1 a 5 ficar fácil, deixe a criança contar sozinha até 10.",
        faq: [
          ["O som funciona em todos os aparelhos?", "A pergunta é lida com a voz em português do aparelho e fica escrita na tela. Se ele não tiver voz em português, uma mensagem explica como adicionar; o jogo funciona mesmo sem som."],
          ["O que acontece depois de um erro?", "O jogo diz “tente de novo”, aquele número fica de lado e a criança escolhe outra vez. O ponto só conta para uma resposta certa na primeira tentativa."],
          ["É grátis? Precisa de conta?", numbersFree],
        ],
        more: [numberLink(L, "match"), numberLink(L, "compare"), sheets(L, "numeros", "Atividades de números"), numbers(L, "Os números de 0 a 20: atividades para imprimir")],
      };
    case "missing":
      return {
        how: "",
        learns: "",
        age: "De 3 a 6 anos. As sequências vão até 20: primeiro digam a sequência desde o primeiro número e, depois, tentem dizer só o número de antes e o de depois.",
        faq: [
          ["Os números sempre vêm em ordem?", "Sim: cinco números seguidos, de um em um, entre 1 e 20. Só muda o lugar do número escondido."],
          ["O que acontece depois de um erro?", "O jogo diz “tente de novo”, aquele número fica de lado e a criança escolhe outra vez. O ponto só conta para uma resposta certa na primeira tentativa."],
          ["É grátis? Precisa de conta?", numbersFree],
        ],
        more: [numberLink(L, "balloons"), numberLink(L, "count"), numbers(L, "Os números de 0 a 20: atividades para imprimir")],
      };
    case "compare":
      return {
        how: "",
        learns: "",
        age: "De 3 a 6 anos. A pergunta muda entre “maior” e “menor”: ouçam juntos a cada rodada, porque muitas vezes a dificuldade está aí, mais do que na contagem.",
        faq: [
          ["Os dois números podem ser iguais?", "Não, os dois grupos sempre têm números diferentes, de 1 a 10: sempre há um maior e um menor."],
          ["O som funciona em todos os aparelhos?", "A pergunta é lida com a voz em português do aparelho e fica escrita na tela. Se ele não tiver voz em português, uma mensagem explica como adicionar."],
          ["É grátis? Precisa de conta?", numbersFree],
        ],
        more: [numberLink(L, "count"), numberLink(L, "match"), numbers(L, "Os números de 0 a 20: atividades para imprimir")],
      };
    case "balloons":
      return {
        how: "",
        learns: "",
        age: "De 3 a 6 anos. Digam cada número juntos antes de tocar no balão; quem já sabe bem de 1 a 10 pode tentar estourar todos sem nenhum balançar.",
        faq: [
          ["E se a criança tocar no balão errado?", "Ele só balança e o jogo repete qual número procurar; nada se perde. A ordem é sempre 1, 2, 3… até 10."],
          ["Os balões mudam de lugar?", "Sim, a cada nova partida: é preciso encontrar a ordem de novo em lugares novos."],
          ["É grátis? Precisa de conta?", numbersFree],
        ],
        more: [numberLink(L, "missing"), numberLink(L, "count"), sheets(L, "numeros", "Atividades de números"), numbers(L, "Os números de 0 a 20: atividades para imprimir")],
      };
    case "puzzles":
      return {
        how: "Escolha uma das 24 imagens. Ela está cortada em quadrados e falta um. Toque ou clique num quadrado ao lado do espaço vazio para deslizá-lo, ou use as setas do teclado, até a imagem ficar igual à pequena ao lado do tabuleiro. O contador mostra quantos movimentos foram feitos. Travou? “Mostrar números” numera os quadrados em ordem, com o 1 no alto à esquerda.",
        learns: "Planejar alguns movimentos à frente, ver como as partes de uma imagem se encaixam e persistir até o fim. Conversar sobre a imagem durante o jogo traz vocabulário: cada cena tem nove coisas para nomear.",
        age: "A partir dos 4 anos. Todos começam em 3×3; passem para 4×4 quando o 3×3 ficar fácil. Montem primeiro a fileira de cima, depois a próxima: as duas últimas fileiras são as mais difíceis.",
        faq: [
          ["Um quebra-cabeça pode ficar impossível?", "Não: cada um é embaralhado deslizando os quadrados a partir da imagem pronta, então sempre dá para montar."],
          ["Funciona no celular?", "Sim, no celular, no tablet ou no computador: com o dedo, o mouse ou as setas."],
          ["É grátis? Precisa de conta?", "Sim, os 24 quebra-cabeças são grátis, sem conta e sem instalar nada."],
        ],
        more: [puzzle(L, 0), puzzle(L, 1), puzzle(L, 2), { href: localizedPath(L, "/games"), text: "Todos os jogos" }],
      };
    default:
      return null;
  }
}

// ================================================================ assembly

const TEXTS: Record<Locale, (key: LetterKey | NumberGameKey | "puzzles") => GameText | null> = { en: english, fr: french, es: spanish, pt: portuguese };

function blocks(locale: Locale, t: GameText, how: string, learns: string): Block[] {
  const [h1, h2, h3, h4, h5] = HEADINGS[locale];
  return [
    { id: "how", heading: h1, paragraphs: [[how]] },
    { id: "learns", heading: h2, paragraphs: [[learns]] },
    { id: "age", heading: h3, paragraphs: [[t.age]] },
    { id: "faq", heading: h4, faq: t.faq.map(([q, a]) => ({ q, a: [a] })) },
    { id: "more", heading: h5, list: t.more.map((l): Inline[] => [l]) },
  ];
}

/** The blocks for a letter game page (any language), or [] for an unknown slug. */
export function letterGameGuide(locale: Locale, slug: string): Block[] {
  const g = letterGames(locale).find((x) => x.slug === slug);
  const t = g && TEXTS[locale](g.key);
  return t ? blocks(locale, t, t.how, t.learns) : [];
}

/**
 * The blocks for a number game page. Its "How to play" and "For parents" cards
 * stay as they are (lib/number-games.ts); this adds the age tip, the questions
 * and the links under them.
 */
export function numberGameGuide(locale: Locale, key: NumberGameKey): Block[] {
  // Number Match shares its key with the letter game "match", so its text is in NUMBER_MATCH.
  const t = key === "match" ? NUMBER_MATCH[locale] : TEXTS[locale](key);
  return t ? blocks(locale, t, "", "").slice(2) : [];
}

/** The blocks under the sliding puzzle listing. */
export function puzzleHubGuide(locale: Locale): Block[] {
  const t = TEXTS[locale]("puzzles")!;
  return blocks(locale, t, t.how, t.learns);
}

// Number Match shares its key ("match") with the letter game Match Letter and
// Picture, so its texts live here.
const NUMBER_MATCH: Record<Locale, GameText> = {
  en: {
    how: "",
    learns: "",
    age: "Ages 3 to 6. After each round, show the same number on your own fingers and count them together; a full hand is 5.",
    faq: [
      ["Why dots in rows of five?", "Because children learn to see 5 as a full row (and 10 as two rows) without counting one by one. The fingers work the same way: one full hand is 5."],
      ["Is everything read aloud?", "The number is read with your device's own voice and written big on screen. If a device has no English voice, a message explains how to add one."],
      ["Is it free? Does it need an account?", "Yes, all the number games are free and play on the page, with no account, no timer and nothing to install."],
    ],
    more: [numberLink("en", "count"), numberLink("en", "balloons"), numbers("en", "Numbers 0 to 20: printables and activities")],
  },
  fr: {
    how: "",
    learns: "",
    age: "De 3 à 6 ans. Après chaque manche, montrez le même nombre sur vos doigts et comptez ensemble ; une main entière, c'est 5.",
    faq: [
      ["Pourquoi des points rangés par cinq ?", "Pour que l'enfant voie 5 comme une ligne pleine (et 10 comme deux lignes) sans compter un par un. Les doigts fonctionnent pareil : une main entière, c'est 5."],
      ["Le son marche-t-il sur tous les appareils ?", "Le nombre est lu avec la voix française de l'appareil et s'affiche en grand. S'il n'a pas de voix française, un message explique comment en ajouter une."],
      ["Le jeu est-il gratuit ? Faut-il un compte ?", "Oui, les jeux des nombres sont tous gratuits et se jouent sur la page, sans compte, sans chrono et sans rien installer."],
    ],
    more: [numberLink("fr", "count"), numberLink("fr", "balloons"), sheets("fr", "nombres", "Fiches des nombres de 0 à 10"), numbers("fr", "Les nombres de 0 à 20 : fiches et activités")],
  },
  es: {
    how: "",
    learns: "",
    age: "De 3 a 6 años. Después de cada ronda, muestren el mismo número con sus dedos y cuéntenlo juntos; una mano entera es 5.",
    faq: [
      ["¿Por qué puntos en filas de cinco?", "Para que el niño vea el 5 como una fila llena (y el 10 como dos filas) sin contar uno por uno. Con los dedos pasa lo mismo: una mano entera es 5."],
      ["¿El sonido funciona en todos los dispositivos?", "El número se lee con la voz en español del dispositivo y aparece en grande. Si no tiene voz en español, un mensaje explica cómo agregarla."],
      ["¿Es gratis? ¿Hace falta una cuenta?", "Sí, todos los juegos de números son gratis y se juegan en la página, sin cuenta, sin reloj y sin instalar nada."],
    ],
    more: [numberLink("es", "count"), numberLink("es", "balloons"), sheets("es", "numeros", "Fichas de números"), numbers("es", "Los números del 0 al 20: fichas y actividades")],
  },
  pt: {
    how: "",
    learns: "",
    age: "De 3 a 6 anos. Depois de cada rodada, mostrem o mesmo número nos dedos e contem juntos; uma mão inteira é 5.",
    faq: [
      ["Por que pontos em fileiras de cinco?", "Para a criança ver o 5 como uma fileira cheia (e o 10 como duas fileiras) sem contar um por um. Com os dedos é igual: uma mão inteira é 5."],
      ["O som funciona em todos os aparelhos?", "O número é lido com a voz em português do aparelho e aparece grande na tela. Se ele não tiver voz em português, uma mensagem explica como adicionar."],
      ["É grátis? Precisa de conta?", "Sim, todos os jogos de números são grátis e se jogam na página, sem conta, sem cronômetro e sem instalar nada."],
    ],
    more: [numberLink("pt", "count"), numberLink("pt", "balloons"), sheets("pt", "numeros", "Atividades de números"), numbers("pt", "Os números de 0 a 20: atividades para imprimir")],
  },
};
