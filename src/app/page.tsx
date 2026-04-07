"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Zap, Award, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Particles } from "@/components/ui/particles";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useSession, getRoleDashboard } from "@/context/session-context";
import { toast } from "sonner";
import { type AccountType, ROLE_MAP, ACCOUNT_TYPES } from "@/lib/constants";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const FEATURES = [
  { icon: Shield, text: "Verified & insured providers" },
  { icon: Zap, text: "Instant project matching" },
  { icon: Award, text: "Quality guaranteed results" },
];

const LOGIN_HERO_SRC =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80&auto=format&fit=crop";

export default function LoginPage() {
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [lightParticles, setLightParticles] = useState(false);
  const [accountTypeHint, setAccountTypeHint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading, login } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getRoleDashboard(user.role));
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduce = () => setReduceMotion(mqReduce.matches);
    updateReduce();
    mqReduce.addEventListener("change", updateReduce);
    const updateLight = () => setLightParticles(window.innerWidth < 1024);
    updateLight();
    window.addEventListener("resize", updateLight);
    return () => {
      mqReduce.removeEventListener("change", updateReduce);
      window.removeEventListener("resize", updateLight);
    };
  }, []);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      const msg = "Please select your account type.";
      setAccountTypeHint(msg);
      toast.error(msg);
      return;
    }
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }
    setAccountTypeHint("");
    setIsSubmitting(true);
    const { error } = await login(email.trim(), password);
    setIsSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    const role = ROLE_MAP[selectedType];
    router.push(getRoleDashboard(role));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main id="main-content" className="min-h-screen flex bg-background selection:bg-primary/20">
      <div className="flex lg:flex-row flex-col min-h-screen w-full overflow-hidden font-sans">

        {/* ── Mobile Hero Banner (< lg only) ── */}
        <div className="lg:hidden relative w-full h-[240px] sm:h-[280px] shrink-0 overflow-hidden">
          <Image
            src={LOGIN_HERO_SRC}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d05] via-[#2a1408]/80 to-[#3d1f0a]/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-60 mix-blend-overlay" />

          {!reduceMotion && (
            <Particles
              className="absolute inset-0 z-[1]"
              quantity={20}
              staticity={30}
              ease={60}
              size={0.4}
              color="#F27A1A"
              vx={0}
              vy={-0.02}
            />
          )}

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-0 mb-4"
            >
              <img src="/logos_primme.png" alt="Primme" className="h-14 sm:h-16 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" />
              <span className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight -ml-1">
                Primme<span className="text-[#E8503A]">.</span>
              </span>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] text-label text-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.25)] mb-4"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(28,95%,65%)] opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[hsl(28,95%,65%)]" />
              </span>
              Member Access
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight drop-shadow-md"
            >
              Build with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(28,95%,65%)] via-[hsl(24,95%,53%)] to-[hsl(16,90%,48%)]">
                confidence
              </span>
            </motion.h2>
          </div>
        </div>

        {/* ── Left Panel: House Hero with Particles (Desktop only) ── */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] shrink-0 flex-col relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={LOGIN_HERO_SRC}
              alt=""
              fill
              priority
              sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 45vw, 0"
              className="object-cover scale-105"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d05] via-[#2a1408]/85 to-[#3d1f0a]/50" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-60 mix-blend-overlay" />

          {!reduceMotion && (
            <Particles
              className="absolute inset-0 z-[1]"
              quantity={lightParticles ? 28 : 60}
              staticity={30}
              ease={60}
              size={0.5}
              color="#F27A1A"
              vx={0}
              vy={-0.03}
            />
          )}

          <div className="relative z-10 flex h-full flex-col justify-between w-full p-12 xl:p-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center gap-0 -ml-3">
                <img src="/logos_primme_vz.png" alt="Primme" className="h-28 w-auto drop-shadow-lg" />
                <span className="text-5xl xl:text-6xl font-display font-bold text-white tracking-tight -ml-2">
                  Primme<span className="text-[#E8503A]">.</span>
                </span>
              </div>
            </motion.div>

            <motion.div
              className="w-full max-w-[480px] mt-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2 className="mb-6 text-[3.5rem] leading-[1.08] font-display font-black text-white tracking-tight drop-shadow-md">
                Build with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(28,95%,65%)] via-[hsl(24,95%,53%)] to-[hsl(16,90%,48%)]">
                  confidence
                </span>
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-white/55 font-medium">
                The premium platform for construction management, connecting homeowners with elite, verified service providers.
              </p>

              <div className="space-y-4">
                {FEATURES.map((item, idx) => (
                  <motion.div
                    key={item.text}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 + idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.07] backdrop-blur-md border border-white/[0.1] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                      <item.icon className="w-5 h-5 text-[hsl(28,95%,65%)]" strokeWidth={2} />
                    </div>
                    <span className="text-[15px] text-white/75 font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="backdrop-blur-2xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-8 xl:p-10 flex gap-6 xl:gap-8 justify-between items-center shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
                <div className="text-center flex-1">
                  <div className="text-3xl font-extrabold text-white flex items-center justify-center">
                    <NumberTicker value={12000} className="text-3xl font-extrabold text-white" />
                    <span className="ml-0.5">+</span>
                  </div>
                  <div className="text-label text-white/35 mt-1.5">Active Users</div>
                </div>
                <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />
                <div className="text-center flex-1">
                  <div className="text-3xl font-extrabold text-white flex items-center justify-center">
                    <NumberTicker value={850} className="text-3xl font-extrabold text-white" />
                    <span className="ml-0.5">+</span>
                  </div>
                  <div className="text-label text-white/35 mt-1.5">Projects</div>
                </div>
                <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />
                <div className="text-center flex-1">
                  <div className="text-3xl font-extrabold text-white flex items-center justify-center">
                    <NumberTicker value={98} className="text-3xl font-extrabold text-white" />
                    <span className="ml-0.5">%</span>
                  </div>
                  <div className="text-label text-white/35 mt-1.5">Satisfaction</div>
                </div>
              </div>
              <div className="text-label text-white/15 text-center mt-6">
                &copy; 2026 Primme Platform. All rights reserved.
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Right Panel: Login Form ── */}
        <div className="flex flex-1 flex-col min-h-screen lg:min-h-0 bg-background lg:overflow-y-auto lg:p-0 relative -mt-8 lg:mt-0 rounded-t-3xl lg:rounded-none z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:shadow-none">
          <div className="lg:hidden absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-border/60" />

          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_hsl(24_95%_53%_/_0.04)_0%,_transparent_60%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_hsl(16_90%_48%_/_0.03)_0%,_transparent_60%)] pointer-events-none" />

          <div className="flex h-full w-full max-w-[520px] mx-auto flex-col justify-center items-center relative z-10 px-6 py-12 sm:px-8 sm:py-14 lg:py-20 lg:px-10">
            {/* Header */}
            <motion.div
              className="w-full text-center mb-10 lg:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="mb-4 hidden lg:inline-flex mx-auto items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/8 text-label text-primary border border-primary/15 shadow-[0_0_12px_hsl(24_95%_53%_/_0.06)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                Member Access
              </span>
              <h2 className="mb-3 text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight mt-0 lg:mt-4">
                Welcome back
              </h2>
              <p className="text-base lg:text-lg leading-relaxed text-muted-foreground/80 font-medium">
                Sign in to access your dashboard.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleContinue}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p id="login-account-type-live" className="sr-only" aria-live="polite">
                {accountTypeHint}
              </p>

              {/* Account type pill selector */}
              <div className="mb-8">
                <p className="text-sm font-medium text-muted-foreground text-center mb-3">
                  I am a{" "}
                  <span className="text-foreground font-bold">
                    {selectedType ? ACCOUNT_TYPES.find(t => t.id === selectedType)?.title : "..."}
                  </span>
                </p>
                <TooltipProvider delayDuration={200}>
                  <div className="flex w-full rounded-2xl bg-muted/50 border border-border/40 p-1.5" role="radiogroup" aria-label="Select account type">
                    {ACCOUNT_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <Tooltip key={type.id}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              aria-label={type.title}
                              onClick={() => {
                                setSelectedType(type.id);
                                setAccountTypeHint("");
                              }}
                              className={`relative flex-1 flex items-center justify-center py-4 rounded-xl transition-all duration-300 ease-out ${isSelected
                                  ? "bg-gradient-to-r from-primary to-[hsl(16,90%,48%)] text-white shadow-lg shadow-primary/25"
                                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                                }`}
                            >
                              <Icon className="w-6 h-6" strokeWidth={isSelected ? 2.5 : 2} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="font-semibold text-xs rounded-lg">
                            {type.title}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </div>

              {/* Email */}
              <div className="rounded-2xl bg-muted/30 border border-border/30 overflow-hidden">
                <div className="relative">
                  <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-200 ${focusedField === "email" ? "text-primary" : "text-muted-foreground/40"}`} />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="pl-14 rounded-2xl h-14 text-base border-0 bg-transparent transition-all duration-200 focus:bg-background/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="rounded-2xl bg-muted/30 border border-border/30 overflow-hidden mt-4">
                <div className="relative">
                  <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-200 ${focusedField === "password" ? "text-primary" : "text-muted-foreground/40"}`} />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="pl-14 rounded-2xl h-14 text-base border-0 bg-transparent transition-all duration-200 focus:bg-background/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2 mb-8">
                <button type="button" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <ShimmerButton
                type="submit"
                disabled={!selectedType || isSubmitting}
                shimmerColor="hsl(28, 95%, 65%)"
                shimmerSize="0.08em"
                borderRadius="1rem"
                background="linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(16, 90%, 48%) 100%)"
                className={`group w-full h-16 text-lg font-bold tracking-normal shadow-lg shadow-primary/20 ${!selectedType || isSubmitting ? "opacity-40 pointer-events-none" : ""}`}
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  {isSubmitting ? "Signing in..." : "Continue"}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />}
                </span>
              </ShimmerButton>

              {/* Signup link */}
              <p className="text-base text-center text-muted-foreground mt-8">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
                  Create one
                </Link>
              </p>
            </motion.form>

            {/* Mobile metrics */}
            <motion.div
              className="lg:hidden w-full mt-8 pt-6 border-t border-border/40"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between rounded-2xl bg-muted/50 border border-border/40 p-4">
                <div className="text-center flex-1">
                  <div className="text-lg sm:text-xl font-extrabold text-foreground flex items-center justify-center">
                    <NumberTicker value={12000} className="text-lg sm:text-xl font-extrabold text-foreground" />
                    <span className="ml-0.5 text-primary">+</span>
                  </div>
                  <div className="text-[10px] sm:text-label text-muted-foreground mt-0.5 font-semibold uppercase tracking-wide">Users</div>
                </div>
                <div className="w-px h-8 bg-border/60" />
                <div className="text-center flex-1">
                  <div className="text-lg sm:text-xl font-extrabold text-foreground flex items-center justify-center">
                    <NumberTicker value={850} className="text-lg sm:text-xl font-extrabold text-foreground" />
                    <span className="ml-0.5 text-primary">+</span>
                  </div>
                  <div className="text-[10px] sm:text-label text-muted-foreground mt-0.5 font-semibold uppercase tracking-wide">Projects</div>
                </div>
                <div className="w-px h-8 bg-border/60" />
                <div className="text-center flex-1">
                  <div className="text-lg sm:text-xl font-extrabold text-foreground flex items-center justify-center">
                    <NumberTicker value={98} className="text-lg sm:text-xl font-extrabold text-foreground" />
                    <span className="ml-0.5 text-primary">%</span>
                  </div>
                  <div className="text-[10px] sm:text-label text-muted-foreground mt-0.5 font-semibold uppercase tracking-wide">Satisfaction</div>
                </div>
              </div>
            </motion.div>

            {/* Copyright */}
            <p className="text-[11px] text-muted-foreground/30 text-center w-full mt-auto pt-8">
              &copy; 2026 Primme Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
