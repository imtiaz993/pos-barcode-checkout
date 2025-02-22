import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/app/firebase";

const auth = getAuth(app);

export const checkAuthState = (): Promise<boolean> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("Error during logout:", error);
    throw error;
  }
};
