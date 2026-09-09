import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";
import type { WorksheetRecord } from "../../worksheets-data";

// Letters that are commonly confused with each other -- used as distractors
// so the recognition grid is a genuine discrimination exercise, not just
// random noise.
const LOOKALIKES: Record<string, string[]> = {
  b: ["d", "p", "q"], d: ["b", "p", "q"], p: ["b", "d", "q"], q: ["b", "d", "p"],
  m: ["n", "w"], n: ["m", "u"], u: ["n", "v"], v: ["u", "w", "y"], w: ["v", "m"],
  i: ["l", "j"], l: ["i", "t"], j: ["i", "l"],
  c: ["e", "o"], e: ["c", "o"], o: ["c", "e", "0"],
  f: ["t"], t: ["f", "l"], g: ["q", "y"], y: ["v", "g"],
};

export function drawLetterRecognition(doc: jsPDF, w: WorksheetRecord): void {
  const { uppercase: U, lowercase: L } = w;

  drawWorksheetHeader(doc, "Letter Recognition");
  drawWorksheetTitle(doc, `Letter ${U}${L} Recognition`, `Circle every ${U} and ${L}`);

  const lookalikes = LOOKALIKES[L] ?? ["a", "e", "s"];
  const pool: string[] = [];
  for (let i = 0; i < 36; i++) {
    if (i % 3 === 0) pool.push(Math.random() > 0.5 ? U : L);
    else pool.push(lookalikes[i % lookalikes.length]);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.4);
  const cols = 6;
  pool.forEach((ch, i) => {
    const x = PAGE_MARGIN + 12 + (i % cols) * 28;
    const y = 75 + Math.floor(i / cols) * 24;
    doc.text(ch, x, y, { renderingMode: "stroke" });
  });

  drawWorksheetFooter(doc, w.instructions);
}
