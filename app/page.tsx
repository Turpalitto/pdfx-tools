import ToolPage from "../components/ToolPage";

export const metadata = {
  title: "PDF X — Бесплатные онлайн-инструменты для PDF",
  description:
    "Сжимай, объединяй, конвертируй PDF бесплатно. Без серверов — все файлы обрабатываются в браузере. 12 инструментов для работы с PDF.",
  keywords: [
    "pdf",
    "pdf сжать",
    "pdf объединить",
    "pdf в jpg",
    "jpg в pdf",
    "pdf онлайн",
    "бесплатно pdf",
  ],
};

export default function Home() {
  return (
    <div className="max-w-[940px] mx-auto px-4">
      <ToolPage />
    </div>
  );
}
