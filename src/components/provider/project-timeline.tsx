"use client";

import { motion } from "motion/react";
import { MapPin, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { RadialProgress } from "@/components/ui/radial-progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface TimelineProject {
  id: string;
  title: string;
  location: string;
  status: "in-progress" | "planning" | "completed";
  statusLabel: string;
  progress: number;
  dueDate: string;
  daysLeft?: number;
  image: string;
  client: string;
}

interface ProjectTimelineProps {
  projects: TimelineProject[];
  className?: string;
}

const statusColors: Record<string, { bg: string; text: string; dot: string; ring: string }> = {
  "in-progress": {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    ring: "stroke-primary",
  },
  planning: {
    bg: "bg-info/10",
    text: "text-info",
    dot: "bg-info",
    ring: "stroke-info",
  },
  completed: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    ring: "stroke-success",
  },
};

export function ProjectTimeline({ projects, className }: ProjectTimelineProps) {
  if (projects.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 px-8 text-center", className)}>
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No active projects yet</h3>
        <p className="text-muted-foreground font-medium mb-6 max-w-sm">
          Accept your first lead to start building your project timeline.
        </p>
        <Link
          href="/provider/opportunities"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
        >
          Find Projects <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Horizontal scroll container */}
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none px-1">
        {projects.map((project, i) => {
          const colors = statusColors[project.status] ?? statusColors["planning"];

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="snap-start"
            >
              <Link
                href={`/provider/projects/${project.id.toLowerCase()}`}
                className="group flex flex-col w-[280px] bg-card rounded-2xl border border-border/40 shadow-card overflow-hidden hover:shadow-elevated hover:border-primary/30 hover:-translate-y-1 transition-all duration-slow"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Status pill */}
                  <div className="absolute top-3 left-3">
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-label backdrop-blur-md border border-white/10 shadow-sm", project.status === "completed" ? "bg-success/80 text-white" : project.status === "in-progress" ? "bg-primary/80 text-white" : "bg-white/20 text-white")}>
                      {project.status !== "completed" && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                        </span>
                      )}
                      {project.statusLabel}
                    </span>
                  </div>

                  {/* Client avatar */}
                  <div className="absolute bottom-3 right-3">
                    <Avatar className="h-8 w-8 border-2 border-white shadow-lg">
                      <AvatarFallback className="bg-primary text-white text-xs font-bold">
                        {project.client.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Due date */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-label text-white/80">
                      {project.dueDate}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-1">
                    {project.title}
                  </h4>
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-4">
                    <MapPin className="w-3 h-3 text-primary" /> {project.location}
                  </p>

                  {/* Progress + countdown */}
                  <div className="mt-auto flex items-center justify-between">
                    <RadialProgress
                      value={project.progress}
                      size={48}
                      strokeWidth={4}
                      indicatorClassName={colors.ring}
                    >
                      <span className="text-label text-foreground">{project.progress}%</span>
                    </RadialProgress>

                    {project.daysLeft != null && project.daysLeft > 0 ? (
                      <span className="text-label text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border/50">
                        {project.daysLeft}d left
                      </span>
                    ) : project.status === "completed" ? (
                      <span className="text-label text-success bg-success/10 px-2.5 py-1 rounded-lg border border-success/20">
                        Done
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="px-5 pb-5 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Connecting line behind cards */}
      <div className="absolute top-[160px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent pointer-events-none -z-10" />
    </div>
  );
}
