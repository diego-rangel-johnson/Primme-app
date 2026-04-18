"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { ConversationList } from "./conversation-list";
import { ChatHeader, type HeaderAction } from "./chat-header";
import { ChatThread } from "./chat-thread";
import { ChatInput } from "./chat-input";
import { EmptyChatState } from "./empty-chat-state";
import type { ConversationData } from "./conversation-item";
import type { ChatMessageData } from "./chat-bubble";
import type { ReactNode } from "react";

interface MessageLayoutProps {
  conversations: ConversationData[];
  initialMessages: Record<string, ChatMessageData[]>;
  headerActions?: (contact: ConversationData) => HeaderAction[];
  headerRoleLabel?: string;
  headerExtra?: (contact: ConversationData) => ReactNode;
  searchPlaceholder?: string;
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  externalMessages?: ChatMessageData[];
  onSend?: (text: string, conversationId: string) => void;
  onSelectConversation?: (id: string) => void;
  selectedConversationId?: string | null;
}

export function MessageLayout({
  conversations,
  initialMessages,
  headerActions,
  headerRoleLabel,
  headerExtra,
  searchPlaceholder,
  title,
  emptyTitle,
  emptyDescription,
  externalMessages,
  onSend,
  onSelectConversation,
  selectedConversationId,
}: MessageLayoutProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    conversations[0]?.id ?? null
  );
  const selectedId = selectedConversationId !== undefined ? selectedConversationId : internalSelectedId;
  const [userMessages, setUserMessages] = useState<Record<string, ChatMessageData[]>>({});
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const currentContact = conversations.find((c) => c.id === selectedId) ?? null;

  const fallbackMessages: ChatMessageData[] = selectedId
    ? [...(initialMessages[selectedId] ?? []), ...(userMessages[selectedId] ?? [])]
    : [];
  const allMessages = externalMessages && externalMessages.length > 0 ? externalMessages : fallbackMessages;

  const handleSelect = useCallback((id: string) => {
    setInternalSelectedId(id);
    onSelectConversation?.(id);
    setMobileShowChat(true);
  }, [onSelectConversation]);

  const handleBack = useCallback(() => {
    setMobileShowChat(false);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      if (!selectedId) return;
      if (onSend) {
        onSend(text, selectedId);
        return;
      }
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, "0");
      const period = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 || 12;
      const newMsg: ChatMessageData = {
        id: Date.now(),
        text,
        time: `${displayH}:${m} ${period}`,
        sender: "me",
      };
      setUserMessages((prev) => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] ?? []), newMsg],
      }));
    },
    [selectedId, onSend]
  );

  const actions = currentContact && headerActions ? headerActions(currentContact) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex h-full bg-muted/20 overflow-hidden rounded-3xl border border-border/40 shadow-card"
    >
      {/* Sidebar -- always visible on md+, conditionally on mobile */}
      <div
        className={`w-full md:w-[340px] lg:w-[380px] shrink-0 bg-card border-r border-border/30 flex-col ${
          mobileShowChat ? "hidden md:flex" : "flex"
        }`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelect}
          searchPlaceholder={searchPlaceholder}
          title={title}
        />
      </div>

      {/* Chat Area -- always visible on md+, conditionally on mobile */}
      <div
        className={`flex-1 flex-col bg-card/50 min-w-0 ${
          mobileShowChat ? "flex" : "hidden md:flex"
        }`}
      >
        {currentContact ? (
          <>
            <ChatHeader
              contact={currentContact}
              actions={actions}
              roleLabel={headerRoleLabel}
              onBack={handleBack}
              extra={headerExtra?.(currentContact)}
            />
            <ChatThread
              messages={allMessages}
              contactAvatar={currentContact.avatar}
              contactName={currentContact.name}
            />
            <ChatInput onSend={handleSend} />
          </>
        ) : (
          <EmptyChatState title={emptyTitle} description={emptyDescription} />
        )}
      </div>
    </motion.div>
  );
}
