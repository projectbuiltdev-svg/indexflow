const marqueeItems = [
  "Content Engine | Deploy to LLM | CMS instantly",
  "Pages | Posts | Articles | Listicles",
  "Link Builder | Internal | External",
  "Post Validator | On-Page Auditor | Site Profiler",
  "Schema Markup Generator",
  "Rank Tracker | Local Search Grid | GSC Ingestion Layer",
  "Competitor Keyword Spy",
  "SERP Preview Tool",
  "Keyword Gap Analysis",
  "CRM | Pipeline | Lead to Booking",
  "AI Website Widget",
  "Twilio Voice SMS",
  "BYOK AI Connections",
  "Image Bank (ai)",
  "White Label Branding",
  "Client Reports",
  "Invoice engine powered by Stripe/Paypal",
];

export function DoubleTicker() {
  return (
    <>
      <div className="border-t border-b border-border bg-accent/20 py-3 overflow-hidden space-y-3">
        <div className="flex gap-14 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
          {[...marqueeItems.slice(0, 9), ...marqueeItems.slice(0, 9), ...marqueeItems.slice(0, 9)].map((item, i) => (
            <span key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-[2px] flex items-center gap-2.5 flex-shrink-0">
              <span className="text-primary text-[9px]">●</span>
              {item}
            </span>
          ))}
        </div>
        <div className="flex gap-14 animate-[marqueeReverse_40s_linear_infinite] whitespace-nowrap">
          {[...marqueeItems.slice(9), ...marqueeItems.slice(9), ...marqueeItems.slice(9)].map((item, i) => (
            <span key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-[2px] flex items-center gap-2.5 flex-shrink-0">
              <span className="text-primary text-[9px]">●</span>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="text-center py-6">
        <p className="text-sm font-semibold text-muted-foreground tracking-wide">Publish Instantly to any LLM or CMS.</p>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes marqueeReverse {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
