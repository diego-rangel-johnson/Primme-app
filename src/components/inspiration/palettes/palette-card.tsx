"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColorPalette } from "@/lib/inspiration/types";

interface PaletteCardProps {
  palette: ColorPalette;
  onDelete?: () => void;
  showActions?: boolean;
}

export function PaletteCard({ palette, onDelete, showActions = true }: PaletteCardProps) {
  return (
    <div className="group rounded-xl border border-border/30 bg-card overflow-hidden hover:border-border/60 transition-all duration-200">
      <div className="flex h-12">
        {palette.colors.map((hex, i) => (
          <div key={`${palette.id}-${hex}-${i}`} className="flex-1" style={{ backgroundColor: hex }} />
        ))}
      </div>

      <div className="px-3 py-2.5 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate text-foreground">{palette.name}</p>
          <p className="text-meta">{palette.colors.length} colors</p>
        </div>
        {showActions && onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
            onClick={onDelete}
            aria-label="Delete palette"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
