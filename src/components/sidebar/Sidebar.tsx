"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useUser, UserButton } from "@clerk/nextjs";
import ConversationList from "./ConversationList";
import UserSearch from "./UserSearch";

export default function Sidebar() {
  const [showSearch, setShowSearch] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const activeConversationId = params?.conversationId as string | undefined;
  const conversations = useQuery(api.conversations.getMyConversations);
  const getOrCreate = useMutation(api.conversations.getOrCreateConversation);

  const handleSelectUser = async (userId: Id<"users">) => {
    const convId = await getOrCreate({ otherUserId: userId });
    setShowSearch(false);
    router.push(`/chat/${convId}`);
  };

  return (
    <div
      className="w-80 min-w-[320px] flex-shrink-0 flex flex-col h-screen"
      style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-4 flex items-center justify-between gap-2"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Left: avatar + name + status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <UserButton afterSignOutUrl="/sign-in" />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 pointer-events-none"
              style={{ background: "var(--online)", borderColor: "var(--bg-secondary)" }}
            />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold truncate leading-none mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.firstName ?? "You"}
            </p>
            <p
              className="text-xs font-medium leading-none"
              style={{ color: "var(--online)" }}
            >
              ● Active now
            </p>
          </div>
        </div>

        {/* Right: search button */}
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: showSearch ? "var(--accent)" : "var(--accent-soft)",
            color: showSearch ? "white" : "var(--accent)",
            border: "1px solid rgba(124,106,255,0.3)",
          }}
        >
          {showSearch ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </>
          )}
        </button>
      </div>

      {/* Title - only when not searching */}
      {!showSearch && (
        <div className="px-5 pt-5 pb-2">
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Messages
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {conversations?.length ?? 0} conversation{conversations?.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Content */}
      {showSearch ? (
        <UserSearch onSelectUser={handleSelectUser} />
      ) : (
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
        />
      )}
    </div>
  );
}