"use client";

import { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPortfolioProject } from "@/lib/inspiration/provider-store";
import type { RoomCategory, StyleTag } from "@/lib/inspiration/types";
import { toast } from "sonner";

interface UploadProjectModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const CATEGORIES: { value: RoomCategory; label: string }[] = [
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
  { value: "living-room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "exterior", label: "Exterior" },
  { value: "office", label: "Office" },
  { value: "dining-room", label: "Dining Room" },
  { value: "hallway", label: "Hallway" },
];

const STYLES: { value: StyleTag; label: string }[] = [
  { value: "modern", label: "Modern" },
  { value: "coastal", label: "Coastal" },
  { value: "industrial", label: "Industrial" },
  { value: "scandinavian", label: "Scandinavian" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "minimalist", label: "Minimalist" },
  { value: "mid-century", label: "Mid-Century" },
  { value: "contemporary", label: "Contemporary" },
  { value: "traditional", label: "Traditional" },
  { value: "rustic", label: "Rustic" },
];

const DEMO_BEFORE = [
  "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
];

const DEMO_AFTER = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
];

export function UploadProjectModal({ onClose, onCreated }: UploadProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RoomCategory>("kitchen");
  const [style, setStyle] = useState<StyleTag>("modern");
  const [sqft, setSqft] = useState("");
  const [duration, setDuration] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [scope, setScope] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [beforePreview, setBeforePreview] = useState("");
  const [afterPreview, setAfterPreview] = useState("");

  const handleFileUpload = (type: "before" | "after") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (type === "before") setBeforePreview(url);
      else setAfterPreview(url);
    };
    reader.readAsDataURL(file);
  };

  const useDemoImages = () => {
    const idx = Math.floor(Math.random() * DEMO_BEFORE.length);
    setBeforePreview(DEMO_BEFORE[idx]);
    setAfterPreview(DEMO_AFTER[idx]);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    createPortfolioProject({
      title: title.trim(),
      description: description.trim() || "No description provided.",
      beforeImageUrl: beforePreview || DEMO_BEFORE[0],
      afterImageUrl: afterPreview || DEMO_AFTER[0],
      category,
      style,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      materials: [],
      scope: scope.trim() || "General renovation",
      budget: {
        min: Number(budgetMin) || 5000,
        max: Number(budgetMax) || 15000,
      },
      duration: duration.trim() || "2 weeks",
      sqft: Number(sqft) || 200,
      isPublic: true,
    });

    toast.success("Project added to portfolio!");
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] bg-background rounded-3xl shadow-overlay overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-white/10">
        <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">Upload Project</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Add to your portfolio
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Photos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.15em]">
                Before &amp; After Photos
              </h3>
              <Button variant="ghost" size="sm" onClick={useDemoImages} className="text-xs font-bold text-primary">
                Use Demo Images
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="group cursor-pointer">
                <div className="aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center overflow-hidden transition-all">
                  {beforePreview ? (
                    <img src={beforePreview} alt="Before" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Plus className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-muted-foreground">Before Photo</span>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload("before")} />
              </label>
              <label className="group cursor-pointer">
                <div className="aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center overflow-hidden transition-all">
                  {afterPreview ? (
                    <img src={afterPreview} alt="After" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Plus className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-muted-foreground">After Photo</span>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload("after")} />
              </label>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                Project Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Kitchen Renovation"
                className="h-12 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project, challenges, and results..."
                className="w-full h-24 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RoomCategory)}
                  className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as StyleTag)}
                  className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {STYLES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                  Sq Ft
                </label>
                <Input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="200" className="h-12 rounded-xl font-medium" />
              </div>
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                  Duration
                </label>
                <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="2 weeks" className="h-12 rounded-xl font-medium" />
              </div>
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                  Tags
                </label>
                <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="paint, modern" className="h-12 rounded-xl font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                  Budget Min ($)
                </label>
                <Input type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="5000" className="h-12 rounded-xl font-medium" />
              </div>
              <div>
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                  Budget Max ($)
                </label>
                <Input type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="15000" className="h-12 rounded-xl font-medium" />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em] mb-2 block">
                Scope of Work
              </label>
              <textarea
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Full kitchen renovation including cabinet replacement, countertop installation..."
                className="w-full h-20 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-border/50 bg-muted/30 flex items-center justify-end gap-4">
          <Button variant="outline" onClick={onClose} className="h-12 px-8 rounded-xl font-bold">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="h-12 px-8 rounded-xl font-bold shadow-md shadow-primary/20">
            Add to Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
}
