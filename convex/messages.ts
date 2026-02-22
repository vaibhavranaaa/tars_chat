import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all messages in a conversation
export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("asc")
      .collect();

    // Attach sender info to each message
    const enriched = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return { ...msg, sender };
      })
    );

    return enriched;
  },
});

// Send a new message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    body: v.string(),
  },
  handler: async (ctx, { conversationId, body }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const messageId = await ctx.db.insert("messages", {
      conversationId,
      senderId: currentUser._id,
      body,
      reactions: [],
    });

    // Update the conversation's last message preview
    await ctx.db.patch(conversationId, {
      lastMessageTime: Date.now(),
      lastMessagePreview: body.slice(0, 50),
    });

    // Clear typing indicator when message is sent
    const typing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", conversationId).eq("userId", currentUser._id)
      )
      .unique();

    if (typing) await ctx.db.delete(typing._id);

    return messageId;
  },
});

// Soft delete a message (keeps record, just marks deletedAt)
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");
    if (message.senderId !== currentUser?._id)
      throw new Error("Cannot delete someone else's message");

    await ctx.db.patch(messageId, { deletedAt: Date.now() });
  },
});

// Toggle emoji reaction on a message
export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },
  handler: async (ctx, { messageId, emoji }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const message = await ctx.db.get(messageId);
    if (!message) throw new Error("Message not found");

    const reactions = [...(message.reactions ?? [])];
    const existingIndex = reactions.findIndex(
      (r) => r.emoji === emoji && r.userId === currentUser._id
    );

    if (existingIndex >= 0) {
      // Remove reaction if already reacted
      reactions.splice(existingIndex, 1);
    } else {
      // Add new reaction
      reactions.push({ emoji, userId: currentUser._id });
    }

    await ctx.db.patch(messageId, { reactions });
  },
});