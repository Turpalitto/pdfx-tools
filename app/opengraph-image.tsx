import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #070809 0%, #0b0d10 50%, #101216 100%)",
          color: "#e8e3db",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: 980,
            padding: "48px 56px",
            borderRadius: 32,
            border: "1px solid #1a1a1a",
            background: "linear-gradient(180deg, rgba(255,220,80,0.08), rgba(7,8,9,0.9))",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                background: "#ffdc50",
                color: "#070809",
                fontWeight: 900,
                fontSize: 48,
                lineHeight: 1,
                padding: "10px 18px",
                borderRadius: 14,
              }}
            >
              X
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>
              PDF X
            </div>
          </div>

          <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.1 }}>
            Бесплатные онлайн‑инструменты для PDF
          </div>

          <div style={{ fontSize: 22, color: "#9aa0a6" }}>
            Сжимай · объединяй · конвертируй · в браузере · без серверов
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {[
              "Сжатие",
              "Объединение",
              "Конвертация",
              "OCR",
              "Подпись",
              "Нумерация",
            ].map((label) => (
              <div
                key={label}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid #1f1f1f",
                  background: "#0b0c0e",
                  fontSize: 16,
                  color: "#c9c4bb",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
