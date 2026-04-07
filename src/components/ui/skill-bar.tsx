"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SkillBarProps {
  label: string;
  value: number;
  level?: string;
  className?: string;
  barClassName?: string;
}

export function SkillBar({
  label,
  value,
  level,
  className,
  barClassName,
}: SkillBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(Math.min(Math.max(value, 0), 100));
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          {level && (
            <span className="text-label text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              {level}
            </span>
          )}
          <span className="text-xs font-black text-muted-foreground tabular-nums">{value}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000 ease-out",
            barClassName
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
