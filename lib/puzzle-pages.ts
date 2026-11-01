// The words of the sliding puzzle pages (app/[locale]/games/sliding-puzzle):
// the listing, each puzzle's page and the teaser on the games page. The
// puzzles themselves are in lib/puzzles.ts.
import type { L10n } from "@/lib/sheets/types";

export type PuzzlePageText = {
  home: string;
  games: string;
  breadcrumb: string;
  /** The listing's name, in the breadcrumb and the teaser. */
  section: string;
  /** A puzzle page's H1 and breadcrumb ("{name}": the puzzle's name). */
  heading: string;
  listTitle: string;
  listDescription: string;
  listHeading: string;
  listIntro: string;
  loading: string;
  howTitle: string;
  how: string;
  skillsTitle: string;
  skills: string;
  /** Under the puzzle: back to the listing. */
  more: string;
  teaserTitle: string;
  teaserText: string;
  teaserLink: string;
};

export const PUZZLE_PAGES: L10n<PuzzlePageText> = {
  en: {
    home: "Home",
    games: "Games",
    breadcrumb: "Breadcrumb",
    section: "Sliding Puzzles",
    heading: "{name} Sliding Puzzle",
    listTitle: "Sliding Puzzles for Kids: 24 Free Online Picture Puzzles",
    listDescription: "Free online sliding puzzles for kids: 24 colorful cartoon pictures to put back together in 3×3 or 4×4, with tap, touch or arrow keys. No sign-up.",
    listHeading: "Sliding Puzzles for Kids",
    listIntro: "Pick a picture, then slide the squares back into place. Every puzzle starts at 3×3 for younger children; tap 4×4 for a bigger challenge. They work on a computer, a tablet or a phone, and they're all free.",
    loading: "Loading puzzle…",
    howTitle: "How to play",
    how: "The picture is cut into squares and one is missing. Tap or click a square next to the empty space to slide it there, or use the arrow keys. Put the picture back together like the small one beside the board. Stuck? Tap \"Show numbers\": the squares go in order, 1 at the top left. Start with 3×3, then try 4×4.",
    skillsTitle: "What your child practices",
    skills: "Planning a few moves ahead, seeing how the parts of a picture fit together, and sticking with a puzzle until it's solved.",
    more: "More sliding puzzles",
    teaserTitle: "Sliding puzzles",
    teaserText: "24 free picture puzzles: slide the squares to put a cartoon scene back together, in 3×3 or 4×4.",
    teaserLink: "See all the sliding puzzles",
  },
  fr: {
    home: "Accueil",
    games: "Jeux",
    breadcrumb: "Fil d'Ariane",
    section: "Taquins",
    heading: "Taquin : {name}",
    listTitle: "Taquins pour enfants : 24 puzzles à glisser gratuits en ligne",
    listDescription: "Des taquins gratuits pour les enfants : 24 images colorées à reconstituer en 3×3 ou 4×4, au doigt, à la souris ou avec les flèches. Sans inscription.",
    listHeading: "Des taquins pour les enfants",
    listIntro: "Choisis une image, puis fais glisser les pièces pour la remettre en ordre. Chaque taquin commence en 3×3 pour les plus jeunes ; touche 4×4 pour corser le jeu. Ils marchent sur ordinateur, tablette et téléphone, et ils sont tous gratuits.",
    loading: "Chargement du taquin…",
    howTitle: "Comment jouer",
    how: "L'image est coupée en carrés et il en manque un. Touche ou clique un carré à côté de la case vide pour l'y faire glisser, ou utilise les flèches du clavier. Reconstitue l'image comme le petit modèle à côté. Bloqué ? Touche « Voir les numéros » : les pièces vont dans l'ordre, le 1 en haut à gauche. Commence en 3×3, puis essaie le 4×4.",
    skillsTitle: "Ce que votre enfant travaille",
    skills: "Prévoir quelques coups à l'avance, voir comment les morceaux d'une image s'assemblent, et persévérer jusqu'à la solution.",
    more: "Tous les taquins",
    teaserTitle: "Les taquins",
    teaserText: "24 taquins gratuits : fais glisser les pièces pour reconstituer une image, en 3×3 ou 4×4.",
    teaserLink: "Voir tous les taquins",
  },
  es: {
    home: "Inicio",
    games: "Juegos",
    breadcrumb: "Ruta de navegación",
    section: "Rompecabezas deslizantes",
    heading: "Rompecabezas deslizante: {name}",
    listTitle: "Rompecabezas deslizantes para niños: 24 gratis en línea",
    listDescription: "Rompecabezas deslizantes gratis para niños: 24 dibujos de colores para armar en 3×3 o 4×4, con el dedo, el ratón o las flechas. Sin registro.",
    listHeading: "Rompecabezas deslizantes para niños",
    listIntro: "Elige un dibujo y desliza las piezas hasta armarlo. Cada rompecabezas empieza en 3×3 para los más pequeños; toca 4×4 si quieres más reto. Funcionan en la computadora, la tableta o el teléfono, y todos son gratis.",
    loading: "Cargando el rompecabezas…",
    howTitle: "Cómo se juega",
    how: "El dibujo está cortado en cuadrados y falta uno. Toca o haz clic en un cuadrado junto al hueco para deslizarlo, o usa las flechas del teclado. Arma el dibujo igual que el modelo pequeño. ¿Te atoraste? Toca «Ver números»: las piezas van en orden, el 1 arriba a la izquierda. Empieza con 3×3 y luego prueba 4×4.",
    skillsTitle: "Lo que practica tu hijo",
    skills: "Pensar unos movimientos por adelantado, ver cómo encajan las partes de un dibujo y no rendirse hasta terminar.",
    more: "Más rompecabezas deslizantes",
    teaserTitle: "Rompecabezas deslizantes",
    teaserText: "24 rompecabezas gratis: desliza las piezas para armar un dibujo, en 3×3 o 4×4.",
    teaserLink: "Ver todos los rompecabezas",
  },
  pt: {
    home: "Início",
    games: "Jogos",
    breadcrumb: "Caminho de navegação",
    section: "Quebra-cabeças deslizantes",
    heading: "Quebra-cabeça deslizante: {name}",
    listTitle: "Quebra-cabeças deslizantes para crianças: 24 grátis online",
    listDescription: "Quebra-cabeças deslizantes grátis para crianças: 24 desenhos coloridos para montar em 3×3 ou 4×4, com o dedo, o mouse ou as setas. Sem cadastro.",
    listHeading: "Quebra-cabeças deslizantes para crianças",
    listIntro: "Escolha um desenho e deslize as peças até montá-lo. Cada quebra-cabeça começa em 3×3 para os menores; toque em 4×4 para um desafio maior. Funcionam no computador, no tablet e no celular, e todos são grátis.",
    loading: "Carregando o quebra-cabeça…",
    howTitle: "Como jogar",
    how: "O desenho está cortado em quadrados e falta um. Toque ou clique em um quadrado ao lado do espaço vazio para deslizá-lo, ou use as setas do teclado. Monte o desenho igual ao modelo pequeno. Empacou? Toque em \"Mostrar números\": as peças seguem a ordem, com o 1 no canto de cima, à esquerda. Comece com 3×3 e depois tente 4×4.",
    skillsTitle: "O que seu filho pratica",
    skills: "Pensar em algumas jogadas antes, ver como as partes de um desenho se encaixam e não desistir até terminar.",
    more: "Mais quebra-cabeças deslizantes",
    teaserTitle: "Quebra-cabeças deslizantes",
    teaserText: "24 quebra-cabeças grátis: deslize as peças para montar um desenho, em 3×3 ou 4×4.",
    teaserLink: "Ver todos os quebra-cabeças",
  },
};
