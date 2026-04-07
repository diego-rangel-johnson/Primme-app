"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ColorSwatch } from "../shared/color-swatch";
import { getHarmony, type HarmonyType, hexToHsl, getContrastColor } from "@/lib/inspiration/color-utils";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

const HARMONY_TYPES: { id: HarmonyType; label: string }[] = [
  { id: "complementary", label: "Complementary" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "split-complementary", label: "Split Comp." },
  { id: "monochromatic", label: "Monochromatic" },
];

interface HarmonyWheelProps {
  baseColor?: string;
  onBaseColorChange?: (hex: string) => void;
  onPaletteSave?: (colors: string[]) => void;
}

export function HarmonyWheel({
  baseColor: externalBase,
  onBaseColorChange,
  onPaletteSave,
}: HarmonyWheelProps) {
  const [internalBase, setInternalBase] = useState("#2E3B32");
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("analogous");

  const baseColor = externalBase ?? internalBase;
  const setBase = (hex: string) => {
    setInternalBase(hex);
    onBaseColorChange?.(hex);
  };

  const harmonyColors = getHarmony(baseColor, harmonyType);
  const hsl = hexToHsl(baseColor);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-label text-muted-foreground mb-3">Base Color</p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBase(e.target.value)}
            className="w-10 h-10 rounded-lg border border-border/40 cursor-pointer"
          />
          <div>
            <p className="text-sm font-semibold font-mono">{baseColor.toUpperCase()}</p>
            <p className="text-meta">
              HSL({hsl.h}, {hsl.s}%, {hsl.l}%)
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-label text-muted-foreground mb-3">Harmony Type</p>
        <div className="flex flex-wrap gap-1.5">
          {HARMONY_TYPES.map((ht) => (
            <button
              key={ht.id}
              type="button"
              onClick={() => setHarmonyType(ht.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                harmonyType === ht.id
                  ? "bg-foreground text-background"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {ht.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-label text-muted-foreground mb-3">Result</p>
        <div className="flex rounded-xl overflow-hidden h-24 border border-border/30">
          {harmonyColors.map((hex, i) => (
            <motion.div
              key={`${harmonyType}-${hex}-${i}`}
              className="flex-1 flex items-end justify-center pb-2 relative group/swatch"
              style={{ backgroundColor: hex }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <span
                className={cn(
                  "text-[9px] font-mono opacity-0 group-hover/swatch:opacity-100 transition-opacity",
                  getContrastColor(hex) === "white" ? "text-white/70" : "text-black/50"
                )}
              >
                {hex.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          {harmonyColors.map((hex, i) => (
            <ColorSwatch key={`${harmonyType}-swatch-${hex}-${i}`} hex={hex} size="sm" name={hex} />
          ))}
        </div>
      </div>

      {onPaletteSave && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl font-semibold text-xs w-full"
          onClick={() => onPaletteSave(harmonyColors)}
        >
          Save This Palette
        </Button>
      )}
    </div>
  );
}
