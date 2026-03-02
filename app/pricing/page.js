import SubscribeButton from "@/components/SubscribeButton";

export const metadata = {
  title: "PDF X PRO - Безлимитные инструменты для PDF",
  description:
    "Разблокируй все инструменты PDF X: OCR, подпись документов и нумерация страниц. Безлимитные операции и без рекламы.",
  keywords: ["pdf pro", "pdf подписка", "pdf инструменты", "pdf безлимит", "pdf ocr pro"],
  alternates: { canonical: "/pricing" },
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#070809] text-[#e8e3db]">
      <div className="max-w-[940px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            PDF X <span className="text-[#ffdc50]">PRO</span>
          </h1>
          <p className="text-[#888] max-w-lg mx-auto">Полный доступ ко всем инструментам. Безлимитные операции. Без рекламы.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-[#0a0a0b] border border-[#161616] rounded-xl p-6">
            <div className="text-xs font-mono text-[#444] mb-2">FREE</div>
            <div className="text-2xl font-black mb-4">$0</div>
            <ul className="space-y-3 text-sm text-[#888]">
              <li className="flex items-center gap-2">✅ 5 операций в день</li>
              <li className="flex items-center gap-2">✅ Базовые инструменты</li>
              <li className="flex items-center gap-2">✅ Браузерная обработка</li>
              <li className="flex items-center gap-2 text-[#444]">❌ OCR распознавание</li>
              <li className="flex items-center gap-2 text-[#444]">❌ Подпись документов</li>
              <li className="flex items-center gap-2 text-[#444]">❌ Нумерация страниц</li>
              <li className="flex items-center gap-2 text-[#444]">❌ Реклама</li>
            </ul>
          </div>

          <div className="bg-[#0a0a0b] border border-[#ffdc50] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffdc50] via-[#ff8c42] to-[#e879f9]"></div>
            <div className="inline-flex bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] text-xs font-black px-3 py-1 rounded-full mb-2">
              PRO
            </div>
            <div className="text-2xl font-black mb-4">
              $2.99<span className="text-sm text-[#888] font-normal">/мес</span>
            </div>
            <ul className="space-y-3 text-sm text-[#888]">
              <li className="flex items-center gap-2">✅ Безлимитные операции</li>
              <li className="flex items-center gap-2">✅ Все базовые инструменты</li>
              <li className="flex items-center gap-2">✅ OCR - распознавание текста</li>
              <li className="flex items-center gap-2">✅ Подпись документов</li>
              <li className="flex items-center gap-2">✅ Нумерация страниц</li>
              <li className="flex items-center gap-2">✅ Без рекламы</li>
              <li className="flex items-center gap-2">✅ Приоритетная обработка</li>
            </ul>
            <SubscribeButton />
          </div>
        </div>
      </div>
    </div>
  );
}