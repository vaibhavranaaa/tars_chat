"use client";

import { usePathname, useRouter } from "next/navigation";
import { formatTimestamp } from "@/lib/utils";

interface Props {
  conversation: {
    _id: string;
    lastMessageTime: number;
    lastMessagePreview?: string;
    otherUser: {
      name: string;
      imageUrl?: string;
      isOnline: boolean;
    } | null;
    unreadCount: number;
  };
}

export default function ConversationItem({ conversation }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === `/chat/${conversation._id}`;
  const { otherUser, lastMessageTime, lastMessagePreview, unreadCount } = conversation;

  if (!otherUser) return null;

  const initials = otherUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <button
      onClick={() => router.push(`/chat/${conversation._id}`)}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group"
      style={{
        background: isActive ? "var(--bg-3)" : "transparent",
        border: isActive ? "1px solid var(--border)" : "1px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = "var(--bg-3)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {otherUser.imageUrl ? (
          <img
            src={otherUser.imageUrl}
            alt={otherUser.name}
            className="w-11 h-11 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--accent)", color: "white", fontFamily: "'Syne', sans-serif" }}>
            {initials}
          </div>
        )}
        {/* Online dot */}
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
          style={{
            background: otherUser.isOnline ? "var(--green)" : "var(--text-muted)",
            borderColor: "var(--bg-2)",
          }}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-1">
          <span className="text-sm font-semibold truncate"
            style={{ color: unreadCount > 0 ? "var(--text-primary)" : "var(--text-secondary)", fontFamily: "'Syne', sans-serif" }}>
            {otherUser.name}
          </span>
          <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>
            {formatTimestamp(lastMessageTime)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-0.5 gap-1">
          <p className="text-xs truncate"
            style={{ color: unreadCount > 0 ? "var(--text-secondary)" : "var(--text-muted)" }}>
            {lastMessagePreview ?? "No messages yet"}
          </p>
          {unreadCount > 0 && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--accent)", color: "white" }}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}