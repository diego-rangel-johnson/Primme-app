"use client";

import Link from "next/link";
import { Share2, Trash2, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Moodboard } from "@/lib/inspiration/types";
import { motion } from "motion/react";

interface BoardCardProps {
  board: Moodboard;
  onDelete?: () => void;
  index?: number;
}

export function BoardCard({ board, onDelete, index = 0 }: BoardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.25) }}
      className="group"
    >
      <Link href={`/client/inspiration/boards/${board.id}`}>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-border/40 bg-muted group-hover:border-primary/20 transition-all duration-300">
          {board.coverImageUrl ? (
            <img
              src={board.coverImageUrl}
              alt={board.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1 w-10 h-10 opacity-20">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="rounded-sm bg-muted-foreground/30" />
                ))}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
            <Button
              size="icon"
              variant="secondary"
              className="w-7 h-7 rounded-full bg-background/90 hover:bg-background text-foreground shadow-md"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(`${window.location.origin}/client/inspiration/boards/${board.id}`);
              }}
              aria-label="Copy link"
            >
              <Share2 className="w-3 h-3" />
            </Button>
            {onDelete && (
              <Button
                size="icon"
                variant="secondary"
                className="w-7 h-7 rounded-full bg-background/90 hover:bg-destructive/10 text-foreground hover:text-destructive shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                aria-label="Delete board"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>

          <div className="absolute bottom-2.5 left-2.5">
            {board.isPublic ? (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded-md text-[9px] font-semibold text-foreground">
                <Globe className="w-2.5 h-2.5" /> Public
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-md text-[9px] font-semibold text-white">
                <Lock className="w-2.5 h-2.5" /> Private
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-2.5">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {board.title}
        </h3>
        <p className="text-meta mt-0.5">
          {board.items.length} items · Updated{" "}
          {new Date(board.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
      </div>
    </motion.div>
  );
}
