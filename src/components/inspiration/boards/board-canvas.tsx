"use client";

import { useState, useCallback, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { BoardItem } from "./board-item";
import type { MoodboardItem } from "@/lib/inspiration/types";
import { getContrastColor } from "@/lib/inspiration/color-utils";

interface BoardCanvasProps {
  items: MoodboardItem[];
  onItemMove: (itemId: string, x: number, y: number) => void;
  onItemRemove: (itemId: string) => void;
  className?: string;
}

export function BoardCanvas({ items, onItemMove, onItemRemove, className }: BoardCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const item = items.find((i) => i.id === active.id);
    if (item) {
      onItemMove(item.id, item.positionX + delta.x, item.positionY + delta.y);
    }
    setActiveId(null);
  };

  const activeItem = items.find((i) => i.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={canvasRef}
        className={cn(
          "relative w-full min-h-[600px] bg-muted/30 rounded-2xl border-2 border-dashed border-border/40 overflow-hidden",
          className
        )}
        style={{ backgroundImage: "radial-gradient(circle, hsl(var(--border) / 0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      >
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground font-medium">Your moodboard is empty</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Add images, colors, or notes from the sidebar
              </p>
            </div>
          </div>
        )}

        {items.map((item) => (
          <BoardItem
            key={item.id}
            item={item}
            onRemove={() => onItemRemove(item.id)}
            isDragging={item.id === activeId}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeItem && (
          <div
            className="rounded-xl shadow-2xl border border-primary/30 opacity-80 pointer-events-none"
            style={{ width: activeItem.width, height: activeItem.height }}
          >
            <ItemPreview item={activeItem} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function ItemPreview({ item }: { item: MoodboardItem }) {
  if (item.type === "image" && "src" in item.content) {
    return <img src={(item.content as { src: string }).src} alt="" className="w-full h-full object-cover rounded-xl" />;
  }
  if (item.type === "color" && "hex" in item.content) {
    const c = item.content as { hex: string; name?: string };
    return (
      <div className="w-full h-full rounded-xl flex items-end p-2" style={{ backgroundColor: c.hex }}>
        {c.name && (
          <span className={cn("text-label", getContrastColor(c.hex) === "white" ? "text-white" : "text-black")}>
            {c.name}
          </span>
        )}
      </div>
    );
  }
  if ((item.type === "text" || item.type === "note") && ("text" in item.content || "note" in item.content)) {
    const text = "text" in item.content ? (item.content as { text: string }).text : (item.content as { note: string }).note;
    return (
      <div className="w-full h-full rounded-xl bg-card border border-border/40 p-3 flex items-center">
        <p className="text-xs text-foreground line-clamp-4">{text}</p>
      </div>
    );
  }
  return <div className="w-full h-full rounded-xl bg-muted" />;
}
