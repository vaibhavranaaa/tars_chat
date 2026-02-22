"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ChatArea({
  conversationId,
}: {
  conversationId: string;
}) {
  const convId = conversationId as Id<"conversations">;
  const conversation = useQuery(api.conversations.getConversation, {
    conversationId: convId,
  });
  const markAsRead = useMutation(api.conversations.markAsRead);
  const router = useRouter();

  // Mark as read whenever this conversation is opened
  useEffect(() => {
    if (conversation) {
      markAsRead({ conversationId: convId });
    }
  }, [conversationId, conversation, markAsRead, convId]);

  // Loading state
  if (conversation === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Not found
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Conversation not found.
      </div>
    );
  }

  const { otherUser } = conversation;

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
        {/* Back button for mobile */}
        <button
          onClick={() => router.push("/chat")}
          className="md:hidden p-1 rounded-full hover:bg-gray-100 mr-1"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {otherUser && (
          <>
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherUser.imageUrl ?? undefined} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {otherUser.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  otherUser.isOnline ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{otherUser.name}</p>
              <p className="text-xs text-gray-400">
                {otherUser.isOnline ? "🟢 Online" : "⚫ Offline"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <MessageList conversationId={convId} />

      {/* Typing indicator */}
      <TypingIndicator conversationId={convId} />

      {/* Message input */}
      <MessageInput conversationId={convId} />
    </div>
  );
}