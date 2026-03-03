export const metadata = {
  title: "Политика конфиденциальности | PDF X",
  description:
    "Политика конфиденциальности PDF X: обработка файлов происходит локально в браузере пользователя.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "https://pdfx.tools/privacy",
    title: "Политика конфиденциальности | PDF X",
    description: "Как PDF X обрабатывает данные, cookies и файлы пользователей.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Политика конфиденциальности | PDF X",
    description: "Условия обработки данных и приватности в PDF X.",
    images: ["/opengraph-image"],
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[940px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-[#1d3150] mb-6">Политика конфиденциальности</h1>
      <div className="space-y-4 text-sm leading-7 text-[#4f637f]">
        <p>
          PDF X уважает конфиденциальность пользователей. Мы не загружаем файлы на наш сервер для обработки базовых
          операций и не храним содержимое ваших документов.
        </p>
        <p>
          Все операции с PDF (сжатие, объединение, конвертация и т.д.) выполняются локально в браузере. Если функция
          требует внешнего сервиса в будущих версиях, это будет отдельно и явно обозначено в интерфейсе.
        </p>
        <p>
          Мы можем использовать технические cookies и локальное хранилище браузера для работы лимитов free-плана и
          улучшения UX.
        </p>
        <p>
          Для аналитики мы можем использовать Google Analytics и Яндекс.Метрику. Эти инструменты собирают агрегированные
          данные о посещениях и действиях на сайте. Вы можете отключить cookies в настройках браузера.
        </p>
        <p>
          Для монетизации мы можем использовать Google AdSense. Рекламные сети могут применять cookies для показа более
          релевантной рекламы в соответствии с их политиками.
        </p>
        <p>
          По вопросам конфиденциальности: <a className="text-[#2f4668]" href="mailto:contact@pdfx.tools">contact@pdfx.tools</a>.
        </p>
      </div>
    </div>
  );
}
