"use client";

import {
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  Trash2,
  Copy,
  MoreHorizontal,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Assessment } from "@/lib/inspiration/provider-types";
import { useState } from "react";

const STATUS_CONFIG: Record<Assessment["status"], { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted/50 text-muted-foreground border-border/40" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary border-primary/30" },
  complete: { label: "Complete", className: "bg-success/8 text-success/80 border-success/20" },
  sent: { label: "Sent", className: "bg-accent/10 text-accent border-accent/30" },
};

const STEP_KEYS = ["project-info", "site-visit", "analyze", "scope", "pricing", "review"] as const;

function getCompletedStepCount(a: Assessment): number {
  let count = 0;
  if (a.title && a.clientName) count++;
  if (a.sitePhotos.length > 0 || a.visitCompleted) count++;
  if (a.scopeItems.length > 0) count++;
  if (a.scopeItems.some((s) => s.isIncluded)) count++;
  if (a.pricing && a.pricing.total > 0) count++;
  if (a.status === "sent" || a.status === "complete") count++;
  return count;
}

interface AssessmentCardProps {
  assessment: Assessment;
  onContinue: (assessment: Assessment) => void;
  onDuplicate: (assessment: Assessment) => void;
  onDelete: (id: string) => void;
}

export function AssessmentCard({ assessment, onContinue, onDuplicate, onDelete }: AssessmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const status = STATUS_CONFIG[assessment.status];
  const thumb = assessment.sitePhotos[0]?.url || assessment.imageUrls[0];
  const hasEstimate = assessment.pricing?.total && assessment.pricing.total > 0;
  const stepsCompleted = getCompletedStepCount(assessment);
  const progressPct = Math.round((stepsCompleted / STEP_KEYS.length) * 100);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(assessment.id);
      setShowMenu(false);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="group bg-card rounded-3xl border border-border/40 shadow-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="sm:w-48 h-36 sm:h-auto shrink-0 relative bg-muted/30 overflow-hidden">
          {thumb ? (
            <img src={thumb} alt={assessment.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border backdrop-blur-md ${status.className}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h3 className="text-base font-black text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                {assessment.title || "Untitled Assessment"}
              </h3>
              {assessment.clientName && (
                <p className="text-xs font-medium text-muted-foreground mt-0.5">{assessment.clientName}</p>
              )}
            </div>

            {/* Menu */}
            <div className="relative shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { setShowMenu(!showMenu); setConfirmDelete(false); }}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => { setShowMenu(false); setConfirmDelete(false); }} />
                  <div className="absolute right-0 top-9 z-50 w-44 bg-card rounded-xl shadow-overlay border border-border/40 py-1 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => { onDuplicate(assessment); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" /> Duplicate
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold transition-colors ${
                        confirmDelete
                          ? "text-white bg-destructive hover:bg-destructive/90"
                          : "text-destructive hover:bg-destructive/10"
                      }`}
                    >
                      {confirmDelete ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" /> Confirm Delete
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs font-medium text-muted-foreground">
            {assessment.address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {assessment.address.split(",")[0]}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(assessment.updatedAt || assessment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            {assessment.sitePhotos.length > 0 && (
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3" /> {assessment.sitePhotos.length} photos
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {stepsCompleted}/{STEP_KEYS.length} steps
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">{progressPct}%</span>
            </div>
            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-primary"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between">
            {hasEstimate ? (
              <span className="text-sm font-black text-foreground flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-primary" />
                {assessment.pricing!.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground italic">No estimate yet</span>
            )}
            <Button
              size="sm"
              onClick={() => onContinue(assessment)}
              className="rounded-xl font-bold gap-1.5 shadow-sm shadow-primary/10"
            >
              {assessment.status === "draft" ? "Continue" : assessment.status === "sent" ? "View" : "Edit"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
