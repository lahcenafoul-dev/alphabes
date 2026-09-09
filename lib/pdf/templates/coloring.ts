import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";
import { ICONS, drawFallbackIcon } from "../icons";
import type { WorksheetRecord } from "../../worksheets-data";

export function drawLetterColoring(doc: jsPDF, w: WorksheetRecord): void {
  const { uppercase: U, lowercase: L, primaryWord, letter } = w;
  const pageWidth = doc.internal.pageSize.getWidth();

  drawWorksheetHeader(doc, "Letter Coloring");
  drawWorksheetTitle(doc, `Color the Letter ${U}${L}`, `${primaryWord} starts with ${U}`);

  // Big outline letter pair, left of center
  doc.setFont("helvetica", "bold");
  doc.setFontSize(85);
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.6);
  doc.text(`${U}${L}`, pageWidth * 0.32, 135, { align: "center", renderingMode: "stroke" });

  // Outline illustration of the word, right of center
  const draw = ICONS[primaryWord.toLowerCase()];
  if (draw) {
    draw(doc, pageWidth * 0.7, 130, 70);
  } else {
    drawFallbackIcon(doc, pageWidth * 0.7, 130, 40, letter);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  doc.text(primaryWord, pageWidth * 0.7, 175, { align: "center" });

  drawWorksheetFooter(doc, w.instructions, 230);
}
