// The words of the Pro packs' own pages (scripts/sheets/packs.ts): cover,
// contents, "How to use this pack", answer keys, certificate and the
// printable sliding puzzles. Written for each language, not translated word
// for word.
import type { PackKind } from "../../lib/sheets/packs";
import type { SheetLocale } from "../../lib/sheets/types";

export type PackText = {
  pro: string;
  /** Footer, left: the site, for Pro members. */
  site: string;
  /** Footer, right. */
  page: (n: number) => string;
  /** "80 worksheets", "24 puzzles". */
  count: (n: number, kind: PackKind | "mega") => string;
  keys: string;
  certificate: string;
  /** "Part 2 of 3: Art and drawing". */
  part: (n: number, of: number, name: string) => string;
  contents: string;
  contentsIntro: string;
  answerKeys: string;
  howTitle: string;
  howIntro: string;
  /** Tips for every pack, after the type's own. */
  /** The third tip is about the answer keys: packs without keys leave it out. */
  howGeneral: string[];
  /** Each type's tips, and a one-line summary for the Mega pack. */
  howKind: Record<PackKind, { line: string; tips: string[] }>;
  keyTitle: (kindName: string) => string;
  keyInstruction: string;
  /** Under each small answer key: the sheet's title and page. */
  keyCaption: (title: string, page: number) => string;
  certTitle: string;
  certGreat: string;
  /** "Missing Numbers pack", "Missing Numbers pack (Numbers 1 to 20)". */
  packName: (name: string, sub?: string) => string;
  certFinished: (pack: string) => string;
  certDate: string;
  certSigned: string;
  puzzle: {
    cut: (name: string, size: number) => string;
    cutInstruction: string;
    board: (name: string) => string;
    boardInstruction: string;
    model: string;
  };
};

export const PACK_TEXT: Record<SheetLocale, PackText> = {
  en: {
    pro: "AlphaBes Pro",
    site: "alphabes.com · AlphaBes Pro",
    page: (n) => `Page ${n}`,
    count: (n, kind) => `${n} ${kind === "sliding-puzzles" ? "picture puzzles" : kind === "flash-cards" ? "card sets" : kind === "origami" ? "models to fold" : "worksheets"}`,
    keys: "Answer keys",
    certificate: "Certificate",
    part: (n, of, name) => `Part ${n} of ${of}: ${name}`,
    contents: "What's inside",
    contentsIntro: "Print the whole pack, or just the pages you need today.",
    answerKeys: "Answer keys",
    howTitle: "How to use this pack",
    howIntro: "These worksheets go from easier to harder. Short, happy sessions work better than long ones: one or two pages a day is plenty.",
    howGeneral: [
      "Print at 100% (\"Actual size\"), not \"Fit to page\", so boxes and lines keep their size.",
      "Let your child write their name and the date on each sheet: it's a small habit that builds pride.",
      "Check the work together with the answer keys at the end, and praise the effort, not only the right answers.",
      "When the pack is done, fill in the certificate on the last page and put it on the fridge!",
    ],
    howKind: {
      "missing-numbers": {
        line: "Missing numbers: count along and write the number that's missing, from 10 up to 100.",
        tips: [
          "Start with the numbers to 10 and say each number out loud while pointing at it.",
          "If a gap is hard, count from the number before it, using fingers or small objects.",
          "The hundred charts and skip counting at the end are for children who count to 100 confidently.",
        ],
      },
      patterns: {
        line: "Patterns: find what repeats and what comes next, from AB to growing patterns.",
        tips: [
          "Read each row aloud together (\"apple, banana, apple, banana…\"): hearing the rhythm helps.",
          "Each pattern type has \"circle\" sheets first, then \"draw\" sheets with empty boxes to fill.",
          "Growing patterns add one picture each time: count the pictures in each box.",
        ],
      },
      stickers: {
        line: "Sticker sheets: print on sticker paper or plain paper, cut out, and use as rewards.",
        tips: [
          "Print on full-sheet sticker paper (A4 or Letter) for real stickers, or on plain paper with a glue stick.",
          "Let your child choose a sticker after each finished worksheet.",
          "The letter and number stickers are great for labelling boxes and drawings.",
        ],
      },
      "dot-to-dot": {
        line: "Dot to dot: join the dots in order to reveal a picture, then color it.",
        tips: [
          "Start at the star and say each number as you reach it.",
          "Easy pictures go to 10, medium to 20, hard to 50, and the last ones follow the alphabet.",
          "The small picture in the corner shows what will appear: use it to color.",
        ],
      },
      colouring: {
        line: "Coloring: color by number with a color key, then free coloring pages.",
        tips: [
          "On color-by-number pages, find number 1 in the key, color every 1, then go on to 2.",
          "Colored pencils work best for small areas; crayons are fine for the big ones.",
          "Free coloring pages have no right answer: any color is a good color!",
        ],
      },
      "how-to-draw": {
        line: "How to draw: copy a picture step by step, one new line at a time.",
        tips: [
          "The new line of each step is in pink: draw only that line, then go to the next box.",
          "Use a pencil first, so mistakes are easy to rub out, then go over it with a felt pen.",
          "There's a big box at the bottom for drawing the whole picture again.",
        ],
      },
      "body-parts": {
        line: "Body parts: name the parts of a body, a face, a hand, animals and a plant.",
        tips: [
          "Point to each part on the picture, then on your own body (\"Where's your elbow?\").",
          "On \"label\" sheets, copy the words from the word bank; on \"match\" sheets, draw a line.",
          "Talk about what each part does: we see with our eyes, a fish swims with its fins.",
        ],
      },
      "flash-cards": {
        line: "Flash cards: picture cards to cut out for games and new words.",
        tips: [
          "Print on card stock if you can, and cut along the dashed lines.",
          "Play memory with two copies, or hide a card and guess which one is missing.",
          "Keep each set in an envelope with its name on it.",
        ],
      },
      "telling-time": {
        line: "Telling time: read clocks and draw the hands, from o'clock to any minute.",
        tips: [
          "Begin with o'clock and half past, and use a real clock at home to show the same times.",
          "The short hand shows the hour, the long hand the minutes: say it every time.",
          "The daily routine sheets connect times to your child's own day.",
        ],
      },
      mazes: {
        line: "Mazes: find the way from start to finish, from easy to hard.",
        tips: [
          "Trace the path with a finger first, then with a pencil.",
          "Dead ends are part of the fun: go back and try another way.",
          "Easy mazes have wide paths for young hands; hard mazes have more turns.",
        ],
      },
      "tracing-lines": {
        line: "Tracing lines: follow the dashed lines to train the hand for writing.",
        tips: [
          "Start at the green dot and follow the arrow, without lifting the pencil if possible.",
          "Hold the pencil near the tip, with the paper turned a little for comfort.",
          "Lines and shapes come first; picture tracing comes after, with a model to color.",
        ],
      },
      origami: {
        line: "Origami: fold a square of paper step by step into animals and other models.",
        tips: [
          "Use a square of paper, colored on one side (15 cm or 6 inches is a good size).",
          "Fold together at first: show the step on your own paper, then let your child copy it.",
          "Press each crease flat with a fingernail, and compare with the next picture.",
        ],
      },
      "sliding-puzzles": {
        line: "Sliding puzzles: cut a picture into squares, take one out, and slide the others back.",
        tips: [
          "Cut along the dashed lines (a grown-up can help) and lay the pieces on the board.",
          "Take out the last piece, mix up the others, then slide them one at a time into place.",
          "Start with 3 × 3; the 4 × 4 puzzle has smaller pieces and is much harder.",
        ],
      },
    },
    keyTitle: (kind) => `Answer key: ${kind}`,
    keyInstruction: "Answers in red. Each key shows the page of its worksheet.",
    keyCaption: (title, page) => `${title} · page ${page}`,
    certTitle: "Certificate",
    certGreat: "Great job,",
    packName: (name, sub) => (name.endsWith("pack") ? name : `${name} pack`) + (sub ? ` (${sub})` : ""),
    certFinished: (pack) => `You finished the ${pack}!`,
    certDate: "Date",
    certSigned: "Signed",
    puzzle: {
      cut: (name, size) => `${name}: ${size} × ${size} Puzzle`,
      cutInstruction: "Cut along the dashed lines. Put the pieces on the board, take out the last one, mix them up, and slide them back.",
      board: (name) => `${name}: Puzzle Board`,
      boardInstruction: "Lay your pieces here. Slide a piece into the empty space, one at a time, until the picture is back.",
      model: "Your picture",
    },
  },
  fr: {
    pro: "AlphaBes Pro",
    site: "alphabes.com/fr · AlphaBes Pro",
    page: (n) => `Page ${n}`,
    count: (n, kind) => `${n} ${kind === "sliding-puzzles" ? "taquins" : kind === "flash-cards" ? "jeux de cartes" : kind === "origami" ? "modèles à plier" : "fiches"}`,
    keys: "Corrigés",
    certificate: "Diplôme",
    part: (n, of, name) => `Partie ${n} sur ${of} : ${name}`,
    contents: "Sommaire",
    contentsIntro: "Imprimez tout le pack, ou seulement les pages du jour.",
    answerKeys: "Corrigés",
    howTitle: "Comment utiliser ce pack",
    howIntro: "Les fiches vont du plus facile au plus difficile. De courtes séances qui se passent bien valent mieux qu'une longue : une ou deux pages par jour suffisent.",
    howGeneral: [
      "Imprimez à 100 % (« Taille réelle »), et non « Ajuster à la page », pour garder la taille des cases et des lignes.",
      "Laissez votre enfant écrire son prénom et la date sur chaque fiche : une petite habitude dont il sera fier.",
      "Vérifiez ensemble avec les corrigés à la fin du pack, et félicitez l'effort, pas seulement les bonnes réponses.",
      "Quand le pack est terminé, remplissez le diplôme de la dernière page et affichez-le sur le frigo !",
    ],
    howKind: {
      "missing-numbers": {
        line: "Nombres manquants : compter et écrire le nombre qui manque, jusqu'à 10, puis jusqu'à 100.",
        tips: [
          "Commencez par les nombres jusqu'à 10, en disant chaque nombre à voix haute et en le montrant du doigt.",
          "Si une case résiste, recomptez depuis le nombre d'avant, avec les doigts ou de petits objets.",
          "Les tableaux de 100 et les comptages par bonds, à la fin, sont pour les enfants qui comptent déjà bien jusqu'à 100.",
        ],
      },
      patterns: {
        line: "Suites logiques : repérer ce qui se répète et trouver la suite, de AB aux suites qui grandissent.",
        tips: [
          "Lisez chaque ligne à voix haute ensemble (« pomme, banane, pomme, banane… ») : le rythme aide à trouver.",
          "Pour chaque type de suite, les fiches « entoure » viennent d'abord, puis les fiches « dessine » avec des cases vides.",
          "Dans les suites qui grandissent, il y a une image de plus à chaque fois : comptez les images de chaque case.",
        ],
      },
      stickers: {
        line: "Gommettes : à imprimer sur papier autocollant ou normal, à découper, pour récompenser.",
        tips: [
          "Imprimez sur des planches autocollantes A4 pour de vraies gommettes, ou sur du papier normal avec un bâton de colle.",
          "Laissez votre enfant choisir une gommette après chaque fiche terminée.",
          "Les gommettes lettres et chiffres sont parfaites pour décorer des boîtes et des dessins.",
        ],
      },
      "dot-to-dot": {
        line: "Points à relier : relier les points dans l'ordre pour faire apparaître un dessin, puis le colorier.",
        tips: [
          "On part de l'étoile et on dit chaque nombre en arrivant dessus.",
          "Les dessins faciles vont jusqu'à 10, les moyens jusqu'à 20, les difficiles jusqu'à 50, et les derniers suivent l'alphabet.",
          "Le petit dessin dans le coin montre ce qui va apparaître : il sert aussi de modèle pour colorier.",
        ],
      },
      colouring: {
        line: "Coloriages : des coloriages magiques avec leur légende, puis des coloriages libres.",
        tips: [
          "Pour un coloriage magique, cherchez le 1 dans la légende, coloriez tous les 1, puis passez au 2.",
          "Les crayons de couleur sont parfaits pour les petites zones, les gros feutres pour les grandes.",
          "Dans les coloriages libres, il n'y a pas de bonne réponse : toutes les couleurs sont permises !",
        ],
      },
      "how-to-draw": {
        line: "Apprendre à dessiner : recopier un dessin étape par étape, un trait nouveau à la fois.",
        tips: [
          "Le trait nouveau de chaque étape est en rose : on ne dessine que lui, puis on passe à la case suivante.",
          "Dessinez d'abord au crayon, pour pouvoir gommer, puis repassez au feutre.",
          "La grande case du bas sert à refaire tout le dessin.",
        ],
      },
      "body-parts": {
        line: "Parties du corps : nommer les parties du corps, du visage, de la main, d'animaux et d'une plante.",
        tips: [
          "Montrez chaque partie sur le dessin, puis sur votre corps (« Où est ton coude ? »).",
          "Sur les fiches « nomme », on recopie les mots de la liste ; sur les fiches « relie », on trace un trait.",
          "Parlez de ce que fait chaque partie : on voit avec les yeux, le poisson nage avec ses nageoires.",
        ],
      },
      "flash-cards": {
        line: "Cartes images : des cartes à découper pour jouer et apprendre de nouveaux mots.",
        tips: [
          "Imprimez si possible sur du papier épais, et découpez en suivant les pointillés.",
          "Jouez au memory avec deux exemplaires, ou cachez une carte et devinez laquelle manque.",
          "Rangez chaque jeu dans une enveloppe avec son nom.",
        ],
      },
      "telling-time": {
        line: "Lire l'heure : lire des horloges et dessiner les aiguilles, de l'heure pile à toutes les minutes.",
        tips: [
          "Commencez par les heures pile et les demies, et montrez les mêmes heures sur une vraie horloge.",
          "La petite aiguille montre les heures, la grande les minutes : redites-le à chaque fois.",
          "Les fiches de la journée relient les heures à la journée de votre enfant.",
        ],
      },
      mazes: {
        line: "Labyrinthes : trouver le chemin du départ à l'arrivée, du plus facile au plus difficile.",
        tips: [
          "Suivez d'abord le chemin avec le doigt, puis avec le crayon.",
          "Les impasses font partie du jeu : on revient en arrière et on essaie un autre chemin.",
          "Les labyrinthes faciles ont de larges allées pour les petites mains ; les difficiles ont plus de virages.",
        ],
      },
      "tracing-lines": {
        line: "Graphisme : suivre les pointillés pour préparer la main à l'écriture.",
        tips: [
          "On part du point vert et on suit la flèche, si possible sans lever le crayon.",
          "Tenez le crayon près de la pointe, la feuille un peu inclinée pour être à l'aise.",
          "Les lignes et les formes viennent d'abord, puis les dessins à repasser, avec un modèle à colorier.",
        ],
      },
      origami: {
        line: "Origami : plier un carré de papier étape par étape pour faire des animaux et d'autres modèles.",
        tips: [
          "Prenez un carré de papier coloré d'un côté (15 cm de côté, c'est bien).",
          "Pliez ensemble au début : montrez l'étape sur votre feuille, puis laissez votre enfant la refaire.",
          "Marquez bien chaque pli avec l'ongle, et comparez avec l'image suivante.",
        ],
      },
      "sliding-puzzles": {
        line: "Taquins : découper une image en carrés, en retirer un et faire glisser les autres pour la reconstituer.",
        tips: [
          "Découpez en suivant les pointillés (un adulte peut aider) et posez les pièces sur le plateau.",
          "Retirez la dernière pièce, mélangez les autres, puis faites-les glisser une à une à leur place.",
          "Commencez par le 3 × 3 : le 4 × 4 a des pièces plus petites et il est bien plus difficile.",
        ],
      },
    },
    keyTitle: (kind) => `Corrigés : ${kind}`,
    keyInstruction: "Les réponses sont en rouge. Chaque corrigé indique la page de sa fiche.",
    keyCaption: (title, page) => `${title} · page ${page}`,
    certTitle: "Diplôme",
    certGreat: "Bravo,",
    packName: (name, sub) => (/pack$/i.test(name) ? name : `pack ${name}`) + (sub ? ` (${sub})` : ""),
    certFinished: (pack) => `Tu as terminé le ${pack} !`,
    certDate: "Date",
    certSigned: "Signature",
    puzzle: {
      cut: (name, size) => `${name} : taquin ${size} × ${size}`,
      cutInstruction: "Découpe en suivant les pointillés. Pose les pièces sur le plateau, retire la dernière, mélange-les, puis fais-les glisser à leur place.",
      board: (name) => `${name} : plateau du taquin`,
      boardInstruction: "Pose tes pièces ici. Fais glisser une pièce dans la case vide, une à la fois, jusqu'à retrouver l'image.",
      model: "Ton image",
    },
  },
  es: {
    pro: "AlphaBes Pro",
    site: "alphabes.com/es · AlphaBes Pro",
    page: (n) => `Página ${n}`,
    count: (n, kind) => `${n} ${kind === "sliding-puzzles" ? "rompecabezas" : kind === "flash-cards" ? "juegos de tarjetas" : kind === "origami" ? "modelos para doblar" : "fichas"}`,
    keys: "Soluciones",
    certificate: "Diploma",
    part: (n, of, name) => `Parte ${n} de ${of}: ${name}`,
    contents: "Contenido",
    contentsIntro: "Imprime todo el paquete o solo las páginas que necesites hoy.",
    answerKeys: "Soluciones",
    howTitle: "Cómo usar este paquete",
    howIntro: "Las fichas van de más fáciles a más difíciles. Funcionan mejor los ratos cortos y alegres que las sesiones largas: una o dos páginas al día es suficiente.",
    howGeneral: [
      "Imprime al 100 % («Tamaño real»), no «Ajustar a la página», para que las casillas y las líneas conserven su tamaño.",
      "Deja que tu hijo escriba su nombre y la fecha en cada ficha: es un pequeño hábito que le dará orgullo.",
      "Revisen juntos con las soluciones del final y celebra el esfuerzo, no solo las respuestas correctas.",
      "Cuando terminen el paquete, llenen el diploma de la última página y ¡pónganlo en el refrigerador!",
    ],
    howKind: {
      "missing-numbers": {
        line: "Números faltantes: contar y escribir el número que falta, hasta el 10 y luego hasta el 100.",
        tips: [
          "Empieza con los números hasta el 10, diciendo cada número en voz alta mientras lo señalan.",
          "Si una casilla cuesta, vuelvan a contar desde el número anterior, con los dedos o con objetos pequeños.",
          "Las tablas del 100 y el conteo de tanto en tanto del final son para niños que ya cuentan bien hasta el 100.",
        ],
      },
      patterns: {
        line: "Series y patrones: descubrir qué se repite y qué sigue, desde AB hasta las series que crecen.",
        tips: [
          "Lean cada fila en voz alta («manzana, plátano, manzana, plátano…»): el ritmo ayuda a encontrar lo que sigue.",
          "En cada tipo de serie vienen primero las fichas de «encierra» y luego las de «dibuja», con casillas vacías.",
          "En las series que crecen hay un dibujo más cada vez: cuenten los dibujos de cada casilla.",
        ],
      },
      stickers: {
        line: "Stickers: para imprimir en papel adhesivo o normal, recortar y usar como premio.",
        tips: [
          "Imprime en hojas adhesivas tamaño carta o A4 para tener stickers de verdad, o en papel normal con lápiz adhesivo.",
          "Deja que tu hijo elija un sticker después de cada ficha terminada.",
          "Los stickers de letras y números son ideales para decorar cajas y dibujos.",
        ],
      },
      "dot-to-dot": {
        line: "Une los puntos: unir los puntos en orden para descubrir un dibujo y luego colorearlo.",
        tips: [
          "Se empieza en la estrella y se dice cada número al llegar a él.",
          "Los dibujos fáciles llegan al 10, los medios al 20, los difíciles al 50, y los últimos siguen el abecedario.",
          "El dibujo pequeño de la esquina muestra lo que va a aparecer y sirve de modelo para colorear.",
        ],
      },
      colouring: {
        line: "Colorear: dibujos para colorear por números con su clave, y luego dibujos libres.",
        tips: [
          "En los de colorear por números, busca el 1 en la clave, colorea todos los 1 y luego pasa al 2.",
          "Los lápices de colores van mejor en las zonas pequeñas; las crayolas, en las grandes.",
          "En los dibujos libres no hay respuesta correcta: ¡cualquier color es un buen color!",
        ],
      },
      "how-to-draw": {
        line: "Cómo dibujar: copiar un dibujo paso a paso, una línea nueva cada vez.",
        tips: [
          "La línea nueva de cada paso está en rosa: se dibuja solo esa línea y se pasa a la casilla siguiente.",
          "Dibujen primero con lápiz, para poder borrar, y luego repasen con plumón.",
          "La casilla grande de abajo sirve para hacer el dibujo completo otra vez.",
        ],
      },
      "body-parts": {
        line: "Partes del cuerpo: nombrar las partes del cuerpo, la cara, la mano, animales y una planta.",
        tips: [
          "Señala cada parte en el dibujo y luego en tu propio cuerpo («¿Dónde está tu codo?»).",
          "En las fichas de «escribe», se copian las palabras de la lista; en las de «une», se traza una línea.",
          "Platiquen sobre lo que hace cada parte: vemos con los ojos, el pez nada con sus aletas.",
        ],
      },
      "flash-cards": {
        line: "Tarjetas ilustradas: tarjetas para recortar, jugar y aprender palabras nuevas.",
        tips: [
          "Si puedes, imprime en cartulina y recorta por las líneas punteadas.",
          "Jueguen memorama con dos copias, o escondan una tarjeta y adivinen cuál falta.",
          "Guarda cada juego en un sobre con su nombre.",
        ],
      },
      "telling-time": {
        line: "Aprender la hora: leer relojes y dibujar las manecillas, de la hora en punto a cualquier minuto.",
        tips: [
          "Empiecen con las horas en punto y las medias, y muestren las mismas horas en un reloj de verdad.",
          "La manecilla corta marca la hora y la larga los minutos: díganlo cada vez.",
          "Las fichas de la rutina diaria relacionan las horas con el día de tu hijo.",
        ],
      },
      mazes: {
        line: "Laberintos: encontrar el camino de la salida a la meta, de fáciles a difíciles.",
        tips: [
          "Primero se sigue el camino con el dedo y después con el lápiz.",
          "Los callejones sin salida son parte del juego: se regresa y se prueba otro camino.",
          "Los laberintos fáciles tienen caminos anchos para manos pequeñas; los difíciles, más vueltas.",
        ],
      },
      "tracing-lines": {
        line: "Trazos: seguir las líneas punteadas para preparar la mano para la escritura.",
        tips: [
          "Se empieza en el punto verde y se sigue la flecha, si se puede sin levantar el lápiz.",
          "Tomen el lápiz cerca de la punta, con la hoja un poco inclinada para estar cómodos.",
          "Primero vienen las líneas y figuras; después, los dibujos para repasar, con un modelo para colorear.",
        ],
      },
      origami: {
        line: "Origami: doblar un cuadrado de papel paso a paso para hacer animales y otros modelos.",
        tips: [
          "Usen un cuadrado de papel de color por un lado (de 15 cm por lado está bien).",
          "Al principio doblen juntos: muestra el paso en tu hoja y deja que tu hijo lo repita.",
          "Marquen bien cada doblez con la uña y comparen con el dibujo siguiente.",
        ],
      },
      "sliding-puzzles": {
        line: "Rompecabezas deslizantes: recortar un dibujo en cuadrados, quitar uno y deslizar los demás hasta armarlo.",
        tips: [
          "Recorten por las líneas punteadas (un adulto puede ayudar) y pongan las piezas en el tablero.",
          "Quiten la última pieza, revuelvan las demás y deslícenlas una a una hasta su lugar.",
          "Empiecen con el de 3 × 3: el de 4 × 4 tiene piezas más pequeñas y es mucho más difícil.",
        ],
      },
    },
    keyTitle: (kind) => `Soluciones: ${kind}`,
    keyInstruction: "Las respuestas están en rojo. Cada solución indica la página de su ficha.",
    keyCaption: (title, page) => `${title} · página ${page}`,
    certTitle: "Diploma",
    certGreat: "¡Muy bien,",
    packName: (name, sub) => (/^mega/i.test(name) ? name : `paquete de ${name}`) + (sub ? ` (${sub})` : ""),
    certFinished: (pack) => `¡Terminaste el ${pack}!`,
    certDate: "Fecha",
    certSigned: "Firma",
    puzzle: {
      cut: (name, size) => `${name}: rompecabezas de ${size} × ${size}`,
      cutInstruction: "Recorta por las líneas punteadas. Pon las piezas en el tablero, quita la última, revuélvelas y deslízalas hasta su lugar.",
      board: (name) => `${name}: tablero`,
      boardInstruction: "Pon tus piezas aquí. Desliza una pieza al espacio vacío, una a la vez, hasta que el dibujo quede armado.",
      model: "Tu dibujo",
    },
  },
  pt: {
    pro: "AlphaBes Pro",
    site: "alphabes.com/pt · AlphaBes Pro",
    page: (n) => `Página ${n}`,
    count: (n, kind) => `${n} ${kind === "sliding-puzzles" ? "quebra-cabeças" : kind === "flash-cards" ? "conjuntos de cartões" : kind === "origami" ? "modelos para dobrar" : "atividades"}`,
    keys: "Gabaritos",
    certificate: "Certificado",
    part: (n, of, name) => `Parte ${n} de ${of}: ${name}`,
    contents: "Sumário",
    contentsIntro: "Imprima o pacote inteiro ou só as páginas de hoje.",
    answerKeys: "Gabaritos",
    howTitle: "Como usar este pacote",
    howIntro: "As atividades vão das mais fáceis às mais difíceis. Momentos curtos e alegres funcionam melhor que sessões longas: uma ou duas páginas por dia já bastam.",
    howGeneral: [
      "Imprima em 100% («Tamanho real»), e não «Ajustar à página», para os quadrinhos e as linhas manterem o tamanho.",
      "Deixe seu filho escrever o nome e a data em cada atividade: é um pequeno hábito que dá orgulho.",
      "Confiram juntos com os gabaritos do final e elogie o esforço, não só as respostas certas.",
      "Quando o pacote terminar, preencham o certificado da última página e coloquem na geladeira!",
    ],
    howKind: {
      "missing-numbers": {
        line: "Números que faltam: contar e escrever o número que falta, até 10 e depois até 100.",
        tips: [
          "Comece pelos números até 10, falando cada número em voz alta enquanto aponta para ele.",
          "Se um quadrinho for difícil, contem de novo a partir do número anterior, com os dedos ou objetos pequenos.",
          "As tabelas de 100 e a contagem de tantos em tantos, no final, são para crianças que já contam bem até 100.",
        ],
      },
      patterns: {
        line: "Sequências lógicas: descobrir o que se repete e o que vem depois, de AB às sequências crescentes.",
        tips: [
          "Leiam cada linha em voz alta («maçã, banana, maçã, banana…»): o ritmo ajuda a achar o próximo.",
          "Em cada tipo de sequência vêm primeiro as atividades de «circule» e depois as de «desenhe», com quadrinhos vazios.",
          "Nas sequências crescentes há uma figura a mais a cada vez: contem as figuras de cada quadrinho.",
        ],
      },
      stickers: {
        line: "Adesivos: para imprimir em papel adesivo ou comum, recortar e usar como recompensa.",
        tips: [
          "Imprima em folhas adesivas A4 para ter adesivos de verdade, ou em papel comum com cola em bastão.",
          "Deixe seu filho escolher um adesivo depois de cada atividade terminada.",
          "Os adesivos de letras e números são ótimos para enfeitar caixas e desenhos.",
        ],
      },
      "dot-to-dot": {
        line: "Ligue os pontos: ligar os pontos em ordem para revelar um desenho e depois colorir.",
        tips: [
          "Comece pela estrela e fale cada número ao chegar nele.",
          "Os desenhos fáceis vão até 10, os médios até 20, os difíceis até 50, e os últimos seguem o alfabeto.",
          "O desenho pequeno no canto mostra o que vai aparecer e serve de modelo para colorir.",
        ],
      },
      colouring: {
        line: "Colorir: desenhos para colorir por números com legenda, e depois desenhos livres.",
        tips: [
          "No colorir por números, procure o 1 na legenda, pinte todos os 1 e depois passe para o 2.",
          "Lápis de cor funcionam melhor nas partes pequenas; giz de cera, nas grandes.",
          "Nos desenhos livres não há resposta certa: qualquer cor é uma boa cor!",
        ],
      },
      "how-to-draw": {
        line: "Como desenhar: copiar um desenho passo a passo, um traço novo de cada vez.",
        tips: [
          "O traço novo de cada passo está em rosa: desenhe só esse traço e passe para o quadrinho seguinte.",
          "Desenhem primeiro a lápis, para poder apagar, e depois cubram com canetinha.",
          "O quadro grande embaixo serve para fazer o desenho inteiro de novo.",
        ],
      },
      "body-parts": {
        line: "Partes do corpo: nomear as partes do corpo, do rosto, da mão, de animais e de uma planta.",
        tips: [
          "Aponte cada parte no desenho e depois no seu corpo («Cadê o seu cotovelo?»).",
          "Nas atividades de «escreva», copiam-se as palavras da lista; nas de «ligue», traça-se uma linha.",
          "Conversem sobre o que cada parte faz: vemos com os olhos, o peixe nada com as nadadeiras.",
        ],
      },
      "flash-cards": {
        line: "Cartões ilustrados: cartões para recortar, brincar e aprender palavras novas.",
        tips: [
          "Se puder, imprima em papel mais grosso e recorte nas linhas tracejadas.",
          "Joguem jogo da memória com duas cópias, ou escondam um cartão e adivinhem qual falta.",
          "Guarde cada conjunto num envelope com o nome dele.",
        ],
      },
      "telling-time": {
        line: "Aprender as horas: ler relógios e desenhar os ponteiros, da hora exata a qualquer minuto.",
        tips: [
          "Comecem pelas horas exatas e pelas meias, e mostrem as mesmas horas num relógio de verdade.",
          "O ponteiro pequeno mostra as horas e o grande, os minutos: repitam isso sempre.",
          "As atividades da rotina ligam as horas ao dia a dia do seu filho.",
        ],
      },
      mazes: {
        line: "Labirintos: achar o caminho da saída à chegada, dos fáceis aos difíceis.",
        tips: [
          "Primeiro sigam o caminho com o dedo, depois com o lápis.",
          "Os becos sem saída fazem parte da brincadeira: volta-se e tenta-se outro caminho.",
          "Os labirintos fáceis têm caminhos largos para mãos pequenas; os difíceis têm mais curvas.",
        ],
      },
      "tracing-lines": {
        line: "Traçados: seguir as linhas tracejadas para preparar a mão para a escrita.",
        tips: [
          "Comece pelo ponto verde e siga a seta, se possível sem levantar o lápis.",
          "Segure o lápis perto da ponta, com a folha um pouco inclinada para ficar confortável.",
          "Primeiro vêm as linhas e formas; depois, os desenhos para cobrir, com um modelo para colorir.",
        ],
      },
      origami: {
        line: "Origami: dobrar um quadrado de papel passo a passo para fazer bichos e outros modelos.",
        tips: [
          "Usem um quadrado de papel colorido de um lado (15 cm de lado é um bom tamanho).",
          "No começo, dobrem juntos: mostre o passo na sua folha e deixe seu filho repetir.",
          "Vinquem bem cada dobra com a unha e comparem com a figura seguinte.",
        ],
      },
      "sliding-puzzles": {
        line: "Quebra-cabeças deslizantes: recortar um desenho em quadrados, tirar um e deslizar os outros até montá-lo.",
        tips: [
          "Recortem nas linhas tracejadas (um adulto pode ajudar) e coloquem as peças no tabuleiro.",
          "Tirem a última peça, misturem as outras e deslizem uma de cada vez até o lugar certo.",
          "Comecem pelo de 3 × 3: o de 4 × 4 tem peças menores e é bem mais difícil.",
        ],
      },
    },
    keyTitle: (kind) => `Gabarito: ${kind}`,
    keyInstruction: "As respostas estão em vermelho. Cada gabarito mostra a página da sua atividade.",
    keyCaption: (title, page) => `${title} · página ${page}`,
    certTitle: "Certificado",
    certGreat: "Parabéns,",
    packName: (name, sub) => (/^mega/i.test(name) ? name : `pacote de ${name}`) + (sub ? ` (${sub})` : ""),
    certFinished: (pack) => `Você terminou o ${pack}!`,
    certDate: "Data",
    certSigned: "Assinatura",
    puzzle: {
      cut: (name, size) => `${name}: quebra-cabeça ${size} × ${size}`,
      cutInstruction: "Recorte nas linhas tracejadas. Coloque as peças no tabuleiro, tire a última, misture e deslize até o lugar certo.",
      board: (name) => `${name}: tabuleiro`,
      boardInstruction: "Coloque suas peças aqui. Deslize uma peça para o espaço vazio, uma de cada vez, até o desenho ficar montado.",
      model: "Seu desenho",
    },
  },
};

export function packText(locale: SheetLocale): PackText {
  return PACK_TEXT[locale];
}
