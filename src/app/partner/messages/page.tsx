"use client";

import { useState, useEffect, useCallback } from "react";
import { Info, Share2 } from "lucide-react";
import { MessageLayout } from "@/components/messages/message-layout";
import type { ConversationData } from "@/components/messages/conversation-item";
import type { ChatMessageData } from "@/components/messages/chat-bubble";
import type { HeaderAction } from "@/components/messages/chat-header";
import { useSession } from "@/context/session-context";
import { useConversations, useMessages } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";

const conversations: ConversationData[] = [
  {
    id: "primme-support",
    name: "Primme Support",
    avatar: "https://i.pravatar.cc/150?img=68",
    status: "SUPPORT",
    lastMessage: "Your commission for March has been processed.",
    time: "11:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: "james",
    name: "James Carter",
    avatar: "https://i.pravatar.cc/150?img=7",
    status: "REFERRED CLIENT",
    lastMessage: "Thanks for connecting me with the painter!",
    time: "Yesterday",
    unread: 1,
    online: false,
  },
  {
    id: "maria",
    name: "Maria Gonzalez",
    avatar: "https://i.pravatar.cc/150?img=23",
    status: "REFERRED CLIENT",
    lastMessage: "The renovation went perfectly. Great recommendation.",
    time: "3 days ago",
    unread: 0,
    online: false,
  },
  {
    id: "partner-team",
    name: "Partner Success Team",
    avatar: "https://i.pravatar.cc/150?img=52",
    status: "SUPPORT",
    lastMessage: "New referral bonuses available this month!",
    time: "Last week",
    unread: 0,
    online: true,
  },
];

const initialMessages: Record<string, ChatMessageData[]> = {
  "primme-support": [
    {
      id: 1,
      text: "Hi Michael! Just wanted to let you know your March commission has been processed and will be in your account within 2 business days.",
      time: "11:25 AM",
      sender: "them",
      read: true,
    },
    {
      id: 2,
      text: "Also, we've launched a new tier bonus — Gold partners now earn 15% on all referrals this quarter. You're just 2 referrals away!",
      time: "11:28 AM",
      sender: "them",
      read: false,
    },
  ],
  james: [
    {
      id: 1,
      text: "Hey Michael, the painter you recommended did an amazing job on my living room. Really appreciate the connection!",
      time: "2:15 PM",
      sender: "them",
      read: true,
    },
    {
      id: 2,
      text: "That's great to hear, James! Alexander Rivera is one of the top providers on the platform. Glad it worked out.",
      time: "2:30 PM",
      sender: "me",
      read: true,
    },
    {
      id: 3,
      text: "I'm thinking about doing the kitchen next. Could you recommend someone for cabinet refinishing?",
      time: "2:45 PM",
      sender: "them",
      read: true,
    },
  ],
};

function getHeaderActions(): HeaderAction[] {
  return [
    { icon: Share2, label: "Share referral link" },
    { icon: Info, label: "Details" },
  ];
}

export default function PartnerMessagesPage() {
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
        headerRoleLabel="PARTNER"
        searchPlaceholder="Search conversations..."
        title="Messages"
        emptyTitle="Select a conversation"
        emptyDescription="Choose a conversation from your referred clients or Primme support."
        externalMessages={mappedMessages}
        onSend={handleSend}
        onSelectConversation={setSelectedId}
        selectedConversationId={selectedId}
      />
    </div>
  );
}
