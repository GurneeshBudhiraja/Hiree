import {
  signInWithPopup,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleAuthProvider } from "./firebase";
import type { UserInfo } from "@/providers/application-context-provider";

/**
 * Sign in with Google using Firebase Authentication
 * @returns Promise<UserInfo> - User information after successful sign-in
 * @throws Error if sign-in fails
*/
export async function signInWithGoogle(): Promise<UserInfo> {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }

  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const user = result.user;

    return {
      userId: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

/**
 * Sign out the current user
 * @returns Promise<void>
 * @throws Error if sign-out fails
 */
export async function signOutUser(): Promise<void> {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

/**
 * Convert Firebase User to UserInfo
 * @param user - Firebase User object
 * @returns UserInfo
 */
export function firebaseUserToUserInfo(user: User): UserInfo {
  return {
    userId: user.uid,
    name: user.displayName || "",
    email: user.email || "",
    isAuthenticated: true,
  };
}

/**
 * Subscribe to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
  callback: (userInfo: UserInfo | null) => void
): () => void {
  if (!auth) {
    console.warn("Firebase Auth is not initialized");
    return () => { };
  }

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(firebaseUserToUserInfo(user));
    } else {
      callback(null);
    }
  });
}

/**
 * Get the current authenticated user
 * @returns UserInfo | null
 */
export function getCurrentUser(): UserInfo | null {
  if (!auth || !auth.currentUser) {
    return null;
  }

  return firebaseUserToUserInfo(auth.currentUser);
}

