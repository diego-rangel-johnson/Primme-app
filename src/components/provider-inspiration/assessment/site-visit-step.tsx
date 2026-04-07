"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Camera,
  AlertTriangle,
  Eye,
  CheckSquare,
  CalendarDays,
  StickyNote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Assessment, SitePhoto, PhotoCategory } from "@/lib/inspiration/provider-types";

const PHOTO_CATEGORIES: { value: PhotoCategory; label: string; icon: React.ElementType; color: string }[] = [
  { value: "before", label: "Before", icon: Camera, color: "bg-primary/10 text-primary border-primary/30" },
  { value: "during", label: "During", icon: Eye, color: "bg-warning/10 text-warning border-warning/30" },
  { value: "detail", label: "Detail", icon: ImageIcon, color: "bg-accent/10 text-accent border-accent/30" },
  { value: "issue", label: "Issue", icon: AlertTriangle, color: "bg-destructive/10 text-destructive border-destructive/30" },
];

const DEMO_PHOTOS: SitePhoto[] = [
  { id: "demo-1", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop", category: "before", caption: "Main room overview" },
  { id: "demo-2", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop", category: "issue", caption: "Wall damage near window" },
  { id: "demo-3", url: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&h=600&fit=crop", category: "detail", caption: "Crown molding detail" },
];

interface SiteVisitStepProps {
  data: Pick<Assessment, "sitePhotos" | "fieldNotes" | "visitDate" | "visitCompleted">;
  onChange: (updates: Partial<Assessment>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SiteVisitStep({ data, onChange, onNext, onBack }: SiteVisitStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>("before");
  const [previewPhoto, setPreviewPhoto] = useState<SitePhoto | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newPhoto: SitePhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          url,
          category: activeCategory,
        };
        onChange({ sitePhotos: [...data.sitePhotos, newPhoto] });
      };
      reader.readAsDataURL(file);
    },
    [data.sitePhotos, activeCategory, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      Array.from(e.dataTransfer.files)
        .filter((f) => f.type.startsWith("image/"))
        .forEach(handleFile);
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(handleFile);
  };

  const removePhoto = (id: string) => {
    onChange({ sitePhotos: data.sitePhotos.filter((p) => p.id !== id) });
  };

  const updateCaption = (id: string, caption: string) => {
    onChange({
      sitePhotos: data.sitePhotos.map((p) => (p.id === id ? { ...p, caption } : p)),
    });
  };

  const useDemoPhotos = () => {
    onChange({ sitePhotos: [...data.sitePhotos, ...DEMO_PHOTOS] });
  };

  const photosForCategory = (cat: PhotoCategory) => data.sitePhotos.filter((p) => p.category === cat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-h3 font-display text-foreground tracking-tight mb-2">
          Site Visit & Photos
        </h3>
        <p className="text-sm font-medium text-muted-foreground max-w-lg">
          Document the site condition with categorized photos and field notes for accurate assessment.
        </p>
      </div>

      {/* Visit Status */}
      <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card">
        <div className="flex items-center gap-2 mb-6">
          <CheckSquare className="w-5 h-5 text-primary" />
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
            Visit Status
          </h4>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onChange({ visitCompleted: !data.visitCompleted })}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
              data.visitCompleted
                ? "border-primary/30 bg-primary/5 text-primary shadow-md"
                : "border-border/40 bg-muted/20 text-muted-foreground hover:border-border"
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
              data.visitCompleted ? "bg-primary text-white" : "bg-muted border border-border"
            }`}>
              {data.visitCompleted && <CheckSquare className="w-3.5 h-3.5" />}
            </div>
            Site Visit Completed
          </button>

          <div className="flex items-center gap-3 flex-1">
            <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              type="date"
              value={data.visitDate}
              onChange={(e) => onChange({ visitDate: e.target.value })}
              className="h-11 rounded-xl border-border/50 bg-background font-medium max-w-[200px]"
            />
          </div>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
              Site Photos
            </h4>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {data.sitePhotos.length} photo{data.sitePhotos.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {PHOTO_CATEGORIES.map((cat) => {
            const count = photosForCategory(cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                  activeCategory === cat.value
                    ? cat.color + " shadow-md"
                    : "border-border/30 bg-muted/20 text-muted-foreground hover:border-border/60"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
                {count > 0 && (
                  <span className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center text-[10px]">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Upload Zone */}
        <label
          className={`block cursor-pointer group ${isDragging ? "scale-[1.01]" : ""} transition-transform`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className={`h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
            isDragging
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
          }`}>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1">
              Drop {PHOTO_CATEGORIES.find((c) => c.value === activeCategory)?.label.toLowerCase()} photos here
            </p>
            <p className="text-xs text-muted-foreground font-medium">JPG, PNG up to 10MB each</p>
          </div>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
        </label>

        {data.sitePhotos.length === 0 && (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={useDemoPhotos} className="text-xs font-bold text-primary">
              <ImageIcon className="w-4 h-4 mr-2" />
              Use Demo Photos
            </Button>
          </div>
        )}

        {/* Photo Grid by Category */}
        {PHOTO_CATEGORIES.map((cat) => {
          const photos = photosForCategory(cat.value);
          if (photos.length === 0) return null;
          return (
            <div key={cat.value}>
              <div className="flex items-center gap-2 mb-3">
                <cat.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {cat.label} ({photos.length})
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-border/40 bg-muted/20 animate-in fade-in zoom-in-95 duration-300">
                    <button onClick={() => setPreviewPhoto(photo)} className="block w-full">
                      <img src={photo.url} alt={photo.caption || "Site photo"} className="w-full aspect-[4/3] object-cover" />
                    </button>
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removePhoto(photo.id)}
                        aria-label={`Remove photo ${photo.caption || photo.id}`}
                        className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-2.5">
                      <input
                        type="text"
                        value={photo.caption || ""}
                        onChange={(e) => updateCaption(photo.id, e.target.value)}
                        placeholder="Add caption..."
                        className="w-full text-xs font-medium text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Field Notes */}
      <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border/40 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-primary" />
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">
            Field Notes
          </h4>
        </div>
        <Textarea
          value={data.fieldNotes}
          onChange={(e) => onChange({ fieldNotes: e.target.value })}
          placeholder="Notes from the site visit — access instructions, special conditions, observations, client preferences..."
          className="min-h-[120px] rounded-xl border-border/50 bg-background font-medium resize-none p-4"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} className="h-12 px-6 rounded-xl font-bold">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={data.sitePhotos.length === 0}
          className="h-12 px-8 rounded-xl font-bold shadow-md shadow-primary/25 glow-orange text-base"
        >
          Analyze Photos
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setPreviewPhoto(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative max-w-4xl w-full max-h-[85vh] animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewPhoto.url}
              alt={previewPhoto.caption || "Preview"}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
            {previewPhoto.caption && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md text-white text-sm font-medium px-4 py-2 rounded-xl">
                {previewPhoto.caption}
              </div>
            )}
            <button
              onClick={() => setPreviewPhoto(null)}
              aria-label="Close photo preview"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
