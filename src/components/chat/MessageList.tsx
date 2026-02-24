"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ conversationId }: { conversationId: Id<"conversations"> }) {
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

  useEffect(() => {
    if (!messages) return;
    if (!userScrolledUp) scrollToBottom();
    else setShowNewMessages(true);
  }, [messages?.length]);

  const handleScroll = () => {
    const c = containerRef.current;
    if (!c) return;
    const nearBottom = c.scrollHeight - c.scrollTop - c.clientHeight < 100;
    setUserScrolledUp(!nearBottom);
    if (nearBottom) setShowNewMessages(false);
  };

  if (messages === undefined) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: "8px", height: "8px", borderRadius: "50%", background: "#6c63ff",
              animation: "bounce 1.2s ease infinite", animationDelay: `${i * 0.2}s`
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>✉️</div>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#f0f0ff", fontFamily: "'Syne', sans-serif", margin: "0 0 6px" }}>No messages yet</p>
        <p style={{ fontSize: "13px", color: "#55556a", margin: 0 }}>Say hello and start the conversation!</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height: "100%", overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: "4px" }}
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

      {showNewMessages && (
        <button
          onClick={scrollToBottom}
          style={{
            position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: "6px",
            background: "#6c63ff", color: "white", fontSize: "13px", fontWeight: 600,
            padding: "8px 16px", borderRadius: "999px", border: "none", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(108,99,255,0.4)"
          }}
        >
          ↓ New messages
        </button>
      )}
    </div>
  );
}