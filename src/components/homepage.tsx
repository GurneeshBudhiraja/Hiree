"use client";
import { useApplicationContext } from "@/providers/application-context-provider";
import SignInWithGoogle from "./sign-in-with-google";
import { LayoutDashboard, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { signInWithGoogle as firebaseSignIn, signOutUser } from "@/lib/auth";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

function Homepage() {
  const { userInfo, setUserInfo, setIsLoading, isLoading } =
    useApplicationContext();
  const convex = useConvex();
  const router = useRouter();
  const handleGoToDashboard = async () => {
    try {
      if (!userInfo) return;
      const isOnboarded = await convex.query(api.onboarding.isUserOnboarded, {
        userId: userInfo.userId,
      });
      if (!isOnboarded) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(
        "Error in `handleGoToDashboard` in homepage.tsx:",
        (error as Error).message
      );
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await firebaseSignIn();
      setUserInfo(user);
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOutUser();
      setUserInfo(null);
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-4">
      {userInfo && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          title="Logout"
        >
          <LogOut size={24} className="text-foreground" />
        </button>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="text-8xl font-bold font-theme-playfair text-transparent from-zinc-800 via-zinc-700 to-zinc-600 bg-linear-to-br bg-clip-text"
      >
        Hiree
      </motion.h1>
      <motion.p
        className="text-2xl text-center bg-linear-to-br bg-clip-text text-transparent from-zinc-800 via-zinc-700 to-zinc-600"
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
          // Handle go to dashboard button
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
