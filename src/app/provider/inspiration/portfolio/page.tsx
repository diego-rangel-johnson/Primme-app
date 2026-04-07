"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, Plus, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortfolioGrid } from "@/components/provider-inspiration/portfolio/portfolio-grid";
import { ProjectDetail } from "@/components/provider-inspiration/portfolio/project-detail";
import { UploadProjectModal } from "@/components/provider-inspiration/portfolio/upload-project-modal";
import { InspirationPageHeader } from "@/components/provider-inspiration/page-header";
import { InspirationSubNav } from "@/components/provider-inspiration/inspiration-sub-nav";
import { getPortfolioProjects } from "@/lib/inspiration/provider-store";
import type { PortfolioProject } from "@/lib/inspiration/provider-types";

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const projects = useMemo(
    () => getPortfolioProjects({ search: searchQuery || undefined }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, refreshKey]
  );

  const handleCreated = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-full bg-muted/20 pb-20">
      <InspirationPageHeader
        icon={Images}
        badge="Portfolio"
        title="Portfolio"
        subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""} in your showcase. Upload before & after photos to win clients.`}
        actions={
          <>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search projects..."
                className="pl-10 h-11 w-64 rounded-xl border border-border/50 bg-card text-sm focus:border-primary/40 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowUpload(true)}
              variant="brand"
              className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </span>
              Upload
            </Button>
          </>
        }
      />
      <InspirationSubNav />

      <div className="px-6 lg:px-10 py-8">
        <PortfolioGrid projects={projects} onSelectProject={setSelectedProject} />
      </div>

      {showUpload && (
        <UploadProjectModal onClose={() => setShowUpload(false)} onCreated={handleCreated} />
      )}

      {selectedProject && (
        <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
