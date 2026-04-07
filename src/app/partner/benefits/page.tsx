"use client";

import { useState } from "react";
import {
  Trophy,
  Award,
  Star,
  Crown,
  DollarSign,
  BarChart3,
  HeadphonesIcon,
  Zap,
  CreditCard,
  Target,
  Rocket,
  BadgeCheck,
  CheckCircle,
  ArrowUpRight,
  Lock,
  Sparkles,
  Share2,
  Download,
  Image,
  Mail,
  FileText,
  QrCode,
  Gift,
  Monitor,
  Headphones,
  Globe,
  Users,
  Calendar,
  TrendingUp,
  Flame,
  Timer,
  Copy,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/benefits/progress-ring";
import { BoosterBadge } from "@/components/benefits/booster-badge";
import { CountdownTimer } from "@/components/benefits/countdown-timer";
import { BenefitCard } from "@/components/benefits/benefit-card";

// ── Mock Data ────────────────────────────────────────────────────

const CURRENT_REFERRALS = 42;
const NEXT_TIER_THRESHOLD = 50;
const TIER_NAME = "Bronze";
const TOTAL_EARNINGS = 8750;
const CONVERSION_RATE = 34;
const AVG_DEAL_SIZE = 12400;

const now = new Date();
const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
const in12Days = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);

const tiers = [
  {
    name: "Bronze",
    icon: Award,
    threshold: 0,
    commission: "5%",
    color: "from-warning to-warning/80",
    isCurrent: true,
    perks: [
      "5% commission on referrals",
      "Basic partner dashboard",
      "Email support",
      "Referral tracking link",
      "Community access",
    ],
  },
  {
    name: "Silver",
    icon: Star,
    threshold: 50,
    commission: "10%",
    color: "from-primary to-primary-light",
    isCurrent: false,
    perks: [
      "10% commission on referrals",
      "Advanced analytics dashboard",
      "Priority support",
      "Marketing materials kit",
      "Monthly performance reports",
      "Perks marketplace access",
    ],
  },
  {
    name: "Gold",
    icon: Crown,
    threshold: 100,
    commission: "15%",
    color: "from-accent to-accent/80",
    isCurrent: false,
    perks: [
      "15% commission on referrals",
      "Dedicated account manager",
      "Early access to features",
      "Quarterly performance bonus",
      "Exclusive Gold badge",
      "Custom referral landing page",
      "VIP event invitations",
    ],
  },
];

const activeBoosters = [
  {
    id: "b1",
    title: "Weekend Sprint",
    multiplier: "2x Commission",
    expiresAt: in2Days,
    active: true,
  },
  {
    id: "b2",
    title: "Spring Referral Bonus",
    multiplier: "+$50/referral",
    expiresAt: in5Days,
    active: true,
  },
];

const upcomingCampaigns = [
  {
    id: "c1",
    title: "Home Improvement Month",
    description: "3x commissions on all home renovation referrals during May.",
    multiplier: "3x Commission",
    startsIn: "Starts May 1",
    icon: Flame,
  },
  {
    id: "c2",
    title: "Referral Marathon",
    description: "Refer 10 leads in 7 days and earn a $500 bonus on top of commissions.",
    multiplier: "$500 Bonus",
    startsIn: "Starts May 15",
    icon: Target,
  },
];

const marketingAssets = [
  { id: "ma1", icon: Image, title: "Social Media Kit", description: "Optimized banners for Instagram, Facebook, and LinkedIn.", format: "PNG/SVG" },
  { id: "ma2", icon: Mail, title: "Email Templates", description: "Pre-written email sequences for warm and cold outreach.", format: "HTML" },
  { id: "ma3", icon: FileText, title: "One-Pager PDF", description: "Professional PDF explaining Primme benefits for prospects.", format: "PDF" },
  { id: "ma4", icon: QrCode, title: "QR Code Generator", description: "Custom QR codes linking to your referral page.", format: "SVG/PNG" },
  { id: "ma5", icon: Globe, title: "Landing Page Builder", description: "Customize your referral landing page with your branding.", format: "Web" },
  { id: "ma6", icon: Monitor, title: "Presentation Deck", description: "Investor-quality slides to pitch Primme at events.", format: "PPTX" },
];

const perksMarketplace = [
  { id: "pm1", icon: Gift, title: "Amazon Gift Card", points: "5,000 pts", description: "$50 Amazon gift card redeemable instantly.", tier: "Silver+" },
  { id: "pm2", icon: Monitor, title: "MacBook Air", points: "150,000 pts", description: "Latest MacBook Air M4 for top performers.", tier: "Gold" },
  { id: "pm3", icon: Headphones, title: "AirPods Pro", points: "15,000 pts", description: "Apple AirPods Pro with noise cancellation.", tier: "Silver+" },
  { id: "pm4", icon: CreditCard, title: "Visa Prepaid Card", points: "10,000 pts", description: "$100 prepaid Visa for any purchase.", tier: "Silver+" },
  { id: "pm5", icon: Calendar, title: "Conference Ticket", points: "20,000 pts", description: "Ticket to a premium real estate or tech conference.", tier: "Gold" },
  { id: "pm6", icon: FileText, title: "Legal Consultation", points: "8,000 pts", description: "1-hour consultation with a business attorney.", tier: "Silver+" },
];

const communityEvents = [
  { id: "ev1", title: "Partner Masterclass: Advanced Referral Strategies", date: "Apr 18", type: "Webinar", spots: "124 registered" },
  { id: "ev2", title: "Quarterly Partner Meetup - Los Angeles", date: "May 5", type: "In-Person", spots: "32 spots left" },
  { id: "ev3", title: "AMA with Top Earner: Amanda R.", date: "May 12", type: "Live Q&A", spots: "Open" },
];

const monthlyChallenge = {
  title: "April Referral Challenge",
  description: "Refer 8 qualified leads this month to earn a bonus $200 and a limited-edition badge.",
  progress: 5,
  target: 8,
  reward: "$200 + Badge",
  endsAt: new Date(now.getFullYear(), now.getMonth() + 1, 0),
};

const milestones = [
  { title: "First Referral", description: "Complete your first successful referral", achieved: true, date: "Jan 2023" },
  { title: "10 Referrals", description: "Build your initial referral network", achieved: true, date: "Mar 2023" },
  { title: "Bronze Tier", description: "Qualify for Bronze tier benefits", achieved: true, date: "Jun 2023" },
  { title: "25 Referrals", description: "Grow your referral network to 25", achieved: true, date: "Nov 2023" },
  { title: "$5K Earned", description: "Cumulative earnings hit $5,000", achieved: true, date: "Feb 2024" },
  { title: "Silver Tier", description: "Reach 50 referrals for Silver tier", achieved: false, date: "8 referrals away" },
  { title: "Gold Tier", description: "Reach 100 referrals for the ultimate tier", achieved: false, date: "58 referrals away" },
];

const performanceInsights = [
  { label: "Conversion Rate", value: `${CONVERSION_RATE}%`, trend: "+5%", positive: true },
  { label: "Avg. Deal Size", value: `$${(AVG_DEAL_SIZE / 1000).toFixed(1)}K`, trend: "+12%", positive: true },
  { label: "Best Channel", value: "LinkedIn", trend: "42% of leads", positive: true },
  { label: "Projected Next Tier", value: "~6 weeks", trend: "On track", positive: true },
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

export default function PartnerBenefitsPage() {
  const progress = (CURRENT_REFERRALS / NEXT_TIER_THRESHOLD) * 100;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText("primme.com/ref/partner-0892");
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleShare = (platform: string) => {
    toast.success(`Sharing to ${platform}... (coming soon)`);
  };

  const handleDownloadAsset = (title: string) => {
    toast.success(`Downloading ${title}...`);
  };

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
                <Trophy className="w-3 h-3" /> Partner Program
              </span>
              <span className="text-label text-warning bg-warning/10 px-3 py-1 rounded-md border border-warning/20 flex items-center gap-1.5">
                <Award className="w-3 h-3" /> {TIER_NAME}
              </span>
            </div>
            <h2 className="text-h1 font-display text-foreground tracking-tight">
              Partner Benefits
            </h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium max-w-xl">
              Grow your network, climb the tiers, and unlock premium rewards as a Primme Partner.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
              onClick={handleCopyLink}
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                {copied ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-primary" />}
              </span>
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button asChild variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
              <Link href="/partner/referrals">
                <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
                Start Referring
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="px-8 lg:px-12 py-8 lg:py-10 max-w-[1600px] mx-auto space-y-10">

        {/* ── Progress Ring + Performance Stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <SurfaceCard className="p-8 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-6">
                <ProgressRing
                  value={progress}
                  size={130}
                  strokeWidth={9}
                  gradientId="partner-tier-ring"
                  gradientFrom="hsl(var(--primary))"
                  gradientTo="hsl(var(--primary-light))"
                >
                  <div className="text-center">
                    <p className="text-2xl font-black text-foreground leading-none">
                      {CURRENT_REFERRALS}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                      Referrals
                    </p>
                  </div>
                </ProgressRing>
                <div className="flex-1">
                  <h3 className="text-h3 font-display text-foreground tracking-tight">
                    {TIER_NAME} &rarr; Silver
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1 mb-3">
                    <span className="text-primary font-bold">{NEXT_TIER_THRESHOLD - CURRENT_REFERRALS} more referrals</span> to unlock{" "}
                    <span className="font-bold text-foreground">10% commissions</span>
                  </p>
                  <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-full">
              {performanceInsights.map((insight, idx) => (
                <motion.div
                  key={insight.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06 }}
                  className="bg-card rounded-2xl p-4 border border-border/20 shadow-card flex flex-col justify-between"
                >
                  <p className="text-label text-muted-foreground mb-2">{insight.label}</p>
                  <div>
                    <p className="text-xl font-black text-foreground tracking-tight">{insight.value}</p>
                    <p className={`text-xs font-bold mt-1 ${insight.positive ? "text-success" : "text-destructive"}`}>
                      {insight.trend}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Active Boosters ── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-2"
          >
            <Zap className="w-5 h-5 text-warning" />
            <h3 className="text-h2 font-display text-foreground tracking-tight">
              Active Boosters
            </h3>
            <span className="text-label text-destructive bg-destructive/10 px-2 py-0.5 rounded-md border border-destructive/20 ml-2 animate-pulse">
              Live
            </span>
          </motion.div>
          <p className="text-meta text-muted-foreground mb-6">
            Temporary earning accelerators -- stack them for maximum returns
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {activeBoosters.map((booster) => (
              <BoosterBadge
                key={booster.id}
                title={booster.title}
                multiplier={booster.multiplier}
                expiresAt={booster.expiresAt}
                active={booster.active}
              />
            ))}
          </div>
        </div>

        {/* ── Upcoming Campaigns ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Earnings Accelerators
          </motion.h3>
          <p className="text-meta text-muted-foreground mb-6">
            Upcoming campaigns to boost your commissions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {upcomingCampaigns.map((campaign, idx) => {
              const CampaignIcon = campaign.icon;
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08 }}
                  className="bg-card rounded-2xl p-6 border border-border/40 shadow-card hover:-translate-y-1 hover:shadow-elevated transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20 shrink-0">
                      <CampaignIcon className="w-6 h-6 text-warning" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-foreground">{campaign.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium mb-3">
                        {campaign.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-warning/10 text-warning text-xs font-black border border-warning/20">
                          {campaign.multiplier}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                          <Timer className="w-3 h-3" /> {campaign.startsIn}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Monthly Challenge ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SurfaceCard className="p-8 relative overflow-hidden bg-gradient-to-br from-card to-warning/[0.02]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-5 h-5 text-warning" />
                    <h3 className="text-h3 font-display text-foreground tracking-tight">
                      {monthlyChallenge.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-4">
                    {monthlyChallenge.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-foreground">
                          {monthlyChallenge.progress}/{monthlyChallenge.target} leads
                        </span>
                        <span className="font-bold text-warning">{monthlyChallenge.reward}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                        <motion.div
                          className="h-full bg-gradient-to-r from-warning to-warning/80 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(monthlyChallenge.progress / monthlyChallenge.target) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right shrink-0">
                  <p className="text-label text-muted-foreground mb-2">Ends In</p>
                  <CountdownTimer targetDate={monthlyChallenge.endsAt} />
                </div>
              </div>
            </div>
          </SurfaceCard>
        </motion.div>

        {/* ── Interactive Tier Comparison ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Partner Tiers
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                  className={`relative rounded-3xl p-8 shadow-card border transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated overflow-hidden ${
                    tier.isCurrent
                      ? "bg-card border-primary/30 border-2"
                      : "bg-card border-border/40"
                  }`}
                >
                  {tier.isCurrent && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 bg-primary text-primary-foreground text-label rounded-lg font-bold shadow-md shadow-primary/20">
                        Current
                      </span>
                    </div>
                  )}
                  {!tier.isCurrent && CURRENT_REFERRALS < tier.threshold && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  )}

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>

                  <h4 className="text-h3 font-display text-foreground tracking-tight mb-1">{tier.name}</h4>
                  <p className="text-3xl font-black text-foreground tracking-tight mb-1">{tier.commission}</p>
                  <p className="text-sm text-muted-foreground font-medium mb-6">
                    {tier.threshold === 0 ? "Starting tier" : `${tier.threshold}+ referrals`}
                  </p>

                  <div className="space-y-3">
                    {tier.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-2.5">
                        <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${tier.isCurrent ? "text-primary" : "text-muted-foreground/60"}`} />
                        <span className="text-sm font-medium text-foreground/80">{perk}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Marketing Arsenal ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Marketing Arsenal
          </motion.h3>
          <p className="text-meta text-muted-foreground mb-6">
            Professional assets to amplify your referral efforts
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {marketingAssets.map((asset, idx) => {
              const AssetIcon = asset.icon;
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="bg-card rounded-2xl p-5 border border-border/40 shadow-card hover:-translate-y-1 hover:shadow-elevated hover:border-primary/20 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover:scale-110 transition-transform">
                      <AssetIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm mb-1">{asset.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium mb-3">{asset.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">
                          {asset.format}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs font-bold text-primary hover:text-primary"
                          onClick={() => handleDownloadAsset(asset.title)}
                        >
                          <Download className="w-3 h-3 mr-1" /> Get
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <SurfaceCard className="p-5">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Share2 className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm font-bold text-foreground">Quick Share Your Referral Link</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {["WhatsApp", "Email", "LinkedIn", "Twitter"].map((platform) => (
                    <Button
                      key={platform}
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg text-xs font-bold"
                      onClick={() => handleShare(platform)}
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
            </SurfaceCard>
          </motion.div>
        </div>

        {/* ── Perks Marketplace ── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-2 mb-2"
          >
            <Gift className="w-5 h-5 text-primary" />
            <h3 className="text-h2 font-display text-foreground tracking-tight">
              Perks Marketplace
            </h3>
          </motion.div>
          <p className="text-meta text-muted-foreground mb-6">
            Redeem your points for exclusive rewards (Silver+ tiers)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perksMarketplace.map((perk, idx) => {
              const PerkIcon = perk.icon;
              const isLocked = TIER_NAME === "Bronze" && perk.tier !== "Bronze";
              return (
                <motion.div
                  key={perk.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className={`bg-card rounded-2xl p-5 border shadow-card transition-all duration-300 ${
                    isLocked
                      ? "border-border/20 opacity-60"
                      : "border-border/40 hover:-translate-y-1 hover:shadow-elevated hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
                      isLocked
                        ? "bg-muted border-border text-muted-foreground"
                        : "bg-primary/10 border-primary/20 text-primary"
                    }`}>
                      {isLocked ? <Lock className="w-5 h-5" /> : <PerkIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm mb-1">{perk.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium mb-2">{perk.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-primary">{perk.points}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {perk.tier}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Community & Events ── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-2"
          >
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-h2 font-display text-foreground tracking-tight">
              Community & Events
            </h3>
          </motion.div>
          <p className="text-meta text-muted-foreground mb-6">
            Connect, learn, and grow with fellow partners
          </p>
          <SurfaceCard className="divide-y divide-border/30">
            {communityEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.06 }}
                className="flex items-center justify-between px-6 py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.date} &middot; {event.type} &middot; {event.spots}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-bold shrink-0">
                  Register
                </Button>
              </motion.div>
            ))}
          </SurfaceCard>
        </div>

        {/* ── Milestones Timeline ── */}
        <div>
          <motion.h3
            className="text-h2 font-display text-foreground tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            Milestones & Achievements
          </motion.h3>
          <SurfaceCard className="p-8 lg:p-10">
            <div className="space-y-0">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                  className="flex gap-6 relative"
                >
                  {idx < milestones.length - 1 && (
                    <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${milestone.achieved ? "bg-primary/30" : "bg-border/50"}`} />
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm z-10 ${
                    milestone.achieved
                      ? "bg-primary/10 border-primary/30"
                      : "bg-muted border-border/50"
                  }`}>
                    {milestone.achieved ? (
                      <CheckCircle className="w-5 h-5 text-primary" strokeWidth={2.5} />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className={`pb-8 ${!milestone.achieved ? "opacity-60" : ""}`}>
                    <h4 className="font-bold text-foreground">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{milestone.description}</p>
                    <span className={`text-label mt-1 inline-block ${milestone.achieved ? "text-primary" : "text-muted-foreground"}`}>
                      {milestone.date}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </SurfaceCard>
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
                <Trophy className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-h1 font-display text-white tracking-tight mb-4">
                Ready to Level Up?
              </h3>
              <p className="text-lg text-ink-muted font-medium max-w-md mx-auto mb-8">
                You&apos;re only {NEXT_TIER_THRESHOLD - CURRENT_REFERRALS} referrals away from Silver tier. Start growing your network and unlock premium benefits.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="h-14 px-10 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 bg-gradient-to-r from-primary to-primary-light border border-white/10 ring-1 ring-inset ring-white/15">
                  <Link href="/partner/referrals">
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1.5">
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    Invite New Leads
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-2xl font-bold text-base bg-white/5 backdrop-blur-md border-white/15 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/partner/dashboard">
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/10 p-1.5 mr-1.5">
                      <BarChart3 className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    View Dashboard
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
