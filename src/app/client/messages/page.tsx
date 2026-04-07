"use client";

import { FolderOpen, Info } from "lucide-react";
import { MessageLayout } from "@/components/messages/message-layout";
import type { ConversationData } from "@/components/messages/conversation-item";
import type { ChatMessageData } from "@/components/messages/chat-bubble";
import type { HeaderAction } from "@/components/messages/chat-header";

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
  return (
    <div className="h-full p-4 lg:p-6">
      <MessageLayout
        conversations={conversations}
        initialMessages={initialMessages}
        headerActions={getHeaderActions}
        headerRoleLabel="SERVICE PROVIDER"
        searchPlaceholder="Search providers or projects..."
        title="Messages"
        emptyTitle="Select a conversation"
        emptyDescription="Choose a provider or project conversation from the list to start messaging."
      />
    </div>
  );
}
