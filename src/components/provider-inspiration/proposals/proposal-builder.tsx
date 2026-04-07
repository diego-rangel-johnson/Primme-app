"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Image,
  Palette,
  Clock,
  DollarSign,
  Type,
  ArrowRight,
  GripVertical,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TemplateSelector } from "./template-selector";
import { createProposal } from "@/lib/inspiration/provider-store";
import type { ProposalTemplate, ProposalBlock, ProposalBlockType } from "@/lib/inspiration/provider-types";
import { toast } from "sonner";

interface ProposalBuilderProps {
  onClose: () => void;
  onCreated: () => void;
}

const BLOCK_OPTIONS: { type: ProposalBlockType; label: string; icon: typeof Image }[] = [
  { type: "before-after", label: "Before / After", icon: Image },
  { type: "palette", label: "Color Palette", icon: Palette },
  { type: "timeline", label: "Timeline", icon: Clock },
  { type: "cost", label: "Cost Summary", icon: DollarSign },
  { type: "text", label: "Text Block", icon: Type },
];

function createDefaultBlock(type: ProposalBlockType): ProposalBlock {
  const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const base = { id, type, order: 0 };

  switch (type) {
    case "before-after":
      return { ...base, data: { beforeUrl: "", afterUrl: "" } };
    case "palette":
      return { ...base, data: { colors: ["#F1EEE8", "#D5CFC3", "#8B8578"] } };
    case "timeline":
      return { ...base, data: { phases: [{ name: "Phase 1", days: 3 }] } };
    case "cost":
      return { ...base, data: { subtotal: 0, tax: 0, total: 0 } };
    case "text":
      return { ...base, data: { heading: "Section Title", body: "Description text here..." } };
    case "materials":
      return { ...base, data: { materialIds: [], quantities: [] } };
  }
}

export function ProposalBuilder({ onClose, onCreated }: ProposalBuilderProps) {
  const [clientName, setClientName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [template, setTemplate] = useState<ProposalTemplate>("premium");
  const [blocks, setBlocks] = useState<ProposalBlock[]>([
    createDefaultBlock("text"),
  ]);
  const [totalCost, setTotalCost] = useState("");

  const addBlock = (type: ProposalBlockType) => {
    const block = createDefaultBlock(type);
    block.order = blocks.length;
    setBlocks([...blocks, block]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleSubmit = () => {
    if (!clientName.trim() || !projectTitle.trim()) {
      toast.error("Please fill in client name and project title");
      return;
    }

    createProposal({
      clientName: clientName.trim(),
      projectTitle: projectTitle.trim(),
      template,
      blocks: blocks.map((b, i) => ({ ...b, order: i })),
      totalCost: Number(totalCost) || 0,
      status: "draft",
    });

    toast.success("Proposal created!");
    onCreated();
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
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-xl font-bold text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Proposals
          </Button>
          <div className="hidden sm:block h-5 w-px bg-border/40" />
          <div className="hidden sm:block">
            <h2 className="text-sm font-black text-foreground tracking-tight">Create Proposal</h2>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Visual proposal builder</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Basic info */}
        <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
              Project Details
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Client Name
              </label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Sarah Mitchell" className="h-12 rounded-xl font-medium border-border/50 bg-background" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Project Title
              </label>
              <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Kitchen Renovation" className="h-12 rounded-xl font-medium border-border/50 bg-background" />
            </div>
          </div>
        </div>

        {/* Template */}
        <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card space-y-4">
          <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] block">
            Template Style
          </label>
          <TemplateSelector selected={template} onSelect={setTemplate} />
        </div>

        {/* Blocks */}
        <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
              Content Blocks ({blocks.length})
            </label>
          </div>

          <div className="space-y-3">
            {blocks.map((block, i) => {
              const config = BLOCK_OPTIONS.find((o) => o.type === block.type);
              const Icon = config?.icon || Type;

              return (
                <div
                  key={block.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/30 bg-background group hover:border-primary/20 transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0 cursor-grab" />
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-foreground">{config?.label || block.type}</span>
                    <span className="text-xs text-muted-foreground ml-2">Block {i + 1}</span>
                  </div>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add block */}
          <div className="flex flex-wrap gap-2">
            {BLOCK_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <Button
                  key={opt.type}
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(opt.type)}
                  className="gap-2 rounded-xl font-bold text-xs border-border/40 hover:border-primary/30 hover:bg-primary/5"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {opt.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Total */}
        <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card">
          <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-4 block">
            Total Cost ($)
          </label>
          <Input type="number" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} placeholder="5000" className="h-12 rounded-xl font-medium max-w-xs border-border/50 bg-background" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={onClose} className="h-12 px-6 rounded-xl font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-12 px-8 rounded-xl font-bold shadow-md shadow-primary/25 glow-orange group text-base">
            Create Proposal
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
