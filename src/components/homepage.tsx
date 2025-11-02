"use client";
import { useApplicationContext } from "@/providers/application-context-provider";
import SignInWithGoogle from "./sign-in-with-google";
import { LayoutDashboard } from "lucide-react";

function Homepage() {
  const { userInfo, setUserInfo } = useApplicationContext();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-8xl font-bold font-theme-playfair text-transparent from-zinc-100 via-zinc-300 to-zinc-500 bg-linear-to-br bg-clip-text">
        Hiree
      </h1>
      <p className="text-2xl text-center bg-linear-to-br bg-clip-text text-transparent from-zinc-100 via-zinc-300 to-zinc-500">
        Hiree finds your jobs. Tailors your resume. You just apply.
      </p>
      {!userInfo ? (
        <SignInWithGoogle
          onClick={() => {
            // TODO: implement sign in with google functionality
            setUserInfo({ email: "", name: "", id: "", isAuthenticated: true });
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
    </div>
  );
}

export default Homepage;
