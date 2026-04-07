"use client";

import { motion } from "motion/react";
import { MessageSquare, DollarSign, CheckCircle, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  icon: "message" | "payment" | "milestone" | "lead" | "review";
  text: string;
  time: string;
  highlight?: boolean;
}

const iconMap = {
  message: { Icon: MessageSquare, color: "bg-info/10 text-info border-info/20" },
  payment: { Icon: DollarSign, color: "bg-success/10 text-success border-success/20" },
  milestone: { Icon: CheckCircle, color: "bg-primary/10 text-primary border-primary/20" },
  lead: { Icon: Zap, color: "bg-warning/10 text-warning border-warning/20" },
  review: { Icon: Star, color: "bg-purple-100 text-purple-600 border-purple-200" },
};

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {items.map((item, i) => {
        const { Icon, color } = iconMap[item.icon] ?? iconMap.milestone;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className={cn(
              "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-colors hover:bg-muted/40",
              item.highlight && "bg-primary/5"
            )}
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", color)}>
              <Icon className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <p className="flex-1 text-sm font-medium text-foreground leading-snug min-w-0">
              {item.text}
            </p>
            <span className="text-label text-muted-foreground whitespace-nowrap shrink-0">
              {item.time}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
