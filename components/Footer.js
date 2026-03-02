"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#161616] bg-[#070809] py-8">
      <div className="max-w-[940px] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#444]">
            PDF X © {new Date().getFullYear()} · Бесплатные инструменты для PDF
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-[#444] hover:text-[#888] transition-colors">
              Инструменты
            </Link>
            <Link href="/pricing" className="text-[#444] hover:text-[#888] transition-colors">
              Цены
            </Link>
            <a 
              href="mailto:contact@pdfx.tools" 
              className="text-[#444] hover:text-[#888] transition-colors"
            >
              Контакты
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-[#333]">
          Все файлы обрабатываются в браузере. Мы не храним и не видим ваши документы.
        </div>
      </div>
    </footer>
  );
}
