"use client";

import { ProviderHeroSection } from "@/components/provider-inspiration/hub/hero-section";
import { InspirationSubNav } from "@/components/provider-inspiration/inspiration-sub-nav";
import { QuickActions } from "@/components/provider-inspiration/hub/quick-actions";
import { RecentPortfolio } from "@/components/provider-inspiration/hub/recent-portfolio";
import { PerformanceSpotlight } from "@/components/provider-inspiration/hub/performance-spotlight";

export default function ProviderInspirationPage() {
  return (
    <div className="min-h-full flex flex-col bg-muted/20">
      <ProviderHeroSection />
      <InspirationSubNav />

      <div className="px-8 lg:px-12 py-8 lg:py-10 flex-1 space-y-10">
        <QuickActions />
        <RecentPortfolio />
        <PerformanceSpotlight />
      </div>
    </div>
  );
}
