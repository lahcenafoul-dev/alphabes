import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const blocks = [
  { letter: "A", color: "#FF5A5F" },
  { letter: "B", color: "#3EA6FF" },
  { letter: "C", color: "#FFC93C" },
];

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1F2A44",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 24 }}>
          {blocks.map((b) => (
            <div
              key={b.letter}
              style={{
                width: 140,
                height: 140,
                borderRadius: 20,
                backgroundColor: b.color,
                color: "#FFFDF7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
                fontWeight: 800,
                boxShadow: "inset 0 -8px 0 rgba(0,0,0,0.15)",
              }}
            >
              {b.letter}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, fontSize: 64, fontWeight: 800, color: "#FFFDF7" }}>
          AlphaBes
        </div>
        <div style={{ marginTop: 12, fontSize: 30, color: "#FFFDF7", opacity: 0.8 }}>
          Free Alphabet Worksheets &amp; Printable ABC Activities
        </div>
      </div>
    ),
    { ...size }
  );
}
