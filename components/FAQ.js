"use client";

export default function FAQ({ items }) {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold mb-4">Частые вопросы</h2>
      <div className="space-y-3">
        {items?.map((item, i) => (
          <details
            key={i}
            className="bg-[#090a0b] border border-[#181818] rounded-lg overflow-hidden group"
          >
            <summary className="px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-[#0f0f0f] transition-colors flex items-center justify-between">
              {item.question}
              <span className="text-[#444] group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-3 text-sm text-[#888] leading-relaxed">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
