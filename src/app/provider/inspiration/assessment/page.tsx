"use client";

import { useState, useMemo, useEffect } from "react";
import { ScanSearch, Plus, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InspirationPageHeader } from "@/components/provider-inspiration/page-header";
import { InspirationSubNav } from "@/components/provider-inspiration/inspiration-sub-nav";
import { AssessmentWizard } from "@/components/provider-inspiration/assessment/assessment-wizard";
import { AssessmentCard } from "@/components/provider-inspiration/assessment/assessment-card";
import { getAssessments, deleteAssessment, createAssessment } from "@/lib/inspiration/provider-store";
import type { Assessment } from "@/lib/inspiration/provider-types";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

type StatusFilter = "all" | Assessment["status"];
type ActiveView = "list" | "wizard";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "in_progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
  { value: "sent", label: "Sent" },
];

function SkeletonCard() {
  return (
    <div className="bg-card rounded-3xl border border-border/40 shadow-card overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-36 sm:h-auto shrink-0 bg-muted/40" />
        <div className="flex-1 p-5 space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-2/3 bg-muted/50 rounded-lg" />
            <div className="h-3 w-1/3 bg-muted/40 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <div className="h-3 w-20 bg-muted/40 rounded-lg" />
            <div className="h-3 w-16 bg-muted/40 rounded-lg" />
          </div>
          <div className="h-1.5 w-full bg-muted/40 rounded-full" />
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-muted/40 rounded-lg" />
            <div className="h-8 w-20 bg-muted/50 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const searchParams = useSearchParams();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [activeView, setActiveView] = useState<ActiveView>("list");
  const [editingAssessment, setEditingAssessment] = useState<Partial<Assessment> | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAssessments(getAssessments());
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prefill = searchParams.get("prefill");
    if (prefill) {
      try {
        const parsed = JSON.parse(decodeURIComponent(prefill));
        setEditingAssessment(parsed);
        setActiveView("wizard");
      } catch { /* ignore */ }
    }
  }, [searchParams]);

  const refreshList = () => setAssessments(getAssessments());

  const filteredAssessments = useMemo(() => {
    let list = assessments;
    if (statusFilter !== "all") {
      list = list.filter((a) => a.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.clientName.toLowerCase().includes(q) ||
          a.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [assessments, statusFilter, searchQuery]);

  const hasActiveFilters = statusFilter !== "all" || searchQuery.trim().length > 0;

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };

  const handleContinue = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setActiveView("wizard");
  };

  const handleDuplicate = (assessment: Assessment) => {
    const { id, providerId, createdAt, updatedAt, ...rest } = assessment;
    createAssessment({ ...rest, title: `${rest.title} (Copy)`, status: "draft" });
    refreshList();
    toast.success("Assessment duplicated");
  };

  const handleDelete = (id: string) => {
    deleteAssessment(id);
    refreshList();
    toast.success("Assessment deleted");
  };

  const handleNewAssessment = () => {
    setEditingAssessment(undefined);
    setActiveView("wizard");
  };

  const handleWizardClose = () => {
    setActiveView("list");
    setEditingAssessment(undefined);
    refreshList();
  };

  const handleWizardComplete = () => {
    setActiveView("list");
    setEditingAssessment(undefined);
    refreshList();
  };

  const counts = useMemo(() => ({
    all: assessments.length,
    draft: assessments.filter((a) => a.status === "draft").length,
    in_progress: assessments.filter((a) => a.status === "in_progress").length,
    complete: assessments.filter((a) => a.status === "complete").length,
    sent: assessments.filter((a) => a.status === "sent").length,
  }), [assessments]);

  return (
    <div className="min-h-full bg-muted/20 pb-20">
      <InspirationPageHeader
        icon={ScanSearch}
        badge="AI Assessment"
        title="Renovation Assessment"
        subtitle="Create detailed assessments with AI-powered analysis, scope definition, and professional proposals."
      />
      <InspirationSubNav />

      <div className="px-6 lg:px-10 py-8">
        <AnimatePresence mode="wait">
          {activeView === "wizard" ? (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <AssessmentWizard
                initialData={editingAssessment}
                onClose={handleWizardClose}
                onComplete={handleWizardComplete}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                  {STATUS_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setStatusFilter(f.value)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        statusFilter === f.value
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-card border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {f.label}
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        statusFilter === f.value ? "bg-white/20" : "bg-muted/50"
                      }`}>
                        {counts[f.value]}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative group flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search assessments..."
                      className="pl-9 h-10 rounded-xl border-border/50 bg-card font-medium"
                    />
                  </div>
                  <Button
                    onClick={handleNewAssessment}
                    variant="brand"
                    className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
                  >
                    <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    New Assessment
                  </Button>
                </div>
              </div>

              {/* Assessment List */}
              {isLoading ? (
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filteredAssessments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-700">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 ring-4 ring-background shadow-inner">
                    <ScanSearch className="w-9 h-9 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tight mb-2">
                    {hasActiveFilters ? "No assessments found" : "No assessments yet"}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium max-w-md mb-6">
                    {hasActiveFilters
                      ? "Try adjusting your search or filters."
                      : "Create your first assessment to start building professional proposals for your clients."
                    }
                  </p>
                  {hasActiveFilters ? (
                    <Button variant="outline" onClick={clearFilters} className="rounded-xl font-bold h-10 px-6 gap-2">
                      <X className="w-4 h-4" />
                      Clear Filters
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNewAssessment}
                      variant="brand"
                      className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
                    >
                      <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                      Create First Assessment
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssessments.map((assessment, i) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                    >
                      <AssessmentCard
                        assessment={assessment}
                        onContinue={handleContinue}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
