"use client";

import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { ConversationItem, type ConversationData } from "./conversation-item";

type FilterTab = "all" | "unread" | "archived";

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "archived", label: "Archived" },
];

interface ConversationListProps {
  conversations: ConversationData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchPlaceholder?: string;
  title?: string;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  searchPlaceholder = "Search conversations...",
  title = "Messages",
}: ConversationListProps) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = conversations;
    if (filter === "unread") list = list.filter((c) => c.unread > 0);
    if (filter === "archived") list = list.filter((c) => c.status === "COMPLETED" || c.status === "ARCHIVED");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, filter, search]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 pb-3 space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-h2 font-display text-foreground tracking-tight"
        >
          {title}
        </motion.h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 h-10 rounded-xl bg-muted/50 border-border/30 text-sm focus-visible:ring-primary/30"
          />
        </div>

        <div className="flex gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
                filter === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border-t border-border/30">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/80 flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              No conversations found
            </p>
          </div>
        ) : (
          filtered.map((c, idx) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              isSelected={selectedId === c.id}
              onSelect={onSelect}
              index={idx}
            />
          ))
        )}
      </div>
    </div>
  );
}
