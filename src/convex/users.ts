import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get current logged-in user from DB
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

// Get all users except current user, with optional search
export const getAllUsers = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, { search }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return [];

    let users = await ctx.db.query("users").collect();

    // Exclude self
    users = users.filter((u) => u._id.toString() !== currentUser._id.toString());


    // Filter by search term
    if (search && search.trim()) {
      const lower = search.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(lower));
    }

    return users;
  },
});

// Get a single user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// Create or update user — called from Clerk webhook
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      ...args,
      isOnline: false,
      lastSeen: Date.now(),
    });
  },
});

// Set online/offline status
export const setOnlineStatus = mutation({
  args: { isOnline: v.boolean() },
  handler: async (ctx, { isOnline }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        isOnline,
        lastSeen: Date.now(),
      });
    }
  },
});