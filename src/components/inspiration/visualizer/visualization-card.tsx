"use client";

import type { PaintColor } from "@/lib/inspiration/types";
import { motion } from "motion/react";

interface VisualizationCardProps {
  originalImageUrl: string;
  selectedColor: PaintColor | null;
  intensity: number;
}

export function VisualizationCard({ originalImageUrl, selectedColor, intensity }: VisualizationCardProps) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border border-border/30 bg-muted"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative aspect-video">
        <img
          src={originalImageUrl}
          alt="Room preview"
          className="w-full h-full object-cover"
        />

        {selectedColor && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: selectedColor.hex,
              mixBlendMode: "multiply",
              opacity: intensity * 0.6,
            }}
          />
        )}
      </div>

      {selectedColor && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2.5 bg-background/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-elevated border border-border/30">
          <div
            className="w-6 h-6 rounded-md border border-border/20"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <div>
            <p className="text-xs font-semibold text-foreground">{selectedColor.name}</p>
            <p className="text-meta font-mono">
              {selectedColor.hex.toUpperCase()} · {Math.round(intensity * 100)}%
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
