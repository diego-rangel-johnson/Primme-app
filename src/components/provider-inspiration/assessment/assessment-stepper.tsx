"use client";

import { Check, ClipboardList, Camera, ScanSearch, ListChecks, DollarSign, FileCheck } from "lucide-react";
import { motion } from "motion/react";

export type WizardStep = "project-info" | "site-visit" | "analyze" | "scope" | "pricing" | "review";

const STEPS: { id: WizardStep; label: string; icon: React.ElementType }[] = [
  { id: "project-info", label: "Project Info", icon: ClipboardList },
  { id: "site-visit", label: "Site Visit", icon: Camera },
  { id: "analyze", label: "AI Analysis", icon: ScanSearch },
  { id: "scope", label: "Scope of Work", icon: ListChecks },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "review", label: "Review", icon: FileCheck },
];

interface AssessmentStepperProps {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  onStepClick: (step: WizardStep) => void;
}

export function AssessmentStepper({ currentStep, completedSteps, onStepClick }: AssessmentStepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav className="relative gradient-orange-mesh rounded-2xl border border-primary/10 px-4 py-4 lg:px-6">
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-card/80 to-transparent z-10 lg:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-card/80 to-transparent z-10 lg:hidden" />
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isClickable = isCompleted || isCurrent || i <= currentIdx;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-1 shrink-0"
              >
                {i > 0 && (
                  <div className={`w-4 lg:w-8 h-0.5 rounded-full transition-colors duration-300 ${
                    isCompleted ? "bg-primary/40" : i <= currentIdx ? "bg-primary/20" : "bg-border/40"
                  }`} />
                )}
                <button
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step.id)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${step.label}${isCompleted ? " (completed)" : isCurrent ? " (current)" : ""}`}
                  className={`flex items-center gap-1.5 px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl text-[11px] lg:text-xs font-bold transition-all whitespace-nowrap ${
                    isCurrent
                      ? "bg-primary text-white shadow-md shadow-primary/25 glow-orange"
                      : isCompleted
                        ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15"
                        : "bg-muted/30 text-muted-foreground border border-transparent"
                  } ${isClickable && !isCurrent ? "cursor-pointer" : ""}`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Icon className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] opacity-60">{i + 1}</span>
                  )}
                  <span className={isCurrent || isCompleted ? "" : "hidden sm:inline"}>{step.label}</span>
                </button>
              </motion.div>
            );
          })}

          <div className="ml-auto pl-3 shrink-0 hidden lg:flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {completedSteps.length}/{STEPS.length}
            </span>
            <div className="w-16 h-1.5 bg-muted/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { STEPS };
