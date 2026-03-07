"use client";

export default function FAQ({ items }) {
  if (!items?.length) return null;

  return (
    <section className="fade-up mt-8">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-xl font-black text-[#1a2b45] sm:text-2xl">Частые вопросы</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-[#dce6f5] to-transparent" />
      </div>

      <div className="space-y-2.5">
        {items.map((item, i) => (
          <details
            key={i}
            className="group overflow-hidden rounded-2xl border border-[#dbe5f3] bg-white transition-all duration-200 hover:border-[#c4d5eb] hover:shadow-[0_4px_16px_rgba(60,90,140,0.08)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-[#1e3350] transition-colors select-none hover:text-[#0f1f3a]">
              <span>{item.question}</span>
              <span className="ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#d5e0f0] bg-[#f4f8ff] text-xs text-[#7a90a8] transition-all duration-200 group-open:rotate-180 group-open:border-[#ffb648] group-open:bg-[#fff8eb] group-open:text-[#b87a00]">
                ▾
              </span>
            </summary>
            <div className="border-t border-[#eaf0f9] px-5 py-4 text-sm leading-relaxed text-[#5d718c]">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}