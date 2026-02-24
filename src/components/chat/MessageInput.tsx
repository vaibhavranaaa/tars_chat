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

  return (
    <div style={{
      padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.07)",
      background: "#111118", flexShrink: 0
    }}>
      {error && (
        <div style={{ fontSize: "12px", color: "#ff6b6b", marginBottom: "8px", display: "flex", gap: "8px" }}>
          <span>Failed to send.</span>
          <button onClick={handleSend} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", textDecoration: "underline" }}>Retry</button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
        <textarea
          rows={1}
          value={text}
          onChange={e => handleTyping(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Type a message..."
          style={{
            flex: 1, padding: "12px 16px", borderRadius: "16px", resize: "none",
            background: "#1a1a24", border: "1px solid rgba(255,255,255,0.07)",
            color: "#f0f0ff", fontSize: "14px", outline: "none",
            fontFamily: "'DM Sans', sans-serif", minHeight: "46px", maxHeight: "120px",
            lineHeight: "1.5", overflowY: "auto", transition: "border-color 0.2s"
          }}
          onFocus={e => (e.target.style.borderColor = "#6c63ff")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isSending}
          style={{
            width: "46px", height: "46px", borderRadius: "14px", border: "none",
            background: text.trim() && !isSending ? "#6c63ff" : "#1a1a24",
            cursor: text.trim() && !isSending ? "pointer" : "not-allowed",
            fontSize: "18px", flexShrink: 0, transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: text.trim() && !isSending ? 1 : 0.4
          }}
        >➤</button>
      </div>
      <p style={{ fontSize: "10px", color: "#55556a", textAlign: "center", margin: "8px 0 0" }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}