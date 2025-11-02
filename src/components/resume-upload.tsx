"use client";
import { useState, useRef, useMemo, Dispatch, SetStateAction } from "react";
import { WandSparkles, Check, FileText, Sparkle } from "lucide-react";
import { OnboardingInfo } from "@/app/onboarding/page";
import { geminiParseResume } from "@/lib/gemini/index";
import { useApplicationContext } from "@/providers/application-context-provider";

export default function ResumeUpload({
  setOnboardingInfo,
  onboardingInfo,
}: {
  setOnboardingInfo: Dispatch<SetStateAction<OnboardingInfo | null>>;
  onboardingInfo: OnboardingInfo | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeUploaded = onboardingInfo?.resumeUploaded ?? false;
  const fileName = onboardingInfo?.fileName;
  const { setError } = useApplicationContext();

  // Generate sparkle positions when loading starts (fixed positions for stability)
  const sparklePositions = useMemo(() => {
    if (!isLoading) return [];
    // Fixed positions based on index for stable rendering
    return Array.from({ length: 8 }, (_, i) => ({
      top: ((i * 12 + 15) % 80) + 10,
      left: ((i * 17 + 20) % 80) + 10,
    }));
  }, [isLoading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64DataUrl = reader.result as string;

      // Extract base64 string (remove data URL prefix)
      const base64String = base64DataUrl.split(",")[1] || base64DataUrl;

      try {
        // Call Gemini API to parse resume and update the state with the parsed resume content
        const parsedResumeContent = await geminiParseResume(base64String);

        if (!parsedResumeContent) {
          setError("Failed to parse resume. Please try again.");
          // Reset state so user can try again
          setOnboardingInfo(null);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setIsLoading(false);
          return;
        }

        setOnboardingInfo({
          resumeUploaded: true,
          parsedResumeContent,
          targetJobTitles: onboardingInfo?.targetJobTitles || [],
          jobLocation: onboardingInfo?.jobLocation || "",
          fileName: file.name,
        });
      } catch (error) {
        setError("Failed to parse resume. Please try again.");
        // Reset state so user can try again
        setOnboardingInfo(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        console.error("Error parsing resume:", error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative bg-card border border-border rounded-lg p-6 flex items-center gap-4 w-full max-w-2xl overflow-hidden">
      {/* Sparkle animation overlay during loading */}
      {isLoading && (
        <div className="absolute inset-0 pointer-events-none">
          {sparklePositions.map((pos, i) => (
            <Sparkle
              key={i}
              className="absolute w-4 h-4 text-blue-400 opacity-0 animate-pulse"
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </div>
      )}

      <WandSparkles
        className={`w-6 h-6 text-foreground shrink-0 ${
          isLoading ? "animate-pulse" : ""
        }`}
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-foreground mb-1">
          Autofill from resume
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload your resume here to send it to AI for parsing.
        </p>

        {resumeUploaded && fileName && !isLoading && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
            <Check className="w-4 h-4 text-green-500 shrink-0" />
            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{fileName}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="px-4 py-2 bg-background border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            Parsing...
          </span>
        ) : resumeUploaded ? (
          "Change file"
        ) : (
          "Upload file"
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
