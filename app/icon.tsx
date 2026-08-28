import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "#0d1b2e",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 1.5,
          paddingBottom: 5,
        }}
      >
        {[6, 3, 6, 3, 8, 3, 6, 3].map((h, i) => (
          <div
            key={i}
            style={{ width: 1.6, height: h, background: "#c2410c" }}
          />
        ))}
      </div>
    ),
    { ...size }
  );
}
