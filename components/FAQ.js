"use client";

export default function FAQ({ items }) {
  if (!items?.length) return null;

  return (
    <section className="mt-12 fade-up">
      <h2 className="text-2xl sm:text-3xl font-black mb-4 text-[#1a2b45]">Частые вопросы</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="group overflow-hidden rounded-xl border border-[#d5deed] bg-[linear-gradient(180deg,#ffffff,#f8fbff)]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-sm sm:text-[15px] font-semibold text-[#213752] hover:bg-[#f1f6ff] transition-colors">
              <span>{item.question}</span>
              <span className="text-[#7d8fa9] transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="border-t border-[#e0e7f3] px-4 py-3 text-sm sm:text-[15px] text-[#5d718c] leading-relaxed">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
