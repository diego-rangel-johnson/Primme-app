import { cn } from "@/lib/utils";
import type React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  highlight?: boolean;
  variant?: "default" | "hero";
  sparklineData?: number[];
}

function MiniSparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className={cn("overflow-visible", className)} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-60"
      />
    </svg>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  highlight = false,
  variant = "default",
  sparklineData,
  className,
  ...props
}: StatCardProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "rounded-3xl p-7 shadow-card border relative overflow-hidden transition-all duration-300",
        isHero
          ? "bg-gradient-to-br from-[hsl(20,25%,12%)] via-[hsl(18,20%,15%)] to-[hsl(16,15%,18%)] text-ink-foreground border-white/[0.06] hover:shadow-[0_8px_32px_hsl(24_95%_53%_/_0.2)]"
          : highlight
            ? "bg-card border-primary/20 bg-primary/[0.03] hover:border-primary/30 hover:shadow-[0_4px_20px_hsl(24_95%_53%_/_0.08)]"
            : "bg-card border-border/20 hover:border-border/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    >
      {isHero && (
        <>
          <div className="absolute top-0 right-0 w-56 h-56 bg-primary/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[hsl(16,90%,48%)]/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          {Icon && (
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300",
                isHero
                  ? "bg-gradient-to-br from-primary to-[hsl(16,90%,48%)] text-white border-white/10 shadow-lg shadow-primary/30"
                  : highlight
                    ? "bg-gradient-to-br from-primary to-primary text-primary-foreground border-primary/50 shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground border-border"
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="flex items-center gap-2">
            {sparklineData && (
              <MiniSparkline
                data={sparklineData}
                className={cn(isHero ? "text-[hsl(28,95%,65%)]" : trend?.isPositive ? "text-success" : "text-destructive")}
              />
            )}
            {trend && (
              <div
                className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1",
                  trend.isPositive
                    ? isHero ? "bg-success/20 text-success" : "bg-success/10 text-success"
                    : isHero ? "bg-destructive/20 text-destructive" : "bg-destructive/10 text-destructive"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </div>
            )}
          </div>
        </div>
        <div>
          <p className={cn(
            "text-label mb-1",
            isHero ? "text-white/40" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className={cn(
            "font-black tracking-tight",
            isHero ? "text-5xl text-white" : "text-3xl text-foreground"
          )}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
