"use client";
import ResumeUpload from "@/components/resume-upload";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, MapPin, Home, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useApplicationContext } from "@/providers/application-context-provider";

export type OnboardingInfo = {
  resumeUploaded: boolean;
  parsedResumeContent: string;
  fileName: string;
  targetJobTitles: string[];
  jobLocation: string;
};

function OnboardingPage() {
  const [onboardingInfo, setOnboardingInfo] = useState<OnboardingInfo | null>(
    null
  );
  const { userInfo, setError } = useApplicationContext();
  const convex = useConvex();
  const [currentJobTitleInput, setCurrentJobTitleInput] = useState("");
  const router = useRouter();
  const resumeUploaded = onboardingInfo?.resumeUploaded ?? false;

  const handleJobTitleChange = (value: string) => {
    setCurrentJobTitleInput(value);
  };

  const handleJobTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedValue = currentJobTitleInput.trim();
      if (trimmedValue) {
        setOnboardingInfo((prev) => ({
          ...prev!,
          targetJobTitles: [...(prev?.targetJobTitles || []), trimmedValue],
        }));
        setCurrentJobTitleInput("");
      }
    }
  };

  const removeJobTitle = (index: number) => {
    setOnboardingInfo((prev) => ({
      ...prev!,
      targetJobTitles:
        prev?.targetJobTitles.filter((_, i) => i !== index) || [],
    }));
  };

  // saves the data to the convex database
  const handleFinishSetup = async () => {
    if (!onboardingInfo) {
      console.log("❌ No onboarding info found");
      return;
    }

    if (!userInfo) {
      console.log("❌ No user info found");
      return;
    }

    const onboardingUser = await convex.mutation(
      api.onboarding.completeUserOnboarding,
      {
        jobLocation: onboardingInfo.jobLocation,
        parsedResume: onboardingInfo.parsedResumeContent,
        targetJobTitle: onboardingInfo.targetJobTitles,
        userId: userInfo.userId,
      }
    );
    if (!onboardingUser) {
      console.log("❌ Failed to complete user onboarding");
      setError("Failed to complete user onboarding");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Home"
          >
            <Home className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">Onboarding</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Let&apos;s get you onboarded! Upload your resume to get started.
        </p>

        <div className="relative">
          {!resumeUploaded ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center py-20"
            >
              <ResumeUpload
                setOnboardingInfo={setOnboardingInfo}
                onboardingInfo={onboardingInfo}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ResumeUpload
                  setOnboardingInfo={setOnboardingInfo}
                  onboardingInfo={onboardingInfo}
                />
              </motion.div>

              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Target Job Titles
                    </label>
                    <div className="w-full min-h-[48px] px-4 py-2 bg-card border border-border rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all flex flex-wrap gap-2 items-center">
                      {onboardingInfo?.targetJobTitles.map((title, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm text-foreground"
                        >
                          {title}
                          <button
                            onClick={() => removeJobTitle(index)}
                            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={
                          onboardingInfo?.targetJobTitles.length === 0
                            ? "e.g., Software Engineer, Product Manager"
                            : "Add another title..."
                        }
                        value={currentJobTitleInput}
                        onChange={(e) => handleJobTitleChange(e.target.value)}
                        onKeyDown={handleJobTitleKeyDown}
                        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Job Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., San Francisco, CA or Remote"
                      value={onboardingInfo?.jobLocation || ""}
                      onChange={(e) =>
                        setOnboardingInfo((prev) => ({
                          ...prev!,
                          jobLocation: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {resumeUploaded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <button
                    onClick={handleFinishSetup}
                    className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
                  >
                    Finish Setup
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
