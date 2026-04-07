"use client";

import {
  Camera,
  Edit,
  MapPin,
  Mail,
  Phone,
  Link2,
  Copy,
  CheckCircle,
  Award,
  Briefcase,
  Share2,
  Globe,
  ArrowUpRight,
  Star,
  Trophy,
  Target,
  Zap,
  Crown,
  Linkedin,
  Instagram,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/status-badge";
import { CountUp } from "@/components/ui/count-up";
import { useSession } from "@/context/session-context";
import { toast } from "sonner";
import { useState } from "react";

const stats = [
  { label: "Referrals", value: 42, suffix: "+", icon: Link2, highlight: true },
  { label: "Earned", value: 3450, prefix: "$", suffix: "", icon: Award },
  { label: "Since", value: 2023, suffix: "", icon: CheckCircle },
  { label: "Tier", value: 0, suffix: "", displayValue: "Bronze", icon: Star },
];

const badges = [
  { title: "First Referral", description: "Completed first referral", icon: Zap, color: "text-warning bg-warning/10 border-warning/20", earned: true },
  { title: "10 Club", description: "10+ referrals milestone", icon: Star, color: "text-primary bg-primary/10 border-primary/20", earned: true },
  { title: "High Earner", description: "$1,000+ in commissions", icon: Trophy, color: "text-success bg-success/10 border-success/20", earned: true },
  { title: "Bronze Partner", description: "Achieved Bronze tier", icon: Award, color: "text-amber-600 bg-amber-500/10 border-amber-500/20", earned: true },
  { title: "Top Performer", description: "Top 10% of partners", icon: Target, color: "text-info bg-info/10 border-info/20", earned: false },
  { title: "Gold Standard", description: "Achieve Gold tier", icon: Crown, color: "text-yellow-500 bg-yellow-500/10 border-yellow-400/20", earned: false },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function PartnerProfilePage() {
  const { user } = useSession();
  const [copied, setCopied] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "linkedin.com/in/michaeltorres",
    instagram: "@michael.torres",
    website: "michaeltorres.com",
  });
  const [editingSocial, setEditingSocial] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("primme.com/ref/partner-0892");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSocial = () => {
    setEditingSocial(false);
    toast.success("Social links updated!");
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Cover */}
      <div className="relative h-[360px] bg-ink overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center bg-scroll lg:bg-fixed opacity-60 group-hover:opacity-70 transition-opacity duration-1000"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=600&fit=crop)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-ink/50 to-ink/95 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent z-10 opacity-60" />

        <Button
          variant="ghost"
          className="absolute top-6 right-6 lg:right-12 z-20 gap-2 rounded-2xl bg-black/30 backdrop-blur-md border-white/15 text-white hover:bg-white/15 hover:text-white shadow-overlay font-semibold h-12 px-5"
          onClick={() => toast.info("Cover photo upload dialog would open here.")}
        >
          <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
            <Camera className="w-4 h-4" strokeWidth={2.5} />
          </span>
          Update Cover
        </Button>
      </div>

      {/* Profile Header Card */}
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
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl p-1 bg-gradient-to-br from-primary via-primary-light to-primary lg:animate-[spin_6s_linear_infinite] [animation-play-state:paused] lg:group-hover/avatar:[animation-play-state:running]">
                <div className="w-full h-full rounded-xl bg-background p-0.5">
                  <img
                    src="https://i.pravatar.cc/150?img=15"
                    alt={user?.name ?? "Profile"}
                    className="w-full h-full rounded-[10px] object-cover"
                  />
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
                <h1 className="text-h1 font-display text-foreground tracking-tight">{user?.name ?? "Partner Name"}</h1>
                <StatusBadge variant="warning" className="shadow-sm border-warning/20 text-label">
                  Bronze Tier
                </StatusBadge>
              </div>
              <p className="text-lg text-primary font-bold mb-3 tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Partner
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <MapPin className="w-3.5 h-3.5" /> Miami, FL
                </span>
                <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <Mail className="w-3.5 h-3.5" /> {user?.email ?? "contact@partner.com"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 shrink-0">
              <Button
                variant="ghost"
                className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
                onClick={() => toast.success("Sharing profile link...")}
              >
                <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                  <Share2 className="w-4 h-4 text-primary" />
                </span>
                Share Profile
              </Button>
              <Link href="/partner/settings">
                <Button
                  variant="brand"
                  className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
                >
                  <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                    <Settings className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                  Edit Settings
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div {...fadeUp}>
              <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-card border border-border/40">
                <h2 className="text-h2 font-display text-foreground tracking-tight mb-5 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" /> About Me
                </h2>
                <p className="text-base text-muted-foreground/90 leading-relaxed font-medium">
                  Real estate professional and home improvement influencer. Connecting homeowners with <span className="text-foreground font-bold">quality painting services</span> across South Florida. Passionate about transforming spaces and building valuable partnerships within the <span className="text-primary font-bold">Primme network</span>.
                </p>
              </div>
            </motion.div>

            {/* Stats Grid */}
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
                        {stat.displayValue ?? <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Partner Badges */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-card border border-border/40">
                <h2 className="text-h2 font-display text-foreground tracking-tight mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-warning" /> Partner Badges
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.title}
                        className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                          badge.earned
                            ? "bg-card border-border/40 hover:-translate-y-1 hover:shadow-md"
                            : "bg-muted/30 border-border/30 opacity-50"
                        }`}
                      >
                        {!badge.earned && (
                          <div className="absolute top-3 right-3">
                            <span className="text-label text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/50">Locked</span>
                          </div>
                        )}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border ${badge.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-foreground text-sm">{badge.title}</h4>
                        <p className="text-label text-muted-foreground mt-0.5">{badge.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Tracking Link Block */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              <div className="bg-gradient-to-br from-ink via-ink-border to-ink rounded-3xl p-8 lg:p-10 shadow-overlay border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-primary/30 transition-colors duration-700 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-primary-light">
                        <Link2 className="w-5 h-5" />
                        <h3 className="text-h3 font-display text-white tracking-tight">Your Tracking Link</h3>
                      </div>
                      <p className="text-label text-ink-muted bg-white/5 inline-block px-3 py-1 rounded-md border border-white/10">
                        Partner ID: 0892
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                      <Award className="w-6 h-6 text-warning" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                    <code className="flex-1 font-mono text-sm lg:text-base text-neutral-300 px-4 py-3 truncate w-full sm:w-auto">
                      https://primme.com/ref/partner-0892
                    </code>
                    <Button
                      variant="brand"
                      onClick={handleCopy}
                      className={`w-full sm:w-auto h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 font-semibold uppercase tracking-widest text-xs transition-all duration-300 ${
                        copied
                          ? "bg-success text-success-foreground hover:bg-success/90 shadow-lg shadow-success/20"
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
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-8">
            {/* Contact Hub */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <div className="bg-card rounded-3xl p-7 shadow-card border border-border/40">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-[18px] h-[18px] text-primary" />
                  </div>
                  <h3 className="text-base font-display font-bold text-foreground tracking-tight">Contact Hub</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/30 group transition-all">
                    <div className="flex items-center gap-3">
                      <Mail className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-label text-muted-foreground group-hover:text-primary transition-colors">Email</p>
                        <span className="font-bold text-sm text-foreground">{user?.email ?? "contact@example.com"}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/30 group transition-all">
                    <div className="flex items-center gap-3">
                      <Phone className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-label text-muted-foreground group-hover:text-primary transition-colors">Phone</p>
                        <span className="font-bold text-sm text-foreground">{user?.phone ?? "+1 (305) 555-0123"}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              <div className="bg-card rounded-3xl p-7 shadow-card border border-border/40">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center">
                      <Globe className="w-[18px] h-[18px] text-info" />
                    </div>
                    <h3 className="text-base font-display font-bold text-foreground tracking-tight">Social Links</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary-light font-bold text-xs"
                    onClick={() => editingSocial ? handleSaveSocial() : setEditingSocial(true)}
                  >
                    {editingSocial ? "Save" : "Edit"}
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                    <Linkedin className="w-[18px] h-[18px] text-[#0077B5] shrink-0" />
                    {editingSocial ? (
                      <Input
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks((p) => ({ ...p, linkedin: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <span className="font-bold text-sm text-foreground truncate">{socialLinks.linkedin}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                    <Instagram className="w-[18px] h-[18px] text-[#E4405F] shrink-0" />
                    {editingSocial ? (
                      <Input
                        value={socialLinks.instagram}
                        onChange={(e) => setSocialLinks((p) => ({ ...p, instagram: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <span className="font-bold text-sm text-foreground truncate">{socialLinks.instagram}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                    <Globe className="w-[18px] h-[18px] text-muted-foreground shrink-0" />
                    {editingSocial ? (
                      <Input
                        value={socialLinks.website}
                        onChange={(e) => setSocialLinks((p) => ({ ...p, website: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <span className="font-bold text-sm text-foreground truncate">{socialLinks.website}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Milestones */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
              <div className="bg-card rounded-3xl p-7 shadow-card border border-border/40">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                  <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Award className="w-[18px] h-[18px] text-warning fill-warning" />
                  </div>
                  <h3 className="text-base font-display font-bold text-foreground tracking-tight">Milestones</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "First Referral", date: "JAN 2023", icon: Award, color: "text-warning bg-warning/10 border-warning/20" },
                    { title: "10 Referrals Milestone", date: "MAR 2023", icon: CheckCircle, color: "text-success bg-success/10 border-success/20" },
                    { title: "Bronze Tier Achieved", date: "JUN 2023", icon: Star, color: "text-primary bg-primary/10 border-primary/20" },
                  ].map((achievement, idx) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 + idx * 0.06 }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-border/80 hover:bg-muted/30 transition-all"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${achievement.color}`}>
                          <Icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{achievement.title}</p>
                          <p className="text-label text-muted-foreground">{achievement.date}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
