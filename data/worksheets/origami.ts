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

export type OrigamiTheme = "animals" | "things" | "nature";

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

// Steps shared by several models.
const TOP_DOWN: L10n = {
  en: "Fold the top corner down to the bottom corner.",
  fr: "Plie la pointe du haut sur la pointe du bas.",
  es: "Dobla la punta de arriba hasta la punta de abajo.",
  pt: "Dobre a ponta de cima até a ponta de baixo.",
};
const CREASE_SIDES: L10n = {
  en: "Fold in half from side to side, then unfold.",
  fr: "Plie en deux de gauche à droite, puis déplie.",
  es: "Dobla por la mitad de lado a lado y desdobla.",
  pt: "Dobre ao meio de um lado ao outro e desdobre.",
};
const EAR_LEFT_UP: L10n = {
  en: "Fold the left corner up so it sticks out at the top: an ear.",
  fr: "Plie la pointe de gauche vers le haut, qu'elle dépasse : c'est une oreille.",
  es: "Dobla la punta izquierda hacia arriba para que sobresalga: es una oreja.",
  pt: "Dobre a ponta da esquerda para cima, até passar da borda: é uma orelha.",
};
const EAR_RIGHT_UP: L10n = {
  en: "Fold the right corner up the same way: the other ear.",
  fr: "Plie la pointe de droite de la même façon : l'autre oreille.",
  es: "Dobla la punta derecha igual: es la otra oreja.",
  pt: "Dobre a ponta da direita do mesmo jeito: a outra orelha.",
};
const EAR_TIPS_DOWN: L10n = {
  en: "Fold the tips of both ears down.",
  fr: "Rabats le bout des deux oreilles.",
  es: "Dobla hacia abajo la punta de las dos orejas.",
  pt: "Dobre para baixo a ponta das duas orelhas.",
};
const CHIN_UP: L10n = {
  en: "Fold the bottom tip up a little.",
  fr: "Remonte un peu la pointe du bas.",
  es: "Dobla un poco hacia arriba la punta de abajo.",
  pt: "Dobre um pouco para cima a ponta de baixo.",
};
const FRONT_TIP_UP: L10n = {
  en: "Fold the bottom tip of the front layer up a little.",
  fr: "Remonte un peu la pointe du bas, seulement celle de devant.",
  es: "Dobla un poco hacia arriba la punta de abajo, solo la de delante.",
  pt: "Dobre um pouco para cima a ponta de baixo, só a da frente.",
};
const BACK_TIP_BEHIND: L10n = {
  en: "Fold the other bottom tip behind.",
  fr: "Plie l'autre pointe du bas derrière.",
  es: "Dobla la otra punta de abajo hacia atrás.",
  pt: "Dobre a outra ponta de baixo para trás.",
};
const KITE_LEFT: L10n = {
  en: "Fold the left corner to the middle line.",
  fr: "Plie la pointe de gauche jusqu'au pli du milieu.",
  es: "Dobla la punta izquierda hasta la línea del medio.",
  pt: "Dobre a ponta da esquerda até a linha do meio.",
};
const KITE_RIGHT: L10n = {
  en: "Fold the right corner to the middle line too.",
  fr: "Plie aussi la pointe de droite jusqu'au pli du milieu.",
  es: "Dobla también la punta derecha hasta la línea del medio.",
  pt: "Dobre também a ponta da direita até a linha do meio.",
};

// The kite folds: an edge from the bottom (or top) corner laid on the middle
// crease. The side corner lands on the crease at 0.414 from the centre.
const KITE = R2 - 1;
const KITE_X = 2 - R2;

/** The left ear (a corner folded up past the top edge) and its mirror. */
const ears = (a: number, b: number): OrigamiStep[] => [
  { fold: { line: [pt(-a, 0), pt(-b, b - 1)], from: pt(-1, 0) }, text: EAR_LEFT_UP },
  { fold: { line: [pt(a, 0), pt(b, b - 1)], from: pt(1, 0) }, text: EAR_RIGHT_UP },
];
const eyes = (x: number, y: number, r = 0.045): FaceMark[] => [{ eye: [-x, y], r }, { eye: [x, y], r }];

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
  {
    id: "cat",
    name: { en: "cat face", fr: "tête de chat", es: "cara de gato", pt: "cara de gato" },
    theme: "animals",
    colour: "#F79A3E",
    steps: [
      { fold: { line: [pt(0, -1), pt(0, 1)], from: pt(-1, 0), unfold: true }, text: join(WHITE_UP, CREASE_SIDES) },
      { fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, 1) }, text: TOP_DOWN },
      ...ears(0.6, 0.4),
      { fold: { line: [pt(-1, -0.7), pt(1, -0.7)], from: pt(0, -1) }, text: CHIN_UP },
    ],
    done: {
      en: "Draw the eyes, a little nose and whiskers. Meow!",
      fr: "Dessine les yeux, un petit nez et les moustaches. Miaou !",
      es: "Dibuja los ojos, una naricita y los bigotes. ¡Miau!",
      pt: "Desenhe os olhos, um narizinho e os bigodes. Miau!",
    },
    face: [
      ...eyes(0.19, -0.2),
      { line: "M-0.045 -0.31 L0.045 -0.31 L0 -0.36 Z", fill: "#1D1B3A" },
      { line: "M0 -0.36 L0 -0.4 M-0.06 -0.43 Q-0.03 -0.44 0 -0.4 Q0.03 -0.44 0.06 -0.43" },
      { line: "M-0.12 -0.33 L-0.3 -0.3 M-0.12 -0.37 L-0.3 -0.39 M0.12 -0.33 L0.3 -0.3 M0.12 -0.37 L0.3 -0.39" },
    ],
  },
  {
    id: "pig",
    name: { en: "pig face", fr: "tête de cochon", es: "cara de cerdo", pt: "cara de porquinho" },
    theme: "animals",
    colour: "#FF9EBB",
    steps: [
      { fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, 1) }, text: join(WHITE_UP, TOP_DOWN) },
      ...ears(0.7, 0.55),
      {
        fold: { line: [pt(-1, -0.65), pt(1, -0.65)], from: pt(0, -1), layers: "top", at: pt(0, -0.9) },
        text: join(FRONT_TIP_UP, { en: "It's the snout.", fr: "C'est le groin.", es: "Es el hocico.", pt: "É o focinho." }),
      },
      { fold: { line: [pt(-1, -0.65), pt(1, -0.65)], from: pt(0, -1), behind: true }, text: BACK_TIP_BEHIND },
    ],
    done: {
      en: "Draw the eyes and two holes in the snout. Oink!",
      fr: "Dessine les yeux et deux trous dans le groin. Groin groin !",
      es: "Dibuja los ojos y dos agujeros en el hocico. ¡Oinc!",
      pt: "Desenhe os olhos e dois furinhos no focinho. Oinc!",
    },
    face: [
      ...eyes(0.16, -0.17),
      { nose: [-0.07, -0.5], rx: 0.03, ry: 0.045 },
      { nose: [0.07, -0.5], rx: 0.03, ry: 0.045 },
    ],
  },
  {
    id: "bear",
    name: { en: "bear face", fr: "tête d'ours", es: "cara de oso", pt: "cara de urso" },
    theme: "animals",
    colour: "#B5835A",
    steps: [
      { fold: { line: [pt(0, -1), pt(0, 1)], from: pt(-1, 0), unfold: true }, text: join(WHITE_UP, CREASE_SIDES) },
      { fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, 1) }, text: TOP_DOWN },
      ...ears(0.6, 0.4),
      { fold: { line: [pt(-1, 0.1), pt(1, 0.1)], from: pt(0, 1) }, text: EAR_TIPS_DOWN },
      { fold: { line: [pt(-1, -0.7), pt(1, -0.7)], from: pt(0, -1) }, text: CHIN_UP },
    ],
    done: {
      en: "Draw the eyes, a round nose and a smile. Grr!",
      fr: "Dessine les yeux, un nez tout rond et un sourire. Grrr !",
      es: "Dibuja los ojos, una nariz redonda y una sonrisa. ¡Grrr!",
      pt: "Desenhe os olhos, um nariz redondo e um sorriso. Grrr!",
    },
    face: [
      ...eyes(0.18, -0.2),
      { nose: [0, -0.33], rx: 0.07, ry: 0.05 },
      { line: "M0 -0.38 L0 -0.42 M-0.07 -0.45 Q-0.035 -0.47 0 -0.42 Q0.035 -0.47 0.07 -0.45" },
    ],
  },
  {
    id: "fox",
    name: { en: "fox face", fr: "tête de renard", es: "cara de zorro", pt: "cara de raposa" },
    theme: "animals",
    colour: "#FF7A2E",
    steps: [
      { fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, 1) }, text: join(WHITE_UP, TOP_DOWN) },
      ...ears(0.55, 0.35),
      {
        fold: { line: [pt(-1, -0.82), pt(1, -0.82)], from: pt(0, -1), layers: "top", at: pt(0, -0.95) },
        text: join(FRONT_TIP_UP, { en: "It's the nose.", fr: "C'est le museau.", es: "Es el hocico.", pt: "É o focinho." }),
      },
      { fold: { line: [pt(-1, -0.82), pt(1, -0.82)], from: pt(0, -1), behind: true }, text: BACK_TIP_BEHIND },
    ],
    done: {
      en: "Draw two eyes and color the nose black. Clever fox!",
      fr: "Dessine deux yeux et colorie le museau en noir. Malin, le renard !",
      es: "Dibuja dos ojos y pinta de negro el hocico. ¡Qué zorro tan listo!",
      pt: "Desenhe dois olhos e pinte o focinho de preto. Que raposa esperta!",
    },
    face: [...eyes(0.15, -0.3, 0.04), { line: "M-0.12 -0.42 Q0 -0.5 0.12 -0.42" }],
  },
  {
    id: "mouse",
    name: { en: "mouse face", fr: "tête de souris", es: "cara de ratón", pt: "cara de ratinho" },
    theme: "animals",
    colour: "#A9A9BE",
    steps: [
      { fold: { line: [pt(0, -1), pt(0, 1)], from: pt(-1, 0), unfold: true }, text: join(WHITE_UP, CREASE_SIDES) },
      { fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, 1) }, text: TOP_DOWN },
      ...ears(0.7, 0.45),
      { fold: { line: [pt(-1, 0.12), pt(1, 0.12)], from: pt(0, 1) }, text: EAR_TIPS_DOWN },
    ],
    done: {
      en: "Draw the eyes, a nose at the tip and whiskers. Squeak!",
      fr: "Dessine les yeux, un nez au bout et des moustaches. Couic !",
      es: "Dibuja los ojos, una nariz en la punta y los bigotes. ¡Iiih!",
      pt: "Desenhe os olhos, um nariz na ponta e os bigodes. Quic!",
    },
    face: [
      ...eyes(0.14, -0.3),
      { nose: [0, -0.9], rx: 0.055, ry: 0.045 },
      { line: "M-0.06 -0.74 L-0.26 -0.68 M-0.06 -0.78 L-0.26 -0.8 M0.06 -0.74 L0.26 -0.68 M0.06 -0.78 L0.26 -0.8" },
    ],
  },
  {
    id: "penguin",
    name: { en: "penguin", fr: "pingouin", es: "pingüino", pt: "pinguim" },
    theme: "animals",
    colour: "#3B4258",
    steps: [
      { fold: { line: [pt(0, -1), pt(0, 1)], from: pt(-1, 0), unfold: true }, text: join(WHITE_UP, CREASE_SIDES) },
      {
        fold: { line: [pt(-0.55, -1), pt(-0.55, 1)], from: pt(-1, 0) },
        text: {
          en: "Fold the left corner in, not quite to the middle: a wing.",
          fr: "Plie la pointe de gauche vers le milieu, sans l'atteindre : une aile.",
          es: "Dobla la punta izquierda hacia el medio, sin llegar: es un ala.",
          pt: "Dobre a ponta da esquerda para o meio, sem chegar lá: é uma asa.",
        },
      },
      {
        fold: { line: [pt(0.55, -1), pt(0.55, 1)], from: pt(1, 0) },
        text: {
          en: "Fold the right corner in the same way: the other wing.",
          fr: "Plie la pointe de droite de la même façon : l'autre aile.",
          es: "Dobla la punta derecha igual: es la otra ala.",
          pt: "Dobre a ponta da direita do mesmo jeito: a outra asa.",
        },
      },
      {
        fold: { line: [pt(-1, 0.5), pt(1, 0.5)], from: pt(0, 1) },
        text: {
          en: "Fold the top corner down to the middle: the head.",
          fr: "Plie la pointe du haut jusqu'au milieu : c'est la tête.",
          es: "Dobla la punta de arriba hasta el medio: es la cabeza.",
          pt: "Dobre a ponta de cima até o meio: é a cabeça.",
        },
      },
      {
        fold: { line: [pt(-1, 0.15), pt(1, 0.15)], from: pt(0, 0), layers: "top", at: pt(0, 0.05) },
        text: {
          en: "Fold the tip of the head back up a little: the beak.",
          fr: "Remonte un peu le bout de la tête : c'est le bec.",
          es: "Dobla un poco hacia arriba la punta de la cabeza: es el pico.",
          pt: "Dobre um pouco para cima a ponta da cabeça: é o bico.",
        },
      },
      {
        fold: { line: [pt(-1, -0.7), pt(1, -0.7)], from: pt(0, -1), behind: true },
        text: {
          en: "Fold the bottom corner behind, so the penguin can stand.",
          fr: "Plie la pointe du bas derrière : le pingouin tient debout.",
          es: "Dobla la punta de abajo hacia atrás: así el pingüino se sostiene.",
          pt: "Dobre a ponta de baixo para trás: assim o pinguim fica em pé.",
        },
      },
    ],
    done: {
      en: "Draw the eyes and two feet. Waddle, waddle!",
      fr: "Dessine les yeux et deux pattes. Il se dandine !",
      es: "Dibuja los ojos y dos patas. ¡A caminar!",
      pt: "Desenhe os olhos e dois pezinhos. Lá vai ele!",
    },
    face: [
      // White around the eyes, so they show on the dark paper.
      { line: "M-0.06 0.38 A0.07 0.07 0 1 0 -0.2 0.38 A0.07 0.07 0 1 0 -0.06 0.38 Z", fill: "#fff" },
      { line: "M0.2 0.38 A0.07 0.07 0 1 0 0.06 0.38 A0.07 0.07 0 1 0 0.2 0.38 Z", fill: "#fff" },
      ...eyes(0.13, 0.38, 0.035),
      { line: "M-0.2 -0.66 Q-0.12 -0.6 -0.04 -0.66 M0.04 -0.66 Q0.12 -0.6 0.2 -0.66" }],
  },
  {
    id: "whale",
    name: { en: "whale", fr: "baleine", es: "ballena", pt: "baleia" },
    theme: "animals",
    colour: "#4C8FE8",
    steps: [
      {
        fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, 1), unfold: true },
        text: join(WHITE_UP, {
          en: "Fold in half from top to bottom, then unfold.",
          fr: "Plie en deux de haut en bas, puis déplie.",
          es: "Dobla por la mitad de arriba abajo y desdobla.",
          pt: "Dobre ao meio de cima para baixo e desdobre.",
        }),
      },
      {
        fold: { line: [pt(1, 0), pt(-KITE, KITE_X)], from: pt(0, 1) },
        text: {
          en: "Fold the top corner down to the middle line.",
          fr: "Plie la pointe du haut jusqu'au pli du milieu.",
          es: "Dobla la punta de arriba hasta la línea del medio.",
          pt: "Dobre a ponta de cima até a linha do meio.",
        },
      },
      {
        fold: { line: [pt(1, 0), pt(-KITE, -KITE_X)], from: pt(0, -1) },
        text: {
          en: "Fold the bottom corner up to the middle line.",
          fr: "Plie la pointe du bas jusqu'au pli du milieu.",
          es: "Dobla la punta de abajo hasta la línea del medio.",
          pt: "Dobre a ponta de baixo até a linha do meio.",
        },
      },
      {
        fold: { line: [pt(-0.6, -1), pt(-0.6, 1)], from: pt(-1, 0) },
        text: {
          en: "Fold the left tip over a little: the head.",
          fr: "Rabats un peu la pointe de gauche : c'est la tête.",
          es: "Dobla un poco la punta izquierda: es la cabeza.",
          pt: "Dobre um pouco a ponta da esquerda: é a cabeça.",
        },
      },
      {
        fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, -1), behind: true },
        text: {
          en: "Fold in half: the bottom half goes behind.",
          fr: "Plie en deux : la moitié du bas passe derrière.",
          es: "Dobla por la mitad: la parte de abajo va hacia atrás.",
          pt: "Dobre ao meio: a metade de baixo vai para trás.",
        },
      },
      {
        fold: { line: [pt(0.55, 0), pt(0.7, 0.3 * KITE)], from: pt(1, 0) },
        text: {
          en: "Fold the right tip up: the tail.",
          fr: "Relève la pointe de droite : c'est la queue.",
          es: "Dobla hacia arriba la punta derecha: es la cola.",
          pt: "Dobre para cima a ponta da direita: é o rabo.",
        },
      },
    ],
    done: {
      en: "Draw an eye, a smile and a water spout. Splash!",
      fr: "Dessine un œil, un sourire et un jet d'eau. Splash !",
      es: "Dibuja un ojo, una sonrisa y un chorro de agua. ¡Splash!",
      pt: "Desenhe um olho, um sorriso e um esguicho de água. Splash!",
    },
    face: [{ eye: [-0.33, 0.22], r: 0.04 }, { line: "M-0.5 0.1 Q-0.4 0.04 -0.3 0.1" }, { line: "M-0.15 0.55 Q-0.2 0.68 -0.3 0.7 M-0.15 0.55 Q-0.1 0.7 0 0.72" }],
  },
  {
    id: "owl",
    name: { en: "owl", fr: "chouette", es: "búho", pt: "coruja" },
    theme: "animals",
    colour: "#8E5CC6",
    steps: [
      { fold: { line: [pt(0, -1), pt(0, 1)], from: pt(-1, 0), unfold: true }, text: join(WHITE_UP, CREASE_SIDES) },
      { fold: { line: [pt(0, -1), pt(-KITE_X, KITE)], from: pt(-1, 0) }, text: KITE_LEFT },
      { fold: { line: [pt(0, -1), pt(KITE_X, KITE)], from: pt(1, 0) }, text: KITE_RIGHT },
      {
        fold: { line: [pt(-1, 0.45), pt(1, 0.45)], from: pt(0, 1) },
        text: {
          en: "Fold the top corner down: it's the beak.",
          fr: "Plie la pointe du haut vers le bas : c'est le bec.",
          es: "Dobla hacia abajo la punta de arriba: es el pico.",
          pt: "Dobre a ponta de cima para baixo: é o bico.",
        },
      },
      {
        fold: { line: [pt(-1, -0.6), pt(1, -0.6)], from: pt(0, -1), behind: true },
        text: {
          en: "Fold the bottom corner behind.",
          fr: "Plie la pointe du bas derrière.",
          es: "Dobla la punta de abajo hacia atrás.",
          pt: "Dobre a ponta de baixo para trás.",
        },
      },
    ],
    done: {
      en: "Draw two big round eyes. Hoo-hoo!",
      fr: "Dessine deux grands yeux ronds. Hou hou !",
      es: "Dibuja dos ojos grandes y redondos. ¡Uh, uh!",
      pt: "Desenhe dois olhos grandes e redondos. Uh-uh!",
    },
    face: [
      { line: "M-0.11 0.28 A0.09 0.09 0 1 0 -0.29 0.28 A0.09 0.09 0 1 0 -0.11 0.28 Z", fill: "#fff" },
      { line: "M0.29 0.28 A0.09 0.09 0 1 0 0.11 0.28 A0.09 0.09 0 1 0 0.29 0.28 Z", fill: "#fff" },
      ...eyes(0.2, 0.28, 0.04),
      { line: "M-0.05 0.08 L0.05 0.08 L0 -0.06 Z", fill: "#FFB020" },
    ],
  },
  {
    id: "heart",
    name: { en: "heart", fr: "cœur", es: "corazón", pt: "coração" },
    theme: "things",
    colour: "#FF4F6E",
    steps: [
      {
        fold: { line: [pt(-1, 0.5), pt(1, 0.5)], from: pt(0, 1) },
        text: join(WHITE_UP, {
          en: "Fold the top corner down to the middle.",
          fr: "Plie la pointe du haut jusqu'au milieu.",
          es: "Dobla la punta de arriba hasta el medio.",
          pt: "Dobre a ponta de cima até o meio.",
        }),
      },
      {
        fold: { line: [pt(-1, -0.25), pt(1, -0.25)], from: pt(0, -1) },
        text: {
          en: "Fold the bottom corner up to the top edge.",
          fr: "Plie la pointe du bas jusqu'au bord du haut.",
          es: "Dobla la punta de abajo hasta el borde de arriba.",
          pt: "Dobre a ponta de baixo até a borda de cima.",
        },
      },
      {
        fold: { line: [pt(0, -0.25), pt(0.75, 0.5)], from: pt(1, 0) },
        text: {
          en: "Fold the bottom right edge up to the middle.",
          fr: "Remonte le bord du bas, à droite, jusqu'au milieu.",
          es: "Sube el borde de abajo, a la derecha, hasta el medio.",
          pt: "Suba a borda de baixo, à direita, até o meio.",
        },
      },
      {
        fold: { line: [pt(0, -0.25), pt(-0.75, 0.5)], from: pt(-1, 0) },
        text: {
          en: "Fold the bottom left edge up to the middle too.",
          fr: "Remonte aussi le bord du bas, à gauche.",
          es: "Sube también el borde de abajo, a la izquierda.",
          pt: "Suba também a borda de baixo, à esquerda.",
        },
      },
      {
        turn: true,
        fold: { line: [pt(-1, 0.64), pt(1, 0.64)], from: pt(0, 1), behind: true },
        text: {
          en: "Turn the paper over. Fold the two top points behind.",
          fr: "Retourne la feuille. Plie les deux pointes du haut derrière.",
          es: "Da la vuelta al papel. Dobla hacia atrás las dos puntas de arriba.",
          pt: "Vire o papel. Dobre para trás as duas pontas de cima.",
        },
      },
    ],
    done: {
      en: "Draw a face or write a message. Give it to someone you love!",
      fr: "Dessine un visage ou écris un mot. Offre-le à quelqu'un que tu aimes !",
      es: "Dibuja una cara o escribe un mensaje. ¡Regálalo a alguien que quieras!",
      pt: "Desenhe um rosto ou escreva um recado. Dê para alguém que você ama!",
    },
    face: [...eyes(0.13, 0.25, 0.04), { line: "M-0.08 0.14 Q0 0.07 0.08 0.14" }],
  },
  {
    id: "tulip",
    name: { en: "tulip", fr: "tulipe", es: "tulipán", pt: "tulipa" },
    theme: "nature",
    colour: "#FF5C93",
    steps: [
      { fold: { line: [pt(0, -1), pt(0, 1)], from: pt(-1, 0), unfold: true }, text: join(WHITE_UP, CREASE_SIDES) },
      { fold: { line: [pt(-1, 0), pt(1, 0)], from: pt(0, -1) }, text: HALF_UP },
      {
        fold: { line: [pt(-0.2, 0), pt(-0.6, 0.4)], from: pt(-1, 0) },
        text: {
          en: "Fold the left corner up beside the top: a petal.",
          fr: "Remonte la pointe de gauche à côté du haut : un pétale.",
          es: "Sube la punta izquierda junto a la de arriba: un pétalo.",
          pt: "Suba a ponta da esquerda ao lado da de cima: uma pétala.",
        },
      },
      {
        fold: { line: [pt(0.2, 0), pt(0.6, 0.4)], from: pt(1, 0) },
        text: {
          en: "Fold the right corner up the same way.",
          fr: "Remonte la pointe de droite de la même façon.",
          es: "Sube la punta derecha igual.",
          pt: "Suba a ponta da direita do mesmo jeito.",
        },
      },
      {
        fold: { line: [pt(-1, 0.12), pt(1, 0.12)], from: pt(0, 0), behind: true },
        text: {
          en: "Fold the bottom edge behind.",
          fr: "Plie le bord du bas derrière.",
          es: "Dobla el borde de abajo hacia atrás.",
          pt: "Dobre a borda de baixo para trás.",
        },
      },
    ],
    done: {
      en: "Glue it on paper and draw a long stem and two leaves.",
      fr: "Colle-la sur une feuille et dessine une longue tige et deux feuilles.",
      es: "Pégalo en un papel y dibuja un tallo largo y dos hojas.",
      pt: "Cole em um papel e desenhe um caule comprido e duas folhas.",
    },
    face: [...eyes(0.12, 0.45, 0.04), { line: "M-0.08 0.36 Q0 0.3 0.08 0.36" }],
  },
  {
    id: "tree",
    name: { en: "fir tree", fr: "sapin", es: "abeto", pt: "pinheiro" },
    theme: "nature",
    colour: "#2FA36B",
    steps: [
      { fold: { line: [pt(0, -1), pt(0, 1)], from: pt(-1, 0), unfold: true }, text: join(WHITE_UP, CREASE_SIDES) },
      { fold: { line: [pt(0, 1), pt(-KITE_X, -KITE)], from: pt(-1, 0) }, text: KITE_LEFT },
      { fold: { line: [pt(0, 1), pt(KITE_X, -KITE)], from: pt(1, 0) }, text: KITE_RIGHT },
      {
        fold: { line: [pt(-1, -0.55), pt(1, -0.55)], from: pt(0, -1) },
        text: {
          en: "Fold the bottom corner up.",
          fr: "Remonte la pointe du bas.",
          es: "Dobla hacia arriba la punta de abajo.",
          pt: "Dobre a ponta de baixo para cima.",
        },
      },
      {
        fold: { line: [pt(-1, -0.4), pt(1, -0.4)], from: pt(0, -0.1), layers: "top", at: pt(0, -0.2) },
        text: {
          en: "Fold its tip back down, past the bottom: the trunk.",
          fr: "Redescends sa pointe, plus bas que le bord : c'est le tronc.",
          es: "Vuelve a bajar su punta, más abajo del borde: es el tronco.",
          pt: "Dobre a ponta de volta para baixo, passando da borda: é o tronco.",
        },
      },
    ],
    done: {
      en: "Color the trunk brown and draw balls and a star.",
      fr: "Colorie le tronc en marron, dessine des boules et une étoile.",
      es: "Pinta el tronco de marrón y dibuja bolas y una estrella.",
      pt: "Pinte o tronco de marrom e desenhe bolinhas e uma estrela.",
    },
    face: [
      { nose: [-0.15, 0.05], rx: 0.04, ry: 0.04 },
      { nose: [0.12, 0.3], rx: 0.04, ry: 0.04 },
      { nose: [0.22, -0.2], rx: 0.04, ry: 0.04 },
      { nose: [-0.3, -0.3], rx: 0.04, ry: 0.04 },
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
  nature: { en: "Nature", fr: "Nature", es: "Naturaleza", pt: "Natureza" },
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
      en: "Use a square of paper, colored on one side. Fold on the dashed lines.",
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
    en: "Cut a square from colored paper (15 cm or 6 inches is a good size), or use origami paper. Fold each step together, pressing the creases flat with a fingernail, and compare with the next picture before going on.",
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
