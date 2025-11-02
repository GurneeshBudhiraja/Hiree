"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useContext,
} from "react";

export type UserInfo = {
  id: string;
  name: string;
  email: string;
};

export type ApplicationContextType = {
  userInfo: UserInfo | null;
  setUserInfo: Dispatch<SetStateAction<UserInfo | null>>;
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
  const applicationContextValue = useMemo(
    () => ({
      userInfo,
      setUserInfo,
    }),
    [userInfo]
  );
  return (
    <ApplicationContext.Provider value={applicationContextValue}>
      {children}
    </ApplicationContext.Provider>
  );
}
