// Shapes and colours shared by the pattern and sticker sheets. The layout
// scripts draw the shapes (scripts/sheets/shapes.ts); the names print on the
// sheets in the sheet's language.
import type { L10n } from "@/lib/sheets/types";

export type ShapeId =
  | "circle"
  | "square"
  | "triangle"
  | "rectangle"
  | "star"
  | "heart"
  | "diamond"
  | "oval"
  | "pentagon"
  | "hexagon"
  | "crescent"
  | "arrow";

export const SHAPE_NAMES: Record<ShapeId, L10n> = {
  circle: { en: "circle", fr: "rond", es: "círculo", pt: "círculo" },
  square: { en: "square", fr: "carré", es: "cuadrado", pt: "quadrado" },
  triangle: { en: "triangle", fr: "triangle", es: "triángulo", pt: "triângulo" },
  rectangle: { en: "rectangle", fr: "rectangle", es: "rectángulo", pt: "retângulo" },
  star: { en: "star", fr: "étoile", es: "estrella", pt: "estrela" },
  heart: { en: "heart", fr: "cœur", es: "corazón", pt: "coração" },
  diamond: { en: "diamond", fr: "losange", es: "rombo", pt: "losango" },
  oval: { en: "oval", fr: "ovale", es: "óvalo", pt: "oval" },
  pentagon: { en: "pentagon", fr: "pentagone", es: "pentágono", pt: "pentágono" },
  hexagon: { en: "hexagon", fr: "hexagone", es: "hexágono", pt: "hexágono" },
  crescent: { en: "crescent", fr: "croissant", es: "media luna", pt: "meia-lua" },
  arrow: { en: "arrow", fr: "flèche", es: "flecha", pt: "seta" },
};

/** Each shape keeps one fill, so a shape pattern reads the same in colour and in grey. */
export const SHAPE_FILL: Record<ShapeId, string> = {
  circle: "#FFD5E3",
  square: "#CFE8FF",
  triangle: "#D7F5E6",
  rectangle: "#FFE7B8",
  star: "#FFF0A8",
  heart: "#FFC9D1",
  diamond: "#E3DBFF",
  oval: "#D9F2FF",
  pentagon: "#E8F7C8",
  hexagon: "#FFDCC7",
  crescent: "#FFF3C4",
  arrow: "#D5E0FF",
};

export type ColourId = "red" | "blue" | "yellow" | "green" | "orange" | "purple" | "pink";

// Spanish "morado" rather than "violeta" or "púrpura": the most common
// word in Latin America (docs/spanish-plan.md, D2).
export const COLOURS: Record<ColourId, { hex: string; name: L10n }> = {
  red: { hex: "#E53935", name: { en: "red", fr: "rouge", es: "rojo", pt: "vermelho" } },
  blue: { hex: "#1E88E5", name: { en: "blue", fr: "bleu", es: "azul", pt: "azul" } },
  yellow: { hex: "#FDD835", name: { en: "yellow", fr: "jaune", es: "amarillo", pt: "amarelo" } },
  green: { hex: "#43A047", name: { en: "green", fr: "vert", es: "verde", pt: "verde" } },
  orange: { hex: "#FB8C00", name: { en: "orange", fr: "orange", es: "naranja", pt: "laranja" } },
  purple: { hex: "#8E24AA", name: { en: "purple", fr: "violet", es: "morado", pt: "roxo" } },
  pink: { hex: "#F06292", name: { en: "pink", fr: "rose", es: "rosa", pt: "rosa" } },
};
