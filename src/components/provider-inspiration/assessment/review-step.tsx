"use client";

import {
  Send,
  Save,
  Download,
  Check,
  MapPin,
  Home,
  Ruler,
  AlertTriangle,
  DollarSign,
  Calendar,
  ChevronLeft,
  Camera,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Assessment } from "@/lib/inspiration/provider-types";

const CONDITION_COLORS: Record<string, string> = {
  excellent: "text-success bg-success/10 border-success/30",
  good: "text-primary bg-primary/10 border-primary/30",
  fair: "text-warning bg-warning/10 border-warning/30",
  poor: "text-destructive bg-destructive/10 border-destructive/30",
};

interface ReviewStepProps {
  assessment: Assessment;
  onBack: () => void;
  onSaveDraft: () => void;
  onSend: () => void;
}

export function ReviewStep({ assessment, onBack, onSaveDraft, onSend }: ReviewStepProps) {
  const pricing = assessment.pricing;
  const included = assessment.scopeItems.filter((i) => i.isIncluded);

  const handleDownloadPDF = () => {
    toast.success("Generating premium PDF...", {
      description: "Your proposal PDF will be ready in a moment.",
    });
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
          <h3 className="text-h3 font-display text-foreground tracking-tight mb-2">
            Review & Send Proposal
          </h3>
          <p className="text-sm font-medium text-muted-foreground max-w-lg">
            Everything looks good? Review the final proposal below and send it to the client.
          </p>
        </div>
      </div>

      {/* PDF-style Preview */}
      <div className="bg-card rounded-3xl shadow-overlay border border-border/20 overflow-hidden">
        {/* Dark Header */}
        <div className="bg-ink p-8 lg:p-10 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black tracking-tighter">Primme</h1>
              <p className="text-xs text-primary/80 font-bold mt-1">Certified Provider</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Proposal</p>
              <p className="text-sm font-bold text-white/80">{assessment.id.toUpperCase()}</p>
            </div>
          </div>

          <h2 className="text-3xl font-black tracking-tight mb-3">{assessment.title}</h2>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {assessment.clientName && (
              <span className="flex items-center gap-1.5 text-white/70">
                <span className="text-white font-bold">{assessment.clientName}</span>
              </span>
            )}
            {assessment.address && (
              <span className="flex items-center gap-1.5 text-white/70">
                <MapPin className="w-3.5 h-3.5" />
                {assessment.address}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 lg:p-10 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <Home className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Room</p>
              <p className="text-sm font-black text-foreground capitalize">{assessment.roomType.replace("-", " ")}</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <Ruler className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Area</p>
              <p className="text-sm font-black text-foreground">{assessment.estimatedSqft} sqft</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Condition</p>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded border ${CONDITION_COLORS[assessment.condition]}`}>
                {assessment.condition}
              </span>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Visit Date</p>
              <p className="text-sm font-black text-foreground">
                {assessment.visitDate ? new Date(assessment.visitDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}
              </p>
            </div>
          </div>

          {/* Project Description */}
          {assessment.projectDescription && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Project Overview</h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">{assessment.projectDescription}</p>
            </div>
          )}

          {/* Site Photos */}
          {assessment.sitePhotos.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5" />
                Site Documentation ({assessment.sitePhotos.length} photos)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {assessment.sitePhotos.slice(0, 6).map((photo) => (
                  <div key={photo.id} className="relative rounded-lg overflow-hidden border border-border/30">
                    <img src={photo.url} alt={photo.caption || ""} className="w-full aspect-[4/3] object-cover" />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                        <p className="text-[9px] font-medium text-white truncate">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Condition Notes */}
          {assessment.conditionNotes.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Condition Findings</h4>
              <div className="space-y-2">
                {assessment.conditionNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="bg-border/30" />

          {/* Scope of Work */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Scope of Work</h4>
            <div className="border border-border/30 rounded-lg overflow-hidden">
              {included.map((item, i) => (
                <div key={item.id} className={`flex justify-between items-center p-3 ${i < included.length - 1 ? "border-b border-border/30" : ""} bg-muted/20`}>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-bold text-foreground">{item.description}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground shrink-0">
                    {item.materialQty} {item.materialUnit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          {pricing && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Investment Summary</h4>
              <div className="bg-muted/30 rounded-xl p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Materials</span>
                  <span className="font-bold text-foreground">${pricing.materialTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Labor</span>
                  <span className="font-bold text-foreground">${pricing.laborTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {pricing.profitMargin > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Service Fee ({pricing.profitMargin}%)</span>
                    <span className="font-bold text-foreground">${Math.round(pricing.subtotal * pricing.profitMargin / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success font-medium">Discount</span>
                    <span className="font-bold text-success">-${pricing.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Tax ({pricing.taxRate}%)</span>
                  <span className="font-bold text-foreground">${pricing.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <Separator className="bg-border/30" />
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Total Investment</span>
                  <span className="text-3xl font-black text-foreground tracking-tight">
                    ${pricing.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Material Recommendations */}
          {assessment.materialRecommendations.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Recommended Materials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assessment.materialRecommendations.map((mat, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border/30 bg-muted/20">
                    <p className="text-xs font-bold text-foreground">{mat.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{mat.brand} &middot; {mat.quantity} {mat.unit} @ ${mat.unitPrice}/{mat.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-border/30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Primme Verified Guarantee</span>
            </div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons — grouped: secondary left, primary right */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <Button variant="outline" onClick={onBack} className="h-12 px-6 rounded-xl font-bold">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Button>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => { onSaveDraft(); toast.success("Assessment saved as draft"); }}
              className="h-11 px-5 rounded-xl font-bold flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="h-11 px-5 rounded-xl font-bold flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
          <Button
            onClick={() => { onSend(); toast.success("Proposal sent to client!", { description: `${assessment.clientName} will receive an interactive proposal link.` }); }}
            className="h-14 px-8 rounded-2xl font-black text-base uppercase tracking-wider shadow-xl shadow-primary/25 glow-orange group"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Proposal
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
