"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Images } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getPortfolioProjects } from "@/lib/inspiration/provider-store";
import type { PortfolioProject } from "@/lib/inspiration/provider-types";
import { motion } from "motion/react";

export function RecentPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    setProjects(getPortfolioProjects().slice(0, 6));
  }, []);

  if (projects.length === 0) return null;

  return (
    <SurfaceCard className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Images className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-h3 font-display text-foreground tracking-tight">Recent Portfolio</h2>
            <p className="text-xs text-muted-foreground font-medium">Your latest uploaded work</p>
          </div>
        </div>
        <Link
          href="/provider/inspiration/portfolio"
          className="text-label text-primary hover:text-primary-light flex items-center gap-1 group bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors duration-fast border border-primary/10"
        >
          VIEW ALL
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
          >
            <Link
              href="/provider/inspiration/portfolio"
              className="group shrink-0 w-48 block"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/40 bg-muted group-hover:border-primary/25 transition-all duration-300">
                <img
                  src={project.afterImageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-semibold text-sm leading-tight truncate">
                    {project.title}
                  </p>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-meta text-white/70 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded capitalize">
                    {project.category.replace("-", " ")}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {project.style}
              </p>
              <p className="text-meta">{project.viewCount.toLocaleString()} views · {project.saveCount} saves</p>
            </Link>
          </motion.div>
        ))}

        <Link
          href="/provider/inspiration/portfolio"
          className="shrink-0 w-48"
        >
          <div className="aspect-[4/3] rounded-xl border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">New Project</span>
          </div>
        </Link>
      </div>
    </SurfaceCard>
  );
}
