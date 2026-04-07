"use client";

import { Heart } from "lucide-react";
import type { Material } from "@/lib/inspiration/provider-types";
import { toggleMaterialFavorite } from "@/lib/inspiration/provider-store";

interface MaterialCardProps {
  material: Material;
  onToggleFavorite: () => void;
}

export function MaterialCard({ material, onToggleFavorite }: MaterialCardProps) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMaterialFavorite(material.id);
    onToggleFavorite();
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={material.imageUrl}
          alt={material.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />

        <button
          onClick={handleFavorite}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-subtle hover:scale-105 transition-transform"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              material.isFavorite ? "text-rose-500 fill-rose-500" : "text-muted-foreground"
            }`}
          />
        </button>

        <div className="absolute bottom-2.5 left-2.5">
          <span className="text-meta text-white/80 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded capitalize">
            {material.category}
          </span>
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between mb-1.5">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {material.name}
            </h3>
            <p className="text-meta text-muted-foreground">{material.brand}</p>
          </div>
          <div className="text-right shrink-0 ml-2">
            <span className="text-sm font-semibold text-primary">
              ${material.pricePerUnit}
            </span>
            <span className="text-meta text-muted-foreground block">/{material.unit}</span>
          </div>
        </div>

        {Object.entries(material.specs).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(material.specs).slice(0, 2).map(([key, val]) => (
              <span
                key={key}
                className="text-meta text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/30"
              >
                {val}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
