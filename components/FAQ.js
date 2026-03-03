"use client";

export default function FAQ({ items }) {
  if (!items?.length) return null;

  return (
    <section className="mt-12 fade-up">
      <h2 className="text-2xl sm:text-3xl font-black mb-4 text-[#f4efe4]">Частые вопросы</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="group overflow-hidden rounded-xl border border-[#2b3953] bg-[linear-gradient(180deg,#0b1018,#0a0d14)]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-sm sm:text-[15px] font-semibold text-[#ece7dd] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
              <span>{item.question}</span>
              <span className="text-[#9cadc7] transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="border-t border-[#222f45] px-4 py-3 text-sm sm:text-[15px] text-[#a8b3c4] leading-relaxed">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}