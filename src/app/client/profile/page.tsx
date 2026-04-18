"use client";

import {
  Edit,
  Camera,
  MapPin,
  CheckCircle,
  Star,
  Calendar,
  FolderOpen,
  Award,
  Trophy,
  Globe,
  CameraIcon,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { CountUp } from "@/components/ui/count-up";
import { useSession } from "@/context/session-context";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const stats = [
  { label: "Projects", value: 3, suffix: " Active", icon: FolderOpen, highlight: true },
  { label: "Invested", value: 12450, prefix: "$", suffix: "", icon: Star },
  { label: "Rating", value: 4.8, suffix: "/5", icon: Star },
  { label: "Reviews", value: 12, suffix: "+", icon: CheckCircle },
];

const badges = [
  { icon: Trophy, label: "ELITE INVESTOR", description: "Top-tier homeowner on Primme", variant: "success" as const },
  { icon: CheckCircle, label: "VERIFIED HOMEOWNER", description: "Identity and ownership verified", variant: "info" as const },
  { icon: Award, label: "12+ VERIFIED REVIEWS", description: "Consistently rated providers", variant: "warning" as const },
];

const portfolio = [
  { id: 1, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=400&fit=crop", title: "Silicon Valley Modern", tags: ["Interior", "Premium"] },
  { id: 2, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", title: "Beverly Hills Estate", tags: ["Exterior", "Luxury"] },
  { id: 3, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop", title: "Malibu Beach House", tags: ["Exterior"] },
  { id: 4, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop", title: "Downtown Penthouse", tags: ["Interior"] },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function ProfilePage() {
  const { user } = useSession();

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* ── Immersive Cover ── */}
      <div className="relative h-[360px] bg-ink overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center bg-scroll lg:bg-fixed opacity-60 group-hover:opacity-70 transition-opacity duration-1000"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=600&fit=crop)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-ink/50 to-ink/95 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent z-10 opacity-60" />

        <Button
          variant="outline"
          className="absolute top-6 right-6 lg:right-12 z-20 h-12 px-6 rounded-2xl font-semibold bg-black/30 backdrop-blur-md border-white/15 text-white hover:bg-white/15 hover:text-white shadow-overlay"
          onClick={() => toast.info("Cover photo upload dialog would open here.")}
        >
          <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
            <Camera className="w-4 h-4" strokeWidth={2.5} />
          </span>
          Update Cover
        </Button>
      </div>

      {/* ── Floating Profile Header Card ── */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 -mt-32 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-card rounded-3xl border border-border/40 shadow-overlay p-6 lg:p-10"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-8">
            {/* Avatar */}
            <div className="relative group/avatar shrink-0">
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl p-1 bg-gradient-to-br from-primary via-primary-light to-primary">
                <div className="w-full h-full rounded-xl bg-background p-0.5">
                  <Avatar className="w-full h-full rounded-[10px]">
                    {user?.avatar_url ? (
                      <AvatarImage
                        src={user.avatar_url}
                        alt={user.name ?? "Profile"}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="rounded-[10px] bg-primary/10 text-primary font-bold text-2xl">
                      {user?.initials ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      aria-label="Edit profile picture"
                      className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl shadow-overlay z-20 bg-primary hover:bg-primary-light hover:scale-110 transition-all text-white border-2 border-background"
                      onClick={() => toast.info("Avatar upload dialog would open here.")}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="font-bold">Edit Avatar</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <h1 className="text-h1 font-display text-foreground tracking-tight">{user?.name ?? "Alex Morrison"}</h1>
                <div className="bg-success/10 text-success px-2 py-0.5 rounded-md text-label flex items-center gap-1 border border-success/20">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </div>
              </div>
              <p className="text-lg text-primary font-bold mb-3 tracking-tight">
                Homeowner & Property Investor
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <MapPin className="w-3.5 h-3.5" /> San Francisco, CA
                </span>
                <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <Calendar className="w-3.5 h-3.5" /> Joined Oct 2024
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 shrink-0">
              <Button
                variant="ghost"
                className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
                onClick={() => toast.success("Opening public profile view...")}
              >
                <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                  <Globe className="w-4 h-4 text-primary" />
                </span>
                View Public
              </Button>
              <Link href="/client/settings">
                <Button
                  variant="brand"
                  className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
                >
                  <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                    <Edit className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* About */}
            <motion.div {...fadeUp}>
              <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-card border border-border/40">
                <h2 className="text-h2 font-display text-foreground tracking-tight mb-5 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" /> About
                </h2>
                <p className="text-base text-muted-foreground/90 leading-relaxed font-medium">
                  Managing <span className="text-foreground font-bold">high-end residential investments</span> in San Francisco since 2024. Focused on modern aesthetics, sustainable building practices, and <span className="text-primary font-bold">premium quality renovations</span> for long-term value. Active on the Primme platform with 3 ongoing projects.
                </p>
              </div>
            </motion.div>

            {/* Stats Grid - Asymmetric */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                const isMain = idx === 0;
                return (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    className={`bg-card rounded-2xl shadow-card border border-border/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group overflow-hidden relative ${
                      isMain ? "col-span-2 p-8" : "col-span-1 p-6"
                    }`}
                  >
                    {isMain && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                    )}
                    <div className="relative z-10">
                      <div className={`rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isMain ? "w-12 h-12" : "w-8 h-8"}`}>
                        <Icon className={`text-primary ${isMain ? "w-6 h-6" : "w-4 h-4"}`} />
                      </div>
                      <p className="text-label text-muted-foreground mb-1 group-hover:text-primary transition-colors">
                        {stat.label}
                      </p>
                      <p className={`font-black text-foreground tracking-tight ${isMain ? "text-4xl" : "text-2xl"}`}>
                        <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Portfolio */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-card border border-border/40">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-h2 font-display text-foreground tracking-tight flex items-center gap-2">
                    <CameraIcon className="w-6 h-6 text-primary" /> My Properties
                  </h2>
                  <Link href="/client/projects">
                    <Button
                      variant="ghost"
                      className="h-9 px-4 rounded-2xl text-xs uppercase tracking-widest bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
                    >
                      <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1 mr-1">
                        <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                      </span>
                      View All
                    </Button>
                  </Link>
                </div>

                <div className="columns-1 sm:columns-2 gap-5 space-y-5">
                  {portfolio.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`relative rounded-2xl overflow-hidden group shadow-card cursor-pointer border border-border/40 break-inside-avoid ${
                        idx % 3 === 0 ? "aspect-[4/5]" : "aspect-video"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                        <p className="text-white font-bold text-base translate-y-3 group-hover:translate-y-0 transition-transform duration-300 mb-1.5">
                          {item.title}
                        </p>
                        <div className="flex gap-1.5 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          {item.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-label rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-8 lg:sticky lg:top-8">

            {/* Trust Badges */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <div className="bg-card rounded-3xl p-7 shadow-card border border-border/40">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                  <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Award className="w-[18px] h-[18px] text-warning fill-warning" />
                  </div>
                  <h3 className="text-base font-display font-bold text-foreground tracking-tight">Trust & Impact</h3>
                </div>

                <TooltipProvider>
                  <div className="space-y-3">
                    {badges.map((badge, idx) => {
                      const Icon = badge.icon;
                      const colorMap: Record<string, string> = {
                        success: "text-success bg-success/10 border-success/20",
                        info: "text-info bg-info/10 border-info/20",
                        warning: "text-warning bg-warning/10 border-warning/20",
                      };
                      const colors = colorMap[badge.variant] || "text-primary bg-primary/10 border-primary/20";

                      return (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.15 + idx * 0.06 }}
                              className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-border/80 hover:bg-muted/30 transition-all cursor-default group"
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${colors}`}>
                                <Icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
                              </div>
                              <p className="font-bold text-xs tracking-wider text-foreground uppercase">{badge.label}</p>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="font-medium text-sm max-w-[200px]">
                            {badge.description}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
              <div className="bg-card rounded-3xl p-7 shadow-card border border-border/40">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-[18px] h-[18px] text-primary" />
                  </div>
                  <h3 className="text-base font-display font-bold text-foreground tracking-tight">Contact</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/30 group transition-all">
                    <div className="flex items-center gap-3">
                      <Mail className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-bold text-sm text-muted-foreground group-hover:text-foreground transition-colors">{user?.email ?? "alex@example.com"}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/30 group transition-all">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-bold text-sm text-muted-foreground group-hover:text-foreground transition-colors">San Francisco, CA</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
