import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsmLzwtaC0afeAO8NidJvJLQyHaTQdEA4",
  authDomain: "foreverwish-a0fb4.firebaseapp.com",
  projectId: "foreverwish-a0fb4",
  storageBucket: "foreverwish-a0fb4.firebasestorage.app",
  messagingSenderId: "963790983417",
  appId: "1:963790983417:web:fd5f01975e56342e435228"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;