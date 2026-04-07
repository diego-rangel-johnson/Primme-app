"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROOM_CATEGORIES, STYLE_TAGS } from "@/lib/inspiration/seed-data";
import type { RoomCategory, StyleTag, FeedItem } from "@/lib/inspiration/types";

const TYPE_OPTIONS = [
  { id: "all", label: "All" },
  { id: "room", label: "Rooms" },
  { id: "color", label: "Colors" },
  { id: "texture", label: "Textures" },
  { id: "finish", label: "Finishes" },
] as const;

export interface FeedFilters {
  search: string;
  category?: RoomCategory;
  style?: StyleTag;
  type?: FeedItem["type"];
}

interface FeedFiltersBarProps {
  filters: FeedFilters;
  onChange: (filters: FeedFilters) => void;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
        active
          ? "bg-foreground text-background"
          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function FeedFiltersBar({ filters, onChange }: FeedFiltersBarProps) {
  const [expanded, setExpanded] = useState(false);

  const update = (patch: Partial<FeedFilters>) => onChange({ ...filters, ...patch });

  const activeCount = [filters.category, filters.style, filters.type].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search inspiration..."
            className="pl-9 h-9 bg-card border-border/40 rounded-xl text-sm"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-xl font-semibold text-xs gap-1.5 border-border/40",
            expanded && "border-foreground/20 bg-foreground/5"
          )}
          onClick={() => setExpanded(!expanded)}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-foreground text-background text-label flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-destructive"
            onClick={() => onChange({ search: filters.search })}
          >
            <X className="w-3 h-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      {expanded && (
        <div className="space-y-4 p-4 bg-card rounded-xl border border-border/40 animate-in fade-in slide-in-from-top-1 duration-200">
          <div>
            <p className="text-label text-muted-foreground mb-2">Type</p>
            <div className="flex flex-wrap gap-1.5">
              {TYPE_OPTIONS.map((opt) => (
                <Chip
                  key={opt.id}
                  active={opt.id === "all" ? !filters.type : filters.type === opt.id}
                  onClick={() => update({ type: opt.id === "all" ? undefined : (opt.id as FeedItem["type"]) })}
                >
                  {opt.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="text-label text-muted-foreground mb-2">Room</p>
            <div className="flex flex-wrap gap-1.5">
              {ROOM_CATEGORIES.map((cat) => (
                <Chip
                  key={cat.id}
                  active={filters.category === cat.id}
                  onClick={() => update({ category: filters.category === cat.id ? undefined : (cat.id as RoomCategory) })}
                >
                  {cat.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="text-label text-muted-foreground mb-2">Style</p>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_TAGS.map((style) => (
                <Chip
                  key={style.id}
                  active={filters.style === style.id}
                  onClick={() => update({ style: filters.style === style.id ? undefined : (style.id as StyleTag) })}
                >
                  {style.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
