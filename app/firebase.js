// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-5qUkrJgIym7bP_Q6wnji7ow5Z_7rLF0",
  authDomain: "ecoboutique-cd84f.firebaseapp.com",
  projectId: "ecoboutique-cd84f",
  storageBucket: "ecoboutique-cd84f.firebasestorage.app",
  messagingSenderId: "287443279040",
  appId: "1:287443279040:web:07d881f304aab2e16a6125",
  measurementId: "G-2PPEGWLX01"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
