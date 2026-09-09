"use client";

import { jsPDF } from "jspdf";
import { renderWorksheetPdf } from "@/lib/pdf";
import type { BundleRecord } from "@/lib/worksheet-bundles";
import { worksheets } from "@/lib/worksheets-data";

export default function BundleDownloadButton({ bundle }: { bundle: BundleRecord }) {
  const download = () => {
    const records = bundle.worksheetSlugs
      .map((slug) => worksheets.find((w) => w.slug === slug))
      .filter((w): w is (typeof worksheets)[number] => Boolean(w));

    if (records.length === 0) return;

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    records.forEach((worksheet, i) => {
      if (i > 0) doc.addPage();
      renderWorksheetPdf(doc, worksheet);
    });
    doc.save(`${bundle.slug}.pdf`);
  };

  return (
    <button
      onClick={download}
      className="rounded-block bg-crayon-purple text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
    >
      ⬇️ Download Bundle PDF ({bundle.worksheetSlugs.length} worksheets)
    </button>
  );
}
