// Origami sheets (scripts/sheets/origami-layout.ts): easy models for children
// aged 5 to 8 folding with an adult, from a square of paper coloured on one
// side. Each step is a real fold of the paper of the step before
// (lib/sheets/origami.ts); the last step shows the finished model with a face.
//
// Coordinates: paper units, y up, the sheet set as a diamond with its corners
// at (0, ±1) and (±1, 0) (lib/sheets/origami.ts).
import { pt, type Fold } from "@/lib/sheets/origami";
import { slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";

export type OrigamiStep = {
  /** Turn the paper over before this step's fold. */
  turn?: boolean;
  fold: Fold;
  text: L10n;
};

/** Drawn on the finished model, in paper units (y up). */
export type FaceMark =
  | { eye: [number, number]; r: number }
  | { nose: [number, number]; rx: number; ry: number }
  /** A line (path data in paper units, y up), or a filled shape. */
  | { line: string; fill?: string };

export type OrigamiTheme = "animals" | "things";

export type OrigamiModel = {
  id: string;
  name: L10n;
  theme: OrigamiTheme;
  /** The paper's coloured side. */
  colour: string;
  steps: OrigamiStep[];
  /** The last step: the finished model and what to do with it. */
  done: L10n;
  face: FaceMark[];
};

export type OrigamiParams = { model: string };
export type OrigamiSheet = Sheet<OrigamiParams>;

// The cup's side folds: each lower corner goes to the opposite edge, so the
// flap's top edge lies flat at y = 2 − √2.
const R2 = Math.SQRT2;
const CUP_TOP = 2 - R2;
const CUP_X = R2 - 1;
const CUP_FOOT = 3 - 2 * R2;

const HALF_UP: L10n = {
  en: "Fold the bottom corner up to the top corner.",
  fr: "Plie la pointe du bas sur la pointe du haut.",
  es: "Dobla la punta de abajo hasta la punta de arriba.",
  pt: "Dobre a ponta de baixo até a ponta de cima.",
};
const WHITE_UP: L10n = { en: "White side up.", fr: "Côté blanc vers toi.", es: "Lado blanco hacia arriba.", pt: "Lado branco para cima." };
const join = (a: L10n, b: L10n): L10n => ({ en: `${a.en} ${b.en}`, fr: `${a.fr} ${b.fr}`, es: `${a.es} ${b.es}`, pt: `${a.pt} ${b.pt}` });

export const MODELS: OrigamiModel[] = [
  {
    id: "cup",
    name: { en: "cup", fr: "gobelet", es: "vaso", pt: "copo" },
    theme: "things",
    colour: "#5BB8FF",
    steps: [
      { fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, -1) }, text: join(WHITE_UP, HALF_UP) },
      {
        fold: { line: [pt(-CUP_X, CUP_TOP), pt(-CUP_FOOT, 0)], from: pt(-1, 0) },
        text: {
          en: "Fold the left corner across until it touches the right edge.",
          fr: "Plie la pointe de gauche jusqu'à toucher le bord de droite.",
          es: "Dobla la punta izquierda hasta que toque el borde derecho.",
          pt: "Dobre a ponta da esquerda até encostar na borda da direita.",
        },
      },
      {
        fold: { line: [pt(CUP_X, CUP_TOP), pt(CUP_FOOT, 0)], from: pt(1, 0) },
        text: {
          en: "Fold the right corner across to the left edge.",
          fr: "Plie la pointe de droite jusqu'au bord de gauche.",
          es: "Dobla la punta derecha hasta el borde izquierdo.",
          pt: "Dobre a ponta da direita até a borda da esquerda.",
        },
      },
      {
        fold: { line: [pt(-1, CUP_TOP), pt(1, CUP_TOP)], from: pt(0, 1), layers: "top", at: pt(0, 0.9) },
        text: {
          en: "Fold the front top flap down.",
          fr: "Rabats vers le bas la pointe du haut, celle de devant.",
          es: "Dobla hacia abajo la punta de arriba, la de delante.",
          pt: "Dobre para baixo a ponta de cima, a da frente.",
        },
      },
      {
        turn: true,
        fold: { line: [pt(-1, CUP_TOP), pt(1, CUP_TOP)], from: pt(0, 1), layers: "top", at: pt(0, 0.9) },
        text: {
          en: "Turn the paper over. Fold the other top flap down too.",
          fr: "Retourne la feuille. Rabats aussi l'autre pointe vers le bas.",
          es: "Da la vuelta al papel. Dobla también la otra punta hacia abajo.",
          pt: "Vire o papel. Dobre a outra ponta para baixo também.",
        },
      },
    ],
    done: {
      en: "Open the top a little and draw a face. Your cup is ready!",
      fr: "Ouvre un peu le haut et dessine un visage. Ton gobelet est prêt !",
      es: "Abre un poco la parte de arriba y dibuja una cara. ¡Tu vaso está listo!",
      pt: "Abra um pouco a parte de cima e desenhe um rosto. Seu copo está pronto!",
    },
    face: [
      // On the white flap folded down in step 5.
      { eye: [-0.11, 0.47], r: 0.04 },
      { eye: [0.11, 0.47], r: 0.04 },
      { line: "M-0.08 0.39 Q0 0.32 0.08 0.39" },
    ],
  },
  {
    id: "dog",
    name: { en: "dog face", fr: "tête de chien", es: "cara de perro", pt: "cara de cachorro" },
    theme: "animals",
    colour: "#E8A35E",
    steps: [
      {
        fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, 1) },
        text: join(WHITE_UP, {
          en: "Fold the top corner down to the bottom corner.",
          fr: "Plie la pointe du haut sur la pointe du bas.",
          es: "Dobla la punta de arriba hasta la punta de abajo.",
          pt: "Dobre a ponta de cima até a ponta de baixo.",
        }),
      },
      {
        fold: { line: [pt(-0.4, 0), pt(-0.75, -0.25)], from: pt(-1, 0) },
        text: {
          en: "Fold the left corner down to make an ear.",
          fr: "Plie la pointe de gauche vers le bas : c'est une oreille.",
          es: "Dobla la punta izquierda hacia abajo: es una oreja.",
          pt: "Dobre a ponta da esquerda para baixo: é uma orelha.",
        },
      },
      {
        fold: { line: [pt(0.4, 0), pt(0.75, -0.25)], from: pt(1, 0) },
        text: {
          en: "Fold the right corner down to make the other ear.",
          fr: "Plie la pointe de droite pour faire l'autre oreille.",
          es: "Dobla la punta derecha para hacer la otra oreja.",
          pt: "Dobre a ponta da direita para fazer a outra orelha.",
        },
      },
      {
        fold: { line: [pt(-1, -0.75), pt(1, -0.75)], from: pt(0, -1), layers: "top", at: pt(0, -0.9) },
        text: {
          en: "Fold the bottom tip of the front layer up a little.",
          fr: "Remonte un peu la pointe du bas, seulement celle de devant.",
          es: "Dobla un poco hacia arriba la punta de abajo, solo la de delante.",
          pt: "Dobre um pouco para cima a ponta de baixo, só a da frente.",
        },
      },
      {
        fold: { line: [pt(-1, -0.75), pt(1, -0.75)], from: pt(0, -1), behind: true },
        text: {
          en: "Fold the other bottom tip behind.",
          fr: "Plie l'autre pointe du bas derrière.",
          es: "Dobla la otra punta de abajo hacia atrás.",
          pt: "Dobre a outra ponta de baixo para trás.",
        },
      },
    ],
    done: {
      en: "Draw the eyes and a big nose. Woof!",
      fr: "Dessine les yeux et une grosse truffe. Ouaf !",
      es: "Dibuja los ojos y una nariz grande. ¡Guau!",
      pt: "Desenhe os olhos e um narizão. Au-au!",
    },
    face: [
      { eye: [-0.17, -0.24], r: 0.055 },
      { eye: [0.17, -0.24], r: 0.055 },
      { nose: [0, -0.565], rx: 0.085, ry: 0.06 },
      { line: "M0 -0.625 L0 -0.67 M-0.07 -0.69 Q-0.035 -0.71 0 -0.67 Q0.035 -0.71 0.07 -0.69" },
    ],
  },
  {
    // Our own simple boat: a triangle sail on a hull made of the two folded
    // strips. (The classic paper boat needs a rectangle.)
    id: "boat",
    name: { en: "boat", fr: "bateau", es: "barco", pt: "barco" },
    theme: "things",
    colour: "#FF6F6F",
    steps: [
      {
        fold: { line: [pt(0, -1), pt(0, 1)], from: pt(-1, 0), unfold: true },
        text: join(WHITE_UP, {
          en: "Fold in half, then unfold: this line is the mast.",
          fr: "Plie en deux, puis déplie : ce pli sera le mât.",
          es: "Dobla por la mitad y desdobla: esa línea será el mástil.",
          pt: "Dobre ao meio e desdobre: essa linha será o mastro.",
        }),
      },
      { fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, -1) }, text: HALF_UP },
      {
        fold: { line: [pt(-1, 0.2), pt(1, 0.2)], from: pt(0, 0), layers: "top", at: pt(0, 0.1) },
        text: {
          en: "Fold the bottom edge of the front layer up a little.",
          fr: "Remonte un peu le bord du bas, seulement celui de devant.",
          es: "Dobla un poco hacia arriba el borde de abajo, solo el de delante.",
          pt: "Dobre um pouco para cima a borda de baixo, só a da frente.",
        },
      },
      {
        turn: true,
        fold: { line: [pt(-1, 0.2), pt(1, 0.2)], from: pt(0, 0), layers: "top", at: pt(0, 0.1) },
        text: {
          en: "Turn the paper over. Fold the other bottom edge up the same way.",
          fr: "Retourne la feuille. Remonte l'autre bord du bas de la même façon.",
          es: "Da la vuelta al papel. Dobla el otro borde de abajo igual.",
          pt: "Vire o papel. Dobre a outra borda de baixo do mesmo jeito.",
        },
      },
      {
        fold: { line: [pt(-1, 0.84), pt(1, 0.84)], from: pt(0, 1), layers: "top", at: pt(0, 0.95) },
        text: {
          en: "Fold the top tip of the front layer down: it's a flag.",
          fr: "Rabats la pointe du haut, celle de devant : c'est un drapeau.",
          es: "Dobla hacia abajo la punta de arriba, la de delante: es una bandera.",
          pt: "Dobre para baixo a ponta de cima, a da frente: é uma bandeira.",
        },
      },
    ],
    done: {
      en: "Draw a face on the boat. Ready to sail!",
      fr: "Dessine un visage sur le bateau. En route !",
      es: "Dibuja una cara en el barco. ¡A navegar!",
      pt: "Desenhe um rosto no barco. Vamos navegar!",
    },
    face: [
      { eye: [-0.2, 0.31], r: 0.035 },
      { eye: [0.2, 0.31], r: 0.035 },
      { line: "M-0.08 0.27 Q0 0.22 0.08 0.27" },
    ],
  },
];

export const getModel = (id: string) => {
  const m = MODELS.find((x) => x.id === id);
  if (!m) throw new Error(`No origami model "${id}"`);
  return m;
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const capWords = (s: string) => s.split(" ").map(cap).join(" ");

const THEMES: Record<OrigamiTheme, L10n> = {
  animals: { en: "Animals", fr: "Animaux", es: "Animales", pt: "Animais" },
  things: { en: "Things", fr: "Objets", es: "Objetos", pt: "Objetos" },
};

function sheet(m: OrigamiModel): OrigamiSheet {
  const n = m.name;
  const steps = m.steps.length + 1;
  return {
    kind: "origami",
    id: `origami-${m.id}`,
    slug: {
      en: `origami-${slugify(n.en)}`,
      fr: `origami-${slugify(n.fr)}`,
      es: `origami-${slugify(n.es)}`,
      pt: `origami-${slugify(n.pt)}`,
    },
    title: {
      en: `Origami ${capWords(n.en)}: Step by Step`,
      fr: `${cap(n.fr)} en origami, étape par étape`,
      es: `${cap(n.es)} de origami paso a paso`,
      pt: `${cap(n.pt)} de origami passo a passo`,
    },
    label: { en: capWords(n.en), fr: cap(n.fr), es: cap(n.es), pt: cap(n.pt) },
    description: {
      en: `Free printable origami ${n.en} for kids: ${steps} easy steps drawn on one page, from a square of paper. Fold it together, then draw a face!`,
      fr: `${cap(n.fr)} en origami à imprimer gratuitement : ${steps} étapes faciles sur une page, avec une feuille carrée. À plier ensemble, puis on dessine un visage !`,
      es: `${cap(n.es)} de origami gratis para imprimir: ${steps} pasos fáciles en una página, con un papel cuadrado. ¡Dóblenlo juntos y dibujen una cara!`,
      pt: `${cap(n.pt)} de origami grátis para imprimir: ${steps} passos fáceis em uma página, com um papel quadrado. Dobrem juntos e desenhem um rosto!`,
    },
    instruction: {
      en: "Use a square of paper, coloured on one side. Fold on the dashed lines.",
      fr: "Prends une feuille carrée, colorée d'un côté. Plie sur les pointillés.",
      es: "Usa un papel cuadrado, de color por un lado. Dobla por las líneas de puntos.",
      pt: "Use um papel quadrado, colorido de um lado. Dobre nas linhas tracejadas.",
    },
    filters: { theme: m.theme },
    params: { model: m.id },
  };
}

export const origamiSheets: OrigamiSheet[] = MODELS.map(sheet);

export const origamiKind: SheetKind = {
  id: "origami",
  slug: { en: "origami", fr: "origami", es: "origami", pt: "origami" },
  name: { en: "Origami", fr: "Origami", es: "Origami", pt: "Origami" },
  heading: {
    en: "Easy Origami for Kids: Printable Step-by-Step Sheets",
    fr: "Origami facile pour les enfants, étape par étape",
    es: "Origami fácil para niños, paso a paso",
    pt: "Origami fácil para crianças, passo a passo",
  },
  metaTitle: {
    en: "Easy Origami for Kids: Step-by-Step Printable Sheets | Free PDFs",
    fr: "Origami facile pour enfants : fiches étape par étape à imprimer",
    es: "Origami fácil para niños: fichas paso a paso gratis",
    pt: "Origami fácil para crianças: passo a passo grátis",
  },
  description: {
    en: "Free printable origami for kids: a cup, a dog face, a boat and more, each on one page with numbered steps and a face to draw at the end.",
    fr: "Origami gratuit à imprimer pour les enfants : un gobelet, une tête de chien, un bateau… Chaque modèle tient sur une page, étape par étape.",
    es: "Origami gratis para imprimir: un vaso, una cara de perro, un barco… Cada modelo cabe en una página, con pasos numerados.",
    pt: "Origami grátis para imprimir: um copo, uma cara de cachorro, um barco… Cada modelo cabe em uma página, com passos numerados.",
  },
  intro: {
    en: "Each sheet shows one easy model from a square of paper, in numbered steps: the dashed line is where to fold, and the arrow shows which way. Children of 5 to 8 can fold them with a grown-up, then draw a face on the finished model.",
    fr: "Chaque fiche montre un modèle facile, à partir d'une feuille carrée, en étapes numérotées : les pointillés montrent où plier, la flèche dans quel sens. Les enfants de 5 à 8 ans les plient avec un adulte, puis dessinent un visage sur le modèle fini.",
    es: "Cada ficha muestra un modelo fácil con un papel cuadrado, en pasos numerados: la línea de puntos indica dónde doblar y la flecha hacia dónde. Los niños de 5 a 8 años los doblan con un adulto y luego dibujan una cara en el modelo terminado.",
    pt: "Cada atividade mostra um modelo fácil com um papel quadrado, em passos numerados: a linha tracejada mostra onde dobrar e a seta para que lado. Crianças de 5 a 8 anos dobram com um adulto e depois desenham um rosto no modelo pronto.",
  },
  howTo: {
    en: "Cut a square from coloured paper (15 cm or 6 inches is a good size), or use origami paper. Fold each step together, pressing the creases flat with a fingernail, and compare with the next picture before going on.",
    fr: "Découpez un carré de papier de couleur (15 cm, c'est bien) ou prenez du papier origami. Pliez chaque étape ensemble, marquez bien les plis avec l'ongle, et comparez avec le dessin suivant avant de continuer.",
    es: "Recorten un cuadrado de papel de color (15 cm es un buen tamaño) o usen papel de origami. Doblen cada paso juntos, marquen bien los pliegues con la uña y comparen con el dibujo siguiente antes de seguir.",
    pt: "Recortem um quadrado de papel colorido (15 cm é um bom tamanho) ou usem papel de origami. Dobrem cada passo juntos, marquem bem as dobras com a unha e comparem com o desenho seguinte antes de continuar.",
  },
  level: {
    en: "Kindergarten to third grade (ages 5–8)",
    fr: "De la grande section au CE2 (5 à 8 ans)",
    es: "De kínder a tercer grado (5 a 8 años)",
    pt: "Do primeiro ao terceiro ano (5 a 8 anos)",
  },
  skills: {
    en: ["Fine motor skills", "Following steps", "Shapes and symmetry"],
    fr: ["Motricité fine", "Suivre des étapes", "Formes et symétrie"],
    es: ["Motricidad fina", "Seguir pasos", "Formas y simetría"],
    pt: ["Coordenação motora fina", "Seguir etapas", "Formas e simetria"],
  },
  filters: [
    {
      key: "theme",
      label: { en: "Theme", fr: "Thème", es: "Tema", pt: "Tema" },
      options: (Object.keys(THEMES) as OrigamiTheme[]).map((v) => ({ value: v, label: THEMES[v] })),
    },
  ],
};
