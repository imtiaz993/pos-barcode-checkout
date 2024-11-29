// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2H_8gfdpY-8Jqz8XRFKCdVqYGKgt6QLM",
  authDomain: "pos-barcode-checkout.firebaseapp.com",
  projectId: "pos-barcode-checkout",
  storageBucket: "pos-barcode-checkout.firebasestorage.app",
  messagingSenderId: "1083321940368",
  appId: "1:1083321940368:web:f5da6eebf90bbe6eb69b15",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
