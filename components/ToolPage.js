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

const TRUST_ITEMS = [
  { icon: "🔒", title: "Приватно",    sub: "Файлы не покидают устройство",      color: "#34d399", bg: "rgba(52,211,153,0.1)"  },
  { icon: "⚡", title: "Мгновенно",   sub: "Обработка прямо в браузере",         color: "#ffb648", bg: "rgba(255,182,72,0.1)"  },
  { icon: "🆓", title: "Бесплатно",   sub: "5 операций в день без регистрации",  color: "#60a5fa", bg: "rgba(96,165,250,0.1)"  },
  { icon: "📱", title: "Везде",       sub: "Мобильный, планшет, ПК",             color: "#f87171", bg: "rgba(248,113,113,0.1)" },
];

export default function ToolPage() {
  const [filterCat, setFilterCat] = useState("all");

  const filteredTools = filterCat === "all" ? TOOLS : TOOLS.filter((t) => t.cat === filterCat);

  const faqSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }), []);

  return (
    <div className="relative py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="fade-up relative overflow-hidden rounded-3xl border border-[#dce6f5] bg-white shadow-[0_24px_64px_rgba(60,90,140,0.11)] px-6 sm:px-10 pt-10 pb-8 md:pt-12 md:pb-10">
        {/* Декоративные пятна */}
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,182,72,0.16),transparent_70%)]" />
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(0,191,165,0.11),transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[#ffb648]/50 to-transparent" />

        <div className="relative mx-auto max-w-[700px] text-center">
          {/* Бейдж */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6e3f5] bg-[#f4f8ff] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5e78a0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] inline-block animate-pulse" />
            Browser-First PDF Toolkit
          </span>

          <h1 className="text-[2.8rem] sm:text-[3.6rem] md:text-[4.2rem] font-black tracking-tight leading-[0.95] text-[#111d30]">
            PDF без{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#ffb648]">ограничений</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#ffb648]/15 rounded-sm" />
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-[#637691] font-mono tracking-wide">
            12 инструментов · всё в браузере · конфиденциально
          </p>

          {/* Статы */}
          <div className="mt-7 flex justify-center gap-8 sm:gap-12">
            {[
              { num: "12",   label: "инструментов" },
              { num: "100%", label: "бесплатно"    },
              { num: "0",    label: "серверов"      },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#162035] leading-none">{num}</div>
                <div className="mt-0.5 text-[10px] font-mono text-[#7a90a8] uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Фильтр */}
        <div className="relative mt-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                filterCat === c.id
                  ? "border-[#ffb648] bg-[#fff8eb] text-[#7a4800] shadow-[0_4px_14px_rgba(255,182,72,0.22)]"
                  : "border-[#d2ddec] bg-[#f8fafd] text-[#60728d] hover:border-[#b8ccdf] hover:bg-white hover:text-[#223a5f]"
              }`}
            >
              <span className="mr-1">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── TOOL GRID ───────────────────────────────────────────── */}
      <section className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredTools.map((tool, idx) => (
          <Link
            key={tool.id}
            href={tool.route || "/"}
            className="fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-[#dbe5f3] bg-white text-center transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(60,90,140,0.16)] hover:border-[#c4d5eb]"
            style={{ animationDelay: `${Math.min(idx * 35, 200)}ms` }}
          >
            {/* Цветная полоска */}
            <div
              className="h-[3px] w-full flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: tool.color }}
            />
            {/* Hover glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color}15, transparent 60%)` }}
            />
            {/* PRO badge */}
            {tool.pro && (
              <div className="absolute right-2 top-3 rounded-md bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] px-1.5 py-[3px] text-[8px] font-black tracking-wide text-[#2d1d00] shadow-[0_2px_8px_rgba(255,166,67,0.4)]">
                PRO
              </div>
            )}
            <div className="flex flex-col items-center px-3 py-4 flex-1">
              <div className="text-[24px] mb-2.5 transition-transform duration-200 group-hover:scale-110">
                {tool.emoji}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[#1a2d47] leading-tight">{tool.label}</div>
              <div className="mt-1.5 text-[10px] text-[#7089a8] leading-tight">{tool.hint}</div>
            </div>
          </Link>
        ))}
      </section>

      {/* ── TRUST ───────────────────────────────────────────────── */}
      <section className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {TRUST_ITEMS.map(({ icon, title, sub, color, bg }) => (
          <div
            key={title}
            className="rounded-2xl border border-[#dce6f5] bg-white px-4 py-5 text-center transition-all duration-200 hover:shadow-[0_8px_24px_rgba(60,90,140,0.09)] hover:-translate-y-0.5"
          >
            <div
              className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl"
              style={{ background: bg }}
            >
              {icon}
            </div>
            <div className="text-sm font-bold text-[#1a2d47]">{title}</div>
            <div className="mt-1 text-[11px] text-[#7a90a8] font-mono leading-snug">{sub}</div>
          </div>
        ))}
      </section>

      {/* ── PRO BANNER ──────────────────────────────────────────── */}
      <section className="mt-4 relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#1a2440,#243050)] border border-[#2e3f5c] px-6 py-7 sm:px-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,182,72,0.14),transparent_70%)]" />
        <div className="pointer-events-none absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(0,191,165,0.09),transparent_70%)]" />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,182,72,0.12)] border border-[rgba(255,182,72,0.28)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ffb648] mb-2.5">
              ✦ PRO подписка
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              Безлимит + OCR + Подпись + Нумерация
            </h2>
            <p className="mt-1 text-sm text-[#7a9abf] font-mono">
              Все 12 инструментов без ограничений · $2.99/мес
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 rounded-xl bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] px-6 py-3 text-sm font-black text-[#1a0f00] shadow-[0_8px_24px_rgba(255,166,67,0.3)] hover:brightness-105 hover:shadow-[0_12px_32px_rgba(255,166,67,0.4)] transition-all duration-200"
          >
            Попробовать PRO →
          </Link>
        </div>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
