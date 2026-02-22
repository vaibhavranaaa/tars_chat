"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatMessageTime } from "@/lib/utils";
import { useState } from "react";
import { Trash2 } from "lucide-react";

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢"];

interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  body: string;
  senderId: Id<"users">;
  deletedAt?: number;
  reactions?: { emoji: string; userId: Id<"users"> }[];
  sender?: { name: string; imageUrl?: string } | null;
}

interface Props {
  message: Message;
  isOwn: boolean;
  currentUserId?: Id<"users">;
}

export default function MessageItem({ message, isOwn, currentUserId }: Props) {
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);
  const [showReactions, setShowReactions] = useState(false);

  const isDeleted = !!message.deletedAt;

  // Group reactions by emoji
  const reactionGroups: Record<string, { count: number; isMine: boolean }> =
    {};
  for (const r of message.reactions ?? []) {
    if (!reactionGroups[r.emoji]) {
      reactionGroups[r.emoji] = { count: 0, isMine: false };
    }
    reactionGroups[r.emoji].count++;
    if (r.userId === currentUserId) reactionGroups[r.emoji].isMine = true;
  }

  return (
    <div
      className={`flex flex-col ${isOwn ? "items-end" : "items-start"} mb-2 group`}
    >
      {/* Sender name for other user */}
      {!isOwn && (
        <p className="text-xs text-gray-400 ml-1 mb-1">
          {message.sender?.name}
        </p>
      )}

      <div className="flex items-end gap-1.5">
        {/* Delete button (hover, own messages only) */}
        {isOwn && !isDeleted && (
          <button
            onClick={() => deleteMessage({ messageId: message._id })}
            className="opacity-0 group-hover:opacity-100 transition p-1 text-gray-300 hover:text-red-400"
            title="Delete message"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Message bubble */}
        <div className="relative max-w-xs md:max-w-md lg:max-w-lg">
          <div
            className={`px-4 py-2 rounded-2xl text-sm cursor-default select-text ${
              isDeleted
                ? "bg-gray-100 text-gray-400 italic"
                : isOwn
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
            }`}
            onDoubleClick={() => !isDeleted && setShowReactions((v) => !v)}
            title={isDeleted ? "" : "Double-click to react"}
          >
            {isDeleted ? "This message was deleted" : message.body}
          </div>

          {/* Emoji picker popup */}
          {showReactions && !isDeleted && (
            <div
              className={`absolute ${isOwn ? "right-0" : "left-0"} -top-11 flex gap-1 bg-white shadow-xl rounded-full px-3 py-1.5 border border-gray-100 z-20`}
            >
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    toggleReaction({ messageId: message._id, emoji });
                    setShowReactions(false);
                  }}
                  className="hover:scale-125 transition-transform text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reactions row */}
      {Object.entries(reactionGroups).length > 0 && (
        <div className="flex gap-1 mt-1 flex-wrap">
          {Object.entries(reactionGroups).map(([emoji, { count, isMine }]) => (
            <button
              key={emoji}
              onClick={() =>
                toggleReaction({ messageId: message._id, emoji })
              }
              className={`flex items-center gap-0.5 text-xs rounded-full px-2 py-0.5 border transition ${
                isMine
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-gray-100 border-gray-200 text-gray-600"
              }`}
            >
              <span>{emoji}</span>
              <span>{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <span className="text-xs text-gray-400 mt-1 px-1">
        {formatMessageTime(message._creationTime)}
      </span>
    </div>
  );
}