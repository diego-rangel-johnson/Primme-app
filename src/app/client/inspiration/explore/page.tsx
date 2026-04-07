"use client";

import { useState, useEffect, useMemo } from "react";
import { Compass } from "lucide-react";
import { FeedFiltersBar, type FeedFilters } from "@/components/inspiration/explore/feed-filters";
import { FeedGrid } from "@/components/inspiration/explore/feed-grid";
import { ImageLightbox } from "@/components/inspiration/explore/image-lightbox";
import { InspirationPageHeader } from "@/components/inspiration/page-header";
import { InspirationSubNav } from "@/components/inspiration/inspiration-sub-nav";
import { FEED_ITEMS } from "@/lib/inspiration/seed-data";
import { getSavedFeedIds, toggleSaveFeedItem } from "@/lib/inspiration/store";
import type { FeedItem } from "@/lib/inspiration/types";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

export default function ExplorePage() {
  const [filters, setFilters] = useState<FeedFilters>({ search: "" });
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [lightboxItem, setLightboxItem] = useState<FeedItem | null>(null);

  useEffect(() => {
    setSavedIds(getSavedFeedIds());
  }, []);

  const filtered = useMemo(() => {
    let items = [...FEED_ITEMS];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.type) items = items.filter((i) => i.type === filters.type);
    if (filters.category) items = items.filter((i) => i.category === filters.category);
    if (filters.style) items = items.filter((i) => i.style === filters.style);
    return items;
  }, [filters]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const toggleSave = (id: string) => {
    const nowSaved = toggleSaveFeedItem(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div className="min-h-full bg-muted/20 pb-20">
      <InspirationPageHeader
        icon={Compass}
        badge="Explore"
        title="Explore"
        subtitle="Browse curated rooms, color stories, textures, and finishes."
      />
      <InspirationSubNav />

      <div className="px-6 lg:px-10 py-8">
        <div className="space-y-6">
          <FeedFiltersBar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />

          <FeedGrid
            items={paginated}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onItemClick={setLightboxItem}
          />

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold"
                onClick={() => setPage((p) => p + 1)}
              >
                Load More
              </Button>
            </div>
          )}
        </div>

        <ImageLightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
          saved={lightboxItem ? savedIds.has(lightboxItem.id) : false}
          onToggleSave={() => {
            if (lightboxItem) toggleSave(lightboxItem.id);
          }}
        />
      </div>
    </div>
  );
}
