"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getPaintColors } from "@/lib/inspiration/store";
import type { PaintColor, ColorFamily } from "@/lib/inspiration/types";
import { getContrastColor } from "@/lib/inspiration/color-utils";
import { motion } from "motion/react";

const BRANDS = [
  { id: undefined, label: "All Brands" },
  { id: "sherwin-williams" as const, label: "Sherwin-Williams" },
  { id: "benjamin-moore" as const, label: "Benjamin Moore" },
  { id: "farrow-ball" as const, label: "Farrow & Ball" },
  { id: "behr" as const, label: "Behr" },
];

const FAMILIES: { id: ColorFamily | undefined; label: string }[] = [
  { id: undefined, label: "All" },
  { id: "white", label: "Whites" },
  { id: "gray", label: "Grays" },
  { id: "beige", label: "Beiges" },
  { id: "green", label: "Greens" },
  { id: "blue", label: "Blues" },
  { id: "black", label: "Blacks" },
  { id: "brown", label: "Browns" },
];

interface BrandBrowserProps {
  onColorSelect?: (color: PaintColor) => void;
  selectedColorId?: string;
}

export function BrandBrowser({ onColorSelect, selectedColorId }: BrandBrowserProps) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState<PaintColor["brand"] | undefined>(undefined);
  const [family, setFamily] = useState<ColorFamily | undefined>(undefined);

  const colors = useMemo(
    () => getPaintColors({ brand, family, search }),
    [brand, family, search]
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

      <div className="flex flex-wrap gap-1.5">
        {BRANDS.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => setBrand(b.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              brand === b.id
                ? "bg-foreground text-background"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {b.label}
          </button>
        ))}
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[500px] overflow-y-auto pr-1">
        {colors.map((color, i) => {
          const contrast = getContrastColor(color.hex);
          return (
            <motion.button
              key={color.id}
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.015, 0.2) }}
              onClick={() => onColorSelect?.(color)}
              className={cn(
                "relative rounded-xl p-3 text-left transition-all duration-200 border",
                selectedColorId === color.id
                  ? "ring-2 ring-foreground border-foreground/30 shadow-elevated"
                  : "border-transparent hover:border-border/50"
              )}
              style={{ backgroundColor: color.hex }}
            >
              <p className={cn("text-xs font-semibold truncate", contrast === "white" ? "text-white" : "text-black/80")}>
                {color.name}
              </p>
              <p className={cn("text-label truncate mt-0.5", contrast === "white" ? "text-white/50" : "text-black/40")}>
                {color.brandDisplayName}
              </p>
              <p className={cn("text-label font-mono mt-1", contrast === "white" ? "text-white/30" : "text-black/25")}>
                {color.hex.toUpperCase()}
              </p>
            </motion.button>
          );
        })}
      </div>

      {colors.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">No colors match your search.</p>
      )}
    </div>
  );
}
