"use client";

import { X, Eye, Heart, Clock, Ruler, DollarSign, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { Separator } from "@/components/ui/separator";
import type { PortfolioProject } from "@/lib/inspiration/provider-types";

interface ProjectDetailProps {
  project: PortfolioProject;
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-full bg-background rounded-3xl shadow-overlay overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-white/10">
        <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              {project.title}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-label rounded-full border border-primary/20">
                {project.style}
              </span>
              <span className="text-xs font-semibold text-muted-foreground capitalize">
                {project.category.replace("-", " ")}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 lg:p-12">
            <BeforeAfterSlider
              beforeImage={project.beforeImageUrl}
              afterImage={project.afterImageUrl}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.15em] mb-3">
                    Description
                  </h3>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.15em] mb-3">
                    Scope of Work
                  </h3>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {project.scope}
                  </p>
                </div>

                {project.materials.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.15em] mb-3">
                      Materials Used
                    </h3>
                    <div className="space-y-2">
                      {project.materials.map((mat) => (
                        <div
                          key={mat.materialId}
                          className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/30"
                        >
                          <div>
                            <span className="text-sm font-bold text-foreground">{mat.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">{mat.brand}</span>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">
                            {mat.quantity} {mat.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted/50 text-muted-foreground text-label rounded-lg border border-border/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 space-y-4">
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                    Project Stats
                  </h4>
                  <Separator className="bg-border/40" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Ruler className="w-4 h-4" /> Area
                    </span>
                    <span className="text-sm font-bold text-foreground">{project.sqft} sqft</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Duration
                    </span>
                    <span className="text-sm font-bold text-foreground">{project.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Budget Range
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                    </span>
                  </div>

                  <Separator className="bg-border/40" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Views
                    </span>
                    <span className="text-sm font-bold text-foreground">{project.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Heart className="w-4 h-4" /> Saves
                    </span>
                    <span className="text-sm font-bold text-foreground">{project.saveCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Style
                    </span>
                    <span className="text-sm font-bold text-primary capitalize">{project.style}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
