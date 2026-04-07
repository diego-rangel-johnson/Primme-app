"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PAINT_COLORS } from "@/lib/inspiration/seed-data";
import { getContrastColor } from "@/lib/inspiration/color-utils";
import { motion } from "motion/react";

const SPOTLIGHT = PAINT_COLORS.find((c) => c.name === "Evergreen Fog") ?? PAINT_COLORS[14];

export function ColorSpotlight() {
  const contrast = getContrastColor(SPOTLIGHT.hex);
  const isLight = contrast === "black";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      <div
        className="relative rounded-2xl overflow-hidden border border-border/20"
        style={{ backgroundColor: SPOTLIGHT.hex }}
      >
        <div className="p-6 lg:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p
              className={`text-label mb-4 ${
                isLight ? "text-black/40" : "text-white/40"
              }`}
            >
              Color of the Week
            </p>

            <div
              className={`w-10 h-10 rounded-lg border mb-4 ${
                isLight ? "border-black/10" : "border-white/15"
              }`}
              style={{ backgroundColor: SPOTLIGHT.hex, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}
            />

            <h3
              className={`text-h2 font-display tracking-tight mb-1 ${
                isLight ? "text-black/90" : "text-white"
              }`}
            >
              {SPOTLIGHT.name}
            </h3>
            <p
              className={`text-body-sm mb-1 ${
                isLight ? "text-black/50" : "text-white/60"
              }`}
            >
              {SPOTLIGHT.brandDisplayName}
            </p>
            <p
              className={`text-meta font-mono ${
                isLight ? "text-black/30" : "text-white/35"
              }`}
            >
              {SPOTLIGHT.hex.toUpperCase()} · LRV {SPOTLIGHT.lrv}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Link href={`/client/inspiration/visualizer?color=${SPOTLIGHT.id}`}>
              <Button
                size="sm"
                variant="ghost"
                className={`rounded-lg text-xs font-semibold ${
                  isLight
                    ? "text-black/70 hover:bg-black/8"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                Try in Room
              </Button>
            </Link>
            <Link href="/client/inspiration/palettes">
              <Button
                size="sm"
                className={`rounded-lg text-xs font-semibold ${
                  isLight
                    ? "bg-black/90 text-white hover:bg-black"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                Build Palette
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
