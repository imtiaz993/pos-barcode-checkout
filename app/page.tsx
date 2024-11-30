"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkAuthState } from "../utils/firebaseAuth";
import POS from "./pos";

const App = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("st");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      const isLoggedIn = await checkAuthState();
      if (!isLoggedIn) {
        router.replace(`/sign-in?st=${storeId}`);
        return;
      }
      setCheckingAuth(false);
    };

    handleAuth();
  }, []);

  if (checkingAuth) {
    return null;
  }

  return <POS />;
};

export default App;
