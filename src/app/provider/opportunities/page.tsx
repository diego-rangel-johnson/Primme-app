"use client";

import { Search, Filter, Target, MapPin, Palette, Ruler, PaintBucket, Clock, ArrowRight, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { QuoteEditor } from "@/components/provider/quote-editor";

const OPPORTUNITIES = [
  {
    id: 1,
    title: "Interior Painting - Master Bedroom",
    location: "Beverly Hills",
    time: "2m ago",
    badge: "NEW",
    badgeVariant: "success",
    sqft: "450",
    type: "Wall painting",
    gallons: "3",
    description: "The client is looking for a premium finish in a 450 sq ft master bedroom. Requires high-end low-VOC paint and meticulous preparation of crown molding.",
    budget: "$1,200 - $1,500",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Exterior Fence Coating",
    location: "Santa Monica",
    time: "5m ago",
    badge: "HOT",
    badgeVariant: "warning",
    sqft: "800",
    type: "Power washing",
    gallons: "5",
    description: "Redwood fence requires staining and weatherproofing. Approximately 60 linear feet. Client provides the stain, Pro provides equipment and prep.",
    budget: "$900 - $1,000",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Kitchen Cabinet Refinishing",
    location: "West Hollywood",
    time: "12m ago",
    badge: "PREMIUM",
    badgeVariant: "primary",
    sqft: "180",
    type: "Sanding",
    gallons: "2",
    description: "Complete refinishing of 24 cabinet doors and 8 drawers. Requires sanding, priming, and professional spray finish (Satin White).",
    budget: "$3,500 - $4,200",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Full Home Repaint",
    location: "Beverly Hills, CA",
    time: "1h ago",
    badge: "NEW",
    badgeVariant: "success",
    sqft: "3,200",
    type: "Int. Walls & Trim",
    gallons: "45",
    description: "Complete interior repaint of luxury residence. High attention to detail required. Premium materials provided by homeowner.",
    budget: "$12,500",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"
  }
];

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpp, setSelectedOpp] = useState<typeof OPPORTUNITIES[0] | null>(null);
  const [isQuoteEditorOpen, setIsQuoteEditorOpen] = useState(false);

  const handleAccept = (opp: typeof OPPORTUNITIES[0]) => {
    setSelectedOpp(opp);
    setIsQuoteEditorOpen(true);
  };

  const filteredOpportunities = useMemo(() => {
    if (!searchQuery.trim()) return OPPORTUNITIES;
    const q = searchQuery.toLowerCase();
    return OPPORTUNITIES.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.type.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-full flex flex-col bg-muted/20">
      <header className="lg:sticky lg:top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 lg:px-10 py-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50" />

        <div className="relative animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-label rounded-full ring-1 ring-primary/20 shadow-card mb-3">
                <Target className="w-3 h-3" />
                Live Matching
              </span>
              <h2 className="text-h1 font-display text-foreground tracking-tight mt-1">Opportunity Board</h2>
              <p className="text-muted-foreground font-medium mt-1">
                {filteredOpportunities.length} project{filteredOpportunities.length !== 1 ? "s" : ""} securely matched to your profile.
              </p>
            </div>

            <div className="flex w-full md:w-auto items-center gap-4">
              <div className="flex-1 max-w-md relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search leads by location or keyword..."
                  className="w-full pl-12 h-12 rounded-xl border-2 border-border/50 bg-background hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-card"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2 h-12 px-6 rounded-xl font-bold shadow-card hover:shadow-md hover:border-primary/40 hover:text-primary transition-all bg-background" onClick={() => setSearchQuery("")}>
                <Filter className="w-5 h-5" />
                {searchQuery ? "Clear" : "Filter"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 lg:px-10 py-8 lg:py-10 flex-1">
        {filteredOpportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-background">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-h2 font-display text-foreground tracking-tight mb-2">No leads found</h3>
            <p className="text-muted-foreground font-medium text-lg max-w-md">We couldn't find any opportunities matching your search terms. Try adjusting your filters.</p>
            <Button variant="outline" className="mt-8 rounded-xl font-bold h-12 px-8" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOpportunities.map((opp, index) => (
              <div
                key={opp.id}
                className="group bg-card rounded-3xl p-6 shadow-card border border-border/40 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-8">

                  {/* Image Container */}
                  <div className="w-full md:w-72 h-48 md:h-auto rounded-2xl overflow-hidden shrink-0 relative shadow-inner group-hover:shadow-lg transition-all duration-500 border border-border/50">
                    <img
                      src={opp.image}
                      alt={opp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
                      <span className={`px-3 py-1 text-label rounded-lg shadow-card backdrop-blur-md flex items-center border ${opp.badgeVariant === 'success' ? 'bg-success/90 text-success-foreground border-success/30' :
                          opp.badgeVariant === 'warning' ? 'bg-warning/90 text-warning-foreground border-warning/30' :
                            'bg-primary/90 text-white border-primary-light/30'
                        }`}>
                        {opp.badge === 'NEW' && (
                          <span className="relative flex h-1.5 w-1.5 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                          </span>
                        )}
                        {opp.badge}
                      </span>

                      <span className="px-2.5 py-1 bg-black/50 text-white text-label rounded-lg backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                        <Clock className="w-3 h-3" /> {opp.time}
                      </span>
                    </div>

                    {/* Bottom Budget */}
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <span className="px-3.5 py-1.5 bg-background text-foreground text-sm font-black rounded-xl tracking-tight shadow-lg border border-border flex items-center w-fit group-hover:bg-primary group-hover:text-white group-hover:border-primary-light transition-colors duration-300">
                        {opp.budget}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex-1 flex flex-col pt-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors tracking-tight mb-2">
                          {opp.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 bg-muted/50 border border-border/50 px-2.5 py-1 rounded-md shadow-card">
                            <MapPin className="h-4 w-4 text-primary" /> {opp.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="flex flex-wrap items-center gap-6 mb-5 p-4 bg-muted/30 rounded-2xl border border-border/40 shadow-inner">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-card border border-border/50">
                          <Ruler className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-label text-muted-foreground leading-none mb-1">Area</p>
                          <p className="text-sm font-bold text-foreground leading-none">{opp.sqft} sqft</p>
                        </div>
                      </div>

                      <div className="w-px h-8 bg-border/60 hidden sm:block" />

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-card border border-border/50">
                          <Palette className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-label text-muted-foreground leading-none mb-1">Type</p>
                          <p className="text-sm font-bold text-foreground leading-none">{opp.type}</p>
                        </div>
                      </div>

                      <div className="w-px h-8 bg-border/60 hidden sm:block" />

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-card border border-border/50">
                          <PaintBucket className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-label text-muted-foreground leading-none mb-1">Materials</p>
                          <p className="text-sm font-bold text-foreground leading-none">{opp.gallons} gal</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm font-medium text-muted-foreground mb-6 line-clamp-2 leading-relaxed max-w-3xl">
                      {opp.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-auto">
                      <Button
                        variant="brand"
                        className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
                        onClick={() => handleAccept(opp)}
                      >
                        <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                        </span>
                        Accept Contract
                      </Button>
                      <Button variant="ghost" asChild className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300">
                        <Link href={`/provider/opportunities/${opp.id}`} className="inline-flex items-center">
                          <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                            <Eye className="w-4 h-4 text-primary" />
                          </span>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isQuoteEditorOpen && selectedOpp && (
        <QuoteEditor 
          onClose={() => setIsQuoteEditorOpen(false)} 
          opportunity={{
            title: selectedOpp.title,
            sqft: selectedOpp.sqft,
            budget: selectedOpp.budget
          }}
        />
      )}
    </div>
  );
}
