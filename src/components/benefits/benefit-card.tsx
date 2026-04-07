"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accentClass?: string;
  badge?: string;
  onClick?: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export function BenefitCard({
  icon: Icon,
  title,
  description,
  accentClass = "bg-primary/10 text-primary border-primary/20",
  badge,
  onClick,
}: BenefitCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "bg-card rounded-2xl p-6 shadow-card border border-border/40 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 transition-all duration-300 group relative",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded-md">
          {badge}
        </span>
      )}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border",
          accentClass
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
