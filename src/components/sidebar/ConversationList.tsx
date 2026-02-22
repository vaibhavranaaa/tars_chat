"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ConversationItem from "./ConversationItem";

export default function ConversationList() {
  const conversations = useQuery(api.conversations.getMyConversations);

  // Loading skeleton
  if (conversations === undefined) {
    return (
      <div className="flex flex-col gap-1 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center px-6">
        <p className="text-4xl mb-3">👋</p>
        <p className="font-semibold text-gray-700">No conversations yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Use the 🔍 icon above to find someone to chat with!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conv) => (
        <ConversationItem key={conv._id} conversation={conv} />
      ))}
    </div>
  );
}