"use client";

import { FileText, Crown, List } from "lucide-react";
import type { ProposalTemplate } from "@/lib/inspiration/provider-types";

interface TemplateSelectorProps {
  selected: ProposalTemplate;
  onSelect: (template: ProposalTemplate) => void;
}

const TEMPLATES: { value: ProposalTemplate; label: string; description: string; icon: typeof FileText }[] = [
  {
    value: "minimal",
    label: "Minimal",
    description: "Clean overview with scope and cost summary",
    icon: FileText,
  },
  {
    value: "premium",
    label: "Premium",
    description: "Full presentation with visuals, materials, and timeline",
    icon: Crown,
  },
  {
    value: "detailed",
    label: "Detailed",
    description: "Comprehensive breakdown with line-item costs",
    icon: List,
  },
];

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {TEMPLATES.map((tmpl) => {
        const Icon = tmpl.icon;
        const isActive = selected === tmpl.value;

        return (
          <button
            key={tmpl.value}
            onClick={() => onSelect(tmpl.value)}
            className={`p-5 rounded-2xl border-2 text-left transition-all ${
              isActive
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border/40 bg-card hover:border-primary/30"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              isActive ? "bg-primary/20" : "bg-muted/50"
            }`}>
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <h4 className={`text-sm font-bold mb-1 ${isActive ? "text-primary" : "text-foreground"}`}>
              {tmpl.label}
            </h4>
            <p className="text-meta leading-snug">
              {tmpl.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
