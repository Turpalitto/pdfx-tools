"use client";

export default function FAQ({ items }) {
  if (!items?.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-xl font-black" style={{ color: "#0f172a" }}>Частые вопросы</h2>
        <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #e2e8f0, transparent)" }} />
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <details
            key={i}
            className="group overflow-hidden rounded-2xl bg-white transition-all duration-200"
            style={{ border: "1.5px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#c7d7ed"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[13.5px] font-semibold select-none"
              style={{ color: "#1e293b" }}>
              <span>{item.question}</span>
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 group-open:rotate-180"
                style={{ background: "#f1f5f9", color: "#64748b" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </span>
            </summary>
            <div className="border-t px-5 py-4 text-sm leading-relaxed" style={{ borderColor: "#f1f5f9", color: "#64748b" }}>
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
