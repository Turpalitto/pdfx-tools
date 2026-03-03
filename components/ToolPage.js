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
    <div className="relative py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="fade-up rounded-3xl border border-[#253047] bg-[linear-gradient(145deg,rgba(11,14,20,0.92),rgba(8,10,16,0.88))] p-6 sm:p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#33405c] bg-[rgba(14,19,30,0.75)] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#9eb0cf] font-mono">
            Browser-First PDF Toolkit
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[0.98] text-[#f6f2ea]">
            PDF без <span className="text-[#ffcf48]">ограничений</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#9ca6b6] font-mono tracking-wide">
            // 12 инструментов · всё в браузере · конфиденциально
          </p>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                filterCat === c.id
                  ? "glow-pulse border-[#43577f] bg-[linear-gradient(180deg,#121a2a,#0d1422)] text-[#f5f0e4]"
                  : "border-[#2e3b57] bg-[rgba(11,14,20,0.65)] text-[#a7b1c2] hover:border-[#4b5e83] hover:text-[#e9e4d9]"
              }`}
            >
              <span className="mr-1">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {filteredTools.map((tool, idx) => (
          <Link
            key={tool.id}
            href={tool.route || "/"}
            className="fade-up group relative min-h-[138px] sm:min-h-[146px] overflow-hidden rounded-2xl border border-[#263247] bg-[linear-gradient(180deg,#0c1018,#0a0d14)] px-3.5 py-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#516892] hover:shadow-[0_16px_32px_rgba(10,14,22,0.85)]"
            style={{ animationDelay: `${Math.min(idx * 40, 220)}ms` }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_0%,rgba(255,207,72,0.14),transparent_60%)]" />

            {tool.pro ? (
              <div className="absolute right-2 top-2 rounded bg-gradient-to-r from-[#ffcf48] to-[#ff8e3c] px-1.5 py-0.5 text-[8px] font-black text-[#07080b]">
                PRO
              </div>
            ) : null}

            <div className="relative text-[22px] mb-2">{tool.emoji}</div>
            <div className="relative text-[11px] sm:text-xs font-bold text-[#f2ede2] leading-tight">{tool.label}</div>
            <div className="relative mt-1 text-[10px] text-[#9ca8bc] leading-tight">{tool.hint}</div>
          </Link>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-[#2a3953] bg-[linear-gradient(180deg,#0b1018,#0a0d14)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#23314a]">
          {[
            ["🔒", "Приватно", "Файлы не покидают устройство"],
            ["⚡", "Мгновенно", "Обработка локально"],
            ["🆓", "Бесплатно", "Базовые функции бесплатно"],
            ["📱", "Везде", "Моб., планшет, ПК"],
          ].map(([icon, title, sub]) => (
            <div key={title} className="bg-[#0b1017] p-4 text-center">
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-xs font-bold text-[#f1ecdf]">{title}</div>
              <div className="text-[10px] text-[#99a4b7] font-mono leading-snug">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}