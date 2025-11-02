"use client";
import { useApplicationContext } from "@/providers/application-context-provider";
import { useConvex } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";

function DashboardPage() {
  const { userInfo } = useApplicationContext();
  const convex = useConvex();
  return (
    <div>
      <button
        onClick={async () => {
          if (!userInfo) return;
          const onboardingInfo = await convex.query(
            api.onboarding.getUserOnboardingInfo,
            {
              userId: userInfo?.userId,
            }
          );
          console.log(onboardingInfo);
          const userWorkflow = await convex.query(
            api.workflow.getUserWorkflow,
            {
              userId: userInfo?.userId,
            }
          );
          console.log(userWorkflow);
        }}
      >
        Click me
      </button>
    </div>
  );
}

export default DashboardPage;

