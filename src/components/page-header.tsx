"use client";

import type { ReactNode } from "react";
import { BlurFade } from "@/components/ui/blur-fade";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, badge, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 lg:px-8 py-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-[hsl(16,90%,48%)]/[0.02] pointer-events-none" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
        <div>
          {badge && (
            <BlurFade delay={0.05} inView>
              <div className="mb-2">{badge}</div>
            </BlurFade>
          )}
          <BlurFade delay={0.1} inView>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
          </BlurFade>
          {subtitle && (
            <BlurFade delay={0.15} inView>
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            </BlurFade>
          )}
        </div>
        {actions && (
          <BlurFade delay={0.2} inView>
            <div className="flex flex-wrap gap-3">{actions}</div>
          </BlurFade>
        )}
      </div>
    </header>
  );
}
