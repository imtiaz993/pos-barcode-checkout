"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuthState } from "../utils/firebaseAuth";
import POS from "./pos";

const App = () => {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      setCheckingAuth(false);
      if (!isLoggedIn) {
        router.replace("/sign-in"); // Redirect to login if not logged in
      }
    };

    handleAuth();
  }, []);

  return checkingAuth ? <></> : <POS />;
};

export default App;
