"use client";

import { SaveToBoardButton } from "../shared/save-to-board-button";
import type { FeedItem } from "@/lib/inspiration/types";
import { motion } from "motion/react";

interface FeedCardProps {
  item: FeedItem;
  saved?: boolean;
  onToggleSave?: () => void;
  onClick?: () => void;
  index?: number;
}

export function FeedCard({ item, saved, onToggleSave, onClick, index = 0 }: FeedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.25) }}
      className="break-inside-avoid mb-4"
    >
      <div
        role="button"
        tabIndex={0}
        className="relative rounded-xl overflow-hidden group cursor-pointer border border-border/30 bg-card hover:border-border/50 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 z-20">
          <span className="px-2 py-0.5 text-label rounded-md bg-foreground/80 text-background backdrop-blur-sm">
            {item.type}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex justify-between items-end">
            <div className="min-w-0 flex-1 mr-3">
              {item.color && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/25"
                    style={{ backgroundColor: item.color.hex }}
                  />
                  <span className="text-label text-white/70">
                    {item.color.name}
                  </span>
                </div>
              )}
              <p className="text-white font-semibold text-sm leading-tight truncate">{item.title}</p>
            </div>
            <SaveToBoardButton
              size="sm"
              variant="overlay"
              saved={saved}
              onToggle={onToggleSave}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
