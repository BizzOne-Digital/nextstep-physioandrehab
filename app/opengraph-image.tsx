import { ImageResponse } from "next/og";

export const alt = "Next Step Physio & Rehab Clinic — Physiotherapy in Brampton";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0A2D50 0%, #0B4F63 55%, #0B7F79 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#29C7BD", display: "flex" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40, fontWeight: 800 }}>Next Step</span>
            <span style={{ fontSize: 20, letterSpacing: 4, opacity: 0.75 }}>PHYSIO & REHAB CLINIC</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Your Next Step</span>
          <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#29C7BD" }}>to Better Health</span>
          <span style={{ fontSize: 30, marginTop: 24, opacity: 0.85 }}>Physiotherapy & rehabilitation in Brampton, Ontario</span>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 24, opacity: 0.85 }}>
          <span>9886 Torbram Rd, Unit 109</span>
          <span>+1 (647) 872-8105</span>
          <span>Direct billing available</span>
        </div>
      </div>
    ),
    size,
  );
}
