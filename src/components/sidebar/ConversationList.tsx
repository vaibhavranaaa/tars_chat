"use client";

import { useRouter } from "next/navigation";
import { formatTimestamp } from "@/lib/utils";

type Conversation = {
  _id: string;
  otherUser: { _id: string; name: string; imageUrl?: string; isOnline: boolean; } | null;
  lastMessageTime: number;
  lastMessagePreview?: string;
  unreadCount: number;
};

type Props = {
  conversations: Conversation[] | undefined;
  activeConversationId: string | undefined;
};

export default function ConversationList({ conversations, activeConversationId }: Props) {
  const router = useRouter();

  if (conversations === undefined) {
    return (
      <div className="flex-1 p-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 animate-pulse">
            <div className="w-12 h-12 rounded-2xl" style={{ background: "var(--bg-tertiary)" }} />
            <div className="flex-1 space-y-2">
              <div className="h-3 rounded-lg w-2/3" style={{ background: "var(--bg-tertiary)" }} />
              <div className="h-3 rounded-lg w-1/2" style={{ background: "var(--bg-tertiary)" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl"
          style={{ background: "var(--accent-soft)" }}>💬</div>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>No conversations yet</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Click search to find someone to chat with
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-4">
      {conversations.map((conv) => {
        const isActive = conv._id === activeConversationId;
        const other = conv.otherUser;

        return (
          <button
            key={conv._id}
            onClick={() => router.push(`/chat/${conv._id}`)}
            className="w-full px-3 py-3 flex items-center gap-3 rounded-2xl mb-1 transition-all duration-200 text-left"
            style={{
              background: isActive ? "var(--accent-soft)" : "transparent",
              border: isActive ? "1px solid rgba(124,106,255,0.3)" : "1px solid transparent",
            }}
          >
            <div className="relative flex-shrink-0">
              {other?.imageUrl ? (
                <img src={other.imageUrl} alt={other.name}
                  className="w-12 h-12 rounded-2xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                  {other?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              {other?.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                  style={{ background: "var(--online)", borderColor: "var(--bg-secondary)" }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold truncate"
                  style={{ color: isActive ? "var(--accent)" : "var(--text-primary)" }}>
                  {other?.name ?? "Unknown"}
                </p>
                <p className="text-xs flex-shrink-0 ml-2" style={{ color: "var(--text-secondary)" }}>
                  {formatTimestamp(conv.lastMessageTime)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  {conv.lastMessagePreview ?? "Start a conversation"}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="ml-2 flex-shrink-0 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ background: "var(--accent)" }}>
                    {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}