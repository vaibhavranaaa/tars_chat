"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { useRouter } from "next/navigation";

export default function ChatArea({ conversationId }: { conversationId: string }) {
  const convId = conversationId as Id<"conversations">;
  const conversation = useQuery(api.conversations.getConversation, { conversationId: convId });
  const markAsRead = useMutation(api.conversations.markAsRead);
  const router = useRouter();

  useEffect(() => {
    if (conversation) markAsRead({ conversationId: convId });
  }, [conversationId, conversation, markAsRead, convId]);

  if (conversation === undefined) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: "8px", height: "8px", borderRadius: "50%", background: "#6c63ff",
              animation: "bounce 1.2s ease infinite", animationDelay: `${i*0.2}s`
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", color: "#55556a" }}>
        Conversation not found.
      </div>
    );
  }

  const { otherUser } = conversation;
  const initials = otherUser?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0a0a0f", overflow: "hidden" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "#111118", flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Back button mobile */}
          <button
            onClick={() => router.push("/chat")}
            style={{
              display: "none", width: "32px", height: "32px", borderRadius: "8px",
              background: "#1a1a24", border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer", alignItems: "center", justifyContent: "center", fontSize: "16px"
            }}
            className="mobile-back"
          >←</button>

          {otherUser && (
            <>
              {/* Avatar - fixed small size */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                {otherUser.imageUrl ? (
                  <img
                    src={otherUser.imageUrl}
                    alt={otherUser.name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%", background: "#6c63ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: 700, color: "white",
                    fontFamily: "'Syne', sans-serif", flexShrink: 0
                  }}>{initials}</div>
                )}
                <span style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: otherUser.isOnline ? "#22d3a0" : "#55556a",
                  border: "2px solid #111118"
                }} />
              </div>

              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#f0f0ff", margin: 0, fontFamily: "'Syne', sans-serif" }}>
                  {otherUser.name}
                </p>
                <p style={{ fontSize: "11px", color: otherUser.isOnline ? "#22d3a0" : "#55556a", margin: "2px 0 0" }}>
                  {otherUser.isOnline ? "● Active now" : "○ Offline"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "6px" }}>
          {["📞", "🎥", "⋯"].map((icon, i) => (
            <button key={i} style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "#1a1a24", border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer", fontSize: "14px", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* ── Messages ── */}
      <MessageList conversationId={convId} />

      {/* ── Typing indicator ── */}
      <TypingIndicator conversationId={convId} />

      {/* ── Input ── */}
      <MessageInput conversationId={convId} />
    </div>
  );
}