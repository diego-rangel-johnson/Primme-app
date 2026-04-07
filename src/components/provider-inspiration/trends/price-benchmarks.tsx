"use client";

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { PriceBenchmark } from "@/lib/inspiration/provider-types";
import { motion } from "motion/react";

interface PriceBenchmarksProps {
  benchmarks: PriceBenchmark[];
}

export function PriceBenchmarks({ benchmarks }: PriceBenchmarksProps) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50">
      <h3 className="text-title text-foreground mb-5">
        Price Benchmarks
      </h3>

      <div className="space-y-3">
        {benchmarks.map((bm, i) => {
          const diff = bm.yourPrice - bm.avgPrice;
          const diffPct = ((diff / bm.avgPrice) * 100).toFixed(0);
          const isAbove = diff > 0;
          const isEqual = diff === 0;
          const range = bm.maxPrice - bm.minPrice;
          const yourPosition = ((bm.yourPrice - bm.minPrice) / range) * 100;
          const avgPosition = ((bm.avgPrice - bm.minPrice) / range) * 100;

          return (
            <motion.div
              key={bm.category}
              className="p-3.5 rounded-xl border border-border/30 hover:border-primary/20 transition-all"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-semibold text-foreground">{bm.label}</span>
                <div className={`flex items-center gap-1 text-meta font-semibold ${
                  isEqual ? "text-muted-foreground" : isAbove ? "text-amber-500" : "text-success"
                }`}>
                  {isEqual ? (
                    <Minus className="w-3 h-3" />
                  ) : isAbove ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {isEqual ? "At market" : `${isAbove ? "+" : ""}${diffPct}% vs avg`}
                </div>
              </div>

              <div className="relative h-2.5 bg-muted/40 rounded-full mb-1.5">
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/30 z-10"
                  style={{ left: `${avgPosition}%` }}
                />
                <div
                  className="absolute -top-0.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background shadow-subtle z-20 -translate-x-1/2"
                  style={{ left: `${yourPosition}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 bg-primary/15 rounded-full"
                  style={{
                    left: `${Math.min(yourPosition, avgPosition)}%`,
                    width: `${Math.abs(yourPosition - avgPosition)}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-meta text-muted-foreground">
                <span>${bm.minPrice.toLocaleString()}</span>
                <span className="text-foreground">
                  You: ${bm.yourPrice.toLocaleString()} · Avg: ${bm.avgPrice.toLocaleString()}
                </span>
                <span>${bm.maxPrice.toLocaleString()}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
