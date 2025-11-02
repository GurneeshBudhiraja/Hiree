// contains all the functions related to the agent workflow

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserWorkflow = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userWorkflow = await ctx.db.query("userWorkflow").withIndex("by_userId", q => q.eq("userId", args.userId)).first();
      console.log("👤 `getUserWorkflow` result:", userWorkflow);
      if (!userWorkflow) return null;
      return userWorkflow;
    } catch (error) {
      console.log("⚠️ Error in `getUserWorkflow` in workflow.ts:", (error as Error).message);
      return false;
    }
  },
});


/**
 * Updates whether the default workflow should be shown for a user
 */
export const setDefaultWorkflow = mutation({
  args: {
    userId: v.string(),
    showDefaultWorkflow: v.boolean(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("👤 setting default workflow in `setDefaultWorkflow`...");
      const userWorkflow = await ctx.db.insert("userWorkflow", {
        userId: args.userId,
        showDefaultWorkflow: args.showDefaultWorkflow,
      });
      return userWorkflow;
    } catch (error) {
      console.log("⚠️ Error in `setDefaultWorkflow` in workflow.ts:", (error as Error).message);
      return null;
    }
  }
});