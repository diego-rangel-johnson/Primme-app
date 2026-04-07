"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface CategoryTab {
  id: string;
  label: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

interface CategoryTabsProps {
  tabs: CategoryTab[];
  defaultValue?: string;
  className?: string;
}

export function CategoryTabs({ tabs, defaultValue, className }: CategoryTabsProps) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.id} className={className}>
      <TabsList className="h-auto p-1.5 bg-muted/80 rounded-xl flex-wrap gap-1 w-full justify-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-lg px-4 py-2 text-sm font-semibold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
