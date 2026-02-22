import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    isOnline: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  conversations: defineTable({
    participantIds: v.array(v.id("users")),
    lastMessageTime: v.number(),
    lastMessagePreview: v.optional(v.string()),
  }).index("by_last_message_time", ["lastMessageTime"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    body: v.string(),
    deletedAt: v.optional(v.number()),
    reactions: v.optional(
      v.array(
        v.object({
          emoji: v.string(),
          userId: v.id("users"),
        })
      )
    ),
  }).index("by_conversation", ["conversationId"]),

  typingIndicators: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    updatedAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_user", ["conversationId", "userId"]),

  messageReads: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    lastReadTime: v.number(),
  }).index("by_conversation_user", ["conversationId", "userId"]),
});