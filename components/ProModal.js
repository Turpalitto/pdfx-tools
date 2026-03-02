"use client";

export default function ProModal({ onClose, onPurchase }) {
  const features = [
    { emoji: "♾️", text: "Безлимитные операции" },
    { emoji: "👁️", text: "OCR — распознавание текста" },
    { emoji: "✍️", text: "Подпись документов" },
    { emoji: "🔢", text: "Нумерация страниц" },
    { emoji: "🚫", text: "Без рекламы" },
    { emoji: "⚡", text: "Приоритетная обработка" },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.85)] backdrop-blur-xl flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-[#0d0d0d] to-[#121218] border border-[#2a2a2a] rounded-2xl p-8 max-w-sm w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffdc50] via-[#ff8c42] to-[#e879f9]" />
        
        <div className="text-center mb-6">
          <div className="inline-flex bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] text-xs font-black px-3 py-1 rounded-full mb-3">
            PRO
          </div>
          <h2 className="text-2xl font-black mb-1">Разблокируй всё</h2>
          <p className="text-sm text-[#555]">Полный доступ ко всем инструментам</p>
        </div>

        <div className="space-y-2 mb-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 bg-[#111] rounded-lg border border-[#1a1a1a]"
            >
              <span>{f.emoji}</span>
              <span className="text-sm font-semibold">{f.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onPurchase}
          className="w-full bg-gradient-to-r from-[#ffdc50] to-[#ff8c42] text-[#070809] font-black py-3 rounded-xl mb-2 hover:brightness-110 transition-all"
        >
          Подписаться · $2.99/мес
        </button>
        
        <button
          onClick={onClose}
          className="w-full text-[#444] text-sm py-2 hover:text-[#888] transition-colors"
        >
          Может быть позже
        </button>
      </div>
    </div>
  );
}
