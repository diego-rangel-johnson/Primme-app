"use client";

import {
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Proposal, ProposalStatus } from "@/lib/inspiration/provider-types";
import { motion } from "motion/react";

interface ProposalListProps {
  proposals: Proposal[];
  onSelect: (proposal: Proposal) => void;
  onNew: () => void;
}

const STATUS_CONFIG: Record<ProposalStatus, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  draft: { label: "Draft", icon: FileText, color: "text-muted-foreground", bg: "bg-muted/50" },
  sent: { label: "Sent", icon: Send, color: "text-primary", bg: "bg-primary/10" },
  viewed: { label: "Viewed", icon: Eye, color: "text-amber-500", bg: "bg-amber-500/10" },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  declined: { label: "Declined", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

export function ProposalList({ proposals, onSelect, onNew }: ProposalListProps) {
  if (proposals.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-foreground font-semibold mb-1">No proposals yet</p>
        <p className="text-body-sm text-muted-foreground mb-4">
          Create your first visual proposal to impress clients.
        </p>
        <Button onClick={onNew} className="rounded-xl text-sm font-semibold">
          Create First Proposal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {proposals.map((proposal, i) => {
        const status = STATUS_CONFIG[proposal.status];
        const StatusIcon = status.icon;

        return (
          <motion.button
            key={proposal.id}
            onClick={() => onSelect(proposal)}
            className="w-full group bg-card rounded-xl p-5 border border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 text-left"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
          >
            <div className="flex items-center gap-5">
              <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}>
                <StatusIcon className={`w-5 h-5 ${status.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-title text-foreground group-hover:text-primary transition-colors truncate">
                    {proposal.projectTitle}
                  </h3>
                  <span className={`text-meta px-1.5 py-0.5 rounded-md border ${status.color} ${status.bg} shrink-0`}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-meta text-muted-foreground">
                  <span>Client: {proposal.clientName}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="capitalize">{proposal.template}</span>
                  {proposal.sentAt && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(proposal.sentAt).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-title text-foreground flex items-center gap-0.5">
                  <DollarSign className="w-4 h-4 text-primary" />
                  {proposal.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
