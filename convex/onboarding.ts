import { query } from "./_generated/server";
import { v } from "convex/values";

export const isUserOnboarded = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const onboardedUser = await ctx.db.query("onboardedUser").withIndex("by_userId", q => q.eq("userId", args.userId)).first();
    return onboardedUser !== null;
  },
});