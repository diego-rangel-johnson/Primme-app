"use client";

import { Sparkles, Compass, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export function HeroSection() {
  return (
    <header className="relative bg-background border-b border-border/30 px-8 lg:px-12 pt-10 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/2 to-transparent opacity-60 pointer-events-none" />
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />

      <motion.div {...fadeUp} className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-label text-muted-foreground mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Inspiration Studio
            </p>
            <h1 className="text-h1 font-display text-foreground tracking-tight">
              Find the colors that <span className="text-primary">define your space</span>
            </h1>
            <p className="text-muted-foreground font-medium mt-1.5">
              Curate moodboards, test paints in your room, and explore premium finishes from top brands.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2 sm:gap-3">
            <Button variant="ghost" asChild className="h-12 px-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 shadow-sm font-semibold text-muted-foreground hover:border-primary/30 hover:bg-primary/[0.05] hover:text-foreground hover:shadow-md transition-all duration-300">
              <Link href="/client/inspiration/explore">
                <span className="inline-flex items-center justify-center rounded-lg bg-muted/60 p-1.5 mr-1">
                  <Compass className="w-4 h-4 text-primary" />
                </span>
                Explore Ideas
              </Link>
            </Button>
            <Button variant="brand" asChild className="h-12 px-6 rounded-2xl ring-1 ring-inset ring-white/15 shadow-lg shadow-primary/20 font-semibold">
              <Link href="/client/inspiration/visualizer">
                <span className="inline-flex items-center justify-center rounded-lg bg-white/15 p-1.5 mr-1">
                  <Eye className="w-4 h-4" strokeWidth={2.5} />
                </span>
                Visualize Room
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
