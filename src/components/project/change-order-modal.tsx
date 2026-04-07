"use client";

import React, { useState } from "react";
import { 
  X, 
  FileEdit, 
  Fingerprint, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChangeOrderModalProps {
  onClose: () => void;
  projectTitle?: string;
}

export function ChangeOrderModal({ onClose, projectTitle = "Main Bedroom Suite" }: ChangeOrderModalProps) {
  const [step, setStep] = useState<"review" | "signing" | "complete">("review");

  const handleSign = () => {
    setStep("signing");
    setTimeout(() => {
      setStep("complete");
      toast.success("Change Order Executed!", {
        description: "Funds have been secured in escrow for the new project scope."
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-background rounded-3xl shadow-overlay border border-white/10 animate-in zoom-in-95 duration-500">
        
        {step === "review" && (
          <div className="p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <FileEdit className="w-7 h-7 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div>
              <h3 className="text-3xl font-black text-foreground tracking-tighter mb-2">Change Order #01</h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Project: {projectTitle}</p>
            </div>

            <div className="bg-muted/50 rounded-3xl p-8 space-y-6 border border-border/50">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Additions to Scope</h4>
                <div className="flex justify-between items-center bg-background p-4 rounded-xl border border-border/40">
                  <span className="font-bold text-foreground">Guest Bathroom Trim</span>
                  <span className="font-black text-primary">+$850.00</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-primary/80 leading-relaxed uppercase tracking-wider">
                   Adds +2 days to estimated completion
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <span className="text-lg font-black text-foreground uppercase tracking-tight">Total Adjustment</span>
                <span className="text-2xl font-black text-primary tracking-tighter">$850.00</span>
              </div>
            </div>

            <Button variant="brand" className="w-full h-16 rounded-2xl text-lg font-bold ring-1 ring-inset ring-white/15 shadow-xl shadow-primary/20" onClick={handleSign}>
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-2"><ArrowRight className="w-5 h-5" strokeWidth={2.5} /></span>
              Sign & Approve
            </Button>
          </div>
        )}

        {step === "signing" && (
          <div className="p-10 text-center space-y-10 py-20">
             <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <div className="relative w-full h-full bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary">
                   <Fingerprint className="w-16 h-16 text-primary animate-pulse" />
                </div>
             </div>
             <div>
                <h3 className="text-3xl font-black text-foreground tracking-tighter mb-2">Authenticating</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Waiting for FaceID / Biometric verification...</p>
             </div>
          </div>
        )}

        {step === "complete" && (
          <div className="p-10 text-center space-y-8 py-16 animate-in fade-in duration-500">
             <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto border border-success/20">
                <CheckCircle2 className="w-10 h-10 text-success" />
             </div>
             <div>
                <h3 className="text-3xl font-black text-foreground tracking-tighter mb-2">Scope Updated</h3>
                <p className="text-muted-foreground font-medium mb-10">The Change Order has been legally signed and the budget updated. The provider has been notified.</p>
                <Button variant="ghost" className="h-14 px-8 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300" onClick={onClose}>
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1"><ArrowLeft className="w-4 h-4 text-primary" /></span>
                  Return to Dashboard
                </Button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
