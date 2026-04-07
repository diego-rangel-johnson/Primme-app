"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  CheckCircle2,
  ScanSearch,
  Ruler,
  AlertTriangle,
  Lightbulb,
  Home,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Assessment, ScopeItem, ScopeCategory } from "@/lib/inspiration/provider-types";
import type { RoomCategory } from "@/lib/inspiration/types";

type AnalysisResults = {
  condition: Assessment["condition"];
  conditionNotes: string[];
  scopeItems: ScopeItem[];
  totalEstimate: { min: number; max: number };
  materialRecommendations: Assessment["materialRecommendations"];
};

interface AnalysisStepProps {
  data: Pick<Assessment, "sitePhotos" | "roomType" | "estimatedSqft" | "condition" | "conditionNotes" | "scopeItems" | "totalEstimate" | "materialRecommendations">;
  onComplete: (results: AnalysisResults) => void;
  onBack: () => void;
  hasResults: boolean;
}

const ANALYSIS_PHASES = [
  { label: "Detecting room type & layout...", icon: ScanSearch, duration: 1400 },
  { label: "Measuring surfaces & dimensions...", icon: Ruler, duration: 1200 },
  { label: "Assessing condition & damage...", icon: AlertTriangle, duration: 1600 },
  { label: "Generating scope & recommendations...", icon: Lightbulb, duration: 1200 },
];

function generateMockResults(roomType: RoomCategory, sqft: number) {
  const conditions: Assessment["condition"][] = ["fair", "good", "poor", "excellent"];
  const condition = conditions[Math.floor(Math.random() * 2)];

  const conditionNotes = [
    "Walls show minor cracking and nail pops in multiple areas",
    "Surface has moderate wear consistent with age — prep required",
    "Trim and molding show paint adhesion issues",
    "Some areas have moisture indicators — recommend further inspection",
  ];

  const categories: ScopeCategory[] = ["preparation", "materials", "labor", "finishing"];
  const scopeItems: ScopeItem[] = [
    { id: `si-${Date.now()}-1`, description: "Surface cleaning & dust removal", category: "preparation", estimatedCost: { min: Math.round(sqft * 0.3), max: Math.round(sqft * 0.5) }, materialQty: 1, materialUnit: "lot", isIncluded: true },
    { id: `si-${Date.now()}-2`, description: "Crack repair & patching", category: "preparation", estimatedCost: { min: 150, max: 350 }, materialQty: 1, materialUnit: "kit", isIncluded: true },
    { id: `si-${Date.now()}-3`, description: "Sanding & surface preparation", category: "preparation", estimatedCost: { min: Math.round(sqft * 0.5), max: Math.round(sqft * 0.8) }, materialQty: 1, materialUnit: "flat", isIncluded: true },
    { id: `si-${Date.now()}-4`, description: "Primer application", category: "materials", estimatedCost: { min: Math.round(sqft * 0.4), max: Math.round(sqft * 0.7) }, materialQty: Math.ceil(sqft / 350), materialUnit: "gallons", isIncluded: true },
    { id: `si-${Date.now()}-5`, description: "Paint application (2 coats)", category: "labor", estimatedCost: { min: Math.round(sqft * 1.5), max: Math.round(sqft * 2.5) }, materialQty: Math.ceil(sqft / 300), materialUnit: "gallons", isIncluded: true },
    { id: `si-${Date.now()}-6`, description: "Trim & detail work", category: "finishing", estimatedCost: { min: 200, max: 400 }, materialQty: 1, materialUnit: "lot", isIncluded: true },
    { id: `si-${Date.now()}-7`, description: "Cleanup & final inspection", category: "finishing", estimatedCost: { min: 100, max: 200 }, materialQty: 1, materialUnit: "lot", isIncluded: true },
  ];

  const totalMin = scopeItems.filter((s) => s.isIncluded).reduce((sum, s) => sum + s.estimatedCost.min, 0);
  const totalMax = scopeItems.filter((s) => s.isIncluded).reduce((sum, s) => sum + s.estimatedCost.max, 0);

  const materialRecommendations = [
    { name: "Emerald Interior - Satin", brand: "Sherwin-Williams", quantity: Math.ceil(sqft / 300), unit: "gallons", unitPrice: 79 },
    { name: "Pro-Grade Joint Compound", brand: "DAP", quantity: 1, unit: "quart", unitPrice: 12 },
    { name: "Premium Painter's Tape", brand: "FrogTape", quantity: Math.ceil(sqft / 100), unit: "rolls", unitPrice: 8 },
    { name: "Bonding Primer", brand: "Zinsser", quantity: Math.ceil(sqft / 350), unit: "gallons", unitPrice: 42 },
  ];

  return { condition, conditionNotes, scopeItems, totalEstimate: { min: totalMin, max: totalMax }, materialRecommendations };
}

export function AnalysisStep({ data, onComplete, onBack, hasResults }: AnalysisStepProps) {
  const existingResults: AnalysisResults | null = hasResults
    ? {
        condition: data.condition,
        conditionNotes: data.conditionNotes,
        scopeItems: data.scopeItems,
        totalEstimate: data.totalEstimate,
        materialRecommendations: data.materialRecommendations,
      }
    : null;

  const [isAnalyzing, setIsAnalyzing] = useState(!hasResults);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [results, setResults] = useState<AnalysisResults | null>(existingResults);

  const runAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setCurrentPhase(0);
    setCompletedPhases([]);
    setResults(null);
  }, []);

  useEffect(() => {
    if (!isAnalyzing) return;
    if (currentPhase >= ANALYSIS_PHASES.length) {
      const timeout = setTimeout(() => {
        const mockResults = generateMockResults(data.roomType, data.estimatedSqft);
        setResults(mockResults);
        setIsAnalyzing(false);
      }, 600);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCompletedPhases((prev) => [...prev, currentPhase]);
      setCurrentPhase((prev) => prev + 1);
    }, ANALYSIS_PHASES[currentPhase].duration);

    return () => clearTimeout(timeout);
  }, [currentPhase, isAnalyzing, data.roomType, data.estimatedSqft]);

  const handleContinue = () => {
    if (results) onComplete(results);
  };

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="py-12"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <ScanSearch className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-h3 font-display text-foreground tracking-tight mb-2">
            AI Analysis in Progress
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            Analyzing {data.sitePhotos.length} photo{data.sitePhotos.length !== 1 ? "s" : ""} for renovation assessment
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          {ANALYSIS_PHASES.map((phase, i) => {
            const Icon = phase.icon;
            const isCompleted = completedPhases.includes(i);
            const isCurrent = currentPhase === i;

            return (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                  isCompleted
                    ? "border-primary/30 bg-primary/5"
                    : isCurrent
                      ? "border-primary/30 bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border/30 bg-muted/20 opacity-40"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isCompleted ? "bg-primary/20" : isCurrent ? "bg-primary/20" : "bg-muted/50"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <span className={`text-sm font-bold ${
                  isCompleted ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {phase.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-full bg-muted/50 h-2 max-w-md mx-auto">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(completedPhases.length / ANALYSIS_PHASES.length) * 100}%` }}
          />
        </div>
      </motion.div>
    );
  }

  if (!results) return null;

  const CONDITION_COLORS: Record<string, string> = {
    excellent: "text-success bg-success/10 border-success/30",
    good: "text-primary bg-primary/10 border-primary/30",
    fair: "text-warning bg-warning/10 border-warning/30",
    poor: "text-destructive bg-destructive/10 border-destructive/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-h3 font-display text-foreground tracking-tight mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Analysis Complete
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            Review the AI findings below. You can refine and continue to scope definition.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={runAnalysis} className="rounded-xl font-bold gap-2">
          <RefreshCw className="w-4 h-4" />
          Re-analyze
        </Button>
      </div>

      {/* Findings Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border/40 shadow-card text-center">
          <Home className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Room Type</p>
          <p className="text-base font-black text-foreground capitalize">{data.roomType.replace("-", " ")}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border/40 shadow-card text-center">
          <Ruler className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Estimated Area</p>
          <p className="text-base font-black text-foreground">{data.estimatedSqft} sqft</p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border/40 shadow-card text-center">
          <AlertTriangle className="w-5 h-5 text-warning mx-auto mb-2" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Condition</p>
          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border ${CONDITION_COLORS[results.condition]}`}>
            {results.condition}
          </span>
        </div>
      </div>

      {/* Condition Notes */}
      <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card">
        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Condition Findings
        </h4>
        <div className="space-y-2">
          {results.conditionNotes.map((note, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl bg-warning/5 border border-warning/20"
            >
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-foreground">{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Estimate */}
      <div className="bg-primary/5 rounded-3xl p-6 lg:p-8 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">AI Estimated Range</p>
            <p className="text-3xl font-black text-foreground tracking-tight">
              ${results.totalEstimate.min.toLocaleString()} — ${results.totalEstimate.max.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-muted-foreground mb-1">Scope Items</p>
            <p className="text-2xl font-black text-foreground">{results.scopeItems.length}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} className="h-12 px-6 rounded-xl font-bold">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="h-12 px-8 rounded-xl font-bold shadow-md shadow-primary/25 glow-orange text-base"
        >
          Define Scope
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
