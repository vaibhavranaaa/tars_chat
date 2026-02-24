"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import ConversationList from "./ConversationList";
import UserSearch from "./UserSearch";

export default function Sidebar() {
  const [showSearch, setShowSearch] = useState(false);
  const currentUser = useQuery(api.users.getCurrentUser);
  const conversations = useQuery(api.conversations.getMyConversations);
  const getOrCreate = useMutation(api.conversations.getOrCreateConversation);
  const router = useRouter();

  const handleSelectUser = async (userId: Id<"users">) => {
    const convId = await getOrCreate({ otherUserId: userId });
    setShowSearch(false);
    router.push(`/chat/${convId}`);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%", width: "100%",
      background: "#111118", borderRight: "1px solid rgba(255,255,255,0.07)",
      fontFamily: "'DM Sans', sans-serif", overflow: "hidden"
    }}>

      {/* ── Header ── */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "8px", background: "#6c63ff",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0
          }}>⚡</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#f0f0ff" }}>
            TarsChat
          </span>
        </div>

        {/* User row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
            <div style={{ position: "relative", flexShrink: 0, width: "32px", height: "32px" }}>
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{ elements: { avatarBox: { width: "32px", height: "32px" } } }}
              />
              <span style={{
                position: "absolute", bottom: "-1px", right: "-1px", width: "10px", height: "10px",
                borderRadius: "50%", background: "#22d3a0", border: "2px solid #111118", pointerEvents: "none"
              }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#f0f0ff", lineHeight: 1, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentUser?.name ?? "..."}
              </p>
              <p style={{ fontSize: "11px", color: "#22d3a0", marginTop: "3px", margin: "3px 0 0" }}>Active now</p>
            </div>
          </div>

          <button
            onClick={() => setShowSearch(v => !v)}
            style={{
              flexShrink: 0, width: "34px", height: "34px", borderRadius: "10px",
              background: showSearch ? "#6c63ff" : "#1a1a24",
              border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "15px", transition: "all 0.2s"
            }}
            title={showSearch ? "Back to chats" : "Search users"}
          >
            {showSearch ? "✕" : "🔍"}
          </button>
        </div>
      </div>

      {/* ── Section label ── */}
      <div style={{ padding: "14px 20px 6px", flexShrink: 0 }}>
        <p style={{
          fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "2px", color: "#55556a", fontFamily: "'Syne', sans-serif", margin: 0
        }}>
          {showSearch ? "Find People" : `Messages · ${conversations?.length ?? 0}`}
        </p>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {showSearch
          ? <UserSearch onSelectUser={handleSelectUser} />
          : <ConversationList conversations={conversations} />
        }
      </div>
    </div>
  );
}