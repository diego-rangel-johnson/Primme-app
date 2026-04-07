"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ProposalList } from "@/components/provider-inspiration/proposals/proposal-list";
import { ProposalBuilder } from "@/components/provider-inspiration/proposals/proposal-builder";
import { ProposalPreview } from "@/components/provider-inspiration/proposals/proposal-preview";
import { InspirationPageHeader } from "@/components/provider-inspiration/page-header";
import { InspirationSubNav } from "@/components/provider-inspiration/inspiration-sub-nav";
import { getProposals } from "@/lib/inspiration/provider-store";
import type { Proposal } from "@/lib/inspiration/provider-types";

type ActiveView = "list" | "builder" | "preview";

export default function ProposalsPage() {
  const [activeView, setActiveView] = useState<ActiveView>("list");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const proposals = useMemo(() => getProposals(), [refreshKey]);

  const handleCreated = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setActiveView("list");
  }, []);

  const handleSelectProposal = useCallback((proposal: Proposal) => {
    setSelectedProposal(proposal);
    setActiveView("preview");
  }, []);

  const handleBackToList = useCallback(() => {
    setActiveView("list");
    setSelectedProposal(null);
  }, []);

  const stats = useMemo(() => {
    const accepted = proposals.filter((p) => p.status === "accepted").length;
    const total = proposals.reduce((sum, p) => sum + p.totalCost, 0);
    return { accepted, total };
  }, [proposals]);

  return (
    <div className="min-h-full bg-muted/20 pb-20">
      <InspirationPageHeader
        icon={FileText}
        badge="Proposals"
        title="Proposals"
        subtitle={`${proposals.length} proposal${proposals.length !== 1 ? "s" : ""} · ${stats.accepted} accepted · $${stats.total.toLocaleString()} total value`}
        actions={
          activeView === "list" ? (
            <Button
              onClick={() => setActiveView("builder")}
              variant="brand"
              className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </span>
              New Proposal
            </Button>
          ) : undefined
        }
      />
      <InspirationSubNav />

      <div className="px-6 lg:px-10 py-8">
        <AnimatePresence mode="wait">
          {activeView === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <ProposalList
                proposals={proposals}
                onSelect={handleSelectProposal}
                onNew={() => setActiveView("builder")}
              />
            </motion.div>
          )}

          {activeView === "builder" && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <ProposalBuilder
                onClose={handleBackToList}
                onCreated={handleCreated}
              />
            </motion.div>
          )}

          {activeView === "preview" && selectedProposal && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <ProposalPreview
                proposal={selectedProposal}
                onClose={handleBackToList}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
