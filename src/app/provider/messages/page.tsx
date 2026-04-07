"use client";

import { Phone, Video, Info } from "lucide-react";
import { MessageLayout } from "@/components/messages/message-layout";
import type { ConversationData } from "@/components/messages/conversation-item";
import type { ChatMessageData } from "@/components/messages/chat-bubble";
import type { HeaderAction } from "@/components/messages/chat-header";

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
  return (
    <div className="h-full p-4 lg:p-6">
      <MessageLayout
        conversations={conversations}
        initialMessages={initialMessages}
        headerActions={getHeaderActions}
        headerRoleLabel="PROJECT"
        searchPlaceholder="Find a project or client..."
        title="Messages"
        emptyTitle="Select a conversation"
        emptyDescription="Choose a project or client conversation from the list to continue messaging."
      />
    </div>
  );
}
