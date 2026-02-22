import { Link } from "wouter";
import { ArrowRight, BookOpen, Wrench, Lightbulb, FileText, BarChart3, Grid3X3, ClipboardList, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

export default function About() {
  return (
    <Layout>
      <SEO {...seoData.about} />

      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-6" data-testid="text-label">IndexFlow Founder Statement</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-2" data-testid="text-heading">
            Built from<br />
            <span className="text-muted-foreground/50 italic">frustration.</span>
          </h1>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8">
            Refined by<br />
            <span className="text-muted-foreground/50 italic">necessity.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl" data-testid="text-intro">
            IndexFlow wasn't built to disrupt an industry — it was built to fix a real agency problem, by someone who was tired of waiting for a better tool to exist.
          </p>
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-2xl italic" data-testid="avatar-founder">
              d
            </div>
            <div>
              <p className="font-bold text-base" data-testid="text-founder-name">dENVER</p>
              <p className="text-sm text-muted-foreground">Founder, IndexFlow</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-16">
            <div className="text-center p-5 bg-card border border-border rounded-xl shadow-[0_6px_24px_-6px_rgba(59,130,246,0.18)]" data-testid="stat-tools">
              <p className="text-3xl font-extrabold tracking-tight text-primary">40+</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Integrated Tools</p>
            </div>
            <div className="text-center p-5 bg-card border border-border rounded-xl shadow-[0_6px_24px_-6px_rgba(234,179,8,0.18)]" data-testid="stat-customer">
              <p className="text-3xl font-extrabold tracking-tight text-primary">#1</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Customer: The Founder</p>
            </div>
            <div className="text-center p-5 bg-card border border-border rounded-xl shadow-[0_6px_24px_-6px_rgba(244,63,94,0.16)]" data-testid="stat-fluff">
              <p className="text-3xl font-extrabold tracking-tight text-primary">0</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Generic AI Fluff</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-muted-foreground">◆ IF / 01 — Origin</p>
          </div>

          <p className="text-lg text-foreground leading-relaxed mb-6">
            Running an SEO agency means managing a growing, fragmented stack of expensive tools — content platforms, rank trackers, local grid scanners, reporting suites. Tools that each do one thing, billed separately, and never quite talk to each other.
          </p>
          <p className="text-lg text-foreground leading-relaxed mb-10">
            I got tired of it. So I built an in-house system to solve it.
          </p>

          <blockquote className="border-l-4 border-primary pl-6 py-2 mb-10">
            <p className="text-xl sm:text-2xl font-semibold italic text-foreground/80 leading-snug">
              "The best products are often accidental discoveries."
            </p>
          </blockquote>

          <p className="text-base text-muted-foreground leading-relaxed">
            IndexFlow wasn't created to disrupt an industry. It was built to remove the manual, time-consuming SEO workflows that agencies deal with every day — because I was dealing with them myself.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-muted-foreground">◆ IF / 02 — Insight</p>
          </div>

          <p className="text-lg text-foreground leading-relaxed mb-6">
            When you step back, you realise something: every SEO agency has the same problem.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            The same fragmented stack. The same repetitive production work. The same tools promising AI-powered results that don't deliver. The same Monday morning of copy-pasting data between dashboards that should never have been separate.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {[
              { icon: FileText, label: "Content Platforms" },
              { icon: BarChart3, label: "Rank Trackers" },
              { icon: Grid3X3, label: "Local Grid Scanners" },
              { icon: ClipboardList, label: "Reporting Tools" },
              { icon: Sparkles, label: "AI Overheads" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl text-center shadow-[0_6px_24px_-6px_rgba(148,163,184,0.22)]">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-muted-foreground">◆ IF / 03 — Philosophy</p>
          </div>

          <p className="text-lg text-foreground leading-relaxed mb-6">
            Every feature inside IndexFlow exists for a reason. Every workflow solves a real production bottleneck — because I was the first IndexFlow customer.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            It was built to fix my agency's problems first. That's not a marketing line. That's just what happened when I got frustrated enough to build rather than wait.
          </p>

          <blockquote className="border-l-4 border-purple-500 pl-6 py-2">
            <p className="text-xl sm:text-2xl font-semibold italic text-foreground/80 leading-snug">
              "IndexFlow simply became the solution I wish existed years ago."
            </p>
          </blockquote>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-muted-foreground">◆ IF / 04 — For Who</p>
          </div>

          <p className="text-lg text-foreground leading-relaxed mb-6">
            If you're tired of the same fragmented SEO tool stack — or experimenting with AI tools that simply do not work — then you're exactly who IndexFlow was built for.
          </p>
          <p className="text-xl font-bold text-foreground mb-6">
            You don't need more tools. You need the right system.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            40+ tools. One platform. Built by an agency, for agencies.
          </p>

          <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-[0_6px_24px_-6px_rgba(59,130,246,0.18)]">
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              IndexFlow was a frustration turned product, an internal tool turned platform, and an agency problem turned into something I hope transforms how other agencies work.
            </p>
            <p className="text-base text-foreground leading-relaxed mb-8 italic">
              I hope other agencies get as much value from it as we do.
            </p>

            <div className="flex items-center gap-4 mb-8 pt-6 border-t border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-xl italic">
                d
              </div>
              <div>
                <p className="font-bold text-sm">dENVER</p>
                <p className="text-xs text-muted-foreground">Founder, IndexFlow</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/">
                <Button className="gap-2 w-full sm:w-auto" data-testid="button-visit-indexflow">
                  Visit IndexFlow <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-read-docs">
                  <BookOpen className="w-4 h-4" /> Read the Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
