"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChatBubble, type ChatMessageData } from "./chat-bubble";
import { TypingIndicator } from "./typing-indicator";

interface ChatThreadProps {
  messages: ChatMessageData[];
  contactAvatar?: string;
  contactName?: string;
  isTyping?: boolean;
}

export function ChatThread({
  messages,
  contactAvatar,
  contactName,
  isTyping = false,
}: ChatThreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length, isTyping, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(gap > 120);
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-5 lg:px-8 py-6 space-y-3"
      >
        <div className="flex justify-center mb-4">
          <span className="px-4 py-1 bg-muted/80 backdrop-blur-sm text-muted-foreground text-label rounded-full">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            contactAvatar={contactAvatar}
            contactName={contactName}
          />
        ))}

        {isTyping && (
          <div className="flex gap-2.5">
            {contactAvatar && (
              <img
                src={contactAvatar}
                alt={contactName ?? ""}
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 ring-2 ring-background"
              />
            )}
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <AnimatePresence>
        {showScrollBtn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full shadow-elevated bg-card/90 backdrop-blur-md gap-1.5 text-xs font-bold"
              onClick={() => scrollToBottom(true)}
            >
              <ArrowDown className="w-3.5 h-3.5" />
              New messages
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
