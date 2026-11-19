import Link from "next/link";
import { faqJsonLd, type Block, type Inline } from "@/lib/guide-blocks";

// The SEO phase 4 text blocks (lib/guide-blocks.ts). Links are full paths,
// already localized, so plain next/link is enough.
export default function GuideBlocks({ blocks, className = "mt-8 space-y-6 print:hidden" }: { blocks: Block[]; className?: string }) {
  if (!blocks.length) return null;
  const faq = faqJsonLd(blocks);
  return (
    <div className={className}>
      {blocks.map((b) => (
        <section key={b.id} aria-labelledby={`guide-${b.id}`}>
          <h2 id={`guide-${b.id}`} className="font-display font-bold text-lg">
            {b.heading}
          </h2>
          {b.paragraphs?.map((p, i) => (
            <p key={i} className="mt-2 text-chalkboard/80">
              {p.map((part, j) => <GuideInline key={j} part={part} />)}
            </p>
          ))}
          {b.list && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-chalkboard/80">
              {b.list.map((item, i) => (
                <li key={i}>{item.map((part, j) => <GuideInline key={j} part={part} />)}</li>
              ))}
            </ul>
          )}
          {b.faq?.map((f, i) => (
            <div key={i} className="mt-3">
              <h3 className="font-bold">{f.q}</h3>
              <p className="mt-1 text-chalkboard/80">{f.a.map((part, j) => <GuideInline key={j} part={part} />)}</p>
            </div>
          ))}
        </section>
      ))}
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />}
    </div>
  );
}

export function GuideInline({ part }: { part: Inline }) {
  if (typeof part === "string") return <>{part}</>;
  if ("strong" in part) return <strong>{part.strong}</strong>;
  return (
    <Link href={part.href} className="font-bold underline">
      {part.text}
    </Link>
  );
}
