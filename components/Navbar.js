"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1d232d] bg-[rgba(7,8,9,0.9)] backdrop-blur-md">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-black tracking-tight flex items-center gap-1">
            <span>PDF</span>
            <span className="bg-[#ffdc50] text-[#070809] px-1.5 rounded font-black">X</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-[#9ca3af] hover:text-[#e8e3db] transition-colors">
            Инструменты
          </Link>
          <Link href="/blog" className="text-[#9ca3af] hover:text-[#e8e3db] transition-colors">
            Блог
          </Link>
          <Link href="/pricing" className="text-[#9ca3af] hover:text-[#e8e3db] transition-colors">
            Цены
          </Link>
        </nav>

        <Link
          href="/pricing"
          className="bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] px-3 py-1.5 rounded-lg text-xs font-black"
        >
          PRO ⚡
        </Link>
      </div>

      <nav className="md:hidden border-t border-[#161b24] px-4 py-2 flex items-center gap-4 text-xs">
        <Link href="/" className="text-[#9ca3af] hover:text-[#e8e3db] transition-colors">
          Инструменты
        </Link>
        <Link href="/blog" className="text-[#9ca3af] hover:text-[#e8e3db] transition-colors">
          Блог
        </Link>
        <Link href="/pricing" className="text-[#9ca3af] hover:text-[#e8e3db] transition-colors">
          Цены
        </Link>
      </nav>
    </header>
  );
}