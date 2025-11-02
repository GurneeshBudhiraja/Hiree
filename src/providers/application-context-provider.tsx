"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { onAuthStateChange } from "@/lib/auth";

export type UserInfo = {
  userId: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
};

export type ApplicationContextType = {
  userInfo: UserInfo | null;
  setUserInfo: Dispatch<SetStateAction<UserInfo | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export function useApplicationContext() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplicationContext must be used within ApplicationContextProvider"
    );
  }
  return context;
}

export default function ApplicationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync Firebase auth state with context
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUserInfo(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const applicationContextValue = useMemo(
    () => ({
      userInfo,
      setUserInfo,
      isLoading,
      setIsLoading,
    }),
    [userInfo, isLoading]
  );
  return (
    <ApplicationContext.Provider value={applicationContextValue}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            <p className="text-white text-lg font-medium">Loading...</p>
          </div>
        </div>
      )}
    </ApplicationContext.Provider>
  );
}
