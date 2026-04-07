"use client";

import { MessageSquare } from "lucide-react";
import { motion } from "motion/react";

interface EmptyChatStateProps {
  title?: string;
  description?: string;
}

export function EmptyChatState({
  title = "No conversation selected",
  description = "Choose a conversation from the list to start messaging.",
}: EmptyChatStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
        <MessageSquare className="w-9 h-9 text-primary" strokeWidth={1.5} />
      </div>
      <div className="space-y-2 max-w-xs">
        <h3 className="text-h3 font-display text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-body-sm text-muted-foreground font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
