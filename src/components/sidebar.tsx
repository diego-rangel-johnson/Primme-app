"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useState, useCallback, type ComponentType, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "@/context/session-context";

export interface MenuItem {
  icon: ComponentType<{ className?: string; strokeWidth?: number | string }>;
  label: string;
  href: string;
}

interface SidebarProps {
  brandLabel: string;
  menuItems: MenuItem[];
  tierBadge?: ReactNode;
}

const ROLE_LABELS: Record<string, string> = {
  client: "Homeowner",
  provider: "Provider",
  partner: "Partner",
};

function SidebarContent({ brandLabel, menuItems, tierBadge, onNavClick }: SidebarProps & { onNavClick?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useSession();

  const handleLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNavClick?.();
    logout();
  }, [onNavClick, logout]);

  if (!user) return null;

  const profileHref = `/${user.role}/profile`;

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-sidebar via-sidebar to-muted/20 relative overflow-hidden">
      {/* Ambient corner glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/[0.06] blur-3xl pointer-events-none" />

      {/* Logo + app name: same inset as nav (px-6). Negative margin pulls wordmark left — SVG still has optical left padding inside the bitmap. */}
      <div className="px-6 pt-6 pb-4 border-b border-sidebar-border/50 relative">
        <div className="flex items-center gap-0">
          <img src="/logos_primme.png" alt="Primme" className="block h-16 w-auto object-contain shrink-0 translate-y-2.5" />
          <div className="flex flex-col ml-0.5">
            <span className="text-2xl font-bold text-foreground tracking-tight mt-5">
              Primme<span className="text-[#E8503A]">.</span>
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] leading-none text-muted-foreground">
              {brandLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Nav — horizontal padding matches header so icons align with logo */}
      <nav className="flex-1 px-6 py-6 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              aria-current={isActive ? "page" : undefined}
              className={`group flex w-full items-center gap-3.5 py-3 px-3 rounded-2xl transition-all duration-300 ease-out relative
                ${isActive
                  ? "bg-gradient-to-r from-primary to-[hsl(16,90%,48%)] text-white shadow-[0_4px_20px_hsl(24_95%_53%_/_0.3)] ring-1 ring-inset ring-white/10"
                  : "text-sidebar-foreground/65 hover:bg-primary/[0.06] hover:text-foreground lg:hover:-translate-y-[1px]"
                }`}
            >
              {/* Active indicator glow — no scale so parent overflow does not clip the halo */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg -z-10" />
              )}
              <div className={`flex items-center justify-center transition-all duration-300 ${!isActive && "group-hover:scale-110"}`}>
                <Icon
                  className={`w-[18px] h-[18px] ${isActive ? "text-white drop-shadow-sm" : "text-sidebar-foreground/50 group-hover:text-primary"}`}
                  strokeWidth={2}
                />
              </div>
              <span className={`text-[13px] ${isActive ? "font-bold tracking-wide" : "font-semibold"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Tier badge with glassmorphism */}
      {tierBadge && (
        <div className="px-6 mb-4">
          <div className="backdrop-blur-xl bg-primary/[0.06] border border-primary/10 rounded-2xl p-3 shadow-[0_2px_12px_hsl(24_95%_53%_/_0.06)]">
            {tierBadge}
          </div>
        </div>
      )}

      {/* Separator */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-sidebar-border/50 to-transparent" />

      {/* User profile */}
      <div className="p-6 pt-5">
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-primary/10 hover:bg-primary/[0.03] hover:shadow-[0_2px_16px_hsl(24_95%_53%_/_0.06)] transition-all duration-300 group">
          <Link href={profileHref} onClick={onNavClick} className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(16,90%,48%)] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/25 shrink-0 ring-2 ring-background group-hover:ring-primary/20 group-hover:scale-105 transition-all duration-300">
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-200">{user.name}</p>
              <p className="text-label text-muted-foreground/80 mt-0.5">{ROLE_LABELS[user.role] ?? user.role}</p>
            </div>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 hover:shadow-sm transition-all duration-300 shrink-0"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-semibold text-xs rounded-lg">Sign out</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:flex w-[280px] shrink-0 border-r border-sidebar-border/30 flex-col bg-background relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.03)]">
        <SidebarContent {...props} />
      </aside>

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-xl shadow-md hover:shadow-lg transition-all bg-background/80 backdrop-blur-md border-border/50" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 [&>button:first-child]:hidden border-r-0 shadow-2xl">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <SidebarContent {...props} onNavClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
