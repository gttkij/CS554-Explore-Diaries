// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK9LwFHdt1gmVQ_WsFUTNjs71WuoA3g6A",
  authDomain: "explorediaries-71563.firebaseapp.com",
  projectId: "explorediaries-71563",
  storageBucket: "explorediaries-71563.firebasestorage.app",
  messagingSenderId: "654383201992",
  appId: "1:654383201992:web:d8a63bf1717a0a2ffb6ffd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
