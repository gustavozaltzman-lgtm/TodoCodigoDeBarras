import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 20 }}>
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
