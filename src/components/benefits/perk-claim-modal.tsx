"use client";

import { useState } from "react";
import { Copy, CheckCircle, Tag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PerkClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  perk: {
    title: string;
    partner: string;
    discount: string;
    code: string;
  } | null;
}

export function PerkClaimModal({ open, onOpenChange, perk }: PerkClaimModalProps) {
  const [copied, setCopied] = useState(false);

  if (!perk) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(perk.code);
      setCopied(true);
      toast.success("Promo code copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-success" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-display">
            Perk Claimed!
          </DialogTitle>
          <DialogDescription className="text-center">
            Use the code below to redeem your <strong>{perk.discount}</strong> discount from{" "}
            <strong>{perk.partner}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <p className="text-sm font-bold text-muted-foreground mb-2 text-center">
            {perk.title}
          </p>
          <div className="flex items-center gap-2 bg-muted rounded-xl p-4 border border-border/50">
            <code className="flex-1 text-center text-lg font-black text-foreground tracking-widest">
              {perk.code}
            </code>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 h-9 rounded-lg"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="brand" className="flex-1 h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold" onClick={handleCopy}>
            <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1"><Tag className="w-4 h-4" strokeWidth={2.5} /></span>
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          <Button
            variant="ghost"
            className="flex-1 h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
