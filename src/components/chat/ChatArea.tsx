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
              animation: "bounce 1.2s ease infinite", animationDelay: `${i * 0.2}s`
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
        padding: "12px 20px", flexShrink: 0, position: "relative",
        background: "#0d0d14", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Subtle header glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 50%, rgba(108,99,255,0.04) 0%, transparent 60%)",
          pointerEvents: "none"
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          {/* Back btn mobile */}
          <button onClick={() => router.push("/chat")} style={{
            display: "none", width: "32px", height: "32px", borderRadius: "8px",
            background: "#1a1a24", border: "1px solid rgba(255,255,255,0.07)",
            cursor: "pointer", alignItems: "center", justifyContent: "center", fontSize: "16px"
          }}>←</button>

          {otherUser && (
            <>
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  position: "absolute", inset: "-2px", borderRadius: "50%",
                  background: otherUser.isOnline
                    ? "linear-gradient(135deg, #22d3a0, #6c63ff)"
                    : "transparent",
                  opacity: 0.6
                }} />
                {otherUser.imageUrl ? (
                  <img src={otherUser.imageUrl} alt={otherUser.name}
                    style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", display: "block", position: "relative" }} />
                ) : (
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "15px", fontWeight: 700, color: "white",
                    fontFamily: "'Syne', sans-serif", position: "relative"
                  }}>{initials}</div>
                )}
                <span style={{
                  position: "absolute", bottom: "1px", right: "1px",
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: otherUser.isOnline ? "#22d3a0" : "#2a2a3a",
                  border: "2px solid #0d0d14",
                  boxShadow: otherUser.isOnline ? "0 0 6px rgba(34,211,160,0.6)" : "none"
                }} />
              </div>

              <div>
                <p style={{
                  fontSize: "14px", fontWeight: 700, color: "#f0f0ff", margin: 0,
                  fontFamily: "'Syne', sans-serif", letterSpacing: "-0.2px"
                }}>{otherUser.name}</p>
                <p style={{
                  fontSize: "11px", margin: "2px 0 0",
                  color: otherUser.isOnline ? "#22d3a0" : "#55556a"
                }}>
                  {otherUser.isOnline ? "● Active now" : "○ Offline"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "6px", position: "relative" }}>
          {[
            { icon: "📞", title: "Voice call" },
            { icon: "🎥", title: "Video call" },
            { icon: "⋯", title: "More options" },
          ].map(({ icon, title }) => (
            <button key={title} title={title} style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer", fontSize: "14px", display: "flex",
              alignItems: "center", justifyContent: "center", transition: "all 0.15s"
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(108,99,255,0.15)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(108,99,255,0.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >{icon}</button>
          ))}
        </div>
      </div>

      {/* ── Messages area with subtle bg pattern ── */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Dot grid background */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} />
        <MessageList conversationId={convId} />
      </div>

      {/* ── Typing ── */}
      <TypingIndicator conversationId={convId} />

      {/* ── Input ── */}
      <MessageInput conversationId={convId} />
    </div>
  );
}