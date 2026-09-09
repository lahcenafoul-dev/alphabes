import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";
import { ICONS, drawFallbackIcon } from "../icons";
import type { WorksheetRecord } from "../../worksheets-data";

export function drawLetterPictureMatching(doc: jsPDF, w: WorksheetRecord): void {
  const { uppercase: U, lowercase: L, letter } = w;
  const pageWidth = doc.internal.pageSize.getWidth();

  drawWorksheetHeader(doc, "Letter & Picture Matching");
  drawWorksheetTitle(doc, `Match Letter ${U}${L}`, "Draw a line to the matching picture");

  const words = w.exampleWords.slice(0, 3);
  const leftX = PAGE_MARGIN + 20;
  const rightX = pageWidth - PAGE_MARGIN - 25;
  const startY = 80;
  const gap = 45;

  // two letter targets on the left, staggered
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.text(U, leftX, startY, { renderingMode: "stroke" });
  doc.text(L, leftX, startY + gap, { renderingMode: "stroke" });

  words.slice(0, 2).forEach((ex, i) => {
    const y = startY + i * gap;
    const draw = ICONS[ex.word.toLowerCase()];
    if (draw) {
      draw(doc, rightX, y - 6, 28);
    } else {
      drawFallbackIcon(doc, rightX, y - 6, 16, letter);
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(ex.word, rightX, y + 16, { align: "center" });
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("(draw a line from each letter to its picture)", pageWidth / 2, startY + 2 * gap - 10, { align: "center" });

  drawWorksheetFooter(doc, w.instructions);
}
