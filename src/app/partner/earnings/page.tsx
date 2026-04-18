"use client";

import {
  TrendingUp,
  CheckCircle,
  Download,
  ArrowUpRight,
  DollarSign,
  Building,
  Plus,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/status-badge";
import { useReferrals } from "@/lib/supabase/hooks";
import { useSession } from "@/context/session-context";

const monthlyEarnings = [
  { month: "Jul", amount: 1200 },
  { month: "Aug", amount: 1850 },
  { month: "Sep", amount: 2100 },
  { month: "Oct", amount: 3450 },
];

const MONTHLY_GOAL = 5000;
const CURRENT_MONTH_EARNED = 3450;

export default function PartnerEarningsPage() {
  const { user } = useSession();
  const { data: referrals } = useReferrals(user?.id);

  const totalEarned = referrals.filter(r => r.status === "converted").reduce((s, r) => s + r.commission, 0);

  const mappedPayouts = referrals.filter(r => r.status === "converted" && r.commission > 0).map((r, i) => ({
    id: `TXN-${String(i + 1).padStart(3, "0")}`,
    amount: `$${r.commission.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    date: new Date(r.created_at!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    method: "Bank Transfer",
    status: "COMPLETED" as const,
  }));

  const payoutHistory = [
    { id: "TXN-8291", amount: "$1,250.00", date: "Oct 24, 2024", method: "Bank Transfer (**** 4291)", status: "COMPLETED" },
    { id: "TXN-8012", amount: "$850.00", date: "Oct 12, 2024", method: "PayPal (alex***@gmail.com)", status: "COMPLETED" },
    { id: "TXN-7941", amount: "$1,450.00", date: "Sep 28, 2024", method: "Bank Transfer (**** 4291)", status: "COMPLETED" },
    { id: "TXN-7231", amount: "$600.00", date: "Sep 15, 2024", method: "Bank Transfer (**** 1120)", status: "FAILED" },
  ];

  const maxEarning = Math.max(...monthlyEarnings.map((m) => m.amount));
  const goalProgress = (CURRENT_MONTH_EARNED / MONTHLY_GOAL) * 100;

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-10 overflow-hidden bg-background">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mx-40 -my-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-border/0 via-border/50 to-border/0" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-label text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20 flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" /> Partner Finance
              </span>
            </div>
            <h2 className="text-h1 font-display text-foreground tracking-tight">Withdrawals</h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium max-w-xl">
              Track your referral earnings and request your next payout securely.
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
              Tax Documents
            </Button>
            <Button
              variant="brand"
              className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </span>
              Request Payout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-12 max-w-[1600px] mx-auto">
        {/* Top Row: Balance + Payout Method + Monthly Goal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 bg-ink rounded-3xl p-8 shadow-overlay hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -mx-10 -my-10 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
            <div className="relative z-10">
              <span className="text-label text-ink-muted flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-primary-light" /> Available Balance
              </span>
              <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-ink-foreground to-ink-foreground/70 mb-3">
                ${totalEarned.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </p>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="px-3 py-1.5 bg-success/10 text-success rounded-lg text-xs font-black tracking-widest flex items-center gap-1.5 border border-success/20 backdrop-blur-md shadow-card">
                  <TrendingUp className="w-3.5 h-3.5" /> +$420 this week
                </div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                  Next Payout: OCT 31, 2024
                </p>
              </div>
              <Button variant="brand" className="w-full h-12 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
                <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
                Request Payout
              </Button>
            </div>
          </motion.div>

          {/* Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:-translate-y-1 hover:shadow-md transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-h3 font-display text-foreground tracking-tight">Earnings Overview</h3>
              <span className="text-label text-muted-foreground">Last 4 months</span>
            </div>
            <div className="flex items-end justify-between gap-3 h-[140px]">
              {monthlyEarnings.map((item, idx) => {
                const barHeight = (item.amount / maxEarning) * 100;
                const isLast = idx === monthlyEarnings.length - 1;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-foreground">${(item.amount / 1000).toFixed(1)}k</span>
                    <motion.div
                      className={`w-full rounded-xl ${isLast ? "bg-gradient-to-t from-primary to-primary-light" : "bg-muted"}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeight}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                    />
                    <span className="text-label text-muted-foreground font-bold">{item.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="px-2.5 py-1 bg-success/10 text-success rounded-lg text-xs font-bold border border-success/20">
                +64% growth
              </span>
              <span className="text-xs text-muted-foreground font-medium">Jul &rarr; Oct</span>
            </div>
          </motion.div>

          {/* Monthly Goal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:-translate-y-1 hover:shadow-md transition-all duration-500 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
                <Target className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="text-h3 font-display text-foreground tracking-tight">Monthly Goal</h3>
                <p className="text-label text-muted-foreground">October 2024</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-foreground tracking-tight">${CURRENT_MONTH_EARNED.toLocaleString()}</span>
                <span className="text-lg font-bold text-muted-foreground">/ ${MONTHLY_GOAL.toLocaleString()}</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden border border-border/50 mb-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-warning to-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                <span className="text-warning font-bold">{Math.round(goalProgress)}%</span> of your monthly target reached.{" "}
                <span className="text-foreground font-bold">${(MONTHLY_GOAL - CURRENT_MONTH_EARNED).toLocaleString()}</span> to go!
              </p>
            </div>

            {/* Connected Payout Method mini */}
            <div className="mt-6 pt-5 border-t border-border/50">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/30">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">Bank Transfer</p>
                  <p className="text-label text-muted-foreground">**** 4291</p>
                </div>
                <span className="text-label text-primary font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Default
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payout History */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-3xl p-8 lg:p-10 shadow-card border border-border/40"
        >
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center -ml-2">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-h2 font-display text-foreground tracking-tight">Payout History</h3>
            </div>
            <Button variant="ghost" className="text-sm font-black text-primary hover:text-primary-light uppercase tracking-widest flex items-center gap-1 transition-colors px-2">
              Download All <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {(mappedPayouts.length > 0 ? mappedPayouts : payoutHistory).map((payout) => (
              <div
                key={payout.id}
                className="group flex flex-col md:flex-row md:items-center justify-between p-5 lg:px-6 rounded-2xl border border-border/40 hover:border-border/80 hover:shadow-md hover:bg-muted/30 transition-all duration-300 cursor-pointer bg-background/50"
              >
                <div className="flex items-start gap-5 mb-4 md:mb-0 w-full md:w-auto">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-card group-hover:scale-105 transition-transform ${
                      payout.status === "COMPLETED" ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"
                    }`}
                  >
                    {payout.status === "COMPLETED" ? (
                      <CheckCircle className="w-6 h-6 text-success" strokeWidth={2.5} />
                    ) : (
                      <span className="text-destructive font-extrabold text-xl">!</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">{payout.id}</p>
                      <span className="text-xs font-bold text-muted-foreground">&bull;</span>
                      <p className="text-sm text-muted-foreground font-semibold">{payout.date}</p>
                    </div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 truncate max-w-[200px] sm:max-w-xs">{payout.method}</p>
                  </div>
                </div>

                <div className="md:text-right flex md:flex-col items-center md:items-end justify-between md:justify-center border-t border-border/50 md:border-0 pt-4 md:pt-0 w-full md:w-auto">
                  <p className="font-black text-2xl tracking-tighter text-foreground">{payout.amount}</p>
                  <StatusBadge variant={payout.status === "COMPLETED" ? "success" : "error"} className="mt-1 font-bold text-label shadow-card">
                    {payout.status}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
