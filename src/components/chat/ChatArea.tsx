"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useRouter } from "next/navigation";

type Props = { conversationId: Id<"conversations"> };

export default function ChatArea({ conversationId }: Props) {
  const router = useRouter();
  const conversation = useQuery(api.conversations.getConversation, { conversationId });
  const markAsRead = useMutation(api.conversations.markAsRead);

  useEffect(() => {
    if (conversationId) markAsRead({ conversationId });
  }, [conversationId]);

  if (conversation === undefined) {
    return (
      <div className="flex-1 flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <div className="px-6 py-4 flex items-center gap-3 animate-pulse"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
          <div className="w-10 h-10 rounded-2xl" style={{ background: "var(--bg-tertiary)" }} />
          <div className="space-y-2">
            <div className="h-3 rounded w-32" style={{ background: "var(--bg-tertiary)" }} />
            <div className="h-2 rounded w-20" style={{ background: "var(--bg-tertiary)" }} />
          </div>
        </div>
        <div className="flex-1" />
      </div>
    );
  }

  if (conversation === null) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center">
          <p className="text-5xl mb-3">🚫</p>
          <p style={{ color: "var(--text-secondary)" }}>Conversation not found</p>
          <button onClick={() => router.push("/chat")}
            className="mt-4 text-sm hover:underline" style={{ color: "var(--accent)" }}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  const other = conversation.otherUser;

  return (
    <div className="flex-1 flex flex-col h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 flex-shrink-0"
        style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => router.push("/chat")}
          className="md:hidden w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
          ←
        </button>

        <div className="relative">
          {other?.imageUrl ? (
            <img src={other.imageUrl} alt={other.name} className="w-11 h-11 rounded-2xl object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
              {other?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          {other?.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{ background: "var(--online)", borderColor: "var(--bg-secondary)" }} />
          )}
        </div>

        <div className="flex-1">
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{other?.name}</p>
          <p className="text-xs" style={{ color: other?.isOnline ? "var(--online)" : "var(--text-secondary)" }}>
            {other?.isOnline ? "● Active now" : "Offline"}
          </p>
        </div>
      </div>

      <MessageList conversationId={conversationId} />
      <MessageInput conversationId={conversationId} />
    </div>
  );
}