import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Checks if a user is onboarded
 */
export const isUserOnboarded = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const onboardedUser = await ctx.db.query("onboardedUser").withIndex("by_userId", q => q.eq("userId", args.userId)).first();
      console.log("👤 `isUserOnboarded` result:", onboardedUser);
      return onboardedUser !== null;
    } catch (error) {
      console.log("⚠️ Error in `isUserOnboarded` in onboarding.ts:", (error as Error).message);
      return false;
    }
  },
});



/**
 * Completes the user onboarding process
 */
export const completeUserOnboarding = mutation({
  args: {
    userId: v.string(),
    parsedResume: v.string(),
    targetJobTitle: v.array(v.string()),
    jobLocation: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("👤 completing user onboarding in `completeUserOnboarding`...");
      const onboardingUser = await ctx.db.insert("onboardedUser", args);
      return onboardingUser;
    } catch (error) {
      console.log("⚠️ Error in `completeUserOnboarding` in onboarding.ts:", (error as Error).message);
      return null;
    }
  },
});


/**
 * Retrieves the onboarding information for a user
 */
export const getUserOnboardingInfo = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const onboardingUser = await ctx.db.query("onboardedUser").withIndex("by_userId", q => q.eq("userId", args.userId)).first();
      console.log("👤 `getUserOnboardingInfo` result:", onboardingUser);
      if (!onboardingUser) return null;

      // Remove certain keys before returning. For example, let's exclude '_id' and '_creationTime'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, _creationTime, userId, ...rest } = onboardingUser;
      return rest;
    } catch (error) {
      console.log("⚠️ Error in `getUserOnboardingInfo` in onboarding.ts:", (error as Error).message);
      return null;
    }
  },
});



/**
 * Remove the onboarded user workflow
 */
export const removeUserOnboarding = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const onboardingUser = await ctx.db.query("onboardedUser").withIndex("by_userId", q => q.eq("userId", args.userId)).first();
      if (!onboardingUser) return null;
      await ctx.db.delete(onboardingUser._id);
      console.log("👤 removed onboarding user in `removeUserOnboarding`...");
      return true;
    } catch (error) {
      console.log("⚠️ Error in `removeUserOnboarding` in onboarding.ts:", (error as Error).message);
      return false;
    }
  },
});