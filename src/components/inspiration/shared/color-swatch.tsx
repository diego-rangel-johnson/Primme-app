"use client";

import { cn } from "@/lib/utils";
import { getContrastColor } from "@/lib/inspiration/color-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColorSwatchProps {
  hex: string;
  name?: string;
  brand?: string;
  size?: "xs" | "sm" | "md" | "lg";
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZES = {
  xs: "w-5 h-5 rounded",
  sm: "w-7 h-7 rounded-lg",
  md: "w-10 h-10 rounded-xl",
  lg: "w-14 h-14 rounded-xl",
};

export function ColorSwatch({
  hex,
  name,
  brand,
  size = "md",
  selected,
  onClick,
  className,
}: ColorSwatchProps) {
  const contrast = getContrastColor(hex);
  const element = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        SIZES[size],
        "border transition-all duration-150 shrink-0",
        selected
          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background border-foreground/40"
          : "border-border/30 hover:border-border/60",
        onClick ? "cursor-pointer" : "cursor-default",
        className
      )}
      style={{ backgroundColor: hex }}
      aria-label={name ?? hex}
    />
  );

  if (!name) return element;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{element}</TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p className="font-semibold">{name}</p>
          {brand && <p className="text-muted-foreground">{brand}</p>}
          <p className="font-mono text-meta">{hex.toUpperCase()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
