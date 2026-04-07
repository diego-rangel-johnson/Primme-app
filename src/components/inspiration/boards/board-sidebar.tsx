"use client";

import { useState, useRef } from "react";
import { ImagePlus, Palette, Type, StickyNote, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PAINT_COLORS } from "@/lib/inspiration/seed-data";
import { ColorSwatch } from "../shared/color-swatch";
import type { MoodboardItem, MoodboardItemContent } from "@/lib/inspiration/types";

type AddType = "image" | "color" | "text" | "note";

interface BoardSidebarProps {
  onAddItem: (item: Omit<MoodboardItem, "id" | "moodboardId" | "createdAt">) => void;
}

export function BoardSidebar({ onAddItem }: BoardSidebarProps) {
  const [activeType, setActiveType] = useState<AddType>("image");
  const [textValue, setTextValue] = useState("");
  const [noteValue, setNoteValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addItem = (type: MoodboardItem["type"], content: MoodboardItemContent, width = 200, height = 200) => {
    onAddItem({
      type,
      content,
      positionX: 40 + Math.random() * 200,
      positionY: 40 + Math.random() * 200,
      width,
      height,
      zIndex: Date.now() % 1000,
    });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      addItem("image", { src, alt: file.name }, 240, 180);
    };
    reader.readAsDataURL(file);
  };

  const tabs: { id: AddType; icon: React.ElementType; label: string }[] = [
    { id: "image", icon: ImagePlus, label: "Image" },
    { id: "color", icon: Palette, label: "Color" },
    { id: "text", icon: Type, label: "Text" },
    { id: "note", icon: StickyNote, label: "Note" },
  ];

  return (
    <div className="w-full lg:w-72 shrink-0 bg-card border border-border/40 rounded-2xl p-4 space-y-4 h-fit lg:sticky lg:top-20">
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveType(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-meta font-semibold transition-colors",
                activeType === tab.id
                  ? "bg-foreground/5 text-foreground border border-border/50"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeType === "image" && (
        <div className="space-y-3">
          <div
            className="rounded-xl border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/3 p-4 text-center cursor-pointer transition-all"
            onClick={() => fileRef.current?.click()}
          >
            <UploadCloud className="w-6 h-6 text-muted-foreground/40 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground font-semibold">Upload image</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Or paste image URL..."
              className="text-xs h-8 rounded-lg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button
              size="sm"
              className="h-8 rounded-lg text-xs px-3"
              disabled={!imageUrl.trim()}
              onClick={() => {
                addItem("image", { src: imageUrl.trim(), alt: "Image" }, 240, 180);
                setImageUrl("");
              }}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      {activeType === "color" && (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          <p className="text-label text-muted-foreground">Pick a Color</p>
          <div className="grid grid-cols-5 gap-1.5">
            {PAINT_COLORS.slice(0, 25).map((color) => (
              <ColorSwatch
                key={color.id}
                hex={color.hex}
                name={color.name}
                brand={color.brandDisplayName}
                size="sm"
                onClick={() => addItem("color", { hex: color.hex, name: color.name, brand: color.brandDisplayName }, 120, 120)}
              />
            ))}
          </div>
        </div>
      )}

      {activeType === "text" && (
        <div className="space-y-2">
          <Input
            placeholder="Type your text..."
            className="text-xs h-8 rounded-lg"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && textValue.trim()) {
                addItem("text", { text: textValue.trim() }, 200, 80);
                setTextValue("");
              }
            }}
          />
          <Button
            size="sm"
            className="w-full h-8 rounded-lg text-xs"
            disabled={!textValue.trim()}
            onClick={() => {
              addItem("text", { text: textValue.trim() }, 200, 80);
              setTextValue("");
            }}
          >
            Add Text
          </Button>
        </div>
      )}

      {activeType === "note" && (
        <div className="space-y-2">
          <textarea
            placeholder="Write a note..."
            className="w-full h-24 bg-muted/40 text-xs rounded-xl p-3 border border-border/40 resize-none focus:outline-none focus:ring-2 focus:ring-ring/20"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
          />
          <Button
            size="sm"
            className="w-full h-8 rounded-lg text-xs"
            disabled={!noteValue.trim()}
            onClick={() => {
              addItem("note", { note: noteValue.trim() }, 180, 120);
              setNoteValue("");
            }}
          >
            Add Note
          </Button>
        </div>
      )}
    </div>
  );
}
