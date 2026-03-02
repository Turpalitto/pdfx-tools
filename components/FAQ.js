"use client";

export default function FAQ({ items }) {
  if (!items?.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4 text-[#f3edde]">Частые вопросы</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="bg-[#0c1016] border border-[#232a36] rounded-lg overflow-hidden group">
            <summary className="px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-[#111723] transition-colors flex items-center justify-between">
              {item.question}
              <span className="text-[#8d97a8] group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-4 pb-3 text-sm text-[#a0a8b4] leading-relaxed">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}