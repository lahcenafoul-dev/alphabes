import { getAllLetterSlugs, getLetterContent } from "@/lib/letters-data";
import PrintButton from "@/components/PrintButton";
import { notFound } from "next/navigation";

type Props = { params: { letter: string } };

export function generateStaticParams() {
  return getAllLetterSlugs().map((letter) => ({ letter }));
}

export default function WorksheetPage({ params }: Props) {
  const content = getLetterContent(params.letter);
  if (!content) return notFound();

  return (
    <div className="min-h-screen bg-white px-6 py-10 print:p-0">
      <div className="mx-auto max-w-2xl">
        <PrintButton />

        <div className="mt-6 rounded-2xl border-4 border-dashed border-blue-300 bg-blue-50 p-8 text-center print:border-black print:bg-white">
          <h1 className="text-2xl font-bold text-blue-900">
            Letter {content.uppercase}{content.lowercase} Tracing &amp; Coloring
          </h1>
          <p className="mt-1 text-blue-700">AlphaBes Printable Worksheet</p>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-blue-900">Trace the Letters</h2>
          <div className="mt-4 flex justify-center gap-10">
            <span
              style={{
                fontSize: "9rem",
                fontWeight: 900,
                color: "transparent",
                WebkitTextStroke: "2px #93c5fd",
              }}
            >
              {content.uppercase}
            </span>
            <span
              style={{
                fontSize: "9rem",
                fontWeight: 900,
                color: "transparent",
                WebkitTextStroke: "2px #93c5fd",
              }}
            >
              {content.lowercase}
            </span>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-blue-900">Color the Picture</h2>
          <div className="mt-4 flex justify-center">
            <div
              style={{
                fontSize: "8rem",
                filter: "grayscale(100%) contrast(0%) brightness(1.4)",
              }}
            >
              {content.exampleWords[0]
                ? "🖍️"
                : "🖍️"}
            </div>
          </div>
          <p className="mt-2 text-center text-gray-600">
            {content.exampleWords[0]?.word ?? content.uppercase}
          </p>
        </section>

        <footer className="mt-12 text-center text-xs text-gray-400 print:mt-6">
          © AlphaBes — alphabes.netlify.app
        </footer>
      </div>
    </div>
  );
}