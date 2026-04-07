"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, ArrowRight, MapPin, FolderOpen, FileEdit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/context/session-context";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop",
];

const STATUS_MAP: Record<string, string> = {
  draft: "draft",
  active: "in-progress",
  in_progress: "in-progress",
  completed: "completed",
  cancelled: "completed",
};

interface Project {
  id: string;
  title: string;
  address: string;
  status: "in-progress" | "draft" | "completed";
  progress: number;
  phase: string;
  lastUpdate: string;
  image: string;
  team: { name: string; avatar: string | null }[];
}

const STATUS_BADGE_MAP: Record<string, { variant: "success" | "primary" | "warning" | "neutral"; label: string }> = {
  "in-progress": { variant: "primary", label: "In Progress" },
  completed: { variant: "success", label: "Completed" },
  draft: { variant: "warning", label: "Draft" },
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusToPhase(status: string, progress: number): string {
  if (status === "completed") return "COMPLETED";
  if (status === "draft") return "AWAITING APPROVAL";
  if (progress < 25) return "PLANNING";
  if (progress < 50) return "PREP WORK";
  if (progress < 75) return "IN PROGRESS";
  return "FINISHING";
}

export default function MyProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSession();

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProjects(
            data.map((p, idx) => ({
              id: p.id,
              title: p.title,
              address: p.address ?? "",
              status: (STATUS_MAP[p.status] ?? "draft") as Project["status"],
              progress: p.progress ?? 0,
              phase: statusToPhase(p.status, p.progress ?? 0),
              lastUpdate: timeAgo(p.updated_at),
              image: p.thumbnail_url ?? FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
              team: [],
            })),
          );
        }
        setLoading(false);
      });
  }, [user]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    );
  }, [searchQuery, projects]);

  const counts = useMemo(() => {
    const active = filtered.filter((p) => p.status === "in-progress").length;
    const drafts = filtered.filter((p) => p.status === "draft").length;
    const completed = filtered.filter((p) => p.status === "completed").length;
    return { all: filtered.length, active, drafts, completed };
  }, [filtered]);

  const renderGrid = (items: Project[], emptyIcon: "search" | "draft" | "folder", emptyTitle: string, emptyDesc: string) => {
    if (items.length === 0) {
      const Icon = emptyIcon === "draft" ? FileEdit : emptyIcon === "folder" ? FolderOpen : Search;
      return (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mb-6 shadow-inner ring-4 ring-background">
            <Icon className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mb-2 tracking-tight">{emptyTitle}</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">{emptyDesc}</p>
          <Button asChild variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
            <Link href="/client/create-project">
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </span>
              Start New Project
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((project, idx) => {
          const badge = STATUS_BADGE_MAP[project.status] ?? STATUS_BADGE_MAP["in-progress"];
          return (
            <Link
              key={project.id}
              href={`/client/projects/${project.id.toLowerCase()}`}
              className="group animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <SurfaceCard interactive className={`overflow-hidden flex flex-col h-full ${project.status === "draft" ? "border-dashed opacity-80 hover:opacity-100" : ""}`}>
                {/* Project Image */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-ink/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />

                  <div className="absolute top-5 right-5 z-20">
                    <StatusBadge variant={badge.variant} className="shadow-lg backdrop-blur-md">
                      {project.status === "in-progress" && (
                        <span className="relative flex h-2 w-2 mr-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                        </span>
                      )}
                      {badge.label}
                    </StatusBadge>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 z-20 flex justify-between items-end">
                    <span className="text-white/90 font-semibold text-xs bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 shadow-card">
                      {project.id}
                    </span>
                    <span className="text-white/70 text-label">{project.lastUpdate}</span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="text-lg font-extrabold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-sm font-medium text-muted-foreground mb-6 flex items-center gap-1.5 bg-muted/50 w-fit px-3 py-1.5 rounded-lg border border-border/50">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate max-w-[200px]">{project.address}</span>
                  </p>

                  <div className="mt-auto">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-label text-muted-foreground">{project.phase}</span>
                        <span className={`text-sm font-black ${project.status === "completed" ? "text-success" : "text-primary"}`}>
                          {project.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-inner ${
                            project.status === "completed"
                              ? "bg-success"
                              : project.status === "draft"
                                ? "bg-muted-foreground/30"
                                : "bg-gradient-to-r from-primary to-primary-light"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="flex items-center justify-between pt-5 border-t border-border/60">
                      <div className="flex -space-x-3">
                        {project.team.length === 0 && (
                          <span className="text-xs font-semibold text-muted-foreground">No team assigned</span>
                        )}
                        {project.team.map((member, i) =>
                          member.avatar ? (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full border-2 border-card overflow-hidden shadow-card group-hover:translate-x-1 transition-transform"
                              style={{ transitionDelay: `${i * 50}ms`, zIndex: 10 - i }}
                            >
                              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full border-2 border-card bg-primary-light/10 flex items-center justify-center text-xs font-bold text-primary shadow-card group-hover:translate-x-1 transition-transform"
                              style={{ transitionDelay: `${i * 50}ms`, zIndex: 10 - i }}
                            >
                              {member.name}
                            </div>
                          )
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:shadow-md group-hover:shadow-primary/20 transition-all duration-300">
                        <ArrowRight className="w-5 h-5 text-ink-muted group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </SurfaceCard>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" className="min-h-full flex flex-col">
      {/* Premium Header */}
      <header className="lg:sticky lg:top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 lg:px-10 py-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50" />

        <div className="relative animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-h1 font-display text-foreground tracking-tight">Contracted Projects</h2>
              <p className="text-muted-foreground font-medium mt-1">
                Manage your active contracts and track progress seamlessly.
              </p>
            </div>
            <Button asChild variant="brand" className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold w-full lg:w-auto hover:-translate-y-0.5 transition-all duration-300">
              <Link href="/client/create-project">
                <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </span>
                Start New Project
              </Link>
            </Button>
          </div>

          {/* Search and Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1 max-w-md relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search by name, address, or ID..."
                aria-label="Search projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 h-12 rounded-xl bg-card border-border/50 focus-visible:ring-primary/20 hover:border-border font-medium shadow-card transition-all"
              />
            </div>
            <TabsList className="h-12 w-full lg:w-auto p-1.5 bg-muted/50 border border-border/50 rounded-xl gap-1 overflow-x-auto min-w-0">
              <TabsTrigger value="all" className="rounded-lg font-bold text-xs uppercase tracking-widest px-5 data-[state=active]:bg-card data-[state=active]:shadow-card">
                All <span className="ml-1.5 text-muted-foreground">{counts.all}</span>
              </TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg font-bold text-xs uppercase tracking-widest px-5 data-[state=active]:bg-card data-[state=active]:shadow-card">
                Active <span className="ml-1.5 text-muted-foreground">{counts.active}</span>
              </TabsTrigger>
              <TabsTrigger value="drafts" className="rounded-lg font-bold text-xs uppercase tracking-widest px-5 data-[state=active]:bg-card data-[state=active]:shadow-card">
                Drafts <span className="ml-1.5 text-muted-foreground">{counts.drafts}</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg font-bold text-xs uppercase tracking-widest px-5 data-[state=active]:bg-card data-[state=active]:shadow-card">
                Done <span className="ml-1.5 text-muted-foreground">{counts.completed}</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </header>

      {/* Projects Grid Container */}
      <div className="p-6 lg:p-10 flex-1 bg-muted/30">
        <TabsContent value="all" className="mt-0 h-full">
          {renderGrid(filtered, "search", "No projects found", "No projects match your search. Try a different keyword or start a new project.")}
        </TabsContent>
        <TabsContent value="active" className="mt-0 h-full">
          {renderGrid(filtered.filter((p) => p.status === "in-progress"), "folder", "No active projects", "You don't have any projects in progress yet. Start one to see it here.")}
        </TabsContent>
        <TabsContent value="drafts" className="mt-0 h-full">
          {renderGrid(filtered.filter((p) => p.status === "draft"), "draft", "No drafts", "Start a project and save it as a draft to continue later.")}
        </TabsContent>
        <TabsContent value="completed" className="mt-0 h-full">
          {renderGrid(filtered.filter((p) => p.status === "completed"), "folder", "No completed projects", "Once a project wraps up, it will appear here for your records.")}
        </TabsContent>
      </div>
    </Tabs>
  );
}
