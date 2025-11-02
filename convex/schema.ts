import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  onboardedUser: defineTable({
    userId: v.string(),
    parsedResume: v.string(),
    targetJobTitle: v.array(v.string()),
    jobLocation: v.string(),
  }).index("by_userId", ["userId"]),
});