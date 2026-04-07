"use client";

import { useState } from "react";
import { X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMaterial } from "@/lib/inspiration/provider-store";
import type { MaterialCategory } from "@/lib/inspiration/provider-types";
import { toast } from "sonner";

interface AddMaterialModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const CATEGORIES: { value: MaterialCategory; label: string }[] = [
  { value: "paint", label: "Paint" },
  { value: "tile", label: "Tile" },
  { value: "countertop", label: "Countertop" },
  { value: "fixture", label: "Fixture" },
  { value: "hardware", label: "Hardware" },
  { value: "flooring", label: "Flooring" },
  { value: "lighting", label: "Lighting" },
  { value: "cabinetry", label: "Cabinetry" },
];

export function AddMaterialModal({ onClose, onCreated }: AddMaterialModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<MaterialCategory>("paint");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("gallon");
  const [tagsInput, setTagsInput] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !brand.trim()) {
      toast.error("Please fill in name and brand");
      return;
    }

    createMaterial({
      name: name.trim(),
      brand: brand.trim(),
      category,
      imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop",
      specs: {},
      pricePerUnit: Number(price) || 0,
      unit: unit.trim() || "unit",
      isFavorite: false,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    });

    toast.success("Material added to showroom!");
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-background rounded-3xl shadow-overlay overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10">
        <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Package className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-lg font-black text-foreground tracking-tight">Add Material</h2>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
              Name
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Emerald Interior" className="h-12 rounded-xl font-medium" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                Brand
              </label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Sherwin-Williams" className="h-12 rounded-xl font-medium" />
            </div>
            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                Price per Unit ($)
              </label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="79" className="h-12 rounded-xl font-medium" />
            </div>
            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                Unit
              </label>
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="gallon" className="h-12 rounded-xl font-medium" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
              Tags (comma-separated)
            </label>
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="premium, interior, satin" className="h-12 rounded-xl font-medium" />
          </div>
        </div>

        <div className="px-8 py-5 border-t border-border/50 bg-muted/30 flex items-center justify-end gap-4">
          <Button variant="outline" onClick={onClose} className="h-11 px-6 rounded-xl font-bold">Cancel</Button>
          <Button onClick={handleSubmit} className="h-11 px-6 rounded-xl font-bold shadow-md shadow-primary/20">Add Material</Button>
        </div>
      </div>
    </div>
  );
}
