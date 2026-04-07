"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { UploadZone } from "@/components/inspiration/visualizer/upload-zone";
import { ColorPickerPanel } from "@/components/inspiration/visualizer/color-picker-panel";
import { VisualizationCard } from "@/components/inspiration/visualizer/visualization-card";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { InspirationPageHeader } from "@/components/inspiration/page-header";
import { InspirationSubNav } from "@/components/inspiration/inspiration-sub-nav";
import type { PaintColor } from "@/lib/inspiration/types";
import { PAINT_COLORS } from "@/lib/inspiration/seed-data";

interface LocalSession {
  originalImageUrl: string;
  selectedColor: PaintColor | null;
  intensity: number;
  comparison: boolean;
}

const SUGGESTED_COLORS = PAINT_COLORS.slice(0, 6);

export default function VisualizerPage() {
  const [session, setSession] = useState<LocalSession>({
    originalImageUrl: "",
    selectedColor: null,
    intensity: 0.5,
    comparison: false,
  });
  const [customHex, setCustomHex] = useState("");

  const hasImage = !!session.originalImageUrl;
  const hasColor = !!session.selectedColor;

  const handleApply = (color: PaintColor) => {
    setSession((prev) => ({ ...prev, selectedColor: color }));
  };

  const handleReset = () => {
    setSession({
      originalImageUrl: "",
      selectedColor: null,
      intensity: 0.5,
      comparison: false,
    });
  };

  return (
    <div className="min-h-full bg-muted/20 pb-20">
      <InspirationPageHeader
        icon={Eye}
        badge="Visualizer"
        title="Color Visualizer"
        subtitle="Upload a room photo and preview paint colors before committing."
      />
      <InspirationSubNav />

      <div className="px-6 lg:px-10 py-8">
        {!hasImage ? (
          <div className="max-w-xl">
            <UploadZone onImageSelect={(src) => setSession((prev) => ({ ...prev, originalImageUrl: src }))} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              {session.comparison && hasColor ? (
                <BeforeAfterSlider
                  beforeImage={session.originalImageUrl}
                  afterImage={session.originalImageUrl}
                  afterOverlayColor={session.selectedColor?.hex}
                  afterOverlayOpacity={session.intensity * 0.6}
                />
              ) : (
                <VisualizationCard
                  originalImageUrl={session.originalImageUrl}
                  selectedColor={session.selectedColor}
                  intensity={session.intensity}
                />
              )}

              <div className="flex items-center gap-3">
                <label className="text-label text-muted-foreground whitespace-nowrap">
                  Intensity
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={session.intensity}
                  onChange={(e) =>
                    setSession((prev) => ({ ...prev, intensity: parseFloat(e.target.value) }))
                  }
                  className="flex-1 accent-primary h-1"
                />
                <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                  {Math.round(session.intensity * 100)}%
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={session.comparison ? "default" : "outline"}
                  size="sm"
                  className="rounded-xl text-xs font-semibold"
                  onClick={() => setSession((prev) => ({ ...prev, comparison: !prev.comparison }))}
                  disabled={!hasColor}
                >
                  Before / After
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-semibold"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> New Photo
                </Button>
              </div>

              {!hasColor && (
                <div>
                  <p className="text-label text-muted-foreground mb-3">Quick Pick</p>
                  <div className="flex gap-2 flex-wrap">
                    {SUGGESTED_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleApply(c)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/40 bg-card hover:border-primary/30 transition-all text-left"
                      >
                        <span className="w-5 h-5 rounded-md border border-border/20" style={{ backgroundColor: c.hex }} />
                        <span className="text-xs font-semibold text-foreground">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <ColorPickerPanel
                selectedColor={session.selectedColor}
                onColorSelect={handleApply}
                customHex={customHex}
                onCustomHexChange={setCustomHex}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
