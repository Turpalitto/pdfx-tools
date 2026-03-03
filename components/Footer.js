"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[#d6dfee] bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(243,248,255,0.9))] py-9">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-[#647790]">PDF X © {new Date().getFullYear()} · Бесплатные инструменты для PDF</div>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <Link href="/" className="text-[#62748e] hover:text-[#1e3350] transition-colors">
              Инструменты
            </Link>
            <Link href="/blog" className="text-[#62748e] hover:text-[#1e3350] transition-colors">
              Блог
            </Link>
            <Link href="/pricing" className="text-[#62748e] hover:text-[#1e3350] transition-colors">
              Цены
            </Link>
            <a href="mailto:contact@pdfx.tools" className="text-[#62748e] hover:text-[#1e3350] transition-colors">
              Контакты
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#70839d]">
          <Link href="/privacy" className="hover:text-[#334b6d] transition-colors">
            Политика конфиденциальности
          </Link>
          <Link href="/terms" className="hover:text-[#334b6d] transition-colors">
            Условия использования
          </Link>
        </div>

        <div className="mt-3 text-xs text-[#667a93]">Все файлы обрабатываются в браузере. Мы не храним и не просматриваем ваши документы.</div>
      </div>
    </footer>
  );
}
