import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "info" | "error" | "neutral" | "primary" | "purple";

interface MetricCardProps {
  badge: string;
  badgeVariant?: BadgeVariant;
  badgeClassName?: string;
  label: string;
  value: string | ReactNode;
}

export function MetricCard({ badge, badgeVariant = "primary", badgeClassName, label, value }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <StatusBadge variant={badgeVariant} className={badgeClassName ?? "mb-4"}>
          {badge}
        </StatusBadge>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 mt-4">
          {label}
        </p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </CardContent>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-muted rounded-full opacity-50" />
    </Card>
  );
}
