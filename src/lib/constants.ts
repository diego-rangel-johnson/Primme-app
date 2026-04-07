import { Home, Building2, Users, type LucideIcon } from "lucide-react";
import type { UserRole } from "@/context/session-context";

export type AccountType = "homeowner" | "provider" | "partner";

export const ROLE_MAP: Record<AccountType, UserRole> = {
  homeowner: "client",
  provider: "provider",
  partner: "partner",
};

export const ACCOUNT_TYPES: {
  id: AccountType;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    id: "homeowner",
    icon: Home,
    title: "Homeowner",
    description: "Access your projects and manage providers",
  },
  {
    id: "provider",
    icon: Building2,
    title: "Provider",
    description: "Find projects and grow your business",
  },
  {
    id: "partner",
    icon: Users,
    title: "Partner",
    description: "Partner with us and earn commissions",
  },
];

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 11) return "Good morning";
  if (hour >= 12 && hour <= 17) return "Good afternoon";
  return "Good evening";
}
