"use client";

import { useState, useEffect, useCallback } from "react";
import { Phone, Video, Info } from "lucide-react";
import { MessageLayout } from "@/components/messages/message-layout";
import type { ConversationData } from "@/components/messages/conversation-item";
import type { ChatMessageData } from "@/components/messages/chat-bubble";
import type { HeaderAction } from "@/components/messages/chat-header";
import { useSession } from "@/context/session-context";
import { useConversations, useMessages } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";

const conversations: ConversationData[] = [
  {
    id: "beverly",
    name: "Beverly Hills Project",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "ACTIVE PROJECT",
    lastMessage: "Looking forward to the estimate.",
    time: "10:45 AM",
    unread: 3,
    online: true,
  },
  {
    id: "sarah",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=9",
    status: "ACTIVE PROJECT",
    lastMessage: "Can we start on Monday?",
    time: "Yesterday",
    unread: 1,
    online: false,
  },
  {
    id: "hollywood",
    name: "West Hollywood Renovation",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "COMPLETED",
    lastMessage: "Great work on the cabinets!",
    time: "2 days ago",
    unread: 0,
    online: false,
  },
  {
    id: "malibu",
    name: "Malibu Beach House",
    avatar: "https://i.pravatar.cc/150?img=15",
    status: "ACTIVE PROJECT",
    lastMessage: "Sending the updated floor plan now.",
    time: "3 days ago",
    unread: 0,
    online: true,
  },
];

const initialMessages: Record<string, ChatMessageData[]> = {
  beverly: [
    {
      id: 1,
      text: "Hello! I've been looking at your portfolio and the reviews for the Beverly Hills area. We have a full repaint project that needs to start soon.",
      time: "10:42 AM",
      sender: "them",
      read: true,
    },
    {
      id: 2,
      text: "Thank you for reaching out! I'd love to discuss the project scope. Could you share the approximate square footage?",
      time: "10:48 AM",
      sender: "me",
      read: true,
    },
    {
      id: 3,
      text: "It's about 3,200 sq ft. Mostly interior walls plus the master bedroom ceiling needs a full treatment.",
      time: "10:52 AM",
      sender: "them",
      read: true,
    },
    {
      id: 4,
      text: "Just sent over the official estimate for the Master Bedroom project. It includes the premium low-VOC finish we discussed.",
      time: "11:02 AM",
      sender: "me",
      read: false,
    },
  ],
  sarah: [
    {
      id: 1,
      text: "Hi! Following up on the kitchen renovation timeline. Are we still looking at a Monday start?",
      time: "4:20 PM",
      sender: "them",
      read: true,
    },
    {
      id: 2,
      text: "Yes, Monday works great. The team will arrive at 8 AM. We'll start with the prep work.",
      time: "4:35 PM",
      sender: "me",
      read: true,
    },
  ],
};

function getHeaderActions(): HeaderAction[] {
  return [
    { icon: Phone, label: "Voice call" },
    { icon: Video, label: "Video call" },
    { icon: Info, label: "Project info" },
  ];
}

export default function ProviderMessagesPage() {
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
        headerRoleLabel="PROJECT"
        searchPlaceholder="Find a project or client..."
        title="Messages"
        emptyTitle="Select a conversation"
        emptyDescription="Choose a project or client conversation from the list to continue messaging."
        externalMessages={mappedMessages}
        onSend={handleSend}
        onSelectConversation={setSelectedId}
        selectedConversationId={selectedId}
      />
    </div>
  );
}
