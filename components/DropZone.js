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
          ? "border-[#ffdc50] bg-[rgba(255,220,80,0.08)]"
          : "border-[#2b3240] bg-[#0b0f15]"
      }`}
    >
      <div className="text-3xl mb-2">{dragOver ? "✨" : "📂"}</div>
      <div className="font-bold mb-1 text-[#f3edde]">{dragOver ? "Отпусти файл" : "Перетащи или выбери файл"}</div>
      <div className="text-xs text-[#98a1af] font-mono mb-4">
        {accept === ".pdf" ? "PDF" : accept === ".pdf,image/*" ? "PDF, PNG, JPG" : "PNG, JPG, WebP"}
        {multi ? " · Несколько файлов" : " · 1 файл"}
      </div>
      <label className="inline-block bg-[#ffdc50] text-[#070809] px-5 py-2 rounded-lg text-sm font-bold cursor-pointer hover:brightness-110 transition-all">
        Выбрать файл
        <input type="file" className="hidden" accept={accept} multiple={multi} onChange={onFileSelect} />
      </label>
    </div>
  );
}