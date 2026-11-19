// The text blocks added by SEO phase 4 (B3, B4, B5): letter worksheet pages,
// letter packs, game pages and sliding puzzles. A block is a heading with
// paragraphs, a list or questions; components/GuideBlocks.tsx renders it.
export type Inline = string | { strong: string } | { href: string; text: string };

export type FaqItem = { q: string; a: Inline[] };

export type Block = {
  id: string;
  heading: string;
  paragraphs?: Inline[][];
  list?: Inline[][];
  faq?: FaqItem[];
};

export const inlineText = (parts: Inline[]): string =>
  parts.map((x) => (typeof x === "string" ? x : "strong" in x ? x.strong : x.text)).join("");

export const blocksText = (blocks: Block[]): string =>
  blocks
    .flatMap((b) => [b.heading, ...(b.paragraphs ?? []).map(inlineText), ...(b.list ?? []).map(inlineText), ...(b.faq ?? []).flatMap((f) => [f.q, inlineText(f.a)])])
    .join("\n");

/** FAQPage JSON-LD for the questions in these blocks, or null when there are none. */
export function faqJsonLd(blocks: Block[]): Record<string, unknown> | null {
  const items = blocks.flatMap((b) => b.faq ?? []);
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: inlineText(f.a) } })),
  };
}

/** "a, b and c" in each language. */
export function listJoin(items: string[], and: string): string {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
}
