"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getPaintColors } from "@/lib/inspiration/store";
import { getContrastColor } from "@/lib/inspiration/color-utils";
import type { PaintColor, ColorFamily } from "@/lib/inspiration/types";

const FAMILIES: { id: ColorFamily | undefined; label: string }[] = [
  { id: undefined, label: "All" },
  { id: "white", label: "Whites" },
  { id: "gray", label: "Grays" },
  { id: "beige", label: "Beiges" },
  { id: "green", label: "Greens" },
  { id: "blue", label: "Blues" },
  { id: "brown", label: "Browns" },
  { id: "black", label: "Blacks" },
];

interface ColorPickerPanelProps {
  selectedColor: PaintColor | null;
  onColorSelect: (color: PaintColor) => void;
  customHex?: string;
  onCustomHexChange?: (hex: string) => void;
}

export function ColorPickerPanel({
  selectedColor,
  onColorSelect,
  customHex,
  onCustomHexChange,
}: ColorPickerPanelProps) {
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState<ColorFamily | undefined>(undefined);

  const colors = useMemo(
    () => getPaintColors({ family, search }).slice(0, 30),
    [family, search]
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search colors..."
          className="pl-9 h-9 bg-card border-border/40 rounded-xl text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {FAMILIES.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFamily(f.id)}
            className={cn(
              "px-2.5 py-1 rounded-md text-meta font-semibold transition-colors",
              family === f.id
                ? "bg-foreground text-background"
                : "bg-muted/40 text-muted-foreground hover:bg-muted"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1.5 max-h-52 overflow-y-auto pr-1">
        {colors.map((color) => {
          const contrast = getContrastColor(color.hex);
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onColorSelect(color)}
              className={cn(
                "aspect-square rounded-lg border transition-all",
                selectedColor?.id === color.id
                  ? "ring-2 ring-foreground border-foreground/30"
                  : "border-transparent hover:border-border/50"
              )}
              style={{ backgroundColor: color.hex }}
              title={`${color.name} - ${color.hex}`}
            />
          );
        })}
      </div>

      <div>
        <p className="text-label text-muted-foreground mb-2">Custom Color</p>
        <div className="flex gap-2">
          <input
            type="color"
            value={customHex ?? "#808080"}
            onChange={(e) => onCustomHexChange?.(e.target.value)}
            className="w-9 h-9 rounded-lg border border-border/40 cursor-pointer"
          />
          <Input
            placeholder="#HEXCODE"
            className="font-mono text-xs h-9 rounded-lg flex-1"
            value={customHex ?? ""}
            onChange={(e) => onCustomHexChange?.(e.target.value)}
          />
        </div>
      </div>

      {selectedColor && (
        <div className="p-3 rounded-xl bg-muted/40 border border-border/30">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-border/20"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <div>
              <p className="text-sm font-semibold">{selectedColor.name}</p>
              <p className="text-meta">{selectedColor.brandDisplayName}</p>
              <p className="text-xs font-mono text-muted-foreground">{selectedColor.hex.toUpperCase()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
