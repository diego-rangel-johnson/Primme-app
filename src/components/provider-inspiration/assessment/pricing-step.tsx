"use client";

import { useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ScopeItem, PricingBreakdown, PricingLineItem, Assessment } from "@/lib/inspiration/provider-types";

interface PricingStepProps {
  scopeItems: ScopeItem[];
  pricing: PricingBreakdown;
  data?: Pick<Assessment, "estimatedSqft">;
  onChange: (pricing: PricingBreakdown) => void;
  onNext: () => void;
  onBack: () => void;
}

const DEFAULT_LABOR_RATE = 65;
const MARKET_AVG_SQFT_PRICE = 4.5;

export function PricingStep({ scopeItems, pricing, data, onChange, onNext, onBack }: PricingStepProps) {
  const included = scopeItems.filter((s) => s.isIncluded);

  const updateLineItem = (id: string, updates: Partial<PricingLineItem>) => {
    const newItems = pricing.lineItems.map((li) => {
      if (li.id !== id) return li;
      const updated = { ...li, ...updates };
      updated.subtotal = updated.materialCost + updated.laborHours * updated.laborRate;
      return updated;
    });
    recalculate(newItems, pricing.profitMargin, pricing.discount, pricing.taxRate);
  };

  const recalculate = (
    lineItems: PricingLineItem[],
    profitMargin: number,
    discount: number,
    taxRate: number
  ) => {
    const materialTotal = lineItems.reduce((s, li) => s + li.materialCost, 0);
    const laborTotal = lineItems.reduce((s, li) => s + li.laborHours * li.laborRate, 0);
    const subtotal = materialTotal + laborTotal;
    const afterMargin = subtotal * (1 + profitMargin / 100);
    const afterDiscount = afterMargin - discount;
    const taxAmount = afterDiscount * (taxRate / 100);
    const total = afterDiscount + taxAmount;

    onChange({
      lineItems,
      materialTotal,
      laborTotal,
      subtotal,
      profitMargin,
      discount,
      taxRate,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  };

  const adjustMargin = (delta: number) => {
    const newMargin = Math.max(0, Math.min(50, pricing.profitMargin + delta));
    recalculate(pricing.lineItems, newMargin, pricing.discount, pricing.taxRate);
  };

  const sqft = data?.estimatedSqft || 450;

  const marketComparison = useMemo(() => {
    const avgForCategory = MARKET_AVG_SQFT_PRICE;
    if (pricing.total === 0 || sqft === 0) return null;
    const marketAvg = avgForCategory * sqft;
    const diff = ((pricing.total - marketAvg) / marketAvg) * 100;
    return { diff: Math.round(diff), isAbove: diff > 0 };
  }, [pricing.total, sqft]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-h3 font-display text-foreground tracking-tight mb-2">
          Pricing Breakdown
        </h3>
        <p className="text-sm font-medium text-muted-foreground max-w-lg">
          Set material costs, labor hours, and profit margin for each scope item. Your total updates in real-time.
        </p>
      </div>

      {/* Line Items Table */}
      <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5 text-primary" />
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
            Cost Breakdown
          </h4>
        </div>

        {/* Header — desktop only */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-3 mb-3">
          <span className="col-span-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Item</span>
          <span className="col-span-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Materials</span>
          <span className="col-span-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Hours</span>
          <span className="col-span-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Rate/hr</span>
          <span className="col-span-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Subtotal</span>
        </div>

        <div className="space-y-2">
          {pricing.lineItems.map((li) => (
            <div key={li.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 rounded-xl border border-border/30 bg-background hover:border-primary/20 transition-colors">
              <div className="md:col-span-4">
                <p className="text-sm font-bold text-foreground truncate">{li.description}</p>
              </div>
              <div className="md:col-span-2">
                <label className="md:hidden text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Materials $</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={li.materialCost || ""}
                    onChange={(e) => updateLineItem(li.id, { materialCost: Number(e.target.value) || 0 })}
                    aria-label={`Material cost for ${li.description}`}
                    className="h-9 pl-6 text-right text-xs font-bold border-border/30 bg-muted/30 rounded-lg"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="md:hidden text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Hours</label>
                <Input
                  type="number"
                  value={li.laborHours || ""}
                  onChange={(e) => updateLineItem(li.id, { laborHours: Number(e.target.value) || 0 })}
                  aria-label={`Labor hours for ${li.description}`}
                  className="h-9 text-center text-xs font-bold border-border/30 bg-muted/30 rounded-lg"
                  step="0.5"
                />
              </div>
              <div className="md:col-span-2">
                <label className="md:hidden text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Rate/hr $</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={li.laborRate || ""}
                    onChange={(e) => updateLineItem(li.id, { laborRate: Number(e.target.value) || 0 })}
                    aria-label={`Labor rate for ${li.description}`}
                    className="h-9 pl-6 text-right text-xs font-bold border-border/30 bg-muted/30 rounded-lg"
                  />
                </div>
              </div>
              <div className="md:col-span-2 text-right">
                <label className="md:hidden text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block text-right">Subtotal</label>
                <span className="text-sm font-black text-foreground">
                  ${li.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-6 border-t border-border/40 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Materials</span>
            <span className="font-bold text-foreground">${pricing.materialTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Labor</span>
            <span className="font-bold text-foreground">${pricing.laborTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <Separator className="bg-border/30" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Subtotal</span>
            <span className="font-bold text-foreground">${pricing.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Margin & Adjustments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Margin */}
        <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
              Profit Margin
            </h4>
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustMargin(-5)}
              disabled={pricing.profitMargin <= 0}
              className="w-10 h-10 rounded-xl"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <span className="text-4xl font-black text-primary tracking-tighter">{pricing.profitMargin}%</span>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                +${Math.round(pricing.subtotal * pricing.profitMargin / 100).toLocaleString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustMargin(5)}
              disabled={pricing.profitMargin >= 50}
              className="w-10 h-10 rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(pricing.profitMargin / 50) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">0%</span>
            <span className="text-[10px] text-muted-foreground">50%</span>
          </div>
        </div>

        {/* Tax & Discount */}
        <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card space-y-5">
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
            Adjustments
          </h4>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Tax Rate (%)
            </Label>
            <Input
              type="number"
              value={pricing.taxRate}
              onChange={(e) => recalculate(pricing.lineItems, pricing.profitMargin, pricing.discount, Number(e.target.value) || 0)}
              className="h-11 rounded-xl border-border/50 bg-background font-bold"
              step="0.25"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Discount ($)
            </Label>
            <Input
              type="number"
              value={pricing.discount || ""}
              onChange={(e) => recalculate(pricing.lineItems, pricing.profitMargin, Number(e.target.value) || 0, pricing.taxRate)}
              className="h-11 rounded-xl border-border/50 bg-background font-bold"
              placeholder="0.00"
            />
          </div>

          <div className="pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Tax ({pricing.taxRate}%)</span>
              <span className="font-bold text-foreground">${pricing.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            {pricing.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-success font-medium">Discount</span>
                <span className="font-bold text-success">-${pricing.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="bg-muted/30 rounded-3xl p-6 lg:p-8 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Proposal Value</p>
            <p className="text-4xl font-black text-primary tracking-tighter">
              ${pricing.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          {marketComparison && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
              Math.abs(marketComparison.diff) > 20
                ? "bg-warning/10 border-warning/30 text-warning"
                : "bg-primary/10 border-primary/30 text-primary"
            }`}>
              <BarChart3 className="w-4 h-4" />
              <div className="text-xs font-bold">
                <span>{marketComparison.isAbove ? "+" : ""}{marketComparison.diff}%</span>
                <span className="block text-[10px] font-medium opacity-70">vs market avg</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-primary/80 leading-relaxed font-medium">
            Includes Primme Payment Protection & Escrow Guarantee. Client will receive a secure interactive proposal.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} className="h-12 px-6 rounded-xl font-bold">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={pricing.total <= 0}
          className="h-12 px-8 rounded-xl font-bold shadow-md shadow-primary/25 glow-orange text-base"
        >
          Review Proposal
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

export function buildInitialPricing(scopeItems: ScopeItem[]): PricingBreakdown {
  const included = scopeItems.filter((s) => s.isIncluded);
  const lineItems: PricingLineItem[] = included.map((item) => {
    const avgCost = (item.estimatedCost.min + item.estimatedCost.max) / 2;
    const materialCost = Math.round(avgCost * 0.35);
    const laborTotal = avgCost - materialCost;
    const laborHours = Math.round((laborTotal / DEFAULT_LABOR_RATE) * 2) / 2;

    return {
      id: `pl-${item.id}`,
      scopeItemId: item.id,
      description: item.description,
      materialCost,
      laborHours: Math.max(0.5, laborHours),
      laborRate: DEFAULT_LABOR_RATE,
      subtotal: materialCost + Math.max(0.5, laborHours) * DEFAULT_LABOR_RATE,
    };
  });

  const materialTotal = lineItems.reduce((s, li) => s + li.materialCost, 0);
  const laborTotal = lineItems.reduce((s, li) => s + li.laborHours * li.laborRate, 0);
  const subtotal = materialTotal + laborTotal;
  const profitMargin = 20;
  const discount = 0;
  const taxRate = 8.25;
  const afterMargin = subtotal * (1 + profitMargin / 100);
  const afterDiscount = afterMargin - discount;
  const taxAmount = Math.round(afterDiscount * (taxRate / 100) * 100) / 100;
  const total = Math.round((afterDiscount + taxAmount) * 100) / 100;

  return { lineItems, materialTotal, laborTotal, subtotal, profitMargin, discount, taxRate, taxAmount, total };
}
