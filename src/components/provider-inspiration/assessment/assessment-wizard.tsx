"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { AssessmentStepper, type WizardStep } from "./assessment-stepper";
import { ProjectInfoStep } from "./project-info-step";
import { SiteVisitStep } from "./site-visit-step";
import { AnalysisStep } from "./analysis-step";
import { ScopeStep } from "./scope-step";
import { PricingStep, buildInitialPricing } from "./pricing-step";
import { ReviewStep } from "./review-step";
import type { Assessment, ScopeItem } from "@/lib/inspiration/provider-types";
import { createAssessment, updateAssessment, getAssessments } from "@/lib/inspiration/provider-store";

interface AssessmentWizardProps {
  initialData?: Partial<Assessment>;
  onClose: () => void;
  onComplete: () => void;
}

const EMPTY_ASSESSMENT: Omit<Assessment, "id" | "providerId" | "createdAt" | "updatedAt"> = {
  title: "",
  clientName: "",
  address: "",
  roomType: "living-room",
  estimatedSqft: 0,
  projectDescription: "",
  urgency: "normal",
  sitePhotos: [],
  fieldNotes: "",
  visitDate: "",
  visitCompleted: false,
  imageUrls: [],
  condition: "fair",
  conditionNotes: [],
  scopeItems: [],
  totalEstimate: { min: 0, max: 0 },
  materialRecommendations: [],
  pricing: null,
  status: "draft",
};

const STEP_ORDER: WizardStep[] = ["project-info", "site-visit", "analyze", "scope", "pricing", "review"];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export function AssessmentWizard({ initialData, onClose, onComplete }: AssessmentWizardProps) {
  const [step, setStep] = useState<WizardStep>("project-info");
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [savedId, setSavedId] = useState<string | null>(initialData?.id || null);
  const [direction, setDirection] = useState(1);
  const [saveIndicator, setSaveIndicator] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const existingRecord = savedId
    ? getAssessments().find((a) => a.id === savedId)
    : undefined;

  const [data, setData] = useState<Omit<Assessment, "id" | "providerId" | "createdAt" | "updatedAt">>(() => ({
    ...EMPTY_ASSESSMENT,
    ...initialData,
  }));

  const updateData = useCallback((updates: Partial<Assessment>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const markCompleted = (s: WizardStep) => {
    setCompletedSteps((prev) => (prev.includes(s) ? prev : [...prev, s]));
  };

  const goTo = (nextStep: WizardStep) => {
    const currentIdx = STEP_ORDER.indexOf(step);
    const nextIdx = STEP_ORDER.indexOf(nextStep);
    setDirection(nextIdx >= currentIdx ? 1 : -1);
    setStep(nextStep);
  };

  const showSaveIndicator = useCallback(() => {
    setSaveIndicator("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveIndicator("saved");
      saveTimerRef.current = setTimeout(() => setSaveIndicator("idle"), 2000);
    }, 400);
  }, []);

  const saveAsDraft = useCallback(() => {
    showSaveIndicator();
    if (savedId) {
      updateAssessment(savedId, { ...data, status: "draft" });
    } else {
      const created = createAssessment({ ...data, status: "draft" });
      setSavedId(created.id);
    }
  }, [data, savedId, showSaveIndicator]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.title.trim() || data.clientName.trim()) {
        showSaveIndicator();
        if (savedId) {
          updateAssessment(savedId, data);
        } else {
          const created = createAssessment({ ...data, status: "draft" });
          setSavedId(created.id);
        }
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [data, savedId, showSaveIndicator]);

  const saveAndSend = useCallback(() => {
    if (savedId) {
      updateAssessment(savedId, { ...data, status: "sent" });
    } else {
      createAssessment({ ...data, status: "sent" });
    }
    onComplete();
  }, [data, savedId, onComplete]);

  const handleProjectInfoNext = () => {
    markCompleted("project-info");
    goTo("site-visit");
  };

  const handleSiteVisitNext = () => {
    updateData({ imageUrls: data.sitePhotos.map((p) => p.url) });
    markCompleted("site-visit");
    goTo("analyze");
  };

  const handleAnalysisComplete = (results: {
    condition: Assessment["condition"];
    conditionNotes: string[];
    scopeItems: ScopeItem[];
    totalEstimate: { min: number; max: number };
    materialRecommendations: Assessment["materialRecommendations"];
  }) => {
    updateData(results);
    markCompleted("analyze");
    goTo("scope");
  };

  const handleScopeNext = () => {
    const pricing = buildInitialPricing(data.scopeItems);
    updateData({ pricing, status: "in_progress" });
    markCompleted("scope");
    goTo("pricing");
  };

  const handlePricingNext = () => {
    markCompleted("pricing");
    goTo("review");
  };

  const fullAssessment: Assessment = {
    id: savedId || "new",
    providerId: "usr_provider_1",
    createdAt: existingRecord?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { saveAsDraft(); onClose(); }}
            className="rounded-xl font-bold text-xs gap-1.5 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Assessments
          </Button>
          <div className="hidden sm:block h-5 w-px bg-border/40" />
          <div className="hidden sm:block min-w-0">
            <h2 className="text-sm font-black text-foreground tracking-tight truncate">
              {data.title || "New Assessment"}
            </h2>
            {data.clientName && (
              <p className="text-[11px] font-medium text-muted-foreground truncate">{data.clientName}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AnimatePresence mode="wait">
            {saveIndicator === "saving" && (
              <motion.span
                key="saving"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-xs font-bold text-muted-foreground"
              >
                Saving...
              </motion.span>
            )}
            {saveIndicator === "saved" && (
              <motion.span
                key="saved"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1 text-xs font-bold text-primary"
              >
                <Check className="w-3 h-3" />
                Saved
              </motion.span>
            )}
          </AnimatePresence>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { saveAsDraft(); onClose(); }}
            className="rounded-xl font-bold text-xs border-primary/20 hover:bg-primary/5"
          >
            Save & Exit
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <AssessmentStepper currentStep={step} completedSteps={completedSteps} onStepClick={goTo} />

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {step === "project-info" && (
              <ProjectInfoStep
                data={data}
                onChange={updateData}
                onNext={handleProjectInfoNext}
              />
            )}

            {step === "site-visit" && (
              <SiteVisitStep
                data={data}
                onChange={updateData}
                onNext={handleSiteVisitNext}
                onBack={() => goTo("project-info")}
              />
            )}

            {step === "analyze" && (
              <AnalysisStep
                data={data}
                onComplete={handleAnalysisComplete}
                onBack={() => goTo("site-visit")}
                hasResults={data.scopeItems.length > 0}
              />
            )}

            {step === "scope" && (
              <ScopeStep
                items={data.scopeItems}
                onChange={(items) => updateData({ scopeItems: items })}
                onNext={handleScopeNext}
                onBack={() => goTo("analyze")}
              />
            )}

            {step === "pricing" && data.pricing && (
              <PricingStep
                scopeItems={data.scopeItems}
                pricing={data.pricing}
                data={data}
                onChange={(pricing) => updateData({ pricing })}
                onNext={handlePricingNext}
                onBack={() => goTo("scope")}
              />
            )}

            {step === "review" && (
              <ReviewStep
                assessment={fullAssessment}
                onBack={() => goTo("pricing")}
                onSaveDraft={saveAsDraft}
                onSend={saveAndSend}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
