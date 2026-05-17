import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <img
          src={logoBase64}
          width={64}
          height={64}
          style={{
            filter: "invert(1)",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
