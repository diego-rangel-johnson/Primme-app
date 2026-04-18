"use client";

import { useState } from "react";
import {
  Link2,
  Copy,
  Download,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Award,
  DollarSign,
  Trophy,
  Mail,
  Star,
  Bell,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useSession } from "@/context/session-context";
import { getGreeting } from "@/lib/constants";
import { useReferrals } from "@/lib/supabase/hooks";

const CURRENT_REFERRALS = 42;
const NEXT_TIER_THRESHOLD = 50;

const chartData = [
  { month: "Nov", value: 18 },
  { month: "Dec", value: 24 },
  { month: "Jan", value: 28 },
  { month: "Feb", value: 32 },
  { month: "Mar", value: 38 },
  { month: "Apr", value: 42 },
];

const notifications = [
  { id: 1, icon: DollarSign, text: "Commission of $250.00 verified", time: "2h ago", color: "text-success bg-success/10 border-success/20" },
  { id: 2, icon: Star, text: "You're 8 referrals from Silver tier!", time: "5h ago", color: "text-warning bg-warning/10 border-warning/20" },
  { id: 3, icon: CheckCircle, text: "John Smith referral verified", time: "1d ago", color: "text-primary bg-primary/10 border-primary/20" },
  { id: 4, icon: TrendingUp, text: "Weekly earnings up 15% vs last week", time: "2d ago", color: "text-info bg-info/10 border-info/20" },
];

const leaderboard = [
  { rank: 1, name: "A****a R.", referrals: 156, trend: "+12" },
  { rank: 2, name: "D****l M.", referrals: 134, trend: "+8" },
  { rank: 3, name: "S****n K.", referrals: 118, trend: "+15" },
];

export default function PartnerDashboard() {
  const { user } = useSession();
  const greeting = getGreeting();
  const firstName = user?.name.split(" ")[0] ?? "Partner";
  const [copied, setCopied] = useState(false);
  const { data: referrals } = useReferrals(user?.id);
  const convertedReferrals = referrals.filter(r => r.status === "converted");
  const totalEarnings = convertedReferrals.reduce((sum, r) => sum + r.commission, 0);
  const totalReferralCount = referrals.length;
  const currentRefs = totalReferralCount || CURRENT_REFERRALS;

  const recentReferralsMapped = referrals.slice(0, 2).map((r, i) => ({
    id: i + 1,
    name: r.referred_name ?? r.referred_email,
    type: i === 0 ? "HOMEOWNER" : "SERVICE PROVIDER",
    joined: `Joined ${new Date(r.created_at!).toLocaleDateString()}`,
    amount: `$${r.commission.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    status: r.status === "converted" ? "VERIFIED" : "PENDING",
    indicator: r.status === "converted" ? "verified" : "pending",
  }));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("primme.com/ref/partner-0892");
      setCopied(true);
      toast.success("Tracking link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link. Please copy it manually.");
    }
  };

  const statusVariantMap: Record<string, "success" | "warning" | "neutral"> = {
    VERIFIED: "success",
    PENDING: "warning",
  };

  const recentReferrals = [
    {
      id: 1,
      name: "John Smith",
      type: "HOMEOWNER",
      joined: "Joined 2h ago",
      amount: "$250.00",
      status: "VERIFIED",
      indicator: "verified",
    },
    {
      id: 2,
      name: "Luxury Painters Ltd",
      type: "SERVICE PROVIDER",
      joined: "Joined 5h ago",
      amount: "$1,500.00",
      status: "PENDING",
      indicator: "pending",
    },
  ];

  const progress = (currentRefs / NEXT_TIER_THRESHOLD) * 100;
  const maxValue = Math.max(...chartData.map((d) => d.value));
  const chartHeight = 120;
  const chartWidth = 280;
  const points = chartData
    .map((d, i) => {
      const x = (i / (chartData.length - 1)) * chartWidth;
      const y = chartHeight - (d.value / maxValue) * (chartHeight - 20);
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <header className="relative z-10 px-8 lg:px-12 py-12 overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[120px] -mx-40 -my-40 pointer-events-none" />
        <div className="absolute inset-0 gradient-mesh pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-border/0 via-border/50 to-border/0" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-label text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Partner
              </span>
              <StatusBadge variant="warning" className="text-label border border-warning/20 shadow-sm shadow-warning/10">
                <Award className="w-3 h-3 mr-1" /> Bronze Tier
              </StatusBadge>
            </div>
            <h2 className="text-h1 font-display text-foreground tracking-tight">
              {greeting}, <span className="text-primary">{firstName}</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium max-w-xl">
              Track your referrals, manage campaigns, and scale your earnings.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                <Download className="w-4 h-4 text-primary" />
              </span>
              Export Data
            </Button>
            <Button
              variant="brand"
              asChild
              className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
            >
              <Link href="/partner/earnings">
                <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
                Withdraw Funds
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link href="/partner/referrals" className="block">
              <StatCard
                title="Total Clicks"
                value="1,284"
                icon={Sparkles}
                trend={{ value: 12.5, label: "Unique visitors", isPositive: true }}
                className="h-full hover:-translate-y-1 transition-transform group"
                highlight
              />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link href="/partner/referrals" className="block">
              <StatCard
                title="Active Referrals"
                value={String(totalReferralCount)}
                icon={Link2}
                trend={{ value: 8.2, label: "New users", isPositive: true }}
                className="h-full hover:-translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link href="/partner/earnings" className="block">
              <StatCard
                title="Total Earnings"
                value={`$${totalEarnings.toLocaleString()}`}
                icon={DollarSign}
                trend={{ value: 19.3, label: "Available", isPositive: true }}
                className="h-full hover:-translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        {/* Middle Row: Tracking Link + Recent Referrals */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Tracking Link */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <SurfaceCard className="p-8 lg:p-10 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20 shrink-0">
                    <Link2 className="w-7 h-7 text-primary" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-h3 font-display text-foreground tracking-tight">Your Tracking Link</h3>
                    <p className="text-meta mt-0.5">
                      ID: <span className="text-foreground font-bold">PARTNER-0892</span>
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground font-medium leading-relaxed mb-6">
                  Share your unique tracking URL across your network to earn commissions.
                </p>
                <div className="bg-muted/50 p-2 pl-6 rounded-2xl border border-border/80 flex flex-col sm:flex-row sm:items-center gap-3 shadow-inner">
                  <code className="text-sm font-bold text-foreground font-mono flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    primme.com/ref/partner-0892
                  </code>
                  <Button
                    variant="brand"
                    onClick={handleCopy}
                    className={`h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 font-semibold tracking-widest uppercase transition-all duration-300 w-full sm:w-auto text-xs ${
                      copied
                        ? "bg-success hover:bg-success/90 text-success-foreground shadow-lg shadow-success/25"
                        : "shadow-lg shadow-primary/20"
                    }`}
                  >
                    {copied ? (
                      <>
                        <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                          <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                        </span>
                        COPIED!
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                          <Copy className="w-4 h-4" strokeWidth={2.5} />
                        </span>
                        COPY LINK
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SurfaceCard>
          </motion.div>

          {/* Recent Referrals */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <SurfaceCard className="p-8 lg:p-10 h-full">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <h3 className="text-h3 font-display text-foreground tracking-tight">Recent Referrals</h3>
                <Link
                  href="/partner/referrals"
                  className="text-sm font-black text-primary hover:text-primary-light uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                  View All <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {(recentReferralsMapped.length > 0 ? recentReferralsMapped : recentReferrals).map((referral) => (
                  <Link
                    key={referral.id}
                    href="/partner/referrals"
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-border/20 hover:border-primary/30 hover:shadow-elevated hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                          referral.indicator === "verified"
                            ? "bg-success/10 border-success/20"
                            : "bg-warning/10 border-warning/20"
                        }`}
                      >
                        {referral.indicator === "verified" ? (
                          <CheckCircle className="w-6 h-6 text-success" strokeWidth={2.5} />
                        ) : (
                          <Clock className="w-6 h-6 text-warning" strokeWidth={2.5} />
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-foreground group-hover:text-primary transition-colors">{referral.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-label text-muted-foreground px-2 py-0.5 bg-muted rounded-md border border-border/50">{referral.type}</span>
                          <span className="text-xs text-muted-foreground font-medium">{referral.joined}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-border/50 sm:border-0 pt-3 sm:pt-0">
                      <p className="font-black text-xl text-foreground tracking-tight">{referral.amount}</p>
                      <StatusBadge variant={statusVariantMap[referral.status] || "neutral"} className="text-label">
                        {referral.status}
                      </StatusBadge>
                    </div>
                  </Link>
                ))}
              </div>
            </SurfaceCard>
          </motion.div>
        </div>

        {/* Bottom Row: Tier Progress + Performance Chart + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Tier Progress */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <SurfaceCard className="p-7 h-full relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-warning/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Bronze Tier</h4>
                    <p className="text-label text-muted-foreground">5% commission</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-bold text-foreground">{currentRefs} referrals</span>
                    <span className="font-bold text-muted-foreground">{NEXT_TIER_THRESHOLD}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground font-medium mb-5">
                  <span className="text-primary font-bold">{NEXT_TIER_THRESHOLD - currentRefs}</span> referrals to Silver (10%)
                </p>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
                >
                  <Link href="/partner/benefits">
                    <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                      <Trophy className="w-4 h-4 text-primary" />
                    </span>
                    View All Tiers
                  </Link>
                </Button>
              </div>
            </SurfaceCard>
          </motion.div>

          {/* Performance Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <SurfaceCard className="p-7 h-full">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Referral Trend
                </h4>
                <span className="text-label text-muted-foreground">Last 6 months</span>
              </div>
              <div className="flex items-end justify-center">
                <svg
                  viewBox={`-10 0 ${chartWidth + 20} ${chartHeight + 30}`}
                  className="w-full h-[160px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points={areaPoints} fill="url(#chartGradient)" />
                  <polyline
                    points={points}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * chartWidth;
                    const y = chartHeight - (d.value / maxValue) * (chartHeight - 20);
                    return (
                      <g key={d.month}>
                        <circle cx={x} cy={y} r="4" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2.5" />
                        <text
                          x={x}
                          y={chartHeight + 18}
                          textAnchor="middle"
                          className="fill-muted-foreground text-[10px] font-bold"
                        >
                          {d.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="px-2 py-1 bg-success/10 text-success rounded-lg text-xs font-bold border border-success/20">
                  +33% growth
                </span>
                <span className="text-xs text-muted-foreground font-medium">vs 6 months ago</span>
              </div>
            </SurfaceCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <SurfaceCard className="p-7 h-full">
              <h4 className="font-bold text-foreground mb-5">Quick Actions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleCopy}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border/40 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-primary/20">
                    <Copy className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-foreground">Copy Link</span>
                </button>
                <Link
                  href="/partner/referrals"
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border/40 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-info/20">
                    <Mail className="w-5 h-5 text-info" />
                  </div>
                  <span className="text-xs font-bold text-foreground">Invite Lead</span>
                </Link>
                <Link
                  href="/partner/benefits"
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border/40 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-warning/20">
                    <Trophy className="w-5 h-5 text-warning" />
                  </div>
                  <span className="text-xs font-bold text-foreground">Benefits</span>
                </Link>
                <button
                  onClick={() => toast.info("Marketing materials download coming soon!")}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-border/40 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-success/20">
                    <Download className="w-5 h-5 text-success" />
                  </div>
                  <span className="text-xs font-bold text-foreground">Materials</span>
                </button>
              </div>
            </SurfaceCard>
          </motion.div>
        </div>

        {/* Bottom Row: Leaderboard + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <SurfaceCard className="p-7">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Partner Leaderboard
                </h4>
                <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-label font-bold border border-primary/20">
                  You: #12 of 230
                </span>
              </div>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border/30 hover:bg-muted/30 transition-all"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border shadow-sm ${
                        entry.rank === 1
                          ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          : entry.rank === 2
                            ? "bg-slate-400/10 text-slate-500 border-slate-400/20"
                            : "bg-amber-600/10 text-amber-700 border-amber-600/20"
                      }`}
                    >
                      #{entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground">{entry.name}</p>
                      <p className="text-label text-muted-foreground">{entry.referrals} referrals</p>
                    </div>
                    <span className="px-2 py-1 bg-success/10 text-success rounded-lg text-xs font-bold border border-success/20">
                      {entry.trend}
                    </span>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </motion.div>

          {/* Recent Notifications */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            <SurfaceCard className="p-7">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" /> Recent Activity
                </h4>
                <Link href="/partner/settings" className="text-sm font-bold text-primary hover:text-primary-light transition-colors">
                  Settings
                </Link>
              </div>
              <div className="space-y-3">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-border/30 hover:bg-muted/30 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${notif.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">{notif.text}</p>
                        <p className="text-label text-muted-foreground mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SurfaceCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
