// Word pictures: the site's own cartoon picture of the word when there is
// one (public/words/<key>.webp, listed in lib/word-photos.ts, made from
// public/words-src/ by scripts/own-word-pictures.mjs), otherwise a letter
// tile. Never a photo, emoji or another drawing style, so every card reads as
// one set (the retired Pixabay photos are in public/words-old/, not deployed).
//
// The cartoons are 480 x 480 WebP on pure white. They are shown as they are:
// object-contain, no border, radius or shadow, and multiplied onto whatever
// is behind them, so they sit on a white card with no visible edge (and blend
// in if a card is ever slightly tinted). Put them on a white background; never
// wrap them in a gray box or a colored circle.
//
// The letter tile is the same square: the word's first letter, large and
// bold, in a crayon colour dark enough for WCAG AA on white, with no box.
//
// Pictures are keyed by an English concept name (lib/picture-key.ts). The
// keys are checked against the drawings in components/illustrations/, which
// are no longer shown.
import { pictureKey } from "@/lib/picture-key";
import { WORD_PHOTOS } from "@/lib/word-photos";

export { pictureKey };

type Props = {
  /** The word shown to the child; its accessible name and, in English, its key. */
  word: string;
  /** The picture key, when it isn't the English word itself. */
  picture?: string;
  /** Width and height in px; leave out to size with className. */
  size?: number;
  className?: string;
  /** Accessible name, when it should differ from the word. */
  title?: string;
};

// Darker steps of the crayon colours: each is at least 4.9:1 on white.
const TILE_COLORS = ["#D1343A", "#1F6FB8", "#25803F", "#6D3FD9", "#B9520E"];

export default function WordIllustration({ word, picture, size, className, title }: Props) {
  const key = picture ?? pictureKey(word);
  const label = title ?? word.replace(/[[\]|]/g, "");
  if (WORD_PHOTOS.has(key)) {
    return (
      // A plain <img>: next/image's optimizer doesn't run on Cloudflare Workers, and the files are already sized.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/words/${key}.webp`}
        width={size ?? 480}
        height={size ?? 480}
        loading="lazy"
        decoding="async"
        alt={label}
        className={`aspect-square object-contain mix-blend-multiply ${className ?? ""}`}
      />
    );
  }
  // The word's first letter, not the title's ("A round red ball" is the ball).
  const letter = word.replace(/[^\p{L}\p{N}]/gu, "").charAt(0).toUpperCase() || "?";
  const color = TILE_COLORS[letter.charCodeAt(0) % TILE_COLORS.length];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`aspect-square ${className ?? ""}`} role="img" aria-label={label}>
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="72"
        fontWeight="800"
        fontFamily="var(--font-baloo), system-ui, sans-serif"
        fill={color}
      >
        {letter}
      </text>
    </svg>
  );
}
