// App.js
import React, { useEffect } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
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
import VerifiedScreen from "./screens/VerifiedScreen.js";

// Theme for navigation
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.white,
    primary: palette.valterraGreen,
    card: palette.white,
    text: palette.platinumNavy,
    border: palette.platinum,
  },
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.valterraGreen,
        tabBarInactiveTintColor: palette.platinum,
        tabBarIcon: ({ color, size }) => {
          const map = {
            Welcome: "home",
            Theme: "color-palette",
            Resources: "link",
            Designers: "people",
            Judges: "ribbon",
          };
          return <Ionicons name={map[route.name] || "ellipse"} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Welcome" component={WelcomeScreen} />
      <Tab.Screen name="Theme" component={ThemeScreen} />
      <Tab.Screen name="Resources" component={LinksScreen} />
      <Tab.Screen name="Designers" component={DesignersScreen} />
      <Tab.Screen name="Judges" component={JudgesScreen} />
    </Tab.Navigator>
  );
}

// Root stack (auth + app)
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

// App container with deep-linking
function RootApp() {
  // Deep-link config: valterra://verified -> Verified screen
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
          },
        },
        Login: "login",
        Register: "register",
      },
    },
  };

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  );
}
