"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorSwatch } from "../shared/color-swatch";
import { motion } from "motion/react";

interface PaletteGeneratorProps {
  onPaletteGenerated?: (colors: string[]) => void;
}

export function PaletteGenerator({ onPaletteGenerated }: PaletteGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const extractColors = useCallback((src: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = 80;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const data = ctx.getImageData(0, 0, size, size).data;
      const colorMap = new Map<string, number>();

      for (let i = 0; i < data.length; i += 8) {
        const r = Math.round(data[i] / 24) * 24;
        const g = Math.round(data[i + 1] / 24) * 24;
        const b = Math.round(data[i + 2] / 24) * 24;
        const key = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        colorMap.set(key, (colorMap.get(key) ?? 0) + 1);
      }

      const sorted = [...colorMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([hex]) => hex);

      setExtractedColors(sorted);
    };
    img.src = src;
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageUrl(src);
      extractColors(src);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-label text-muted-foreground mb-3">Extract From Image</p>

        {!imageUrl ? (
          <div
            className="rounded-xl border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/3 p-10 text-center cursor-pointer transition-all"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file?.type.startsWith("image/")) handleFile(file);
            }}
          >
            <UploadCloud className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">Drop an image here</p>
            <p className="text-meta">or click to browse</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-border/30">
              <img src={imageUrl} alt="Uploaded" className="w-full max-h-64 object-cover" />
              <button
                type="button"
                className="absolute top-2 right-2 text-xs font-semibold text-white bg-black/40 px-2 py-1 rounded-md hover:bg-black/60 transition-colors"
                onClick={() => {
                  setImageUrl(null);
                  setExtractedColors([]);
                }}
              >
                Replace
              </button>
            </div>

            {extractedColors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-label text-muted-foreground mb-3">Extracted Colors</p>
                <div className="flex rounded-xl overflow-hidden h-16 border border-border/30 mb-3">
                  {extractedColors.map((hex, i) => (
                    <div key={`bar-${i}`} className="flex-1" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {extractedColors.map((hex, i) => (
                    <ColorSwatch key={`swatch-${i}`} hex={hex} size="sm" name={hex} />
                  ))}
                </div>
                <Button
                  className="w-full mt-4 rounded-xl text-xs font-semibold"
                  onClick={() => onPaletteGenerated?.(extractedColors)}
                >
                  <Download className="w-3.5 h-3.5 mr-2" /> Save Palette
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
