"use client";

import { useState, useCallback } from "react";

export default function DropZone({ onFiles, accept, multi = false }) {
  const [dragOver, setDragOver] = useState(false);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      onFiles?.(e.dataTransfer.files);
    },
    [onFiles]
  );

  const onFileSelect = useCallback(
    (e) => {
      onFiles?.(e.target.files);
    },
    [onFiles]
  );

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
        dragOver
          ? "border-[#ffcc5a] bg-[rgba(255,198,88,0.18)]"
          : "border-[#d0dced] bg-[linear-gradient(180deg,#ffffff,#f7fbff)]"
      }`}
    >
      <div className="text-3xl mb-2">{dragOver ? "✨" : "📂"}</div>
      <div className="font-bold mb-1 text-[#1e3452]">{dragOver ? "Отпусти файл" : "Перетащи или выбери файл"}</div>
      <div className="text-xs text-[#677c96] font-mono mb-4">
        {accept === ".pdf" ? "PDF" : accept === ".pdf,image/*" ? "PDF, PNG, JPG" : "PNG, JPG, WebP"}
        {multi ? " · Несколько файлов" : " · 1 файл"}
      </div>
      <label className="inline-block bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] text-[#2b1d00] px-5 py-2 rounded-lg text-sm font-bold cursor-pointer hover:brightness-105 transition-all shadow-[0_8px_20px_rgba(255,169,73,0.24)]">
        Выбрать файл
        <input type="file" className="hidden" accept={accept} multiple={multi} onChange={onFileSelect} />
      </label>
    </div>
  );
}
