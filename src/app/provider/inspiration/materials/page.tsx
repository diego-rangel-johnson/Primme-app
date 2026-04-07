"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, Plus, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaterialGrid } from "@/components/provider-inspiration/materials/material-grid";
import { MaterialBundles } from "@/components/provider-inspiration/materials/material-bundles";
import { AddMaterialModal } from "@/components/provider-inspiration/materials/add-material-modal";
import { InspirationPageHeader } from "@/components/provider-inspiration/page-header";
import { InspirationSubNav } from "@/components/provider-inspiration/inspiration-sub-nav";
import { getMaterials } from "@/lib/inspiration/provider-store";
import type { MaterialCategory } from "@/lib/inspiration/provider-types";
import { cn } from "@/lib/utils";

const CATEGORY_FILTERS: { value: MaterialCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "paint", label: "Paint" },
  { value: "tile", label: "Tile" },
  { value: "countertop", label: "Countertop" },
  { value: "fixture", label: "Fixture" },
  { value: "hardware", label: "Hardware" },
  { value: "flooring", label: "Flooring" },
  { value: "lighting", label: "Lighting" },
  { value: "cabinetry", label: "Cabinetry" },
];

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<MaterialCategory | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const materials = useMemo(
    () =>
      getMaterials({
        category: category === "all" ? undefined : category,
        search: searchQuery || undefined,
        favoritesOnly: favoritesOnly || undefined,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, category, favoritesOnly, refreshKey]
  );

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-full bg-muted/20 pb-20">
      <InspirationPageHeader
        icon={Package}
        badge="Materials"
        title="Material Showroom"
        subtitle={`${materials.length} material${materials.length !== 1 ? "s" : ""} in your library.`}
        actions={
          <>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search materials..."
                className="pl-10 h-11 w-56 rounded-xl border border-border/50 bg-card text-sm focus:border-primary/40 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={favoritesOnly ? "default" : "outline"}
              className="rounded-xl h-11 font-bold"
              onClick={() => setFavoritesOnly(!favoritesOnly)}
            >
              <Heart className={cn("w-4 h-4", favoritesOnly && "fill-current")} />
            </Button>
            <Button
              onClick={() => setShowAdd(true)}
              variant="brand"
              className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </span>
              Add
            </Button>
          </>
        }
      />
      <InspirationSubNav />

      <div className="px-6 lg:px-10 py-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mb-6">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                category === cat.value
                  ? "bg-foreground text-background"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <MaterialBundles />
        <MaterialGrid materials={materials} onRefresh={handleRefresh} />
      </div>

      {showAdd && (
        <AddMaterialModal onClose={() => setShowAdd(false)} onCreated={handleRefresh} />
      )}
    </div>
  );
}
