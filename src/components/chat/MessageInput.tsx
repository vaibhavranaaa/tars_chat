"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export default function MessageInput({ conversationId }: { conversationId: Id<"conversations"> }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(false);
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.typing.setTyping);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTyping = (value: string) => {
    setText(value);
    setTyping({ conversationId, isTyping: true });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTyping({ conversationId, isTyping: false }), 2000);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    setError(false);
    try {
      await sendMessage({ conversationId, body: trimmed });
      setText("");
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      setTyping({ conversationId, isTyping: false });
    } catch {
      setError(true);
    } finally {
      setIsSending(false);
    }
  };

  const hasText = text.trim().length > 0;

  return (
    <div style={{
      padding: "12px 16px 14px", flexShrink: 0, position: "relative",
      background: "#0d0d14", borderTop: "1px solid rgba(255,255,255,0.06)"
    }}>
      {/* Top glow line */}
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.3), transparent)",
        pointerEvents: "none"
      }} />

      {error && (
        <div style={{ fontSize: "11px", color: "#ff6b6b", marginBottom: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
          <span>⚠️ Failed to send.</span>
          <button onClick={handleSend} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", textDecoration: "underline", fontSize: "11px" }}>Retry</button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <textarea
            rows={1}
            value={text}
            onChange={e => handleTyping(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type a message..."
            style={{
              width: "100%", padding: "12px 16px", borderRadius: "16px", resize: "none",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f0f0ff", fontSize: "14px", outline: "none",
              fontFamily: "'DM Sans', sans-serif", minHeight: "46px", maxHeight: "120px",
              lineHeight: "1.5", overflowY: "auto", transition: "all 0.2s",
              boxSizing: "border-box"
            }}
            onFocus={e => {
              e.target.style.borderColor = "rgba(108,99,255,0.5)";
              e.target.style.background = "rgba(108,99,255,0.06)";
              e.target.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.08)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "rgba(255,255,255,0.08)";
              e.target.style.background = "rgba(255,255,255,0.04)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!hasText || isSending}
          style={{
            width: "46px", height: "46px", borderRadius: "14px", border: "none",
            background: hasText && !isSending
              ? "linear-gradient(135deg, #6c63ff, #a78bfa)"
              : "rgba(255,255,255,0.04)",
            cursor: hasText && !isSending ? "pointer" : "not-allowed",
            fontSize: "18px", flexShrink: 0, transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hasText && !isSending ? 1 : 0.3,
            boxShadow: hasText && !isSending ? "0 0 20px rgba(108,99,255,0.4)" : "none",
            transform: hasText && !isSending ? "scale(1)" : "scale(0.95)"
          }}
          onMouseEnter={e => {
            if (hasText && !isSending)
              (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = hasText && !isSending ? "scale(1)" : "scale(0.95)";
          }}
        >➤</button>
      </div>

      <p style={{ fontSize: "10px", color: "#2a2a3a", textAlign: "center", margin: "8px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}