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

      <section className="fade-up rounded-3xl border border-[#d8e1ee] bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(247,250,255,0.94))] p-6 sm:p-8 md:p-8 shadow-[0_20px_56px_rgba(73,101,144,0.15)]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d4deee] bg-[#f4f8ff] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#657893] font-mono">
            Browser-First PDF Toolkit
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.98] text-[#17243c]">
            PDF без <span className="text-[#ffb648]">ограничений</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#637691] font-mono tracking-wide">
            12 инструментов · всё в браузере · конфиденциально
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                filterCat === c.id
                  ? "glow-pulse border-[#8ea8cd] bg-[linear-gradient(180deg,#eef4ff,#e8f0ff)] text-[#1f3a63] shadow-[0_6px_18px_rgba(87,123,176,0.18)]"
                  : "border-[#d2ddec] bg-[#fbfdff] text-[#60728d] hover:border-[#9cb4d8] hover:text-[#223a5f]"
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
            className="fade-up group relative min-h-[136px] sm:min-h-[144px] overflow-hidden rounded-2xl border border-[#d6e0ee] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] px-3.5 py-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#9cb4d8] hover:shadow-[0_16px_32px_rgba(73,103,146,0.22)]"
            style={{ animationDelay: `${Math.min(idx * 40, 220)}ms` }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_0%,rgba(255,182,72,0.2),transparent_62%)]" />

            {tool.pro ? (
              <div className="absolute right-2 top-2 rounded bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] px-1.5 py-0.5 text-[8px] font-black text-[#2d1d00]">
                PRO
              </div>
            ) : null}

            <div className="relative text-[22px] mb-2">{tool.emoji}</div>
            <div className="relative text-[11px] sm:text-xs font-bold text-[#203450] leading-tight">{tool.label}</div>
            <div className="relative mt-1 text-[10px] text-[#62758f] leading-tight">{tool.hint}</div>
          </Link>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-[#d4deed] bg-[linear-gradient(180deg,#fbfdff,#f4f8ff)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#d8e3f3]">
          {[
            ["🔒", "Приватно", "Файлы не покидают устройство"],
            ["⚡", "Мгновенно", "Обработка локально"],
            ["🆓", "Бесплатно", "Базовые функции бесплатно"],
            ["📱", "Везде", "Моб., планшет, ПК"],
          ].map(([icon, title, sub]) => (
            <div key={title} className="bg-[#f9fcff] p-4 text-center">
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-xs font-bold text-[#203450]">{title}</div>
              <div className="text-[10px] text-[#667a94] font-mono leading-snug">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
