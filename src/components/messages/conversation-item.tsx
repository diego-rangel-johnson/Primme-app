"use client";

import { motion } from "motion/react";

export interface ConversationData {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface ConversationItemProps {
  conversation: ConversationData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

export function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  index,
}: ConversationItemProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => onSelect(conversation.id)}
      className={`w-full text-left p-4 flex items-start gap-3.5 border-l-[3px] transition-all duration-200 group ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-transparent hover:bg-muted/50"
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={conversation.avatar}
          alt={conversation.name}
          className={`w-12 h-12 rounded-xl object-cover transition-transform duration-200 ${
            !isSelected ? "group-hover:scale-105" : ""
          }`}
        />
        {conversation.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-card" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className={`text-sm truncate ${isSelected ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>
            {conversation.name}
          </p>
          <span className="text-meta text-muted-foreground/60 shrink-0 ml-2">
            {conversation.time}
          </span>
        </div>
        <p className="text-label text-muted-foreground/50 mb-1">
          {conversation.status}
        </p>
        <p className="text-body-sm text-muted-foreground truncate leading-snug">
          {conversation.lastMessage}
        </p>
      </div>

      {conversation.unread > 0 && (
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[10px] font-bold text-white leading-none">{conversation.unread}</span>
        </div>
      )}
    </motion.button>
  );
}
