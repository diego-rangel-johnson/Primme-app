"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { StyleTrend } from "@/lib/inspiration/provider-types";
import { motion } from "motion/react";

interface StyleTrendsProps {
  trends: StyleTrend[];
}

export function StyleTrends({ trends }: StyleTrendsProps) {
  const maxSearches = Math.max(...trends.map((t) => t.searches));

  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50">
      <h3 className="text-title text-foreground mb-5">
        Trending Styles in Your Area
      </h3>

      <div className="space-y-2.5">
        {trends.map((trend, i) => {
          const barWidth = (trend.searches / maxSearches) * 100;
          const isPositive = trend.change > 0;

          return (
            <motion.div
              key={trend.style}
              className="group flex items-center gap-4"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.04 }}
            >
              <div className="w-24 shrink-0">
                <span className="text-body-sm font-semibold text-foreground capitalize group-hover:text-primary transition-colors">
                  {trend.style}
                </span>
              </div>

              <div className="flex-1 h-6 bg-muted/30 rounded-md overflow-hidden relative">
                <div
                  className="h-full bg-primary/80 rounded-md transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${barWidth}%` }}
                >
                  <span className="text-meta text-white/90">
                    {trend.searches.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={`flex items-center gap-1 text-meta font-semibold shrink-0 w-14 justify-end ${
                isPositive ? "text-success" : "text-destructive"
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isPositive ? "+" : ""}{trend.change}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
