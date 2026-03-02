import Link from "next/link";

export const metadata = {
  title: "Как конвертировать PDF в JPG: быстрый способ",
  description:
    "Практическая инструкция по конвертации PDF в JPG/PNG с выбором качества изображения и сохранением читаемости текста.",
  alternates: { canonical: "/blog/kak-konvertirovat-pdf-v-jpg" },
  openGraph: {
    type: "article",
    url: "https://pdfx.tools/blog/kak-konvertirovat-pdf-v-jpg",
    title: "Как конвертировать PDF в JPG: быстрый способ",
    description: "Инструкция по конвертации PDF в JPG/PNG с настройкой качества.",
    images: ["/opengraph-image"],
    publishedTime: "2026-03-02T09:00:00.000Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "Как конвертировать PDF в JPG",
    description: "Как выбрать JPG или PNG и сохранить читаемость изображений.",
    images: ["/opengraph-image"],
  },
};

export default function PdfToJpgGuidePage() {
  return (
    <article className="max-w-[820px] mx-auto px-4 py-10">
      <p className="text-xs text-[#666] mb-3">02.03.2026</p>
      <h1 className="text-3xl md:text-4xl font-black mb-6">Как конвертировать PDF в JPG</h1>

      <div className="space-y-5 text-sm md:text-base leading-7 text-[#bbb]">
        <p>
          Конвертация PDF в JPG нужна, когда отдельные страницы надо вставить в презентацию, отправить в мессенджер
          или быстро показать как изображения. Ниже схема, которая помогает получить аккуратный результат без «мыла».
        </p>

        <h2 className="text-2xl font-bold mt-8">1. Определитесь с целью</h2>
        <p>
          Для экрана и переписки обычно достаточно JPG среднего качества. Для детальных схем, чеков или документов с
          мелким текстом лучше выбрать PNG либо увеличить масштаб рендера перед экспортом.
        </p>

        <h2 className="text-2xl font-bold mt-8">2. Загрузите PDF и выберите формат</h2>
        <p>
          В инструменте PDF X откройте PDF, затем выберите формат вывода: JPG (меньше вес) или PNG (лучше четкость).
          Если нужно, укажите масштаб рендера, чтобы текст на изображениях остался читаемым.
        </p>

        <h2 className="text-2xl font-bold mt-8">3. Проверьте размер и качество</h2>
        <p>
          После конвертации сравните: хорошо ли читаются мелкие элементы, не слишком ли тяжелые получились картинки.
          Для публикации в сети часто нужен баланс: меньше размер, но без потери важной информации.
        </p>

        <h2 className="text-2xl font-bold mt-8">Когда выбирать JPG, а когда PNG</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>JPG: фото, сканы, быстрый обмен, минимальный размер.</li>
          <li>PNG: таблицы, интерфейсы, схемы, контент с четкими границами.</li>
          <li>Для архива лучше хранить исходный PDF и экспорт использовать как рабочую копию.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">Типичные ошибки</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Слишком низкое качество JPG, из-за чего текст становится нечитаемым.</li>
          <li>Слишком высокий масштаб для десятков страниц, что делает архив слишком тяжелым.</li>
          <li>Конвертация без проверки итоговых изображений перед отправкой.</li>
        </ul>
      </div>

      <div className="mt-10 rounded-xl border border-[#2b250f] bg-[rgba(255,220,80,0.08)] p-5">
        <p className="text-sm text-[#d9c372] mb-3">Нужно конвертировать PDF в картинки?</p>
        <Link
          href="/pdf-to-image"
          className="inline-flex bg-[#ffdc50] text-[#070809] font-black px-4 py-2 rounded-lg hover:brightness-110 transition-all"
        >
          Конвертировать PDF в JPG/PNG →
        </Link>
      </div>
    </article>
  );
}
