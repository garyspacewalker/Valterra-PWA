// App.js
import React, { useMemo, useRef, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  useNavigationContainerRef,   // ✅ add this
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AuthProvider, useAuth } from "./auth";
import { palette } from "./theme";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import ThemeScreen from "./screens/ThemeScreen";
import LinksScreen from "./screens/LinksScreen";
import DesignersScreen from "./screens/DesignersScreen";
import JudgesScreen from "./screens/JudgesScreen";
import VerifiedScreen from "./screens/VerifiedScreen";
import JudgeDetailScreen from "./screens/JudgeDetailScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AuctionScreen from "./screens/AuctionScreen";

// Settings & providers
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import { OfflineCacheProvider } from "./providers/OfflineCacheProvider";

// 🔹 Analytics helper (safe no-ops in dev)
import { logScreen, logEvent } from "./lib/analytics";

// Brand color helper
function useBrandColor() {
  const { accent } = useSettings();
  return accent === "platafrica" ? palette.platinumNavy : palette.valterraGreen;
}

/* ─────────────────────────────
   Judges stack (grid → detail)
────────────────────────────── */
const JudgesStack = createNativeStackNavigator();
function JudgesStackNavigator() {
  return (
    <JudgesStack.Navigator screenOptions={{ headerShown: false }}>
      <JudgesStack.Screen name="JudgesList" component={JudgesScreen} />
      <JudgesStack.Screen name="JudgeDetail" component={JudgeDetailScreen} />
    </JudgesStack.Navigator>
  );
}

/* ─────────────────────────────
   Tabs
────────────────────────────── */
const Tab = createBottomTabNavigator();
function Tabs() {
  const { effectiveScheme } = useSettings();
  const brand = useBrandColor();
  const isDark = effectiveScheme === "dark";

  const tabInactive = isDark ? "#94a3b8" : palette.platinum;
  const tabBg = isDark ? "#111827" : "#fff";
  const tabBorder = isDark ? "#243244" : "#e5e7eb";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: brand,
        tabBarInactiveTintColor: tabInactive,
        tabBarStyle: { backgroundColor: tabBg, borderTopColor: tabBorder },
        tabBarLabelStyle: { fontWeight: "700" },
        tabBarIcon: ({ color, size }) => {
          const map = {
            Welcome: "home",
            Theme: "color-palette",
            Resources: "link",
            Designers: "people",
            Judges: "ribbon",
            Auction: "hammer",
            Settings: "settings",
          };
          return <Ionicons name={map[route.name] || "ellipse"} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Welcome" component={WelcomeScreen} />
      <Tab.Screen name="Theme" component={ThemeScreen} />
      <Tab.Screen name="Resources" component={LinksScreen} />
      <Tab.Screen name="Designers" component={DesignersScreen} />
      <Tab.Screen name="Judges" component={JudgesStackNavigator} />
      <Tab.Screen name="Auction" component={AuctionScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

/* ─────────────────────────────
   Root stack (auth gate)
────────────────────────────── */
const Stack = createNativeStackNavigator();
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading session…</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Verified" component={VerifiedScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

/* ─────────────────────────────
   Navigation container (+ Analytics)
────────────────────────────── */
function RootApp() {
  const { effectiveScheme } = useSettings();
  const brand = useBrandColor();

  // ✅ Use a ref to the nav container
  const navRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  // optional: log an "app_open" once
  useEffect(() => {
    logEvent("app_open", {});
  }, []);

  const baseTheme = effectiveScheme === "dark" ? NavDarkTheme : NavLightTheme;
  const navTheme = useMemo(
    () => ({
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: brand,
      },
    }),
    [baseTheme, brand]
  );

  const linking = {
    prefixes: ["valterra://"],
    config: {
      screens: {
        Verified: "verified",
        Tabs: {
          screens: {
            Welcome: "welcome",
            Theme: "theme",
            Resources: "resources",
            Designers: "designers",
            Judges: "judges",
            Auction: "auction",
            Settings: "settings",
          },
        },
        Login: "login",
        Register: "register",
      },
    },
  };

  return (
    <NavigationContainer
      ref={navRef}                // ✅ attach the ref
      theme={navTheme}
      linking={linking}
      onReady={() => {            // ✅ no params; use the ref
        const initial = navRef.getCurrentRoute()?.name;
        if (initial) {
          routeNameRef.current = initial;
          logScreen(initial, {});
        }
      }}
      onStateChange={() => {      // ✅ no params; use the ref
        const current = navRef.getCurrentRoute()?.name;
        if (current && routeNameRef.current !== current) {
          logScreen(current, {});
          routeNameRef.current = current;
        }
      }}
    >
      <StatusBar style={effectiveScheme === "dark" ? "light" : "dark"} />
      <RootNavigator />
    </NavigationContainer>
  );
}

/* ─────────────────────────────
   App root providers
────────────────────────────── */
export default function App() {
  return (
    <SettingsProvider>
      <OfflineCacheProvider>
        <AuthProvider>
          <RootApp />
        </AuthProvider>
      </OfflineCacheProvider>
    </SettingsProvider>
  );
}
