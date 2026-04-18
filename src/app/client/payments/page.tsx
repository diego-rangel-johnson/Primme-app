"use client";

import { Download, Plus, TrendingUp, ArrowRight, CheckCircle, CreditCard, Building, Trash2, Calendar, Clock, Shield, BarChart4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/status-badge";
import { usePayments } from "@/lib/supabase/hooks";
import { useSession } from "@/context/session-context";

export default function PaymentsPage() {
  const { user } = useSession();
  const { data: dbPayments } = usePayments(user?.id);

  const mappedHistory = dbPayments.map((p, i) => ({
    id: i + 1,
    date: new Date(p.created_at!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: p.status.toUpperCase(),
    title: p.description ?? "Payment",
    amount: `$${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    type: p.status as "pending" | "completed",
  }));

  const pendingTotal = dbPayments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const completedTotal = dbPayments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const recentHistory = [
    {
      id: 1,
      date: "NOV 15, 2024 AT 09:00 AM",
      status: "WAITING FOR APPROVAL",
      title: "Milestone 1: Prep Work Complete",
      amount: "$1,200.00",
      type: "pending"
    },
    {
      id: 2,
      date: "OCT 24, 2024 AT 06:00 AM",
      status: "PAYMENT",
      title: "Deposit: Main Residence Renovation",
      amount: "$2,500.00",
      type: "completed"
    },
    {
      id: 3,
      date: "NOV 02, 2024 AT 08:00 AM",
      status: "PAYMENT",
      title: "Material Costs: Paint & Supplies",
      amount: "$850.00",
      type: "completed"
    },
    {
      id: 4,
      date: "OCT 10, 2024 AT 09:00 AM",
      status: "PAYMENT",
      title: "Deposit: Coastal Property Exterior",
      amount: "$1,800.00",
      type: "completed"
    },
    {
      id: 5,
      date: "SEP 28, 2024 AT 09:00 AM",
      status: "PAYMENT",
      title: "Final Payment: Downtown Loft",
      amount: "$3,200.00",
      type: "completed"
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      name: "Mastercard",
      last4: "4242",
      label: "CARD ACCOUNT",
      primary: true
    },
    {
      id: 2,
      type: "card",
      name: "Visa",
      last4: "1234",
      label: "CARD ACCOUNT",
      primary: false
    },
    {
      id: 3,
      type: "zelle",
      name: "Zelle",
      last4: ".com",
      label: "ZELLE ACCOUNT",
      primary: false
    },
    {
      id: 4,
      type: "bank",
      name: "Bank of America",
      last4: "8890",
      label: "BANK ACCOUNT",
      primary: false
    }
  ];

  return (
    <div className="min-h-full flex flex-col bg-muted/20">
      {/* Premium Header */}
      <header className="lg:sticky lg:top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 lg:px-10 py-6 overflow-hidden">
        {/* Subtle Atmospheric Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50" />

        <div className="relative animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-label rounded-full ring-1 ring-primary/20 shadow-card mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Financial Security
              </span>
              <h2 className="text-h1 font-display text-foreground tracking-tight">Payments & Billing</h2>
              <p className="text-muted-foreground font-medium mt-1">
                Manage your transactions, escrow balances, and secure payment methods.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300 flex-1 md:flex-none"
              >
                <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                  <Download className="w-4 h-4 text-primary" />
                </span>
                Statement
              </Button>
              <Button
                variant="brand"
                className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold flex-1 md:flex-none"
              >
                <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </span>
                Add Method
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 lg:px-10 py-8 lg:py-10 flex-1">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">

          {/* Next Milestone Due */}
          <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 border border-border/40 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 fill-mode-both delay-100">
            <StatusBadge variant="primary" className="inline-flex items-center mb-6 shadow-card border border-primary/20 bg-primary/10">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-label text-primary">NEXT MILESTONE DUE</span>
            </StatusBadge>

            <p className="text-display font-display text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors duration-500">${pendingTotal > 0 ? dbPayments.find(p => p.status === 'pending')?.amount.toLocaleString(undefined, {minimumFractionDigits: 2}) ?? '0.00' : '0.00'}</p>

            <div className="flex items-center gap-2 mt-4 text-label text-primary bg-primary/5 w-fit px-3 py-1.5 rounded-lg">
              <Calendar className="w-3.5 h-3.5" />
              DUE IN 4 DAYS (NOV 15)
            </div>

            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700">
              <Clock className="w-16 h-16 text-primary" strokeWidth={1} />
            </div>
          </div>

          {/* Contract Balance */}
          <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 border border-border/40 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 fill-mode-both delay-200">
            <span className="inline-block px-3 py-1.5 bg-muted/50 border border-border/50 text-muted-foreground text-label rounded-full mb-6 shadow-card">
              CONTRACT BALANCE
            </span>

            <p className="text-display font-display text-foreground mb-3 tracking-tight">$5,800.00</p>

            <div className="flex items-center gap-2 mt-4 text-label text-success bg-success/10 w-fit px-3 py-1.5 rounded-lg border border-success/20">
              <CheckCircle className="w-3.5 h-3.5" strokeWidth={3} />
              SECURED IN PRIMME ESCROW
            </div>

            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-muted rounded-full blur-2xl group-hover:bg-success/5 transition-colors duration-700" />
            <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
              <Shield className="w-16 h-16 text-foreground" strokeWidth={1} />
            </div>
          </div>

          {/* Total Invested */}
          <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 border border-border/40 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 fill-mode-both delay-300">
            <span className="inline-block px-3 py-1.5 bg-muted/50 border border-border/50 text-muted-foreground text-label rounded-full mb-6 shadow-card">
              TOTAL INVESTED (YTD)
            </span>

            <p className="text-display font-display text-foreground mb-3 tracking-tight">${completedTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>

            <div className="flex items-center gap-2 mt-4 text-label text-muted-foreground bg-muted/50 w-fit px-3 py-1.5 rounded-lg border border-border/50">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              +12.4% VS LAST YEAR
            </div>

            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-muted rounded-full blur-2xl group-hover:bg-primary/5 transition-colors duration-700" />
            <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
              <BarChart4 className="w-16 h-16 text-foreground" strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent History */}
          <div className="lg:col-span-2 bg-card rounded-3xl p-8 shadow-card border border-border/40 animate-in fade-in slide-in-from-bottom-8 fill-mode-both delay-400">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shadow-inner">
                  <TrendingUp className="w-5 h-5 text-success" strokeWidth={2.5} />
                </div>
                <h3 className="text-h3 font-display text-foreground tracking-tight">Recent Ledger</h3>
              </div>
              <Button variant="ghost" className="text-label text-primary hover:text-primary-light hover:bg-primary/10 transition-colors">
                Full Ledger
              </Button>
            </div>

            <div className="space-y-4">
              {(mappedHistory.length > 0 ? mappedHistory : recentHistory).map((transaction, i) => (
                <div
                  key={transaction.id}
                  className="group flex flex-col sm:flex-row sm:items-center gap-5 p-5 rounded-2xl hover:bg-muted/50 transition-all duration-300 border border-transparent hover:border-border/50 hover:shadow-sm"
                  style={{ animationDelay: `${400 + (i * 100)}ms` }}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative ${transaction.type === "completed" ? "bg-success/10" : "bg-primary/10"
                    }`}>
                    {transaction.type === "completed" ? (
                      <CheckCircle className="w-6 h-6 text-success relative z-10" strokeWidth={2} />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                        <span className="w-3 h-3 bg-primary rounded-full relative z-10 animate-ping shadow-[0_0_10px_hsl(var(--primary)_/_0.8)]" />
                      </>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <p className="font-extrabold text-foreground text-lg truncate group-hover:text-primary transition-colors">{transaction.title}</p>
                      <p className={`font-black tracking-tight ${transaction.type === "completed" ? "text-foreground" : "text-primary"} sm:text-right text-lg shrink-0`}>
                        {transaction.amount}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="text-label text-muted-foreground bg-background/50 px-2.5 py-1 rounded-md border border-border/40 shadow-card w-fit">{transaction.date}</span>

                      <StatusBadge variant={transaction.type === "completed" ? "success" : "primary"} className="inline-flex items-center text-label px-2 py-0.5 rounded shadow-card">
                        {transaction.type !== "completed" && (
                          <span className="relative flex h-1.5 w-1.5 mr-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
                          </span>
                        )}
                        {transaction.status}
                      </StatusBadge>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="hidden sm:flex shrink-0 w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 group-hover:bg-primary/10 group-hover:text-primary transition-all -translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 animate-in fade-in slide-in-from-bottom-8 fill-mode-both delay-500 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner">
                  <CreditCard className="w-5 h-5 text-primary" strokeWidth={2.5} />
                </div>
                <h3 className="text-h3 font-display text-foreground tracking-tight">Methods</h3>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors h-9 w-9" aria-label="Add">
                    <Plus className="w-5 h-5" strokeWidth={3} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add New Method</TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer group ${method.primary
                    ? "border-primary bg-primary/5 shadow-card ring-2 ring-primary/10"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden ${method.primary ? "bg-primary" : "bg-muted"
                      }`}>
                      {method.type === "card" ? (
                        <CreditCard className={`w-6 h-6 ${method.primary ? "text-white" : "text-muted-foreground"}`} strokeWidth={1.5} />
                      ) : method.type === "bank" ? (
                        <Building className={`w-6 h-6 ${method.primary ? "text-white" : "text-muted-foreground"}`} strokeWidth={1.5} />
                      ) : (
                        <span className={`text-2xl font-black italic ${method.primary ? "text-white" : "text-muted-foreground"}`}>Z</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-extrabold text-foreground text-sm mb-1">{method.name} <span className="text-muted-foreground font-semibold">•••• {method.last4}</span></p>
                      <p className="text-label text-muted-foreground">{method.label}</p>
                    </div>

                    <div className="flex items-center">
                      {!method.primary && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all" aria-label="Remove">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove</TooltipContent>
                        </Tooltip>
                      )}

                      {method.primary && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-card">
                          <CheckCircle className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground leading-relaxed text-center">
                All transactions map directly through Primme's secure escrow network via Stripe Connect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
