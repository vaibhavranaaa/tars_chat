import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Set or clear typing indicator for current user
export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, { conversationId, isTyping }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return;

    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", conversationId).eq("userId", currentUser._id)
      )
      .unique();

    if (isTyping) {
      if (existing) {
        // Refresh the timestamp so it stays alive
        await ctx.db.patch(existing._id, { updatedAt: Date.now() });
      } else {
        await ctx.db.insert("typingIndicators", {
          conversationId,
          userId: currentUser._id,
          updatedAt: Date.now(),
        });
      }
    } else {
      if (existing) await ctx.db.delete(existing._id);
    }
  },
});

// Get list of users currently typing in a conversation (excluding self)
export const getTypingUsers = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return [];

    // Only show typing indicators updated in the last 2 seconds
    const twoSecondsAgo = Date.now() - 2000;

    const typingRecords = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .collect();

    // Filter out stale records and self
    const active = typingRecords.filter(
      (t) => t.updatedAt > twoSecondsAgo && t.userId !== currentUser._id
    );

    const users = await Promise.all(active.map((t) => ctx.db.get(t.userId)));

    return users.filter(Boolean);
  },
});