// Worksheet previews are 476 px wide (scripts/fiches-fr, fichas-es,
// atividades-pt) but cards show them at 96–246 CSS px, so each preview has a
// 320 px copy next to it (npm run previews:thumbs) that cards offer in srcset.
export const THUMB_WIDTH = 320;

/** "/fiches-pdf/apercus/x.jpg" → "/fiches-pdf/apercus/x.320.jpg" */
export function previewThumb(preview: string): string {
  return preview.replace(/\.jpg$/, `.${THUMB_WIDTH}.jpg`);
}
