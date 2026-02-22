"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Send } from "lucide-react";

export default function MessageInput({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.typing.setTyping);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTyping = (value: string) => {
    setText(value);
    setTyping({ conversationId, isTyping: true });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping({ conversationId, isTyping: false });
    }, 2000);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setSendError(false);

    try {
      await sendMessage({ conversationId, body: trimmed });
      setText("");
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      setTyping({ conversationId, isTyping: false });
    } catch {
      setSendError(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-white">
      {/* Error with retry */}
      {sendError && (
        <div className="flex items-center gap-2 mb-2 text-sm text-red-500">
          <span>Failed to send message.</span>
          <button
            onClick={handleSend}
            className="underline hover:text-red-700 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent max-h-32 overflow-auto leading-relaxed"
          style={{ minHeight: "44px" }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isSending}
          className="p-2.5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}