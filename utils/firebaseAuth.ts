// utils/firebaseAuth.ts
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../app/firebase";

const auth = getAuth(app);

export const checkAuthState = (): Promise<boolean> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true); // User is logged in
      } else {
        resolve(false); // User is not logged in
      }
    });
  });
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
