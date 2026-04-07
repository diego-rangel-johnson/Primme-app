"use client";

import { Plus, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSend, placeholder = "Type a message..." }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="p-4 lg:p-5 border-t border-border/40 bg-card/80 backdrop-blur-md">
      <div className="flex items-end gap-2.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground hover:text-primary shrink-0 mb-0.5"
              aria-label="Attach file"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="font-semibold text-xs">Attach</TooltipContent>
        </Tooltip>

        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={placeholder}
            rows={1}
            className="w-full resize-none rounded-2xl bg-muted/50 border border-border/30 px-4 py-3 pr-20 text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all max-h-32 overflow-y-auto"
            style={{ minHeight: "44px" }}
          />
          <div className="absolute right-2 bottom-1.5 flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl w-8 h-8 text-muted-foreground/40 hover:text-muted-foreground"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-semibold text-xs">Attach file</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl w-8 h-8 text-muted-foreground/40 hover:text-muted-foreground"
                  aria-label="Emoji"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-semibold text-xs">Emoji</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileTap={{ scale: 0.9 }} className="shrink-0 mb-0.5">
              <Button
                onClick={handleSend}
                size="icon"
                className="rounded-xl h-10 w-10 shadow-lg shadow-primary/20"
                aria-label="Send message"
                disabled={!value.trim()}
              >
                <Send className="w-[18px] h-[18px]" />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="font-semibold text-xs">Send</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
