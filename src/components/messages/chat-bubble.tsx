"use client";

import { motion } from "motion/react";
import { Check, CheckCheck } from "lucide-react";
import type { ReactNode } from "react";

export interface ChatMessageData {
  id: number;
  text: string;
  time: string;
  sender: "me" | "them";
  read?: boolean;
  richCard?: ReactNode;
}

interface ChatBubbleProps {
  message: ChatMessageData;
  contactAvatar?: string;
  contactName?: string;
}

export function ChatBubble({ message, contactAvatar, contactName }: ChatBubbleProps) {
  const isMe = message.sender === "me";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
    >
      {!isMe && contactAvatar && (
        <img
          src={contactAvatar}
          alt={contactName ?? ""}
          className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 ring-2 ring-background"
        />
      )}

      <div className="max-w-md space-y-1.5">
        {message.richCard ? (
          message.richCard
        ) : (
          <div
            className={`px-4 py-3 text-sm leading-relaxed ${
              isMe
                ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-sm"
                : "bg-muted text-foreground rounded-2xl rounded-bl-md"
            }`}
          >
            {message.text}
          </div>
        )}

        <div
          className={`flex items-center gap-1.5 px-1 ${
            isMe ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-meta font-medium ${
              isMe ? "text-muted-foreground/60" : "text-muted-foreground/50"
            }`}
          >
            {message.time}
          </span>
          {isMe && (
            message.read
              ? <CheckCheck className="w-3.5 h-3.5 text-primary" />
              : <Check className="w-3.5 h-3.5 text-muted-foreground/40" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
