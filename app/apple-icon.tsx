import { ImageResponse } from "next/og";

// The home-screen icon on iPhones and iPads: app/icon.tsx at 180 px.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#D9A86C",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#FFFDF7", fontSize: 112, fontWeight: 800 }}>A</div>
      </div>
    ),
    { ...size }
  );
}
