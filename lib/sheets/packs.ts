// The Pro packs (docs/pro-packs, claude-notes.md): one PDF per worksheet
// type with every sheet, smaller packs by level or theme, and a Mega pack
// with every type in five parts (each file under about 15 MB). Each pack exists in the four languages
// and on two paper sizes; scripts/sheets/packs.ts builds the PDFs into
// pro-files/<lang>/packs/ (git-ignored, uploaded to the private R2 bucket),
// and only /api/bundles/... serves them, after a Pro check.
//
// Pure data: the pages, the download route and the generator read it.
import { getSheetKind, sheetsOfKind, type Sheet } from "./catalog";
import type { L10n, SheetKindId, SheetLocale } from "./types";
import { PUZZLES } from "@/lib/puzzles";

/** A worksheet type of the packs: the twelve sheet types, and the sliding puzzles printed to cut out. */
export type PackKind = SheetKindId | "sliding-puzzles";

/** A titled run of pages in a pack: sheet ids, or scene ids for the sliding puzzles. */
export type PackSection = { label: L10n; items: string[] };

export type Pack = {
  id: string;
  kind: PackKind | "mega";
  scope: "complete" | "level" | "mega";
  slug: L10n;
  /** "Complete pack", "Numbers to 20"… */
  name: L10n;
  sections: PackSection[];
  /** Answer keys at the end. */
  keys: boolean;
  /** The Mega pack: one PDF per part. */
  parts?: { name: L10n; kinds: PackKind[] }[];
};

export type PackPaper = "letter" | "a4";
export const PACK_PAPERS: readonly PackPaper[] = ["letter", "a4"];
/** The paper a language's packs open with: Letter in English, A4 elsewhere. */
export const DEFAULT_PAPER: Record<SheetLocale, PackPaper> = { en: "letter", fr: "a4", es: "a4", pt: "a4" };

// ------------------------------------------------------------------ the types

const PUZZLE_KIND = {
  slug: { en: "sliding-puzzles", fr: "taquins", es: "rompecabezas-deslizantes", pt: "quebra-cabecas-deslizantes" },
  name: { en: "Sliding Puzzles", fr: "Taquins", es: "Rompecabezas deslizantes", pt: "Quebra-cabeças deslizantes" },
  level: { en: "Preschool to second grade (ages 4–8)", fr: "De la moyenne section au CE1 (4 à 8 ans)", es: "De preescolar a segundo de primaria (4 a 8 años)", pt: "Da educação infantil ao 2º ano (4 a 8 anos)" },
} satisfies { slug: L10n; name: L10n; level: L10n };

export function packKindSlug(kind: PackKind): L10n {
  return kind === "sliding-puzzles" ? PUZZLE_KIND.slug : getSheetKind(kind).slug;
}

export function packKindName(kind: PackKind): L10n {
  return kind === "sliding-puzzles" ? PUZZLE_KIND.name : getSheetKind(kind).name;
}

/** The type's level and ages, for the cover. */
export function packKindLevel(kind: PackKind): L10n {
  return kind === "sliding-puzzles" ? PUZZLE_KIND.level : getSheetKind(kind).level;
}

// ------------------------------------------------------------------ sections

const text = (en: string, fr: string, es: string, pt: string): L10n => ({ en, fr, es, pt });

/** One section per value of a filter, in this order, labelled like the listing's filter (or `labels`). */
function byFilter(kind: SheetKindId, key: string, values: string[], labels: Record<string, L10n> = {}, within?: (a: Sheet, b: Sheet) => number): PackSection[] {
  const filter = getSheetKind(kind).filters.find((f) => f.key === key)!;
  const sheets = sheetsOfKind(kind);
  const sections = values.map((value) => {
    const list = sheets.filter((s) => s.filters[key] === value);
    if (within) list.sort(within);
    return { label: labels[value] ?? filter.options.find((o) => o.value === value)!.label, items: list.map((s) => s.id) };
  });
  const placed = sections.reduce((n, s) => n + s.items.length, 0);
  if (placed !== sheets.length) throw new Error(`${kind}: the pack sections hold ${placed} of ${sheets.length} sheets`);
  return sections;
}

/** Sections chosen by sheet id (types without a filter that fits). */
function byId(kind: SheetKindId, groups: { label: L10n; test: (id: string) => boolean }[]): PackSection[] {
  const sheets = sheetsOfKind(kind);
  const sections = groups.map((g) => ({ label: g.label, items: sheets.filter((s) => g.test(s.id)).map((s) => s.id) }));
  const placed = sections.reduce((n, s) => n + s.items.length, 0);
  if (placed !== sheets.length) throw new Error(`${kind}: the pack sections hold ${placed} of ${sheets.length} sheets`);
  return sections;
}

// Easy before hard, "circle" before "draw".
const firstOf = (key: string, value: string) => (a: Sheet, b: Sheet) => Number(b.filters[key] === value) - Number(a.filters[key] === value);
const stepsUp = (a: Sheet, b: Sheet) => Number(a.filters.steps) - Number(b.filters.steps);

const HTD_ANIMALS = ["cat", "fish", "butterfly", "dog", "bird", "turtle", "snail", "whale", "owl", "bear", "bee", "frog", "pig", "rabbit", "duck", "ladybug", "penguin"];
const HTD_NATURE = ["apple", "ice-cream", "mushroom", "tree", "carrot", "pear", "strawberry", "flower", "cupcake", "sun", "cloud", "rainbow"];
const htd = (list: string[]) => (id: string) => list.includes(id.replace(/^draw-/, ""));
const HUMAN = ["body", "face", "hand"];

/** Every type's sections, easy to hard or by theme: the complete pack's order. */
const SECTIONS: Record<PackKind, PackSection[]> = {
  "missing-numbers": byFilter(
    "missing-numbers",
    "upTo",
    ["10", "20", "50", "100"],
    {
      "10": text("Numbers to 10", "Les nombres jusqu'à 10", "Números hasta el 10", "Números até 10"),
      "20": text("Numbers to 20", "Les nombres jusqu'à 20", "Números hasta el 20", "Números até 20"),
      "50": text("Numbers to 50", "Les nombres jusqu'à 50", "Números hasta el 50", "Números até 50"),
      "100": text("Numbers to 100 and skip counting", "Les nombres jusqu'à 100 et compter par bonds", "Números hasta el 100 y contar de tanto en tanto", "Números até 100 e contagem de tantos em tantos"),
    },
    firstOf("difficulty", "easy"),
  ),
  patterns: byFilter("patterns", "type", ["ab", "aab", "abb", "aabb", "abc", "growing"], {}, firstOf("version", "circle")),
  stickers: byFilter("stickers", "group", ["letters-numbers", "animals", "food", "things", "rewards"]),
  "dot-to-dot": byFilter("dot-to-dot", "level", ["easy", "medium", "hard", "letters"]),
  colouring: byFilter("colouring", "version", ["number", "plain"]),
  "how-to-draw": byId("how-to-draw", [
    { label: text("Animals", "Les animaux", "Animales", "Animais"), test: htd(HTD_ANIMALS) },
    { label: text("Food and nature", "Aliments et nature", "Comida y naturaleza", "Comidas e natureza"), test: htd(HTD_NATURE) },
    { label: text("Vehicles and things", "Véhicules et objets", "Vehículos y cosas", "Veículos e objetos"), test: (id) => !htd(HTD_ANIMALS)(id) && !htd(HTD_NATURE)(id) },
  ]).map((s) => ({ ...s, items: [...s.items].sort((a, b) => stepsUp(sheetById("how-to-draw", a), sheetById("how-to-draw", b))) })),
  "body-parts": byId("body-parts", [
    { label: text("The human body", "Le corps humain", "El cuerpo humano", "O corpo humano"), test: (id) => HUMAN.some((h) => id.startsWith(`${h}-`)) },
    { label: text("Animals and a plant", "Les animaux et une plante", "Animales y una planta", "Animais e uma planta"), test: (id) => !HUMAN.some((h) => id.startsWith(`${h}-`)) },
  ]),
  "flash-cards": byFilter("flash-cards", "theme", ["letters-numbers", "colours-shapes", "animals", "nature", "food", "everyday"]),
  "telling-time": byFilter("telling-time", "level", ["oclock", "half", "quarter", "five", "any", "routine"]),
  mazes: byFilter("mazes", "level", ["easy", "medium", "hard"]),
  "tracing-lines": byFilter("tracing-lines", "group", ["lines", "shapes", "pictures"]),
  origami: byFilter("origami", "theme", ["things", "animals", "nature"]),
  "sliding-puzzles": [{ label: text("24 picture puzzles", "24 taquins en images", "24 rompecabezas de dibujos", "24 quebra-cabeças de desenhos"), items: PUZZLES.map((p) => p.id) }],
};

function sheetById(kind: SheetKindId, id: string): Sheet {
  return sheetsOfKind(kind).find((s) => s.id === id)!;
}

/** Types whose packs end with answer keys. Telling time and mazes print theirs with each sheet. */
export const KEY_KINDS: readonly PackKind[] = ["missing-numbers", "patterns", "dot-to-dot", "colouring", "body-parts", "telling-time", "mazes"];

// ------------------------------------------------------------------ the packs

/** A smaller pack: some of the type's sections, by their index in SECTIONS. */
type Level = { seg: L10n; name: L10n; sections: number[] };

const LEVELS: Partial<Record<PackKind, Level[]>> = {
  "missing-numbers": [
    { seg: text("1-to-20", "1-a-20", "1-al-20", "1-a-20"), name: text("Numbers 1 to 20", "Les nombres de 1 à 20", "Números del 1 al 20", "Números de 1 a 20"), sections: [0, 1] },
    { seg: text("1-to-50", "1-a-50", "1-al-50", "1-a-50"), name: text("Numbers to 50", "Les nombres jusqu'à 50", "Números hasta el 50", "Números até 50"), sections: [2] },
    { seg: text("1-to-100-and-skip-counting", "1-a-100-et-bonds", "1-al-100-y-saltos", "1-a-100-e-saltos"), name: text("Numbers to 100 and skip counting", "Jusqu'à 100 et compter par bonds", "Hasta el 100 y contar de tanto en tanto", "Até 100 e contagem de tantos em tantos"), sections: [3] },
  ],
  patterns: [
    { seg: text("ab-aab-abb-aabb", "ab-aab-abb-aabb", "ab-aab-abb-aabb", "ab-aab-abb-aabb"), name: text("AB, AAB, ABB and AABB", "AB, AAB, ABB et AABB", "AB, AAB, ABB y AABB", "AB, AAB, ABB e AABB"), sections: [0, 1, 2, 3] },
    { seg: text("abc-and-growing", "abc-et-qui-grandissent", "abc-y-crecientes", "abc-e-crescentes"), name: text("ABC and growing patterns", "ABC et suites qui grandissent", "ABC y series que crecen", "ABC e sequências crescentes"), sections: [4, 5] },
  ],
  "dot-to-dot": [
    { seg: text("easy", "faciles", "faciles", "faceis"), name: text("Easy, 1 to 10", "Faciles, de 1 à 10", "Fáciles, del 1 al 10", "Fáceis, de 1 a 10"), sections: [0] },
    { seg: text("medium", "moyens", "medios", "medios"), name: text("Medium, 1 to 20", "Moyens, de 1 à 20", "Medios, del 1 al 20", "Médios, de 1 a 20"), sections: [1] },
    { seg: text("hard-and-letters", "difficiles-et-lettres", "dificiles-y-letras", "dificeis-e-letras"), name: text("Hard, 1 to 50, and letters A to Z", "Difficiles, de 1 à 50, et lettres de A à Z", "Difíciles, del 1 al 50, y letras de la A a la Z", "Difíceis, de 1 a 50, e letras de A a Z"), sections: [2, 3] },
  ],
  colouring: [
    { seg: text("color-by-number", "magiques", "por-numeros", "por-numeros"), name: text("Color by number", "Coloriages magiques", "Colorear por números", "Colorir por números"), sections: [0] },
    { seg: text("free-coloring", "libres", "libres", "livres"), name: text("Free coloring pages", "Coloriages libres", "Dibujos para colorear libres", "Desenhos para colorir livres"), sections: [1] },
  ],
  "how-to-draw": [
    { seg: text("animals", "animaux", "animales", "animais"), name: text("Animals", "Les animaux", "Animales", "Animais"), sections: [0] },
    { seg: text("food-and-nature", "aliments-et-nature", "comida-y-naturaleza", "comidas-e-natureza"), name: text("Food and nature", "Aliments et nature", "Comida y naturaleza", "Comidas e natureza"), sections: [1] },
    { seg: text("vehicles-and-things", "vehicules-et-objets", "vehiculos-y-cosas", "veiculos-e-objetos"), name: text("Vehicles and things", "Véhicules et objets", "Vehículos y cosas", "Veículos e objetos"), sections: [2] },
  ],
  "body-parts": [
    { seg: text("human-body", "corps-humain", "cuerpo-humano", "corpo-humano"), name: text("The human body", "Le corps humain", "El cuerpo humano", "O corpo humano"), sections: [0] },
    { seg: text("animals-and-plant", "animaux-et-plante", "animales-y-planta", "animais-e-planta"), name: text("Animals and a plant", "Les animaux et une plante", "Animales y una planta", "Animais e uma planta"), sections: [1] },
  ],
  "flash-cards": [
    { seg: text("letters-numbers-colors-shapes", "lettres-chiffres-couleurs-formes", "letras-numeros-colores-figuras", "letras-numeros-cores-formas"), name: text("Letters, numbers, colors and shapes", "Lettres, chiffres, couleurs et formes", "Letras, números, colores y figuras", "Letras, números, cores e formas"), sections: [0, 1] },
    { seg: text("animals-and-nature", "animaux-et-nature", "animales-y-naturaleza", "animais-e-natureza"), name: text("Animals and nature", "Animaux et nature", "Animales y naturaleza", "Animais e natureza"), sections: [2, 3] },
    { seg: text("food-and-everyday", "aliments-et-quotidien", "comida-y-vida-diaria", "comidas-e-dia-a-dia"), name: text("Food and everyday things", "Aliments et vie quotidienne", "Comida y vida diaria", "Comidas e dia a dia"), sections: [4, 5] },
  ],
  "telling-time": [
    { seg: text("oclock-and-half-past", "heures-et-demies", "en-punto-y-media", "horas-e-meias"), name: text("O'clock and half past", "Heures pile et demies", "En punto y y media", "Horas exatas e meias"), sections: [0, 1] },
    { seg: text("quarters-and-minutes", "quarts-et-minutes", "cuartos-y-minutos", "quartos-e-minutos"), name: text("Quarters, 5 minutes and any time", "Quarts d'heure, 5 minutes et toutes les heures", "Cuartos, 5 minutos y cualquier hora", "Quartos, 5 minutos e qualquer hora"), sections: [2, 3, 4, 5] },
  ],
  mazes: [
    { seg: text("easy", "faciles", "faciles", "faceis"), name: text("Easy mazes", "Labyrinthes faciles", "Laberintos fáciles", "Labirintos fáceis"), sections: [0] },
    { seg: text("medium", "moyens", "medios", "medios"), name: text("Medium mazes", "Labyrinthes moyens", "Laberintos medios", "Labirintos médios"), sections: [1] },
    { seg: text("hard", "difficiles", "dificiles", "dificeis"), name: text("Hard mazes", "Labyrinthes difficiles", "Laberintos difíciles", "Labirintos difíceis"), sections: [2] },
  ],
  "tracing-lines": [
    { seg: text("lines-and-shapes", "lignes-et-formes", "lineas-y-figuras", "linhas-e-formas"), name: text("Lines and shapes", "Lignes et formes", "Líneas y figuras", "Linhas e formas"), sections: [0, 1] },
    { seg: text("pictures", "dessins", "dibujos", "desenhos"), name: text("Picture tracing", "Dessins à repasser", "Dibujos para repasar", "Desenhos para cobrir"), sections: [2] },
  ],
};

export const PACK_KINDS: readonly PackKind[] = [
  "missing-numbers",
  "patterns",
  "stickers",
  "dot-to-dot",
  "colouring",
  "how-to-draw",
  "body-parts",
  "flash-cards",
  "telling-time",
  "mazes",
  "tracing-lines",
  "origami",
  "sliding-puzzles",
];

const PREFIX = { fr: "pack", es: "paquete", pt: "pacote" } as const;
const COMPLETE = text("complete", "complet", "completo", "completo");

function slugFor(kind: PackKind, seg: L10n): L10n {
  const k = packKindSlug(kind);
  return { en: `${k.en}-${seg.en}-pack`, fr: `${PREFIX.fr}-${k.fr}-${seg.fr}`, es: `${PREFIX.es}-${k.es}-${seg.es}`, pt: `${PREFIX.pt}-${k.pt}-${seg.pt}` };
}

function buildPacks(): Pack[] {
  const packs: Pack[] = [];
  for (const kind of PACK_KINDS) {
    const keys = KEY_KINDS.includes(kind);
    packs.push({
      id: `${kind}-complete`,
      kind,
      scope: "complete",
      slug: slugFor(kind, COMPLETE),
      name: text("Complete pack", "Pack complet", "Paquete completo", "Pacote completo"),
      sections: SECTIONS[kind],
      keys,
    });
    for (const level of LEVELS[kind] ?? []) {
      const sections = level.sections.map((i) => SECTIONS[kind][i]);
      packs.push({
        id: `${kind}-${level.seg.en}`,
        kind,
        scope: "level",
        slug: slugFor(kind, level.seg),
        name: level.name,
        sections,
        // Free coloring pages have nothing to check.
        keys: keys && !(kind === "colouring" && level.seg.en === "free-coloring"),
      });
    }
  }
  packs.push({
    id: "mega",
    kind: "mega",
    scope: "mega",
    slug: { en: "mega-pack", fr: "pack-mega", es: "paquete-mega", pt: "pacote-mega" },
    name: text("Mega pack", "Méga pack", "Megapaquete", "Megapacote"),
    sections: [],
    keys: true,
    parts: [
      { name: text("Numbers and time", "Nombres et heure", "Números y la hora", "Números e horas"), kinds: ["missing-numbers", "telling-time"] },
      { name: text("Patterns and mazes", "Suites logiques et labyrinthes", "Series y laberintos", "Sequências e labirintos"), kinds: ["patterns", "mazes"] },
      { name: text("Coloring and dot to dot", "Coloriages et points à relier", "Colorear y unir puntos", "Colorir e ligar pontos"), kinds: ["colouring", "dot-to-dot"] },
      { name: text("Drawing, tracing and origami", "Dessin, graphisme et origami", "Dibujo, trazos y origami", "Desenho, traçados e origami"), kinds: ["how-to-draw", "tracing-lines", "origami"] },
      { name: text("Words and play", "Mots et jeux", "Palabras y juegos", "Palavras e brincadeiras"), kinds: ["flash-cards", "body-parts", "stickers", "sliding-puzzles"] },
    ],
  });
  return packs;
}

export const PACKS: Pack[] = buildPacks();

export function getPack(locale: SheetLocale, slug: string): Pack | undefined {
  return PACKS.find((p) => p.slug[locale] === slug);
}

export function getPackById(id: string): Pack | undefined {
  return PACKS.find((p) => p.id === id);
}

/** A part of a pack in one file: the whole pack, or one part of the Mega pack. */
export function packFiles(pack: Pack): { part?: number }[] {
  return pack.parts ? pack.parts.map((_, i) => ({ part: i + 1 })) : [{}];
}

/** The file's key in pro-files/ and in the bucket. */
export function packKey(locale: SheetLocale, pack: Pack, paper: PackPaper, part?: number): string {
  return `${locale}/packs/${pack.slug[locale]}${part ? `-part-${part}` : ""}-${paper}.pdf`;
}

/** Items (sheets or scenes) in a pack, or in a part of the Mega pack. */
export function packItemCount(pack: Pack, part?: number): number {
  if (!pack.parts) return pack.sections.reduce((n, s) => n + s.items.length, 0);
  const kinds = part ? pack.parts[part - 1].kinds : pack.parts.flatMap((p) => p.kinds);
  return kinds.reduce((n, k) => n + SECTIONS[k].reduce((m, s) => m + s.items.length, 0), 0);
}

/** The complete pack of a type (the Mega pack is made of them). */
export function completePack(kind: PackKind): Pack {
  return PACKS.find((p) => p.kind === kind && p.scope === "complete")!;
}
