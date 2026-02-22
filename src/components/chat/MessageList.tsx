"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { ChevronDown } from "lucide-react";

export default function MessageList({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) {
  const messages = useQuery(api.messages.getMessages, { conversationId });
  const currentUser = useQuery(api.users.getCurrentUser);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showNewMessages, setShowNewMessages] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMessages(false);
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (!messages) return;
    if (!userScrolledUp) {
      scrollToBottom();
    } else {
      setShowNewMessages(true);
    }
  }, [messages?.length]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    setUserScrolledUp(!isNearBottom);
    if (isNearBottom) setShowNewMessages(false);
  };

  // Loading
  if (messages === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">✉️</p>
        <p className="font-semibold text-gray-700">No messages yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to say hello! 👋
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-4 flex flex-col gap-1"
      >
        {messages.map((msg) => (
          <MessageItem
            key={msg._id}
            message={msg}
            isOwn={msg.senderId === currentUser?._id}
            currentUserId={currentUser?._id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* New messages button */}
      {showNewMessages && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-blue-500 text-white text-sm px-4 py-1.5 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <ChevronDown className="w-4 h-4" />
          New messages
        </button>
      )}
    </div>
  );
}