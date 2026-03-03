"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[#1b263b] bg-[linear-gradient(180deg,rgba(8,10,16,0.4),rgba(6,8,12,0.8))] py-9">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-[#7f8aa0]">PDF X © {new Date().getFullYear()} · Бесплатные инструменты для PDF</div>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <Link href="/" className="text-[#9ca7bc] hover:text-[#e2ddd2] transition-colors">
              Инструменты
            </Link>
            <Link href="/blog" className="text-[#9ca7bc] hover:text-[#e2ddd2] transition-colors">
              Блог
            </Link>
            <Link href="/pricing" className="text-[#9ca7bc] hover:text-[#e2ddd2] transition-colors">
              Цены
            </Link>
            <a href="mailto:contact@pdfx.tools" className="text-[#9ca7bc] hover:text-[#e2ddd2] transition-colors">
              Контакты
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#758097]">
          <Link href="/privacy" className="hover:text-[#c4cfdf] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#c4cfdf] transition-colors">
            Terms of Service
          </Link>
        </div>

        <div className="mt-3 text-xs text-[#667086]">Все файлы обрабатываются в браузере. Мы не храним и не просматриваем ваши документы.</div>
      </div>
    </footer>
  );
}