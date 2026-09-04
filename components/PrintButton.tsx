"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mt-6 print:hidden inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white shadow-md hover:bg-blue-700 transition"
    >
      🖨️ Print / Save as PDF
    </button>
  );
}