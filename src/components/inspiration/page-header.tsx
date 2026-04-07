"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

interface InspirationPageHeaderProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function InspirationPageHeader({
  icon: Icon,
  badge,
  title,
  subtitle,
  actions,
}: InspirationPageHeaderProps) {
  return (
    <header className="relative bg-background border-b border-border/30 px-8 lg:px-12 pt-10 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/2 to-transparent opacity-60 pointer-events-none" />
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />

      <motion.div {...fadeUp} className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-label text-muted-foreground mb-2 flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-primary" /> {badge}
            </p>
            <h1 className="text-h1 font-display text-foreground tracking-tight">
              {title}
            </h1>
            <p className="text-muted-foreground font-medium mt-1.5">
              {subtitle}
            </p>
          </div>

          {actions && (
            <div className="flex items-center gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </motion.div>
    </header>
  );
}
