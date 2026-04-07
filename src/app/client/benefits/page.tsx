"use client";

import { useState, useMemo } from "react";
import {
  Gift,
  Crown,
  Star,
  Award,
  Gem,
  Paintbrush,
  Sofa,
  ShieldCheck,
  Landmark,
  Heart,
  Percent,
  Wallet,
  ArrowUpRight,
  Bookmark,
  Sparkles,
  Truck,
  Wrench,
  CheckCircle,
  Tag,
  Palette,
  Home,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatCard } from "@/components/ui/stat-card";
import { TierCard, type TierData } from "@/components/benefits/tier-card";
import { DealCarousel, type DealItem } from "@/components/benefits/deal-carousel";
import { CategoryTabs, type CategoryTab } from "@/components/benefits/category-tabs";
import { BenefitCard } from "@/components/benefits/benefit-card";
import { PerkClaimModal } from "@/components/benefits/perk-claim-modal";
import { CountdownTimer } from "@/components/benefits/countdown-timer";

// ── Mock Data ────────────────────────────────────────────────────

const CURRENT_SPEND = 8400;
const CURRENT_TIER = "Silver";
const NEXT_TIER_THRESHOLD = 15000;
const CASHBACK_BALANCE = 312.5;
const CREDITS_BALANCE = 75;

const tiers: TierData[] = [
  {
    name: "Member",
    icon: Gift,
    threshold: "$0",
    thresholdLabel: "Starting tier",
    headline: "Free",
    color: "from-muted-foreground to-muted-foreground/80",
    borderColor: "border-border",
    textColor: "text-muted-foreground",
    isCurrent: false,
    isLocked: false,
    perks: [
      "Access to partner discounts",
      "Community forums",
      "Project tracking dashboard",
      "Basic provider matching",
    ],
  },
  {
    name: "Silver",
    icon: Star,
    threshold: "$5K+",
    thresholdLabel: "$5K+ total project spend",
    headline: "2% Back",
    color: "from-primary to-primary-light",
    borderColor: "border-primary/30",
    textColor: "text-primary",
    isCurrent: true,
    isLocked: false,
    perks: [
      "2% cashback on all projects",
      "Priority provider matching",
      "Exclusive partner deals",
      "Extended warranty eligible",
      "Monthly curated offers",
    ],
  },
  {
    name: "Gold",
    icon: Crown,
    threshold: "$15K+",
    thresholdLabel: "$15K+ total project spend",
    headline: "5% Back",
    color: "from-warning to-warning/80",
    borderColor: "border-warning/30",
    textColor: "text-warning",
    isCurrent: false,
    isLocked: true,
    perks: [
      "5% cashback on all projects",
      "Dedicated Primme concierge",
      "Premium provider access",
      "Free design consultations",
      "Priority dispute resolution",
      "VIP event invitations",
    ],
  },
  {
    name: "Platinum",
    icon: Gem,
    threshold: "$50K+",
    thresholdLabel: "$50K+ total project spend",
    headline: "8% Back",
    color: "from-accent to-accent/80",
    borderColor: "border-accent/30",
    textColor: "text-accent",
    isCurrent: false,
    isLocked: true,
    perks: [
      "8% cashback on all projects",
      "VIP white-glove support",
      "Early access to all features",
      "Annual home assessment",
      "Exclusive Platinum events",
      "Custom project planning",
      "Complimentary insurance review",
    ],
  },
];

const now = new Date();
const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const in10Days = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

const featuredDeals: DealItem[] = [
  {
    id: "deal-1",
    partner: "Sherwin-Williams",
    partnerIcon: Paintbrush,
    title: "20% Off Premium Interior Paints",
    discount: "20% OFF",
    description: "Valid on all Emerald and Duration product lines. Exclusive for Primme members.",
    expiresAt: in3Days,
    category: "materials",
  },
  {
    id: "deal-2",
    partner: "West Elm",
    partnerIcon: Sofa,
    title: "Free Delivery + 15% Off Furniture",
    discount: "15% OFF",
    description: "Free white-glove delivery on orders $500+. Combine with your cashback.",
    expiresAt: in5Days,
    category: "lifestyle",
  },
  {
    id: "deal-3",
    partner: "Home Depot Pro",
    partnerIcon: Wrench,
    title: "Bulk Material Discount Program",
    discount: "25% OFF",
    description: "Save on lumber, fixtures, and supplies. Automatically applied at checkout.",
    expiresAt: in7Days,
    category: "materials",
  },
  {
    id: "deal-4",
    partner: "Havenly",
    partnerIcon: Palette,
    title: "Free Design Consultation ($199 value)",
    discount: "FREE",
    description: "Get a professional interior design consultation for your next project.",
    expiresAt: in10Days,
    category: "design",
  },
  {
    id: "deal-5",
    partner: "Lemonade Insurance",
    partnerIcon: ShieldCheck,
    title: "3 Months Free Home Insurance",
    discount: "3 MO FREE",
    description: "Protect your investment with comprehensive renovation coverage.",
    expiresAt: in14Days,
    category: "insurance",
  },
];

interface PerkItem {
  id: string;
  icon: typeof Paintbrush;
  title: string;
  partner: string;
  discount: string;
  description: string;
  code: string;
  isNew?: boolean;
}

const perksByCategory: Record<string, PerkItem[]> = {
  materials: [
    { id: "m1", icon: Paintbrush, title: "Premium Paint Collection", partner: "Benjamin Moore", discount: "15% OFF", description: "Exclusive discount on Aura and Regal Select lines.", code: "PRIMME-BM15" },
    { id: "m2", icon: Wrench, title: "Hardware & Fixtures", partner: "Restoration Hardware", discount: "20% OFF", description: "Luxury hardware at member-exclusive pricing.", code: "PRIMME-RH20", isNew: true },
    { id: "m3", icon: Home, title: "Flooring Materials", partner: "Floor & Decor", discount: "10% OFF", description: "Tile, hardwood, and luxury vinyl at discounted rates.", code: "PRIMME-FD10" },
  ],
  design: [
    { id: "d1", icon: Palette, title: "Interior Design Package", partner: "Havenly", discount: "30% OFF", description: "Full-service design with mood boards and shopping lists.", code: "PRIMME-HAV30" },
    { id: "d2", icon: Sparkles, title: "3D Visualization", partner: "Modsy", discount: "FREE TRIAL", description: "See your redesign in photorealistic 3D before committing.", code: "PRIMME-MOD0", isNew: true },
  ],
  insurance: [
    { id: "i1", icon: ShieldCheck, title: "Renovation Insurance", partner: "Lemonade", discount: "3 Mo Free", description: "Coverage during and after your home improvement projects.", code: "PRIMME-LEM3" },
    { id: "i2", icon: ShieldCheck, title: "Extended Warranty", partner: "Cinch Home", discount: "25% OFF", description: "Protect appliances and systems with extended coverage.", code: "PRIMME-CIN25" },
  ],
  financing: [
    { id: "f1", icon: Landmark, title: "Home Improvement Loan", partner: "LightStream", discount: "0.5% Rate Disc.", description: "Low-rate personal loans for renovation projects.", code: "PRIMME-LS05" },
    { id: "f2", icon: Landmark, title: "HELOC Offer", partner: "Figure", discount: "$0 Fees", description: "No origination fees on home equity lines of credit.", code: "PRIMME-FIG0", isNew: true },
  ],
  lifestyle: [
    { id: "l1", icon: Sofa, title: "Furniture & Decor", partner: "West Elm", discount: "15% OFF", description: "Modern furniture and home accessories for your new space.", code: "PRIMME-WE15" },
    { id: "l2", icon: Truck, title: "Moving Services", partner: "PODS", discount: "$100 OFF", description: "Discount on portable storage and moving containers.", code: "PRIMME-POD100" },
  ],
};

const recentRewards = [
  { label: "Cashback from Modern Kitchen Reno", amount: "+$125.00", date: "Mar 28" },
  { label: "Referral bonus credit", amount: "+$25.00", date: "Mar 15" },
  { label: "Silver tier welcome bonus", amount: "+$50.00", date: "Feb 22" },
];

const protectionFeatures = [
  "Satisfaction guarantee on all matched providers",
  "Escrow payment protection for every milestone",
  "Damage coverage during active projects",
  "Dispute resolution with dedicated mediator",
  "Extended 2-year workmanship warranty (Gold+)",
];

// ── Animation Helpers ────────────────────────────────────────────

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

// ── Page Component ───────────────────────────────────────────────

export default function HomeownerBenefitsPage() {
  const [claimedDeals, setClaimedDeals] = useState<Set<string>>(new Set());
  const [claimModal, setClaimModal] = useState<{ open: boolean; perk: { title: string; partner: string; discount: string; code: string } | null }>({
    open: false,
    perk: null,
  });

  const progress = (CURRENT_SPEND / NEXT_TIER_THRESHOLD) * 100;

  const handleClaimDeal = (id: string) => {
    setClaimedDeals((prev) => new Set(prev).add(id));
    const deal = featuredDeals.find((d) => d.id === id);
    if (deal) {
      toast.success(`${deal.title} claimed! Check your email for details.`);
    }
  };

  const handleClaimPerk = (perk: PerkItem) => {
    setClaimModal({
      open: true,
      perk: { title: perk.title, partner: perk.partner, discount: perk.discount, code: perk.code },
    });
  };

  const dealsWithClaimState = useMemo(
    () => featuredDeals.map((d) => ({ ...d, claimed: claimedDeals.has(d.id) })),
    [claimedDeals]
  );

  const categoryTabs: CategoryTab[] = [
    {
      id: "materials",
      label: "Materials & Supplies",
      icon: Paintbrush,
      content: (
        <PerkGrid perks={perksByCategory.materials} onClaim={handleClaimPerk} />
      ),
    },
    {
      id: "design",
      label: "Design Services",
      icon: Palette,
      content: (
        <PerkGrid perks={perksByCategory.design} onClaim={handleClaimPerk} />
      ),
    },
    {
      id: "insurance",
      label: "Insurance & Warranty",
      icon: ShieldCheck,
      content: (
        <PerkGrid perks={perksByCategory.insurance} onClaim={handleClaimPerk} />
      ),
    },
    {
      id: "financing",
      label: "Financing",
      icon: Landmark,
      content: (
        <PerkGrid perks={perksByCategory.financing} onClaim={handleClaimPerk} />
      ),
    },
    {
      id: "lifestyle",
      label: "Lifestyle",
      icon: Heart,
      content: (
        <PerkGrid perks={perksByCategory.lifestyle} onClaim={handleClaimPerk} />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* ── Header ── */}
      <header className="relative z-10 px-8 lg:px-12 pt-10 pb-8 overflow-hidden bg-background border-b border-border/30">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mx-40 -my-40 pointer-events-none" />
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-label text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20 flex items-center gap-1.5">
                <Gift className="w-3 h-3" /> Primme Perks
              </span>
              <span className="text-label text-warning bg-warning/10 px-3 py-1 rounded-md border border-warning/20 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-warning" /> {CURRENT_TIER}
              </span>
            </div>
            <h2 className="text-h1 font-display text-foreground tracking-tight">
              Your Benefits & Perks
            </h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium max-w-xl">
              Exclusive discounts, cashback rewards, and premium perks curated for your home projects.
            </p>
          </div>
          <Button asChild variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
            <Link href="/client/projects">
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </span>
              My Projects
            </Link>
          </Button>
        </div>
      </header>

      <div className="px-8 lg:px-12 py-8 lg:py-10 max-w-[1600px] mx-auto space-y-10">

        {/* ── Tier Progress + Wallet Stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <SurfaceCard className="p-8 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Star className="w-6 h-6 text-primary fill-primary" />
                  </div>
                  <div>
                    <h3 className="text-h3 font-display text-foreground tracking-tight">
                      Membership Progress
                    </h3>
                    <p className="text-meta text-muted-foreground">
                      {CURRENT_TIER} &rarr; Gold
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground">
                      ${CURRENT_SPEND.toLocaleString()} spent
                    </span>
                    <span className="text-sm font-bold text-muted-foreground">
                      ${NEXT_TIER_THRESHOLD.toLocaleString()} for Gold
                    </span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden border border-border/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    Only <span className="text-primary font-bold">${(NEXT_TIER_THRESHOLD - CURRENT_SPEND).toLocaleString()}</span> more to unlock Gold tier and <span className="font-bold text-foreground">5% cashback</span>
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <StatCard
              title="CASHBACK BALANCE"
              value={`$${CASHBACK_BALANCE.toFixed(2)}`}
              icon={Wallet}
              highlight
              trend={{ value: 18, label: "vs last month", isPositive: true }}
            />
            <div className="bg-card rounded-3xl border border-border/20 shadow-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Percent className="w-4 h-4 text-primary" />
                <span className="text-label text-muted-foreground">Credits Available</span>
              </div>
              <p className="text-2xl font-black text-foreground">${CREDITS_BALANCE}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Redeemable on your next project
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Featured Deals Carousel ── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h3 className="text-h2 font-display text-foreground tracking-tight">
                Featured Deals
              </h3>
              <p className="text-meta text-muted-foreground mt-1">
                Limited-time offers from our partner network
              </p>
            </div>
            <span className="text-label text-destructive bg-destructive/10 px-3 py-1.5 rounded-lg border border-destructive/20 animate-pulse">
              Time Limited
            </span>
          </motion.div>
          <DealCarousel deals={dealsWithClaimState} onClaim={handleClaimDeal} />
        </div>

        {/* ── Perks by Category ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Perks by Category
          </motion.h3>
          <CategoryTabs tabs={categoryTabs} />
        </div>

        {/* ── Rewards History ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Recent Rewards
          </motion.h3>
          <SurfaceCard className="divide-y divide-border/30">
            {recentRewards.map((reward, idx) => (
              <motion.div
                key={reward.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.06 }}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{reward.label}</p>
                    <p className="text-xs text-muted-foreground">{reward.date}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-success">{reward.amount}</span>
              </motion.div>
            ))}
          </SurfaceCard>
        </div>

        {/* ── Personalized Recommendations ── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-h2 font-display text-foreground tracking-tight">
              Exclusive for You
            </h3>
          </motion.div>
          <p className="text-sm text-muted-foreground font-medium mb-6 -mt-3">
            Based on your active project: <strong>Modern Kitchen Renovation</strong>
          </p>
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <BenefitCard
              icon={Paintbrush}
              title="Cabinet Paint Special"
              description="Professional-grade cabinet paint at 30% off. Perfect for your kitchen reno."
              badge="Recommended"
              onClick={() =>
                handleClaimPerk({
                  id: "rec-1",
                  icon: Paintbrush,
                  title: "Cabinet Paint Special",
                  partner: "Benjamin Moore",
                  discount: "30% OFF",
                  description: "",
                  code: "PRIMME-CAB30",
                })
              }
            />
            <BenefitCard
              icon={Wrench}
              title="Kitchen Hardware Bundle"
              description="Handles, pulls, and hinges in brushed brass or matte black finishes."
              badge="New"
              onClick={() =>
                handleClaimPerk({
                  id: "rec-2",
                  icon: Wrench,
                  title: "Kitchen Hardware Bundle",
                  partner: "Rejuvenation",
                  discount: "20% OFF",
                  description: "",
                  code: "PRIMME-KHW20",
                })
              }
            />
            <BenefitCard
              icon={Sofa}
              title="Counter Stools & Seating"
              description="Bar and counter height stools to complement your new kitchen design."
              onClick={() =>
                handleClaimPerk({
                  id: "rec-3",
                  icon: Sofa,
                  title: "Counter Stools & Seating",
                  partner: "Article",
                  discount: "15% OFF",
                  description: "",
                  code: "PRIMME-ART15",
                })
              }
            />
          </motion.div>
        </div>

        {/* ── Protection Plan ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <SurfaceCard className="p-8 lg:p-10 relative overflow-hidden bg-gradient-to-br from-card to-primary/[0.02]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-h2 font-display text-foreground tracking-tight mb-2">
                    Primme Protection Plan
                  </h3>
                  <p className="text-muted-foreground font-medium mb-6 max-w-xl">
                    Every project on Primme comes with built-in protections. Higher tiers unlock even more coverage.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {protectionFeatures.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span className="text-sm font-medium text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SurfaceCard>
        </motion.div>

        {/* ── Tier Cards ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Membership Tiers
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {tiers.map((tier, idx) => (
              <TierCard key={tier.name} tier={tier} index={idx} />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <div className="bg-ink rounded-3xl p-10 lg:p-14 shadow-overlay relative overflow-hidden text-center group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[100px] -mt-40 group-hover:bg-primary/30 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                <Crown className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-h1 font-display text-white tracking-tight mb-4">
                Unlock Gold Tier
              </h3>
              <p className="text-lg text-ink-muted font-medium max-w-md mx-auto mb-8">
                Spend ${(NEXT_TIER_THRESHOLD - CURRENT_SPEND).toLocaleString()} more on projects to unlock 5% cashback and premium perks.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="h-14 px-10 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary-light border border-white/10 ring-1 ring-inset ring-white/15">
                  <Link href="/client/create-project">
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1.5">
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    Start a Project
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-2xl font-bold text-base bg-white/5 backdrop-blur-md border-white/15 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/client/payments">
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 mr-1.5">
                      <Wallet className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    View Payments
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Claim Modal ── */}
      <PerkClaimModal
        open={claimModal.open}
        onOpenChange={(open) => setClaimModal((prev) => ({ ...prev, open }))}
        perk={claimModal.perk}
      />
    </div>
  );
}

// ── Helper: Perk Grid ────────────────────────────────────────────

function PerkGrid({ perks, onClaim }: { perks: PerkItem[]; onClaim: (perk: PerkItem) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {perks.map((perk) => {
        const Icon = perk.icon;
        return (
          <motion.div
            key={perk.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-2xl p-5 border border-border/40 shadow-card hover:-translate-y-1 hover:shadow-elevated hover:border-primary/20 transition-all duration-300 group cursor-pointer relative"
            onClick={() => onClaim(perk)}
          >
            {perk.isNew && (
              <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded-md">
                New
              </span>
            )}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-foreground text-sm truncate">
                    {perk.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{perk.partner}</p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-3">
                  {perk.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-black border border-primary/20">
                    {perk.discount}
                  </span>
                  <span className="text-xs text-primary font-bold group-hover:underline">
                    Claim &rarr;
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
