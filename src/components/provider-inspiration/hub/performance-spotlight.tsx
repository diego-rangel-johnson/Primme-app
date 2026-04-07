"use client";

import { Eye, Heart, FileCheck, TrendingUp, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import { motion } from "motion/react";

const STATS = [
  {
    title: "Portfolio Views",
    value: "5,840",
    icon: Eye,
    variant: "hero" as const,
    trend: { value: 18, label: "vs last month", isPositive: true },
    sparklineData: [3200, 3800, 4100, 4400, 4900, 5300, 5840],
  },
  {
    title: "Project Saves",
    value: "424",
    icon: Heart,
    trend: { value: 12, label: "vs last month", isPositive: true },
    sparklineData: [280, 310, 340, 360, 380, 400, 424],
  },
  {
    title: "Proposals Accepted",
    value: "78%",
    icon: FileCheck,
    trend: { value: 5, label: "vs last month", isPositive: true },
  },
  {
    title: "Trending Style",
    value: "Coastal",
    icon: TrendingUp,
  },
];

export function PerformanceSpotlight() {
  return (
    <SurfaceCard className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <BarChart3 className="w-5 h-5 text-primary" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-h3 font-display text-foreground tracking-tight">Performance</h2>
          <p className="text-xs text-muted-foreground font-medium">Your studio metrics this month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              variant={stat.variant}
              sparklineData={stat.sparklineData}
            />
          </motion.div>
        ))}
      </div>
    </SurfaceCard>
  );
}
