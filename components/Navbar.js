"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-[1100px] px-4 pt-3 sm:px-5">
        <div className="rounded-2xl border border-[#253047] bg-[rgba(8,10,16,0.76)] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-xl font-black tracking-tight flex items-center gap-1.5">
                <span className="text-[#ece8df]">PDF</span>
                <span className="rounded-md bg-[#ffcf48] px-2 py-0.5 text-[#07080b]">X</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              <Link href="/" className="text-[#acb4c1] hover:text-[#ece8df] transition-colors">
                Инструменты
              </Link>
              <Link href="/blog" className="text-[#acb4c1] hover:text-[#ece8df] transition-colors">
                Блог
              </Link>
              <Link href="/pricing" className="text-[#acb4c1] hover:text-[#ece8df] transition-colors">
                Цены
              </Link>
            </nav>

            <Link
              href="/pricing"
              className="rounded-xl bg-gradient-to-r from-[#ffcf48] to-[#ff8e3c] px-3.5 py-1.5 text-xs font-black text-[#07080b] shadow-[0_8px_26px_rgba(255,166,67,0.35)] hover:brightness-110 transition-all"
            >
              PRO ⚡
            </Link>
          </div>

          <nav className="md:hidden border-t border-[#1b2233] px-4 py-2.5 flex items-center gap-4 text-xs">
            <Link href="/" className="text-[#9ca6b6] hover:text-[#ece8df] transition-colors">
              Инструменты
            </Link>
            <Link href="/blog" className="text-[#9ca6b6] hover:text-[#ece8df] transition-colors">
              Блог
            </Link>
            <Link href="/pricing" className="text-[#9ca6b6] hover:text-[#ece8df] transition-colors">
              Цены
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}