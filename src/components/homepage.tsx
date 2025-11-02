"use client";
import { useApplicationContext } from "@/providers/application-context-provider";
import SignInWithGoogle from "./sign-in-with-google";
import { LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";
import { signInWithGoogle as firebaseSignIn } from "@/lib/auth";

function Homepage() {
  const { userInfo, setUserInfo, setIsLoading, isLoading } =
    useApplicationContext();

  const handleGoToDashboard = () => {
    console.log("Current Context:", {
      userInfo,
      isLoading,
    });
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await firebaseSignIn();
      setUserInfo(user);
    } catch (error) {
      console.error("Sign in failed:", error);
      // You can add toast notification here for error handling
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="text-8xl font-bold font-theme-playfair text-transparent from-zinc-100 via-zinc-300 to-zinc-500 bg-linear-to-br bg-clip-text"
      >
        Hiree
      </motion.h1>
      <motion.p
        className="text-2xl text-center bg-linear-to-br bg-clip-text text-transparent from-zinc-100 via-zinc-300 to-zinc-500"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
      >
        Hiree finds your jobs. Tailors your resume. You just apply.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut", delay: 0.2 }}
      >
        {!userInfo ? (
          <SignInWithGoogle onClick={handleSignIn} disabled={isLoading} />
        ) : (
          <button className="gsi-material-button" onClick={handleGoToDashboard}>
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <LayoutDashboard size={20} />
              </div>
              <span className="gsi-material-button-contents">
                Go to Dashboard
              </span>
              <span style={{ display: "none" }}>Go to Dashboard</span>
            </div>
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default Homepage;
