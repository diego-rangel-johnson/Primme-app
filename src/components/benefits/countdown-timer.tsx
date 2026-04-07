"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  compact?: boolean;
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate, className, compact }: CountdownTimerProps) {
  const [time, setTime] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (compact) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-bold text-warning", className)}>
        <Clock className="w-3 h-3" />
        {time.days > 0 ? `${time.days}d ` : ""}
        {String(time.hours).padStart(2, "0")}:{String(time.minutes).padStart(2, "0")}:{String(time.seconds).padStart(2, "0")}
      </span>
    );
  }

  const segments = [
    { label: "Days", value: time.days },
    { label: "Hrs", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {segments.map((seg) => (
        <div key={seg.label} className="flex flex-col items-center">
          <span className="text-lg font-black text-foreground tabular-nums leading-none">
            {String(seg.value).padStart(2, "0")}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
            {seg.label}
          </span>
        </div>
      ))}
    </div>
  );
}
