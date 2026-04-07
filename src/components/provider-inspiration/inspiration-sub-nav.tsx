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

export function InspirationSubNav() {
  const pathname = usePathname();

  const isActive = (tab: (typeof TABS)[number]) => {
    if (tab.exact) return pathname === tab.href;
    return pathname.startsWith(tab.href);
  };

  return (
    <div className="border-b border-border/40 bg-background/50 px-6 lg:px-10">
      <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none -mb-px">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex items-center gap-2 px-4 py-3 text-body-sm font-semibold transition-colors duration-fast whitespace-nowrap",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", active && "text-primary")} />
              {tab.label}
              {active && (
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
