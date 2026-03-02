import ToolPage from "../components/ToolPage";

export const metadata = {
  title: "PDF X - Бесплатные онлайн-инструменты для PDF",
  description:
    "Сжимай, объединяй, конвертируй PDF бесплатно. Без серверов: файлы обрабатываются локально в браузере.",
  keywords: ["pdf", "сжать pdf", "объединить pdf", "pdf в jpg", "jpg в pdf", "pdf онлайн"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://pdfx.tools",
    title: "PDF X - Бесплатные онлайн-инструменты для PDF",
    description: "12 инструментов для PDF: сжатие, объединение, конвертация, OCR и другое.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF X - Бесплатные онлайн-инструменты для PDF",
    description: "12 инструментов для PDF прямо в браузере.",
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  return (
    <div className="max-w-[1040px] mx-auto px-4 sm:px-5">
      <ToolPage />
    </div>
  );
}