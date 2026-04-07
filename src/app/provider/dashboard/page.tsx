"use client";

import {
  Briefcase,
  DollarSign,
  ArrowRight,
  Zap,
  ArrowUpRight,
  MapPin,
  Ruler,
  Palette,
  Droplets,
  Clock,
  Shield,
  CheckCircle,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { RadialProgress } from "@/components/ui/radial-progress";
import { ProjectTimeline, type TimelineProject } from "@/components/provider/project-timeline";
import { ActivityFeed, type ActivityItem } from "@/components/provider/activity-feed";
import { useSession } from "@/context/session-context";
import { getGreeting } from "@/lib/constants";

const PROJECTS: TimelineProject[] = [
  {
    id: "PRJ-721",
    title: "Ocean View Exterior",
    location: "Malibu, CA",
    status: "in-progress",
    statusLabel: "IN PROGRESS",
    progress: 65,
    dueDate: "Due Oct 24",
    daysLeft: 22,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
    client: "Sarah J.",
  },
  {
    id: "PRJ-442",
    title: "Modern Loft Interior",
    location: "Downtown LA",
    status: "planning",
    statusLabel: "PLANNING",
    progress: 15,
    dueDate: "Due Nov 02",
    daysLeft: 31,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=500&fit=crop",
    client: "David K.",
  },
  {
    id: "PRJ-169",
    title: "Luxury Condo Finish",
    location: "Beverly Hills",
    status: "completed",
    statusLabel: "COMPLETED",
    progress: 100,
    dueDate: "Completed",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=500&fit=crop",
    client: "Marcus R.",
  },
  {
    id: "PRJ-001",
    title: "Modern Loft Reno",
    location: "Malibu, CA",
    status: "in-progress",
    statusLabel: "IN PROGRESS",
    progress: 70,
    dueDate: "Due Feb 28",
    daysLeft: 12,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
    client: "Emma S.",
  },
];

const OPPORTUNITIES = [
  {
    id: 1,
    title: "Full Home Repaint",
    location: "Beverly Hills, CA",
    distance: "2.4 mi",
    sqft: "3,200",
    type: "Int. Walls & Trim",
    gallons: "45",
    tags: ["Painting", "Interior", "Luxury"],
    budget: "$12,500",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    time: "2M AGO",
  },
  {
    id: 2,
    title: "Master Bath Renovation",
    location: "West Hollywood, CA",
    distance: "3.1 mi",
    sqft: "450",
    type: "Walls & Ceiling",
    gallons: "8",
    tags: ["Plumbing", "Tile", "Remodel"],
    budget: "$28,000",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=400&fit=crop",
    time: "15M AGO",
  },
];

const ACTIVITY: ActivityItem[] = [
  { id: "a1", icon: "payment", text: "Escrow released $3,500 for Ocean View Exterior", time: "2h ago", highlight: true },
  { id: "a2", icon: "message", text: "Sarah J. sent you a message about materials", time: "4h ago" },
  { id: "a3", icon: "lead", text: "New lead matched: Kitchen Remodel in Santa Monica", time: "6h ago" },
  { id: "a4", icon: "milestone", text: "Modern Loft Reno reached 70% completion", time: "1d ago" },
  { id: "a5", icon: "review", text: "Marcus R. left a 5-star review for Luxury Condo", time: "2d ago" },
];

const ONBOARDING_STEPS = [
  { id: 1, label: "Connect Payments", description: "Link Stripe for secure payouts", href: "/provider/settings", done: false },
  { id: 2, label: "AI Voice Verify", description: "2-min interview to verify tier", href: "/provider/settings", done: false },
  { id: 3, label: "Upload Docs", description: "ID & Liability Insurance", href: "/provider/settings", done: false },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function ProviderDashboard() {
  const { user } = useSession();
  const firstName = user?.name.split(" ")[0] ?? "there";

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const completedOnboarding = ONBOARDING_STEPS.filter((s) => s.done).length;
  const totalOnboarding = ONBOARDING_STEPS.length;

  return (
    <div className="min-h-full flex flex-col bg-muted/20">
      {/* ── Compact Hero Header ── */}
      <header className="relative bg-background border-b border-border/30 px-8 lg:px-12 pt-10 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/2 to-transparent pointer-events-none" />
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.06}
          duration={4}
          className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)] pointer-events-none"
        />

        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <BlurFade delay={0.05} inView>
                <p className="text-label text-muted-foreground mb-2 flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5" /> {dateStr}
                </p>
              </BlurFade>
              <BlurFade delay={0.1} inView>
                <h1 className="text-h1 font-display text-foreground tracking-tight">
                  {getGreeting()}, <span className="text-primary">{firstName}</span>
                </h1>
              </BlurFade>
              <BlurFade delay={0.15} inView>
                <p className="text-muted-foreground font-medium mt-1.5">
                  You have <span className="text-foreground font-bold">3 active projects</span> and{" "}
                  <span className="text-primary font-bold">2 new leads</span> waiting.
                </p>
              </BlurFade>
            </div>

            <BlurFade delay={0.2} inView>
              <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  asChild
                  className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
                >
                  <Link href="/provider/earnings">
                    <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </span>
                    Withdraw
                  </Link>
                </Button>
                <Button
                  variant="brand"
                  asChild
                  className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
                >
                  <Link href="/provider/opportunities">
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                      <Briefcase className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    View Leads
                  </Link>
                </Button>
              </div>
            </BlurFade>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="px-8 lg:px-12 py-8 lg:py-10 flex-1 space-y-10">

        {/* ── Bento Row 1: Stats ── */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={fadeUp}>
            <Link href="/provider/earnings" className="block h-full">
              <StatCard
                title="Total Earnings"
                value="$142,500"
                icon={DollarSign}
                variant="hero"
                trend={{ value: 14, label: "from last month", isPositive: true }}
                sparklineData={[98, 105, 110, 108, 120, 135, 142]}
                className="h-full hover:-translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/provider/earnings" className="block h-full">
              <StatCard
                title="Avg. Ticket Size"
                value="$8,450"
                icon={TrendingUp}
                sparklineData={[7200, 7800, 8100, 8000, 8400, 8300, 8450]}
                className="h-full hover:-translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/provider/projects" className="block h-full">
              <StatCard
                title="Active Projects"
                value="3"
                icon={Zap}
                highlight
                className="h-full hover:-translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Bento Row 2: Project Timeline (Full Width) ── */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
          <SurfaceCard className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Briefcase className="w-5 h-5 text-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-h3 font-display text-foreground tracking-tight">My Projects</h2>
                  <p className="text-xs text-muted-foreground font-medium">Track progress across all active work</p>
                </div>
              </div>
              <Link
                href="/provider/projects"
                className="text-label text-primary hover:text-primary-light flex items-center gap-1 group bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors duration-fast border border-primary/10"
              >
                VIEW ALL
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </Link>
            </div>

            <ProjectTimeline projects={PROJECTS} />
          </SurfaceCard>
        </motion.div>

        {/* ── Bento Row 3: Leads + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Live Leads */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.35 }} className="lg:col-span-2">
            <SurfaceCard className="p-6 lg:p-8 h-full">
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner">
                    <Zap className="w-5 h-5 text-primary" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-h3 font-display text-foreground tracking-tight">Live Leads</h2>
                </div>
                <Link
                  href="/provider/opportunities"
                  className="text-label text-primary hover:text-primary-light flex items-center gap-1 group bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors duration-fast border border-primary/10"
                >
                  FULL BOARD
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </Link>
              </div>

              <div className="space-y-4">
                {OPPORTUNITIES.map((opp, i) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="group flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-transparent hover:border-primary/30 hover:bg-muted/30 hover:shadow-elevated transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden shrink-0 relative shadow-sm group-hover:shadow-md transition-shadow">
                      <img
                        src={opp.image}
                        alt={opp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-label rounded shadow-sm">
                        {opp.budget}
                      </span>
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 text-white text-label rounded backdrop-blur-md flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {opp.time}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors mb-1.5">
                          {opp.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> {opp.location}
                          </span>
                          <span className="text-label text-primary/60">
                            {opp.distance}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Ruler className="w-3 h-3" /> {opp.sqft} sqft
                          </span>
                          <span className="w-px h-3 bg-border" />
                          <span className="flex items-center gap-1">
                            <Palette className="w-3 h-3" /> {opp.type}
                          </span>
                          <span className="w-px h-3 bg-border" />
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3 h-3" /> {opp.gallons} gal
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-wrap gap-1.5">
                          {opp.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-muted/50 text-muted-foreground text-label rounded border border-border/40">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="h-8 rounded-lg text-xs font-bold">
                            <Link href="/provider/opportunities">Details</Link>
                          </Button>
                          <Button size="sm" asChild className="h-8 rounded-lg text-xs font-bold shadow-sm shadow-primary/20 gap-1">
                            <Link href="/provider/opportunities">
                              Accept <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SurfaceCard>
          </motion.div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Onboarding Progress */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.4 }}>
              <SurfaceCard className="p-6 border-2 border-primary/15 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-light to-transparent" />

                <div className="flex items-center gap-3 mb-5">
                  <RadialProgress
                    value={(completedOnboarding / totalOnboarding) * 100}
                    size={44}
                    strokeWidth={4}
                  >
                    <span className="text-label text-foreground">
                      {completedOnboarding}/{totalOnboarding}
                    </span>
                  </RadialProgress>
                  <div>
                    <h3 className="text-base font-display font-bold text-foreground tracking-tight">Onboarding</h3>
                    <p className="text-meta">Complete to unlock full access</p>
                  </div>
                </div>

                {/* Wizard Steps */}
                <div className="space-y-3">
                  {ONBOARDING_STEPS.map((step, i) => (
                    <div key={step.id} className="flex items-start gap-3">
                      {/* Step indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                          step.done
                            ? "bg-success border-success text-white"
                            : i === completedOnboarding
                              ? "bg-primary border-primary text-white"
                              : "bg-muted border-border text-muted-foreground"
                        }`}>
                          {step.done ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : i === completedOnboarding ? (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                            </span>
                          ) : (
                            <span className="text-label">{step.id}</span>
                          )}
                        </div>
                        {i < ONBOARDING_STEPS.length - 1 && (
                          <div className={`w-0.5 h-4 mt-1 rounded-full ${step.done ? "bg-success" : "bg-border"}`} />
                        )}
                      </div>

                      {/* Step content */}
                      <div className={`flex-1 pb-2 ${!step.done && i !== completedOnboarding ? "opacity-50" : ""}`}>
                        <p className="text-sm font-bold text-foreground leading-tight">{step.label}</p>
                        <p className="text-meta mt-0.5">{step.description}</p>
                        {i === completedOnboarding && !step.done && (
                          <Button size="sm" asChild className="mt-2 h-7 text-meta font-bold rounded-lg gap-1 shadow-sm px-3">
                            <Link href={step.href}>
                              Start <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            </motion.div>

            {/* Activity Feed */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.5 }}>
              <SurfaceCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-display font-bold text-foreground tracking-tight">Recent Activity</h3>
                  <span className="text-label text-muted-foreground">Last 7 days</span>
                </div>
                <ActivityFeed items={ACTIVITY} />
              </SurfaceCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
