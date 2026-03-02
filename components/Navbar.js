"use client";

import Link from "next/link";
import { TOOLS, CATEGORIES } from "../lib/tools-config";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#161616] bg-[rgba(7,8,9,0.92)] backdrop-blur-md">
      <div className="max-w-[940px] mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-black tracking-tight flex items-center gap-1">
            <span>PDF</span>
            <span className="bg-[#ffdc50] text-[#070809] px-1.5 rounded font-black">X</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-[#888] hover:text-[#e8e3db] transition-colors">
            Инструменты
          </Link>
          <Link href="/pricing" className="text-[#888] hover:text-[#e8e3db] transition-colors">
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
    </header>
  );
}
