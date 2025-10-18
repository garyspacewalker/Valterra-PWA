// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  // On native we use initializeAuth + AsyncStorage persistence.
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Web Analytics (only runs on web)
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

// ✅ Your web config (with measurementId)
const firebaseConfig = {
  apiKey: "AIzaSyD_Sxxw5Vcr28kycudSd2MGSyox2YdTBwk",
  authDomain: "platafrica-3e52b.firebaseapp.com",
  projectId: "platafrica-3e52b",
  appId: "1:438057800437:web:c6e9b241ed95e70319abbc",
  measurementId: "G-GV4WBRQK9R",
};

// --- App init (shared) ---
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// --- Auth init (platform-aware) ---
let _auth = null;
if (typeof window !== "undefined") {
  // Web (browser): use getAuth (don’t use initializeAuth + AsyncStorage here)
  _auth = getAuth(app);
} else {
  // Native (Expo Go / device): use initializeAuth with AsyncStorage
  _auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}
export const auth = _auth;

// --- Web-only Analytics ---
export let analytics = null;
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  isSupported().then((ok) => {
    if (ok) {
      analytics = getAnalytics(app);

      // DebugView flag
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag("set", "debug_mode", true);

      // Helpful console ping so we KNOW it's ready
      console.log("[Analytics] initialized", firebaseConfig.measurementId);
    } else {
      console.warn("[Analytics] not supported in this environment");
    }
  }).catch((err) => console.warn("[Analytics] init error:", err));
}

// Safe helper: no-op if analytics isn't ready
export const log = (name, params) => {
  try {
    if (analytics) logEvent(analytics, name, params);
  } catch (e) {
    // swallow
  }
};
