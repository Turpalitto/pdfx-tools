"use client";

import Link from "next/link";
import { TOOLS, CATEGORIES } from "../lib/tools-config";
import { useState } from "react";

export default function ToolPage() {
  const [filterCat, setFilterCat] = useState("all");

  const filteredTools =
    filterCat === "all"
      ? TOOLS
      : TOOLS.filter((t) => t.cat === filterCat);

  return (
    <div className="py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          PDF без <span className="text-[#ffdc50]">ограничений</span>
        </h1>
        <p className="text-sm text-[#444] font-mono tracking-wide">
          // 12 инструментов · всё в браузере · конфиденциально
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterCat === c.id
                ? "bg-[#151515] border border-[#2a2a2a] text-[#e8e3db]"
                : "bg-transparent border border-[#141414] text-[#444] hover:border-[#1a1a1a]"
            }`}
          >
            <span className="mr-1">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredTools.map((tool) => {
          return (
            <Link
              key={tool.id}
              href={tool.route || "/"}
              className="group bg-[#0a0a0b] border border-[#161616] rounded-xl p-4 text-center hover:border-[#2a2a2a] hover:bg-[#111] transition-all relative"
            >
              {tool.pro && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] text-[8px] font-black px-1.5 py-0.5 rounded">
                  PRO
                </div>
              )}
              <div className="text-2xl mb-2">{tool.emoji}</div>
              <div className="text-xs font-bold mb-1">{tool.label}</div>
              <div className="text-[10px] text-[#444] leading-tight">{tool.hint}</div>
            </Link>
          );
        })}
      </div>

      {/* Trust Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#141414] rounded-xl overflow-hidden mt-10 border border-[#141414]">
        {[
          ["🔒", "Приватно", "Файлы не покидают устройство"],
          ["⚡", "Мгновенно", "Обработка локально"],
          ["🆓", "Бесплатно", "Базовые функции бесплатно"],
          ["📱", "Везде", "Моб., планшет, ПК"],
        ].map(([icon, title, sub]) => (
          <div key={title} className="bg-[#070809] p-4 text-center">
            <div className="text-lg mb-1">{icon}</div>
            <div className="text-xs font-bold">{title}</div>
            <div className="text-[10px] text-[#444] font-mono">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
