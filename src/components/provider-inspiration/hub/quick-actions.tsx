"use client";

import Link from "next/link";
import {
  Upload,
  ScanSearch,
  FileText,
  Package,
  TrendingUp,
  Users,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { SurfaceCard } from "@/components/ui/surface-card";

const ACTIONS = [
  {
    icon: Upload,
    title: "Upload Project",
    description: "Add before & after photos to build your professional portfolio.",
    href: "/provider/inspiration/portfolio",
  },
  {
    icon: ScanSearch,
    title: "Start Assessment",
    description: "Upload site photos and get AI-powered scope analysis and cost estimates.",
    href: "/provider/inspiration/assessment",
  },
  {
    icon: FileText,
    title: "Create Proposal",
    description: "Build visual proposals with materials, timelines, and cost breakdowns.",
    href: "/provider/inspiration/proposals",
  },
  {
    icon: Package,
    title: "Browse Materials",
    description: "Curate your material library with specs, pricing, and favorites.",
    href: "/provider/inspiration/materials",
  },
  {
    icon: TrendingUp,
    title: "View Trends",
    description: "Market intelligence on trending styles, colors, and pricing benchmarks.",
    href: "/provider/inspiration/trends",
  },
  {
    icon: Users,
    title: "Client Boards",
    description: "View homeowner inspiration boards and align on their vision.",
    href: "/provider/inspiration/proposals",
  },
];

export function QuickActions() {
  return (
    <SurfaceCard className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Zap className="w-5 h-5 text-primary" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-h3 font-display text-foreground tracking-tight">Quick Actions</h2>
          <p className="text-xs text-muted-foreground font-medium">Jump into any tool</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href + action.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            >
              <Link
                href={action.href}
                className="group flex flex-col justify-between h-full p-5 rounded-2xl border border-border/50 bg-background hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <Icon className="w-[18px] h-[18px] text-primary" />
                  </div>
                  <h3 className="text-title text-foreground mb-1 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <div className="flex items-center mt-4 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  Get started
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
