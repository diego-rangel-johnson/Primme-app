"use client";

import { Download, Plus, TrendingUp, CheckCircle, CreditCard, Building, Target, ArrowUpRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";

export default function EarningsPage() {
  const transactions = [
    {
      id: 1,
      name: "Chase Bank Transfer",
      date: "OCT 12, 2025",
      amount: "$1,450.00",
      status: "COMPLETED"
    },
    {
      id: 2,
      name: "Zelle Payout",
      date: "OCT 06, 2025",
      amount: "$2,200.00",
      status: "COMPLETED"
    },
    {
      id: 3,
      name: "Stripe Settlement",
      date: "SEP 28, 2025",
      amount: "$4,850.00",
      status: "COMPLETED"
    }
  ];

  const payoutMethods = [
    {
      id: 1,
      type: "bank",
      name: "Chase Business",
      last4: "4221",
      label: "BANK ACCOUNT",
      primary: true
    },
    {
      id: 2,
      type: "card",
      name: "Visa Business",
      last4: "8812",
      label: "CARD ACCOUNT",
      primary: false
    },
    {
      id: 3,
      type: "bank",
      name: "Wells Fargo",
      last4: "0921",
      label: "BANK ACCOUNT",
      primary: false
    },
    {
      id: 4,
      type: "bank",
      name: "Bank of America",
      last4: "5530",
      label: "BANK ACCOUNT",
      primary: false
    }
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Immersive Glassmorphic Header */}
      <header className="relative z-10 px-6 lg:px-12 py-10 overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mx-40 -my-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-border/0 via-border/50 to-border/0" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-label text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20 flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" /> Financials
              </span>
            </div>
            <h2 className="text-h1 font-display text-foreground tracking-tight">Earnings Ledger</h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium max-w-xl">
              Track your revenue, payouts, and financial growth securely.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
              onClick={() => toast.success("Export started. Your report will download shortly.")}
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                <Download className="w-4 h-4 text-primary" />
              </span>
              Export Report
            </Button>
            <Button
              variant="brand"
              className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold group"
              onClick={() => toast.success("Withdrawal initiated safely to your primary account.")}
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </span>
              Withdraw Funds
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 lg:p-12 max-w-[1600px] mx-auto">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-ink rounded-3xl p-8 shadow-overlay hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 delay-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mx-10 -my-10 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <span className="text-label text-ink-muted flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary-light" /> Available Balance
              </span>
              <span className="px-2.5 py-1 bg-white/10 text-ink-foreground rounded-lg text-label flex items-center gap-1 border border-white/5 backdrop-blur-md">
                <CheckCircle className="w-3 h-3 text-success" /> Ready
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-ink-foreground to-ink-foreground/70">
                $4,260.00
              </p>
              <p className="text-sm font-bold text-neutral-500 mt-2">Cleared for withdrawal</p>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:-translate-y-1 hover:shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 delay-200 relative overflow-hidden">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-8">
                <span className="text-label text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-warning" /> Projected Pipeline
                </span>
                <span className="px-2.5 py-1 bg-warning/10 text-warning rounded-lg text-label flex items-center gap-1 border border-warning/20">
                  <Clock className="w-3 h-3" /> Pending
                </span>
              </div>
              <div>
                <div className="text-5xl font-black tracking-tighter text-foreground">
                  $12,400.00
                </div>
                <p className="text-sm font-bold text-muted-foreground mt-2">Active milestones in progress</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:-translate-y-1 hover:shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 delay-300 relative overflow-hidden">
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-8">
                <span className="text-label text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" /> Total Gross Volume
                </span>
                <span className="px-2.5 py-1 bg-success/10 text-success rounded-lg text-label flex items-center gap-1 border border-success/20">
                  <TrendingUp className="w-3 h-3" /> +18.4%
                </span>
              </div>
              <div>
                <div className="text-5xl font-black tracking-tighter text-foreground">
                  $142,850.00
                </div>
                <p className="text-sm font-bold text-muted-foreground mt-2">Versus previous month</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Recent Transactions Premium Floating List */}
          <div className="xl:col-span-2 bg-card rounded-3xl p-8 lg:p-10 shadow-card border border-border/40 animate-in fade-in duration-700 delay-400">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center -ml-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-h2 font-display text-foreground tracking-tight">Recent Transactions</h3>
              </div>
              <Button variant="ghost" className="text-sm font-black text-primary hover:text-primary-light uppercase tracking-widest flex items-center gap-1 transition-colors px-2">
                View All <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-border/40 hover:border-border/80 hover:shadow-md hover:bg-muted/30 transition-all duration-300 cursor-pointer bg-background/50"
                >
                  <div className="flex items-center gap-5 mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0 border border-success/20 shadow-card group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-5 h-5 text-success" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">{transaction.name}</p>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{transaction.date}</p>
                    </div>
                  </div>

                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-border/50 sm:border-0 pt-4 sm:pt-0">
                    <div>
                      <p className="font-black text-xl text-foreground tracking-tight">{transaction.amount}</p>
                    </div>
                    <StatusBadge variant="success" className="mt-1 font-bold text-label shadow-card">
                      {transaction.status}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border/50 flex justify-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> All payments up to date
              </span>
            </div>
          </div>

          {/* Connected Financial Accounts */}
          <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-card border border-border/40 animate-in fade-in duration-700 delay-500">
            <div className="flex flex-col mb-8 pb-6 border-b border-border/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-h2 font-display text-foreground tracking-tight">Payout Methods</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" className="w-10 h-10 rounded-xl shadow-card hover:shadow-md hover:scale-105 transition-all" onClick={() => toast.info("Opening Add Account dialog...")}>
                        <Plus className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="font-bold">Add Account</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Manage your connected banks and debit cards securely.</p>
            </div>

            <div className="space-y-4">
              {payoutMethods.map((method) => (
                <div
                  key={method.id}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group overflow-hidden ${method.primary
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                      : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                    }`}
                >
                  {method.primary && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl -mr-8 -mt-8" />
                  )}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform ${method.primary ? "bg-primary text-white" : "bg-muted text-muted-foreground border border-border/50"
                      }`}>
                      {method.type === "card" ? (
                        <CreditCard className="w-6 h-6" strokeWidth={2} />
                      ) : (
                        <Building className="w-6 h-6" strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-extrabold truncate text-base ${method.primary ? "text-foreground" : "text-foreground group-hover:text-primary transition-colors"}`}>
                        {method.name} •••• {method.last4}
                      </p>
                      <p className="text-label text-muted-foreground mt-0.5">{method.label}</p>
                    </div>
                    {method.primary && (
                      <div className="shrink-0 bg-primary/10 p-1.5 rounded-full">
                        <CheckCircle className="w-5 h-5 text-primary" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <Button variant="link" className="text-xs font-black text-muted-foreground hover:text-foreground uppercase tracking-widest h-auto p-0">
                Manage Routing Numbers
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
