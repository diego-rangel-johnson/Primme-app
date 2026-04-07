"use client";

import { FeedCard } from "./feed-card";
import type { FeedItem } from "@/lib/inspiration/types";
import { motion } from "motion/react";

interface FeedGridProps {
  items: FeedItem[];
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  onItemClick: (item: FeedItem) => void;
}

export function FeedGrid({ items, savedIds, onToggleSave, onItemClick }: FeedGridProps) {
  if (items.length === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-foreground font-semibold">No results found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
      </motion.div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {items.map((item, i) => (
        <FeedCard
          key={item.id}
          item={item}
          saved={savedIds.has(item.id)}
          onToggleSave={() => onToggleSave(item.id)}
          onClick={() => onItemClick(item)}
          index={i}
        />
      ))}
    </div>
  );
}
