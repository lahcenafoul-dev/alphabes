import { ImageResponse } from "next/og";

// The site icon: the home page owl (components/home/Owl.tsx) as a face on the
// owl purple. Two drawings: one on a 16-pixel grid for the 16 px favicon, with
// only big shapes (eyes, pupils, tufts, beak), and a fuller one from 32 px up.
export const OWL_PURPLE = "#6A4CFF";
const PURPLE_DARK = "#4428C9";
const LILAC = "#B8A9FF";
const INK = "#1D1846";
const BEAK = "#FFC94D";

/** `rounded`: rounded corners for tabs; off where the system rounds (iOS, Android). */
export function owlIconSvg(size: number, { rounded = true } = {}): string {
  if (size < 24) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16">
<rect width="16" height="16" rx="${rounded ? 3.5 : 0}" fill="${OWL_PURPLE}"/>
<path d="M2 1h2l2 3h-2zM14 1h-2l-2 3h2z" fill="${PURPLE_DARK}"/>
<circle cx="4.9" cy="7.8" r="3.6" fill="#FFFFFF"/>
<circle cx="11.1" cy="7.8" r="3.6" fill="#FFFFFF"/>
<circle cx="5.3" cy="8.1" r="1.8" fill="${INK}"/>
<circle cx="10.7" cy="8.1" r="1.8" fill="${INK}"/>
<path d="M6 11h4l-2 3z" fill="${BEAK}"/>
</svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
<defs><clipPath id="c"><rect width="64" height="64" rx="${rounded ? 14 : 0}"/></clipPath></defs>
<g clip-path="url(#c)">
<rect width="64" height="64" fill="${OWL_PURPLE}"/>
<ellipse cx="32" cy="66" rx="21" ry="14" fill="${LILAC}"/>
<path d="M10 8l10 10M54 8L44 18" stroke="${PURPLE_DARK}" stroke-width="7" stroke-linecap="round"/>
<circle cx="20" cy="31" r="14" fill="${PURPLE_DARK}"/>
<circle cx="44" cy="31" r="14" fill="${PURPLE_DARK}"/>
<circle cx="20" cy="31" r="11" fill="#FFFFFF"/>
<circle cx="44" cy="31" r="11" fill="#FFFFFF"/>
<circle cx="21.5" cy="32" r="5.5" fill="${INK}"/>
<circle cx="42.5" cy="32" r="5.5" fill="${INK}"/>
<circle cx="23.5" cy="29.5" r="2" fill="#FFFFFF"/>
<circle cx="44.5" cy="29.5" r="2" fill="#FFFFFF"/>
<path d="M27 42h10l-5 8z" fill="${BEAK}"/>
</g>
</svg>`;
}

/** The icon as a PNG response (app/icon.tsx, app/apple-icon.tsx). */
export function owlIconResponse(size: number, opts?: { rounded?: boolean }) {
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(owlIconSvg(size, opts))}`;
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img src={src} width={size} height={size} />
    ),
    { width: size, height: size },
  );
}
