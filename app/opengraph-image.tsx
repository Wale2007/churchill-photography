import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "Churchill Concept Photography";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logoData = await readFile(
    path.join(process.cwd(), "public", "logo.PNG")
  );
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

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
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2518 50%, #1a1a1a 100%)",
          fontFamily: "serif",
        }}
      >
        {/* Gold decorative line top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent 0%, #d4af37 50%, transparent 100%)",
          }}
        />

        {/* Logo - white on dark background, no invert needed */}
        <img
          src={logoBase64}
          width={120}
          height={120}
          style={{ objectFit: "contain", marginBottom: "24px" }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "12px",
          }}
        >
          Churchill Concept
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 400,
            color: "#d4af37",
            textAlign: "center",
            letterSpacing: "6px",
            textTransform: "uppercase",
          }}
        >
          Photography
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "18px",
            fontWeight: 300,
            color: "#999999",
            textAlign: "center",
            marginTop: "24px",
            maxWidth: "600px",
          }}
        >
          Premium lifestyle, wedding &amp; corporate photography
        </div>

        {/* Gold decorative line bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent 0%, #d4af37 50%, transparent 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
