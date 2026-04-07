"use client";

import { ArrowLeft, Send, DollarSign, Clock, Palette, Image as ImageIcon, FileText } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Proposal } from "@/lib/inspiration/provider-types";
import { toast } from "sonner";

interface ProposalPreviewProps {
  proposal: Proposal;
  onClose: () => void;
}

export function ProposalPreview({ proposal, onClose }: ProposalPreviewProps) {
  const handleSend = () => {
    toast.success("Proposal sent to client!", {
      description: `${proposal.clientName} will receive a link to review your proposal.`,
    });
    onClose();
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
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Proposal Preview</p>
            <h2 className="text-sm font-black text-foreground tracking-tight">{proposal.projectTitle}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
            For {proposal.clientName} &middot; {proposal.template} template
          </span>
        </div>
      </div>

      {/* Preview Card */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-3xl shadow-card border border-border/40 overflow-hidden">
          {/* Preview header */}
          <div className="bg-ink p-8 lg:p-10 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black tracking-tighter">Primme</h1>
                <p className="text-xs text-primary/80 font-bold mt-1">Certified Provider</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Proposal</p>
                <p className="text-sm font-bold text-white/80 capitalize">{proposal.template}</p>
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-1">{proposal.projectTitle}</h2>
            <p className="text-sm text-white/70">For {proposal.clientName}</p>
          </div>

          {/* Preview body */}
          <div className="p-8 space-y-6">
            {proposal.blocks
              .sort((a, b) => a.order - b.order)
              .map((block) => {
                switch (block.type) {
                  case "text":
                    return (
                      <div key={block.id} className="space-y-2">
                        <h3 className="text-lg font-bold text-foreground">
                          {(block.data as { heading?: string }).heading || "Section"}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                          {(block.data as { body?: string }).body || ""}
                        </p>
                      </div>
                    );

                  case "before-after": {
                    const ba = block.data as { beforeUrl?: string; afterUrl?: string };
                    return (
                      <div key={block.id} className="grid grid-cols-2 gap-4">
                        <div className="aspect-video rounded-2xl border border-border/40 overflow-hidden bg-muted/30 flex items-center justify-center">
                          {ba.beforeUrl ? (
                            <img src={ba.beforeUrl} alt="Before" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <ImageIcon className="w-8 h-8" />
                              <span className="text-xs font-bold">Before</span>
                            </div>
                          )}
                        </div>
                        <div className="aspect-video rounded-2xl border border-border/40 overflow-hidden bg-muted/30 flex items-center justify-center">
                          {ba.afterUrl ? (
                            <img src={ba.afterUrl} alt="After" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <ImageIcon className="w-8 h-8" />
                              <span className="text-xs font-bold">After</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  case "palette": {
                    const pal = block.data as { colors?: string[] };
                    return (
                      <div key={block.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <Palette className="w-4 h-4 text-primary" />
                          <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">Color Palette</span>
                        </div>
                        <div className="flex gap-2">
                          {(pal.colors || []).map((color, i) => (
                            <div key={i} className="flex-1">
                              <div className="aspect-square rounded-xl shadow-sm border border-border/40" style={{ backgroundColor: color }} />
                              <span className="text-[10px] font-bold text-muted-foreground mt-1 block text-center">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  case "timeline": {
                    const tl = block.data as { phases?: { name: string; days: number }[] };
                    return (
                      <div key={block.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">Project Timeline</span>
                        </div>
                        <div className="flex gap-2">
                          {(tl.phases || []).map((phase, i) => (
                            <div key={i} className="flex-1 p-3 rounded-xl border border-border/40 bg-muted/20 text-center">
                              <span className="text-sm font-bold text-foreground block">{phase.name}</span>
                              <span className="text-xs text-muted-foreground font-medium">{phase.days} days</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  case "cost": {
                    const cost = block.data as { subtotal?: number; tax?: number; total?: number };
                    return (
                      <div key={block.id} className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                        <div className="flex items-center gap-2 mb-4">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">Cost Summary</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-bold">${(cost.subtotal || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="font-bold">${(cost.tax || 0).toLocaleString()}</span>
                          </div>
                          <Separator className="bg-border/40" />
                          <div className="flex justify-between">
                            <span className="text-base font-black">Total</span>
                            <span className="text-xl font-black text-primary">${(cost.total || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  default:
                    return (
                      <div key={block.id} className="p-4 rounded-xl border border-border/40 bg-muted/20">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">{block.type} block</span>
                        </div>
                      </div>
                    );
                }
              })}

            {/* Total footer inside the card */}
            <Separator className="bg-border/30" />
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Investment</span>
                <p className="text-3xl font-black text-foreground tracking-tight">
                  ${proposal.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6">
          <Button variant="outline" onClick={onClose} className="h-12 px-6 rounded-xl font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proposals
          </Button>
          {proposal.status === "draft" && (
            <Button onClick={handleSend} className="h-14 px-8 rounded-2xl font-black text-base uppercase tracking-wider shadow-xl shadow-primary/25 glow-orange gap-2 group">
              <Send className="w-5 h-5" />
              Send to Client
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
