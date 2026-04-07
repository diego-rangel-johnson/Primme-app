"use client";

import { useState, useEffect } from "react";
import { Plus, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardCard } from "@/components/inspiration/boards/board-card";
import { InspirationPageHeader } from "@/components/inspiration/page-header";
import { InspirationSubNav } from "@/components/inspiration/inspiration-sub-nav";
import { getMoodboards, createMoodboard, deleteMoodboard } from "@/lib/inspiration/store";
import type { Moodboard } from "@/lib/inspiration/types";
import { toast } from "sonner";

export default function BoardsPage() {
  const [boards, setBoards] = useState<Moodboard[]>([]);

  useEffect(() => {
    setBoards(getMoodboards());
  }, []);

  const handleCreate = () => {
    const board = createMoodboard(`Untitled Board ${boards.length + 1}`, "usr_client_1");
    setBoards(getMoodboards());
    toast.success(`"${board.title}" created`);
  };

  const handleDelete = (id: string) => {
    deleteMoodboard(id);
    setBoards(getMoodboards());
    toast.success("Board deleted");
  };

  return (
    <div className="min-h-full bg-muted/20 pb-20">
      <InspirationPageHeader
        icon={Grid3X3}
        badge="Moodboards"
        title="Moodboards"
        subtitle="Create visual collections to plan your perfect space."
        actions={
          <Button
            onClick={handleCreate}
            variant="brand"
            className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold"
          >
            <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </span>
            New Board
          </Button>
        }
      />
      <InspirationSubNav />

      <div className="px-6 lg:px-10 py-8">
        {boards.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground font-semibold mb-1">No boards yet</p>
            <p className="text-body-sm text-muted-foreground mb-4">
              Create your first moodboard to start curating.
            </p>
            <Button
              onClick={handleCreate}
              variant="ghost"
              className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300"
            >
              <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                <Plus className="w-4 h-4 text-primary" />
              </span>
              Create Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {boards.map((board, i) => (
              <BoardCard
                key={board.id}
                board={board}
                onDelete={() => handleDelete(board.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
