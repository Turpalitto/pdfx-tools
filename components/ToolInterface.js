"use client";

import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import DropZone from "./DropZone";
import { FREE_OPS_PER_DAY } from "../lib/tools-config";
import { useAuth } from "@/hooks/useAuth";

const USAGE_KEY = "pdfx_free_usage";
const AUTH_REQUIRED_FOR_PRO = process.env.NEXT_PUBLIC_AUTH_REQUIRED_FOR_PRO !== "false";
const HARD_GATING = process.env.NEXT_PUBLIC_HARD_GATING !== "false";

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

function buildDownloadName(fileName, toolId) {
  const dotIdx = fileName.lastIndexOf(".");
  if (dotIdx <= 0) return `${fileName}-${toolId}`;
  const base = fileName.slice(0, dotIdx);
  const ext = fileName.slice(dotIdx);
  return `${base}-${toolId}${ext}`;
}

export default function ToolInterface({ tool }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ pct: 0, label: "" });
  const [result, setResult] = useState(null);
  const [usage, setUsageState] = useState(() => getUsage().count);

  const { isAuthenticated, isPro, entitlements, getIdToken, refreshEntitlements, signInWithGoogle } = useAuth();

  const guestRemaining = useMemo(() => Math.max(0, FREE_OPS_PER_DAY - usage), [usage]);
  const displayRemaining = isAuthenticated
    ? isPro
      ? "∞"
      : Math.max(0, Number(entitlements.remainingToday ?? FREE_OPS_PER_DAY))
    : guestRemaining;

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

  const runMockProcessing = async () => {
    setProcessing(true);
    setProgress({ pct: 0, label: "Подготовка..." });
    setResult(null);

    for (let i = 0; i <= 100; i += 10) {
      setProgress({ pct: i, label: `Обработка... ${i}%` });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setProcessing(false);
    setProgress({ pct: 0, label: "" });
  };

  const consumeServerQuota = async () => {
    const token = await getIdToken();
    if (!token) {
      return {
        ok: false,
        error: "Не удалось получить токен авторизации. Выполните вход заново.",
      };
    }

    const res = await fetch("/api/usage/consume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toolId: tool.id }),
    });
    const data = await res.json();

    if (!res.ok || data?.error) {
      return {
        ok: false,
        error: data?.error?.message || "Функция временно недоступна. Попробуйте позже.",
      };
    }

    return { ok: true, data };
  };

  const consumeGuestQuota = () => {
    const currentUsage = getUsage().count;
    if (currentUsage >= FREE_OPS_PER_DAY) {
      return { ok: false, reason: "limit_exceeded", remaining: 0 };
    }

    const nextUsage = currentUsage + 1;
    setUsage(nextUsage);
    setUsageState(nextUsage);

    return {
      ok: true,
      remaining: Math.max(0, FREE_OPS_PER_DAY - nextUsage),
    };
  };

  const convert = async () => {
    if (!files.length) return;

    if (tool.pro) {
      if (!isAuthenticated && AUTH_REQUIRED_FOR_PRO && HARD_GATING) {
        setResult({
          icon: "🔐",
          title: "Требуется вход",
          info: "Для PRO-инструментов нужно войти через Google и оформить подписку.",
          action: "signin",
        });
        return;
      }

      if (!isPro && HARD_GATING) {
        setResult({
          icon: "🔒",
          title: "PRO инструмент",
          info: "Этот инструмент доступен только в подписке PDF X PRO.",
          action: "pricing",
        });
        return;
      }
    }

    if (isAuthenticated) {
      const quota = await consumeServerQuota();
      if (!quota.ok) {
        setResult({
          icon: "⚠️",
          title: "Функция недоступна",
          info: quota.error,
          action: isPro ? undefined : "pricing",
        });
        return;
      }

      if (!quota.data.allowed) {
        setResult({
          icon: "⚠️",
          title: "Лимит исчерпан",
          info: `Дневной лимит достигнут. Оформите PRO для безлимита.`,
          action: "pricing",
        });
        return;
      }

      await runMockProcessing();
      await refreshEntitlements();

      setResult({
        icon: "✅",
        title: "Готово!",
        info: `${files.length} файлов обработано.`,
        remainingToday: quota.data.remainingToday,
        downloads: files.map((f) => ({
          label: `Скачать ${f.name}`,
          action: () => downloadMockFile(f),
        })),
      });
      return;
    }

    const guestQuota = consumeGuestQuota();
    if (!guestQuota.ok && HARD_GATING) {
      setResult({
        icon: "⚠️",
        title: "Лимит исчерпан",
        info: `Доступно ${FREE_OPS_PER_DAY} бесплатных операций в день. Оформите PRO для безлимита.`,
        action: "pricing",
      });
      return;
    }

    await runMockProcessing();

    setResult({
      icon: "✅",
      title: "Готово!",
      info: `${files.length} файлов обработано. Осталось ${guestQuota.remaining ?? guestRemaining} операций сегодня.`,
      downloads: files.map((f) => ({
        label: `Скачать ${f.name}`,
        action: () => downloadMockFile(f),
      })),
    });
  };

  const reset = () => {
    setResult(null);
    setProgress({ pct: 0, label: "" });
  };

  const handleSignIn = async () => {
    const authResult = await signInWithGoogle();
    if (!authResult.ok) {
      setResult({
        icon: "⚠️",
        title: "Не удалось войти",
        info: authResult.error || "Ошибка авторизации через Google.",
      });
      return;
    }
    setResult(null);
  };

  const downloadMockFile = useCallback(
    (file) => {
      const objectUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = buildDownloadName(file.name, tool.id || "processed");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    },
    [tool.id]
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{tool.emoji}</div>
        <h1 className="text-2xl font-black mb-2 text-[#1d3150]">{tool.label}</h1>
        <p className="text-[#5f738e]">{tool.description}</p>
        <div className="mt-3 text-xs text-[#667b96] font-mono">
          {isPro ? "PRO: безлимитный доступ" : `FREE: осталось ${displayRemaining}/${FREE_OPS_PER_DAY} операций сегодня`}
        </div>
        {tool.pro && (
          <div className="inline-flex bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] text-[#2d1d00] text-xs font-black px-3 py-1 rounded-full mt-2">
            PRO
          </div>
        )}
      </div>

      <DropZone onFiles={handleFiles} accept={tool.accept} multi={tool.multi} />

      {tool.pro && !isPro && (
        <div className="mt-4 bg-[#fff8ec] border border-[#ffd69c] rounded-lg p-4 text-sm text-[#6f5727]">
          {isAuthenticated
            ? "Это PRO-функция. Оформите подписку, чтобы продолжить."
            : "Для PRO-функций требуется вход через Google и подписка."}{" "}
          <Link href="/pricing" className="text-[#b56d00] font-semibold">
            Перейти к тарифам
          </Link>
          .
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-mono text-[#6d819c] mb-3">ФАЙЛЫ ({files.length})</div>
          <div className="space-y-2">
            {files.map((file, i) => (
              <div key={i} className="bg-[linear-gradient(180deg,#ffffff,#f7fbff)] border border-[#d5dfed] rounded-lg p-3 flex items-center gap-3 shadow-[0_8px_18px_rgba(76,107,153,0.08)]">
                <div className="text-xs font-mono bg-[#fff6e6] text-[#9a6200] px-2 py-1 rounded border border-[#f4d8a7]">
                  {file.name.split(".").pop().toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#20344f] truncate">{file.name}</div>
                  <div className="text-xs text-[#7387a1] font-mono">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="w-6 h-6 bg-[#f4f8ff] border border-[#d2dced] text-[#72859e] rounded flex items-center justify-center hover:border-[#afc0d8] hover:text-[#2f4668] transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 bg-[linear-gradient(180deg,#ffffff,#f7fbff)] border border-[#d5dfed] rounded-xl p-4 shadow-[0_10px_24px_rgba(76,107,153,0.1)]">
          <div className="text-xs font-mono text-[#6d819c] mb-3">НАСТРОЙКИ</div>
          <div className="text-sm text-[#61748f]">Опции для {tool.label} будут добавлены...</div>
        </div>
      )}

      {files.length > 0 && !processing && !result && (
        <button
          onClick={convert}
          className="w-full mt-6 bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] text-[#2d1d00] font-black py-3 rounded-xl hover:brightness-105 transition-all shadow-[0_10px_24px_rgba(255,170,78,0.26)]"
        >
          ⚡ ОБРАБОТАТЬ
        </button>
      )}

      {processing && (
        <div className="mt-6 bg-[linear-gradient(180deg,#ffffff,#f7fbff)] border border-[#d5dfed] rounded-xl p-4">
          <div className="bg-[#eef4ff] border border-[#d4e0f0] rounded-lg h-2 overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] transition-all duration-300"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#6d819c] font-mono">
            <span>{progress.label}</span>
            <span className="text-[#b56d00] font-semibold">{progress.pct}%</span>
          </div>
        </div>
      )}

      {result && !processing && (
        <div className="mt-6 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] border border-[#d5dfed] rounded-xl p-6 shadow-[0_12px_30px_rgba(77,107,154,0.12)]">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">{result.icon}</div>
            <div className="text-lg font-black text-[#213650] mb-1">{result.title}</div>
            <div className="text-sm text-[#62758f]">{result.info}</div>
          </div>

          {result.downloads?.length > 0 && (
            <div className="flex flex-col gap-2">
              {result.downloads.map((download, i) => (
                <button
                  key={i}
                  onClick={download.action}
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    download.sec
                      ? "bg-[#f3f7ff] text-[#2b4366] border border-[#ced8ea] hover:border-[#b0c0d8]"
                      : "bg-[#00c7a0] text-[#052e27] hover:brightness-105"
                  }`}
                >
                  {download.label}
                </button>
              ))}
            </div>
          )}

          {result.action === "signin" ? (
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full mt-4 inline-flex items-center justify-center bg-gradient-to-r from-[#67b7ff] to-[#5be7c8] text-[#082b32] py-2 rounded-lg font-bold"
            >
              Войти через Google
            </button>
          ) : result.action === "pricing" ? (
            <Link
              href="/pricing"
              className="w-full mt-4 inline-flex items-center justify-center bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] text-[#2d1d00] py-2 rounded-lg font-bold"
            >
              Открыть PRO
            </Link>
          ) : (
            <button
              onClick={reset}
              className="w-full mt-4 bg-[#f1f6ff] border border-[#d0dbeb] text-[#5f738f] py-2 rounded-lg hover:text-[#2b4366] transition-colors"
            >
              ↩ Новая операция
            </button>
          )}
        </div>
      )}
    </div>
  );
}
