import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";
import type { WorksheetRecord } from "../../worksheets-data";

const NEARBY = "abcdefghijklmnopqrstuvwxyz";

function distractorsFor(target: string, count: number): string[] {
  const idx = NEARBY.indexOf(target);
  const pool = NEARBY.split("").filter((c) => c !== target);
  pool.sort((a, b) => Math.abs(NEARBY.indexOf(a) - idx) - Math.abs(NEARBY.indexOf(b) - idx));
  return pool.slice(0, count);
}

export function drawLowercasePractice(doc: jsPDF, w: WorksheetRecord): void {
  const lower = w.lowercase;
  const pageWidth = doc.internal.pageSize.getWidth();

  drawWorksheetHeader(doc, "Lowercase Letter Practice");
  drawWorksheetTitle(doc, `Lowercase Letter ${lower}`, w.primaryWord);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(90);
  doc.setDrawColor(63, 163, 92);
  doc.setLineWidth(0.7);
  doc.text(lower, pageWidth / 2, 90, { align: "center", renderingMode: "stroke" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(`Find and circle every ${lower}:`, PAGE_MARGIN, 115);

  const distractors = distractorsFor(lower, 17);
  const row = [...distractors.slice(0, 6), lower, ...distractors.slice(6, 12), lower, ...distractors.slice(12, 17), lower];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.4);
  const cols = 10;
  row.slice(0, 30).forEach((ch, i) => {
    const x = PAGE_MARGIN + 8 + (i % cols) * 17;
    const y = 128 + Math.floor(i / cols) * 14;
    doc.text(ch, x, y, { renderingMode: "stroke" });
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Trace the letter ${lower}:`, PAGE_MARGIN, 178);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  for (let i = 0; i < 6; i++) {
    doc.text(lower, PAGE_MARGIN + 12 + i * 28, 198, { renderingMode: "stroke" });
  }
  doc.setDrawColor(150, 150, 150);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(PAGE_MARGIN, 201, pageWidth - PAGE_MARGIN, 201);
  doc.setLineDashPattern([], 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Now write it yourself:`, PAGE_MARGIN, 218);
  doc.setDrawColor(150, 150, 150);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(PAGE_MARGIN, 236, pageWidth - PAGE_MARGIN, 236);
  doc.setLineDashPattern([], 0);

  drawWorksheetFooter(doc, w.instructions);
}
