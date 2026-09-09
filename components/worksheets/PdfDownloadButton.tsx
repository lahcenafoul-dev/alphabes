"use client";

import { jsPDF } from "jspdf";
import { renderWorksheetPdf } from "@/lib/pdf";
import type { WorksheetRecord } from "@/lib/worksheets-data";

export default function PdfDownloadButton({ worksheet }: { worksheet: WorksheetRecord }) {
  const download = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    renderWorksheetPdf(doc, worksheet);
    doc.save(`${worksheet.slug}.pdf`);
  };

  return (
    <button
      onClick={download}
      className="rounded-block bg-crayon-green text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
    >
      ⬇️ Download PDF
    </button>
  );
}
