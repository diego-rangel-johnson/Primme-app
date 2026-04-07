import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant = "success" | "warning" | "info" | "error" | "neutral" | "primary" | "purple";

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-success/15 text-success hover:bg-success/15",
  warning: "bg-warning/15 text-warning hover:bg-warning/15",
  info: "bg-info/15 text-info hover:bg-info/15",
  error: "bg-destructive/15 text-destructive hover:bg-destructive/15",
  neutral: "bg-muted text-muted-foreground hover:bg-muted",
  primary: "bg-primary/10 text-primary hover:bg-primary/10",
  purple: "bg-purple-100 text-purple-700 hover:bg-purple-100",
};

interface StatusBadgeProps {
  variant?: StatusVariant;
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ variant = "neutral", children, className }: StatusBadgeProps) {
  return (
    <Badge className={cn("font-bold text-xs uppercase border-0", variantStyles[variant], className)}>
      {children}
    </Badge>
  );
}
