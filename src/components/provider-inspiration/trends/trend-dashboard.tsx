"use client";

import {
  TrendingUp,
  TrendingDown,
  Sun,
} from "lucide-react";
import { StyleTrends } from "./style-trends";
import { ColorTrends } from "./color-trends";
import { PriceBenchmarks } from "./price-benchmarks";
import type { TrendData } from "@/lib/inspiration/provider-types";
import { motion } from "motion/react";

interface TrendDashboardProps {
  data: TrendData;
}

export function TrendDashboard({ data }: TrendDashboardProps) {
  const topCategories = data.categoryDemand.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Seasonal highlight */}
      <motion.div
        className="p-5 rounded-2xl border border-primary/20 bg-card relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center shrink-0">
            <Sun className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-label text-primary mb-1">
              {data.seasonalHighlight.season} Insight
            </p>
            <h3 className="text-title text-foreground">
              {data.seasonalHighlight.topCategory} Projects Leading
            </h3>
            <p className="text-body-sm text-muted-foreground mt-1">
              {data.seasonalHighlight.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category demand cards */}
      <div>
        <h3 className="text-h3 font-display text-foreground tracking-tight mb-4">
          Category Demand
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-meta text-muted-foreground">
                  {cat.label}
                </span>
                <span className={`flex items-center gap-0.5 text-meta font-semibold ${
                  cat.change > 0 ? "text-success" : "text-destructive"
                }`}>
                  {cat.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {cat.change > 0 ? "+" : ""}{cat.change}%
                </span>
              </div>
              <div className="text-h2 font-display text-foreground tracking-tight mb-0.5">
                {cat.projects}
              </div>
              <div className="text-meta text-muted-foreground">
                projects · avg ${cat.avgBudget.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StyleTrends trends={data.styleTrends} />
        <div className="space-y-6">
          <ColorTrends colors={data.popularColors} />
          <PriceBenchmarks benchmarks={data.priceBenchmarks} />
        </div>
      </div>
    </div>
  );
}
