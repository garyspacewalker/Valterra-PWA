// auth.js
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

// 👇 HTTPS page on your Firebase Hosting (will redirect into the app)
const VERIFY_CONTINUE_URL = "https://platafrica-3e52b.web.app/verified";

const AuthContext = createContext({
  user: null,
  loading: true,
  emailVerified: false,
  signUp: async (_email, _password) => {},
  signIn: async (_email, _password) => {},
  signOut: async () => {},
  resendVerification: async () => {},
  refreshUser: async () => {},
  lastError: null,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
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
    setLastError(null);
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

      // Send verification email to HTTPS page (then that page deep-links to valterra://verified)
      await sendEmailVerification(newUser, { url: VERIFY_CONTINUE_URL });

      await refreshUser();
      return { ok: true, message: "Verification email sent. Please check your inbox." };
    } catch (e) {
      console.log("signUp error:", e);
      setLastError(e);
      return { ok: false, message: e?.message ?? "Sign up failed" };
    }
  };

  const signIn = async (email, password) => {
    setLastError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await reload(cred.user);

      if (!cred.user.emailVerified) {
        // Re-send and block sign-in until they verify
        await sendEmailVerification(cred.user, { url: VERIFY_CONTINUE_URL });
        await fbSignOut(auth);
        throw new Error("Email not verified. We’ve sent you another verification email.");
      }

      setUser({ ...cred.user });
      return { ok: true };
    } catch (e) {
      console.log("signIn error:", e);
      setLastError(e);
      return { ok: false, message: e?.message ?? "Sign in failed" };
    }
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
      lastError,
    }),
    [user, loading, lastError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
