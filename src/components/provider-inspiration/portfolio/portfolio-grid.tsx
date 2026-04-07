"use client";

import type { PortfolioProject } from "@/lib/inspiration/provider-types";
import { PortfolioCard } from "./portfolio-card";
import { motion } from "motion/react";

interface PortfolioGridProps {
  projects: PortfolioProject[];
  onSelectProject: (project: PortfolioProject) => void;
}

export function PortfolioGrid({ projects, onSelectProject }: PortfolioGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-foreground font-semibold mb-1">No projects yet</p>
        <p className="text-body-sm text-muted-foreground">
          Upload your first before &amp; after project to start building your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
        >
          <PortfolioCard project={project} onSelect={onSelectProject} />
        </motion.div>
      ))}
    </div>
  );
}
