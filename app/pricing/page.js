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
      <div className="mb-6 rounded-xl border border-[#8bc6a3] bg-[rgba(102,187,129,0.18)] px-4 py-3 text-sm text-[#2d6642]">
        Оплата прошла успешно. Подписка активируется в течение нескольких секунд после webhook.
      </div>
    );
  }

  if (checkout === "cancel") {
    return (
      <div className="mb-6 rounded-xl border border-[#e6c177] bg-[rgba(255,191,80,0.16)] px-4 py-3 text-sm text-[#7a5213]">
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
        <h1 className="text-3xl font-black tracking-tight text-[#16233c] sm:text-4xl md:text-5xl">
          Тарифы <span className="text-[#ffb648]">PDF X</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#637791] sm:text-base">
          Базовые инструменты доступны бесплатно. PRO открывает безлимит и расширенные функции.
        </p>
      </div>

      <CheckoutStatus checkout={checkout} />

      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <section className="rounded-2xl border border-[#d5dfed] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-5 sm:p-6 shadow-[0_14px_34px_rgba(91,117,157,0.14)]">
          <p className="text-xs font-mono uppercase tracking-[0.12em] text-[#6e819b]">FREE</p>
          <p className="mt-2 text-3xl font-black text-[#16243d]">$0</p>
          <p className="mt-1 text-sm text-[#667991]">Для базовой ежедневной работы</p>

          <ul className="mt-5 space-y-2.5 text-sm text-[#5d718c]">
            <li>5 операций в день</li>
            <li>Базовые инструменты конвертации и редактирования</li>
            <li>Локальная обработка в браузере</li>
            <li className="text-[#8394aa]">Без OCR, подписи и нумерации PRO</li>
          </ul>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-[#f7cc53] bg-[linear-gradient(180deg,#fffaf0,#fff4df)] p-5 sm:p-6 shadow-[0_14px_34px_rgba(255,178,80,0.2)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ffcf48] via-[#ff9d3f] to-[#5bc3ff]" />
          <div className="inline-flex rounded-full bg-gradient-to-r from-[#ffcf48] to-[#ff9d3f] px-3 py-1 text-[11px] font-black text-[#271a00]">
            PRO
          </div>

          <p className="mt-3 text-3xl font-black text-[#352100]">
            $2.99<span className="ml-1 text-sm font-medium text-[#9e7a32]">/мес</span>
          </p>
          <p className="mt-1 text-sm text-[#8f753f]">Для интенсивной работы и продвинутых задач</p>

          <ul className="mt-5 space-y-2.5 text-sm text-[#6f5727]">
            <li>Безлимитные операции</li>
            <li>OCR распознавание текста</li>
            <li>Подпись PDF и нумерация страниц</li>
            <li>Приоритетные обновления PRO-функций</li>
          </ul>

          <SubscribeButton />
        </section>
      </div>

      <div className="mt-7 rounded-xl border border-[#d4deed] bg-[#f8fbff] px-4 py-3 text-sm text-[#647790]">
        После оплаты Stripe перенаправит вас обратно на эту страницу. Активация PRO происходит серверно через webhook.
      </div>

      <div className="mt-5 text-center text-xs text-[#6d8098]">
        Продолжая, вы принимаете{" "}
        <Link href="/terms" className="text-[#2f4668] hover:text-[#19283f]">
          условия использования
        </Link>{" "}
        и{" "}
        <Link href="/privacy" className="text-[#2f4668] hover:text-[#19283f]">
          политику конфиденциальности
        </Link>
        .
      </div>
    </div>
  );
}
