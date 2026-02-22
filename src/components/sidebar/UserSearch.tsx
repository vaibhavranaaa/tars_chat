"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function UserSearch() {
  const [search, setSearch] = useState("");
  const users = useQuery(api.users.getAllUsers, { search });
  const getOrCreate = useMutation(api.conversations.getOrCreateConversation);
  const router = useRouter();

  const handleUserClick = async (userId: Id<"users">) => {
    const convId = await getOrCreate({ otherUserId: userId });
    router.push(`/chat/${convId}`);
  };

  return (
    <div className="p-3 flex flex-col gap-2">
      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />

      {/* Loading */}
      {users === undefined && (
        <div className="flex flex-col gap-2 mt-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {users?.length === 0 && (
        <div className="text-center py-6">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm text-gray-500">No users found.</p>
        </div>
      )}

      {/* User list */}
      {users?.map((user) => (
        <button
          key={user._id}
          onClick={() => handleUserClick(user._id)}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition text-left w-full"
        >
          <div className="relative flex-shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                user.isOnline ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-400">
              {user.isOnline ? "🟢 Online" : "⚫ Offline"}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}