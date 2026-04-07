"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2, Globe, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BoardCanvas } from "@/components/inspiration/boards/board-canvas";
import { BoardSidebar } from "@/components/inspiration/boards/board-sidebar";
import {
  getMoodboard,
  updateMoodboard,
  addItemToMoodboard,
  updateMoodboardItem,
  removeItemFromMoodboard,
} from "@/lib/inspiration/store";
import type { Moodboard, MoodboardItem } from "@/lib/inspiration/types";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "motion/react";

export default function BoardEditorPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;
  const [board, setBoard] = useState<Moodboard | null>(null);

  useEffect(() => {
    const loaded = getMoodboard(boardId);
    if (!loaded) {
      router.push("/client/inspiration/boards");
      return;
    }
    setBoard(loaded);
  }, [boardId, router]);

  const refresh = useCallback(() => {
    const updated = getMoodboard(boardId);
    if (updated) setBoard(updated);
  }, [boardId]);

  const handleAddItem = useCallback(
    (item: Omit<MoodboardItem, "id" | "moodboardId" | "createdAt">) => {
      addItemToMoodboard(boardId, item);
      refresh();
    },
    [boardId, refresh]
  );

  const handleItemMove = useCallback(
    (itemId: string, x: number, y: number) => {
      updateMoodboardItem(boardId, itemId, { positionX: Math.max(0, x), positionY: Math.max(0, y) });
      refresh();
    },
    [boardId, refresh]
  );

  const handleItemRemove = useCallback(
    (itemId: string) => {
      removeItemFromMoodboard(boardId, itemId);
      refresh();
    },
    [boardId, refresh]
  );

  const togglePublic = () => {
    if (!board) return;
    updateMoodboard(boardId, { isPublic: !board.isPublic });
    refresh();
    toast.success(board.isPublic ? "Board set to private" : "Board is now public");
  };

  if (!board) {
    return (
      <div className="min-h-full bg-muted/20 pb-10">
        <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-10 pt-6 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="w-48 h-6 rounded-lg" />
              <Skeleton className="w-24 h-3 rounded" />
            </div>
          </div>
          <Skeleton className="w-full h-[500px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-muted/20 pb-10">
      <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-10 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/client/inspiration/boards">
              <Button variant="ghost" size="icon" className="rounded-xl shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-h2 font-display text-foreground tracking-tight truncate">
                {board.title}
              </h1>
              <p className="text-xs text-muted-foreground">
                {board.items.length} items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold gap-1.5"
              onClick={togglePublic}
            >
              {board.isPublic ? (
                <>
                  <Globe className="w-3.5 h-3.5" /> Public
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Private
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold gap-1.5"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <BoardCanvas
            items={board.items}
            onItemMove={handleItemMove}
            onItemRemove={handleItemRemove}
            className="flex-1 w-full"
          />
          <BoardSidebar onAddItem={handleAddItem} />
        </div>
      </div>
    </div>
  );
}
