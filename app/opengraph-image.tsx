import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #050509, #181820)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 34, color: "#ff4d6d", fontWeight: 900 }}>
          REAL WEATHER. BAD ATTITUDE.
        </div>

        <div style={{ fontSize: 110, fontWeight: 900, marginTop: 20 }}>
          GRIMCAST
        </div>

        <div style={{ fontSize: 42, color: "#ddd", marginTop: 20 }}>
          Weather forecasts with zero sugar coating.
        </div>
      </div>
    ),
    size
  );
}