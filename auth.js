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
  updateProfile, // ⬅️ add this
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { log } from "./firebaseConfig";

// 👇 HTTPS page on your Firebase Hosting (will redirect into the app)
const VERIFY_CONTINUE_URL = "https://platafrica-3e52b.web.app/verified";

const AuthContext = createContext({
  user: null,
  loading: true,
  emailVerified: false,
  // ⬇️ signUp now accepts fullName as the first arg
  signUp: async (_fullName, _email, _password) => {},
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
      // trigger re-render with latest flags/profile
      setUser({ ...auth.currentUser });
    }
  };

  /**
   * Create account, set displayName, send verification email.
   * NOTE: first parameter is fullName now.
   */
  const signUp = async (fullName, email, password) => {
    setLastError(null);
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ store the user's name on the Auth profile so it appears in the Users table
      if (fullName && fullName.trim()) {
        await updateProfile(newUser, { displayName: fullName.trim() });
      }

      // Send verification email to HTTPS page (then that page deep-links to valterra://verified)
      await sendEmailVerification(newUser, { url: VERIFY_CONTINUE_URL });

      // 🔹 Analytics: capture sign_up (works on web; no-op on Expo Go)
      log("sign_up", { method: "password" });

      // Pull the fresh profile (with displayName) into this session
      await reload(newUser);
      await refreshUser();

      return {
        ok: true,
        message: "Verification email sent. Please check your inbox.",
      };
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
        throw new Error(
          "Email not verified. We’ve sent you another verification email."
        );
      }

      setUser({ ...cred.user });

      // 🔹 Analytics: capture login after success
      log("login", { method: "password" });

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
    // 🔹 Analytics: optional logout event
    log("logout");
  };

  const resendVerification = async () => {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser, { url: VERIFY_CONTINUE_URL });
    // 🔹 optional: track resend
    log("resend_verification");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      emailVerified: !!user?.emailVerified,
      signUp,              // now expects (fullName, email, password)
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
