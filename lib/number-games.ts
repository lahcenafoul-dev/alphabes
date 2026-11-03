// The five free number games (ages 3–6), in every language: their slugs on
// /games/[slug], the page texts and the cards on the games pages, /numbers
// and the header's Numbers menu. The games themselves are in
// components/number-games/, their rounds in lib/number-games-logic.ts and
// their on-screen words in messages/*.json ("NumberGames").
//
// Each game is the same game in every language, so its slugs form one
// TRANSLATED_PARAMS group (lib/i18n/routes.ts): hreflang, the switcher and
// the sitemap pair them.
import type { Locale } from "@/i18n/routing";

export type NumberGameKey = "count" | "missing" | "match" | "compare" | "balloons";

export const NUMBER_GAME_KEYS: readonly NumberGameKey[] = ["count", "missing", "match", "compare", "balloons"];

export const NUMBER_GAME_SLUGS: Record<NumberGameKey, Record<Locale, string>> = {
  count: { en: "count-and-tap", fr: "compte-et-touche", es: "cuenta-y-toca", pt: "conte-e-toque" },
  missing: { en: "missing-number", fr: "nombre-manquant", es: "numero-que-falta", pt: "numero-que-falta" },
  match: { en: "number-match", fr: "associe-les-nombres", es: "empareja-los-numeros", pt: "combine-os-numeros" },
  compare: { en: "bigger-or-smaller", fr: "plus-grand-plus-petit", es: "mayor-o-menor", pt: "maior-ou-menor" },
  balloons: { en: "balloon-pop", fr: "eclate-les-ballons", es: "revienta-los-globos", pt: "estoure-os-baloes" },
};

type GameText = {
  /** The name, also the h1. */
  title: string;
  /** <title>, before the site name. */
  seoTitle: string;
  /** Meta description and the intro under the h1. */
  description: string;
  /** One line for the cards on the games pages and /numbers. */
  card: string;
  howToPlay: string;
  forParents: string;
};

type PageText = {
  home: string;
  games: string;
  numbers: string;
  howToPlay: string;
  forParents: string;
  /** "Ages 3–6" */
  age: string;
  /** schema.org educationalLevel */
  level: string;
  free: string;
  play: string;
  loading: string;
  /** The section on the games pages and /numbers. */
  sectionHeading: string;
  sectionIntro: string;
  otherGames: string;
  moreNumbers: string;
};

const PAGE: Record<Locale, PageText> = {
  en: {
    home: "Home",
    games: "Games",
    numbers: "Numbers",
    howToPlay: "How to play",
    forParents: "For parents",
    age: "Ages 3–6",
    level: "Preschool and kindergarten",
    free: "Free",
    play: "Play",
    loading: "Loading game…",
    sectionHeading: "Number games",
    sectionIntro:
      "Five free games for counting and the numbers 1 to 20. Every instruction is read aloud, there is no timer, and a wrong tap just means “try again”.",
    otherGames: "More number games",
    moreNumbers: "Numbers 0 to 20: printables and activities",
  },
  fr: {
    home: "Accueil",
    games: "Jeux",
    numbers: "Nombres",
    howToPlay: "Comment jouer",
    forParents: "Pour les parents",
    age: "3 à 6 ans",
    level: "Maternelle",
    free: "Gratuit",
    play: "Jouer",
    loading: "Chargement du jeu…",
    sectionHeading: "Jeux sur les nombres",
    sectionIntro:
      "Cinq jeux gratuits pour compter et connaître les nombres jusqu'à 20. Les consignes sont lues à voix haute, il n'y a pas de chrono, et une erreur veut seulement dire « essaie encore ».",
    otherGames: "D'autres jeux sur les nombres",
    moreNumbers: "Les nombres de 0 à 20 : fiches et activités",
  },
  es: {
    home: "Inicio",
    games: "Juegos",
    numbers: "Números",
    howToPlay: "Cómo se juega",
    forParents: "Para las familias",
    age: "3 a 6 años",
    level: "Preescolar",
    free: "Gratis",
    play: "Jugar",
    loading: "Cargando el juego…",
    sectionHeading: "Juegos de números",
    sectionIntro:
      "Cinco juegos gratis para contar y conocer los números hasta el 20. Las instrucciones se escuchan en voz alta, no hay reloj y equivocarse solo significa «inténtalo otra vez».",
    otherGames: "Más juegos de números",
    moreNumbers: "Los números del 0 al 20: fichas y actividades",
  },
  pt: {
    home: "Início",
    games: "Jogos",
    numbers: "Números",
    howToPlay: "Como jogar",
    forParents: "Para a família",
    age: "3 a 6 anos",
    level: "Educação infantil",
    free: "Grátis",
    play: "Jogar",
    loading: "Carregando o jogo…",
    sectionHeading: "Jogos de números",
    sectionIntro:
      "Cinco jogos grátis para contar e conhecer os números até 20. As instruções são lidas em voz alta, não tem cronômetro e errar só quer dizer “tente de novo”.",
    otherGames: "Mais jogos de números",
    moreNumbers: "Os números de 0 a 20: atividades para imprimir",
  },
};

const GAMES: Record<Locale, Record<NumberGameKey, GameText>> = {
  en: {
    count: {
      title: "Count and Tap",
      seoTitle: "Count and Tap: Free Counting Game for Kids (1 to 10)",
      description:
        "A free counting game for preschool: count the cute animals and pictures, from 1 to 10, then tap the right number. Read aloud, no timer, for ages 3 to 6.",
      card: "Count the pictures, then tap the right number.",
      howToPlay:
        "Count the pictures in the box, pointing at each one. Then tap the number that says how many there are, among three. A wrong tap says “try again”; a right one gets a cheer and a Next button. Ten rounds, then play again.",
      forParents:
        "Counting objects one by one and knowing that the last number said is “how many” is the base of all early maths. Let your child touch the screen for each picture while counting out loud, and stay with 1 to 5 until it feels easy.",
    },
    missing: {
      title: "Missing Number",
      seoTitle: "Missing Number Game: Number Order 1 to 20 for Kids",
      description:
        "A free number order game: five numbers in a row from 1 to 20, one is hiding. Tap the missing number among three. Read aloud, no timer, for ages 4 to 6.",
      card: "Find the number hiding in a row from 1 to 20.",
      howToPlay:
        "Five numbers sit in a row, counting up, and one of them is a question mark. Say the row out loud, then tap the number that goes in the gap. Ten rounds, then play again.",
      forParents:
        "Knowing what comes before and after a number helps children count on instead of always starting from 1. If it's hard, count the row together from the first number and stop at the gap.",
    },
    match: {
      title: "Number Match",
      seoTitle: "Number Match: Match Numbers to Dots and Fingers (1 to 10)",
      description:
        "A free matching game: see a number from 1 to 10 and tap the group of dots or the hands holding up that many fingers. Read aloud, no timer, for ages 3 to 6.",
      card: "Match each number to its dots or fingers.",
      howToPlay:
        "A big number is shown and read aloud. Below are three groups: dots, or hands holding up fingers. Tap the group with that many. Ten rounds, then play again.",
      forParents:
        "Dots in rows of five and fingers on two hands help children see a quantity at a glance (5 is a full row, a full hand) instead of counting one by one. Show the same number on your own fingers afterwards.",
    },
    compare: {
      title: "Bigger or Smaller",
      seoTitle: "Bigger or Smaller: Free Number Comparison Game for Kids",
      description:
        "A free game to compare numbers from 1 to 10: two groups of pictures, each with its number. Tap the bigger or the smaller one, as asked. For ages 3 to 6.",
      card: "Two groups: tap the bigger number, or the smaller one.",
      howToPlay:
        "Two groups of pictures appear, each with its number. Listen to the question: tap the bigger number, or the smaller number. The question changes from round to round, so listen well! Ten rounds, then play again.",
      forParents:
        "Comparing amounts comes before adding and taking away. Ask “how do you know?”: counting both groups, or seeing that one group is longer, are both good answers.",
    },
    balloons: {
      title: "Balloon Pop",
      seoTitle: "Balloon Pop: Pop the Numbers 1 to 10 in Order",
      description:
        "A free number order game: ten balloons with the numbers 1 to 10. Pop them in order, 1, 2, 3… up to 10. Each number is read aloud, no timer, for ages 3 to 6.",
      card: "Pop the balloons in order, from 1 to 10.",
      howToPlay:
        "Ten balloons float with the numbers 1 to 10, all mixed up. Pop number 1 first, then 2, then 3, and so on up to 10. Each pop says the number. Tap a balloon out of order and it just wobbles. Then play again with new places.",
      forParents:
        "Finding each number among the others practises reading numerals and saying the counting sequence in order. Count along with your child at each pop.",
    },
  },
  fr: {
    count: {
      title: "Compte et touche",
      seoTitle: "Compte et touche : jeu gratuit pour apprendre à compter jusqu'à 10",
      description:
        "Un jeu gratuit pour apprendre à compter en maternelle : compte les animaux et les dessins, de 1 à 10, puis touche le bon nombre. Lu à voix haute, sans chrono.",
      card: "Compte les dessins, puis touche le bon nombre.",
      howToPlay:
        "Compte les dessins un par un, en les montrant du doigt. Touche ensuite le nombre qui dit combien il y en a, parmi trois. Une erreur ? Le jeu dit « essaie encore ». La bonne réponse fait la fête et affiche « Suivant ». Dix manches, puis on rejoue.",
      forParents:
        "Compter les objets un par un et comprendre que le dernier nombre dit donne « combien il y en a », c'est la base des premiers apprentissages en mathématiques. Laissez l'enfant toucher chaque dessin en comptant à voix haute, et restez sur 1 à 5 tant que ce n'est pas facile.",
    },
    missing: {
      title: "Le nombre manquant",
      seoTitle: "Le nombre manquant : jeu gratuit sur la suite des nombres jusqu'à 20",
      description:
        "Cinq nombres qui se suivent, de 1 à 20, et l'un d'eux se cache : touche le nombre manquant. Un jeu gratuit lu à voix haute, sans chrono, pour la maternelle.",
      card: "Retrouve le nombre caché dans une suite jusqu'à 20.",
      howToPlay:
        "Cinq nombres se suivent et l'un d'eux est remplacé par un point d'interrogation. Lis la suite à voix haute, puis touche le nombre qui va dans la case vide. Dix manches, puis on rejoue.",
      forParents:
        "Savoir ce qui vient avant et après un nombre permet de compter à partir de n'importe quel nombre, sans toujours repartir de 1. Si c'est difficile, récitez la suite ensemble depuis le premier nombre et arrêtez-vous sur la case vide.",
    },
    match: {
      title: "Associe les nombres",
      seoTitle: "Associe les nombres : jeu gratuit des nombres, points et doigts (1 à 10)",
      description:
        "Un nombre de 1 à 10 et trois groupes de points ou de doigts levés : touche le bon groupe. Un jeu gratuit lu à voix haute, sans chrono, pour la maternelle.",
      card: "Associe chaque nombre à ses points ou à ses doigts.",
      howToPlay:
        "Un grand nombre s'affiche et se lit à voix haute. En dessous, trois groupes : des points, ou des mains qui lèvent des doigts. Touche le groupe qui en a autant. Dix manches, puis on rejoue.",
      forParents:
        "Les points rangés par cinq et les doigts des deux mains aident l'enfant à reconnaître une quantité d'un coup d'œil (5, c'est une ligne pleine, une main entière) sans tout recompter. Montrez ensuite le même nombre sur vos doigts.",
    },
    compare: {
      title: "Plus grand, plus petit",
      seoTitle: "Plus grand, plus petit : jeu gratuit pour comparer les nombres",
      description:
        "Deux groupes de dessins, chacun avec son nombre de 1 à 10 : touche le plus grand ou le plus petit, selon la consigne. Un jeu gratuit lu à voix haute.",
      card: "Deux groupes : touche le plus grand nombre, ou le plus petit.",
      howToPlay:
        "Deux groupes de dessins apparaissent, chacun avec son nombre. Écoute bien la question : touche le plus grand nombre, ou le plus petit. La question change d'une manche à l'autre ! Dix manches, puis on rejoue.",
      forParents:
        "Comparer des quantités vient avant l'addition et la soustraction. Demandez « comment tu le sais ? » : compter les deux groupes ou voir qu'un groupe est plus long sont deux bonnes réponses.",
    },
    balloons: {
      title: "Éclate les ballons",
      seoTitle: "Éclate les ballons : jeu gratuit des nombres de 1 à 10 dans l'ordre",
      description:
        "Dix ballons numérotés de 1 à 10 : éclate-les dans l'ordre, 1, 2, 3… jusqu'à 10. Un jeu gratuit sur l'ordre des nombres, lu à voix haute, sans chrono.",
      card: "Éclate les ballons dans l'ordre, de 1 à 10.",
      howToPlay:
        "Dix ballons flottent avec les nombres de 1 à 10, tout mélangés. Éclate d'abord le 1, puis le 2, puis le 3, et ainsi de suite jusqu'à 10. Chaque ballon éclaté dit son nombre ; un ballon touché trop tôt se balance, sans plus. Puis on rejoue avec de nouvelles places.",
      forParents:
        "Retrouver chaque nombre parmi les autres fait travailler la lecture des chiffres et la comptine numérique dans l'ordre. Comptez à voix haute avec l'enfant à chaque ballon.",
    },
  },
  es: {
    count: {
      title: "Cuenta y toca",
      seoTitle: "Cuenta y toca: juego gratis para aprender a contar del 1 al 10",
      description:
        "Un juego gratis para aprender a contar: cuenta los animalitos y los dibujos, del 1 al 10, y toca el número correcto. En voz alta y sin reloj.",
      card: "Cuenta los dibujos y toca el número correcto.",
      howToPlay:
        "Cuenta los dibujos uno por uno, señalando cada uno. Después toca el número que dice cuántos hay, entre tres. Si te equivocas, el juego dice «inténtalo otra vez». Si aciertas, hay festejo y aparece «Siguiente». Diez rondas y a jugar de nuevo.",
      forParents:
        "Contar objetos uno por uno y entender que el último número que se dice es «cuántos hay» es la base de las matemáticas. Dejen que su hijo toque cada dibujo mientras cuenta en voz alta, y quédense del 1 al 5 hasta que le resulte fácil.",
    },
    missing: {
      title: "El número que falta",
      seoTitle: "El número que falta: juego gratis de la serie numérica hasta el 20",
      description:
        "Un juego gratis de la serie numérica: cinco números seguidos, del 1 al 20, y uno se escondió. Toca el número que falta. Instrucciones en voz alta, sin reloj.",
      card: "Encuentra el número escondido en una serie hasta el 20.",
      howToPlay:
        "Hay cinco números en fila, uno detrás de otro, y en lugar de uno hay un signo de pregunta. Di la fila en voz alta y toca el número que va en el hueco. Diez rondas y a jugar de nuevo.",
      forParents:
        "Saber qué número va antes y después ayuda a contar desde cualquier número, sin empezar siempre desde el 1. Si le cuesta, cuenten juntos la fila desde el primer número y paren en el hueco.",
    },
    match: {
      title: "Empareja los números",
      seoTitle: "Empareja los números: juego gratis de números, puntos y dedos (1 al 10)",
      description:
        "Un número del 1 al 10 y tres grupos de puntos o de dedos: toca el grupo correcto. Un juego gratis para preescolar, en voz alta y sin reloj.",
      card: "Empareja cada número con sus puntos o sus dedos.",
      howToPlay:
        "Aparece un número grande y se escucha en voz alta. Abajo hay tres grupos: puntos, o manos que levantan dedos. Toca el grupo que tiene esa cantidad. Diez rondas y a jugar de nuevo.",
      forParents:
        "Los puntos en filas de cinco y los dedos de las dos manos ayudan a ver una cantidad de un vistazo (5 es una fila llena, una mano entera) sin contar uno por uno. Después, muestren el mismo número con sus dedos.",
    },
    compare: {
      title: "Mayor o menor",
      seoTitle: "Mayor o menor: juego gratis para comparar números del 1 al 10",
      description:
        "Dos grupos de dibujos, cada uno con su número del 1 al 10: toca el mayor o el menor, según la pregunta. Un juego gratis en voz alta, sin reloj.",
      card: "Dos grupos: toca el número mayor o el menor.",
      howToPlay:
        "Aparecen dos grupos de dibujos, cada uno con su número. Escucha bien la pregunta: toca el número mayor o el número menor. ¡La pregunta cambia de una ronda a otra! Diez rondas y a jugar de nuevo.",
      forParents:
        "Comparar cantidades viene antes de sumar y restar. Pregúntenle «¿cómo lo sabes?»: contar los dos grupos o ver que un grupo es más largo son buenas respuestas.",
    },
    balloons: {
      title: "Revienta los globos",
      seoTitle: "Revienta los globos: juego gratis de los números del 1 al 10 en orden",
      description:
        "Diez globos con los números del 1 al 10: reviéntalos en orden, 1, 2, 3… hasta el 10. Un juego gratis del orden de los números, en voz alta.",
      card: "Revienta los globos en orden, del 1 al 10.",
      howToPlay:
        "Diez globos flotan con los números del 1 al 10, todos revueltos. Revienta primero el 1, luego el 2, luego el 3, y así hasta el 10. Cada globo que revientas dice su número; si tocas uno antes de tiempo, solo se mueve. Y a jugar de nuevo con los globos en otro lugar.",
      forParents:
        "Buscar cada número entre los demás practica la lectura de los números y la serie numérica en orden. Cuenten en voz alta con su hijo en cada globo.",
    },
  },
  pt: {
    count: {
      title: "Conte e toque",
      seoTitle: "Conte e toque: jogo grátis para aprender a contar de 1 a 10",
      description:
        "Um jogo grátis para aprender a contar: conte os bichinhos e os desenhos, de 1 a 10, e toque no número certo. Em voz alta e sem cronômetro.",
      card: "Conte os desenhos e toque no número certo.",
      howToPlay:
        "Conte os desenhos um por um, apontando cada um. Depois toque no número que diz quantos são, entre três. Se errar, o jogo diz “tente de novo”. Se acertar, tem festa e aparece “Próximo”. São dez rodadas, e depois é só jogar de novo.",
      forParents:
        "Contar objetos um por um e entender que o último número falado é “quantos são” é a base da matemática. Deixe a criança tocar em cada desenho enquanto conta em voz alta, e fiquem no 1 a 5 até ficar fácil.",
    },
    missing: {
      title: "Número que falta",
      seoTitle: "Número que falta: jogo grátis da sequência numérica até 20",
      description:
        "Cinco números em seguida, de 1 a 20, e um deles se escondeu: toque no número que falta. Um jogo grátis em voz alta, sem cronômetro.",
      card: "Descubra o número escondido numa sequência até 20.",
      howToPlay:
        "Cinco números aparecem em fila, um depois do outro, e no lugar de um deles tem um ponto de interrogação. Fale a sequência em voz alta e toque no número que vai no espaço vazio. São dez rodadas, e depois é só jogar de novo.",
      forParents:
        "Saber o que vem antes e depois de um número ajuda a contar a partir de qualquer número, sem voltar sempre ao 1. Se estiver difícil, contem juntos desde o primeiro número e parem no espaço vazio.",
    },
    match: {
      title: "Combine os números",
      seoTitle: "Combine os números: jogo grátis de números, bolinhas e dedos (1 a 10)",
      description:
        "Um número de 1 a 10 e três grupos de bolinhas ou de dedos: toque no grupo certo. Um jogo grátis para a educação infantil, em voz alta.",
      card: "Combine cada número com as bolinhas ou os dedos.",
      howToPlay:
        "Aparece um número grande, lido em voz alta. Embaixo, três grupos: bolinhas, ou mãos levantando dedos. Toque no grupo que tem essa quantidade. São dez rodadas, e depois é só jogar de novo.",
      forParents:
        "As bolinhas em fileiras de cinco e os dedos das duas mãos ajudam a ver uma quantidade de relance (5 é uma fileira cheia, uma mão inteira) sem contar um por um. Depois, mostrem o mesmo número nos dedos.",
    },
    compare: {
      title: "Maior ou menor",
      seoTitle: "Maior ou menor: jogo grátis para comparar números de 1 a 10",
      description:
        "Dois grupos de desenhos, cada um com o seu número de 1 a 10: toque no maior ou no menor, conforme a pergunta. Um jogo grátis em voz alta.",
      card: "Dois grupos: toque no número maior ou no menor.",
      howToPlay:
        "Aparecem dois grupos de desenhos, cada um com o seu número. Escute bem a pergunta: toque no número maior ou no número menor. A pergunta muda de uma rodada para outra! São dez rodadas, e depois é só jogar de novo.",
      forParents:
        "Comparar quantidades vem antes de somar e subtrair. Pergunte “como você sabe?”: contar os dois grupos ou ver que um grupo é mais comprido são boas respostas.",
    },
    balloons: {
      title: "Estoure os balões",
      seoTitle: "Estoure os balões: jogo grátis dos números de 1 a 10 em ordem",
      description:
        "Um jogo grátis da ordem dos números: dez balões com os números de 1 a 10. Estoure em ordem, 1, 2, 3… até 10. Cada número é lido em voz alta, sem cronômetro.",
      card: "Estoure os balões em ordem, de 1 a 10.",
      howToPlay:
        "Dez balões flutuam com os números de 1 a 10, todos misturados. Estoure primeiro o 1, depois o 2, depois o 3, e assim por diante até o 10. Cada balão estourado fala o seu número; se tocar num balão fora da ordem, ele só balança. Depois é só jogar de novo com os balões em outros lugares.",
      forParents:
        "Procurar cada número entre os outros treina a leitura dos números e a sequência numérica em ordem. Contem em voz alta junto com a criança a cada balão.",
    },
  },
};

export type NumberGame = GameText & { key: NumberGameKey; slug: string };

export function numberGames(locale: Locale): NumberGame[] {
  return NUMBER_GAME_KEYS.map((key) => ({ key, slug: NUMBER_GAME_SLUGS[key][locale], ...GAMES[locale][key] }));
}

/** The number game with this slug in this language, or null. */
export function getNumberGame(locale: Locale, slug: string): NumberGame | null {
  return numberGames(locale).find((g) => g.slug === slug) ?? null;
}

export function numberGamePage(locale: Locale): PageText {
  return PAGE[locale];
}

/** The groups for TRANSLATED_PARAMS: one per game, its slug in every language. */
export const NUMBER_GAME_GROUPS: Record<Locale, string>[] = NUMBER_GAME_KEYS.map((key) => ({ ...NUMBER_GAME_SLUGS[key] }));
