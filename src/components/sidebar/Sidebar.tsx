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

  const onlineCount = conversations?.filter(c => c.otherUser?.isOnline).length ?? 0;
  const unreadCount = conversations?.reduce((acc, c) => acc + c.unreadCount, 0) ?? 0;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%", width: "100%",
      background: "#0d0d14", borderRight: "1px solid rgba(255,255,255,0.06)",
      fontFamily: "'DM Sans', sans-serif", overflow: "hidden", position: "relative"
    }}>

      {/* Subtle top glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "200px",
        background: "radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />

      {/* ── Header ── */}
      <div style={{
        padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0, position: "relative", zIndex: 1
      }}>

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "9px",
              background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "15px", boxShadow: "0 0 16px rgba(108,99,255,0.3)"
            }}>⚡</div>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "15px", color: "#f0f0ff", letterSpacing: "-0.3px"
            }}>TarsChat</span>
          </div>

          {/* Unread badge */}
          {unreadCount > 0 && (
            <div style={{
              background: "#6c63ff", color: "white", fontSize: "10px",
              fontWeight: 700, padding: "2px 7px", borderRadius: "999px",
              fontFamily: "'Syne', sans-serif"
            }}>{unreadCount} new</div>
          )}
        </div>

        {/* User card */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 12px", borderRadius: "14px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
            <div style={{ position: "relative", flexShrink: 0, width: "34px", height: "34px" }}>
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{ elements: { avatarBox: { width: "34px", height: "34px" } } }}
              />
              <span style={{
                position: "absolute", bottom: "-1px", right: "-1px",
                width: "10px", height: "10px", borderRadius: "50%",
                background: "#22d3a0", border: "2px solid #0d0d14", pointerEvents: "none"
              }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: "13px", fontWeight: 600, color: "#f0f0ff", margin: 0,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                fontFamily: "'Syne', sans-serif"
              }}>{currentUser?.name ?? "..."}</p>
              <p style={{ fontSize: "11px", color: "#22d3a0", margin: "2px 0 0" }}>
                ● Active now
              </p>
            </div>
          </div>

          {/* Toggle search */}
          <button
            onClick={() => setShowSearch(v => !v)}
            style={{
              width: "32px", height: "32px", borderRadius: "9px", flexShrink: 0,
              background: showSearch ? "#6c63ff" : "rgba(255,255,255,0.05)",
              border: `1px solid ${showSearch ? "#6c63ff" : "rgba(255,255,255,0.08)"}`,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "14px", transition: "all 0.2s",
              boxShadow: showSearch ? "0 0 12px rgba(108,99,255,0.4)" : "none"
            }}
            title={showSearch ? "Back to chats" : "Find users"}
          >{showSearch ? "✕" : "🔍"}</button>
        </div>

        {/* Stats row */}
        {!showSearch && (
          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
            {[
              { label: "Chats", value: conversations?.length ?? 0, color: "#6c63ff" },
              { label: "Online", value: onlineCount, color: "#22d3a0" },
              { label: "Unread", value: unreadCount, color: "#a78bfa" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                flex: 1, padding: "8px 6px", borderRadius: "10px", textAlign: "center",
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)"
              }}>
                <p style={{ fontSize: "16px", fontWeight: 800, color, margin: 0, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "9px", color: "#55556a", margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section label ── */}
      <div style={{ padding: "14px 16px 4px", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <p style={{
          fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "2px", color: "#2e2e3e", fontFamily: "'Syne', sans-serif", margin: 0
        }}>
          {showSearch ? "🔍 Find People" : "💬 Messages"}
        </p>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative", zIndex: 1 }}>
        {showSearch
          ? <UserSearch onSelectUser={handleSelectUser} />
          : <ConversationList conversations={conversations} />
        }
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.04)",
        flexShrink: 0, textAlign: "center"
      }}>
        <p style={{ fontSize: "10px", color: "#1e1e2e", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          Powered by <span style={{ color: "#3a3a5a" }}>Convex</span> · Real-time
        </p>
      </div>
    </div>
  );
}