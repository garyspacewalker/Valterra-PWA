import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
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

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.valterraGreen,
        tabBarInactiveTintColor: palette.platinum,
        tabBarIcon: ({ color, size }) => {
          const map = {
            Welcome: 'home',
            Theme: 'color-palette',
            Resources: 'link',
            Designers: 'people',
            Judges: 'ribbon',
          };
          return <Ionicons name={map[route.name] || 'ellipse'} size={size} color={color} />;
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

function RootNavigator() {
  const { isSignedIn } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name="Tabs" component={Tabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
