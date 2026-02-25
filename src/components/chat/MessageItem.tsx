"use client";

import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { formatMessageTime } from "@/lib/utils";
import { useState } from "react";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  body: string;
  senderId: Id<"users">;
  deletedAt?: number;
  reactions?: { emoji: string; userId: Id<"users"> }[];
  sender?: { name: string; imageUrl?: string } | null;
}

export default function MessageItem({ message, isOwn, currentUserId }: {
  message: Message;
  isOwn: boolean;
  currentUserId?: Id<"users">;
}) {
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);
  const [showEmojis, setShowEmojis] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isDeleted = !!message.deletedAt;

  const groups: Record<string, { count: number; isMine: boolean }> = {};
  for (const r of message.reactions ?? []) {
    if (!groups[r.emoji]) groups[r.emoji] = { count: 0, isMine: false };
    groups[r.emoji].count++;
    if (r.userId === currentUserId) groups[r.emoji].isMine = true;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start", marginBottom: "8px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); }}
    >
      {/* Sender name */}
      {!isOwn && (
        <p style={{ fontSize: "11px", color: "#3a3a5a", margin: "0 0 3px 4px", fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
          {message.sender?.name}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
        {/* Delete btn */}
        {isOwn && !isDeleted && (
          <button
            onClick={() => deleteMessage({ messageId: message._id })}
            style={{
              opacity: hovered ? 1 : 0, background: "none", border: "none",
              cursor: "pointer", fontSize: "12px", color: "#3a3a5a",
              padding: "4px", borderRadius: "6px", transition: "all 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ff6b6b"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#3a3a5a"}
            title="Delete message"
          >🗑</button>
        )}

        {/* Bubble */}
        <div style={{ position: "relative", maxWidth: "420px" }}>
          <div
            onDoubleClick={() => !isDeleted && setShowEmojis(v => !v)}
            style={{
              padding: "10px 14px",
              borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              fontSize: "14px", lineHeight: "1.6", cursor: "default", wordBreak: "break-word",
              background: isDeleted
                ? "rgba(255,255,255,0.03)"
                : isOwn
                  ? "linear-gradient(135deg, #6c63ff, #8b7ff5)"
                  : "rgba(255,255,255,0.05)",
              color: isDeleted ? "#3a3a5a" : "#f0f0ff",
              fontStyle: isDeleted ? "italic" : "normal",
              border: isDeleted
                ? "1px solid rgba(255,255,255,0.05)"
                : isOwn
                  ? "none"
                  : "1px solid rgba(255,255,255,0.07)",
              boxShadow: isOwn && !isDeleted
                ? "0 4px 20px rgba(108,99,255,0.25)"
                : "none",
              transition: "transform 0.1s"
            }}
            title={isDeleted ? "" : "Double-click to react"}
          >
            {isDeleted ? "This message was deleted" : message.body}
          </div>

          {/* Emoji picker */}
          {showEmojis && !isDeleted && (
            <div style={{
              position: "absolute",
              [isOwn ? "right" : "left"]: 0,
              bottom: "calc(100% + 8px)",
              display: "flex", gap: "2px",
              background: "#1a1a2e", padding: "8px 12px",
              borderRadius: "999px", border: "1px solid rgba(108,99,255,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
              zIndex: 10
            }}>
              {EMOJIS.map(emoji => (
                <button key={emoji}
                  onClick={() => { toggleReaction({ messageId: message._id, emoji }); setShowEmojis(false); }}
                  style={{
                    background: "none", border: "none", fontSize: "20px",
                    cursor: "pointer", transition: "transform 0.1s", padding: "2px 4px", borderRadius: "8px"
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.35)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
                >{emoji}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reactions */}
      {Object.entries(groups).length > 0 && (
        <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
          {Object.entries(groups).map(([emoji, { count, isMine }]) => (
            <button key={emoji}
              onClick={() => toggleReaction({ messageId: message._id, emoji })}
              style={{
                display: "flex", alignItems: "center", gap: "3px",
                fontSize: "12px", padding: "3px 8px", borderRadius: "999px",
                cursor: "pointer", transition: "all 0.15s",
                background: isMine ? "rgba(108,99,255,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isMine ? "rgba(108,99,255,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: isMine ? "#a78bfa" : "#8888aa"
              }}
            >{emoji} {count}</button>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <span style={{
        fontSize: "10px", color: "#2a2a3a", marginTop: "4px",
        padding: "0 4px", opacity: hovered ? 1 : 0.6, transition: "opacity 0.2s"
      }}>
        {formatMessageTime(message._creationTime)}
      </span>
    </div>
  );
}