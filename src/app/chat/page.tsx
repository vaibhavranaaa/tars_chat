"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export default function ChatPage() {
  const { user } = useUser();
  const conversations = useQuery(api.conversations.getMyConversations);

  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0a0a0f", height: "100%", position: "relative", overflow: "hidden"
    }}>

      {/* Animated orbs */}
      <div style={{
        position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 65%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        animation: "pulse 6s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
        top: "10%", right: "15%", animation: "float1 9s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", width: "200px", height: "200px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,211,160,0.05) 0%, transparent 70%)",
        bottom: "15%", left: "10%", animation: "float2 11s ease-in-out infinite"
      }} />

      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)"
      }} />

      {/* Floating dots */}
      {[
        { size: 4, top: "20%", left: "20%", delay: "0s", dur: "7s" },
        { size: 6, top: "70%", left: "75%", delay: "1s", dur: "9s" },
        { size: 3, top: "40%", left: "85%", delay: "2s", dur: "6s" },
        { size: 5, top: "80%", left: "30%", delay: "0.5s", dur: "8s" },
        { size: 4, top: "15%", left: "60%", delay: "1.5s", dur: "10s" },
      ].map((dot, i) => (
        <div key={i} style={{
          position: "absolute", width: `${dot.size}px`, height: `${dot.size}px`,
          borderRadius: "50%", background: "#6c63ff", opacity: 0.25,
          top: dot.top, left: dot.left,
          animation: `float1 ${dot.dur} ease-in-out infinite`,
          animationDelay: dot.delay
        }} />
      ))}

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "480px", padding: "32px" }}>

        {/* Avatar with ring */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: "24px" }}>
          <div style={{
            position: "absolute", inset: "-8px", borderRadius: "50%",
            background: "linear-gradient(135deg, #6c63ff, #22d3a0)",
            opacity: 0.3, animation: "spin 8s linear infinite"
          }} />
          <div style={{
            width: "80px", height: "80px", borderRadius: "28px", background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "36px", position: "relative",
            boxShadow: "0 0 60px rgba(108,99,255,0.4), 0 0 120px rgba(108,99,255,0.15)"
          }}>⚡</div>
        </div>

        {/* Greeting */}
        <h1 style={{
          fontSize: "32px", fontWeight: 800, margin: "0 0 8px",
          fontFamily: "'Syne', sans-serif", letterSpacing: "-0.8px",
          background: "linear-gradient(135deg, #f0f0ff 0%, #a78bfa 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Welcome back{user?.firstName ? `,` : "!"}
        </h1>
        {user?.firstName && (
          <h2 style={{
            fontSize: "28px", fontWeight: 800, margin: "0 0 14px",
            fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px",
            color: "#6c63ff"
          }}>{user.firstName}! 👋</h2>
        )}

        <p style={{
          fontSize: "14px", color: "#55556a", margin: "0 0 32px",
          lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif"
        }}>
          {conversations?.length
            ? `You have ${conversations.length} conversation${conversations.length > 1 ? "s" : ""}. Pick up where you left off.`
            : "No conversations yet. Search for someone to start chatting!"}
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          {[
            { value: conversations?.length ?? 0, label: "Chats", icon: "💬" },
            { value: conversations?.filter(c => c.otherUser?.isOnline).length ?? 0, label: "Online", icon: "🟢" },
            { value: conversations?.reduce((acc, c) => acc + c.unreadCount, 0) ?? 0, label: "Unread", icon: "📬" },
          ].map(({ value, label, icon }) => (
            <div key={label} style={{
              flex: 1, padding: "16px 8px", borderRadius: "16px",
              background: "#111118", border: "1px solid rgba(255,255,255,0.06)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"
            }}>
              <span style={{ fontSize: "18px" }}>{icon}</span>
              <span style={{ fontSize: "22px", fontWeight: 800, color: "#f0f0ff", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{value}</span>
              <span style={{ fontSize: "10px", color: "#55556a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "⚡", label: "< 100ms latency" },
            { icon: "🔒", label: "256-bit encrypted" },
            { icon: "🌐", label: "99.9% uptime" },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "999px",
              background: "#111118", border: "1px solid rgba(255,255,255,0.06)",
              fontSize: "12px", color: "#8888aa", fontFamily: "'DM Sans', sans-serif"
            }}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Powered by */}
        <p style={{ fontSize: "11px", color: "#2a2a3a", marginTop: "28px", fontFamily: "'DM Sans', sans-serif" }}>
          Powered by <span style={{ color: "#6c63ff" }}>Convex</span> — updates in real time
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(15px, -20px); }
          66% { transform: translate(-10px, 10px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, -15px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}