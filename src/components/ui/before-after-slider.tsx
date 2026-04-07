"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  afterOverlayColor?: string;
  afterOverlayOpacity?: number;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  afterOverlayColor,
  afterOverlayOpacity = 0.3,
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeLayerWidthPercent =
    100 / (Math.max(sliderPosition, 0.01) / 100);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsResizing(true);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isResizing) return;
    handleMove(e.touches[0].clientX);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - step));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + step));
    }
  }, []);

  useEffect(() => {
    const handleGlobalUp = () => setIsResizing(false);
    window.addEventListener("mouseup", handleGlobalUp);
    window.addEventListener("touchend", handleGlobalUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalUp);
      window.removeEventListener("touchend", handleGlobalUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none border border-border/30 shadow-elevated ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {afterOverlayColor && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: afterOverlayColor,
            mixBlendMode: "multiply",
            opacity: afterOverlayOpacity,
          }}
        />
      )}

      {/* Before Image (Foreground/Clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div
          className="absolute top-0 left-0 h-full"
          style={{ width: `${beforeLayerWidthPercent}%` }}
        >
          <img
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-label rounded-lg">
            {beforeLabel}
          </span>
        </div>
      </div>

      {/* After Label */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-3 py-1 bg-primary/80 backdrop-blur-md text-white text-label rounded-lg">
          {afterLabel}
        </span>
      </div>

      {/* Slider Line & Handle */}
      <div
        className="absolute inset-y-0 z-30 flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute h-full w-0.5 bg-white/50" />
        <div
          role="slider"
          aria-label="Compare before and after images"
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative w-10 h-10 bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)] flex items-center justify-center pointer-events-auto active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MoveHorizontal className="w-4 h-4 text-foreground" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
