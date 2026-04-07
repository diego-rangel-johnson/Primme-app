"use client";

import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Mail,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";

const ITEMS_PER_PAGE = 3;

type FilterTab = "ALL" | "VERIFIED" | "PENDING";

export default function PartnerReferralsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");
  const [inviteEmail, setInviteEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const statusVariantMap: Record<string, "success" | "warning" | "neutral"> = {
    VERIFIED: "success",
    PENDING: "warning",
  };

  const referrals = [
    {
      id: 1,
      initial: "J",
      name: "John Smith",
      email: "john.s***@gmail.com",
      type: "Homeowner",
      commission: "$25.00",
      status: "VERIFIED",
      date: "Jan 15, 2024",
      avatarColor: "bg-info/10 text-info border-info/20",
    },
    {
      id: 2,
      initial: "L",
      name: "Luxury Painters Ltd",
      email: "contact@lux***painters.com",
      type: "Service Provider",
      commission: "$150.00",
      status: "PENDING",
      date: "Jan 14, 2024",
      avatarColor: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    },
    {
      id: 3,
      initial: "S",
      name: "Sarah Williams",
      email: "sarah.w***@outlook.com",
      type: "Homeowner",
      commission: "$25.00",
      status: "VERIFIED",
      date: "Jan 12, 2024",
      avatarColor: "bg-success/10 text-success border-success/20",
    },
    {
      id: 4,
      initial: "M",
      name: "Modern Builds Co",
      email: "info@modern***co.com",
      type: "Service Provider",
      commission: "$250.00",
      status: "VERIFIED",
      date: "Jan 10, 2024",
      avatarColor: "bg-primary/10 text-primary border-primary/20",
    },
    {
      id: 5,
      initial: "M",
      name: "Michael Chen",
      email: "m.chen***@yahoo.com",
      type: "Homeowner",
      commission: "$25.00",
      status: "VERIFIED",
      date: "Jan 8, 2024",
      avatarColor: "bg-destructive/10 text-destructive border-destructive/20",
    },
  ];

  const filtered = referrals.filter((r) => {
    const matchesFilter = activeFilter === "ALL" || r.status === activeFilter;
    const matchesSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success(`Invitation sent to ${inviteEmail}!`);
    setInviteEmail("");
  };

  const filterTabs: { label: string; value: FilterTab; count: number }[] = [
    { label: "All", value: "ALL", count: referrals.length },
    { label: "Verified", value: "VERIFIED", count: referrals.filter((r) => r.status === "VERIFIED").length },
    { label: "Pending", value: "PENDING", count: referrals.filter((r) => r.status === "PENDING").length },
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-10 overflow-hidden bg-background">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mx-40 -my-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-border/0 via-border/50 to-border/0" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-label text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Network
              </span>
            </div>
            <h2 className="text-h1 font-display text-foreground tracking-tight">Referrals History</h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium max-w-xl">
              Track your converted leads and pending commissions in real-time.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                <Download className="w-4 h-4 text-primary" />
              </span>
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-12 max-w-[1600px] mx-auto">
        {/* Invite Lead Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-ink rounded-3xl p-6 lg:p-8 shadow-overlay relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -mx-10 -my-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
                  <Mail className="w-6 h-6 text-primary-light" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Invite a New Lead</h3>
                  <p className="text-sm text-neutral-400 font-medium">Send a referral invitation directly via email.</p>
                </div>
              </div>
              <form onSubmit={handleInvite} className="flex gap-3 flex-1 max-w-md">
                <Input
                  type="email"
                  placeholder="lead@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 h-12 rounded-xl bg-white/10 border-white/15 text-white placeholder:text-neutral-500 focus:border-primary/50"
                />
                <Button type="submit" variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
                  <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                    <Send className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                  Invite
                </Button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:-translate-y-1 hover:shadow-md transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-warning/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <span className="text-label text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-warning" /> Total Referrals
              </span>
              <span className="px-2.5 py-1 bg-warning/10 text-warning rounded-lg text-label flex items-center gap-1 border border-warning/20">
                <TrendingUp className="w-3 h-3" /> +8.2%
              </span>
            </div>
            <p className="text-5xl font-black tracking-tighter text-foreground">42</p>
            <p className="text-sm font-bold text-muted-foreground mt-2">Active network members</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-ink rounded-3xl p-8 shadow-overlay hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mx-10 -my-10 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <span className="text-label text-ink-muted flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary-light" /> Total Earned
              </span>
              <span className="px-2.5 py-1 bg-white/10 text-ink-foreground rounded-lg text-label flex items-center gap-1 border border-white/5 backdrop-blur-md">
                <TrendingUp className="w-3 h-3" /> +15.3%
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-ink-foreground to-ink-foreground/70">$3,450</p>
              <p className="text-sm font-bold text-neutral-500 mt-2">Lifetime commission volume</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:-translate-y-1 hover:shadow-md transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-info/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <span className="text-label text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-info" /> Avg. Commission
              </span>
              <span className="px-2.5 py-1 bg-info/10 text-info rounded-lg text-label flex items-center gap-1 border border-info/20">
                <TrendingUp className="w-3 h-3" /> +4.1%
              </span>
            </div>
            <p className="text-5xl font-black tracking-tighter text-foreground">$82.14</p>
            <p className="text-sm font-bold text-muted-foreground mt-2">Per successful conversion</p>
          </motion.div>
        </div>

        {/* List Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl p-6 lg:p-8 shadow-card border border-border/40"
        >
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-h3 font-display text-foreground tracking-tight px-2">Referral Tracking</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-11 h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-background transition-colors placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 px-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setActiveFilter(tab.value); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === tab.value
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/50"
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-md text-label ${
                  activeFilter === tab.value ? "bg-white/20" : "bg-background border border-border/50"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-border/50 bg-background/50">
            <table className="w-full min-w-[800px] border-collapse" aria-label="Referrals list">
              <thead className="bg-muted/80 backdrop-blur-sm sticky top-0 border-b border-border/50">
                <tr>
                  <th className="px-6 py-5 text-left text-label text-muted-foreground w-[30%]">User Information</th>
                  <th className="px-6 py-5 text-left text-label text-muted-foreground">Account Type</th>
                  <th className="px-6 py-5 text-left text-label text-muted-foreground">Commission</th>
                  <th className="px-6 py-5 text-left text-label text-muted-foreground">Status</th>
                  <th className="px-6 py-5 text-right text-label text-muted-foreground">Date Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((referral) => (
                  <tr key={referral.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-card ${referral.avatarColor}`}>
                          <span className="font-extrabold text-lg">{referral.initial}</span>
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">{referral.name}</p>
                          <p className="text-sm text-muted-foreground font-medium mt-0.5">{referral.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge variant={referral.type === "Service Provider" ? "warning" : "neutral"} className="font-bold text-label shadow-card">
                        {referral.type}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-extrabold text-lg text-foreground tracking-tight">{referral.commission}</span>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge variant={statusVariantMap[referral.status] || "neutral"} className="font-bold text-label shadow-card">
                        {referral.status === "PENDING" && (
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-current opacity-90" />
                          </span>
                        )}
                        {referral.status}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-sm text-foreground/80 font-semibold">{referral.date}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-muted-foreground font-medium">No referrals found matching your criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(() => {
            const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
            const startItem = filtered.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
            const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

            return (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <span className="text-sm text-muted-foreground font-medium">
                  Showing <span className="font-bold text-foreground">{startItem}-{endItem}</span> of <span className="font-bold text-foreground">{filtered.length}</span> referrals
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-border/50 hover:bg-muted"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-1.5 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        className={`w-10 h-10 rounded-xl font-bold ${
                          currentPage === page
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-border/50 hover:bg-muted"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })()}
        </motion.div>
      </div>
    </div>
  );
}
