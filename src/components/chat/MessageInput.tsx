"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

type Props = { conversationId: Id<"conversations"> };

export default function MessageInput({ conversationId }: Props) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.typing.setTyping);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (value: string) => {
    setBody(value);
    setError(false);
    setTyping({ conversationId, isTyping: true });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping({ conversationId, isTyping: false });
    }, 2000);
  };

  const handleSend = async () => {
    const trimmed = body.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError(false);
    try {
      await sendMessage({ conversationId, body: trimmed });
      setBody("");
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      setTyping({ conversationId, isTyping: false });
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-4 flex-shrink-0"
      style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
      {error && (
        <div className="mb-2 px-3 py-2 rounded-xl text-xs flex items-center justify-between"
          style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
          <span>Failed to send message</span>
          <button onClick={handleSend} className="underline ml-2">Retry</button>
        </div>
      )}
      <div className="flex items-end gap-3">
        <textarea
          value={body}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none px-4 py-3 rounded-2xl text-sm outline-none leading-relaxed"
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            minHeight: "48px",
            maxHeight: "128px",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!body.trim() || sending}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
          style={{
            background: body.trim() && !sending ? "var(--accent)" : "var(--bg-tertiary)",
            color: body.trim() && !sending ? "white" : "var(--text-secondary)",
          }}
        >
          {sending ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}