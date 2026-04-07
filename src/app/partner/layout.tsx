"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Trophy,
  MessageSquare,
  User,
  Settings,
} from "lucide-react";
import { Sidebar, type MenuItem } from "@/components/sidebar";
import { useSession } from "@/context/session-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/partner/dashboard" },
  { icon: Users, label: "Referrals", href: "/partner/referrals" },
  { icon: DollarSign, label: "Earnings", href: "/partner/earnings" },
  { icon: Trophy, label: "Benefits", href: "/partner/benefits" },
  { icon: MessageSquare, label: "Messages", href: "/partner/messages" },
  { icon: User, label: "Profile", href: "/partner/profile" },
  { icon: Settings, label: "Settings", href: "/partner/settings" },
];

export default function PartnerLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-muted">
      <Sidebar brandLabel="PARTNER" menuItems={menuItems} />
      <main id="main-content" className="flex-1 overflow-y-auto lg:ml-0 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
