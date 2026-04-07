"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Images,
  ScanSearch,
  FileText,
  Package,
  TrendingUp,
} from "lucide-react";

const TABS = [
  { href: "/provider/inspiration", label: "Studio", icon: Sparkles, exact: true },
  { href: "/provider/inspiration/portfolio", label: "Portfolio", icon: Images },
  { href: "/provider/inspiration/assessment", label: "Assessment", icon: ScanSearch },
  { href: "/provider/inspiration/proposals", label: "Proposals", icon: FileText },
  { href: "/provider/inspiration/materials", label: "Materials", icon: Package },
  { href: "/provider/inspiration/trends", label: "Trends", icon: TrendingUp },
];

export function ProviderInspirationTabs() {
  const pathname = usePathname();

  const isActive = (tab: (typeof TABS)[number]) => {
    if (tab.exact) return pathname === tab.href;
    return pathname.startsWith(tab.href);
  };

  return (
    <nav className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border/40 w-fit overflow-x-auto scrollbar-none">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
