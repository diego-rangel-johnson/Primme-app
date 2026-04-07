"use client";

import {
  Plus,
  DollarSign,
  FolderOpen,
  CreditCard,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Star,
  Wallet,
  Palette,
  UserCircle,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BlurFade } from "@/components/ui/blur-fade";
import { ActivityFeed, type ActivityItem } from "@/components/provider/activity-feed";
import { useSession } from "@/context/session-context";
import { getGreeting } from "@/lib/constants";

const ACTIVITY: ActivityItem[] = [
  { id: "a1", icon: "milestone", text: "First coat completed - Living Room", time: "2h ago", highlight: true },
  { id: "a2", icon: "payment", text: "Payment approved: $2,450.00", time: "6h ago" },
  { id: "a3", icon: "lead", text: "Carlos Martinez accepted your proposal", time: "1d ago" },
  { id: "a4", icon: "message", text: "New message from Andrew Master", time: "2d ago" },
  { id: "a5", icon: "review", text: "Proposal sent: Commercial Facade Painting", time: "3d ago" },
];

const QUICK_TOOLS = [
  { icon: Wallet, label: "Wallets & Cards", href: "/client/payments" },
  { icon: Palette, label: "Color Visualizer", href: "/client/inspiration" },
  { icon: UserCircle, label: "My Profile", href: "/client/profile" },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function HomeownerDashboard() {
  const { user } = useSession();
  const firstName = user?.name.split(" ")[0] ?? "there";

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

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
                  <span className="text-primary font-bold">$12,450 invested</span> so far.
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
                  <Link href="/client/payments">
                    <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </span>
                    Payments
                  </Link>
                </Button>
                <Button
                  variant="brand"
                  asChild
                  className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
                >
                  <Link href="/client/create-project">
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    New Project
                  </Link>
                </Button>
              </div>
            </BlurFade>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="px-8 lg:px-12 py-8 lg:py-10 flex-1 space-y-10">

        {/* ── Stats Row ── */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={fadeUp}>
            <Link href="/client/payments" className="block h-full">
              <StatCard
                title="Total Invested"
                value="$12,450"
                icon={DollarSign}
                variant="hero"
                trend={{ value: 8, label: "from last month", isPositive: true }}
                sparklineData={[8200, 9100, 9800, 10400, 11200, 11800, 12450]}
                className="h-full hover:-translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/client/projects" className="block h-full">
              <StatCard
                title="Active Projects"
                value="3"
                icon={FolderOpen}
                highlight
                className="h-full hover:-translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Link href="/client/payments" className="block h-full">
              <StatCard
                title="Pending Payments"
                value="$2,450"
                icon={CreditCard}
                className="h-full hover:-translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Up Next Project Card (Full Width) ── */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
          <Link href="/client/projects" className="block">
            <SurfaceCard className="p-0 overflow-hidden group hover:shadow-elevated hover:border-primary/20 transition-all duration-slow">
              <div className="relative h-52 lg:h-60 bg-ink overflow-hidden">
                <div
                  className="absolute inset-0 opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000"
                  style={{
                    backgroundImage: "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=500&fit=crop)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-50" />

                <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-label rounded-full shadow-sm shadow-primary/30">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                      </span>
                      Up Next
                    </span>
                    <div className="flex items-center gap-2 text-sm text-ink-foreground/90 font-medium bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                      <Clock className="w-4 h-4 text-primary-light" />
                      <span>Tomorrow, 8:00 AM</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-h2 font-display text-ink-foreground tracking-tight mb-4">
                      Exterior Painting
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-xs">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-label text-ink-muted">Progress</span>
                          <span className="text-sm font-black text-primary-light">75%</span>
                        </div>
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary-light rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 py-2 px-4 rounded-xl bg-white/10 backdrop-blur-md text-ink-foreground text-xs font-bold border border-white/10 group-hover:bg-primary group-hover:border-primary/50 transition-all duration-normal">
                        View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </Link>
        </motion.div>

        {/* ── Bottom Grid: Activity + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Activity Feed */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.35 }} className="lg:col-span-2">
            <SurfaceCard className="p-6 lg:p-8 h-full">
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <CalendarDays className="w-5 h-5 text-primary" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-h3 font-display text-foreground tracking-tight">Recent Activity</h2>
                    <p className="text-xs text-muted-foreground font-medium">Your latest updates and milestones</p>
                  </div>
                </div>
                <Link
                  href="/client/projects"
                  className="text-label text-primary hover:text-primary-light flex items-center gap-1 group bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors duration-fast border border-primary/10"
                >
                  VIEW ALL
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </Link>
              </div>

              <ActivityFeed items={ACTIVITY} />
            </SurfaceCard>
          </motion.div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Quick Tools */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.4 }}>
              <SurfaceCard className="p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
                  <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Star className="w-[18px] h-[18px] text-warning fill-warning" />
                  </div>
                  <h3 className="text-base font-display font-bold text-foreground tracking-tight">Quick Tools</h3>
                </div>
                <div className="space-y-2">
                  {QUICK_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.label}
                        href={tool.href}
                        className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-muted/40 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/20 shrink-0">
                          <Icon className="w-[18px] h-[18px] text-muted-foreground group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex-1">
                          {tool.label}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    );
                  })}
                </div>
              </SurfaceCard>
            </motion.div>

            {/* Inspiration CTA */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.5 }}>
              <Link href="/client/inspiration" className="block">
                <SurfaceCard className="p-6 border-2 border-primary/15 hover:border-primary/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-light to-transparent" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-base font-display font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      Inspiration Hub
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Explore color palettes, save boards, and visualize your dream spaces.
                  </p>
                  <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-primary">
                    Explore now
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </SurfaceCard>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
