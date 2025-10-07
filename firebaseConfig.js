// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_Sxxw5Vcr28kycudSd2MGSyox2YdTBwk",
  authDomain: "platafrica-3e52b.firebaseapp.com",
  projectId: "platafrica-3e52b",
  appId: "1:438057800437:web:c6e9b241ed95e70319abbc",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);