import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "flat";
  interactive?: boolean;
}

export function SurfaceCard({
  children,
  className,
  variant = "default",
  interactive = false,
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-3xl border border-border/20 transition-all duration-300",
        {
          "shadow-card": variant === "default",
          "shadow-elevated": variant === "elevated",
          "shadow-none": variant === "flat",
          "hover:shadow-elevated hover:-translate-y-1 cursor-pointer": interactive,
        },
        "hover:border-border/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
