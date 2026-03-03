import Link from "next/link";

const posts = [
  {
    slug: "kak-szhat-pdf",
    title: "Как сжать PDF без потери качества: 3 рабочих способа",
    excerpt:
      "Пошаговый разбор трех подходов к сжатию PDF: онлайн в браузере, оптимизация исходников и корректный экспорт.",
    date: "2026-03-02",
  },
  {
    slug: "kak-obedinit-pdf",
    title: "Как объединить PDF файлы в один документ",
    excerpt:
      "Практический алгоритм для склейки PDF без потери порядка страниц и с проверкой итогового файла перед отправкой.",
    date: "2026-03-02",
  },
  {
    slug: "kak-konvertirovat-pdf-v-jpg",
    title: "Как конвертировать PDF в JPG: быстрый способ",
    excerpt: "Как выбрать между JPG и PNG, настроить качество и получить читаемые изображения без лишнего веса.",
    date: "2026-03-02",
  },
];

export const metadata = {
  title: "Блог PDF X",
  description: "Гайды по работе с PDF: сжатие, объединение, конвертация, OCR и подпись документов.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "https://pdfx.tools/blog",
    title: "Блог PDF X",
    description: "Полезные инструкции по работе с PDF и SEO-статьи для пользователей PDF X.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог PDF X",
    description: "Гайды по сжатию, объединению и конвертации PDF.",
    images: ["/opengraph-image"],
  },
};

export default function BlogPage() {
  return (
    <div className="max-w-[940px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-[#1d3150] mb-6">Блог PDF X</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.slug} className="border border-[#d5dfed] rounded-xl p-5 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] shadow-[0_10px_26px_rgba(76,107,153,0.12)]">
            <p className="text-xs text-[#6d819c] mb-2">{post.date}</p>
            <h2 className="text-xl font-bold text-[#213650] mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-[#b56d00] transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-[#5f738e]">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
