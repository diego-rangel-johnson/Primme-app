"use client";

import { useState, useEffect, useCallback } from "react";
import { FolderOpen, Info } from "lucide-react";
import { MessageLayout } from "@/components/messages/message-layout";
import type { ConversationData } from "@/components/messages/conversation-item";
import type { ChatMessageData } from "@/components/messages/chat-bubble";
import type { HeaderAction } from "@/components/messages/chat-header";
import { useSession } from "@/context/session-context";
import { useConversations, useMessages } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";

const conversations: ConversationData[] = [
  {
    id: "mike",
    name: "Mike Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=11",
    status: "ACTIVE PROJECT",
    lastMessage: "I've uploaded the new project timeline...",
    time: "10:45 AM",
    unread: 3,
    online: true,
  },
  {
    id: "sarah",
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "ACTIVE PROJECT",
    lastMessage: "The color palette samples arrived. Wo...",
    time: "Yesterday",
    unread: 1,
    online: false,
  },
  {
    id: "david",
    name: "David Martinez",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "ACTIVE PROJECT",
    lastMessage: "Weekly progress report attached. Everythin...",
    time: "Monday",
    unread: 0,
    online: true,
  },
  {
    id: "elena",
    name: "Elena Vasquez",
    avatar: "https://i.pravatar.cc/150?img=16",
    status: "COMPLETED",
    lastMessage: "Final invoice has been processed. Thank you!",
    time: "Last week",
    unread: 0,
    online: false,
  },
];

const initialMessages: Record<string, ChatMessageData[]> = {
  mike: [
    {
      id: 1,
      text: "Good morning! I wanted to update you on the progress of the kitchen renovation.",
      time: "9:30 AM",
      sender: "them",
      read: true,
    },
    {
      id: 2,
      text: "We've completed the demolition phase and started rough plumbing. Everything is on track.",
      time: "9:32 AM",
      sender: "them",
      read: true,
    },
    {
      id: 3,
      text: "Morning Mike! That's great news. Any issues so far?",
      time: "9:45 AM",
      sender: "me",
      read: true,
    },
    {
      id: 4,
      text: "Found one minor plumbing adjustment needed — nothing that affects timeline or budget. I'll send a photo for your records.",
      time: "9:50 AM",
      sender: "them",
      read: true,
    },
    {
      id: 5,
      text: "Perfect, send it over. Also, when can we review the cabinet finish options?",
      time: "10:02 AM",
      sender: "me",
      read: true,
    },
    {
      id: 6,
      text: "I've uploaded the new project timeline and cabinet samples to the shared folder. Take a look when you get a chance!",
      time: "10:45 AM",
      sender: "them",
      read: false,
    },
  ],
  sarah: [
    {
      id: 1,
      text: "Hi! The color palette samples we discussed have arrived. Would you like to schedule a time to review them?",
      time: "3:15 PM",
      sender: "them",
      read: true,
    },
    {
      id: 2,
      text: "Wonderful! How about Thursday afternoon? I'm free after 2 PM.",
      time: "3:30 PM",
      sender: "me",
      read: true,
    },
  ],
};

function getHeaderActions(): HeaderAction[] {
  return [
    { icon: FolderOpen, label: "Project files" },
    { icon: Info, label: "Project info" },
  ];
}

export default function ClientMessagesPage() {
  const { user } = useSession();
  const { data: convos } = useConversations(user?.id);
  const supabase = createClient();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [profileMap, setProfileMap] = useState<Record<string, { name: string; avatar_url: string | null; initials: string | null }>>({});

  const { data: supaMessages } = useMessages(selectedId ?? undefined);

  useEffect(() => {
    if (!convos.length || !user?.id) return;
    const otherUserIds = convos.flatMap(c =>
      c.participants.filter(p => p.user_id !== user.id).map(p => p.user_id)
    );
    const unique = [...new Set(otherUserIds)];
    if (!unique.length) return;
    supabase
      .from("profiles")
      .select("id, name, email, avatar_url, initials")
      .in("id", unique)
      .then(({ data }) => {
        const map: Record<string, { name: string; avatar_url: string | null; initials: string | null }> = {};
        (data ?? []).forEach(p => {
          map[p.id] = { name: p.name ?? p.email ?? "User", avatar_url: p.avatar_url, initials: p.initials };
        });
        setProfileMap(map);
      });
  }, [convos, user?.id, supabase]);

  const mappedConversations: ConversationData[] = convos.map(c => {
    const otherParticipant = c.participants.find(p => p.user_id !== user?.id);
    const otherId = otherParticipant?.user_id ?? "";
    const profile = profileMap[otherId];
    return {
      id: c.id,
      name: profile?.name ?? "Loading...",
      avatar: profile?.avatar_url ?? `https://i.pravatar.cc/150?u=${otherId}`,
      status: "online",
      lastMessage: "",
      time: c.created_at ? new Date(c.created_at).toLocaleDateString() : "",
      unread: 0,
      online: true,
    };
  });

  const mappedMessages: ChatMessageData[] = supaMessages.map(m => ({
    id: Number(m.id.replace(/\D/g, "").slice(0, 8)) || Math.random(),
    text: m.content,
    time: new Date(m.created_at!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    sender: m.sender_id === user?.id ? "me" : "them",
    read: true,
  }));

  const handleSend = useCallback(
    async (text: string, conversationId: string) => {
      if (!user?.id || !conversationId) return;
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: text,
      });
    },
    [user?.id, supabase]
  );

  const displayConversations = mappedConversations.length > 0 ? mappedConversations : conversations;

  return (
    <div className="h-full p-4 lg:p-6">
      <MessageLayout
        conversations={displayConversations}
        initialMessages={initialMessages}
        headerActions={getHeaderActions}
        headerRoleLabel="SERVICE PROVIDER"
        searchPlaceholder="Search providers or projects..."
        title="Messages"
        emptyTitle="Select a conversation"
        emptyDescription="Choose a provider or project conversation from the list to start messaging."
        externalMessages={mappedMessages}
        onSend={handleSend}
        onSelectConversation={setSelectedId}
        selectedConversationId={selectedId}
      />
    </div>
  );
}
