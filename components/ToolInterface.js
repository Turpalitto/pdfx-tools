"use client";

import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import DropZone from "./DropZone";
import { FREE_OPS_PER_DAY } from "../lib/tools-config";

const USAGE_KEY = "pdfx_free_usage";

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function getUsage() {
  if (typeof window === "undefined") return { date: getTodayKey(), count: 0 };
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const today = getTodayKey();
    if (!parsed || parsed.date !== today) return { date: today, count: 0 };
    return parsed;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

function setUsage(count) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USAGE_KEY, JSON.stringify({ date: getTodayKey(), count }));
}

export default function ToolInterface({ tool }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ pct: 0, label: "" });
  const [result, setResult] = useState(null);
  const [usage, setUsageState] = useState(() => getUsage().count);

  const remaining = useMemo(() => Math.max(0, FREE_OPS_PER_DAY - usage), [usage]);

  const handleFiles = useCallback(
    (newFiles) => {
      const fileArray = Array.from(newFiles);
      if (!tool.multi && fileArray.length > 1) {
        fileArray.length = 1;
      }

      setFiles((prev) => {
        const combined = tool.multi ? [...prev, ...fileArray] : fileArray;
        return combined.filter((f, i, a) => a.findIndex((x) => x.name === f.name && x.size === f.size) === i);
      });

      setResult(null);
    },
    [tool]
  );

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const convert = async () => {
    if (!files.length) return;

    if (tool.pro) {
      setResult({
        icon: "🔒",
        title: "PRO инструмент",
        info: "Этот инструмент доступен только в подписке PDF X PRO.",
        downloads: [],
      });
      return;
    }

    const currentUsage = getUsage().count;
    if (currentUsage >= FREE_OPS_PER_DAY) {
      setResult({
        icon: "⚠️",
        title: "Лимит исчерпан",
        info: `Доступно ${FREE_OPS_PER_DAY} бесплатных операций в день. Оформите PRO для безлимита.`,
        downloads: [],
      });
      return;
    }

    setProcessing(true);
    setProgress({ pct: 0, label: "Подготовка..." });
    setResult(null);

    try {
      for (let i = 0; i <= 100; i += 10) {
        setProgress({ pct: i, label: `Обработка... ${i}%` });
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const nextUsage = currentUsage + 1;
      setUsage(nextUsage);
      setUsageState(nextUsage);

      setResult({
        icon: "✅",
        title: "Готово!",
        info: `${files.length} файлов обработано. Осталось ${Math.max(0, FREE_OPS_PER_DAY - nextUsage)} операций сегодня.`,
        downloads: files.map((f) => ({
          label: `Скачать ${f.name}`,
          action: () => console.log("Download:", f.name),
        })),
      });
    } catch (error) {
      console.error("Error:", error);
      setResult({
        icon: "❌",
        title: "Ошибка",
        info: error.message,
        downloads: [],
      });
    } finally {
      setProcessing(false);
      setProgress({ pct: 0, label: "" });
    }
  };

  const reset = () => {
    setResult(null);
    setProgress({ pct: 0, label: "" });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{tool.emoji}</div>
        <h1 className="text-2xl font-black mb-2 text-[#f3edde]">{tool.label}</h1>
        <p className="text-[#a0a8b4]">{tool.description}</p>
        <div className="mt-3 text-xs text-[#96a0af] font-mono">FREE: осталось {remaining}/{FREE_OPS_PER_DAY} операций сегодня</div>
        {tool.pro && (
          <div className="inline-flex bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] text-xs font-black px-3 py-1 rounded-full mt-2">
            PRO
          </div>
        )}
      </div>

      <DropZone onFiles={handleFiles} accept={tool.accept} multi={tool.multi} />

      {tool.pro && (
        <div className="mt-4 bg-[#121722] border border-[#2c3543] rounded-lg p-4 text-sm text-[#b6beca]">
          Это PRO-функция. <Link href="/pricing" className="text-[#ffdc50] font-semibold">Перейти к тарифам</Link>.
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-mono text-[#8e97a6] mb-3">ФАЙЛЫ ({files.length})</div>
          <div className="space-y-2">
            {files.map((file, i) => (
              <div key={i} className="bg-[#0c1016] border border-[#232a36] rounded-lg p-3 flex items-center gap-3">
                <div className="text-xs font-mono bg-[rgba(255,220,80,0.12)] text-[#ffdc50] px-2 py-1 rounded border border-[rgba(255,220,80,0.2)]">
                  {file.name.split(".").pop().toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{file.name}</div>
                  <div className="text-xs text-[#8e97a6] font-mono">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="w-6 h-6 bg-[#171b22] border border-[#2b3240] text-[#7e8898] rounded flex items-center justify-center hover:border-[#3f4b5f] hover:text-[#c0c8d4] transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 bg-[#0c1016] border border-[#232a36] rounded-xl p-4">
          <div className="text-xs font-mono text-[#8e97a6] mb-3">НАСТРОЙКИ</div>
          <div className="text-sm text-[#9fa8b5]">Опции для {tool.label} будут добавлены...</div>
        </div>
      )}

      {files.length > 0 && !processing && !result && (
        <button
          onClick={convert}
          className="w-full mt-6 bg-[#ffdc50] text-[#070809] font-black py-3 rounded-xl hover:brightness-110 transition-all"
        >
          ⚡ ОБРАБОТАТЬ
        </button>
      )}

      {processing && (
        <div className="mt-6 bg-[#0c1016] border border-[#232a36] rounded-xl p-4">
          <div className="bg-[#121822] border border-[#232a36] rounded-lg h-2 overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] transition-all duration-300"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#8e97a6] font-mono">
            <span>{progress.label}</span>
            <span className="text-[#ffdc50] font-semibold">{progress.pct}%</span>
          </div>
        </div>
      )}

      {result && !processing && (
        <div className="mt-6 bg-[#0c1016] border border-[#1f2f26] rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">{result.icon}</div>
            <div className="text-lg font-black mb-1">{result.title}</div>
            <div className="text-sm text-[#a0a8b4]">{result.info}</div>
          </div>

          {result.downloads?.length > 0 && (
            <div className="flex flex-col gap-2">
              {result.downloads.map((download, i) => (
                <button
                  key={i}
                  onClick={download.action}
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    download.sec
                      ? "bg-[#0f0f0f] text-[#e8e3db] border border-[#1a1a1a] hover:border-[#2a2a2a]"
                      : "bg-[#00d68f] text-[#070809] hover:brightness-110"
                  }`}
                >
                  {download.label}
                </button>
              ))}
            </div>
          )}

          {tool.pro || result.title === "Лимит исчерпан" ? (
            <Link
              href="/pricing"
              className="w-full mt-4 inline-flex items-center justify-center bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] py-2 rounded-lg font-bold"
            >
              Открыть PRO
            </Link>
          ) : (
            <button
              onClick={reset}
              className="w-full mt-4 bg-[#0f0f0f] text-[#97a0ad] py-2 rounded-lg hover:text-[#e8e3db] transition-colors"
            >
              ↩ Новая операция
            </button>
          )}
        </div>
      )}
    </div>
  );
}