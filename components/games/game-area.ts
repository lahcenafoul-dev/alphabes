// The free games render only in the browser (ClientOnly), so the server HTML
// has a one-line "Loading" placeholder and the game pushed everything below
// it down when it appeared (CLS 0.2–0.3, docs/seo-audit.md I10). Their box
// keeps at least the game's smallest height, measured on production at 360,
// 412, 640, 768 and 1280 px (padding included); the round is random, so the
// game is often a little taller, never shorter.
const FIND_THE_LETTER = "min-h-[540px] sm:min-h-[496px]";
const MATCH_LETTER_PICTURE = "min-h-[440px] sm:min-h-[266px]";
const CLAP_THE_SYLLABLES = "min-h-[480px] sm:min-h-[500px]";

const MIN_HEIGHT: Record<string, string> = {
  "find-the-letter": FIND_THE_LETTER,
  "trouve-la-lettre": FIND_THE_LETTER,
  "encuentra-la-letra": FIND_THE_LETTER,
  "encontre-a-letra": FIND_THE_LETTER,
  "match-letter-picture": MATCH_LETTER_PICTURE,
  "lettre-et-image": MATCH_LETTER_PICTURE,
  "letra-y-dibujo": MATCH_LETTER_PICTURE,
  "letra-e-figura": MATCH_LETTER_PICTURE,
  "aplaude-las-silabas": CLAP_THE_SYLLABLES,
  "bata-palmas": CLAP_THE_SYLLABLES,
};

/** Tailwind min-height classes for a free game's box, by its slug in any language. */
export function gameAreaMinHeight(slug: string): string {
  return MIN_HEIGHT[slug] ?? "";
}
