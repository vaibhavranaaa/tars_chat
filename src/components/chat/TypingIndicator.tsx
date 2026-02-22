"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function TypingIndicator({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) {
  const typingUsers = useQuery(api.typing.getTypingUsers, { conversationId });

  if (!typingUsers || typingUsers.length === 0) return null;

  const names = typingUsers.map((u) => u?.name).filter(Boolean).join(", ");

  return (
    <div className="px-4 py-1 flex items-center gap-2 text-xs text-gray-400">
      <span>{names} is typing</span>
      <span className="flex gap-0.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    </div>
  );
}