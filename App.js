// App.js
import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AuthProvider, useAuth } from './auth';
import { palette } from './theme';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ThemeScreen from './screens/ThemeScreen';
import LinksScreen from './screens/LinksScreen';
import DesignersScreen from './screens/DesignersScreen';
import JudgesScreen from './screens/JudgesScreen';
import VerifiedScreen from './screens/VerifiedScreen';
import JudgeDetailScreen from './screens/JudgeDetailScreen';
import SettingsScreen from './screens/SettingsScreen';

// Settings (theme, large text, accent, etc.)
import { SettingsProvider, useSettings } from './context/SettingsContext';
// Offline cache provider
import { OfflineCacheProvider } from './providers/OfflineCacheProvider';

// Helper: brand color by accent
function useBrandColor() {
  const { accent } = useSettings();
  return accent === 'platafrica' ? palette.platinumNavy : palette.valterraGreen;
}

// --- Judges stack (grid -> detail) ---
const JudgesStack = createNativeStackNavigator();
function JudgesStackNavigator() {
  return (
    <JudgesStack.Navigator screenOptions={{ headerShown: false }}>
      <JudgesStack.Screen name="JudgesList" component={JudgesScreen} />
      <JudgesStack.Screen name="JudgeDetail" component={JudgeDetailScreen} />
    </JudgesStack.Navigator>
  );
}

// --- Tabs ---
const Tab = createBottomTabNavigator();
function Tabs() {
  const { effectiveScheme } = useSettings();
  const brand = useBrandColor();
  const isDark = effectiveScheme === 'dark';

  const tabInactive = isDark ? '#94a3b8' : palette.platinum;
  const tabBg = isDark ? '#111827' : '#fff';
  const tabBorder = isDark ? '#243244' : '#e5e7eb';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: brand,
        tabBarInactiveTintColor: tabInactive,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopColor: tabBorder,
        },
        tabBarLabelStyle: { fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          const map = {
            Welcome: 'home',
            Theme: 'color-palette',
            Resources: 'link',   // keep "Resources" to match your existing screen name
            Designers: 'people',
            Judges: 'ribbon',
            Settings: 'settings',
          };
          return <Ionicons name={map[route.name] || 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Welcome" component={WelcomeScreen} />
      <Tab.Screen name="Theme" component={ThemeScreen} />
      <Tab.Screen name="Resources" component={LinksScreen} />
      <Tab.Screen name="Designers" component={DesignersScreen} />
      <Tab.Screen name="Judges" component={JudgesStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// --- Root stack (Auth gate + app) ---
const Stack = createNativeStackNavigator();
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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

// --- Navigation container with dynamic light/dark theme + brand primary + deep linking ---
function RootApp() {
  const { effectiveScheme } = useSettings();
  const brand = useBrandColor();

  const baseTheme = effectiveScheme === 'dark' ? NavDarkTheme : NavLightTheme;
  // Override primary with our brand color so links/highlights match accent
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
    prefixes: ['valterra://'],
    config: {
      screens: {
        Verified: 'verified',
        Tabs: {
          screens: {
            Welcome: 'welcome',
            Theme: 'theme',
            Resources: 'resources',
            Designers: 'designers',
            Judges: 'judges',
            Settings: 'settings',
          },
        },
        Login: 'login',
        Register: 'register',
      },
    },
  };

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <StatusBar style={effectiveScheme === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

// --- App root: Settings + OfflineCache + Auth ---
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
