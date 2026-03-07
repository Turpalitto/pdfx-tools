"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TOOLS, CATEGORIES } from "../lib/tools-config";
import FAQ from "./FAQ";

const faqItems = [
  { question: "PDF X отправляет файлы на сервер?", answer: "Нет. Базовые операции выполняются локально в браузере — файлы не покидают устройство." },
  { question: "Сколько операций доступно бесплатно?", answer: "В бесплатном тарифе доступно 5 операций в день. Безлимит и PRO-инструменты — в подписке." },
  { question: "Нужна регистрация для базовых инструментов?", answer: "Нет. Для большинства базовых операций вход не требуется." },
  { question: "Какие форматы поддерживаются?", answer: "PDF, JPG, PNG, WebP, DOC/DOCX, XLS/XLSX, PPT/PPTX, HTML, TXT." },
];

const CATEGORY_META = {
  convert: { label: "Конвертация",     color: "#6366f1", bg: "#eef2ff" },
  edit:    { label: "Редактирование",  color: "#0ea5e9", bg: "#e0f2fe" },
  protect: { label: "Защита",          color: "#10b981", bg: "#d1fae5" },
  analyze: { label: "Анализ",          color: "#f59e0b", bg: "#fef3c7" },
};

const TOP_TOOL_IDS = ["merge","split","compress","rotate","pdf2word","word2pdf","pdf2jpg","img2pdf","unlock","watermark"];

function toolMatchesSearch(tool, query) {
  if (!query) return true;
  return [tool.label, tool.hint, tool.description, ...(tool.keywords || [])].join(" ").toLowerCase().includes(query);
}

function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith("#")) return `rgba(99,129,165,${alpha})`;
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── SVG Icons ─────────────────────────────────────────────────────────────
function ToolIcon({ id, color, size = 22 }) {
  const icons = {
    merge: <><path d="M8 3H5a1 1 0 00-1 1v14a1 1 0 001 1h3"/><path d="M16 3h3a1 1 0 011 1v14a1 1 0 01-1 1h-3"/><path d="M12 8v8M9 11l3-3 3 3"/><line x1="9" y1="15" x2="15" y2="15"/></>,
    split: <><path d="M6 3h12a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M6 14h12a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 01-1-1v-5a1 1 0 011-1z"/><line x1="12" y1="10" x2="12" y2="14" strokeDasharray="2 1.5"/></>,
    compress: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="8 15 12 19 16 15"/><line x1="12" y1="11" x2="12" y2="19"/></>,
    rotate: <><path d="M21.5 2v6h-6"/><path d="M21.34 13.78A9 9 0 113 10"/><polyline points="15.5 8 21.5 8 21.5 2"/></>,
    deletepages: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></>,
    reorder: <><line x1="3" y1="7" x2="15" y2="7"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="17" x2="15" y2="17"/><polyline points="18 4 21 7 18 10"/><polyline points="21 14 18 17 21 20"/></>,
    extractpages: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="14" x2="17" y2="14"/><polyline points="14 11 17 14 14 17"/></>,
    crop: <><path d="M6 2v14a2 2 0 002 2h14"/><path d="M18 22V8a2 2 0 00-2-2H2"/></>,
    pdf2img: <><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/><path d="M8 17l2-2.5 2 2.5 2.5-3 2.5 3"/><circle cx="10" cy="13" r="1" fill={color} stroke="none"/></>,
    pdf2jpg: <><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/><path d="M8 17l2-2.5 2 2.5 2.5-3 2.5 3"/><circle cx="9.5" cy="13" r="1" fill={color} stroke="none"/></>,
    pdf2png: <><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/><rect x="8" y="12" width="8" height="5" rx="1"/><path d="M10 14l1.5-1.5 1.5 1.5"/></>,
    img2pdf: <><rect x="2" y="4" width="13" height="10" rx="2"/><path d="M3 11l2.5-3 2.5 3 2-2 2 2"/><circle cx="6" cy="7.5" r="1" fill={color} stroke="none"/><path d="M18 10h2a1 1 0 011 1v9a1 1 0 01-1 1h-9a1 1 0 01-1-1v-3"/></>,
    jpg2pdf: <><rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M3 10l2-2.5 2 2.5 2-2.5 2 2.5"/><path d="M17 9h3a1 1 0 011 1v9a1 1 0 01-1 1h-9a1 1 0 01-1-1v-3"/></>,
    png2pdf: <><rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M3 10l2-2.5 2 2.5 2-2.5 2 2.5"/><path d="M17 9h3a1 1 0 011 1v9a1 1 0 01-1 1h-9a1 1 0 01-1-1v-3"/></>,
    scan2pdf: <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/><line x1="12" y1="11" x2="12" y2="15" strokeWidth="1.2"/><line x1="10" y1="13" x2="14" y2="13" strokeWidth="1.2"/></>,
    word2pdf: <><rect x="2" y="3" width="9" height="14" rx="1.5"/><path d="M5 7h3M5 10h3M5 13h2"/><path d="M14 9l4 3-4 3"/><line x1="14" y1="12" x2="22" y2="12"/></>,
    pdf2word: <><rect x="13" y="3" width="9" height="14" rx="1.5"/><path d="M16 7h3M16 10h3M16 13h2"/><path d="M10 9L6 12l4 3"/><line x1="10" y1="12" x2="2" y2="12"/></>,
    excel2pdf: <><rect x="2" y="3" width="9" height="14" rx="1.5"/><line x1="3.5" y1="9" x2="9.5" y2="9"/><line x1="3.5" y1="12" x2="9.5" y2="12"/><line x1="6.5" y1="6" x2="6.5" y2="15"/><path d="M14 9l4 3-4 3"/><line x1="14" y1="12" x2="22" y2="12"/></>,
    pdf2excel: <><rect x="13" y="3" width="9" height="14" rx="1.5"/><line x1="14.5" y1="9" x2="20.5" y2="9"/><line x1="14.5" y1="12" x2="20.5" y2="12"/><line x1="17.5" y1="6" x2="17.5" y2="15"/><path d="M10 9L6 12l4 3"/><line x1="10" y1="12" x2="2" y2="12"/></>,
    ppt2pdf: <><rect x="2" y="4" width="9" height="12" rx="1.5"/><path d="M5 9h2a1.5 1.5 0 010 3H5V9z"/><path d="M14 9l4 3-4 3"/><line x1="14" y1="12" x2="22" y2="12"/></>,
    pdf2ppt: <><rect x="13" y="4" width="9" height="12" rx="1.5"/><path d="M16 9h2a1.5 1.5 0 010 3H16V9z"/><path d="M10 9L6 12l4 3"/><line x1="10" y1="12" x2="2" y2="12"/></>,
    html2pdf: <><polyline points="4 7 1 12 4 17"/><polyline points="8 5 11 12 8 19"/><path d="M15 9l4 3-4 3"/><line x1="15" y1="12" x2="23" y2="12"/></>,
    pdf2html: <><path d="M9 9L5 12l4 3"/><line x1="9" y1="12" x2="1" y2="12"/><polyline points="15 7 18 12 15 17"/><polyline points="19 5 22 12 19 19"/></>,
    txt2pdf: <><line x1="2" y1="6" x2="11" y2="6"/><line x1="2" y1="10" x2="11" y2="10"/><line x1="2" y1="14" x2="8" y2="14"/><path d="M15 9l4 3-4 3"/><line x1="15" y1="12" x2="22" y2="12"/></>,
    pdfa: <><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><path d="M9 13h6M12 10v6"/></>,
    protect: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></>,
    unlock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></>,
    watermark: <><path d="M12 2a5 5 0 00-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 00-5-5z"/><circle cx="12" cy="7" r="2"/></>,
    sign: <><path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z"/><path d="M15 5l4 4"/></>,
    flatten: <><rect x="2" y="17" width="20" height="3" rx="1"/><path d="M5 13h14M8 9h8M11 5h2"/><polyline points="6 17 12 10 18 17"/></>,
    repair: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a6 6 0 01-7.4 7.4l-5 5a2 2 0 01-3-3l5-5A6 6 0 0114.7 6.3z"/></>,
    redact: <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2.5"/></>,
    extract: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="14" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/><polyline points="14 15 16 13 14 11"/></>,
    pdf2txt: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/></>,
    ocr: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="5" y2="5"/><line x1="19" y1="3" x2="21" y2="5"/><line x1="3" y1="21" x2="5" y2="19"/><line x1="19" y1="21" x2="21" y2="19"/></>,
    pagenum: <><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M3 10h2"/><path d="M3 16h1.5a1 1 0 010 2H3.5a1 1 0 010 2H5"/></>,
    compare: <><rect x="2" y="3" width="8" height="15" rx="1.5"/><rect x="14" y="3" width="8" height="15" rx="1.5"/><line x1="4" y1="8" x2="8" y2="8"/><line x1="4" y1="12" x2="8" y2="12"/><line x1="4" y1="16" x2="6" y2="16"/><line x1="16" y1="8" x2="20" y2="8"/><line x1="16" y1="12" x2="18" y2="12"/><line x1="16" y1="16" x2="20" y2="16"/><path d="M11 10l2 2-2 2"/></>,
  };
  const def = <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></>;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display:"block", flexShrink:0 }}>
      {icons[id] || def}
    </svg>
  );
}

// ── Tool Card ──────────────────────────────────────────────────────────────
function ToolCard({ tool, idx = 0 }) {
  const catMeta = CATEGORY_META[tool.cat] || { color: "#64748b", bg: "#f1f5f9" };
  return (
    <Link
      href={tool.route || "/"}
      className="fade-up group relative flex flex-col rounded-2xl bg-white p-5 transition-all duration-200"
      style={{
        animationDelay: `${Math.min(idx * 20, 200)}ms`,
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,23,42,0.10)"; e.currentTarget.style.borderColor = "#c7d7ed"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Colored category dot */}
      <div className="absolute right-3.5 top-3.5 h-1.5 w-1.5 rounded-full" style={{ background: catMeta.color, opacity: 0.6 }} />

      {tool.pro && (
        <span className="absolute right-2 top-5 rounded-md px-1.5 py-0.5 text-[9px] font-black tracking-wide" style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>
          PRO
        </span>
      )}

      {/* Icon */}
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
        style={{ background: hexToRgba(tool.color, 0.11) }}>
        <ToolIcon id={tool.id} color={tool.color} size={22} />
      </div>

      <div className="text-[13.5px] font-bold leading-snug" style={{ color: "#0f172a" }}>{tool.label}</div>
      <div className="mt-1 text-[11.5px] leading-relaxed" style={{ color: "#64748b" }}>{tool.hint}</div>
    </Link>
  );
}

// ── Chevron Icon ───────────────────────────────────────────────────────────
function ChevronIcon({ down = true }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: down ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.25s ease" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function ToolPage() {
  const [filterCat, setFilterCat] = useState("all");
  const [query, setQuery] = useState("");
  const [allExpanded, setAllExpanded] = useState(false);

  const totalTools = TOOLS.length;
  const proTools   = TOOLS.filter(t => t.pro).length;
  const freeTools  = totalTools - proTools;

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0 || filterCat !== "all";

  const topTools = useMemo(() => TOOLS.filter(t => TOP_TOOL_IDS.includes(t.id) && toolMatchesSearch(t, normalizedQuery)), [normalizedQuery]);
  const restTools = useMemo(() => { const s = new Set(TOP_TOOL_IDS); return TOOLS.filter(t => !s.has(t.id) && toolMatchesSearch(t, normalizedQuery)); }, [normalizedQuery]);
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return TOOLS.filter(t => { if (filterCat !== "all" && t.cat !== filterCat) return false; return toolMatchesSearch(t, normalizedQuery); });
  }, [filterCat, normalizedQuery, isSearching]);

  const groupedRest = useMemo(() => {
    const s = new Set(TOP_TOOL_IDS);
    return CATEGORIES.filter(c => c.id !== "all").map(cat => ({
      id: cat.id,
      tools: TOOLS.filter(t => t.cat === cat.id && !s.has(t.id) && toolMatchesSearch(t, normalizedQuery)),
    })).filter(g => g.tools.length > 0);
  }, [normalizedQuery]);

  const faqSchema = useMemo(() => ({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqItems.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  }), []);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ════════════════════════════════════════════════════════════
          HERO — dark gradient, full-width
      ════════════════════════════════════════════════════════════ */}
      <section className="relative -mx-4 overflow-hidden px-4 pb-14 pt-16 sm:-mx-8 sm:px-8 md:pt-20"
        style={{ background: "linear-gradient(145deg, #0c1b3a 0%, #112754 40%, #0e2250 70%, #091529 100%)" }}>

        {/* Ambient glows */}
        <div className="animate-hero-glow pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)" }} />
        <div className="animate-hero-glow pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)", animationDelay:"2s" }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to bottom, transparent, #f8fafc)" }} />

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="fade-in mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <span className="animate-pulse-dot h-2 w-2 rounded-full" style={{ background: "#34d399" }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.7)" }}>Browser-first · Без загрузки на сервер</span>
          </div>

          {/* Headline */}
          <h1 className="fade-up text-[2.6rem] font-black leading-[1.05] tracking-tight sm:text-[3.4rem] md:text-[4rem]" style={{ color: "#ffffff", animationDelay: "50ms" }}>
            Все PDF-инструменты<br />
            <span style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              в одном месте
            </span>
          </h1>

          <p className="fade-up mx-auto mt-4 max-w-lg text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", animationDelay: "100ms" }}>
            <b style={{ color: "rgba(255,255,255,0.85)" }}>{freeTools} бесплатных</b> + {proTools} PRO-инструментов. Файлы обрабатываются прямо в браузере.
          </p>

          {/* Search */}
          <div className="fade-up relative mx-auto mt-8 max-w-xl" style={{ animationDelay: "150ms" }}>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="search" value={query}
              onChange={e => { setQuery(e.target.value); setAllExpanded(true); }}
              placeholder="Найти инструмент: сжать, объединить, конвертировать..."
              className="w-full rounded-2xl border-0 py-4 pl-11 pr-5 text-sm outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.97)", color: "#0f172a", boxShadow: "0 4px 24px rgba(0,0,0,0.25)", "::placeholder": { color: "#94a3b8" } }}
            />
          </div>

          {/* Category filters */}
          <div className="fade-up mt-5 flex flex-wrap justify-center gap-2" style={{ animationDelay: "200ms" }}>
            {CATEGORIES.map(cat => {
              const count = cat.id === "all"
                ? TOOLS.filter(t => toolMatchesSearch(t, normalizedQuery)).length
                : TOOLS.filter(t => t.cat === cat.id && toolMatchesSearch(t, normalizedQuery)).length;
              const active = filterCat === cat.id;
              const meta = CATEGORY_META[cat.id];
              return (
                <button key={cat.id} type="button"
                  onClick={() => { setFilterCat(cat.id); if (cat.id !== "all") setAllExpanded(true); }}
                  className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150"
                  style={active ? {
                    background: meta ? meta.color : "rgba(255,255,255,0.95)",
                    color: meta ? "#fff" : "#0f172a",
                    border: "1.5px solid transparent",
                    boxShadow: meta ? `0 4px 12px ${hexToRgba(meta.color, 0.4)}` : "none",
                  } : {
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {cat.label}
                  <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]"
                    style={{ background: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)", color: active ? "#fff" : "rgba(255,255,255,0.55)" }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CONTENT
      ════════════════════════════════════════════════════════════ */}
      <div className="mx-auto py-10">

        {isSearching ? (
          /* ── SEARCH RESULTS ─────────────────────────────────── */
          <section>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm" style={{ color: "#475569" }}>
                Найдено: <strong style={{ color: "#0f172a" }}>{searchResults.length}</strong> инструментов
              </p>
              <button type="button" onClick={() => { setQuery(""); setFilterCat("all"); }}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-slate-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#64748b" }}>
                Сбросить
              </button>
            </div>
            {searchResults.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: "#fff", border: "1.5px solid #e2e8f0" }}>
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "#f1f5f9" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <p className="font-semibold" style={{ color: "#334155" }}>По запросу ничего не найдено</p>
                <p className="mt-1 text-sm" style={{ color: "#94a3b8" }}>Попробуйте другое слово или сбросьте фильтр</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {searchResults.map((t, i) => <ToolCard key={t.id} tool={t} idx={i} />)}
              </div>
            )}
          </section>

        ) : (
          <>
            {/* ── TOP 10 ─────────────────────────────────────────── */}
            <section>
              <SectionHeader
                icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                iconBg="linear-gradient(135deg,#fbbf24,#f97316)"
                title="Популярные инструменты"
                sub="Самые используемые — начни здесь"
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {topTools.map((t, i) => <ToolCard key={t.id} tool={t} idx={i} />)}
              </div>
            </section>

            {/* ── ALL TOOLS (collapsible) ────────────────────────── */}
            <section className="mt-6">
              <button type="button" onClick={() => setAllExpanded(v => !v)}
                className="group flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-left transition-all duration-150"
                style={{ border: "1.5px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c7d7ed"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "#f1f5f9", color: "#64748b" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold" style={{ color: "#0f172a" }}>
                      Все инструменты
                    </span>
                    <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "#f1f5f9", color: "#64748b" }}>
                      ещё {restTools.length}
                    </span>
                    <p className="mt-0.5 text-[11px]" style={{ color: "#94a3b8" }}>
                      {allExpanded ? "Нажми чтобы свернуть" : "Конвертация, защита, анализ и другие"}
                    </p>
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "#f1f5f9", color: "#64748b" }}>
                  <ChevronIcon down={!allExpanded} />
                </div>
              </button>

              {allExpanded && (
                <div className="mt-5 space-y-8 scale-in">
                  {groupedRest.map(({ id, tools }) => {
                    const meta = CATEGORY_META[id] || { label: "Инструменты", color: "#64748b", bg: "#f1f5f9" };
                    return (
                      <div key={id}>
                        <div className="mb-4 flex items-center gap-2.5">
                          <span className="rounded-lg px-2.5 py-1 text-xs font-bold" style={{ background: meta.bg, color: meta.color }}>
                            {meta.label}
                          </span>
                          <span className="text-xs" style={{ color: "#cbd5e1" }}>·</span>
                          <span className="text-xs" style={{ color: "#94a3b8" }}>{tools.length} инструментов</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                          {tools.map((t, i) => <ToolCard key={t.id} tool={t} idx={i} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── BENEFITS ──────────────────────────────────────────── */}
        <section className="mt-14">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { title: "100% приватно", sub: "Файлы не покидают ваш браузер никогда", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0",
                icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></> },
              { title: "Мгновенная обработка", sub: "Работает без установки программ", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a",
                icon: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></> },
              { title: "Бесплатно", sub: "5 операций в день без оплаты", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe",
                icon: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></> },
              { title: "Все устройства", sub: "ПК, планшет и смартфон", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe",
                icon: <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5"/></> },
            ].map(item => (
              <div key={item.title} className="rounded-2xl p-5 transition-all duration-150 hover:-translate-y-0.5"
                style={{ background: item.bg, border: `1.5px solid ${item.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px ${hexToRgba(item.color, 0.15)}`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: hexToRgba(item.color, 0.15) }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                </div>
                <div className="text-sm font-bold" style={{ color: "#0f172a" }}>{item.title}</div>
                <div className="mt-1 text-[11.5px] leading-relaxed" style={{ color: "#64748b" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRO CTA ───────────────────────────────────────────── */}
        <section className="relative mt-10 overflow-hidden rounded-3xl"
          style={{ background: "linear-gradient(140deg, #0c1b3a 0%, #112754 50%, #0e2250 100%)" }}>
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)" }} />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-40 w-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)" }} />
          <div className="relative flex flex-col gap-6 px-7 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#fbbf24" }}>PRO подписка</span>
              </div>
              <h2 className="text-xl font-black sm:text-2xl" style={{ color: "#ffffff" }}>
                Безлимитный доступ<br className="hidden sm:block" /> ко всем {totalTools} инструментам
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                OCR, подпись, нумерация страниц, PDF↔Word/Excel/PPT без ограничений
              </p>
              <p className="mt-2 text-lg font-black" style={{ color: "rgba(255,255,255,0.85)" }}>
                от <span style={{ color: "#fbbf24" }}>$2.99</span> /мес
              </p>
            </div>
            <Link href="/pricing"
              className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-2xl px-7 py-4 text-sm font-black transition-all duration-150"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)", color: "#1c1005", boxShadow: "0 8px 24px rgba(251,191,36,0.35)" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 14px 32px rgba(251,191,36,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(251,191,36,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Открыть PRO
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </section>

        <FAQ items={faqItems} />
      </div>
    </div>
  );
}

// ── Section Header helper ──────────────────────────────────────────────────
function SectionHeader({ icon, iconBg, title, sub }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: iconBg || "#f1f5f9" }}>
        {icon}
      </div>
      <div>
        <h2 className="text-base font-black" style={{ color: "#0f172a" }}>{title}</h2>
        {sub && <p className="text-[11.5px]" style={{ color: "#94a3b8" }}>{sub}</p>}
      </div>
    </div>
  );
}
