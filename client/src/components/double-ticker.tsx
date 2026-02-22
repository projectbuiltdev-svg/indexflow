import { SiWordpress, SiShopify, SiSquarespace, SiWebflow, SiGhost, SiReplit } from "react-icons/si";
import wixLogo from "@assets/image_1771707999263.png";

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
      <div className="text-center py-8">
        <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-2">Publish</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-6">
          Instantly to <em className="text-muted-foreground/50 italic">any LLM or CMS.</em>
        </h3>
        <div className="overflow-hidden">
          <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {[...Array(4)].flatMap((_, setIndex) => [
              <SiWordpress key={`wp-${setIndex}`} className="w-8 h-8 flex-shrink-0 opacity-40 grayscale" />,
              <SiShopify key={`sh-${setIndex}`} className="w-8 h-8 flex-shrink-0 opacity-40 grayscale" />,
              <SiSquarespace key={`sq-${setIndex}`} className="w-8 h-8 flex-shrink-0 opacity-40 grayscale" />,
              <img key={`wix-${setIndex}`} src={wixLogo} alt="Wix" className="w-8 h-8 flex-shrink-0 opacity-40 grayscale object-contain" />,
              <SiWebflow key={`wf-${setIndex}`} className="w-8 h-8 flex-shrink-0 opacity-40 grayscale" />,
              <SiGhost key={`gh-${setIndex}`} className="w-8 h-8 flex-shrink-0 opacity-40 grayscale" />,
              <SiReplit key={`rp-${setIndex}`} className="w-8 h-8 flex-shrink-0 opacity-40 grayscale" />,
              <svg key={`lv-${setIndex}`} className="w-8 h-8 flex-shrink-0 opacity-40 grayscale" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
            ])}
          </div>
        </div>
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
