"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ConversationData } from "./conversation-item";
import type { ComponentType, ReactNode } from "react";

export interface HeaderAction {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}

interface ChatHeaderProps {
  contact: ConversationData;
  actions?: HeaderAction[];
  roleLabel?: string;
  onBack?: () => void;
  extra?: ReactNode;
}

export function ChatHeader({
  contact,
  actions = [],
  roleLabel = "PROJECT",
  onBack,
  extra,
}: ChatHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-5 lg:px-8 py-4 border-b border-border/40 bg-card/80 backdrop-blur-md flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl lg:hidden shrink-0"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        <div className="relative shrink-0">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-11 h-11 rounded-xl object-cover"
          />
          {contact.online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{contact.name}</p>
          <p
            className={`text-label flex items-center gap-1.5 ${
              contact.online ? "text-success" : "text-muted-foreground/60"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                contact.online ? "bg-success" : "bg-muted-foreground/40"
              }`}
            />
            {contact.online ? "Online" : "Offline"} &middot; {roleLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Tooltip key={action.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-muted-foreground hover:text-foreground"
                  aria-label={action.label}
                  onClick={action.onClick}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-semibold text-xs">{action.label}</TooltipContent>
            </Tooltip>
          );
        })}
        {extra}
      </div>
    </motion.div>
  );
}
