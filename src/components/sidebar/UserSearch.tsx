"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

type Props = { onSelectUser: (userId: Id<"users">) => Promise<void>; };

export default function UserSearch({ onSelectUser }: Props) {
  const [search, setSearch] = useState("");
  const { user } = useUser();
  const users = useQuery(api.users.getAllUsers, {
    clerkId: user?.id ?? "",
    search,
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people..."
          autoFocus
          className="w-full px-3 py-2 rounded-xl text-sm outline-none"
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {users === undefined && (
          <div className="space-y-2 p-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: "var(--bg-tertiary)" }} />
                <div className="h-3 rounded w-1/2" style={{ background: "var(--bg-tertiary)" }} />
              </div>
            ))}
          </div>
        )}

        {users?.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No users found</p>
          </div>
        )}

        {users?.map((u) => (
          <button
            key={u._id}
            onClick={() => onSelectUser(u._id)}
            className="w-full px-3 py-3 flex items-center gap-3 rounded-xl mb-1 transition-all text-left"
            style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
          >
            <div className="relative flex-shrink-0 w-10 h-10 overflow-hidden rounded-xl">
  {u.imageUrl && (
    <img
      src={u.imageUrl}
      alt={u.name}
      className="absolute inset-0 w-full h-full object-cover"
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.nextElementSibling?.removeAttribute("hidden");
      }}
    />
  )}

  <div
    hidden={!!u.imageUrl}
    className="absolute inset-0 flex items-center justify-center font-bold"
    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
  >
    {u.name[0]?.toUpperCase()}
  </div>

  {u.isOnline && (
    <span
      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
      style={{ background: "var(--online)", borderColor: "var(--bg-secondary)" }}
    />
  )}
</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{u.name}</p>
              <p className="text-xs" style={{ color: u.isOnline ? "var(--online)" : "var(--text-secondary)" }}>
                {u.isOnline ? "● Online" : "Offline"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}