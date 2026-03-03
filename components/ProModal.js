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
      className="fixed inset-0 z-[9999] bg-[rgba(66,95,140,0.26)] backdrop-blur-md flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-[#ffffff] to-[#f6faff] border border-[#d5dfed] rounded-2xl p-8 max-w-sm w-full relative overflow-hidden shadow-[0_24px_48px_rgba(64,93,136,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffcc4f] via-[#ff9c4d] to-[#5bb6ff]" />
        
        <div className="text-center mb-6">
          <div className="inline-flex bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] text-[#2d1d00] text-xs font-black px-3 py-1 rounded-full mb-3">
            PRO
          </div>
          <h2 className="text-2xl font-black text-[#20344f] mb-1">Разблокируй всё</h2>
          <p className="text-sm text-[#667a95]">Полный доступ ко всем инструментам</p>
        </div>

        <div className="space-y-2 mb-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 bg-[#f8fbff] rounded-lg border border-[#d6e0ee]"
            >
              <span>{f.emoji}</span>
              <span className="text-sm font-semibold text-[#2c4366]">{f.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onPurchase}
          className="w-full bg-gradient-to-r from-[#ffcc4f] to-[#ff9c4d] text-[#2d1d00] font-black py-3 rounded-xl mb-2 hover:brightness-105 transition-all"
        >
          Подписаться · $2.99/мес
        </button>
        
        <button
          onClick={onClose}
          className="w-full text-[#60748f] text-sm py-2 hover:text-[#2b4366] transition-colors"
        >
          Может быть позже
        </button>
      </div>
    </div>
  );
}
