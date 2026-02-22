"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

type Props = { conversationId: Id<"conversations"> };

export default function TypingIndicator({ conversationId }: Props) {
  const typingUsers = useQuery(api.typing.getTypingUsers, { conversationId });
  if (!typingUsers || typingUsers.length === 0) return null;
  const names = typingUsers.map((u: any) => u?.name?.split(" ")[0]).join(", ");

  return (
    <div className="flex items-center gap-2 px-2 py-2">
      <div className="flex gap-1">
        {[0, 150, 300].map((delay) => (
          <span key={delay}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ background: "var(--text-secondary)", animationDelay: `${delay}ms` }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{names} is typing...</p>
    </div>
  );
}