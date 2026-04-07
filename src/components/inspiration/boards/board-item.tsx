"use client";

import { useDraggable } from "@dnd-kit/core";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getContrastColor } from "@/lib/inspiration/color-utils";
import type { MoodboardItem } from "@/lib/inspiration/types";

interface BoardItemProps {
  item: MoodboardItem;
  onRemove: () => void;
  isDragging?: boolean;
}

export function BoardItem({ item, onRemove, isDragging }: BoardItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style: React.CSSProperties = {
    position: "absolute",
    left: item.positionX,
    top: item.positionY,
    width: item.width,
    height: item.height,
    zIndex: isDragging ? 999 : item.zIndex,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    transition: isDragging ? "none" : "opacity 0.2s",
  };

  return (
    <div ref={setNodeRef} style={style} className="group" {...listeners} {...attributes}>
      <div className="relative w-full h-full rounded-xl overflow-hidden border border-border/30 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
        <ItemContent item={item} />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          aria-label="Remove item"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function ItemContent({ item }: { item: MoodboardItem }) {
  if (item.type === "image" && "src" in item.content) {
    return (
      <img
        src={(item.content as { src: string }).src}
        alt={(item.content as { src: string; alt?: string }).alt ?? ""}
        className="w-full h-full object-cover"
        draggable={false}
      />
    );
  }

  if (item.type === "color" && "hex" in item.content) {
    const c = item.content as { hex: string; name?: string; brand?: string };
    const contrast = getContrastColor(c.hex);
    return (
      <div className="w-full h-full flex flex-col justify-end p-3" style={{ backgroundColor: c.hex }}>
        {c.name && (
          <p className={cn("text-xs font-semibold", contrast === "white" ? "text-white" : "text-black/80")}>
            {c.name}
          </p>
        )}
        {c.brand && (
          <p className={cn("text-label", contrast === "white" ? "text-white/50" : "text-black/40")}>
            {c.brand}
          </p>
        )}
      </div>
    );
  }

  if (item.type === "text" && "text" in item.content) {
    return (
      <div className="w-full h-full bg-card p-3 flex items-center">
        <p className="text-sm text-foreground leading-snug">{(item.content as { text: string }).text}</p>
      </div>
    );
  }

  if (item.type === "note" && "note" in item.content) {
    return (
      <div className="w-full h-full bg-muted/60 p-3 flex items-start border-l-2 border-primary/30">
        <p className="text-xs text-muted-foreground leading-snug">
          {(item.content as { note: string }).note}
        </p>
      </div>
    );
  }

  return <div className="w-full h-full bg-muted" />;
}
