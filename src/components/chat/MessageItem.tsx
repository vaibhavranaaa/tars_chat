"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useState } from "react";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢"];

type Props = { message: any; showAvatar: boolean; };

export default function MessageItem({ message, showAvatar }: Props) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);
  const [showReactions, setShowReactions] = useState(false);

  const isMe = message.senderId === currentUser?._id;
  const isDeleted = !!message.deletedAt;

  const reactionMap: Record<string, number> = {};
  for (const r of message.reactions ?? []) {
    reactionMap[r.emoji] = (reactionMap[r.emoji] ?? 0) + 1;
  }

  const timestamp = new Date(message._creationTime);
  const now = new Date();
  const isToday = timestamp.toDateString() === now.toDateString();
  const isThisYear = timestamp.getFullYear() === now.getFullYear();

  let timeLabel = "";
  if (isToday) {
    timeLabel = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (isThisYear) {
    timeLabel = timestamp.toLocaleDateString([], { month: "short", day: "numeric" }) + ", " +
      timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    timeLabel = timestamp.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) + ", " +
      timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className={`flex items-end gap-2 group ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className="w-8 flex-shrink-0 mb-1">
        {showAvatar && !isMe && (
          message.sender?.imageUrl ? (
            <img src={message.sender.imageUrl} className="w-8 h-8 rounded-xl object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
              {message.sender?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )
        )}
      </div>

      <div className={`flex flex-col max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div className="relative">
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isMe ? "rounded-br-sm" : "rounded-bl-sm"
          }`}
            style={{
              background: isDeleted
                ? "var(--bg-tertiary)"
                : isMe
                ? "var(--accent)"
                : "var(--bg-secondary)",
              color: isDeleted ? "var(--text-secondary)" : "var(--text-primary)",
              border: !isMe && !isDeleted ? "1px solid var(--border)" : "none",
              fontStyle: isDeleted ? "italic" : "normal",
            }}>
            {isDeleted ? "This message was deleted" : message.body}
          </div>

          {/* Hover actions */}
          {!isDeleted && (
            <div className={`absolute top-0 ${isMe ? "left-0 -translate-x-full pr-2" : "right-0 translate-x-full pl-2"} hidden group-hover:flex items-center gap-1`}>
              <button onClick={() => setShowReactions((s) => !s)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
                😊
              </button>
              {isMe && (
                <button onClick={() => deleteMessage({ messageId: message._id })}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all"
                  style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
                  🗑
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reaction picker */}
        {showReactions && (
          <div className="flex gap-1 mt-1 px-3 py-2 rounded-2xl shadow-xl"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            {REACTIONS.map((emoji) => (
              <button key={emoji}
                onClick={() => { toggleReaction({ messageId: message._id, emoji }); setShowReactions(false); }}
                className="text-xl hover:scale-125 transition-transform">
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Reaction counts */}
        {Object.keys(reactionMap).length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(reactionMap).map(([emoji, count]) => (
              <button key={emoji}
                onClick={() => toggleReaction({ messageId: message._id, emoji })}
                className="text-xs px-2 py-0.5 rounded-full transition-all"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                {emoji} {count}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs mt-1 px-1" style={{ color: "var(--text-secondary)" }}>{timeLabel}</p>
      </div>
    </div>
  );
}