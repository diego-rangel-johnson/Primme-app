"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";

interface ColorTrendsProps {
  colors: { hex: string; name: string; saves: number }[];
}

export function ColorTrends({ colors }: ColorTrendsProps) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50">
      <h3 className="text-title text-foreground mb-5">
        Most Popular Colors
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        {colors.map((color, i) => (
          <motion.div
            key={color.hex}
            className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-border/30 hover:border-primary/30 transition-all"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
          >
            <div
              className="w-8 h-8 rounded-lg border border-border/40 shrink-0"
              style={{ backgroundColor: color.hex }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-foreground block truncate">
                {color.name}
              </span>
              <span className="text-meta text-muted-foreground font-mono">
                {color.hex}
              </span>
            </div>
            <div className="flex items-center gap-1 text-meta text-muted-foreground shrink-0">
              <Heart className="w-3 h-3" />
              {color.saves}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
