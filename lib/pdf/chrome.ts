// Shared page chrome for every worksheet PDF template, factored out of the
// original hand-coded header/footer drawing that used to live inline in
// components/WorksheetClient.tsx. Every template in lib/pdf/templates/ uses
// these so all 260+ worksheets look like one consistent, professional set.

import type { jsPDF } from "jspdf";

export const PAGE_MARGIN = 15;

/** Blue header bar with the site name and a right-aligned subtitle (the worksheet type). */
export function drawWorksheetHeader(doc: jsPDF, subtitle: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("Alphabes.com", PAGE_MARGIN, 14);
  doc.setFontSize(11);
  doc.text(subtitle, pageWidth - PAGE_MARGIN, 14, { align: "right" });
}

/** Centered big title with an optional smaller subtitle line beneath it. */
export function drawWorksheetTitle(doc: jsPDF, title: string, subtitle?: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text(title, pageWidth / 2, 38, { align: "center" });

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(90, 90, 90);
    doc.text(subtitle, pageWidth / 2, 47, { align: "center" });
  }
}

/** Instruction sentence near the bottom of the page plus the site's small branding mark. */
export function drawWorksheetFooter(doc: jsPDF, instructionText?: string, instructionY?: number): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  if (instructionText) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    const wrapped = doc.splitTextToSize(instructionText, pageWidth - PAGE_MARGIN * 2);
    doc.text(wrapped, PAGE_MARGIN, instructionY ?? pageHeight - 27);
  }

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("alphabes.com", pageWidth - PAGE_MARGIN, pageHeight - 12, { align: "right" });
}
