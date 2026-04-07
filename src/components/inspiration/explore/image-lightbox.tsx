"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Heart, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorSwatch } from "../shared/color-swatch";
import type { FeedItem } from "@/lib/inspiration/types";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageLightboxProps {
  item: FeedItem | null;
  onClose: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
}

export function ImageLightbox({ item, onClose, saved, onToggleSave }: ImageLightboxProps) {
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractColors = useCallback((imgSrc: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = 50;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const data = ctx.getImageData(0, 0, size, size).data;
      const colorMap = new Map<string, number>();

      for (let i = 0; i < data.length; i += 16) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const key = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        colorMap.set(key, (colorMap.get(key) ?? 0) + 1);
      }

      const sorted = [...colorMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([hex]) => hex);

      setExtractedColors(sorted);
    };
    img.src = imgSrc;
  }, []);

  useEffect(() => {
    if (item) {
      setExtractedColors([]);
      extractColors(item.imageUrl);
    }
  }, [item, extractColors]);

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl border-border/40 gap-0">
        <DialogTitle className="sr-only">{item?.title ?? "Image detail"}</DialogTitle>
        {item && (
          <div className="flex flex-col lg:flex-row max-h-[85vh]">
            {/* Image */}
            <div className="lg:w-3/5 bg-muted overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover max-h-[45vh] lg:max-h-none"
              />
            </div>

            {/* Details */}
            <div className="lg:w-2/5 p-6 overflow-y-auto flex flex-col">
              <div className="mb-4">
                <p className="text-label text-primary mb-1">{item.type}</p>
                <h2 className="text-h2 font-display text-foreground tracking-tight">
                  {item.title}
                </h2>
              </div>

              {item.description && (
                <p className="text-body-sm text-muted-foreground mb-5">{item.description}</p>
              )}

              {item.color && (
                <div className="mb-5 p-3 rounded-xl bg-muted/40 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-border/30" style={{ backgroundColor: item.color.hex }} />
                    <div>
                      <p className="text-sm font-semibold">{item.color.name}</p>
                      {item.color.brand && (
                        <p className="text-meta">{item.color.brand}</p>
                      )}
                      <p className="text-xs font-mono text-muted-foreground">
                        {item.color.hex.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-5">
                <span className="px-2 py-0.5 rounded-md bg-muted/60 text-meta font-semibold capitalize">
                  {item.category.replace("-", " ")}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-muted/60 text-meta font-semibold capitalize">
                  {item.style}
                </span>
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-muted/60 text-meta font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {extractedColors.length > 0 && (
                <div className="mb-5">
                  <p className="text-label text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Palette className="w-3 h-3" /> Extracted Palette
                  </p>
                  <div className="flex gap-1.5">
                    {extractedColors.map((hex) => (
                      <ColorSwatch key={hex} hex={hex} size="sm" name={hex} />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                <Button
                  className="w-full rounded-xl font-semibold"
                  onClick={onToggleSave}
                >
                  <Heart className={`w-4 h-4 mr-2 ${saved ? "fill-current" : ""}`} />
                  {saved ? "Saved" : "Save to Collection"}
                </Button>
              </div>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
