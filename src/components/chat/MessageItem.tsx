"use client";

import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { formatMessageTime } from "@/lib/utils";
import { useState } from "react";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

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
  const isDeleted = !!message.deletedAt;

  const groups: Record<string, { count: number; isMine: boolean }> = {};
  for (const r of message.reactions ?? []) {
    if (!groups[r.emoji]) groups[r.emoji] = { count: 0, isMine: false };
    groups[r.emoji].count++;
    if (r.userId === currentUserId) groups[r.emoji].isMine = true;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start", marginBottom: "6px" }}
      className="group">

      {/* Sender name */}
      {!isOwn && (
        <p style={{ fontSize: "11px", color: "#55556a", margin: "0 0 3px 4px", fontFamily: "'Syne', sans-serif" }}>
          {message.sender?.name}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
        {/* Delete btn */}
        {isOwn && !isDeleted && (
          <button
            onClick={() => deleteMessage({ messageId: message._id })}
            style={{
              opacity: 0, background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", color: "#55556a", padding: "4px", borderRadius: "6px",
              transition: "opacity 0.2s"
            }}
            className="delete-btn"
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ff6b6b"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#55556a"}
          >🗑</button>
        )}

        {/* Bubble */}
        <div style={{ position: "relative", maxWidth: "420px" }}>
          <div
            onDoubleClick={() => !isDeleted && setShowEmojis(v => !v)}
            style={{
              padding: "10px 14px", borderRadius: "18px",
              borderBottomRightRadius: isOwn ? "4px" : "18px",
              borderBottomLeftRadius: isOwn ? "18px" : "4px",
              fontSize: "14px", lineHeight: "1.5", cursor: "default",
              background: isDeleted ? "#1a1a24" : isOwn ? "#6c63ff" : "#1e1e2e",
              color: isDeleted ? "#55556a" : "#f0f0ff",
              fontStyle: isDeleted ? "italic" : "normal",
              border: isDeleted ? "1px solid rgba(255,255,255,0.07)" : "none",
              wordBreak: "break-word"
            }}
            title={isDeleted ? "" : "Double-click to react"}
          >
            {isDeleted ? "This message was deleted" : message.body}
          </div>

          {/* Emoji picker */}
          {showEmojis && !isDeleted && (
            <div style={{
              position: "absolute", [isOwn ? "right" : "left"]: 0, bottom: "calc(100% + 6px)",
              display: "flex", gap: "4px", background: "#1e1e2e", padding: "8px 12px",
              borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 10
            }}>
              {EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => { toggleReaction({ messageId: message._id, emoji }); setShowEmojis(false); }}
                  style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", transition: "transform 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.3)"}
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
                display: "flex", alignItems: "center", gap: "3px", fontSize: "12px",
                padding: "2px 8px", borderRadius: "999px", cursor: "pointer",
                background: isMine ? "rgba(108,99,255,0.2)" : "#1e1e2e",
                border: `1px solid ${isMine ? "#6c63ff" : "rgba(255,255,255,0.07)"}`,
                color: isMine ? "#a78bfa" : "#8888aa"
              }}
            >{emoji} {count}</button>
          ))}
        </div>
      )}

      {/* Time */}
      <span style={{ fontSize: "10px", color: "#55556a", marginTop: "3px", padding: "0 4px" }}>
        {formatMessageTime(message._creationTime)}
      </span>
    </div>
  );
}