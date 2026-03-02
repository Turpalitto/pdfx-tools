"use client";

import Link from "next/link";
import { TOOLS, CATEGORIES } from "../lib/tools-config";
import { useMemo, useState } from "react";
import FAQ from "./FAQ";

const faqItems = [
  {
    question: "PDF X отправляет файлы на сервер?",
    answer: "Нет. Базовые операции выполняются локально в браузере, поэтому файлы не покидают устройство.",
  },
  {
    question: "Сколько операций доступно бесплатно?",
    answer: "В бесплатном тарифе доступно 5 операций в день. Безлимит и PRO-инструменты доступны в подписке.",
  },
  {
    question: "Какие форматы поддерживаются?",
    answer: "Основной формат — PDF. Для конвертации также поддерживаются изображения JPG и PNG.",
  },
  {
    question: "Нужна ли регистрация для базовых инструментов?",
    answer: "Нет, для большинства базовых операций регистрация не требуется.",
  },
];

export default function ToolPage() {
  const [filterCat, setFilterCat] = useState("all");

  const filteredTools = filterCat === "all" ? TOOLS : TOOLS.filter((t) => t.cat === filterCat);

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }),
    []
  );

  return (
    <div className="py-8 md:py-14 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,220,80,0.16),transparent_60%)]" />

      <div className="text-center mb-8 md:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-3 text-[#f4efe6] leading-[1.05]">
          PDF без <span className="text-[#ffdc50]">ограничений</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#a6abb4] font-mono tracking-wide px-2">
          // 12 инструментов · всё в браузере · конфиденциально
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 md:mb-7 pb-2 snap-x snap-mandatory">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`snap-start px-3.5 md:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterCat === c.id
                ? "bg-[#12151b] border border-[#2d323c] text-[#f4efe6]"
                : "bg-transparent border border-[#2a2f38] text-[#a0a7b2] hover:border-[#3a414d] hover:text-[#dde2ea]"
            }`}
          >
            <span className="mr-1">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.route || "/"}
            className="group min-h-[132px] sm:min-h-[138px] bg-[#0b0c0f] border border-[#222733] rounded-xl p-3.5 md:p-4 text-center hover:border-[#4b5566] hover:bg-[#10141b] transition-all relative shadow-[0_0_0_1px_rgba(255,255,255,0.015)]"
          >
            {tool.pro && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] text-[8px] font-black px-1.5 py-0.5 rounded">
                PRO
              </div>
            )}
            <div className="text-[22px] mb-2">{tool.emoji}</div>
            <div className="text-[11px] sm:text-xs font-bold mb-1 text-[#f1ecdf] leading-tight">{tool.label}</div>
            <div className="text-[10px] text-[#9ca3af] leading-tight">{tool.hint}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1e232b] rounded-xl overflow-hidden mt-8 md:mt-10 border border-[#2a313d]">
        {[
          ["🔒", "Приватно", "Файлы не покидают устройство"],
          ["⚡", "Мгновенно", "Обработка локально"],
          ["🆓", "Бесплатно", "Базовые функции бесплатно"],
          ["📱", "Везде", "Моб., планшет, ПК"],
        ].map(([icon, title, sub]) => (
          <div key={title} className="bg-[#0c1015] p-4 text-center">
            <div className="text-lg mb-1">{icon}</div>
            <div className="text-xs font-bold text-[#f0eadb]">{title}</div>
            <div className="text-[10px] text-[#9aa1ad] font-mono leading-snug">{sub}</div>
          </div>
        ))}
      </div>

      <FAQ items={faqItems} />
    </div>
  );
}