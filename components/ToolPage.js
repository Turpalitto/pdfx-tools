"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TOOLS, CATEGORIES } from "../lib/tools-config";
import FAQ from "./FAQ";

const faqItems = [
  {
    question: "PDF X отправляет файлы на сервер?",
    answer: "Нет. Базовые операции выполняются локально в браузере — файлы не покидают устройство.",
  },
  {
    question: "Сколько операций доступно бесплатно?",
    answer: "В бесплатном тарифе доступно 5 операций в день. Безлимит и PRO-инструменты — в подписке.",
  },
  {
    question: "Нужна регистрация для базовых инструментов?",
    answer: "Нет. Для большинства базовых операций вход не требуется.",
  },
  {
    question: "Какие форматы поддерживаются?",
    answer: "PDF, JPG, PNG, WebP, DOC/DOCX, XLS/XLSX, PPT/PPTX, HTML, TXT.",
  },
];

const CATEGORY_INFO = {
  convert: { title: "Конвертация", subtitle: "PDF, Office и изображения" },
  edit:    { title: "Редактирование", subtitle: "Страницы, порядок, сжатие" },
  protect: { title: "Защита и подпись", subtitle: "Пароль, водяные знаки, подпись" },
  analyze: { title: "Анализ и извлечение", subtitle: "Метаданные, OCR, текст" },
};

const TOP_TOOL_IDS = [
  "merge", "split", "compress", "rotate",
  "pdf2word", "word2pdf", "pdf2jpg", "img2pdf",
  "unlock", "watermark",
];

function toolMatchesSearch(tool, query) {
  if (!query) return true;
  return [tool.label, tool.hint, tool.description, ...(tool.keywords || [])]
    .join(" ").toLowerCase().includes(query);
}

function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith("#")) return `rgba(99,129,165,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── SVG Icons ──────────────────────────────────────────────────────────────
function ToolIcon({ id, color, size = 22 }) {
  const icons = {
    // Edit
    merge: (
      <>
        <path d="M8 3H5a1 1 0 00-1 1v14a1 1 0 001 1h3" />
        <path d="M16 3h3a1 1 0 011 1v14a1 1 0 01-1 1h-3" />
        <path d="M12 8v8M9 11l3-3 3 3" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </>
    ),
    split: (
      <>
        <path d="M6 3h12a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path d="M6 14h12a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 01-1-1v-5a1 1 0 011-1z" />
        <line x1="12" y1="10" x2="12" y2="14" strokeDasharray="2 1.5" />
      </>
    ),
    compress: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="8 15 12 19 16 15" />
        <line x1="12" y1="11" x2="12" y2="19" />
      </>
    ),
    rotate: (
      <>
        <path d="M21.5 2v6h-6" />
        <path d="M21.34 13.78A9 9 0 113 10" />
        <polyline points="15.5 8 21.5 8 21.5 2" />
      </>
    ),
    deletepages: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </>
    ),
    reorder: (
      <>
        <line x1="3" y1="7" x2="15" y2="7" />
        <line x1="3" y1="12" x2="15" y2="12" />
        <line x1="3" y1="17" x2="15" y2="17" />
        <polyline points="18 4 21 7 18 10" />
        <polyline points="21 14 18 17 21 20" />
      </>
    ),
    extractpages: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="14" x2="17" y2="14" />
        <polyline points="14 11 17 14 14 17" />
      </>
    ),
    crop: (
      <>
        <path d="M6 2v14a2 2 0 002 2h14" />
        <path d="M18 22V8a2 2 0 00-2-2H2" />
      </>
    ),
    // Convert – pdf to image
    pdf2img: (
      <>
        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <polyline points="13 2 13 9 20 9" />
        <path d="M8 17l2-2.5 2 2.5 2.5-3 2.5 3" />
        <circle cx="10" cy="13" r="1" fill={color} stroke="none" />
      </>
    ),
    pdf2jpg: (
      <>
        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <polyline points="13 2 13 9 20 9" />
        <path d="M8 17l2-2.5 2 2.5 2.5-3 2.5 3" />
        <circle cx="9.5" cy="13" r="1" fill={color} stroke="none" />
      </>
    ),
    pdf2png: (
      <>
        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <polyline points="13 2 13 9 20 9" />
        <rect x="8" y="12" width="8" height="5" rx="1" />
        <path d="M10 14l1.5-1.5 1.5 1.5" />
      </>
    ),
    // Convert – image to pdf
    img2pdf: (
      <>
        <rect x="2" y="4" width="13" height="10" rx="2" />
        <path d="M3 11l2.5-3 2.5 3 2-2 2 2" />
        <circle cx="6" cy="7.5" r="1" fill={color} stroke="none" />
        <path d="M18 10h2a1 1 0 011 1v9a1 1 0 01-1 1h-9a1 1 0 01-1-1v-3" />
      </>
    ),
    jpg2pdf: (
      <>
        <rect x="2" y="4" width="12" height="9" rx="1.5" />
        <path d="M3 10l2-2.5 2 2.5 2-2.5 2 2.5" />
        <path d="M17 9h3a1 1 0 011 1v9a1 1 0 01-1 1h-9a1 1 0 01-1-1v-3" />
      </>
    ),
    png2pdf: (
      <>
        <rect x="2" y="4" width="12" height="9" rx="1.5" />
        <path d="M3 10l2-2.5 2 2.5 2-2.5 2 2.5" />
        <path d="M17 9h3a1 1 0 011 1v9a1 1 0 01-1 1h-9a1 1 0 01-1-1v-3" />
      </>
    ),
    scan2pdf: (
      <>
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
        <line x1="12" y1="11" x2="12" y2="15" strokeWidth="1.2" />
        <line x1="10" y1="13" x2="14" y2="13" strokeWidth="1.2" />
      </>
    ),
    // Convert – office
    word2pdf: (
      <>
        <rect x="2" y="3" width="9" height="14" rx="1.5" />
        <path d="M5 7h3M5 10h3M5 13h2" />
        <path d="M14 9l4 3-4 3" />
        <line x1="14" y1="12" x2="22" y2="12" />
      </>
    ),
    pdf2word: (
      <>
        <rect x="13" y="3" width="9" height="14" rx="1.5" />
        <path d="M16 7h3M16 10h3M16 13h2" />
        <path d="M10 9L6 12l4 3" />
        <line x1="10" y1="12" x2="2" y2="12" />
      </>
    ),
    excel2pdf: (
      <>
        <rect x="2" y="3" width="9" height="14" rx="1.5" />
        <line x1="3.5" y1="9" x2="9.5" y2="9" />
        <line x1="3.5" y1="12" x2="9.5" y2="12" />
        <line x1="6.5" y1="6" x2="6.5" y2="15" />
        <path d="M14 9l4 3-4 3" />
        <line x1="14" y1="12" x2="22" y2="12" />
      </>
    ),
    pdf2excel: (
      <>
        <rect x="13" y="3" width="9" height="14" rx="1.5" />
        <line x1="14.5" y1="9" x2="20.5" y2="9" />
        <line x1="14.5" y1="12" x2="20.5" y2="12" />
        <line x1="17.5" y1="6" x2="17.5" y2="15" />
        <path d="M10 9L6 12l4 3" />
        <line x1="10" y1="12" x2="2" y2="12" />
      </>
    ),
    ppt2pdf: (
      <>
        <rect x="2" y="4" width="9" height="12" rx="1.5" />
        <path d="M5 9h2a1.5 1.5 0 010 3H5V9z" />
        <path d="M14 9l4 3-4 3" />
        <line x1="14" y1="12" x2="22" y2="12" />
      </>
    ),
    pdf2ppt: (
      <>
        <rect x="13" y="4" width="9" height="12" rx="1.5" />
        <path d="M16 9h2a1.5 1.5 0 010 3H16V9z" />
        <path d="M10 9L6 12l4 3" />
        <line x1="10" y1="12" x2="2" y2="12" />
      </>
    ),
    html2pdf: (
      <>
        <polyline points="4 7 1 12 4 17" />
        <polyline points="8 5 11 12 8 19" />
        <path d="M15 9l4 3-4 3" />
        <line x1="15" y1="12" x2="23" y2="12" />
      </>
    ),
    pdf2html: (
      <>
        <path d="M9 9L5 12l4 3" />
        <line x1="9" y1="12" x2="1" y2="12" />
        <polyline points="15 7 18 12 15 17" />
        <polyline points="19 5 22 12 19 19" />
      </>
    ),
    txt2pdf: (
      <>
        <line x1="2" y1="6" x2="11" y2="6" />
        <line x1="2" y1="10" x2="11" y2="10" />
        <line x1="2" y1="14" x2="8" y2="14" />
        <path d="M15 9l4 3-4 3" />
        <line x1="15" y1="12" x2="22" y2="12" />
      </>
    ),
    pdfa: (
      <>
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        <path d="M9 13h6M12 10v6" />
      </>
    ),
    // Protect
    protect: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
    unlock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 019.9-1" />
      </>
    ),
    watermark: (
      <>
        <path d="M12 2a5 5 0 00-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 00-5-5z" />
        <circle cx="12" cy="7" r="2" />
      </>
    ),
    sign: (
      <>
        <path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        <path d="M15 5l4 4" />
      </>
    ),
    flatten: (
      <>
        <rect x="2" y="17" width="20" height="3" rx="1" />
        <path d="M5 13h14" />
        <path d="M8 9h8" />
        <path d="M11 5h2" />
        <polyline points="6 17 12 10 18 17" />
      </>
    ),
    repair: (
      <>
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a6 6 0 01-7.4 7.4l-5 5a2 2 0 01-3-3l5-5A6 6 0 0114.7 6.3z" />
      </>
    ),
    redact: (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ),
    // Analyze
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2.5" />
      </>
    ),
    extract: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="14" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
        <polyline points="14 15 16 13 14 11" />
      </>
    ),
    pdf2txt: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="14" y2="17" />
        <line x1="8" y1="9" x2="10" y2="9" />
      </>
    ),
    ocr: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
        <line x1="3" y1="3" x2="5" y2="5" />
        <line x1="19" y1="3" x2="21" y2="5" />
        <line x1="3" y1="21" x2="5" y2="19" />
        <line x1="19" y1="21" x2="21" y2="19" />
      </>
    ),
    pagenum: (
      <>
        <line x1="10" y1="6" x2="21" y2="6" />
        <line x1="10" y1="12" x2="21" y2="12" />
        <line x1="10" y1="18" x2="21" y2="18" />
        <path d="M4 6h1v4" />
        <path d="M3 10h2" />
        <path d="M3 16h1.5a1 1 0 010 2H3.5a1 1 0 010 2H5" />
      </>
    ),
    compare: (
      <>
        <rect x="2" y="3" width="8" height="15" rx="1.5" />
        <rect x="14" y="3" width="8" height="15" rx="1.5" />
        <line x1="4" y1="8" x2="8" y2="8" />
        <line x1="4" y1="12" x2="8" y2="12" />
        <line x1="4" y1="16" x2="6" y2="16" />
        <line x1="16" y1="8" x2="20" y2="8" />
        <line x1="16" y1="12" x2="18" y2="12" />
        <line x1="16" y1="16" x2="20" y2="16" />
        <path d="M11 10l2 2-2 2" />
      </>
    ),
  };

  const defaultIcon = (
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {icons[id] || defaultIcon}
    </svg>
  );
}

// ── Tool Card ──────────────────────────────────────────────────────────────
function ToolCard({ tool, idx = 0, large = false }) {
  const iconSize = large ? 26 : 22;
  const containerSize = large ? 52 : 44;

  return (
    <Link
      href={tool.route || "/"}
      className="fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-[#dce6f4] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#b8d0ec] hover:shadow-[0_18px_38px_rgba(50,85,148,0.15)]"
      style={{ animationDelay: `${Math.min(idx * 25, 200)}ms`, padding: large ? "20px" : "16px" }}
    >
      {/* top accent bar */}
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl" style={{ background: tool.color, opacity: 0.85 }} />

      {tool.pro && (
        <span className="absolute right-2.5 top-2.5 rounded-full bg-gradient-to-r from-[#ffcf48] to-[#ff9d3f] px-2 py-0.5 text-[9px] font-black text-[#2d1d00] shadow-sm">
          PRO
        </span>
      )}

      <div
        className="mb-3 flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
        style={{
          width: containerSize,
          height: containerSize,
          background: hexToRgba(tool.color, 0.13),
        }}
      >
        <ToolIcon id={tool.id} color={tool.color} size={iconSize} />
      </div>

      <div className="font-bold leading-snug" style={{ fontSize: large ? 14 : 13, color: "#19304a" }}>
        {tool.label}
      </div>
      <div className="mt-1 leading-relaxed" style={{ fontSize: large ? 12 : 11, color: "#6b82a2" }}>
        {tool.hint}
      </div>
    </Link>
  );
}

// ── Category icon SVGs ─────────────────────────────────────────────────────
function CategoryIcon({ id, size = 16 }) {
  const icons = {
    all: <><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></>,
    convert: <><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    protect: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
    analyze: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[id] || icons.all}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ToolPage() {
  const [filterCat, setFilterCat] = useState("all");
  const [query, setQuery] = useState("");
  const [allExpanded, setAllExpanded] = useState(false);

  const totalTools = TOOLS.length;
  const proTools = TOOLS.filter((t) => t.pro).length;
  const freeTools = totalTools - proTools;

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0 || filterCat !== "all";

  const topTools = useMemo(
    () => TOOLS.filter((t) => TOP_TOOL_IDS.includes(t.id) && toolMatchesSearch(t, normalizedQuery)),
    [normalizedQuery]
  );

  const restTools = useMemo(() => {
    const topSet = new Set(TOP_TOOL_IDS);
    return TOOLS.filter((t) => !topSet.has(t.id) && toolMatchesSearch(t, normalizedQuery));
  }, [normalizedQuery]);

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return TOOLS.filter((t) => {
      if (filterCat !== "all" && t.cat !== filterCat) return false;
      return toolMatchesSearch(t, normalizedQuery);
    });
  }, [filterCat, normalizedQuery, isSearching]);

  const groupedRest = useMemo(() => {
    const topSet = new Set(TOP_TOOL_IDS);
    return CATEGORIES.filter((c) => c.id !== "all").map((cat) => ({
      id: cat.id,
      tools: TOOLS.filter((t) => t.cat === cat.id && !topSet.has(t.id) && toolMatchesSearch(t, normalizedQuery)),
    })).filter((g) => g.tools.length > 0);
  }, [normalizedQuery]);

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
    <div className="relative py-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="fade-up relative overflow-hidden rounded-3xl border border-[#dce6f5] bg-white shadow-[0_24px_64px_rgba(50,85,148,0.13)]">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,182,72,0.18),transparent_65%)]" />
        <div className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(61,191,165,0.12),transparent_65%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(100,149,237,0.07),transparent_70%)]" />

        <div className="relative px-5 pb-8 pt-10 sm:px-10 sm:pt-12">
          <div className="mx-auto max-w-[820px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4e1f5] bg-[#f0f6ff] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#4a6a9e" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#4a9eff] opacity-80" />
              browser-first pdf toolkit
            </span>

            <h1 className="mt-5 text-[2rem] font-black leading-[1.05] tracking-tight sm:text-[2.8rem] md:text-[3.3rem]" style={{ color: "#0d1e35" }}>
              Все PDF-инструменты<br className="hidden sm:block" /> в одном месте
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed sm:text-[15px]" style={{ color: "#5e7490" }}>
              {totalTools} инструментов для работы с PDF прямо в браузере — без установки и без отправки файлов
            </p>

            {/* Stats */}
            <div className="mx-auto mt-6 grid max-w-[500px] grid-cols-3 gap-2 rounded-2xl border border-[#dae5f4] bg-[#f7fbff] p-2">
              {[
                { val: totalTools, label: "инструментов" },
                { val: freeTools, label: "бесплатных" },
                { val: proTools, label: "PRO-функций" },
              ].map(({ val, label }) => (
                <div key={label} className="rounded-xl bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(60,90,140,0.06)]">
                  <p className="text-2xl font-black" style={{ color: "#0d1e35" }}>{val}</p>
                  <p className="text-[10px] font-medium" style={{ color: "#7a90aa" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative mt-5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9fb5cc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setAllExpanded(true); }}
                placeholder="Найти: PDF в Word, сжать PDF, OCR..."
                className="w-full rounded-2xl border border-[#cfdaee] bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[#92a8c0] focus:border-[#ffbe58] focus:shadow-[0_8px_24px_rgba(255,190,88,0.18)]"
                style={{ color: "#1e3452" }}
              />
            </div>

            {/* Category filters */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => {
                const count = cat.id === "all"
                  ? TOOLS.filter((t) => toolMatchesSearch(t, normalizedQuery)).length
                  : TOOLS.filter((t) => t.cat === cat.id && toolMatchesSearch(t, normalizedQuery)).length;
                const active = filterCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { setFilterCat(cat.id); if (cat.id !== "all") setAllExpanded(true); }}
                    className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      borderColor: active ? "#ffb648" : "#d0dcea",
                      background: active ? "#fff7e8" : "#f6fafd",
                      color: active ? "#7a4a00" : "#5e738e",
                    }}
                  >
                    <span style={{ opacity: active ? 1 : 0.6 }}>
                      <CategoryIcon id={cat.id} size={13} />
                    </span>
                    {cat.label}
                    <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: "rgba(90,120,165,0.12)", color: "#4e6a88" }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH RESULTS ─────────────────────────────────────────────── */}
      {isSearching ? (
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: "#4a6080" }}>
              Найдено: <span className="font-black" style={{ color: "#0d1e35" }}>{searchResults.length}</span> инструментов
            </p>
            <button
              type="button"
              onClick={() => { setQuery(""); setFilterCat("all"); }}
              className="rounded-lg border border-[#d0dcea] bg-white px-3 py-1 text-xs font-semibold transition-all hover:border-[#adc0d8]"
              style={{ color: "#5e738e" }}
            >
              Сбросить
            </button>
          </div>
          {searchResults.length === 0 ? (
            <div className="rounded-2xl border border-[#d5dfed] bg-white p-10 text-center" style={{ color: "#60748f" }}>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#f0f6ff" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a9ec0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="font-semibold">По запросу ничего не найдено</p>
              <p className="mt-1 text-sm">Попробуйте другое слово или сбросьте фильтр</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {searchResults.map((tool, idx) => <ToolCard key={tool.id} tool={tool} idx={idx} />)}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* ── TOP 10 ───────────────────────────────────────────────── */}
          <section className="mt-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-[0_4px_12px_rgba(255,160,60,0.3)]" style={{ background: "linear-gradient(135deg, #ffcc4f, #ff9c4d)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d1d00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-black" style={{ color: "#0d1e35" }}>Популярные инструменты</h2>
                <p className="text-xs" style={{ color: "#7a90aa" }}>Самые используемые — начни здесь</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {topTools.map((tool, idx) => <ToolCard key={tool.id} tool={tool} idx={idx} large />)}
            </div>
          </section>

          {/* ── ALL TOOLS (collapsible) ───────────────────────────────── */}
          <section className="mt-5">
            <button
              type="button"
              onClick={() => setAllExpanded((v) => !v)}
              className="group flex w-full items-center justify-between rounded-2xl border border-[#dce6f4] bg-white px-5 py-4 transition-all hover:border-[#b8d0ec] hover:shadow-[0_8px_20px_rgba(50,85,148,0.1)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce6f4]" style={{ background: "#f4f9ff", color: "#4a6a9e" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black" style={{ color: "#0d1e35" }}>
                    Все инструменты
                    <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(90,120,165,0.12)", color: "#4a6a9e" }}>
                      ещё {restTools.length}
                    </span>
                  </p>
                  <p className="text-xs" style={{ color: "#7a90aa" }}>
                    {allExpanded ? "Нажми чтобы свернуть" : "Конвертация, защита, анализ и другие"}
                  </p>
                </div>
              </div>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#dce6f4] bg-[#f4f9ff] transition-transform duration-300"
                style={{ transform: allExpanded ? "rotate(180deg)" : "rotate(0deg)", color: "#4a6a9e" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {allExpanded && (
              <div className="mt-4 space-y-7">
                {groupedRest.map(({ id, tools }) => {
                  const meta = CATEGORY_INFO[id] || { title: "Инструменты", subtitle: "" };
                  return (
                    <div key={id}>
                      <div className="mb-3 flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dce6f4]" style={{ background: "#f4f9ff", color: "#4a6a9e" }}>
                          <CategoryIcon id={id} size={15} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black" style={{ color: "#0d1e35" }}>{meta.title}</h3>
                          <p className="text-[11px]" style={{ color: "#7a90aa" }}>{meta.subtitle}</p>
                        </div>
                        <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(90,120,165,0.1)", color: "#5a7090" }}>
                          {tools.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {tools.map((tool, idx) => <ToolCard key={tool.id} tool={tool} idx={idx} />)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* ── BENEFITS ──────────────────────────────────────────────────── */}
      <section className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            svgPath: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>,
            title: "100% приватно",
            sub: "Файлы не покидают браузер",
            color: "#e8f9f0",
            border: "#c3ead6",
            iconColor: "#22c55e",
          },
          {
            svgPath: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></>,
            title: "Мгновенно",
            sub: "Без установки и ожидания",
            color: "#fff8e8",
            border: "#fde8b0",
            iconColor: "#f59e0b",
          },
          {
            svgPath: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></>,
            title: "Бесплатно",
            sub: "5 операций в день без оплаты",
            color: "#eef4ff",
            border: "#c8daf8",
            iconColor: "#3b82f6",
          },
          {
            svgPath: <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" /></>,
            title: "Везде",
            sub: "ПК, планшет, смартфон",
            color: "#fff0ee",
            border: "#fac8c0",
            iconColor: "#f43f5e",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(60,90,140,0.1)]"
            style={{ background: item.color, borderColor: item.border }}
          >
            <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.7)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {item.svgPath}
              </svg>
            </div>
            <div className="text-sm font-black" style={{ color: "#18304a" }}>{item.title}</div>
            <div className="mt-1 text-[11px] leading-relaxed" style={{ color: "#6a80a0" }}>{item.sub}</div>
          </div>
        ))}
      </section>

      {/* ── PRO CTA ───────────────────────────────────────────────────── */}
      <section
        className="relative mt-8 overflow-hidden rounded-3xl border border-[#f0d090] shadow-[0_16px_40px_rgba(255,165,60,0.18)]"
        style={{ background: "linear-gradient(135deg, #fffcf0 0%, #fff4d6 50%, #ffebba 100%)" }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,200,80,0.3),transparent_70%)]" />
        <div className="relative flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]" style={{ background: "rgba(255,182,60,0.25)", color: "#8a5800" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="none" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              PRO подписка
            </span>
            <h2 className="mt-2.5 text-lg font-black sm:text-xl" style={{ color: "#2d1d00" }}>
              Безлимитный доступ ко всем {totalTools} инструментам
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#7a5a20" }}>
              OCR, подпись, нумерация, PDF в Word/Excel — без ограничений от $2.99/мес
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black shadow-[0_8px_20px_rgba(255,160,60,0.35)] transition-all hover:brightness-105 hover:shadow-[0_12px_28px_rgba(255,160,60,0.45)]"
            style={{ background: "linear-gradient(135deg, #ffcc4f, #ff9c4d)", color: "#2d1d00" }}
          >
            Открыть PRO
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
