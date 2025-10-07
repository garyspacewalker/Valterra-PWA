// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔁 Fill these with your Firebase project values
const firebaseConfig = {
  apiKey: "AIzaSyD_Sxxw5Vcr28kycudSd2MGSyox2YdTBwk",
  authDomain: "platafrica-3e52b.firebaseapp.com",
  projectId: "platafrica-3e52b",
  appId: "1:438057800437:web:c6e9b241ed95e70319abbc"
};

export const app = initializeApp(firebaseConfig);

// Persist auth across restarts on iOS/Android
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
