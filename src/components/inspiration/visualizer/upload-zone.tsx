"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";
import { motion } from "motion/react";

const DEMO_ROOMS = [
  { id: "demo-1", label: "Living Room", src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" },
  { id: "demo-2", label: "Bedroom", src: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80" },
  { id: "demo-3", label: "Kitchen", src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80" },
];

interface UploadZoneProps {
  onImageSelect: (src: string) => void;
}

export function UploadZone({ onImageSelect }: UploadZoneProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onImageSelect(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl border-2 border-dashed border-border/40 hover:border-primary/30 hover:bg-primary/3 p-10 text-center cursor-pointer transition-all"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file?.type.startsWith("image/")) handleFile(file);
        }}
      >
        <UploadCloud className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm font-semibold text-foreground mb-1">Upload your room photo</p>
        <p className="text-meta">PNG, JPG up to 10MB — or drag & drop</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      <div>
        <p className="text-label text-muted-foreground mb-3">Or try a demo room</p>
        <div className="grid grid-cols-3 gap-3">
          {DEMO_ROOMS.map((room, i) => (
            <motion.button
              key={room.id}
              type="button"
              onClick={() => onImageSelect(room.src)}
              className="group rounded-xl overflow-hidden border border-border/30 hover:border-primary/20 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={room.src}
                  alt={room.label}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <p className="text-xs font-semibold text-foreground py-2 text-center group-hover:text-primary transition-colors">
                {room.label}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
