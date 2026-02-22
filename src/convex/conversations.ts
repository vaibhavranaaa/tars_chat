import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all conversations for the current user
export const getMyConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return [];

    const allConversations = await ctx.db.query("conversations").collect();

    // Only conversations where current user is a participant
    const myConversations = allConversations.filter((c) =>
      c.participantIds.includes(currentUser._id)
    );

    // Sort newest first
    myConversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    // Enrich with other user info + unread count
    const enriched = await Promise.all(
      myConversations.map(async (conv) => {
        const otherUserId = conv.participantIds.find(
          (id) => id !== currentUser._id
        )!;
        const otherUser = await ctx.db.get(otherUserId);

        // Get last read time for current user
        const readRecord = await ctx.db
          .query("messageReads")
          .withIndex("by_conversation_user", (q) =>
            q.eq("conversationId", conv._id).eq("userId", currentUser._id)
          )
          .unique();

        const lastReadTime = readRecord?.lastReadTime ?? 0;

        // Count unread messages
        const allMessages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conv._id)
          )
          .collect();

        const unreadCount = allMessages.filter(
          (m) =>
            m._creationTime > lastReadTime && m.senderId !== currentUser._id
        ).length;

        return {
          ...conv,
          otherUser,
          unreadCount,
        };
      })
    );

    return enriched;
  },
});

// Get or create a DM conversation between two users
export const getOrCreateConversation = mutation({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, { otherUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    // Check if a conversation already exists between these two users
    const all = await ctx.db.query("conversations").collect();
    const existing = all.find(
      (c) =>
        c.participantIds.length === 2 &&
        c.participantIds.includes(currentUser._id) &&
        c.participantIds.includes(otherUserId)
    );

    if (existing) return existing._id;

    // Create a new conversation
    return await ctx.db.insert("conversations", {
      participantIds: [currentUser._id, otherUserId],
      lastMessageTime: Date.now(),
      lastMessagePreview: undefined,
    });
  },
});

// Get a single conversation with participant info
export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return null;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return null;

    // Make sure current user is a participant
    if (!conversation.participantIds.includes(currentUser._id)) return null;

    const otherUserId = conversation.participantIds.find(
      (id) => id !== currentUser._id
    )!;
    const otherUser = await ctx.db.get(otherUserId);

    return { ...conversation, otherUser, currentUser };
  },
});

// Mark all messages in a conversation as read
export const markAsRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return;

    const existing = await ctx.db
      .query("messageReads")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", conversationId).eq("userId", currentUser._id)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { lastReadTime: Date.now() });
    } else {
      await ctx.db.insert("messageReads", {
        conversationId,
        userId: currentUser._id,
        lastReadTime: Date.now(),
      });
    }
  },
});