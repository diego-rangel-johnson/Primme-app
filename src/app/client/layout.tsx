"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  CreditCard,
  MessageSquare,
  User,
  Settings,
  Palette,
  Gift,
} from "lucide-react";
import { Sidebar, type MenuItem } from "@/components/sidebar";
import { useSession } from "@/context/session-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/client/dashboard" },
  { icon: FolderOpen, label: "My Projects", href: "/client/projects" },
  { icon: Palette, label: "Inspiration", href: "/client/inspiration" },
  { icon: Plus, label: "Create Project", href: "/client/create-project" },
  { icon: Gift, label: "Benefits", href: "/client/benefits" },
  { icon: CreditCard, label: "Payments", href: "/client/payments" },
  { icon: MessageSquare, label: "Messages", href: "/client/messages" },
  { icon: User, label: "Profile", href: "/client/profile" },
  { icon: Settings, label: "Settings", href: "/client/settings" },
];

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession();

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-muted">
      <Sidebar brandLabel="HOMEOWNER" menuItems={menuItems} />
      <main id="main-content" className="flex-1 overflow-y-auto lg:ml-0 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
