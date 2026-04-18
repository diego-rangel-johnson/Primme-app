"use client";

import { Search, ArrowRight, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProjectsForProvider } from "@/lib/supabase/hooks";
import { useSession } from "@/context/session-context";

const PROJECTS = [
  {
    id: "PRJ-721",
    title: "Ocean View Exterior",
    location: "Malibu, CA",
    status: "in-progress",
    statusLabel: "IN PROGRESS",
    progress: 65,
    dueDate: "Due Oct 24, 2025",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
    client: "Sarah J."
  },
  {
    id: "PRJ-442",
    title: "Modern Loft Interior",
    location: "Downtown LA",
    status: "planning",
    statusLabel: "PLANNING",
    progress: 15,
    dueDate: "Due Nov 02, 2025",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=500&fit=crop",
    client: "David K."
  },
  {
    id: "PRJ-169",
    title: "Luxury Condo Finish",
    location: "Beverly Hills",
    status: "completed",
    statusLabel: "COMPLETED",
    progress: 100,
    dueDate: "Due Sep 30, 2025",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=500&fit=crop",
    client: "Marcus R."
  },
  {
    id: "PRJ-001",
    title: "Modern Loft Reno",
    location: "Malibu, CA",
    status: "in-progress",
    statusLabel: "IN PROGRESS",
    progress: 70,
    dueDate: "Due Feb 28, 2026",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
    client: "Emma S."
  }
];

const FILTERS = ["ALL", "IN PROGRESS", "PLANNING", "COMPLETED"];

export default function ProviderProjectsPage() {
  const { user } = useSession();
  const { data: dbProjects, loading } = useProjectsForProvider(user?.id);
  const [activeFilter, setActiveFilter] = useState("all");

  const mappedProjects = dbProjects.map((p) => ({
    id: p.id.slice(0, 8).toUpperCase(),
    title: p.title,
    location: p.address ?? "Miami, FL",
    status: p.status === "in_progress" ? "in-progress" : p.status === "active" ? "planning" : p.status,
    statusLabel: p.status === "in_progress" ? "IN PROGRESS" : p.status.toUpperCase().replace("_", " "),
    progress: p.progress,
    dueDate: p.status === "completed" ? "Completed" : p.timeline ?? "TBD",
    image: p.thumbnail_url ?? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    client: "James W.",
  }));

  const projects = mappedProjects.length > 0 ? mappedProjects : PROJECTS;

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    const statusMap: Record<string, string> = {
      "in progress": "in-progress",
      "planning": "planning",
      "completed": "completed",
    };
    const mapped = statusMap[activeFilter];
    return projects.filter((p) => p.status === mapped);
  }, [activeFilter, projects]);

  return (
    <div className="min-h-full flex flex-col bg-muted/20">
      {/* Premium Header */}
      <header className="lg:sticky lg:top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 lg:px-10 py-6 overflow-hidden">
        {/* Subtle Atmospheric Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50" />

        <div className="relative animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-label rounded-full ring-1 ring-primary/20 shadow-card mb-3">
                <Briefcase className="w-3 h-3" />
                ACTIVE WORK
              </span>
              <h2 className="text-h1 font-display text-foreground tracking-tight mt-1">My Projects</h2>
              <p className="text-muted-foreground font-medium mt-1">
                Manage your active jobs, track progress, and view milestones.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex w-full md:w-auto items-center gap-4">
              <div className="flex-1 max-w-md relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Find a project or client..."
                  aria-label="Search projects"
                  className="w-full pl-12 h-12 rounded-xl border-2 border-border/50 bg-background hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-card"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Filter projects">
            {FILTERS.map((filter) => (
              <Button
                key={filter}
                variant="outline"
                onClick={() => setActiveFilter(filter.toLowerCase())}
                role="tab"
                aria-selected={activeFilter === filter.toLowerCase()}
                aria-controls="projects-tabpanel"
                className={`rounded-xl uppercase font-bold text-xs tracking-wider transition-all h-10 px-6 border-2 ${activeFilter === filter.toLowerCase()
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <div id="projects-tabpanel" role="tabpanel" className="px-6 lg:px-10 py-8 lg:py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Link
              key={project.id}
              href={`/provider/projects/${project.id.toLowerCase()}`}
              className="group bg-card rounded-3xl overflow-hidden shadow-card border border-border/40 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project Image Container */}
              <div className="relative h-56 overflow-hidden shadow-inner">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span className={`px-3 py-1.5 rounded-lg text-label flex items-center shadow-card backdrop-blur-md border ${project.status === "completed"
                      ? "bg-success/90 text-success-foreground border-success/30"
                      : project.status === "planning"
                        ? "bg-info/90 text-info-foreground border-info/30"
                        : "bg-primary/90 text-white border-primary-light/30"
                    }`}>
                    {project.status !== "completed" && (
                      <span className="relative flex h-1.5 w-1.5 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                      </span>
                    )}
                    {project.statusLabel}
                  </span>
                </div>

                {/* Due Date overlay */}
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3 py-1 bg-black/50 text-white text-label rounded flex items-center gap-1.5 backdrop-blur-md border border-white/10">
                    {project.dueDate}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-label text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border/50">{project.id}</span>
                </div>

                <h3 className="text-h2 font-display text-foreground mb-3 group-hover:text-primary transition-colors tracking-tight">
                  {project.title}
                </h3>

                <p className="text-sm font-bold text-muted-foreground mb-6 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {project.location}
                </p>

                {/* Progress Bar */}
                <div className="mb-6 p-4 bg-muted/30 rounded-2xl border border-border/40 shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-label text-muted-foreground">Milestone Progress</span>
                    <span className="text-sm font-black text-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2.5 bg-muted-foreground/10" />
                </div>

                {/* Client Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-card ring-1 ring-border">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{project.client.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success border-2 border-background rounded-full" />
                    </div>
                    <div>
                      <p className="text-label text-muted-foreground mb-0.5">Client Contact</p>
                      <p className="text-sm font-bold text-foreground leading-none">{project.client}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <ArrowRight className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
