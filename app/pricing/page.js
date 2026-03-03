import Link from "next/link";
import SubscribeButton from "@/components/SubscribeButton";

export const metadata = {
  title: "Тарифы PDF X PRO",
  description:
    "Сравнение FREE и PRO в PDF X: безлимитные операции, OCR, подпись и нумерация страниц в подписке PRO.",
  keywords: ["pdf pro", "pdf подписка", "тарифы pdf", "ocr pdf", "подписать pdf"],
  alternates: { canonical: "/pricing" },
  openGraph: {
    type: "website",
    url: "https://pdfx.tools/pricing",
    title: "Тарифы PDF X PRO",
    description: "FREE и PRO тарифы для онлайн-инструментов PDF X.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Тарифы PDF X PRO",
    description: "Безлимитные PDF-инструменты, OCR и подпись в подписке PRO.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

function CheckoutStatus({ checkout }) {
  if (checkout === "success") {
    return (
      <div className="mb-6 rounded-xl border border-[#2f5d3f] bg-[rgba(56,161,105,0.12)] px-4 py-3 text-sm text-[#b6e7c7]">
        Оплата прошла успешно. Подписка активируется в течение нескольких секунд после webhook.
      </div>
    );
  }

  if (checkout === "cancel") {
    return (
      <div className="mb-6 rounded-xl border border-[#5b4a1f] bg-[rgba(245,158,11,0.12)] px-4 py-3 text-sm text-[#f7d590]">
        Оплата отменена. Вы можете вернуться к оформлению подписки в любое время.
      </div>
    );
  }

  return null;
}

export default async function PricingPage({ searchParams }) {
  const params = (await searchParams) || {};
  const checkoutRaw = params.checkout;
  const checkout = Array.isArray(checkoutRaw) ? checkoutRaw[0] : checkoutRaw;

  return (
    <div className="mx-auto max-w-[980px] px-4 py-10 sm:px-5 sm:py-12">
      <div className="mb-8 text-center sm:mb-10">
        <h1 className="text-3xl font-black tracking-tight text-[#f6f1e6] sm:text-4xl md:text-5xl">
          Тарифы <span className="text-[#ffcf48]">PDF X</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#9ea8b9] sm:text-base">
          Базовые инструменты доступны бесплатно. PRO открывает безлимит и расширенные функции.
        </p>
      </div>

      <CheckoutStatus checkout={checkout} />

      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <section className="rounded-2xl border border-[#2a3448] bg-[linear-gradient(180deg,#0c1119,#0a0d13)] p-5 sm:p-6">
          <p className="text-xs font-mono uppercase tracking-[0.12em] text-[#8d98ac]">FREE</p>
          <p className="mt-2 text-3xl font-black text-[#f6f1e6]">$0</p>
          <p className="mt-1 text-sm text-[#98a3b6]">Для базовой ежедневной работы</p>

          <ul className="mt-5 space-y-2.5 text-sm text-[#b0b9c8]">
            <li>5 операций в день</li>
            <li>Базовые инструменты конвертации и редактирования</li>
            <li>Локальная обработка в браузере</li>
            <li className="text-[#7f8898]">Без OCR, подписи и нумерации PRO</li>
          </ul>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-[#f7cc53] bg-[linear-gradient(180deg,#121117,#0d0d11)] p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ffcf48] via-[#ff9d3f] to-[#5bc3ff]" />
          <div className="inline-flex rounded-full bg-gradient-to-r from-[#ffcf48] to-[#ff9d3f] px-3 py-1 text-[11px] font-black text-[#07080b]">
            PRO
          </div>

          <p className="mt-3 text-3xl font-black text-[#fff0c6]">
            $2.99<span className="ml-1 text-sm font-medium text-[#d7be7a]">/мес</span>
          </p>
          <p className="mt-1 text-sm text-[#d6c89f]">Для интенсивной работы и продвинутых задач</p>

          <ul className="mt-5 space-y-2.5 text-sm text-[#efe4c3]">
            <li>Безлимитные операции</li>
            <li>OCR распознавание текста</li>
            <li>Подпись PDF и нумерация страниц</li>
            <li>Приоритетные обновления PRO-функций</li>
          </ul>

          <SubscribeButton />
        </section>
      </div>

      <div className="mt-7 rounded-xl border border-[#273247] bg-[rgba(12,16,24,0.7)] px-4 py-3 text-sm text-[#9ba7bb]">
        После оплаты Stripe перенаправит вас обратно на эту страницу. Активация PRO происходит серверно через webhook.
      </div>

      <div className="mt-5 text-center text-xs text-[#7f8a9d]">
        Продолжая, вы принимаете{" "}
        <Link href="/terms" className="text-[#c0cad9] hover:text-[#f2ebda]">
          условия использования
        </Link>{" "}
        и{" "}
        <Link href="/privacy" className="text-[#c0cad9] hover:text-[#f2ebda]">
          политику конфиденциальности
        </Link>
        .
      </div>
    </div>
  );
}
