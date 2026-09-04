"use client";

import { jsPDF } from "jspdf";

type Props = {
  letter: string;
  word: string;
  emoji: string;
};

export default function WorksheetClient({ letter, word, emoji }: Props) {
  const upper = letter.toUpperCase();
  const lower = letter.toLowerCase();

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(
      `${upper}. ${word} starts with ${upper}.`
    );
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // ===== Header bar =====
    doc.setFillColor(59, 130, 246); // crayon-blue
    doc.rect(0, 0, pageWidth, 22, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("Alphabes.com", margin, 14);
    doc.setFontSize(11);
    doc.text("Letter Tracing Worksheet", pageWidth - margin, 14, {
      align: "right",
    });

    // ===== Title =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);
    doc.text(`Letter ${upper}${lower}`, pageWidth / 2, 38, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(90, 90, 90);
    doc.text(word, pageWidth / 2, 47, { align: "center" });

    // ===== Big outline guide letters =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(70);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.6);
    doc.text(upper, 45, 85, { renderingMode: "stroke" });
    doc.text(lower, 115, 85, { renderingMode: "stroke" });

    // ===== Practice rows with dotted guide lines =====
    let startY = 105;
    for (let row = 0; row < 3; row++) {
      const y = startY + row * 28;

      // 4 faint dashed guide letters per row
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      for (let i = 0; i < 4; i++) {
        const x = margin + 10 + i * 22;
        doc.text(upper, x, y, { renderingMode: "stroke" });
        doc.text(lower, x + 11, y, { renderingMode: "stroke" });
      }

      // dashed baseline under each row
      doc.setDrawColor(150, 150, 150);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(margin, y + 3, pageWidth - margin, y + 3);
      doc.setLineDashPattern([], 0);
    }

    // ===== Footer sentence =====
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text(`${word} starts with the letter ${upper}${lower}.`, margin, 210);

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("alphabes.netlify.app", pageWidth - margin, 285, {
      align: "right",
    });

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