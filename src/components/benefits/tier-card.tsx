"use client";

import { motion } from "motion/react";
import { CheckCircle, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TierData {
  name: string;
  icon: LucideIcon;
  threshold: string;
  thresholdLabel: string;
  headline: string;
  color: string;
  borderColor: string;
  textColor: string;
  isCurrent: boolean;
  isLocked: boolean;
  perks: string[];
}

interface TierCardProps {
  tier: TierData;
  index: number;
}

export function TierCard({ tier, index }: TierCardProps) {
  const Icon = tier.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className={cn(
        "relative rounded-3xl p-8 shadow-card border transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated overflow-hidden",
        tier.isCurrent
          ? `bg-card ${tier.borderColor} border-2`
          : "bg-card border-border/40"
      )}
    >
      {tier.isCurrent && (
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 bg-primary text-primary-foreground text-label rounded-lg font-bold shadow-md shadow-primary/20">
            Current
          </span>
        </div>
      )}
      {tier.isLocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-muted-foreground/40" />
        </div>
      )}

      <div
        className={cn(
          "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg",
          tier.color
        )}
      >
        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
      </div>

      <h4 className="text-h3 font-display text-foreground tracking-tight mb-1">
        {tier.name}
      </h4>
      <p className="text-3xl font-black text-foreground tracking-tight mb-1">
        {tier.headline}
      </p>
      <p className="text-sm text-muted-foreground font-medium mb-6">
        {tier.thresholdLabel}
      </p>

      <div className="space-y-3">
        {tier.perks.map((perk) => (
          <div key={perk} className="flex items-start gap-2.5">
            <CheckCircle
              className={cn(
                "w-4 h-4 mt-0.5 shrink-0",
                tier.isCurrent ? "text-primary" : tier.isLocked ? "text-muted-foreground/40" : "text-muted-foreground/60"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                tier.isLocked ? "text-foreground/50" : "text-foreground/80"
              )}
            >
              {perk}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
