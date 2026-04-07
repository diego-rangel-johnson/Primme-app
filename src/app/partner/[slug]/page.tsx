"use client";

import { useParams } from "next/navigation";
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Star,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PartnerInfo {
  name: string;
  logo: string;
  accent: string;
  heroImage: string;
  message: string;
}

const PARTNER_DATA: Record<string, PartnerInfo> = {
  "douglas-elliman": {
    name: "Douglas Elliman",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Douglas_Elliman_logo.svg/1200px-Douglas_Elliman_logo.svg.png",
    accent: "bg-black",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=800&fit=crop",
    message: "Exclusively for Douglas Elliman Clients: Experience the Primme Concierge for your next renovation."
  },
  "compass": {
    name: "Compass",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Compass_Real_Estate_Logo.svg/1280px-Compass_Real_Estate_Logo.svg.png",
    accent: "bg-black",
    heroImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&h=800&fit=crop",
    message: "Elevating Home Preparation: Primme + Compass partnership for high-ticket listings."
  },
  "default": {
    name: "Elite Partner",
    logo: "",
    accent: "bg-primary",
    heroImage: "https://images.unsplash.com/photo-1600566753190-17f0bcd2a6c4?w=1600&h=800&fit=crop",
    message: "A premium renovation experience tailored for elite referrals."
  }
};

export default function PartnerLandingPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "default";
  const partner = PARTNER_DATA[slug] || PARTNER_DATA["default"];

  return (
    <div className="min-h-screen bg-background">
      {/* Co-Branded Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-h2 font-display text-foreground">Primme</h1>
            <div className="w-px h-6 bg-border" />
            {partner.logo ? (
              <div className="relative h-4 w-[120px] lg:h-5 lg:w-[140px] shrink-0">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain object-left opacity-80"
                  sizes="140px"
                  priority
                />
              </div>
            ) : (
                <span className="font-bold text-muted-foreground uppercase tracking-widest text-xs">{partner.name}</span>
            )}
          </div>
          <Button variant="outline" className="rounded-full font-bold px-6 hidden sm:flex">Concierge Support</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={partner.heroImage}
            alt="Luxury Interior"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white/90 text-label tracking-[0.3em] rounded-full border border-white/20 mb-8">
              <Sparkles className="w-3 h-3 text-primary" /> Exclusive Partner Program
            </span>
            <h2 className="text-display font-display text-white tracking-tighter leading-none mb-6">
              The Platinum Standard of <span className="text-primary italic">Renovation.</span>
            </h2>
            <p className="text-xl text-white/70 font-medium mb-10 leading-relaxed max-w-xl">
              {partner.message}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-2xl h-16 px-10 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 group">
                Access Primme Portal <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl h-16 px-10 text-lg font-black uppercase tracking-widest bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10">
                View Sample Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-24 px-6 lg:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h3 className="text-h1 font-display text-foreground mb-4">Why Real Estate Elites Choose Primme</h3>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">
            We bridge the gap between architectural vision and elite craftsmanship with 100% financial transparency.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: CreditCard,
              title: "Escrow Protection",
              desc: "Payments are only released after your photo-verified approval of each milestone."
            },
            {
              icon: ShieldCheck,
              title: "Elite Vetting",
              desc: "Only the top 1% of service providers are invited to the Primme Elite network."
            },
            {
              icon: Star,
              title: "Concierge Quality",
              desc: "Direct access to a dedicated project manager for every $50k+ transformation."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-background rounded-[2rem] p-12 border border-border/20 shadow-card hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                <feature.icon className="w-8 h-8" />
              </div>
              <h4 className="text-h2 font-display text-foreground mb-4">{feature.title}</h4>
              <p className="text-muted-foreground font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-32 px-6 lg:px-12 bg-ink text-ink-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -mx-40 -my-40 opacity-50" />
        <div className="absolute inset-0 gradient-mesh opacity-30 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h3 className="text-display font-display tracking-tight mb-8">Ready to elevate your <span className="text-primary italic">client&rsquo;s home?</span></h3>
          <p className="text-xl text-ink-muted mb-12 max-w-2xl mx-auto font-medium">
            Join the Primme Priority network through Douglas Elliman and unlock exclusive pricing and prioritized contractor matching.
          </p>
          <div className="bg-ink-foreground/5 border border-ink-foreground/10 rounded-2xl p-8 max-w-md mx-auto mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
               <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Image
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-ink shadow-overlay"
                      sizes="40px"
                    />
                  ))}
               </div>
               <span className="text-sm font-bold tracking-widest uppercase">Elite Pros Online</span>
            </div>
            <p className="text-label text-primary tracking-[0.2em] mb-1">Average Response Time</p>
            <p className="text-h2 font-display">Under 14 Minutes</p>
          </div>
          <Button size="lg" className="h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest bg-ink-foreground text-ink hover:bg-ink-foreground/90 shadow-overlay">
            Start Your Project Now
          </Button>
        </div>
      </section>
    </div>
  );
}
