"use client";

import ListenButton from "@/components/ListenButton";
import { drawTracingWorksheet, type TracingLabels } from "@/lib/pdf/templates/tracing";

// French labels for the tracing PDF. Helvetica covers é, è, ê, ç (WinAnsi).
const LABELS: TracingLabels = {
  header: "Fiche de tracé",
  title: (upper, lower) => `La lettre ${upper} ${lower}`,
  footer: (word, upper, lower) => `${word} commence par la lettre ${upper} ${lower}. Trace les lettres en suivant les pointillés.`,
};

// Listen + download buttons of /fr/alphabet/[letter]/fiche.
export default function FicheActions({
  letter,
  slug,
  word,
  spoken,
}: {
  letter: string;
  slug: string;
  word: string;
  spoken: string;
}) {
  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    drawTracingWorksheet(doc, { letter, word }, LABELS);
    doc.save(`fiche-lettre-${slug}.pdf`);
  };

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      <ListenButton text={spoken} className="rounded-block bg-crayon-blue text-white px-6 py-3 font-bold">
        🔊 Écouter
      </ListenButton>
      <button type="button" onClick={downloadPDF} className="rounded-block bg-crayon-green text-white px-6 py-3 font-bold">
        ⬇️ Télécharger la fiche (PDF)
      </button>
    </div>
  );
}
