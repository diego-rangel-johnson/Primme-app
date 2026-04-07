"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  TrendingUp,
  MessageSquare,
  User,
  Settings,
  Star,
  Sparkles,
  Award,
} from "lucide-react";
import { Sidebar, type MenuItem } from "@/components/sidebar";
import { useSession } from "@/context/session-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/provider/dashboard" },
  { icon: Briefcase, label: "Opportunities", href: "/provider/opportunities" },
  { icon: FolderKanban, label: "My Projects", href: "/provider/projects" },
  { icon: Sparkles, label: "Inspiration", href: "/provider/inspiration" },
  { icon: Award, label: "Pro Rewards", href: "/provider/benefits" },
  { icon: TrendingUp, label: "Earnings", href: "/provider/earnings" },
  { icon: MessageSquare, label: "Messages", href: "/provider/messages" },
  { icon: User, label: "Profile", href: "/provider/profile" },
  { icon: Settings, label: "Settings", href: "/provider/settings" },
];

const tierBadge = (
  <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-3">
    <div className="flex items-center gap-2 mb-1">
      <Star className="w-4 h-4 text-warning fill-warning" />
      <span className="text-xs font-bold text-foreground uppercase">Gold</span>
    </div>
    <span className="text-xs text-warning font-semibold">Tier 2</span>
  </div>
);

export default function ProviderLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-muted">
      <Sidebar brandLabel="PROVIDER" menuItems={menuItems} tierBadge={tierBadge} />
      <main id="main-content" className="flex-1 overflow-y-auto lg:ml-0 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
