"use client";

import { ArrowLeft, MapPin, Clock, Shield, CheckCircle, Target, Briefcase, Ruler, PaintBucket, AlertCircle, Phone, MessageSquare, ScanSearch, FileText } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { StatusBadge } from "@/components/status-badge";

export default function OpportunityDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Mock data for the specific opportunity
  const opp = {
    id: id?.toUpperCase() || "OPP-992",
    title: "Full Home Repaint",
    location: "Beverly Hills, CA",
    distance: "2.4 mi away",
    status: "NEW",
    statusVariant: "success",
    postedTime: "1h ago",
    sqft: "3,200",
    type: "Int. Walls & Trim",
    gallons: "45",
    description: "Complete interior repaint of luxury residence. High attention to detail required. Premium materials provided by homeowner. Must have experience with high-end trim work and wainscoting. Looking to start early next week.",
    budget: "$12,500",
    client: {
      name: "Michael Torres",
      initials: "MT",
      type: "Verified Homeowner",
      rating: "5.0",
      jobsCompleted: 3
    },
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop"
  };

  const handleAccept = () => {
    toast.success("Contract Accepted! Moving to Active Projects.");
    setTimeout(() => {
      router.push("/provider/projects");
    }, 1500);
  };

  return (
    <div className="min-h-full flex flex-col bg-muted/20 pb-20">
      {/* Immersive Header Image */}
      <div className="relative h-64 md:h-80 lg:h-[400px] w-full overflow-hidden shrink-0 group">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-muted/20 z-10" />
        <img
          src={opp.image}
          alt={opp.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        
        {/* Header Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 lg:p-10 flex justify-between items-center">
          <Link href="/provider/opportunities">
            <Button
              variant="ghost"
              className="h-12 px-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm font-semibold text-white hover:border-white/30 hover:bg-white/15 hover:text-white hover:shadow-md transition-all duration-300 inline-flex items-center"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <ArrowLeft className="w-4 h-4 text-primary" />
              </span>
              Back to Board
            </Button>
          </Link>
          <StatusBadge variant={opp.statusVariant as "success" | "warning" | "info" | "primary" | "purple" | "neutral"} className="backdrop-blur-md bg-success/80 text-success-foreground border-white/20 px-4 py-1.5 text-label">
            {opp.status} MATCH
          </StatusBadge>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto w-full px-6 lg:px-10 -mt-32 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title & Core Details Card */}
            <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-overlay border border-border/40 animate-in fade-in slide-in-from-bottom-8">
              <div className="flex flex-col gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-label bg-primary/10 text-primary px-3 py-1 rounded-md border border-primary/20 flex items-center gap-1.5">
                      <Target className="w-3 h-3" /> DIRECT MATCH
                    </span>
                    <span className="text-label bg-muted/50 text-muted-foreground px-3 py-1 rounded-md border border-border/50 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {opp.postedTime}
                    </span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-4">
                    {opp.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                      <MapPin className="w-4 h-4 text-primary" /> {opp.location}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-warning/20 text-warning bg-warning/10">
                      <Clock className="w-4 h-4" /> Starts ASAP
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                  <div>
                    <p className="text-label text-primary mb-1">Estimated Budget</p>
                    <p className="text-3xl font-black text-foreground tracking-tight">{opp.budget}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Link href={`/provider/inspiration/assessment?prefill=${encodeURIComponent(JSON.stringify({ title: opp.title, clientName: opp.client.name, address: opp.location, estimatedSqft: Number(opp.sqft.replace(/,/g, "")) || 0, projectDescription: opp.description, urgency: "normal" as const, roomType: "living-room" as const }))}`}>
                      <Button
                        variant="ghost"
                        className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300 inline-flex items-center"
                      >
                        <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                          <ScanSearch className="w-4 h-4 text-primary" />
                        </span>
                        Start Assessment
                      </Button>
                    </Link>
                    <Link href={`/provider/opportunities/${id}/quote`}>
                      <Button
                        variant="ghost"
                        className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300 inline-flex items-center"
                      >
                        <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                          <FileText className="w-4 h-4 text-primary" />
                        </span>
                        Create Quote
                      </Button>
                    </Link>
                    <Button
                      variant="brand"
                      className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
                      onClick={handleAccept}
                    >
                      <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                        <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                      Accept Offer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-background rounded-2xl border border-border/50 shadow-card flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors">
                  <Briefcase className="w-5 h-5 text-muted-foreground mb-2" />
                  <p className="text-label text-muted-foreground mb-1">Type</p>
                  <p className="text-sm font-bold text-foreground">{opp.type}</p>
                </div>
                <div className="p-4 bg-background rounded-2xl border border-border/50 shadow-card flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors">
                  <Ruler className="w-5 h-5 text-muted-foreground mb-2" />
                  <p className="text-label text-muted-foreground mb-1">Area</p>
                  <p className="text-sm font-bold text-foreground">{opp.sqft} sqft</p>
                </div>
                <div className="p-4 bg-background rounded-2xl border border-border/50 shadow-card flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors">
                  <PaintBucket className="w-5 h-5 text-muted-foreground mb-2" />
                  <p className="text-label text-muted-foreground mb-1">Materials</p>
                  <p className="text-sm font-bold text-foreground">{opp.gallons} gal</p>
                </div>
                <div className="p-4 bg-background rounded-2xl border border-border/50 shadow-card flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors">
                  <MapPin className="w-5 h-5 text-muted-foreground mb-2" />
                  <p className="text-label text-muted-foreground mb-1">Distance</p>
                  <p className="text-sm font-bold text-foreground">{opp.distance}</p>
                </div>
              </div>

            </div>

            {/* Content & Description */}
            <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-card border border-border/40 animate-in fade-in slide-in-from-bottom-8 delay-100">
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-primary" /> Scope of Work
              </h3>
              <p className="text-lg text-muted-foreground/90 leading-relaxed font-medium">
                {opp.description}
              </p>
            </div>
            
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Client Info */}
            <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 animate-in fade-in slide-in-from-bottom-8 delay-200">
              <h3 className="text-label text-foreground mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Client Profile
              </h3>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                <Avatar className="h-16 w-16 border-2 border-background shadow-elevated">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">{opp.client.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-bold text-foreground">{opp.client.name}</p>
                  <p className="text-xs font-semibold text-success flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3" /> {opp.client.type}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-muted/50 p-4 rounded-xl text-center border border-border/50">
                    <p className="text-2xl font-black text-foreground">{opp.client.rating}</p>
                    <p className="text-label text-muted-foreground mt-1">Rating</p>
                 </div>
                 <div className="bg-muted/50 p-4 rounded-xl text-center border border-border/50">
                    <p className="text-2xl font-black text-foreground">{opp.client.jobsCompleted}</p>
                    <p className="text-label text-muted-foreground mt-1">Projects Done</p>
                 </div>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-2xl font-bold bg-background shadow-card hover:border-primary/40 transition-colors" disabled>
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Unlocked after accept
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-2xl font-bold bg-background shadow-card hover:border-primary/40 transition-colors" disabled>
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  Unlocked after accept
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
