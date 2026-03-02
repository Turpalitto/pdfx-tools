"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1d232d] bg-[#070809] py-8 mt-10">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#707887]">PDF X © {new Date().getFullYear()} · Бесплатные инструменты для PDF</div>

          <div className="flex items-center gap-5 text-sm">
            <Link href="/" className="text-[#8f98a8] hover:text-[#d9dee7] transition-colors">
              Инструменты
            </Link>
            <Link href="/blog" className="text-[#8f98a8] hover:text-[#d9dee7] transition-colors">
              Блог
            </Link>
            <Link href="/pricing" className="text-[#8f98a8] hover:text-[#d9dee7] transition-colors">
              Цены
            </Link>
            <a href="mailto:contact@pdfx.tools" className="text-[#8f98a8] hover:text-[#d9dee7] transition-colors">
              Контакты
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#667082]">
          <Link href="/privacy" className="hover:text-[#aab4c4] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#aab4c4] transition-colors">
            Terms of Service
          </Link>
        </div>

        <div className="mt-3 text-center text-xs text-[#596273]">
          Все файлы обрабатываются в браузере. Мы не храним и не просматриваем ваши документы.
        </div>
      </div>
    </footer>
  );
}