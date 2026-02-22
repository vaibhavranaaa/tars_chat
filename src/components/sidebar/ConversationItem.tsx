"use client";

import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatMessageTime } from "@/lib/utils";

interface Props {
  conversation: {
    _id: string;
    lastMessageTime: number;
    lastMessagePreview?: string;
    otherUser: {
      name: string;
      imageUrl?: string;
      isOnline: boolean;
    } | null;
    unreadCount: number;
  };
}

export default function ConversationItem({ conversation }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === `/chat/${conversation._id}`;
  const { otherUser, lastMessageTime, lastMessagePreview, unreadCount } =
    conversation;

  if (!otherUser) return null;

  return (
    <button
      onClick={() => router.push(`/chat/${conversation._id}`)}
      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition w-full text-left ${
        isActive ? "bg-blue-50 border-r-2 border-blue-500" : ""
      }`}
    >
      {/* Avatar with online dot */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage src={otherUser.imageUrl} />
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

      {/* Name + preview */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span
            className={`text-sm truncate ${
              unreadCount > 0
                ? "font-bold text-gray-900"
                : "font-semibold text-gray-700"
            }`}
          >
            {otherUser.name}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
            {formatMessageTime(lastMessageTime)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <p
            className={`text-xs truncate ${
              unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-400"
            }`}
          >
            {lastMessagePreview ?? "No messages yet"}
          </p>
          {unreadCount > 0 && (
            <span className="ml-2 flex-shrink-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}