"use client";

import { useState } from "react";
import {
  Award,
  Star,
  Crown,
  Zap,
  Shield,
  Rocket,
  TrendingUp,
  DollarSign,
  BadgeCheck,
  BookOpen,
  Wrench,
  Truck,
  Briefcase,
  Target,
  BarChart3,
  CheckCircle,
  ArrowUpRight,
  Lock,
  Sparkles,
  GraduationCap,
  FileText,
  CreditCard,
  Users,
  PaintBucket,
  Hammer,
  ShieldCheck,
  Monitor,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatCard } from "@/components/ui/stat-card";
import { TierCard, type TierData } from "@/components/benefits/tier-card";
import { BenefitCard } from "@/components/benefits/benefit-card";
import { CategoryTabs, type CategoryTab } from "@/components/benefits/category-tabs";
import { SavingsCalculator } from "@/components/benefits/savings-calculator";
import { ProgressRing } from "@/components/benefits/progress-ring";

// ── Mock Data ────────────────────────────────────────────────────

const PROVIDER_STATS = {
  projectsCompleted: 37,
  avgRating: 4.8,
  revenue: 142500,
  tier: "Elite",
  nextTierProjects: 50,
  feeDiscount: 10,
};

const tiers: TierData[] = [
  {
    name: "Starter",
    icon: Briefcase,
    threshold: "New",
    thresholdLabel: "New provider",
    headline: "0% Disc.",
    color: "from-muted-foreground to-muted-foreground/80",
    borderColor: "border-border",
    textColor: "text-muted-foreground",
    isCurrent: false,
    isLocked: false,
    perks: [
      "Basic marketplace listing",
      "Standard lead access",
      "Community forums",
      "Email support",
    ],
  },
  {
    name: "Pro",
    icon: Award,
    threshold: "10+",
    thresholdLabel: "10+ projects, 4.5+ rating",
    headline: "5% Fee Disc.",
    color: "from-primary to-primary-light",
    borderColor: "border-primary/30",
    textColor: "text-primary",
    isCurrent: false,
    isLocked: false,
    perks: [
      "Verified Pro badge",
      "Priority lead access",
      "5% platform fee discount",
      "Marketing toolkit",
      "Performance analytics",
    ],
  },
  {
    name: "Elite",
    icon: Star,
    threshold: "50+",
    thresholdLabel: "50+ projects, 4.7+ rating",
    headline: "10% Fee Disc.",
    color: "from-success to-success/80",
    borderColor: "border-success/30",
    textColor: "text-success",
    isCurrent: true,
    isLocked: false,
    perks: [
      "Featured marketplace listing",
      "10% platform fee discount",
      "Express payouts (same day)",
      "Premium lead matching",
      "Quarterly bonus eligible",
      "Advanced analytics dashboard",
    ],
  },
  {
    name: "Master",
    icon: Crown,
    threshold: "100+",
    thresholdLabel: "100+ projects, 4.8+ rating",
    headline: "15% Fee Disc.",
    color: "from-warning to-warning/80",
    borderColor: "border-warning/30",
    textColor: "text-warning",
    isCurrent: false,
    isLocked: true,
    perks: [
      "Dedicated account manager",
      "15% platform fee discount",
      "Priority placement in search",
      "Custom branded profile",
      "VIP event invitations",
      "Annual growth consultation",
      "Referral revenue share",
    ],
  },
];

const businessBoosters = [
  {
    id: "bb1",
    icon: Rocket,
    title: "Featured Listing",
    description: "1-week spotlight in marketplace search results. Up to 3x more views.",
    status: "available" as const,
    value: "~$450 in leads",
  },
  {
    id: "bb2",
    icon: Zap,
    title: "Priority Leads",
    description: "Get first access to new opportunities before other providers.",
    status: "active" as const,
    value: "Active until Apr 30",
  },
  {
    id: "bb3",
    icon: BadgeCheck,
    title: "Verified Pro Badge",
    description: "Display verified credentials on your profile for increased trust.",
    status: "active" as const,
    value: "+22% conversion",
  },
  {
    id: "bb4",
    icon: Target,
    title: "Bid Boost",
    description: "Your proposals appear first. 48-hour boost on up to 5 opportunities.",
    status: "available" as const,
    value: "~$300 in wins",
  },
];

const certifications = [
  { id: "c1", name: "Color Expert", icon: PaintBucket, progress: 100, completed: true, description: "Master color theory and advanced techniques" },
  { id: "c2", name: "Eco-Friendly Pro", icon: Shield, progress: 72, completed: false, description: "Sustainable materials and low-VOC practices" },
  { id: "c3", name: "Commercial Specialist", icon: Briefcase, progress: 45, completed: false, description: "Large-scale commercial project expertise" },
  { id: "c4", name: "Safety Certified", icon: ShieldCheck, progress: 100, completed: true, description: "OSHA compliance and safety best practices" },
  { id: "c5", name: "Luxury Finishes", icon: Sparkles, progress: 20, completed: false, description: "High-end materials and luxury application methods" },
];

const financialPerks = [
  { icon: Zap, title: "Express Payouts", description: "Same-day transfers on completed milestones. Available at Elite+ tiers.", available: true },
  { icon: DollarSign, title: "10% Fee Discount", description: "Reduced platform fee on all projects. Your current Elite tier perk.", available: true },
  { icon: CreditCard, title: "Equipment Financing", description: "Low-rate financing for tools, vehicles, and equipment through our partners.", available: true },
  { icon: FileText, title: "Invoice Factoring", description: "Get paid upfront on approved invoices. Available at Master tier.", available: false },
];

const savingsItems = [
  { label: "Platform fee discount (10%)", monthlyAmount: 285, active: true },
  { label: "Material bulk pricing", monthlyAmount: 420, active: true },
  { label: "Insurance discount", monthlyAmount: 150, active: true },
  { label: "Software bundle", monthlyAmount: 89, active: true },
  { label: "Fleet fuel card", monthlyAmount: 175, active: false },
  { label: "Equipment financing", monthlyAmount: 210, active: false },
];

interface SavingsPartner {
  icon: typeof Wrench;
  title: string;
  partner: string;
  discount: string;
  annualSaving: string;
  description: string;
}

const savingsByCategory: Record<string, SavingsPartner[]> = {
  materials: [
    { icon: PaintBucket, title: "Paint & Coatings", partner: "Sherwin-Williams Pro", discount: "30% OFF", annualSaving: "$3,200", description: "Professional account with volume pricing on all products." },
    { icon: Hammer, title: "Tools & Supplies", partner: "Milwaukee Tool", discount: "20% OFF", annualSaving: "$1,800", description: "Pro pricing on power tools, hand tools, and accessories." },
    { icon: Wrench, title: "Hardware & Fixtures", partner: "Ferguson", discount: "25% OFF", annualSaving: "$2,400", description: "Trade discounts on plumbing, lighting, and hardware." },
  ],
  insurance: [
    { icon: ShieldCheck, title: "General Liability", partner: "Next Insurance", discount: "15% OFF", annualSaving: "$960", description: "Affordable GL insurance tailored for contractors." },
    { icon: Shield, title: "Workers Comp", partner: "Hartford", discount: "10% OFF", annualSaving: "$1,200", description: "Discounted workers compensation coverage." },
  ],
  software: [
    { icon: Monitor, title: "Accounting Suite", partner: "QuickBooks", discount: "50% OFF 6mo", annualSaving: "$420", description: "Track expenses, invoicing, and taxes in one place." },
    { icon: BarChart3, title: "Project Management", partner: "Buildertrend", discount: "30% OFF", annualSaving: "$720", description: "Scheduling, budgeting, and client communication." },
  ],
  vehicle: [
    { icon: Truck, title: "Fleet Fuel Card", partner: "WEX", discount: "$0.12/gal off", annualSaving: "$2,100", description: "Fuel savings at 95% of US gas stations." },
    { icon: Truck, title: "Vehicle Insurance", partner: "Progressive Commercial", discount: "12% OFF", annualSaving: "$840", description: "Bundled commercial auto insurance discounts." },
  ],
  training: [
    { icon: GraduationCap, title: "Certification Courses", partner: "Primme Academy", discount: "FREE", annualSaving: "$1,500", description: "Earn badges and certifications to boost your profile." },
    { icon: BookOpen, title: "Business Coaching", partner: "SCORE", discount: "FREE", annualSaving: "Priceless", description: "1-on-1 mentoring from experienced business owners." },
  ],
};

const leaderboard = [
  { rank: 1, name: "M****a L.", projects: 89, rating: 4.9, tier: "Master" },
  { rank: 2, name: "A****r R.", projects: 72, rating: 4.9, tier: "Elite" },
  { rank: 3, name: "You", projects: 37, rating: 4.8, tier: "Elite", isYou: true },
  { rank: 4, name: "S****n K.", projects: 34, rating: 4.7, tier: "Elite" },
  { rank: 5, name: "J****n P.", projects: 28, rating: 4.8, tier: "Pro" },
];

// ── Animation Helpers ────────────────────────────────────────────

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ── Page Component ───────────────────────────────────────────────

export default function ProviderBenefitsPage() {
  const tierProgress =
    (PROVIDER_STATS.projectsCompleted / PROVIDER_STATS.nextTierProjects) * 100;

  const handleActivateBoost = (title: string) => {
    toast.success(`${title} activated! Check your dashboard for details.`);
  };

  const savingsTabs: CategoryTab[] = [
    {
      id: "materials",
      label: "Materials & Tools",
      icon: Hammer,
      content: <SavingsGrid items={savingsByCategory.materials} />,
    },
    {
      id: "insurance",
      label: "Insurance & Bonding",
      icon: ShieldCheck,
      content: <SavingsGrid items={savingsByCategory.insurance} />,
    },
    {
      id: "software",
      label: "Software & SaaS",
      icon: Monitor,
      content: <SavingsGrid items={savingsByCategory.software} />,
    },
    {
      id: "vehicle",
      label: "Vehicle & Fleet",
      icon: Truck,
      content: <SavingsGrid items={savingsByCategory.vehicle} />,
    },
    {
      id: "training",
      label: "Education & Training",
      icon: GraduationCap,
      content: <SavingsGrid items={savingsByCategory.training} />,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* ── Header ── */}
      <header className="relative z-10 px-8 lg:px-12 pt-10 pb-8 overflow-hidden bg-background border-b border-border/30">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mx-40 -my-40 pointer-events-none" />
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-label text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20 flex items-center gap-1.5">
                <Award className="w-3 h-3" /> Pro Rewards
              </span>
              <span className="text-label text-success bg-success/10 px-3 py-1 rounded-md border border-success/20 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-success" /> Elite Tier
              </span>
            </div>
            <h2 className="text-h1 font-display text-foreground tracking-tight">
              Pro Rewards
            </h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium max-w-xl">
              Grow your business with exclusive tools, discounts, and competitive advantages as a Primme Pro.
            </p>
          </div>
          <Button asChild variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
            <Link href="/provider/opportunities">
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <Briefcase className="w-4 h-4" strokeWidth={2.5} />
              </span>
              View Opportunities
            </Link>
          </Button>
        </div>
      </header>

      <div className="px-8 lg:px-12 py-8 lg:py-10 max-w-[1600px] mx-auto space-y-10">

        {/* ── Tier Status + Key Metrics ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <SurfaceCard className="p-8 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-6">
                  <ProgressRing
                    value={tierProgress}
                    size={100}
                    strokeWidth={7}
                    gradientId="provider-tier-ring"
                    gradientFrom="hsl(var(--primary))"
                    gradientTo="hsl(var(--primary-light))"
                  >
                    <div className="text-center">
                      <p className="text-xl font-black text-foreground leading-none">
                        {PROVIDER_STATS.projectsCompleted}
                      </p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        Projects
                      </p>
                    </div>
                  </ProgressRing>
                  <div>
                    <h3 className="text-h3 font-display text-foreground tracking-tight">
                      Elite Status
                    </h3>
                    <p className="text-meta text-muted-foreground">
                      {PROVIDER_STATS.nextTierProjects - PROVIDER_STATS.projectsCompleted} projects to Master
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(PROVIDER_STATS.avgRating)
                              ? "text-warning fill-warning"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-bold text-foreground ml-1">
                        {PROVIDER_STATS.avgRating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${tierProgress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  <span className="text-primary font-bold">{PROVIDER_STATS.nextTierProjects - PROVIDER_STATS.projectsCompleted} more projects</span> + maintain{" "}
                  <span className="font-bold text-foreground">4.8+ rating</span> for Master tier
                </p>
              </div>
            </SurfaceCard>
          </motion.div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <StatCard
                title="TOTAL REVENUE"
                value={`$${(PROVIDER_STATS.revenue / 1000).toFixed(0)}K`}
                icon={DollarSign}
                variant="hero"
                trend={{ value: 24, label: "vs last quarter", isPositive: true }}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <StatCard
                title="FEE SAVINGS"
                value={`$${(PROVIDER_STATS.revenue * PROVIDER_STATS.feeDiscount / 100 / 1000).toFixed(1)}K`}
                icon={TrendingUp}
                highlight
                trend={{ value: PROVIDER_STATS.feeDiscount, label: "discount rate", isPositive: true }}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <StatCard
                title="ACTIVE PERKS"
                value="12"
                icon={Sparkles}
                trend={{ value: 3, label: "newly unlocked", isPositive: true }}
              />
            </motion.div>
          </div>
        </div>

        {/* ── Business Boosters ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Business Boosters
          </motion.h3>
          <p className="text-meta text-muted-foreground mb-6">
            Activate tools that directly impact your revenue and visibility
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {businessBoosters.map((boost, idx) => {
              const Icon = boost.icon;
              const isActive = boost.status === "active";
              return (
                <motion.div
                  key={boost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.06 }}
                  className={`rounded-2xl p-5 border shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${
                    isActive
                      ? "bg-primary/[0.03] border-primary/25"
                      : "bg-card border-border/40 hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                        isActive
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-primary/10 border-primary/20 text-primary"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isActive ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20 rounded-md">
                        Active
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className="h-7 text-xs rounded-lg font-bold"
                        onClick={() => handleActivateBoost(boost.title)}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                  <h4 className="font-bold text-foreground text-sm mb-1">{boost.title}</h4>
                  <p className="text-xs text-muted-foreground font-medium mb-3 leading-relaxed">
                    {boost.description}
                  </p>
                  <p className="text-xs font-bold text-primary">{boost.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Savings Hub ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.h3
              className="text-h2 font-display text-foreground tracking-tight mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Savings Hub
            </motion.h3>
            <p className="text-meta text-muted-foreground mb-6">
              Partner discounts organized for professionals
            </p>
            <CategoryTabs tabs={savingsTabs} />
          </div>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <SavingsCalculator items={savingsItems} />
            </motion.div>
          </div>
        </div>

        {/* ── Skill Center ── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mb-2"
          >
            <GraduationCap className="w-5 h-5 text-primary" />
            <h3 className="text-h2 font-display text-foreground tracking-tight">
              Skill Center
            </h3>
          </motion.div>
          <p className="text-meta text-muted-foreground mb-6">
            Earn certifications to boost your profile credibility and win more projects
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {certifications.map((cert, idx) => {
              const CertIcon = cert.icon;
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.06 }}
                  className={`rounded-2xl p-5 border shadow-card text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${
                    cert.completed
                      ? "bg-success/[0.03] border-success/25"
                      : "bg-card border-border/40"
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <ProgressRing
                      value={cert.progress}
                      size={64}
                      strokeWidth={5}
                      gradientId={`cert-${cert.id}`}
                      gradientFrom={cert.completed ? "hsl(var(--success))" : "hsl(var(--primary))"}
                      gradientTo={cert.completed ? "hsl(var(--success))" : "hsl(var(--primary-light))"}
                    >
                      <CertIcon
                        className={`w-5 h-5 ${
                          cert.completed ? "text-success" : "text-primary"
                        }`}
                      />
                    </ProgressRing>
                  </div>
                  <h4 className="font-bold text-foreground text-sm mb-1">{cert.name}</h4>
                  <p className="text-[11px] text-muted-foreground font-medium leading-snug mb-2">
                    {cert.description}
                  </p>
                  {cert.completed ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success">
                      <CheckCircle className="w-3 h-3" /> Earned
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-primary">
                      {cert.progress}% Complete
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Financial Perks ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Financial Perks
          </motion.h3>
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {financialPerks.map((perk) => (
              <BenefitCard
                key={perk.title}
                icon={perk.icon}
                title={perk.title}
                description={perk.description}
                accentClass={
                  perk.available
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-muted text-muted-foreground border-border"
                }
                badge={perk.available ? "Active" : "Master Tier"}
              />
            ))}
          </motion.div>
        </div>

        {/* ── Leaderboard ── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-h2 font-display text-foreground tracking-tight">
              Area Leaderboard
            </h3>
            <span className="text-label text-muted-foreground ml-2">Los Angeles, CA</span>
          </motion.div>
          <SurfaceCard className="overflow-hidden">
            {leaderboard.map((entry, idx) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.06 }}
                className={`flex items-center gap-4 px-6 py-4 border-b border-border/20 last:border-b-0 ${
                  entry.isYou ? "bg-primary/[0.03]" : ""
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                    entry.rank === 1
                      ? "bg-warning/10 text-warning border border-warning/20"
                      : entry.rank === 2
                        ? "bg-muted text-muted-foreground border border-border"
                        : entry.rank === 3
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  #{entry.rank}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${entry.isYou ? "text-primary" : "text-foreground"}`}>
                    {entry.name}
                    {entry.isYou && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.tier}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{entry.projects} projects</p>
                  <div className="flex items-center justify-end gap-0.5">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="text-xs font-bold text-muted-foreground">{entry.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </SurfaceCard>
        </div>

        {/* ── Tier Cards ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            Pro Tier Levels
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
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-ink rounded-3xl p-10 lg:p-14 shadow-overlay relative overflow-hidden text-center group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[100px] -mt-40 group-hover:bg-primary/30 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                <Crown className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-h1 font-display text-white tracking-tight mb-4">
                Reach Master Tier
              </h3>
              <p className="text-lg text-ink-muted font-medium max-w-md mx-auto mb-8">
                Complete {PROVIDER_STATS.nextTierProjects - PROVIDER_STATS.projectsCompleted} more projects to unlock 15% fee discounts, dedicated account management, and more.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="h-14 px-10 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary-light border border-white/10 ring-1 ring-inset ring-white/15">
                  <Link href="/provider/opportunities">
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1.5">
                      <Briefcase className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    Browse Opportunities
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-2xl font-bold text-base bg-white/5 backdrop-blur-md border-white/15 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/provider/earnings">
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 mr-1.5">
                      <DollarSign className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    View Earnings
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Helper: Savings Grid ─────────────────────────────────────────

function SavingsGrid({ items }: { items: SavingsPartner[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-2xl p-5 border border-border/40 shadow-card hover:-translate-y-1 hover:shadow-elevated hover:border-primary/20 transition-all duration-300 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground text-sm mb-0.5">{item.title}</h4>
                <p className="text-xs text-muted-foreground mb-1">{item.partner}</p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-black border border-primary/20">
                    {item.discount}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    ~{item.annualSaving}/yr
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
