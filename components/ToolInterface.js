"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
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

    if (!parsed || parsed.date !== today) {
      return { date: today, count: 0 };
    }

    return parsed;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

function setUsage(count) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USAGE_KEY, JSON.stringify({ date: getTodayKey(), count }));
}


function getDefaultSettings(toolId) {
  if (["img2pdf", "jpg2pdf", "png2pdf", "scan2pdf"].includes(toolId)) return { pageSize: "fit", orientation: "auto" };
  if (toolId === "compress") return { quality: "medium" };
  if (["split", "extractpages", "deletepages", "reorder"].includes(toolId)) return { pages: "1-3" };
  if (toolId === "rotate") return { angle: "90" };
  if (["pdf2img", "pdf2jpg", "pdf2png"].includes(toolId)) {
    return { imageFormat: toolId === "pdf2png" ? "png" : "jpg", dpi: "150" };
  }
  if (toolId === "watermark") return { wmText: "CONFIDENTIAL", wmOpacity: "30" };
  if (["protect", "unlock"].includes(toolId)) return { password: "" };
  if (toolId === "ocr") return { ocrLang: "rus+eng" };
  if (toolId === "pagenum") return { position: "bottom-right", start: "1" };
  if (toolId === "sign") return { signer: "" };
  if (toolId === "compare") return { compareMode: "text" };
  if (toolId === "pdfa") return { profile: "2b" };
  return {};
}

function summarizeSettings(toolId, settings) {
  if (toolId === "compress") return `уровень: ${settings.quality}`;
  if (["split", "extractpages", "deletepages", "reorder"].includes(toolId) && settings.pages) {
    return `страницы: ${settings.pages}`;
  }
  if (toolId === "rotate") return `угол: ${settings.angle}°`;
  if (["pdf2img", "pdf2jpg", "pdf2png"].includes(toolId)) {
    return `${String(settings.imageFormat || "jpg").toUpperCase()}, ${settings.dpi} DPI`;
  }
  if (toolId === "watermark") return `водяной знак: ${settings.wmText || "текст"}`;
  if (toolId === "ocr") return `язык OCR: ${settings.ocrLang}`;
  if (toolId === "pagenum") return `позиция: ${settings.position}`;
  if (toolId === "compare") return `режим: ${settings.compareMode}`;
  if (toolId === "pdfa") return `профиль PDF/A-${settings.profile}`;
  return "";
}

export default function ToolInterface({ tool }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ pct: 0, label: "" });
  const [result, setResult] = useState(null);
  const [usage, setUsageState] = useState(() => getUsage().count);
  const [settings, setSettings] = useState(() => getDefaultSettings(tool.id));

  const { isAuthenticated, isPro, entitlements, getIdToken, refreshEntitlements, signInWithGoogle } = useAuth();

  const guestRemaining = useMemo(() => Math.max(0, FREE_OPS_PER_DAY - usage), [usage]);
  const displayRemaining = isAuthenticated
    ? isPro
      ? "∞"
      : Math.max(0, Number(entitlements.remainingToday ?? FREE_OPS_PER_DAY))
    : guestRemaining;

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleFiles = useCallback(
    (newFiles) => {
      const fileArray = Array.from(newFiles || []);
      if (!tool.multi && fileArray.length > 1) {
        fileArray.length = 1;
      }

      setFiles((prev) => {
        const combined = tool.multi ? [...prev, ...fileArray] : fileArray;
        return combined.filter((f, i, arr) => arr.findIndex((x) => x.name === f.name && x.size === f.size) === i);
      });

      setResult(null);
    },
    [tool.multi]
  );

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const runRealProcessing = async () => {
    setProcessing(true);
    setResult(null);
    setProgress({ pct: 10, label: "Подготовка..." });

    try {
      const engine = await import("../lib/pdf-engine.js");
      setProgress({ pct: 30, label: "Обработка..." });

      const id = tool.id;
      let outputBlob = null;
      let analysisResult = null;

      // Конвертация изображений в PDF
      if (["img2pdf", "jpg2pdf", "png2pdf", "scan2pdf"].includes(id)) {
        outputBlob = await engine.imagesToPdf(files, settings.pageSize || "fit", settings.orientation || "auto");
      }
      // Объединить PDF
      else if (id === "merge") {
        outputBlob = await engine.mergePdfs(files);
      }
      // Разделить / Извлечь
      else if (id === "split" || id === "extractpages") {
        outputBlob = await engine.splitPdf(files[0], settings.pages);
      }
      // Удалить страницы
      else if (id === "deletepages") {
        outputBlob = await engine.deletePages(files[0], settings.pages);
      }
      // Сортировать страницы
      else if (id === "reorder") {
        outputBlob = await engine.reorderPages(files[0], settings.pages);
      }
      // Повернуть
      else if (id === "rotate") {
        outputBlob = await engine.rotatePdf(files[0], settings.angle);
      }
      // Водяной знак
      else if (id === "watermark") {
        outputBlob = await engine.watermarkPdf(files[0], settings.wmText || "CONFIDENTIAL", settings.wmOpacity || 30);
      }
      // Защита (заглушка без шифрования)
      else if (id === "protect") {
        const res = await engine.protectPdf(files[0], settings.password);
        outputBlob = res.blob;
      }
      // Снять защиту
      else if (id === "unlock") {
        outputBlob = await engine.unlockPdf(files[0]);
      }
      // Нумерация страниц
      else if (id === "pagenum") {
        outputBlob = await engine.addPageNumbers(files[0], settings.position, settings.start);
      }
      // Сжатие
      else if (id === "compress") {
        outputBlob = await engine.compressPdf(files[0], settings.quality);
      }
      // Анализ PDF
      else if (id === "info") {
        analysisResult = await engine.analyzePdf(files[0]);
      }

      setProgress({ pct: 90, label: "Сохранение..." });
      await new Promise((r) => setTimeout(r, 200));
      setProgress({ pct: 100, label: "Готово!" });
      await new Promise((r) => setTimeout(r, 150));

      return { ok: true, outputBlob, analysisResult };
    } catch (err) {
      return { ok: false, error: err?.message || "Ошибка обработки файла." };
    } finally {
      setProcessing(false);
      setProgress({ pct: 0, label: "" });
    }
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

  const downloadBlob = useCallback(
    (blob, fileName) => {
      try {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = fileName;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
      } catch {
        setResult({
          icon: "⚠️",
          title: "Ошибка скачивания",
          info: "Не удалось скачать файл. Попробуйте ещё раз.",
        });
      }
    },
    []
  );

  const buildSuccessResult = useCallback(
    (processed, settingsLine, remaining, isGuest = false) => {
      // Анализ PDF — показываем метаданные
      if (processed.analysisResult) {
        const a = processed.analysisResult;
        return {
          icon: "✅",
          title: "Анализ завершён",
          info: [
            `Страниц: ${a.pageCount}`,
            `Размер: ${a.fileSize}`,
            `Заголовок: ${a.title}`,
            `Автор: ${a.author}`,
            `Создан: ${a.creationDate}`,
          ].join(" · "),
        };
      }

      // Обычный вывод с файлом
      if (processed.outputBlob) {
        const srcName = files[0]?.name || "result";
        // Принудительно ставим правильное расширение по типу blob
        const mime = processed.outputBlob.type || "application/pdf";
        const forcedExt = mime.includes("pdf") ? ".pdf" : mime.includes("png") ? ".png" : mime.includes("jpeg") ? ".jpg" : ".pdf";
        const baseName = (srcName.replace(/\.[^.]+$/, "") || "result");
        const outName = `${baseName}-${tool.id}${forcedExt}`;
        const info = settingsLine
          ? `Готово. Настройки: ${settingsLine}.${isGuest ? ` Осталось ${remaining} операций сегодня.` : ""}`
          : `Файл обработан успешно.${isGuest ? ` Осталось ${remaining} операций сегодня.` : ""}`;
        return {
          icon: "✅",
          title: "Готово!",
          info,
          downloads: [{ label: `Скачать ${outName}`, action: () => downloadBlob(processed.outputBlob, outName) }],
        };
      }

      // Инструмент без вывода (заглушка)
      return {
        icon: "✅",
        title: "Готово!",
        info: settingsLine
          ? `Обработано. Настройки: ${settingsLine}.`
          : "Обработка завершена.",
      };
    },
    [files, tool.id, downloadBlob]
  );

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
          title: "PRO-инструмент",
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
          info: "Дневной лимит достигнут. Оформите PRO для безлимита.",
          action: "pricing",
        });
        return;
      }

      const processed = await runRealProcessing();
      await refreshEntitlements();

      if (!processed.ok) {
        setResult({ icon: "⚠️", title: "Ошибка", info: processed.error });
        return;
      }

      const settingsLine = summarizeSettings(tool.id, settings);
      setResult(buildSuccessResult(processed, settingsLine, quota.data.remainingToday));
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

    const processed = await runRealProcessing();
    if (!processed.ok) {
      setResult({ icon: "⚠️", title: "Ошибка", info: processed.error });
      return;
    }

    const settingsLine = summarizeSettings(tool.id, settings);
    setResult(buildSuccessResult(processed, settingsLine, guestQuota.remaining ?? guestRemaining, true));
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

  const renderSettings = () => {
    if (["img2pdf", "jpg2pdf", "png2pdf", "scan2pdf"].includes(tool.id)) {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs text-[#7889a0]">Размер страницы</div>
            <select
              value={settings.pageSize || "fit"}
              onChange={(e) => handleSettingChange("pageSize", e.target.value)}
              className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
            >
              <option value="fit">По размеру изображения</option>
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
          <div>
            <div className="mb-1 text-xs text-[#7889a0]">Ориентация</div>
            <select
              value={settings.orientation || "auto"}
              onChange={(e) => handleSettingChange("orientation", e.target.value)}
              className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
            >
              <option value="auto">Авто</option>
              <option value="portrait">Портрет</option>
              <option value="landscape">Альбомная</option>
            </select>
          </div>
        </div>
      );
    }

    if (tool.id === "compress") {
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { id: "low", label: "Низкое" },
            { id: "medium", label: "Среднее" },
            { id: "high", label: "Сильное" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSettingChange("quality", item.id)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                settings.quality === item.id
                  ? "border-[#ffb648] bg-[#fff7e8] text-[#8b5500]"
                  : "border-[#d5dfed] bg-white text-[#55708f]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      );
    }

    if (["split", "extractpages", "deletepages", "reorder"].includes(tool.id)) {
      return (
        <input
          value={settings.pages || ""}
          onChange={(e) => handleSettingChange("pages", e.target.value)}
          placeholder="Например: 1-3,5,8"
          className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
        />
      );
    }

    if (tool.id === "rotate") {
      return (
        <select
          value={settings.angle || "90"}
          onChange={(e) => handleSettingChange("angle", e.target.value)}
          className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
        >
          <option value="90">90°</option>
          <option value="180">180°</option>
          <option value="270">270°</option>
        </select>
      );
    }

    if (["pdf2img", "pdf2jpg", "pdf2png"].includes(tool.id)) {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={settings.imageFormat || "jpg"}
            onChange={(e) => handleSettingChange("imageFormat", e.target.value)}
            className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
          </select>
          <select
            value={settings.dpi || "150"}
            onChange={(e) => handleSettingChange("dpi", e.target.value)}
            className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
          >
            <option value="96">96 DPI</option>
            <option value="150">150 DPI</option>
            <option value="300">300 DPI</option>
          </select>
        </div>
      );
    }

    if (["protect", "unlock"].includes(tool.id)) {
      return (
        <input
          type="password"
          value={settings.password || ""}
          onChange={(e) => handleSettingChange("password", e.target.value)}
          placeholder="Введите пароль"
          className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
        />
      );
    }

    if (tool.id === "watermark") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={settings.wmText || ""}
            onChange={(e) => handleSettingChange("wmText", e.target.value)}
            placeholder="Текст водяного знака"
            className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
          />
          <input
            type="number"
            min="10"
            max="90"
            value={settings.wmOpacity || "30"}
            onChange={(e) => handleSettingChange("wmOpacity", e.target.value)}
            className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
          />
        </div>
      );
    }

    if (tool.id === "ocr") {
      return (
        <select
          value={settings.ocrLang || "rus+eng"}
          onChange={(e) => handleSettingChange("ocrLang", e.target.value)}
          className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
        >
          <option value="rus">Русский</option>
          <option value="eng">English</option>
          <option value="rus+eng">Русский + English</option>
        </select>
      );
    }

    if (tool.id === "pagenum") {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={settings.position || "bottom-right"}
            onChange={(e) => handleSettingChange("position", e.target.value)}
            className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
          >
            <option value="bottom-right">Внизу справа</option>
            <option value="bottom-center">Внизу по центру</option>
            <option value="top-right">Сверху справа</option>
          </select>
          <input
            type="number"
            min="1"
            value={settings.start || "1"}
            onChange={(e) => handleSettingChange("start", e.target.value)}
            className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
          />
        </div>
      );
    }

    if (tool.id === "sign") {
      return (
        <input
          value={settings.signer || ""}
          onChange={(e) => handleSettingChange("signer", e.target.value)}
          placeholder="Имя подписанта"
          className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
        />
      );
    }

    if (tool.id === "compare") {
      return (
        <select
          value={settings.compareMode || "text"}
          onChange={(e) => handleSettingChange("compareMode", e.target.value)}
          className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
        >
          <option value="text">Текст</option>
          <option value="layout">Верстка</option>
          <option value="all">Текст + верстка</option>
        </select>
      );
    }

    if (tool.id === "pdfa") {
      return (
        <select
          value={settings.profile || "2b"}
          onChange={(e) => handleSettingChange("profile", e.target.value)}
          className="w-full rounded-lg border border-[#d5dfed] bg-white px-3 py-2 text-sm text-[#233a57] outline-none focus:border-[#ffb648]"
        >
          <option value="1b">PDF/A-1b</option>
          <option value="2b">PDF/A-2b</option>
          <option value="3b">PDF/A-3b</option>
        </select>
      );
    }

    return <div className="text-sm text-[#61748f]">Опции для {tool.label} будут добавлены в следующем этапе.</div>;
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8 text-center">
        <div className="mb-3 text-4xl">{tool.emoji}</div>
        <h1 className="mb-2 text-2xl font-black text-[#1d3150]">{tool.label}</h1>
        <p className="text-[#5f738e]">{tool.description}</p>
        <div className="mt-3 font-mono text-xs text-[#667b96]">
          {isPro ? "PRO: безлимитный доступ" : `FREE: осталось ${displayRemaining}/${FREE_OPS_PER_DAY} операций сегодня`}
        </div>
        {tool.pro ? (
          <div className="mt-2 inline-flex rounded-full bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] px-3 py-1 text-xs font-black text-[#2d1d00]">
            PRO
          </div>
        ) : null}
      </div>

      <DropZone onFiles={handleFiles} accept={tool.accept} multi={tool.multi} />

      {tool.pro && !isPro ? (
        <div className="mt-4 rounded-lg border border-[#ffd69c] bg-[#fff8ec] p-4 text-sm text-[#6f5727]">
          {isAuthenticated
            ? "Это PRO-функция. Оформите подписку, чтобы продолжить."
            : "Для PRO-функций требуется вход через Google и подписка."}{" "}
          <Link href="/pricing" className="font-semibold text-[#b56d00]">
            Перейти к тарифам
          </Link>
          .
        </div>
      ) : null}

      {files.length > 0 ? (
        <div className="mt-6">
          <div className="mb-3 font-mono text-xs text-[#6d819c]">ФАЙЛЫ ({files.length})</div>
          <div className="space-y-2">
            {files.map((file, i) => (
              <div
                key={`${file.name}-${file.size}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-[#d5dfed] bg-[linear-gradient(180deg,#ffffff,#f7fbff)] p-3 shadow-[0_8px_18px_rgba(76,107,153,0.08)]"
              >
                <div className="rounded border border-[#f4d8a7] bg-[#fff6e6] px-2 py-1 font-mono text-xs text-[#9a6200]">
                  {file.name.split(".").pop()?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[#20344f]">{file.name}</div>
                  <div className="font-mono text-xs text-[#7387a1]">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="flex h-6 w-6 items-center justify-center rounded border border-[#d2dced] bg-[#f4f8ff] text-[#72859e] transition-colors hover:border-[#afc0d8] hover:text-[#2f4668]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {files.length > 0 ? (
        <div className="mt-6 rounded-xl border border-[#d5dfed] bg-[linear-gradient(180deg,#ffffff,#f7fbff)] p-4 shadow-[0_10px_24px_rgba(76,107,153,0.1)]">
          <div className="mb-3 font-mono text-xs text-[#6d819c]">НАСТРОЙКИ</div>
          {renderSettings()}
        </div>
      ) : null}

      {files.length > 0 && !processing && !result ? (
        <button
          type="button"
          onClick={convert}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] py-3 font-black text-[#2d1d00] shadow-[0_10px_24px_rgba(255,170,78,0.26)] transition-all hover:brightness-105"
        >
          ⚡ ОБРАБОТАТЬ
        </button>
      ) : null}

      {processing ? (
        <div className="mt-6 rounded-xl border border-[#d5dfed] bg-[linear-gradient(180deg,#ffffff,#f7fbff)] p-4">
          <div className="mb-3 h-2 overflow-hidden rounded-lg border border-[#d4e0f0] bg-[#eef4ff]">
            <div
              className="h-full bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] transition-all duration-300"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs text-[#6d819c]">
            <span>{progress.label}</span>
            <span className="font-semibold text-[#b56d00]">{progress.pct}%</span>
          </div>
        </div>
      ) : null}

      {result && !processing ? (
        <div className="mt-6 rounded-xl border border-[#d5dfed] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-6 shadow-[0_12px_30px_rgba(77,107,154,0.12)]">
          <div className="mb-4 text-center">
            <div className="mb-2 text-3xl">{result.icon}</div>
            <div className="mb-1 text-lg font-black text-[#213650]">{result.title}</div>
            <div className="text-sm text-[#62758f]">{result.info}</div>
          </div>

          {result.downloads?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {result.downloads.map((download, i) => (
                <button
                  key={`${download.label}-${i}`}
                  type="button"
                  onClick={download.action}
                  className={`w-full rounded-lg py-2 font-semibold transition-all ${
                    download.sec
                      ? "border border-[#ced8ea] bg-[#f3f7ff] text-[#2b4366] hover:border-[#b0c0d8]"
                      : "bg-[#00c7a0] text-[#052e27] hover:brightness-105"
                  }`}
                >
                  {download.label}
                </button>
              ))}
            </div>
          ) : null}

          {result.action === "signin" ? (
            <button
              type="button"
              onClick={handleSignIn}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#67b7ff] to-[#5be7c8] py-2 font-bold text-[#082b32]"
            >
              Войти через Google
            </button>
          ) : null}

          {result.action === "pricing" ? (
            <Link
              href="/pricing"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] py-2 font-bold text-[#2d1d00]"
            >
              Открыть PRO
            </Link>
          ) : null}

          {!result.action ? (
            <button
              type="button"
              onClick={reset}
              className="mt-4 w-full rounded-lg border border-[#d0dbeb] bg-[#f1f6ff] py-2 text-[#5f738f] transition-colors hover:text-[#2b4366]"
            >
              ↩ Новая операция
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
