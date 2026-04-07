"use client";

import { Zap } from "lucide-react";
import { CountdownTimer } from "./countdown-timer";
import { cn } from "@/lib/utils";

interface BoosterBadgeProps {
  title: string;
  multiplier: string;
  expiresAt: Date;
  active?: boolean;
  className?: string;
}

export function BoosterBadge({
  title,
  multiplier,
  expiresAt,
  active = true,
  className,
}: BoosterBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all duration-300",
        active
          ? "bg-gradient-to-br from-warning/5 to-warning/10 border-warning/30 shadow-card hover:shadow-elevated"
          : "bg-card border-border/40 opacity-60",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
            active
              ? "bg-warning/15 border-warning/30 text-warning"
              : "bg-muted border-border text-muted-foreground"
          )}
        >
          <Zap className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-foreground text-sm truncate">{title}</h4>
            {active && (
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-warning/10 text-warning border border-warning/20 rounded-md">
                Active
              </span>
            )}
          </div>
          <p className="text-2xl font-black text-foreground tracking-tight mb-2">
            {multiplier}
          </p>
          <CountdownTimer targetDate={expiresAt} compact />
        </div>
      </div>
    </div>
  );
}
