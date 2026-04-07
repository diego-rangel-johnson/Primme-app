"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface SaveToBoardButtonProps {
  saved?: boolean;
  onToggle?: () => void;
  size?: "sm" | "md";
  variant?: "overlay" | "default";
  className?: string;
}

export function SaveToBoardButton({
  saved = false,
  onToggle,
  size = "md",
  variant = "default",
  className,
}: SaveToBoardButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative rounded-full transition-all duration-200 flex items-center justify-center",
        size === "sm" ? "w-8 h-8" : "w-10 h-10",
        variant === "overlay"
          ? "bg-black/25 hover:bg-primary backdrop-blur-md border border-white/15 text-white"
          : saved
            ? "bg-primary/10 text-primary border border-primary/20"
            : "bg-muted hover:bg-muted/80 text-muted-foreground border border-border/40",
        className
      )}
      aria-label={saved ? "Remove from saved" : "Save to moodboard"}
      aria-pressed={saved}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={saved ? "saved" : "unsaved"}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.6 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
        >
          <Heart
            className={cn(
              size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4",
              saved && "fill-current"
            )}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
