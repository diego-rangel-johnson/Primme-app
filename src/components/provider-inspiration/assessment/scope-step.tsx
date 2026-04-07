"use client";

import { useState } from "react";
import {
  Check,
  X,
  DollarSign,
  Plus,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Wrench,
  Package,
  HardHat,
  Paintbrush,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ScopeItem, ScopeCategory, Assessment } from "@/lib/inspiration/provider-types";

const SCOPE_CATEGORIES: { value: ScopeCategory; label: string; icon: React.ElementType; color: string }[] = [
  { value: "preparation", label: "Preparation", icon: Wrench, color: "text-primary bg-primary/10 border-primary/20" },
  { value: "materials", label: "Materials", icon: Package, color: "text-accent bg-accent/10 border-accent/20" },
  { value: "labor", label: "Labor", icon: HardHat, color: "text-warning bg-warning/10 border-warning/20" },
  { value: "finishing", label: "Finishing", icon: Paintbrush, color: "text-primary bg-primary/10 border-primary/20" },
];

interface ScopeStepProps {
  items: ScopeItem[];
  onChange: (items: ScopeItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ScopeStep({ items, onChange, onNext, onBack }: ScopeStepProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, isIncluded: !item.isIncluded } : item)));
  };

  const updateItem = (id: string, updates: Partial<ScopeItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const addItem = (category: ScopeCategory) => {
    const newItem: ScopeItem = {
      id: `si-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      description: "",
      category,
      estimatedCost: { min: 0, max: 0 },
      materialQty: 1,
      materialUnit: "unit",
      isIncluded: true,
    };
    onChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragEnd = () => setDraggedId(null);

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    const oldIdx = items.findIndex((i) => i.id === draggedId);
    const newIdx = items.findIndex((i) => i.id === targetId);
    if (oldIdx === -1 || newIdx === -1) return;
    const reordered = [...items];
    const [moved] = reordered.splice(oldIdx, 1);
    reordered.splice(newIdx, 0, moved);
    onChange(reordered);
  };

  const included = items.filter((i) => i.isIncluded);
  const totalMin = included.reduce((sum, i) => sum + i.estimatedCost.min, 0);
  const totalMax = included.reduce((sum, i) => sum + i.estimatedCost.max, 0);

  const categoryItems = (cat: ScopeCategory) => items.filter((i) => i.category === cat);

  const categorySubtotal = (cat: ScopeCategory) => {
    const catItems = categoryItems(cat).filter((i) => i.isIncluded);
    return {
      min: catItems.reduce((s, i) => s + i.estimatedCost.min, 0),
      max: catItems.reduce((s, i) => s + i.estimatedCost.max, 0),
    };
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
            Scope of Work
          </h3>
          <p className="text-sm font-medium text-muted-foreground max-w-lg">
            Review and customize the AI-generated scope. Toggle items, edit costs, add custom line items, and reorder by dragging.
          </p>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ListChecks className="w-5 h-5 text-primary" />
          <div>
            <span className="text-sm font-bold text-foreground">{included.length} of {items.length}</span>
            <span className="text-sm text-muted-foreground ml-1">items included</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Total Range</p>
          <p className="text-xl font-black text-foreground tracking-tight">
            ${totalMin.toLocaleString()} — ${totalMax.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Scope by Category */}
      {SCOPE_CATEGORIES.map((cat) => {
        const catItems = categoryItems(cat.value);
        const sub = categorySubtotal(cat.value);
        const CatIcon = cat.icon;

        return (
          <div key={cat.value} className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-foreground uppercase tracking-wide">
                  {cat.label}
                </h4>
                <span className="text-xs font-bold text-muted-foreground">({catItems.length})</span>
              </div>
              <div className="flex items-center gap-3">
                {sub.max > 0 && (
                  <span className="text-xs font-bold text-primary">
                    ${sub.min.toLocaleString()} — ${sub.max.toLocaleString()}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addItem(cat.value)}
                  className="rounded-lg text-xs font-bold text-primary hover:bg-primary/5"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {catItems.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground font-medium">
                No items yet. Click "Add" to create one.
              </div>
            ) : (
              <div className="space-y-2">
                {catItems.map((item) => {
                  const isEditing = editingId === item.id;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        item.isIncluded
                          ? "border-border/30 bg-background hover:border-primary/30"
                          : "border-border/20 bg-muted/10 opacity-50 hover:opacity-70"
                      } ${draggedId === item.id ? "opacity-30 scale-95" : ""}`}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0 hover:text-muted-foreground" />

                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          item.isIncluded ? "bg-primary text-white" : "bg-muted border border-border"
                        }`}
                      >
                        {item.isIncluded ? <Check className="w-4 h-4" /> : <X className="w-3 h-3 text-muted-foreground" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <Input
                            autoFocus
                            value={item.description}
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                            onBlur={() => setEditingId(null)}
                            onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                            className="h-8 text-sm font-bold border-primary/30 bg-primary/5"
                            placeholder="Describe scope item..."
                          />
                        ) : (
                          <button
                            onClick={() => setEditingId(item.id)}
                            className={`text-sm font-bold text-left w-full truncate ${
                              item.isIncluded ? "text-foreground" : "text-muted-foreground line-through"
                            }`}
                          >
                            {item.description || "Click to edit..."}
                          </button>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {item.materialQty} {item.materialUnit}
                          </span>
                        </div>
                      </div>

                      {/* Editable Cost Range */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={item.estimatedCost.min || ""}
                          onChange={(e) => updateItem(item.id, { estimatedCost: { ...item.estimatedCost, min: Number(e.target.value) || 0 } })}
                          className="w-20 h-8 text-xs text-right border-border/30 bg-muted/30 rounded-lg font-bold"
                        />
                        <span className="text-xs text-muted-foreground">—</span>
                        <Input
                          type="number"
                          value={item.estimatedCost.max || ""}
                          onChange={(e) => updateItem(item.id, { estimatedCost: { ...item.estimatedCost, max: Number(e.target.value) || 0 } })}
                          className="w-20 h-8 text-xs text-right border-border/30 bg-muted/30 rounded-lg font-bold"
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.description || "item"}`}
                        className="w-8 h-8 shrink-0 text-muted-foreground opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} className="h-12 px-6 rounded-xl font-bold">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={included.length === 0}
          className="h-12 px-8 rounded-xl font-bold shadow-md shadow-primary/25 glow-orange text-base"
        >
          Set Pricing
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
