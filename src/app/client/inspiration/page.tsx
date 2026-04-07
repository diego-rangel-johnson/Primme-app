"use client";

import { HeroSection } from "@/components/inspiration/hub/hero-section";
import { InspirationSubNav } from "@/components/inspiration/inspiration-sub-nav";
import { QuickActions } from "@/components/inspiration/hub/quick-actions";
import { RecentBoardsStrip } from "@/components/inspiration/hub/recent-boards-strip";
import { TrendingPreview } from "@/components/inspiration/hub/trending-preview";
import { ColorSpotlight } from "@/components/inspiration/hub/color-spotlight";

export default function InspirationStudioPage() {
  return (
    <div className="min-h-full flex flex-col bg-muted/20">
      <HeroSection />
      <InspirationSubNav />

      <div className="px-8 lg:px-12 py-8 lg:py-10 flex-1 space-y-10">
        <QuickActions />
        <RecentBoardsStrip />
        <ColorSpotlight />
        <TrendingPreview />
      </div>
    </div>
  );
}
