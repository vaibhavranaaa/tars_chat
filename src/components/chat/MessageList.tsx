"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import TypingIndicator from "./TypingIndicator";

type Props = {
  conversationId: Id<"conversations">;
};

export default function MessageList({ conversationId }: Props) {
  const messages = useQuery(api.messages.getMessages, { conversationId });
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll only if user is at bottom
  useEffect(() => {
    if (isAtBottom) scrollToBottom();
    else setShowScrollBtn(true);
  }, [messages]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsAtBottom(atBottom);
    if (atBottom) setShowScrollBtn(false);
  };

  if (messages === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <p className="text-5xl mb-3">👋</p>
        <p className="text-sm font-medium text-gray-600">No messages yet</p>
        <p className="text-xs text-gray-400 mt-1">Say hello to start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-4 space-y-1 bg-gray-50"
      >
        {messages.map((msg, i) => {
          const prevMsg = messages[i - 1];
          const showAvatar =
            !prevMsg || prevMsg.senderId !== msg.senderId;
          return (
            <MessageItem
              key={msg._id}
              message={msg}
              showAvatar={showAvatar}
            />
          );
        })}
        <TypingIndicator conversationId={conversationId} />
        <div ref={bottomRef} />
      </div>

      {/* New messages button */}
      {showScrollBtn && (
        <button
          onClick={() => {
            scrollToBottom();
            setShowScrollBtn(false);
            setIsAtBottom(true);
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs px-4 py-2 rounded-full shadow-lg hover:bg-indigo-600 transition-colors"
        >
          ↓ New messages
        </button>
      )}
    </div>
  );
}