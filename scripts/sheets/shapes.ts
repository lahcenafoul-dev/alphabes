// Shapes and balloons drawn for the pattern and sticker sheets: thick dark
// outlines on a light fill, so they print well in colour and in grey. Each
// returns an <svg> of the given size in mm.
import { COLOURS, SHAPE_FILL, type ColourId, type ShapeId } from "../../data/worksheets/vocab";
import { INK } from "./chrome";

// Drawn in a 40 × 40 box, inside a 3-unit margin.
const PATHS: Record<ShapeId, string> = {
  circle: `<circle cx="20" cy="20" r="16"/>`,
  square: `<rect x="5" y="5" width="30" height="30" rx="2"/>`,
  triangle: `<path d="M20 4.5 L36.5 34.5 H3.5 Z"/>`,
  rectangle: `<rect x="2.5" y="10" width="35" height="20" rx="2"/>`,
  star: `<path d="M20 3.5 L24.6 14.6 L36.5 15.5 L27.4 23.2 L30.3 34.8 L20 28.5 L9.7 34.8 L12.6 23.2 L3.5 15.5 L15.4 14.6 Z"/>`,
  heart: `<path d="M20 35 C9 27 3.5 21 3.5 13.5 C3.5 8.5 7.5 5 12 5 C15.5 5 18.5 7 20 10 C21.5 7 24.5 5 28 5 C32.5 5 36.5 8.5 36.5 13.5 C36.5 21 31 27 20 35 Z"/>`,
  diamond: `<path d="M20 3 L35 20 L20 37 L5 20 Z"/>`,
  oval: `<ellipse cx="20" cy="20" rx="17" ry="11.5"/>`,
  pentagon: `<path d="M20 3.5 L36.5 15.5 L30.2 35 H9.8 L3.5 15.5 Z"/>`,
  hexagon: `<path d="M11.5 5.3 H28.5 L37 20 L28.5 34.7 H11.5 L3 20 Z"/>`,
  crescent: `<path d="M26 4.5 A16 16 0 1 0 35.5 27 A12.5 12.5 0 1 1 26 4.5 Z"/>`,
  arrow: `<path d="M3.5 15 H22 V7 L36.5 20 L22 33 V25 H3.5 Z"/>`,
};

export function shapeSvg(shape: ShapeId, size: number, fill = SHAPE_FILL[shape]): string {
  return `<svg width="${size}mm" height="${size}mm" viewBox="0 0 40 40" aria-hidden="true"><g fill="${fill}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round">${PATHS[shape]}</g></svg>`;
}

/** A balloon in a colour, or uncoloured (white) for the child to colour in. */
export function balloonSvg(colour: ColourId | null, size: number): string {
  const fill = colour ? COLOURS[colour].hex : "#fff";
  return `<svg width="${size}mm" height="${size}mm" viewBox="0 0 40 40" aria-hidden="true">
    <path d="M20 30 Q17 34 21 36.5 Q24 38.5 20 40" fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M20 2.5 C29 2.5 33.5 9.5 33.5 15.5 C33.5 23 27 29 20 30.5 C13 29 6.5 23 6.5 15.5 C6.5 9.5 11 2.5 20 2.5 Z" fill="${fill}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M18 30.3 L20 33 L22 30.3 Z" fill="${fill}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
    ${colour ? `<path d="M13 9.5 Q14.5 6.5 18 6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.75"/>` : ""}
  </svg>`;
}

/** Scissors for the cut lines of the sticker sheets. */
export function scissorsSvg(size: number): string {
  return `<svg width="${size}mm" height="${size}mm" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.2 8.2 L20 18 M8.2 15.8 L20 6"/></g></svg>`;
}
