"use client";

import { ArrowRight } from "lucide-react";
import { getMaterialBundles, getMaterial } from "@/lib/inspiration/provider-store";
import { motion } from "motion/react";

export function MaterialBundles() {
  const bundles = getMaterialBundles();

  if (bundles.length === 0) return null;

  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <h3 className="text-h3 font-display text-foreground tracking-tight mb-4">
        Material Bundles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bundles.map((bundle, i) => {
          const materials = bundle.materialIds
            .map((id) => getMaterial(id))
            .filter(Boolean);

          return (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
              className="group p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-title text-foreground group-hover:text-primary transition-colors">
                  {bundle.name}
                </h4>
                <span className="text-meta text-primary bg-primary/8 px-2 py-0.5 rounded-md capitalize">
                  {bundle.category}
                </span>
              </div>
              <p className="text-body-sm text-muted-foreground mb-3 line-clamp-2">
                {bundle.description}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {materials.map((mat) => mat && (
                  <span
                    key={mat.id}
                    className="text-meta text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/30"
                  >
                    {mat.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                <span className="text-meta text-muted-foreground">
                  {bundle.materialIds.length} items
                </span>
                <span className="text-meta font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Bundle <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
