// Every word picture key, with its flat SVG drawing. The site no longer shows
// these drawings (components/WordIllustration.tsx shows the cartoon WebP or a
// letter tile); the tests use them as the list of known picture keys.
import { critters } from "./critters";
import { food } from "./food";
import { mammals } from "./mammals";
import { nature } from "./nature";
import { objects } from "./objects";
import type { Drawing } from "./parts";
import { people } from "./people";
import { places } from "./places";
import { play } from "./play";
import { vehicles } from "./vehicles";

export const ILLUSTRATIONS: Record<string, Drawing> = {
  ...mammals,
  ...critters,
  ...food,
  ...nature,
  ...vehicles,
  ...objects,
  ...play,
  ...people,
  ...places,
};

export function hasIllustration(key: string) {
  return key in ILLUSTRATIONS;
}
