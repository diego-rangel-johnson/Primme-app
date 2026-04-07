"use client";

import { motion } from "motion/react";
import { Calculator, TrendingUp } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";

interface SavingsItem {
  label: string;
  monthlyAmount: number;
  active: boolean;
}

interface SavingsCalculatorProps {
  items: SavingsItem[];
}

export function SavingsCalculator({ items }: SavingsCalculatorProps) {
  const activeItems = items.filter((i) => i.active);
  const monthlySavings = activeItems.reduce((sum, i) => sum + i.monthlyAmount, 0);
  const annualSavings = monthlySavings * 12;

  return (
    <SurfaceCard className="p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-h3 font-display text-foreground tracking-tight">
              Estimated Savings
            </h3>
            <p className="text-meta text-muted-foreground">
              Based on your active benefits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 rounded-2xl p-5 border border-primary/15"
          >
            <p className="text-label text-primary mb-1">Monthly</p>
            <p className="text-3xl font-black text-foreground tracking-tight">
              ${monthlySavings.toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-primary/5 rounded-2xl p-5 border border-primary/15"
          >
            <p className="text-label text-primary mb-1">Annual</p>
            <p className="text-3xl font-black text-foreground tracking-tight">
              ${annualSavings.toLocaleString()}
            </p>
          </motion.div>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.active ? "bg-success" : "bg-muted-foreground/30"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    item.active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-bold text-foreground tabular-nums">
                ${item.monthlyAmount}/mo
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-2 text-sm text-primary font-bold">
          <TrendingUp className="w-4 h-4" />
          Saving ${annualSavings.toLocaleString()} annually with {activeItems.length} active benefits
        </div>
      </div>
    </SurfaceCard>
  );
}
