"use client";
import { useApplicationContext } from "@/providers/application-context-provider";
import SignInWithGoogle from "./sign-in-with-google";
import { LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

function Homepage() {
  const { userInfo, setUserInfo } = useApplicationContext();
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
          <SignInWithGoogle
            onClick={() => {
              // TODO: implement sign in with google functionality
              setUserInfo({
                email: "",
                name: "",
                id: "",
                isAuthenticated: true,
              });
            }}
          />
        ) : (
          <button
            className="gsi-material-button"
            onClick={() => {
              // TODO: redirect the user to the dashboard if the onboarding has been completed otherwise redirect to the onboarding page
            }}
          >
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
