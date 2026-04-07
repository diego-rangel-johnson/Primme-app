"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SaveToBoardButton } from "../shared/save-to-board-button";
import { FEED_ITEMS } from "@/lib/inspiration/seed-data";
import { toggleSaveFeedItem, getSavedFeedIds } from "@/lib/inspiration/store";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function TrendingPreview() {
  const trending = FEED_ITEMS.sort((a, b) => b.savedCount - a.savedCount).slice(0, 3);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSavedIds(getSavedFeedIds());
  }, []);

  const handleToggle = (id: string) => {
    const nowSaved = toggleSaveFeedItem(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <SurfaceCard className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-h3 font-display text-foreground tracking-tight">Trending</h2>
            <p className="text-xs text-muted-foreground font-medium">Most saved this week</p>
          </div>
        </div>
        <Link
          href="/client/inspiration/explore"
          className="text-label text-primary hover:text-primary-light flex items-center gap-1 group bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors duration-fast border border-primary/10"
        >
          SEE ALL
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trending.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
          >
            <Link
              href={`/client/inspiration/explore?highlight=${item.id}`}
              className="group relative rounded-xl overflow-hidden border border-border/40 block hover:border-primary/20 transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 flex justify-between items-end">
                <div className="min-w-0">
                  {item.color && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/25"
                        style={{ backgroundColor: item.color.hex }}
                      />
                      <span className="text-meta text-white/70 uppercase tracking-wider">
                        {item.color.name}
                      </span>
                    </div>
                  )}
                  <p className="text-white font-semibold text-sm leading-tight truncate">{item.title}</p>
                </div>
                <SaveToBoardButton
                  size="sm"
                  variant="overlay"
                  saved={savedIds.has(item.id)}
                  onToggle={() => handleToggle(item.id)}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </SurfaceCard>
  );
}
