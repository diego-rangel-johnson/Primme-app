"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Grid3X3 } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getMoodboards } from "@/lib/inspiration/store";
import type { Moodboard } from "@/lib/inspiration/types";
import { motion } from "motion/react";

export function RecentBoardsStrip() {
  const [boards, setBoards] = useState<Moodboard[]>([]);

  useEffect(() => {
    setBoards(getMoodboards().slice(0, 6));
  }, []);

  if (boards.length === 0) return null;

  return (
    <SurfaceCard className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Grid3X3 className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-h3 font-display text-foreground tracking-tight">My Moodboards</h2>
            <p className="text-xs text-muted-foreground font-medium">Your curated visual collections</p>
          </div>
        </div>
        <Link
          href="/client/inspiration/boards"
          className="text-label text-primary hover:text-primary-light flex items-center gap-1 group bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors duration-fast border border-primary/10"
        >
          VIEW ALL
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        {boards.map((board, i) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
          >
            <Link
              href={`/client/inspiration/boards/${board.id}`}
              className="group shrink-0 w-48 block"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/40 bg-muted group-hover:border-primary/25 transition-all duration-300">
                {board.coverImageUrl ? (
                  <img
                    src={board.coverImageUrl}
                    alt={board.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1 w-10 h-10 opacity-20">
                      {[0, 1, 2, 3].map((n) => (
                        <div key={n} className="rounded-sm bg-muted-foreground/40" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {board.title}
              </p>
              <p className="text-meta">{board.items.length} items</p>
            </Link>
          </motion.div>
        ))}

        <Link
          href="/client/inspiration/boards"
          className="shrink-0 w-48"
        >
          <div className="aspect-[4/3] rounded-xl border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">New Board</span>
          </div>
        </Link>
      </div>
    </SurfaceCard>
  );
}
