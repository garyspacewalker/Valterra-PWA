// auth.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

// must match "scheme" in app.json and your Verified screen route
const VERIFY_CONTINUE_URL = "valterra://verified";

const AuthContext = createContext({
  user: null,               // Firebase User | null
  loading: true,            // true while we check current session
  emailVerified: false,     // convenience flag
  signUp: async (email, password) => {},
  signIn: async (email, password) => {},
  signOut: async () => {},
  resendVerification: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // keep Firebase auth in sync with our context
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setUser({ ...auth.currentUser }); // trigger re-render with latest flags
    }
  };

  const signUp = async (email, password) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    // send verification email with deep link back to app
    await sendEmailVerification(newUser, { url: VERIFY_CONTINUE_URL });
    // We keep them signed in but you should gate features until verified
    await refreshUser();
    return newUser;
  };

  const signIn = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // refresh to get the latest emailVerified value
    await reload(cred.user);
    setUser({ ...cred.user });
    return cred.user;
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUser(null);
  };

  const resendVerification = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser, { url: VERIFY_CONTINUE_URL });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      emailVerified: !!user?.emailVerified,
      signUp,
      signIn,
      signOut,
      resendVerification,
      refreshUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
