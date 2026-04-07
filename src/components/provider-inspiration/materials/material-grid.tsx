"use client";

import type { Material } from "@/lib/inspiration/provider-types";
import { MaterialCard } from "./material-card";
import { motion } from "motion/react";

interface MaterialGridProps {
  materials: Material[];
  onRefresh: () => void;
}

export function MaterialGrid({ materials, onRefresh }: MaterialGridProps) {
  if (materials.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-foreground font-semibold mb-1">No materials found</p>
        <p className="text-body-sm text-muted-foreground">
          Add materials to your showroom or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {materials.map((material, i) => (
        <motion.div
          key={material.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 + i * 0.04 }}
        >
          <MaterialCard material={material} onToggleFavorite={onRefresh} />
        </motion.div>
      ))}
    </div>
  );
}
