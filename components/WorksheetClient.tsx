"use client";

import { jsPDF } from "jspdf";
import { speak } from "@/lib/speech";
import { drawTracingWorksheet } from "@/lib/pdf/templates/tracing";

type Props = {
  letter: string;
  word: string;
};

export default function WorksheetClient({ letter, word }: Props) {
  const upper = letter.toUpperCase();
  const lower = letter.toLowerCase();

  const playSound = () => {
    speak(`${upper}. ${word} starts with ${upper}.`, 0.85);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    drawTracingWorksheet(doc, { letter, word });
    doc.save(`letter-${lower}-worksheet.pdf`);
  };

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      <button
        onClick={playSound}
        className="rounded-block bg-crayon-blue text-white px-6 py-3 font-bold"
      >
        🔊 Listen
      </button>
      <button
        onClick={downloadPDF}
        className="rounded-block bg-crayon-green text-white px-6 py-3 font-bold"
      >
        ⬇️ Download PDF
      </button>
    </div>
  );
}