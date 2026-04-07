import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: LucideIcon;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({
  title,
  icon: Icon,
  subtitle,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/50",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner">
            <Icon className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </div>
        )}
        <div>
          <h3 className="text-h3 font-display text-foreground tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-body-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
