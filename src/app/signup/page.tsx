"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail, Lock, User, Check, Shield, Zap, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Particles } from "@/components/ui/particles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { toast } from "sonner";
import { useSession, getRoleDashboard } from "@/context/session-context";
import { type AccountType, ROLE_MAP, ACCOUNT_TYPES } from "@/lib/constants";

const FEATURES = [
  { icon: Shield, text: "Free to join, no commitments" },
  { icon: Zap, text: "Get matched in minutes" },
  { icon: Award, text: "Join 12,000+ members" },
];

const SIGNUP_HERO_SRC =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop";

export default function SignupPage() {
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [lightParticles, setLightParticles] = useState(false);
  const [accountTypeHint, setAccountTypeHint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useSession();
  const router = useRouter();

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      const msg = "Please select an account type.";
      setAccountTypeHint(msg);
      toast.error(msg);
      return;
    }
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in email and password.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setAccountTypeHint("");
    setIsSubmitting(true);
    const role = ROLE_MAP[selectedType];
    const { error } = await signup(email.trim(), password, {
      name: fullName.trim(),
      role,
    });
    setIsSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Account created successfully!");
    router.push(getRoleDashboard(role));
  };

  return (
    <main id="main-content" className="min-h-screen flex bg-background selection:bg-primary/20">
      <div className="flex min-h-screen w-full overflow-hidden font-sans">

        {/* ── Left Panel: House Hero with Particles ── */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] shrink-0 flex-col relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={SIGNUP_HERO_SRC}
              alt=""
              fill
              priority
              sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 45vw, 0"
              className="object-cover scale-105"
            />
          </div>

          {/* Blue-tinted gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d05] via-[#2a1408]/85 to-[#3d1f0a]/50" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-60 mix-blend-overlay" />

          {!reduceMotion && (
            <Particles
              className="absolute inset-0 z-[1]"
              quantity={lightParticles ? 24 : 50}
              staticity={35}
              ease={60}
              size={0.5}
              color="#F27A1A"
              vx={0}
              vy={-0.03}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between w-full p-12 xl:p-16">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors duration-200">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </motion.div>

            {/* Hero text */}
            <motion.div
              className="w-full max-w-[480px] mt-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h2 className="mb-6 text-[3rem] leading-[1.1] font-display font-black text-white tracking-tight drop-shadow-md">
                Join{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(28,95%,65%)] via-[hsl(24,95%,53%)] to-[hsl(16,90%,48%)]">
                  Primme
                </span>
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-white/55 font-medium">
                Create your account and access premium construction management tools.
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

            <div className="text-label text-white/15">
              &copy; 2026 Primme Platform. All rights reserved.
            </div>
          </div>
        </div>

        {/* ── Right Panel: Signup Form ── */}
        <div className="flex flex-1 flex-col bg-background lg:overflow-y-auto p-6 md:p-12 lg:py-16 lg:px-20 relative">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_hsl(24_95%_53%_/_0.04)_0%,_transparent_60%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_hsl(16_90%_48%_/_0.03)_0%,_transparent_60%)] pointer-events-none" />

          {/* Mobile: back + brand block (logo + badge), aligned with login scale */}
          <div className="lg:hidden mb-8 flex items-start justify-between gap-2">
            <Link
              href="/"
              className="shrink-0 pt-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to Sign In"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
              <div className="flex items-center gap-0">
                <img src="/logos_primme.png" alt="Primme" className="h-14 w-auto drop-shadow-lg" />
                <span className="text-3xl font-display font-bold text-foreground tracking-tight -ml-1">
                  Primme<span className="text-[#E8503A]">.</span>
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/8 text-label text-primary border border-primary/15 shadow-[0_0_12px_hsl(24_95%_53%_/_0.06)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                New Account
              </span>
            </div>
            <div className="w-9 shrink-0" aria-hidden />
          </div>

          <div className="flex h-full w-full max-w-[440px] mx-auto flex-col justify-center items-start relative z-10">
            {/* Desktop back link */}
            <motion.div
              className="hidden lg:block mb-6 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div
              className="w-full mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="mb-3 hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/8 text-label text-primary border border-primary/15 shadow-[0_0_12px_hsl(24_95%_53%_/_0.06)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                New Account
              </span>
              <h2 className="mb-3 text-h1 font-display text-foreground mt-0 lg:mt-4">
                Create Account
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground font-medium">
                Fill in your details to get started.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSignup}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Account type selector */}
              <div className="mb-6">
                <Label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Account Type
                </Label>
                <span className="sr-only" aria-live="polite">
                  {accountTypeHint}
                </span>
                <div className="flex w-full gap-3" role="radiogroup" aria-label="Select account type">
                  {ACCOUNT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <motion.button
                        key={type.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setSelectedType(type.id);
                          setAccountTypeHint("");
                        }}
                        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                        whileTap={{ scale: 0.97 }}
                        className={`group flex-1 flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300 ease-out ${isSelected
                            ? "border-primary bg-primary/[0.05] shadow-[0_0_28px_hsl(24_95%_53%_/_0.15),0_0_8px_hsl(24_95%_53%_/_0.1)] ring-1 ring-primary/25"
                            : "border-border/60 bg-card hover:border-primary/30 hover:shadow-[0_4px_20px_hsl(24_95%_53%_/_0.08)]"
                          }`}
                      >
                        <div className={`flex items-center justify-center w-12 h-12 shrink-0 rounded-xl transition-all duration-300 ${isSelected
                            ? "bg-gradient-to-br from-primary to-[hsl(16,90%,48%)] text-white shadow-lg shadow-primary/30 scale-110"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          }`}>
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <span className={`text-sm font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{type.title}</span>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30"
                            >
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name */}
              <div className="mb-5">
                <Label htmlFor="fullName" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Full Name
                </Label>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${focusedField === "name" ? "text-primary" : "text-muted-foreground/60"}`} />
                  <Input
                    id="fullName"
                    placeholder="John Morrison"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="pl-11 rounded-xl h-13 text-base border-border/50 bg-card transition-all duration-200 focus:shadow-[0_0_0_3px_hsl(24_95%_53%_/_0.1),0_0_20px_hsl(24_95%_53%_/_0.05)] focus:border-primary/40"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-5">
                <Label htmlFor="email" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${focusedField === "email" ? "text-primary" : "text-muted-foreground/60"}`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="pl-11 rounded-xl h-13 text-base border-border/50 bg-card transition-all duration-200 focus:shadow-[0_0_0_3px_hsl(24_95%_53%_/_0.1),0_0_20px_hsl(24_95%_53%_/_0.05)] focus:border-primary/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-8">
                <Label htmlFor="password" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${focusedField === "password" ? "text-primary" : "text-muted-foreground/60"}`} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="pl-11 rounded-xl h-13 text-base border-border/50 bg-card transition-all duration-200 focus:shadow-[0_0_0_3px_hsl(24_95%_53%_/_0.1),0_0_20px_hsl(24_95%_53%_/_0.05)] focus:border-primary/40"
                  />
                </div>
              </div>

              {/* Submit -- ShimmerButton */}
              <ShimmerButton
                type="submit"
                disabled={!selectedType || isSubmitting}
                shimmerColor="hsl(28, 95%, 65%)"
                shimmerSize="0.08em"
                borderRadius="1rem"
                background="linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(16, 90%, 48%) 100%)"
                className={`w-full h-16 text-base font-bold uppercase tracking-wider ${!selectedType || isSubmitting ? "opacity-40 pointer-events-none" : ""}`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? "Creating..." : "Create Account"}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </span>
              </ShimmerButton>

              {/* Divider */}
              <div className="relative my-10 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                asChild
                className="w-full rounded-2xl h-14 font-bold tracking-wide transition-all duration-300 border-border/50 hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-[0_0_20px_hsl(24_95%_53%_/_0.06)]"
              >
                <Link href="/">SIGN IN</Link>
              </Button>
            </motion.form>
          </div>
        </div>
      </div>
    </main>
  );
}
