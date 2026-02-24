"use client";

import { usePathname, useRouter } from "next/navigation";
import { formatTimestamp } from "@/lib/utils";

interface Conversation {
  _id: string;
  lastMessageTime: number;
  lastMessagePreview?: string;
  otherUser: { name: string; imageUrl?: string; isOnline: boolean } | null;
  unreadCount: number;
}

interface Props {
  conversations: Conversation[] | undefined;
}

export default function ConversationList({ conversations }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  if (conversations === undefined) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "8px 12px" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "12px", background: "#1a1a24" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#222230", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: "13px", borderRadius: "6px", background: "#222230", width: "65%", marginBottom: "8px" }} />
              <div style={{ height: "11px", borderRadius: "6px", background: "#222230", width: "45%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px", textAlign: "center", padding: "24px" }}>
        <p style={{ fontSize: "28px", marginBottom: "10px" }}>💬</p>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#f0f0ff", fontFamily: "'Syne', sans-serif", margin: "0 0 4px" }}>No conversations yet</p>
        <p style={{ fontSize: "12px", color: "#55556a", margin: 0 }}>Search for someone to start chatting</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "8px 12px" }}>
      {conversations.map(conv => {
        if (!conv.otherUser) return null;
        const isActive = pathname === `/chat/${conv._id}`;
        const initials = conv.otherUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

        return (
          <button
            key={conv._id}
            onClick={() => router.push(`/chat/${conv._id}`)}
            style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
              borderRadius: "12px", cursor: "pointer", textAlign: "left", width: "100%",
              background: isActive ? "#1e1e2e" : "transparent",
              border: isActive ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
              transition: "all 0.15s"
            }}
            onMouseEnter={e => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "#1a1a24";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
              }
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {conv.otherUser.imageUrl ? (
                <img src={conv.otherUser.imageUrl} alt={conv.otherUser.name}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%", background: "#6c63ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: 700, color: "white", fontFamily: "'Syne', sans-serif"
                }}>{initials}</div>
              )}
              <span style={{
                position: "absolute", bottom: 0, right: 0, width: "11px", height: "11px",
                borderRadius: "50%", background: conv.otherUser.isOnline ? "#22d3a0" : "#55556a",
                border: "2px solid #111118"
              }} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "4px", marginBottom: "3px" }}>
                <span style={{
                  fontSize: "13px", fontWeight: conv.unreadCount > 0 ? 700 : 600,
                  color: "#f0f0ff", fontFamily: "'Syne', sans-serif",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>{conv.otherUser.name}</span>
                <span style={{ fontSize: "10px", color: "#55556a", flexShrink: 0 }}>
                  {formatTimestamp(conv.lastMessageTime)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "4px" }}>
                <p style={{
                  fontSize: "12px", color: conv.unreadCount > 0 ? "#8888aa" : "#55556a",
                  margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                  {conv.lastMessagePreview ?? "No messages yet"}
                </p>
                {conv.unreadCount > 0 && (
                  <span style={{
                    flexShrink: 0, width: "18px", height: "18px", borderRadius: "50%",
                    background: "#6c63ff", color: "white", fontSize: "10px",
                    fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
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