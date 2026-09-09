import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";
import { ICONS, drawFallbackIcon } from "../icons";
import type { WorksheetRecord } from "../../worksheets-data";
import { getAllLetterSlugs, getLetterContent } from "../../letters-data";

export function drawBeginningSounds(doc: jsPDF, w: WorksheetRecord): void {
  const { uppercase: U, lowercase: L, letter } = w;
  const pageWidth = doc.internal.pageSize.getWidth();

  drawWorksheetHeader(doc, "Beginning Sounds");
  drawWorksheetTitle(doc, `Beginning Sound: ${U}${L}`, `Circle pictures that start with ${U}`);

  // 2 real matches + 2 distractors from a different letter, shuffled
  const letters = getAllLetterSlugs();
  const otherLetter = letters[(letters.indexOf(letter) + 5) % letters.length];
  const otherWords = getLetterContent(otherLetter)?.exampleWords.slice(0, 2) ?? [];
  const items = [...w.exampleWords.slice(0, 2), ...otherWords].map((ex, i) => ({ ...ex, isMatch: i < 2 }));

  const cols = 2;
  const cellW = (pageWidth - PAGE_MARGIN * 2) / cols;
  items.forEach((item, i) => {
    const cx = PAGE_MARGIN + cellW * (i % cols) + cellW / 2;
    const cy = 85 + Math.floor(i / cols) * 65;
    const draw = ICONS[item.word.toLowerCase()];
    if (draw) draw(doc, cx, cy, 32);
    else drawFallbackIcon(doc, cx, cy, 18, item.word);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text(item.word, cx, cy + 28, { align: "center" });
  });

  drawWorksheetFooter(doc, w.instructions);
}
