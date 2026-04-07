"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./countdown-timer";

export interface DealItem {
  id: string;
  partner: string;
  partnerIcon: LucideIcon;
  title: string;
  discount: string;
  description: string;
  expiresAt: Date;
  category: string;
  claimed?: boolean;
}

interface DealCarouselProps {
  deals: DealItem[];
  onClaim: (id: string) => void;
}

export function DealCarousel({ deals, onClaim }: DealCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/carousel">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-card border border-border/50 shadow-elevated flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-muted"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-card border border-border/50 shadow-elevated flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-muted"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-none pb-2 -mx-1 px-1"
      >
        {deals.map((deal, idx) => {
          const PartnerIcon = deal.partnerIcon;
          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="min-w-[310px] max-w-[310px] rounded-2xl bg-card border border-border/40 shadow-card overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary-light" />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border/50">
                      <PartnerIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      {deal.partner}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-warning/10 text-warning text-xs font-black border border-warning/20">
                    {deal.discount}
                  </span>
                </div>
                <h4 className="font-bold text-foreground mb-1 leading-tight">
                  {deal.title}
                </h4>
                <p className="text-xs text-muted-foreground font-medium mb-4 flex-1">
                  {deal.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <CountdownTimer targetDate={deal.expiresAt} compact />
                  <Button
                    size="sm"
                    className="h-8 rounded-lg text-xs font-bold"
                    onClick={() => onClaim(deal.id)}
                    disabled={deal.claimed}
                  >
                    {deal.claimed ? (
                      <>Claimed</>
                    ) : (
                      <>
                        <Tag className="w-3 h-3 mr-1" /> Claim
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
