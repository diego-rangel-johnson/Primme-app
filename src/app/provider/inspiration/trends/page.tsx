"use client";

import { TrendingUp } from "lucide-react";
import { TrendDashboard } from "@/components/provider-inspiration/trends/trend-dashboard";
import { InspirationPageHeader } from "@/components/provider-inspiration/page-header";
import { InspirationSubNav } from "@/components/provider-inspiration/inspiration-sub-nav";
import { getTrendData } from "@/lib/inspiration/provider-store";

export default function TrendsPage() {
  const data = getTrendData();

  return (
    <div className="min-h-full bg-muted/20 pb-20">
      <InspirationPageHeader
        icon={TrendingUp}
        badge="Trend Intelligence"
        title="Trend Intelligence"
        subtitle="Stay ahead with market data, trending styles, and competitive pricing insights."
      />
      <InspirationSubNav />

      <div className="px-6 lg:px-10 py-8">
        <TrendDashboard data={data} />
      </div>
    </div>
  );
}
