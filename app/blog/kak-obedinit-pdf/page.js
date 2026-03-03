import Link from "next/link";

export const metadata = {
  title: "Как объединить PDF файлы в один документ",
  description:
    "Пошаговый гайд по объединению нескольких PDF в правильном порядке, с проверкой структуры и финальной оптимизацией размера.",
  alternates: { canonical: "/blog/kak-obedinit-pdf" },
  openGraph: {
    type: "article",
    url: "https://pdfx.tools/blog/kak-obedinit-pdf",
    title: "Как объединить PDF файлы в один документ",
    description: "Практический алгоритм склейки PDF без потери порядка страниц.",
    images: ["/opengraph-image"],
    publishedTime: "2026-03-02T09:00:00.000Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "Как объединить PDF файлы в один документ",
    description: "Пошаговый гайд по объединению PDF.",
    images: ["/opengraph-image"],
  },
};

export default function MergeGuidePage() {
  return (
    <article className="max-w-[820px] mx-auto px-4 py-10">
      <p className="text-xs text-[#6d819c] mb-3">02.03.2026</p>
      <h1 className="text-3xl md:text-4xl font-black text-[#1d3150] mb-6">Как объединить PDF файлы в один документ</h1>

      <div className="space-y-5 text-sm md:text-base leading-7 text-[#4f637f]">
        <p>
          Когда документы приходят частями, их неудобно хранить, отправлять и согласовывать. Один файл проще передать
          клиенту, загрузить в CRM или архив. Ниже практический алгоритм, который помогает склеить PDF без потери
          читаемости и без хаоса в порядке страниц.
        </p>

        <h2 className="text-2xl font-bold mt-8">1. Подготовьте файлы перед склейкой</h2>
        <p>
          Сначала соберите все PDF в одну папку и дайте им понятные имена. Если файлы называются случайно, легко
          перепутать порядок, особенно когда документов много.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Переименуйте файлы по порядку: 01, 02, 03...</li>
          <li>Проверьте, что внутри нет лишних пустых страниц.</li>
          <li>Убедитесь, что ориентация страниц согласована (портрет/альбом).</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">2. Загрузите документы в инструмент объединения</h2>
        <p>
          В PDF X можно перетащить сразу несколько файлов. После загрузки проверьте последовательность карточек и
          при необходимости поменяйте порядок. Итоговый документ будет собран именно в этом порядке.
        </p>

        <h2 className="text-2xl font-bold mt-8">3. Проверьте результат перед отправкой</h2>
        <p>
          После объединения откройте итоговый файл и быстро пройдитесь по критичным местам: титульная страница,
          оглавление, подписи, таблицы. Это занимает 1–2 минуты и помогает избежать ошибок в деловой переписке.
        </p>

        <h2 className="text-2xl font-bold mt-8">Частые ошибки при объединении</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Склеивание файлов в неверном порядке.</li>
          <li>Повторяющиеся страницы из-за дублей исходников.</li>
          <li>Слишком большой итоговый файл без последующего сжатия.</li>
        </ul>

        <p>
          Если итоговый PDF получился тяжелым, сразу после объединения примените сжатие. Это особенно полезно для
          документов со сканами и фото.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-[#f2d6a6] bg-[rgba(255,228,175,0.34)] p-5">
        <p className="text-sm text-[#7a5a1f] mb-3">Готово к объединению?</p>
        <Link
          href="/merge-pdf"
          className="inline-flex bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] text-[#2d1d00] font-black px-4 py-2 rounded-lg hover:brightness-105 transition-all"
        >
          Объединить PDF прямо сейчас →
        </Link>
      </div>
    </article>
  );
}
