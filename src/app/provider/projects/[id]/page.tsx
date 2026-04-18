"use client";

import {
  ArrowLeft, LayoutGrid, Calendar, DollarSign, Archive, MapPin, Clock,
  Plus, CheckCircle, Users, Circle, MessageSquare, FileText, Download,
  Upload, Image as ImageIcon, Activity, Target, ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { useProject, useMilestones, useDocuments, useProjectMembers } from "@/lib/supabase/hooks";

/* ─── Fallback Mock Data ─── */

const fallbackMilestones = [
  { id: 1, phase: "Site Inspection & Estimate", status: "completed", date: "OCT 20", amount: "$1,500", description: "Initial walkthrough, surface assessment, and detailed quote preparation." },
  { id: 2, phase: "Surface Preparation", status: "completed", date: "OCT 28", amount: "$2,500", description: "Power washing, scraping, sanding, priming, and masking." },
  { id: 3, phase: "First Coat Application", status: "active", date: "NOV 10", amount: "$3,500", subtitle: "IN PROGRESS", description: "Full first coat on all exterior surfaces including trim and fascia." },
  { id: 4, phase: "Final Coat & Touch-ups", status: "upcoming", date: "NOV 25", amount: "$4,200", description: "Second coat, detail work, and final quality inspection." },
  { id: 5, phase: "Client Walkthrough & Sign-off", status: "upcoming", date: "DEC 01", amount: "$3,500", description: "Final review with homeowner, punch list, and project close-out." },
];

const fallbackCrewMembers = [
  { name: "Carlos Martinez", role: "Lead Painter", img: "https://i.pravatar.cc/150?img=14", online: true },
  { name: "James Wilson", role: "Painter", img: "https://i.pravatar.cc/150?img=15", online: true },
  { name: "Alex Chen", role: "Prep Specialist", img: "https://i.pravatar.cc/150?img=16", online: false },
];

const fallbackDocuments: { name: string; type: "contract" | "invoice" | "photo" | "report"; date: string; size: string }[] = [
  { name: "Signed Contract", type: "contract", date: "Oct 15, 2024", size: "2.4 MB" },
  { name: "Detailed Estimate", type: "invoice", date: "Oct 18, 2024", size: "1.1 MB" },
  { name: "Progress Photos - Week 1", type: "photo", date: "Oct 28, 2024", size: "12.3 MB" },
  { name: "Progress Photos - Week 2", type: "photo", date: "Nov 05, 2024", size: "15.8 MB" },
  { name: "Change Order CO-001", type: "report", date: "Nov 10, 2024", size: "890 KB" },
  { name: "Material Invoice - Sherwin Williams", type: "invoice", date: "Oct 22, 2024", size: "540 KB" },
];

const activityLog = [
  { action: "Milestone completed", detail: "Surface Preparation signed off by client", date: "Oct 28", actor: "You", icon: "milestone" as const },
  { action: "Payment received", detail: "$2,500.00 released from escrow", date: "Oct 29", actor: "System", icon: "payment" as const },
  { action: "Change order received", detail: "CO-001: Premium Baseboards", date: "Nov 05", actor: "Client", icon: "change" as const },
  { action: "Message received", detail: "Client asked about color options", date: "Nov 08", actor: "Sarah Johnson", icon: "message" as const },
  { action: "Photo uploaded", detail: "Progress Photos - Week 2", date: "Nov 05", actor: "You", icon: "photo" as const },
];

const DOC_ICONS: Record<string, typeof FileText> = {
  contract: FileText,
  invoice: DollarSign,
  photo: ImageIcon,
  report: Activity,
};

/* ─── Page ─── */

export default function ProviderProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: project } = useProject(id);
  const { data: dbMilestones } = useMilestones(id);
  const { data: dbDocuments } = useDocuments(id);
  const { data: dbMembers } = useProjectMembers(id);

  const mappedMilestones = dbMilestones.map((m, i) => ({
    id: i + 1,
    phase: m.title,
    status: m.status === "in_progress" ? "active" as const : m.status === "pending" ? "upcoming" as const : "completed" as const,
    date: m.due_date ? new Date(m.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase() : "TBD",
    amount: project ? `$${Math.round((project.budget ?? 0) / dbMilestones.length).toLocaleString()}` : "—",
    description: m.title,
    subtitle: m.status === "in_progress" ? "IN PROGRESS" : undefined,
  }));

  const mappedCrew = dbMembers.map((m) => ({
    name: m.profile?.name ?? "Team Member",
    role: m.role_in_project === "contractor" ? "Lead Contractor" : m.role_in_project === "owner" ? "Homeowner" : m.role_in_project,
    img: m.profile?.avatar_url ?? `https://i.pravatar.cc/150?u=${m.user_id}`,
    online: true,
  }));

  const mappedDocs = dbDocuments.map((d) => ({
    name: d.name,
    type: (d.type ?? "report") as "contract" | "invoice" | "photo" | "report",
    date: new Date(d.created_at!).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    size: "—",
  }));

  const milestones = mappedMilestones.length > 0 ? mappedMilestones : fallbackMilestones;
  const crewMembers = mappedCrew.length > 0 ? mappedCrew : fallbackCrewMembers;
  const documents = mappedDocs.length > 0 ? mappedDocs : fallbackDocuments;

  const totalContract = project?.budget ?? 15200;
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPct = project?.progress ?? Math.round((completedCount / milestones.length) * 100 + (milestones.some((m) => m.status === "active") ? 10 : 0));
  const paidOut = Math.round(totalContract * (completedCount / milestones.length));

  return (
    <Tabs defaultValue="overview" className="min-h-screen bg-muted/20 flex flex-col">
      {/* ─── Immersive Hero ─── */}
      <div className="relative h-[320px] sm:h-[420px] lg:h-[560px] bg-ink shrink-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=600&fit=crop"
          alt="Project cover"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        {/* Top Bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between gap-3 flex-wrap z-30">
          <Button asChild variant="ghost" className="gap-2 rounded-2xl backdrop-blur-md bg-white/10 text-white hover:bg-white/20 hover:text-white border border-white/10 font-semibold px-5 h-12 shadow-lg">
            <Link href="/provider/projects">
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              </span>
              BACK TO PROJECTS
            </Link>
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/50 text-ink-foreground text-label rounded-xl flex items-center gap-2 shadow-lg h-12">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              ACTIVE PROJECT
            </span>
            <span className="px-5 py-2 bg-black/40 backdrop-blur-md border border-white/10 text-ink-foreground text-label rounded-xl hidden sm:flex items-center gap-2 shadow-lg h-12">
              <Clock className="w-4 h-4 text-primary" />
              DUE: DEC 01, 2024
            </span>
          </div>
        </div>

        {/* Floating Progress Widget */}
        <div className="absolute top-28 right-10 w-72 bg-neutral-800/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white shadow-2xl shadow-black/50 hidden lg:block animate-in fade-in slide-in-from-right-8 duration-700">
          <span className="text-label text-ink-muted mb-3 block">Overall Progress</span>
          <div className="flex items-end gap-2 mb-3">
            <div className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
              {progressPct}
            </div>
            <div className="text-3xl font-bold text-white/40 mb-1.5">%</div>
          </div>
          <div className="mt-6 mb-2 flex justify-between text-label text-ink-muted">
            <span>Milestones</span>
            <span className="text-primary">{completedCount} / {milestones.length}</span>
          </div>
          <div className="h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full shadow-lg shadow-primary/40" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Title + CTAs — flex layout prevents overlap with top bar */}
        <div className="relative z-20 h-full flex flex-col justify-end pt-20 pb-16 sm:pb-24 px-4 sm:px-10 lg:px-16">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-ink-foreground text-label rounded-lg shadow-card">
                PRJ-721
              </span>
              <span className="text-white/60 text-sm font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {project?.address ?? "Malibu, CA"}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight leading-[1.1]">
              {(project?.title ?? "Full Home Repaint").split(" ").slice(0, -1).join(" ")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">{(project?.title ?? "Full Home Repaint").split(" ").slice(-1)[0]}</span>
            </h1>
            <p className="text-white/50 text-lg font-semibold mb-6">
              Project is <span className="text-primary font-bold">{progressPct}%</span> complete &middot; {milestones.length - completedCount} milestones remaining
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="brand" className="h-14 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
                <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
                Update Status
              </Button>
              <Button asChild variant="ghost" className="h-14 px-6 rounded-2xl font-semibold bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 hover:text-white shadow-sm">
                <Link href={`/provider/projects/${id}/quote`}>
                  <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                    <FileText className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                  Change Order
                </Link>
              </Button>
              <Button variant="ghost" className="h-14 px-6 rounded-2xl font-semibold bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 hover:text-white shadow-sm hidden sm:inline-flex">
                <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                  <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
                </span>
                Message Client
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-10 lg:px-16 z-20 overflow-x-auto scrollbar-none">
          <TabsList className="bg-background/95 backdrop-blur-xl border-x border-t border-border/50 rounded-t-3xl rounded-b-none shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)] h-auto p-2 inline-flex gap-2">
            <TabsTrigger value="overview" className="gap-2 sm:gap-2.5 px-4 sm:px-8 py-3 sm:py-5 h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary font-bold tracking-tight text-sm sm:text-base transition-all whitespace-nowrap">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2 sm:gap-2.5 px-4 sm:px-8 py-3 sm:py-5 h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary font-bold tracking-tight text-sm sm:text-base transition-all whitespace-nowrap">
              <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              Details &amp; Scope
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-2 sm:gap-2.5 px-4 sm:px-8 py-3 sm:py-5 h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary font-bold tracking-tight text-sm sm:text-base transition-all whitespace-nowrap">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              Budget
            </TabsTrigger>
            <TabsTrigger value="archives" className="gap-2 sm:gap-2.5 px-4 sm:px-8 py-3 sm:py-5 h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary font-bold tracking-tight text-sm sm:text-base transition-all whitespace-nowrap">
              <Archive className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              Archives
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* ─── Tab Contents ─── */}
      <div className="flex-1 bg-muted/20 pb-20 relative -mt-0.5">

        {/* ═══ MILESTONES (OVERVIEW) ═══ */}
        <TabsContent value="overview" className="m-0 pt-10 px-6 lg:px-16 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
            {/* Left Column: Milestone Tracker */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-card border border-border/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none" />
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                      <CheckCircle className="w-7 h-7 text-primary" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-foreground tracking-tight">Milestone Tracker</h3>
                      <p className="text-muted-foreground font-medium mt-1">Track and manage project phases linearly.</p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  {milestones.map((item, idx) => (
                    <div key={item.id} className="flex gap-6">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border-2 relative z-10 ${
                          item.status === "completed"
                            ? "bg-success text-success-foreground border-success/40"
                            : item.status === "active"
                              ? "bg-primary text-white border-primary-light"
                              : "bg-muted text-muted-foreground border-border"
                        }`}>
                          {item.status === "completed" ? (
                            <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
                          ) : item.status === "active" ? (
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                            </span>
                          ) : (
                            <span className="text-base font-black">{item.id}</span>
                          )}
                        </div>
                        {idx < milestones.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border/60 my-1" />
                        )}
                      </div>

                      <div
                        className={`flex-1 min-w-0 mb-4 p-5 lg:p-6 rounded-2xl transition-all duration-300 ${
                          item.status === "completed"
                            ? "bg-success/5 border border-success/20"
                            : item.status === "active"
                              ? "bg-background border-2 border-primary shadow-lg shadow-primary/5"
                              : "bg-background border border-border/40 hover:border-border/80"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className={`text-lg font-bold truncate ${item.status === "active" ? "text-primary" : "text-foreground"}`}>
                            {item.phase}
                          </h4>
                          <div className="flex items-center gap-2">
                            {item.subtitle && <StatusBadge variant="primary">{item.subtitle}</StatusBadge>}
                            <span className="px-3 py-1 bg-muted rounded-lg text-label text-muted-foreground whitespace-nowrap border border-border/50">
                              {item.date}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-black text-foreground">{item.amount}</span>
                          <StatusBadge variant={item.status === "completed" ? "success" : item.status === "active" ? "info" : "neutral"}>
                            {item.status === "completed" ? "Paid" : item.status === "active" ? "In Escrow" : "Upcoming"}
                          </StatusBadge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Widgets */}
            <div className="space-y-6">
              {/* Earnings Widget */}
              <div className="bg-ink rounded-3xl p-8 text-ink-foreground shadow-overlay relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mx-10 -my-10 transition-transform group-hover:scale-150 duration-700" />
                <div className="relative z-10">
                  <span className="text-label text-ink-muted mb-4 block flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Earnings Overview
                  </span>
                  <div className="text-5xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-ink-foreground to-ink-foreground/70">
                    ${paidOut.toLocaleString()}
                  </div>
                  <div className="text-sm font-bold text-ink-muted mb-8 border-b border-white/10 pb-6">
                    <span className="text-ink-foreground">PAID</span> / ${totalContract.toLocaleString()} TOTAL
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-label text-ink-muted">Payment Progress</span>
                      <span className="text-lg font-black text-primary">{Math.round((paidOut / totalContract) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full shadow-lg shadow-primary/30 relative overflow-hidden" style={{ width: `${Math.round((paidOut / totalContract) * 100)}%` }}>
                        <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Hub */}
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-extrabold text-foreground tracking-tight">Client Hub</h3>
                </div>
                <div className="group/c flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="relative shrink-0">
                    <img src="https://i.pravatar.cc/150?img=13" alt="Client" className="w-14 h-14 rounded-full border-2 border-background shadow-elevated" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-background rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-foreground text-lg leading-tight group-hover/c:text-primary transition-colors">Sarah Johnson</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Homeowner</p>
                  </div>
                  <MessageSquare className="w-5 h-5 text-muted-foreground group-hover/c:text-primary transition-colors" />
                </div>
              </div>

              {/* Schedule Widget */}
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-extrabold text-foreground tracking-tight">Project Timeline</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neutral-400" /> Start
                    </span>
                    <span className="font-bold text-foreground">Oct 15, 2024</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> End Target
                    </span>
                    <span className="font-black text-primary">Dec 01, 2024</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center p-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Est. Duration</span>
                    <span className="font-bold text-foreground bg-muted px-3 py-1 rounded-lg border border-border/50">47 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══ DETAILS & SCOPE ═══ */}
        <TabsContent value="details" className="m-0 pt-10 px-6 lg:px-16 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
            <div className="lg:col-span-2 space-y-8">
              {/* Scope of Work */}
              <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-card border border-border/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none" />
                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                    <FileText className="w-7 h-7 text-primary" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight">Scope of Work</h3>
                    <p className="text-muted-foreground font-medium mt-1">Full project specifications and requirements.</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="bg-muted/30 rounded-2xl border border-border/50 p-6">
                    <p className="text-foreground leading-relaxed">
                      Complete exterior repaint of a 3,200 sq ft coastal home including all siding, trim, fascia, soffits, and front/rear entry doors. Premium Sherwin-Williams Duration exterior paint in &quot;Alabaster&quot; (main) and &quot;Iron Ore&quot; (accent trim). Includes full surface prep, power washing, scraping, caulking, and priming.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Square Footage", value: "3,200 sq ft" },
                      { label: "Service Type", value: "Exterior Paint" },
                      { label: "Coats", value: "2 Full Coats" },
                      { label: "Paint Brand", value: "Sherwin-Williams" },
                    ].map((spec) => (
                      <div key={spec.label} className="p-4 bg-background rounded-xl border border-border/50">
                        <p className="text-label text-muted-foreground mb-1">{spec.label}</p>
                        <p className="text-base font-bold text-foreground">{spec.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Main Color", value: "Alabaster (SW 7008)", color: "bg-[#F0EDE4]" },
                      { label: "Accent Trim", value: "Iron Ore (SW 7069)", color: "bg-[#434341]" },
                    ].map((swatch) => (
                      <div key={swatch.label} className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border/50">
                        <div className={`w-10 h-10 rounded-lg ${swatch.color} border border-border shadow-inner shrink-0`} />
                        <div>
                          <p className="text-label text-muted-foreground">{swatch.label}</p>
                          <p className="text-sm font-bold text-foreground">{swatch.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Notes / Updates */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] text-center mb-6">Recent Updates</h4>
                <div className="bg-card rounded-3xl p-6 lg:p-8 shadow-card border border-border/40 space-y-6">
                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      <img src="https://i.pravatar.cc/150?img=13" alt="Sarah Johnson" className="w-12 h-12 rounded-full" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success border-2 border-card rounded-full" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-xl rounded-tl-none p-4 mb-3">
                        <p className="text-sm text-foreground leading-relaxed">
                          Love the color selection! Can we also get a quote for painting the garage door in Iron Ore to match the trim?
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-success shrink-0" />
                        <span className="font-bold text-foreground">SARAH JOHNSON</span>
                        <span>&middot;</span>
                        <span>CLIENT</span>
                        <span>&middot;</span>
                        <span>3H AGO</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-4">
                    <div className="relative shrink-0">
                      <img src="https://i.pravatar.cc/150?img=14" alt="Carlos Martinez" className="w-12 h-12 rounded-full" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success border-2 border-card rounded-full" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-xl rounded-tl-none p-4 mb-3">
                        <p className="text-sm text-foreground leading-relaxed">
                          First coat on the south and west sides is done. Weather looks good for the north side tomorrow. East side scheduled for Thursday.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-success shrink-0" />
                        <span className="font-bold text-foreground">CARLOS MARTINEZ</span>
                        <span>&middot;</span>
                        <span>LEAD PAINTER</span>
                        <span>&middot;</span>
                        <span>1D AGO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Crew Assigned */}
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-extrabold text-foreground tracking-tight">Crew Assigned</h3>
                </div>
                <div className="space-y-2">
                  {crewMembers.map((member) => (
                    <div key={member.name} className="group/m flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/80 transition-all duration-200" role="listitem">
                      <div className="relative shrink-0">
                        <img src={member.img} alt={member.name} className="w-10 h-10 rounded-full" />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-card rounded-full ${member.online ? "bg-success" : "bg-muted-foreground/40"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm group-hover/m:text-primary transition-colors">{member.name}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{member.role}</p>
                      </div>
                      <MessageSquare className="w-4 h-4 text-muted-foreground/40 group-hover/m:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Hub (compact) */}
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-extrabold text-foreground tracking-tight">Client</h3>
                </div>
                <div className="group/c flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="relative shrink-0">
                    <img src="https://i.pravatar.cc/150?img=13" alt="Client" className="w-12 h-12 rounded-full border-2 border-background shadow-card" />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success border-2 border-background rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground leading-tight group-hover/c:text-primary transition-colors">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Homeowner</p>
                  </div>
                  <MessageSquare className="w-4 h-4 text-muted-foreground/40 group-hover/c:text-primary transition-colors" />
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-extrabold text-foreground tracking-tight">Schedule</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neutral-400" /> Start
                    </span>
                    <span className="font-bold text-foreground">Oct 15, 2024</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> End Target
                    </span>
                    <span className="font-black text-primary">Dec 01, 2024</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center p-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Duration</span>
                    <span className="font-bold text-foreground bg-muted px-3 py-1 rounded-lg border border-border/50">47 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══ BUDGET ═══ */}
        <TabsContent value="budget" className="m-0 pt-10 px-6 lg:px-16 animate-in fade-in duration-500">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center border border-success/20">
                    <DollarSign className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Primme Escrow Tracker</h3>
                    <p className="text-muted-foreground font-semibold text-sm">Funds secured. Verified release.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-2xl border border-border/50 mb-8">
                  <div>
                    <p className="text-label text-muted-foreground mb-1">Contract Total</p>
                    <p className="text-2xl font-black text-foreground">$15,200</p>
                  </div>
                  <div>
                    <p className="text-label text-success mb-1">Released</p>
                    <p className="text-2xl font-black text-success">$4,000</p>
                  </div>
                  <div>
                    <p className="text-label text-primary mb-1">In Escrow</p>
                    <p className="text-2xl font-black text-foreground">$9,950</p>
                  </div>
                  <div>
                    <p className="text-label text-warning mb-1">Pending C.O.</p>
                    <p className="text-2xl font-black text-muted-foreground">$1,250</p>
                  </div>
                </div>

                <h4 className="text-xl font-black text-foreground tracking-tight mb-6">Payment Schedule</h4>
                <div className="space-y-3">
                  {milestones.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-colors shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                          m.status === "completed" ? "bg-success/10 border-success/20" : m.status === "active" ? "bg-primary/10 border-primary/20" : "bg-muted border-border"
                        }`}>
                          {m.status === "completed" ? <CheckCircle className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{m.phase}</p>
                          <p className="text-xs font-semibold text-muted-foreground mt-0.5">{m.date}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <p className="font-black text-foreground text-lg">{m.amount}</p>
                        <StatusBadge variant={m.status === "completed" ? "success" : m.status === "active" ? "info" : "neutral"}>
                          {m.status === "completed" ? "Paid" : m.status === "active" ? "In Escrow" : "Upcoming"}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 mt-8 border-t border-border/50">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-black text-foreground tracking-tight">Active Change Orders</h4>
                    <Link href={`/provider/projects/${id}/quote`}>
                      <Button size="sm" className="rounded-lg font-bold shadow-elevated hover:shadow-lg border border-primary/20 hover:border-primary/50 text-xs tracking-wide uppercase">
                        <Plus className="w-3 h-3 mr-1" /> New Request
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-colors shadow-card">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">CO-001: Premium Baseboards</p>
                        <p className="text-xs font-semibold text-muted-foreground mt-0.5">Requested by Client &middot; 2 items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-foreground text-lg">$1,250.00</p>
                      <StatusBadge variant="warning">Pending Approval</StatusBadge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border/40 text-center relative overflow-hidden group">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-extrabold text-foreground tracking-tight mb-2">Next Milestone Release</h4>
                <p className="text-sm font-semibold text-muted-foreground mb-6 leading-relaxed">
                  Complete &quot;First Coat Application&quot; to release <strong className="text-foreground">$3,500.00</strong> from Escrow.
                </p>
                <Button variant="brand" className="w-full h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
                  <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                    <Target className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                  Request Release
                </Button>
              </div>

              <div className="bg-ink rounded-3xl p-8 text-ink-foreground shadow-overlay relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mx-10 -my-10 pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-label text-ink-muted mb-4 block">Total Earned</span>
                  <div className="text-4xl font-black tracking-tighter mb-1 text-transparent bg-clip-text bg-gradient-to-b from-ink-foreground to-ink-foreground/70">
                    $4,000
                  </div>
                  <div className="text-sm font-bold text-ink-muted mb-6">
                    <span className="text-ink-foreground">RELEASED</span> / $15,200 CONTRACT
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full w-[26%] bg-gradient-to-r from-primary to-primary-light rounded-full shadow-lg shadow-primary/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══ ARCHIVES ═══ */}
        <TabsContent value="archives" className="m-0 pt-10 px-6 lg:px-16 animate-in fade-in duration-500">
          <div className="max-w-[1600px] mx-auto space-y-10">

            {/* Documents */}
            <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-card border border-border/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                    <FileText className="w-7 h-7 text-primary" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight">Documents</h3>
                    <p className="text-muted-foreground font-medium mt-1">{documents.length} files attached to this project.</p>
                  </div>
                </div>
                <Button variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
                  <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                    <Upload className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                  Upload
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 relative z-10">
                {documents.map((doc) => {
                  const Icon = DOC_ICONS[doc.type] ?? FileText;
                  return (
                    <div key={doc.name} className="flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-background hover:border-primary/30 hover:shadow-md transition-all group/doc cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border shrink-0 group-hover/doc:bg-primary/10 group-hover/doc:border-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-muted-foreground group-hover/doc:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm truncate group-hover/doc:text-primary transition-colors">{doc.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{doc.date} &middot; {doc.size}</p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground/50 group-hover/doc:text-primary transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-card border border-border/40">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                  <ImageIcon className="w-7 h-7 text-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-foreground tracking-tight">Photo Gallery</h3>
                  <p className="text-muted-foreground font-medium mt-1">Visual progress documentation.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop", label: "Front Facade - Before" },
                  { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop", label: "South Side - Prep" },
                  { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop", label: "West Side - First Coat" },
                  { src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop", label: "Trim Detail - Week 3" },
                ].map((photo) => (
                  <div key={photo.label} className="group/photo relative rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all cursor-pointer">
                    <img src={photo.src} alt={photo.label} className="w-full h-40 object-cover group-hover/photo:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300" />
                    <p className="absolute bottom-3 left-3 text-white text-xs font-bold opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300">{photo.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-card border border-border/40">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                  <Activity className="w-7 h-7 text-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-foreground tracking-tight">Activity History</h3>
                  <p className="text-muted-foreground font-medium mt-1">Complete log of project events.</p>
                </div>
              </div>

              <div>
                {activityLog.map((entry, idx) => {
                  const iconMap = { milestone: CheckCircle, payment: DollarSign, change: FileText, message: MessageSquare, photo: ImageIcon };
                  const Icon = iconMap[entry.icon] ?? Activity;
                  return (
                    <div key={idx} className="flex gap-5">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border shrink-0 relative z-10">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        {idx < activityLog.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border/40 my-1" />
                        )}
                      </div>
                      <div className="flex-1 flex items-start justify-between gap-4 pb-5">
                        <div className="pt-1.5">
                          <p className="font-bold text-foreground text-sm">{entry.action}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{entry.detail}</p>
                        </div>
                        <div className="text-right pt-1.5 shrink-0">
                          <p className="text-xs font-bold text-muted-foreground">{entry.date}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{entry.actor}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

      </div>
    </Tabs>
  );
}
