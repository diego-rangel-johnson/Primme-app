"use client";

import { useState } from "react";
import { Eye, Heart, Clock, ChevronRight } from "lucide-react";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import type { PortfolioProject } from "@/lib/inspiration/provider-types";

interface PortfolioCardProps {
  project: PortfolioProject;
  onSelect: (project: PortfolioProject) => void;
}

export function PortfolioCard({ project, onSelect }: PortfolioCardProps) {
  const [showSlider, setShowSlider] = useState(false);

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        {showSlider ? (
          <BeforeAfterSlider
            beforeImage={project.beforeImageUrl}
            afterImage={project.afterImageUrl}
            className="rounded-none border-0 shadow-none"
          />
        ) : (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={project.afterImageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute top-3 left-3 flex gap-2">
              <span className="text-meta text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md capitalize">
                {project.style}
              </span>
              {project.isPublic && (
                <span className="text-meta text-white/80 bg-success/60 backdrop-blur-sm px-2 py-0.5 rounded-md">
                  Public
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <p className="text-white font-semibold text-sm leading-tight truncate">{project.title}</p>
              <span className="text-meta text-white/70 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded shrink-0 ml-2">
                {project.sqft} sqft
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="px-3 py-1.5 bg-card/90 text-foreground text-meta rounded-lg shadow-elevated backdrop-blur-sm">
                Hover to compare
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-title text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
          {project.title}
        </h3>
        <p className="text-body-sm text-muted-foreground line-clamp-2 mb-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-meta text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/30"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-3 text-meta text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {project.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> {project.saveCount}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {project.duration}
            </span>
          </div>
          <button
            onClick={() => onSelect(project)}
            className="text-meta font-semibold text-primary flex items-center gap-0.5 hover:gap-1.5 transition-all"
          >
            Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
