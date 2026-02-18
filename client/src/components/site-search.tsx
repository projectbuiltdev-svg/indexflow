import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";

const searchablePages = [
  { title: "Home", path: "/", keywords: "home landing" },
  { title: "How It Works", path: "/how-it-works", keywords: "about how works process" },
  { title: "Pricing", path: "/pricing", keywords: "pricing plans cost" },
  { title: "Contact", path: "/contact", keywords: "contact demo book" },
  { title: "Blog", path: "/blog", keywords: "blog articles news" },
  { title: "Portfolio", path: "/portfolio", keywords: "portfolio gallery templates" },
  { title: "FAQ", path: "/faq", keywords: "faq questions help" },
  { title: "Restaurants", path: "/solutions/restaurants", keywords: "restaurant dining" },
  { title: "Hotels", path: "/solutions/hotels", keywords: "hotel digital marketing" },
  { title: "Cafes", path: "/solutions/cafes", keywords: "cafe coffee" },
  { title: "Bars", path: "/solutions/bars", keywords: "bar lounge nightlife" },
  { title: "AI Concierge", path: "/platform/ai-concierge", keywords: "ai chatbot widget" },
  { title: "SEO Tools", path: "/platform/seo-tools", keywords: "seo search optimization" },
  { title: "Rank Tracking", path: "/platform/rank-tracking", keywords: "rank tracking keywords" },
  { title: "Templates", path: "/templates", keywords: "templates designs themes" },
  { title: "Case Studies", path: "/case-studies", keywords: "case studies success" },
  { title: "Testimonials", path: "/testimonials", keywords: "testimonials reviews" },
];

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const results = query.length > 1
    ? searchablePages.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.keywords.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} data-testid="button-site-search">
        <Search className="h-5 w-5" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            data-testid="input-site-search"
          />
          <div className="max-h-64 overflow-y-auto">
            {results.map((page) => (
              <button
                key={page.path}
                className="w-full text-left px-3 py-2 rounded-md hover-elevate text-sm"
                onClick={() => { setLocation(page.path); setOpen(false); setQuery(""); }}
                data-testid={`link-search-result-${page.path.replace(/\//g, '-')}`}
              >
                {page.title}
              </button>
            ))}
            {query.length > 1 && results.length === 0 && (
              <p className="text-sm text-muted-foreground px-3 py-2">No results found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
